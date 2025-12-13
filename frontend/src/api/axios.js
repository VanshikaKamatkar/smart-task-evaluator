import axios from 'axios';

// Create an axios instance
const api = axios.create({
  // CHANGE THIS if your backend runs on a different port
  baseURL: 'http://localhost:5000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;