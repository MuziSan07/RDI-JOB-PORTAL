import api from './api';

export const jobsService = {

    // ── Admin / Department: Job CRUD ─────────────────────────────────────────

    getAllJobs: async (search = '', status = '', jobType = '', selectionType = '') => {
        let url = '/jobs/?';
        if (search)       url += `search=${search}&`;
        if (status)       url += `status=${status}&`;
        if (jobType)      url += `job_type=${jobType}&`;
        if (selectionType) url += `selection_type=${selectionType}&`;
        const response = await api.get(url);
        return response.data;
    },

    createJob: async (data) => {
        const response = await api.post('/jobs/', data);
        return response.data;
    },

    getJobById: async (id) => {
        const response = await api.get(`/jobs/${id}/`);
        return response.data;
    },

    updateJob: async (id, data) => {
        const response = await api.put(`/jobs/${id}/`, data);
        return response.data;
    },

    deleteJob: async (id) => {
        const response = await api.delete(`/jobs/${id}/`);
        return response.data;
    },

    updateJobStatus: async (id, newStatus) => {
        const response = await api.patch(`/jobs/${id}/status/`, { status: newStatus });
        return response.data;
    },

    // ── Public: Job Listings ─────────────────────────────────────────────────

    getPublicJobs: async (filters) => {
        const {
            search = '', department = '', job_type = '', selection_type = '',
            min_salary = '', max_salary = '', sort_by = '-created_at', page = 1
        } = filters || {};
        let url = `/jobs/public/?page=${page}`;
        if (search)         url += `&search=${search}`;
        if (department)     url += `&department=${department}`;
        if (job_type)       url += `&job_type=${job_type}`;
        if (selection_type) url += `&selection_type=${selection_type}`;
        if (min_salary)     url += `&salary_min=${min_salary}`;
        if (max_salary)     url += `&salary_max=${max_salary}`;
        if (sort_by)        url += `&sort_by=${sort_by}`;
        const response = await api.get(url);
        return response.data;
    },

    getPublicJobDetail: async (id) => {
        const response = await api.get(`/jobs/public/${id}/`);
        return response.data;
    },

    getStatistics: async () => {
        const response = await api.get('/jobs/statistics/');
        return response.data;
    },

    // ── Job Seeker: Applications ──────────────────────────────────────────────

    applyForJob: async (jobId, resumeId) => {
        const response = await api.post(`/applicants/apply/${jobId}/`, { resume_id: resumeId });
        return response.data;
    },

    getMyApplications: async (status = '') => {
        let url = '/applicants/my-applications/';
        if (status) url += `?status=${status}`;
        const response = await api.get(url);
        return response.data;
    },

    getMyApplicationDetail: async (id) => {
        const response = await api.get(`/applicants/my-applications/${id}/`);
        return response.data;
    },

    withdrawApplication: async (id) => {
        const response = await api.delete(`/applicants/my-applications/${id}/withdraw/`);
        return response.data;
    },
};

// Alias for backward compatibility (DepartmentJobs uses jobService)
export const jobService = jobsService;