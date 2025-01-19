import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUserProfile, updateUserProfile } from '../services/profileService';
import './Profile.css';

const Profile = () => {
    const { username } = useParams();
    const [profile, setProfile] = useState({
        bio: '',
        profilePicture: null, // This will now hold the base64 image string
        username: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [profilePictureUrl, setProfilePictureUrl] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await getUserProfile(username);
                setProfile(response.data);

                // If the profilePicture is in base64, set the image URL
                if (response.data.profilePicture) {
                    setProfilePictureUrl(response.data.profilePicture); // This assumes the profilePicture is a base64 image
                } else {
                    setProfilePictureUrl(null); // If no profile picture, set to null
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchUserProfile();
    }, [username]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfile({ ...profile, profilePicture: file }); // Set the file directly instead of the base64 string
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePictureUrl(reader.result); // Set the base64 string for preview
            };
            reader.readAsDataURL(file);
        }
    };
    

    const handleSave = async () => {
        const formData = new FormData();
        formData.append('bio', profile.bio); // Ensure this is correct
        if (profile.profilePicture) {
            formData.append('profilePicture', profile.profilePicture); // This should be the actual file object
        }
    
        try {
            await updateUserProfile(username, formData);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating user profile:', error);
        }
    };
    

    // Default avatar URL
    const defaultAvatar = 'https://gravatar.com/avatar/9bf6ebe10f2e4ba20b5953101d2e2020?s=400&d=robohash&r=x';

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h2>{profile.username}'s Profile</h2>
            </div>
            <div className="profile-picture-container">
                <img
                    src={profilePictureUrl || defaultAvatar}
                    alt="Profile"
                    className="profile-picture"
                    onError={(e) => { e.target.src = defaultAvatar; }}
                />
            </div>
            <div className="profile-info">
                {isEditing ? (
                    <div className="edit-profile-form">
                        <label>
                            Bio:
                            <textarea name="bio" value={profile.bio} onChange={handleInputChange} />
                        </label>
                        <label>
                            Profile Picture:
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </label>
                        <button className="save-button" onClick={handleSave}>Save</button>
                    </div>
                ) : (
                    <div className="profile-details">
                        <p className="bio-text"><strong>Bio:</strong> {profile.bio || 'No bio available.'}</p>
                        <button className="edit-button" onClick={() => setIsEditing(true)}>Edit Profile</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
