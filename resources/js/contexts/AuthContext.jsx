import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchUser();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async () => {
        try {
            const response = await api.get('/user');
            setUser(response.data);
        } catch (error) {
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    const login = async (loginValue, password) => {
        const response = await api.post('/login', { login: loginValue, password });
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        return response.data;
    };

    const registerStudent = async (data) => {
        const response = await api.post('/student/register', data);
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        return response.data;
    };

    const registerTeacher = async (data) => {
        const response = await api.post('/teacher/register', data);
        return response.data;
    };

    const logout = async () => {
        try { await api.post('/logout'); } catch (e) {}
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, registerStudent, registerTeacher }}>
            {children}
        </AuthContext.Provider>
    );
};
