import api from './api';

export const applicantService = {
    // Get all applications
    getAllApplications: async (search = '', status = '', job = '', sortBy = '-applied_at') => {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (status) params.append('status', status);
        if (job)    params.append('job', job);
        if (sortBy) params.append('sort_by', sortBy);
        const response = await api.get(`/applicants/?${params.toString()}`);
        return response.data;
    },

    // Get application by ID
    getApplicationById: async (id) => {
        const response = await api.get(`/applicants/${id}/`);
        return response.data;
    },

    // Assign test to applicant
    assignTest: async (applicationId, data) => {
        const response = await api.post(`/applicants/${applicationId}/assign-test/`, data);
        return response.data;
    },

    // Schedule interview
    scheduleInterview: async (applicationId, data) => {
        const response = await api.post(`/applicants/${applicationId}/schedule-interview/`, data);
        return response.data;
    },

    // Update application status
    updateStatus: async (applicationId, status, data = {}) => {
        const response = await api.patch(`/applicants/${applicationId}/update-status/`, { status, ...data });
        return response.data;
    },

    // Hire applicant
    hireApplicant: async (applicationId, data) => {
        const response = await api.post(`/applicants/${applicationId}/hire/`, data);
        return response.data;
    },

    // Reject applicant
    rejectApplicant: async (applicationId, reason) => {
        const response = await api.post(`/applicants/${applicationId}/reject/`, { reason });
        return response.data;
    },

    // Export applications as CSV or PDF with current filters applied
    exportApplications: (format, search = '', status = '', job = '') => {
        const token = localStorage.getItem('token');
        const params = new URLSearchParams({ format });
        if (search) params.append('search', search);
        if (status) params.append('status', status);
        if (job)    params.append('job', job);
        const url = `http://localhost:8000/api/applicants/export/?${params.toString()}`;

        return fetch(url, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                if (!res.ok) throw new Error('Export failed');
                return res.blob();
            })
            .then(blob => {
                const objectUrl = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = objectUrl;
                link.download = `applicants_export.${format}`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(objectUrl);
            });
    },
};