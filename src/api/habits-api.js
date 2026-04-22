import api from './axios';

export const getHabits = () => api.get('/habits/get-habits');
export const createHabit = (data) => api.post('/habits/create-habit', data);
export const deleteHabit = (id) => api.delete(`/habits/delete-habit/${id}`);
export const updateHabit = (id, data) => api.patch(`/habits/update-habit/${id}`, data);
export const completeHabit = (id) => api.post(`/habitlog/${id}/complete`);
export const getHabitLogs = (id, page = 1, limit = 10) => api.get(`/habitlog/${id}/logs`, { params: { page, limit } });
export const getHabitStreak = (id) => api.get(`/habitlog/${id}/streak`);
export const pauseHabit = (id) => api.patch(`/habits/${id}/pause`);
export const resumeHabit = (id) => api.patch(`/habits/${id}/resume`);
export const archiveHabit = (id) => api.patch(`/habits/${id}/archive`);
