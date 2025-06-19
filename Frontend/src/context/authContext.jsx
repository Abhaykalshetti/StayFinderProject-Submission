import React, { createContext, useState, useEffect, useContext } from 'react';
import { login, register, getProfile } from '../api/auth';
import { jwtDecode } from 'jwt-decode'; // Correct import for jwt-decode

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // Basic check if token is expired (optional, but good practice)
      try {
        const decodedToken = jwtDecode(parsedUser.token);
        if (decodedToken.exp * 1000 < Date.now()) {
          console.log('Token expired, logging out');
          localStorage.removeItem('user');
          setUser(null);
        } else {
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('user');
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email, password) => {
    try {
      const userData = await login({ email, password });
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Login failed:', error);
      throw error; // Re-throw to be caught by UI
    }
  };

  const signUp = async (username, email, password, role) => {
    try {
      const userData = await register({ username, email, password, role });
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const signOut = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const checkUserRole = (allowedRoles) => {
    if (!user || !user.role) {
      return false;
    }
    return allowedRoles.includes(user.role);
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    checkUserRole,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);