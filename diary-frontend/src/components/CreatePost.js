import React, { useState } from 'react';
import axios from 'axios';

const CreatePost = ({ refreshPosts }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [message, setMessage] = useState('');
    const [visibility, setVisibility] = useState('public');

    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user ? user.id : null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userId) {
            setMessage('User not logged in!');
            return;
        }

        try {
            await axios.post('http://localhost:8080/posts/create', {
                title,
                content,
                category,
                visibility,
                userId,
            });

            setMessage('Post created successfully!');
            setTitle('');
            setContent('');
            setCategory('');
            setVisibility('private');
            
            refreshPosts();

        } catch (error) {
            setMessage('Error creating post: ' + error.message);
        }
    };

    return (
        <div>
            <h2>Create Post</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="content">Content:</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="category">Feeling:</label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="Happy">Happy</option>
                        <option value="Sad">Sad</option>
                        <option value="Angry">Angry</option>
                        <option value="Surprised">Surprised</option>
                        <option value="Love">Love</option>
                        <option value="Fear">Fear</option>
                        <option value="Joy">Joy</option>
                        <option value="Regret">Regret</option>
                        <option value="Missing">Missing</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="visibility">Visibility:</label>
                    <select
                        id="visibility"
                        value={visibility}
                        onChange={(e) => setVisibility(e.target.value)}
                    >
                        <option value="private">Only Me</option>
                        <option value="public">Everyone</option>
                        <option value="anonymous">Anonymous</option>
                    </select>
                </div>
                <button type="submit">Post</button>
            </form>
        </div>
    );
};

export default CreatePost;
