import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on page load
  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  // Login Action
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password }); // Matches your route
      const { token, user } = response.data;

      // Save to local storage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setUser(user);
      return { success: true };
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message);
      return { 
        success: false, 
        message: error.response?.data?.message || "Login failed" 
      };
    }
  };

  // Signup Action
  const signup = async (name, email, password) => {
    try {
      const response = await api.post('/auth/signup', { name, email, password });
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setUser(user);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || "Signup failed" 
      };
    }
  };

  // Logout Action
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);