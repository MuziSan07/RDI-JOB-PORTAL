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

    // Only treat the stored session as a job seeker. A logged-in department /
    // super admin is NOT a job seeker, so on public pages they are treated as a
    // guest (they never see job-seeker chrome, dashboard links, or "apply").
    getCurrentUser: () => {
        const raw = localStorage.getItem('user');
        if (!raw) return null;
        try {
            const user = JSON.parse(raw);
            return user && user.user_type === 'job_seeker' ? user : null;
        } catch (e) {
            return null;
        }
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token') && jobSeekerAuthService.getCurrentUser() !== null;
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