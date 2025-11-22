// src/services/authService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

// Base axios instance for API calls
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // fine to keep
  headers: {
    'Content-Type': 'application/json',
  },
});

// ------------------------------------------------------
// Request interceptor: attach accessToken from localStorage
// ------------------------------------------------------
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ------------------------------------------------------
// Response interceptor: auto-refresh on 401
// ------------------------------------------------------
let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If no response or status is not 401, don't try to refresh
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    // Prevent infinite retry loops
    if (originalRequest._retry) {
      return Promise.reject(error);
    }
    originalRequest._retry = true;

    // If a refresh is already in progress, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          if (token) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return axiosInstance(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    isRefreshing = true;

    try {
      const storedRefreshToken = localStorage.getItem('refreshToken');
      if (!storedRefreshToken) {
        throw new Error('No refreshToken stored');
      }

      // Use bare axios so this interceptor is NOT applied to refresh
      const refreshResp = await axios.post(
        `${API_URL}/api/auth/refresh`,
        { refreshToken: storedRefreshToken },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      const newAccessToken = refreshResp.data.accessToken;
      if (!newAccessToken) {
        throw new Error('No accessToken in refresh response');
      }

      // Persist and set new access token
      localStorage.setItem('accessToken', newAccessToken);
      axiosInstance.defaults.headers.Authorization = `Bearer ${newAccessToken}`;

      // Resolve all queued requests with new token
      processQueue(null, newAccessToken);
      isRefreshing = false;

      // Retry the original failed request
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      // Fail all queued requests
      processQueue(refreshError, null);
      isRefreshing = false;

      // Cleanup on refresh failure
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      delete axiosInstance.defaults.headers.Authorization;

      return Promise.reject(refreshError);
    }
  }
);

// ------------------------------------------------------
// Helper to set/clear Authorization header programmatically
// ------------------------------------------------------
export const setAccessTokenHeader = (token) => {
  if (token) {
    localStorage.setItem('accessToken', token);
    axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem('accessToken');
    delete axiosInstance.defaults.headers.Authorization;
  }
};

// ------------------------------------------------------
// Core auth API
// ------------------------------------------------------
const authService = {
  // Signup
  signup: async (name, email, password) => {
    const response = await axiosInstance.post('/api/auth/signup', {
      name,
      email,
      password,
    });
    return response.data;
  },

  // Login
  login: async (email, password) => {
    const response = await axiosInstance.post('/api/auth/login', {
      email,
      password,
    });
    // { accessToken, refreshToken, tokenType, expiresIn }
    return response.data;
  },

  // Send OTP
  sendOtp: async (email, purpose = 'email_verification') => {
    const response = await axiosInstance.post('/api/auth/send-otp', {
      email,
      purpose,
    });
    return response.data;
  },

  // Verify OTP
  verifyOtp: async (email, otp, name = null) => {
    const response = await axiosInstance.post('/api/auth/verify-otp', {
      email,
      otp,
      name,
    });
    return response.data;
  },

  // Explicit refresh (normally not needed directly)
  refresh: async () => {
    const storedRefreshToken = localStorage.getItem('refreshToken');
    const response = await axiosInstance.post('/api/auth/refresh', {
      refreshToken: storedRefreshToken,
    });
    return response.data;
  },

  // Logout
  logout: async () => {
    const storedRefreshToken = localStorage.getItem('refreshToken') || null;
    const response = await axiosInstance.post('/api/auth/logout', {
      refreshToken: storedRefreshToken,
    });

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    delete axiosInstance.defaults.headers.Authorization;

    return response.data;
  },

  // Get current user
  getMe: async () => {
    const response = await axiosInstance.get('/api/auth/me');
    return response.data; // { authenticated: true, user: {...} } or 401
  },

  // OAuth - Google
  getGoogleAuthUrl: () => `${API_URL}/api/auth/oauth/google`,

  // OAuth - GitHub
  getGithubAuthUrl: () => `${API_URL}/api/auth/oauth/github`,
};

export default authService;
