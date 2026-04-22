import api from './axios';

export const login = (data) => api.post('/users/login', data);
export const register = (data) => api.post('/users/register', data);
export const logout = () => api.post('/users/logout');
export const refreshToken = (data) => api.post('/users/refresh-token', data);
export const changePassword = (data) => api.post('/users/change-password', data);
export const updateUserDetails = (data) => api.patch('/users/update-details', data);
