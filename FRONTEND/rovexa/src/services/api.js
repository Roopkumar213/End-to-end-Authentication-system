// src/services/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // important for refresh cookie
  headers: {
    'Content-Type': 'application/json',
  },
});

// request helper to attach access token dynamically (pass token from AuthContext)
export const attachToken = (token) => {
  api.defaults.headers.common['Authorization'] = token ? `Bearer ${token}` : undefined;
};

// response interceptor to handle 401 by attempting refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(p => (error ? p.reject(error) : p.resolve(token)));
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    // if no response or not 401, just reject
    if (!err.response || err.response.status !== 401) {
      return Promise.reject(err);
    }

    // avoid infinite loop
    if (originalRequest._retry) return Promise.reject(err);
    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise(function (resolve, reject) {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((e) => Promise.reject(e));
    }

    isRefreshing = true;

    try {
      // call refresh endpoint (expects refresh token cookie)
      const refreshResp = await api.post('/api/auth/refresh');
      const newAccessToken = refreshResp.data.accessToken;
      // update default header
      api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
      processQueue(null, newAccessToken);
      isRefreshing = false;

      originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      isRefreshing = false;
      // optional: emit event so AuthContext can logout
      return Promise.reject(refreshError);
    }
  }
);

export default api;
