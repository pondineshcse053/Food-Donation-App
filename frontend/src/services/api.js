import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor for 401 handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      // Only clear if on protected pages
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
};

export const donationService = {
  create: (data) => api.post('/donations', data),
  getAll: (params) => api.get('/donations', { params }),
  getById: (id) => api.get(`/donations/${id}`),
  getByCode: (code) => api.get(`/donations/by-code/${code}`),
  getRecommendedNgos: (id) => api.get(`/donations/${id}/recommended-ngos`),
  updateStatus: (id, data) => api.put(`/donations/${id}/status`, data),
};

export const ngoService = {
  getAll: (params) => api.get('/ngos', { params }),
  getById: (id) => api.get(`/ngos/${id}`),
  create: (data) => api.post('/ngos', data),
  update: (id, data) => api.put(`/ngos/${id}`, data),
  delete: (id) => api.delete(`/ngos/${id}`),
};

export const volunteerService = {
  getAll: (params) => api.get('/volunteers', { params }),
  getById: (id) => api.get(`/volunteers/${id}`),
  assign: (data) => api.post('/volunteers/assign', data),
  update: (id, data) => api.put(`/volunteers/${id}`, data),
};

export const trackingService = {
  getSteps: (donationId) => api.get(`/tracking/${donationId}`),
  updateStatus: (donationId, data) => api.put(`/tracking/${donationId}`, data),
  getMapData: (donationId) => api.get(`/tracking/${donationId}/map-data`),
};

export const notificationService = {
  getAll: () => api.get('/notifications'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
};

export const adminService = {
  getStatistics: () => api.get('/admin/statistics'),
  getGovernmentDashboard: () => api.get('/admin/government-dashboard'),
  getUsers: (params) => api.get('/users', { params }),
  toggleUserStatus: (id) => api.put(`/users/${id}/status`),
};

export default api;
