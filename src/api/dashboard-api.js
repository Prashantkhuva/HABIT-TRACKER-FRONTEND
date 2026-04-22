import api from './axios';

export const getDashboardStats = () => api.get('/dashboard/getstats');
export const getWeeklyData = () => api.get('/dashboard/weeklydata');
export const getLongestStreak = (habitId) => api.get(`/dashboard/longest-streak${habitId ? `/${habitId}` : ''}`);
