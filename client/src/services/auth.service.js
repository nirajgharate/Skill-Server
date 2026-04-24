import API from '../api/api';

const authService = {
  // Login for both User & Worker
  login: async (credentials) => {
    const response = await API.post('/auth/login', credentials);
    return response.data;
  },

  // Signup flow for regular Customers
  signupUser: async (userData) => {
    const response = await API.post('/auth/signup-user', userData);
    return response.data;
  },

  // Signup flow for Professionals
  signupWorker: async (workerData) => {
    const response = await API.post('/auth/signup-worker', workerData);
    return response.data;
  },

  // Helper to clear session
  logout: () => {
    localStorage.removeItem('skillserverToken');
    localStorage.removeItem('skillserverUser');
  }
};

export default authService;