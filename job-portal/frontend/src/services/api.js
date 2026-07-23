import axios from 'axios';

// API base URL. In production, set REACT_APP_API_URL at build time (e.g. "/api"
// so nginx proxies it to Django on the same domain). Falls back to the local
// dev backend when the variable is not set.
export const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    // No refresh token, redirect to login based on user type
                    const user = JSON.parse(localStorage.getItem('user') || '{}');
                    if (user.user_type === 'job_seeker') {
                        window.location.href = '/login';
                    } else {
                        window.location.href = '/admin/login';
                    }
                    return Promise.reject(error);
                }

                const response = await axios.post(`${API_BASE}/auth/token/refresh/`, {
                    refresh: refreshToken,
                });

                const { access } = response.data;
                localStorage.setItem('token', access);

                originalRequest.headers.Authorization = `Bearer ${access}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed, clear storage and redirect
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                if (user.user_type === 'job_seeker') {
                    window.location.href = '/login';
                } else {
                    window.location.href = '/admin/login';
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;