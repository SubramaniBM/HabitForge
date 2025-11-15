import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  verify: () => api.get('/auth/verify')
};

// Habits API
export const habitsAPI = {
  getAll: () => api.get('/habits'),
  create: (habitData) => api.post('/habits', habitData),
  complete: (habitId) => api.post(`/habits/${habitId}/complete`),
  update: (habitId, habitData) => api.put(`/habits/${habitId}`, habitData),
  delete: (habitId) => api.delete(`/habits/${habitId}`),
  getStats: () => api.get('/habits/stats')
};

// Squads API
export const squadsAPI = {
  getAll: (params) => api.get('/squads', { params }),
  getById: (squadId) => api.get(`/squads/${squadId}`),
  create: (squadData) => api.post('/squads', squadData),
  update: (squadId, squadData) => api.put(`/squads/${squadId}`, squadData),
  join: (squadId) => api.post(`/squads/${squadId}/join`),
  leave: (squadId) => api.post(`/squads/${squadId}/leave`),
  getLeaderboard: (squadId) => api.get(`/squads/${squadId}/leaderboard`)
};

// Users API
export const usersAPI = {
  getProfile: (userId) => api.get(`/users/profile/${userId}`),
  getMe: () => api.get('/users/me'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  search: (query) => api.get('/users/search', { params: { q: query } }),
  deleteAccount: () => api.delete('/users/account')
};

// Activities API
export const activitiesAPI = {
  getSquadFeed: (squadId, params) => api.get(`/activities/squad/${squadId}`, { params }),
  getUserFeed: (userId, params) => api.get(`/activities/user/${userId}`, { params }),
  addCheer: (activityId) => api.post(`/activities/${activityId}/cheer`)
};

export default api;
