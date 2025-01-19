import api from './api';

export const getUserProfile = async (username) => {
    return await api.get(`/users/profile/${username}`);
};

export const updateUserProfile = async (username, profileData) => {
    return await api.put(`/users/profile/${username}`, profileData);
};
