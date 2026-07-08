import api from './api';

export const employeeService = {
    getAllEmployees: async (search = '', sortBy = '-joining_date') => {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (sortBy) params.append('sort_by', sortBy);
        
        const response = await api.get(`/employees/?${params.toString()}`);
        return response.data;
    },

    getEmployeeById: async (id) => {
        const response = await api.get(`/employees/${id}/`);
        return response.data;
    },

    createEmployee: async (formData) => {
        const response = await api.post('/employees/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    updateEmployee: async (id, formData) => {
        const response = await api.patch(`/employees/${id}/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    deleteEmployee: async (id) => {
        const response = await api.delete(`/employees/${id}/`);
        return response.data;
    },
};