import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUser } from '../data/mockData';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate checking local storage or session
        const storedUser = localStorage.getItem('globeTrotterUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (email, password) => {
        // Mock login
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email && password) {
                    setUser(mockUser);
                    localStorage.setItem('globeTrotterUser', JSON.stringify(mockUser));
                    resolve(mockUser);
                } else {
                    reject(new Error('Invalid credentials'));
                }
            }, 500);
        });
    };

    const signup = (email, password, name) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newUser = { ...mockUser, email, name };
                setUser(newUser);
                localStorage.setItem('globeTrotterUser', JSON.stringify(newUser));
                resolve(newUser);
            }, 500);
        });
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('globeTrotterUser');
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
