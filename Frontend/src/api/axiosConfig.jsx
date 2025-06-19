import axios from 'axios';

const API = axios.create({
  baseURL: '/api', // Your backend API base URL
});

// Add a request interceptor to include the token
API.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;