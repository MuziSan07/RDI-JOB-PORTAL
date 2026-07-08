import api from './api';

export const activityService = {
    getActivityLogs: async (
        page = 1,
        pageSize = 50,
        search = '',
        userType = '',
        action = '',
        startDate = '',
        endDate = '',
        sortBy = '-timestamp'
    ) => {
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('page_size', pageSize);
        if (search) params.append('search', search);
        if (userType) params.append('user_type', userType);
        if (action) params.append('action', action);
        if (startDate) params.append('start_date', startDate);
        if (endDate) params.append('end_date', endDate);
        if (sortBy) params.append('sort_by', sortBy);
        
        const response = await api.get(`/auth/activity-logs/?${params.toString()}`);
        return response.data;
    },

    clearActivityLogs: async () => {
        const response = await api.delete('/auth/activity-logs/clear/');
        return response.data;
    },
};