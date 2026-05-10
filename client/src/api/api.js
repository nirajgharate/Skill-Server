import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL || 'https://synapthire.onrender.com/api';
const normalizedApiUrl = rawApiUrl.replace(/\/+$/, '');
const baseUrl = normalizedApiUrl.endsWith('/api')
  ? normalizedApiUrl
  : `${normalizedApiUrl}/api`;

const API = axios.create({
  baseURL: baseUrl,
});

// Request: Attach Token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('skillserverToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response: Handle Global 401s
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;