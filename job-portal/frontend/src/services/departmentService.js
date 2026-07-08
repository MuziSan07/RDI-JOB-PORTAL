import api from './api';

export const departmentService = {
    getAllDepartments: async (search = '', sortBy = '-created_at') => {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (sortBy) params.append('sort_by', sortBy);
        
        const response = await api.get(`/departments/?${params.toString()}`);
        return response.data;
    },

    getDepartmentById: async (id) => {
        const response = await api.get(`/departments/${id}/`);
        return response.data;
    },

    createDepartment: async (formData) => {
        const response = await api.post('/departments/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    updateDepartment: async (id, formData) => {
        const response = await api.put(`/departments/${id}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    deleteDepartment: async (id) => {
        const response = await api.delete(`/departments/${id}/`);
        return response.data;
    },
};