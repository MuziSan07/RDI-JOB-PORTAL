import api from './api';

export const profileService = {

    // ── Profile ──────────────────────────────────────────────────────────────

    getProfile: async () => {
        const res = await api.get('/auth/job-seeker/profile/');
        return res.data;
    },

    updateProfile: async (data) => {
        const res = await api.put('/auth/job-seeker/profile/', data);
        return res.data;
    },

    uploadProfilePicture: async (file) => {
        const form = new FormData();
        form.append('profile_picture', file);
        const res = await api.post('/auth/job-seeker/upload-profile-picture/', form, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return res.data;
    },

    // ── Resumes ───────────────────────────────────────────────────────────────

    getResumes: async () => {
        const res = await api.get('/auth/job-seeker/resumes/');
        return res.data;
    },

    createResume: async (data) => {
        const res = await api.post('/auth/job-seeker/resumes/', data);
        return res.data;
    },

    updateResume: async (id, data) => {
        const res = await api.put(`/auth/job-seeker/resumes/${id}/`, data);
        return res.data;
    },

    deleteResume: async (id) => {
        const res = await api.delete(`/auth/job-seeker/resumes/${id}/`);
        return res.data;
    },

    setPrimaryResume: async (id) => {
        const res = await api.post(`/auth/job-seeker/resumes/${id}/set-primary/`);
        return res.data;
    },
};
