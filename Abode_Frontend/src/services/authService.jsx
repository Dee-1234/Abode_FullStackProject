import api from './api';

export const login = async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    let token = '';
    
    if (typeof response.data === 'string') {
        token = response.data;
    } else if (response.data.token) {
        token = response.data.token;
    } else if (response.data.authenticationToken) {
        token = response.data.authenticationToken;
    }

    if (token && token !== "") {
        localStorage.setItem('authenticationToken', token);
        localStorage.setItem('username', username);
        return token;
    } else {
        console.error("Login failed. Response data:", response.data);
        throw new Error("Token was not received from the server.");
    }
};

export const logout = () => {
    localStorage.removeItem('authenticationToken');
    localStorage.removeItem('username');
    localStorage.removeItem('expiresAt');
};