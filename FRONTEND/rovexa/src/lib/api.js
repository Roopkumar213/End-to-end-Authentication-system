// src/lib/api.js (new file)
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  withCredentials: true, // set true if backend uses cookies; change to false if not
});

export default api;
