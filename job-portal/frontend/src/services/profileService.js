import api from './api';

// A resume payload may include an uploaded PDF (File). If so, send it as
// multipart/form-data; otherwise send a plain JSON object (unchanged behaviour).
const hasFile = (data) => data && data.resume_file instanceof File;

const buildResumePayload = (data) => {
    if (!hasFile(data)) {
        // strip out any non-File resume_file marker so JSON stays clean
        const { resume_file, ...rest } = data || {};
        return rest;
    }
    const form = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        form.append(key, value);
    });
    return form;
};

const resumeConfig = (data) =>
    hasFile(data) ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};

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
        const res = await api.post('/auth/job-seeker/resumes/', buildResumePayload(data), resumeConfig(data));
        return res.data;
    },

    updateResume: async (id, data) => {
        const res = await api.put(`/auth/job-seeker/resumes/${id}/`, buildResumePayload(data), resumeConfig(data));
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
