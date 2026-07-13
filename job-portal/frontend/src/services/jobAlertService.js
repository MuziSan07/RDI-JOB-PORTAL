import api from './api';

export const jobAlertService = {
    subscribe: async (payload) => (await api.post('/auth/job-alerts/subscribe/', payload)).data,
};

export default jobAlertService;
