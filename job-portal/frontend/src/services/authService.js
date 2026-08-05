import api from './api';

export const authService = {
    // Admin Login
    adminLogin: async (email, password) => {
        const response = await api.post('/auth/admin/login/', { email, password });
        
        // Store tokens and user data
        if (response.data.access) {
            localStorage.setItem('token', response.data.access);
            localStorage.setItem('refreshToken', response.data.refresh);
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        
        return response.data;
    },

    // Admin Logout
    adminLogout: async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                await api.post('/auth/admin/logout/', { refresh_token: refreshToken });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Always clear storage
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
        }
    },

    // Get Current User
    getCurrentUser: async () => {
        const response = await api.get('/auth/current-user/');
        return response.data;
    },

    // Get Super Admin Dashboard
    getDashboardData: async () => {
        const response = await api.get('/auth/admin/dashboard/');
        return response.data;
    },

    // Get Department Dashboard
    getDepartmentDashboardData: async () => {
        const response = await api.get('/auth/department/dashboard/');
        return response.data;
    },

    // Get Activity Logs
    getActivityLogs: async (search = '', action = '') => {
        let url = '/auth/activity-logs/?';
        if (search) url += `search=${search}&`;
        if (action) url += `action=${action}&`;
        const response = await api.get(url);
        return response.data;
    },

    // Change Password
    changePassword: async (passwordData) => {
        const response = await api.post('/auth/change-password/', passwordData);
        return response.data;
    },

    // Department profile (own department account)
    getDepartmentProfile: async () => {
        const response = await api.get('/auth/department/profile/');
        return response.data;
    },
    updateDepartmentProfile: async (formData) => {
        const response = await api.patch('/auth/department/profile/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    // Get stored user data
    getStoredUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
};