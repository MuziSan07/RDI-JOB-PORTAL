import api from './api';

// Works for every role (job seeker, department, super admin) — the backend
// scopes results to the authenticated user automatically.
export const notificationService = {
    list: async (params = {}) => {
        const res = await api.get('/auth/notifications/', { params });
        return res.data; // { results: [...], unread_count }
    },

    unreadCount: async () => {
        const res = await api.get('/auth/notifications/unread-count/');
        return res.data.unread_count;
    },

    markRead: async (id) => {
        const res = await api.post(`/auth/notifications/${id}/read/`);
        return res.data;
    },

    markAllRead: async () => {
        const res = await api.post('/auth/notifications/mark-all-read/');
        return res.data;
    },

    clear: async () => {
        const res = await api.delete('/auth/notifications/clear/');
        return res.data;
    },
};

export default notificationService;
