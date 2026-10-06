import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const res = await authService.getMe();
          setUser(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
        } catch (err) {
          console.error("Token verification failed:", err);
          logout();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    const { access_token, user: loggedUser } = res.data;
    localStorage.setItem('token', access_token);
    localStorage.setItem('user', JSON.stringify(loggedUser));
    setToken(access_token);
    setUser(loggedUser);
    return loggedUser;
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    const { access_token, user: registeredUser } = res.data;
    localStorage.setItem('token', access_token);
    localStorage.setItem('user', JSON.stringify(registeredUser));
    setToken(access_token);
    setUser(registeredUser);
    return registeredUser;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const loginAsDemo = async (role) => {
    const credentials = {
      DONOR: { email: 'donor@example.com', password: 'password123' },
      NGO: { email: 'ngo@example.com', password: 'password123' },
      VOLUNTEER: { email: 'volunteer@example.com', password: 'password123' },
      ADMIN: { email: 'admin@example.com', password: 'admin123' },
    };

    const cred = credentials[role.toUpperCase()];
    if (cred) {
      return await login(cred.email, cred.password);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, loginAsDemo }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
