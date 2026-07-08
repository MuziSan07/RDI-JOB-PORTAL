import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (token) {
            try {
                // If we have stored user data, use it immediately
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
                
                // Then fetch fresh user data from API
                const userData = await authService.getCurrentUser();
                
                // Build complete user object with profile picture
                const completeUser = {
                    ...userData,
                    profile_picture: userData.profile_picture_url || userData.profile_picture
                };
                
                setUser(completeUser);
                localStorage.setItem('user', JSON.stringify(completeUser));
            } catch (error) {
                console.error('Auth check failed:', error);
                localStorage.clear();
                setUser(null);
            }
        }
        setLoading(false);
    };

    const login = async (email, password) => {
        const data = await authService.adminLogin(email, password);
        localStorage.setItem('token', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        localStorage.setItem('userType', data.user_type);
        
        // For department users, use department logo as fallback
        let profilePicture = data.profile_picture;
        if (!profilePicture && data.department_logo) {
            profilePicture = data.department_logo;
        }
        
        const userData = {
            id: data.user_id,
            username: data.username,
            email: data.email,
            user_type: data.user_type,
            department_id: data.department_id,
            department_name: data.department_name,
            profile_picture: profilePicture,
            department_logo: data.department_logo,
            first_name: data.first_name,
            last_name: data.last_name,
        };
        
        console.log('Login - Setting user data:', userData);
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        
        return data;
    };

    const logout = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                await authService.adminLogout(refreshToken);
            }
        } catch (error) {
            console.log('Logout API call failed, clearing local storage anyway');
        } finally {
            localStorage.clear();
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};