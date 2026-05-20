import api from './api';

export const createPost = async (postData) => {
    const response = await api.post('/posts', postData);
    return response.data;
};