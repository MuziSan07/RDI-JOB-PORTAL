import api from './api';

export const savedJobsService = {
    // Returns an array of saved job objects (via JobSerializer)
    list: async () => (await api.get('/applicants/saved-jobs/')).data,

    // Toggles the saved state for a job. Returns { saved: boolean }.
    toggle: async (jobId) => (await api.post(`/applicants/saved-jobs/toggle/${jobId}/`)).data,
};

export default savedJobsService;
