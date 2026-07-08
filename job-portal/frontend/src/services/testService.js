import api from './api';

export const testService = {
    // ── Admin: Chapters ───────────────────────────────────────────────────────
    getAllChapters: async (search = '', department = '', sortBy = '-created_at') => {
        const params = new URLSearchParams();
        if (search)     params.append('search', search);
        if (department) params.append('department', department);
        if (sortBy)     params.append('sort_by', sortBy);
        const response = await api.get(`/tests/chapters/?${params.toString()}`);
        return response.data;
    },

    getChapterById: async (id) => {
        const response = await api.get(`/tests/chapters/${id}/`);
        return response.data;
    },

    createChapter: async (formData) => {
        const response = await api.post('/tests/chapters/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    updateChapter: async (id, formData) => {
        const response = await api.put(`/tests/chapters/${id}/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    deleteChapter: async (id) => {
        const response = await api.delete(`/tests/chapters/${id}/`);
        return response.data;
    },

    // ── Admin: Questions ──────────────────────────────────────────────────────
    getAllQuestions: async (chapter = '', search = '', sortBy = '-created_at') => {
        const params = new URLSearchParams();
        if (chapter) params.append('chapter', chapter);
        if (search)  params.append('search', search);
        if (sortBy)  params.append('sort_by', sortBy);
        const response = await api.get(`/tests/questions/?${params.toString()}`);
        return response.data;
    },

    getQuestionById: async (id) => {
        const response = await api.get(`/tests/questions/${id}/`);
        return response.data;
    },

    createQuestion: async (data) => {
        const response = await api.post('/tests/questions/', data);
        return response.data;
    },

    updateQuestion: async (id, data) => {
        const response = await api.put(`/tests/questions/${id}/`, data);
        return response.data;
    },

    deleteQuestion: async (id) => {
        const response = await api.delete(`/tests/questions/${id}/`);
        return response.data;
    },

    // ── Job Seeker: Take Test ─────────────────────────────────────────────────
    getTestQuestions: async (applicationId) => {
        const response = await api.get(`/tests/application/${applicationId}/questions/`);
        return response.data;
    },

    submitTest: async (applicationId, answers) => {
        const response = await api.post(`/tests/application/${applicationId}/submit/`, { answers });
        return response.data;
    },

    getTestResults: async (applicationId) => {
        const response = await api.get(`/tests/application/${applicationId}/results/`);
        return response.data;
    },
};