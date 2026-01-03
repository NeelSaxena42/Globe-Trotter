import React, { createContext, useContext, useState, useEffect } from 'react';
import authApi from '../api/authApi';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const storedUser = localStorage.getItem('globeTrotterUser');
            const storedToken = localStorage.getItem('globeTrotterToken');
            if (storedUser && storedToken) {
                setUser(JSON.parse(storedUser));
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const data = await authApi.login(email, password);
            setUser(data.user);
            localStorage.setItem('globeTrotterUser', JSON.stringify(data.user));
            localStorage.setItem('globeTrotterToken', data.token);
            return data.user;
        } catch (error) {
            throw error.response?.data?.message || 'Login failed';
        }
    };

    const signup = async (email, password, username) => {
        try {
            const data = await authApi.register(username, email, password);
            // Automatically log in after register
            return login(email, password);
        } catch (error) {
            throw error.response?.data?.message || 'Registration failed';
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('globeTrotterUser');
        localStorage.removeItem('globeTrotterToken');
    };

    const updateUser = (updates) => {
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        localStorage.setItem('globeTrotterUser', JSON.stringify(updatedUser));
        return updatedUser;
    };

    const value = {
        user,
        login,
        signup,
        logout,
        updateUser,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
