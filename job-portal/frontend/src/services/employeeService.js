import api, { API_BASE } from './api';

export const employeeService = {
    // Download the employee list as CSV (respects the current search/department filter).
    exportEmployees: (search = '', department = '') => {
        const token = localStorage.getItem('token');
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (department) params.append('department', department);
        const url = `${API_BASE}/employees/export/?${params.toString()}`;
        return fetch(url, { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => { if (!res.ok) throw new Error('Export failed'); return res.blob(); })
            .then((blob) => {
                const objectUrl = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = objectUrl;
                link.download = 'employees_export.csv';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(objectUrl);
            });
    },

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