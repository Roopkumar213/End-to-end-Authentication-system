import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('studio_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('studio_token');
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export const validateResponse = (response, expectedShape) => {
  if (!response || typeof response !== 'object') {
    throw new Error('Invalid response: not an object');
  }
  
  if (expectedShape.success !== undefined && response.success !== expectedShape.success) {
    throw new Error(`Invalid response: expected success=${expectedShape.success}`);
  }
  
  if (expectedShape.data && !response.data) {
    throw new Error('Invalid response: missing data field');
  }
  
  return response;
};

export default apiClient;