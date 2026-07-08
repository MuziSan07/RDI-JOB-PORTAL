import api from './api';

export const jobSeekerAuthService = {
    register: async (userData) => {
        const response = await api.post('/auth/job-seeker/register/', userData);
        if (response.data.access) {
            localStorage.setItem('token', response.data.access);
            localStorage.setItem('refreshToken', response.data.refresh);
            localStorage.setItem('user', JSON.stringify({
                ...response.data,
                user_type: 'job_seeker'
            }));
        }
        return response.data;
    },

    login: async (email, password) => {
        const response = await api.post('/auth/job-seeker/login/', { email, password });
        if (response.data.access) {
            localStorage.setItem('token', response.data.access);
            localStorage.setItem('refreshToken', response.data.refresh);
            localStorage.setItem('user', JSON.stringify({
                ...response.data,
                user_type: 'job_seeker'
            }));
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    getProfile: async () => {
        const response = await api.get('/auth/job-seeker/profile/');
        return response.data;
    },

    updateProfile: async (profileData) => {
        const response = await api.put('/auth/job-seeker/profile/', profileData);
        return response.data;
    },

    changePassword: async (passwordData) => {
        const response = await api.post('/auth/job-seeker/change-password/', passwordData);
        return response.data;
    },

    getDashboard: async () => {
        const response = await api.get('/auth/job-seeker/dashboard/');
        return response.data;
    },
};