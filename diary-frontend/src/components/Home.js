import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './Home.css';
import moment from 'moment';
import CreatePost from './CreatePost';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState({});
    const [newComment, setNewComment] = useState({});
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [users, setUsers] = useState({});
    const [reactions, setReactions] = useState({}); // State for reactions
    const [showReactions, setShowReactions] = useState({}); // State to track which post is showing reactions

    const user = JSON.parse(localStorage.getItem('user'));
    const username = user ? user.username : '';
    const userId = user ? user.id : '';

    useEffect(() => {
        fetchPosts();
        const loginState = localStorage.getItem('isLoggedIn');
        setIsLoggedIn(loginState === 'true');
    }, []);

    // Fetch all posts and user data
    const fetchPosts = async () => {
        try {
            const response = await api.get('/posts/all');
            const sortedPosts = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            // Filter posts based on visibility
            const visiblePosts = sortedPosts.filter(post => post.visibility === 'public' || post.visibility === 'anonymous');

            setPosts(visiblePosts);

            await Promise.all(visiblePosts.map(post => {
                fetchComments(post.id); // Fetch comments for each post
                return fetchUser(post.userId); // Fetch user details using the userId from the post
            }));
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    // Fetch comments for a specific post
    const fetchComments = async (postId) => {
        try {
            const response = await api.get(`/comments/post/${postId}`);
            const sortedComments = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setComments(prevComments => ({
                ...prevComments,
                [postId]: sortedComments
            }));
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    // Fetch user details
    const fetchUser = async (postUserId) => {
        if (!users[postUserId]) {  // Check if user data is already fetched
            try {
                const response = await api.get(`/users/profil/${postUserId}`);
                setUsers(prevUsers => ({
                    ...prevUsers,
                    [postUserId]: response.data
                }));
            } catch (error) {
                console.error(`Error fetching user with ID ${postUserId}:`, error);
            }
        }
    };

    // Handle creating a new comment
    const handleCreateComment = async (postId, e) => {
        e.preventDefault();
        try {
            const commentData = { 
                postId, 
                commentText: newComment[postId] || '' 
            };
            await api.post('/comments', commentData);
            setNewComment(prev => ({ ...prev, [postId]: '' }));
            fetchComments(postId);
        } catch (error) {
            console.error('Error creating comment:', error);
        }
    };

    // Handle adding a reaction
    const handleAddReaction = (postId, reaction) => {
        setReactions(prevReactions => {
            const updatedReactions = { ...prevReactions };
            updatedReactions[postId] = updatedReactions[postId] || {};
            updatedReactions[postId][reaction] = (updatedReactions[postId][reaction] || 0) + 1;
            return updatedReactions;
        });
        setShowReactions(prev => ({ ...prev, [postId]: false })); // Close dropdown after selection
    };

    // Format time ago
    const formatTimeAgo = (createdAt) => {
        return moment(createdAt).fromNow();
    };

    // Get feeling text from category
    const getFeelingText = (category) => {
        return `feeling ${category.toLowerCase()}`;
    };

    // Handle user logout
    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username'); 
        setIsLoggedIn(false);
        setDropdownOpen(false);
    };

    // Default avatar URL
    const getDefaultAvatar = () => {
        return 'https://avatar.iran.liara.run/public'; // Placeholder for default avatar
    };

    // Available reactions
    const reactionTypes = ["Love", "Like", "Sad", "Happy", "Wow"];

    return (
        <div className="home-container">
            <header className="header">
                <h1>Diary App</h1>
                <nav>
                    <Link to="/">Home</Link>
                    {isLoggedIn ? (
                        <div 
                            className="profile-dropdown"
                            onMouseEnter={() => setDropdownOpen(true)}
                            onMouseLeave={() => setDropdownOpen(false)}
                        >
                            <button className="profile-button">Profile</button>
                            {dropdownOpen && (
                                <div className="dropdown-menu">
                                    <Link to={`/profile/${username}`} onClick={() => setDropdownOpen(false)}>My Profile</Link>
                                    <Link to={`/profile/${userId}/posts-history`}>View My Posts by Day</Link>
                                    <button onClick={handleLogout}>Logout</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login">Login</Link>
                    )}
                </nav>
            </header>

            {/* Reuse CreatePost component */}
            <div className="post-create-box">
                <CreatePost refreshPosts={fetchPosts} />
            </div>

            <h1>All Posts</h1>
            <ul className="post-list">
                {posts.length > 0 ? (
                    posts.map(post => (
                        <li key={post.id} className="post-item">
                            <div className="post-header">
                                <img
                                    src={post.visibility === 'anonymous' ? getDefaultAvatar() : users[post.userId]?.profilePicture ? `data:image/png;base64,${users[post.userId].profilePicture}` : getDefaultAvatar()}
                                    alt="Profile"
                                    className="profile-pic"
                                />
                                <span className="username">{post.visibility === 'anonymous' ? 'Anonymous User' : users[post.userId]?.username || 'Unknown User'}</span>
                            </div>
                            <div className="post-content">
                                <p>{post.content}</p>
                                <div className="post-meta">
                                    <span className="post-feeling">{getFeelingText(post.category)}</span>
                                    <span className="post-time">{formatTimeAgo(post.createdAt)}</span>
                                </div>
                            </div>

                            {/* Reaction Section */}
                            <div className="reaction-section">
                                <div 
                                    className="reaction-button" 
                                    onMouseEnter={() => setShowReactions(prev => ({ ...prev, [post.id]: true }))}
                                    onMouseLeave={() => setShowReactions(prev => ({ ...prev, [post.id]: false }))}
                                >
                                    React
                                    {showReactions[post.id] && (
                                        <div className="reaction-dropdown">
                                            {reactionTypes.map(reaction => (
                                                <div 
                                                    key={reaction} 
                                                    className="reaction-option" 
                                                    onClick={() => handleAddReaction(post.id, reaction)}
                                                >
                                                    {reaction} {reactions[post.id]?.[reaction] || 0}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Comment Section */}
                            <div className="comment-section">
                                <h4>Comments:</h4>
                                {comments[post.id] && comments[post.id].length > 0 ? (
                                    comments[post.id].map(comment => (
                                        <div key={comment.id} className="comment">
                                            <p>{comment.commentText}</p>
                                            <span className="comment-time">{formatTimeAgo(comment.createdAt)}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p>No comments yet.</p>
                                )}

                                <form className="comment-input" onSubmit={(e) => handleCreateComment(post.id, e)}>
                                    <textarea
                                        placeholder="Add a comment..."
                                        value={newComment[post.id] || ''}
                                        onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                                        required
                                    />
                                    <button type="submit">Comment</button>
                                </form>
                            </div>
                        </li>
                    ))
                ) : (
                    <p>No posts available.</p>
                )}
            </ul>
        </div>
    );
};

export default Home;
