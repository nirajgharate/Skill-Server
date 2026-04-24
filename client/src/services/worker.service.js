import API from '../api/api';

const workerService = {
  // Get worker profile by ID
  getWorkerProfile: async (workerId) => {
    try {
      const response = await API.get(`/workers/${workerId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch worker profile" };
    }
  },

  // Update worker profile with all fields
  updateWorkerProfile: async (workerId, profileData) => {
    try {
      const response = await API.put(`/workers/${workerId}`, profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to update worker profile" };
    }
  },

  // Upload profile photo
  uploadProfilePhoto: async (workerId, photoBase64) => {
    try {
      const response = await API.put(`/workers/${workerId}`, {
        profilePhoto: photoBase64,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to upload profile photo" };
    }
  },

  // Upload Aadhar card
  uploadAadharCard: async (workerId, aadharBase64) => {
    try {
      const response = await API.put(`/workers/${workerId}`, {
        aadharCard: aadharBase64,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to upload Aadhar card" };
    }
  },

  // Upload PAN card
  uploadPanCard: async (workerId, panBase64) => {
    try {
      const response = await API.put(`/workers/${workerId}`, {
        panCard: panBase64,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to upload PAN card" };
    }
  },

  // Upload degree certificate
  uploadDegreeCertificate: async (workerId, degreeBase64) => {
    try {
      const response = await API.put(`/workers/${workerId}`, {
        degreeCertificate: degreeBase64,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to upload degree certificate" };
    }
  },

  // Get all workers
  getAllWorkers: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await API.get(`/workers?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch workers" };
    }
  },

  // Get worker by profession
  getWorkersByProfession: async (profession) => {
    try {
      const response = await API.get(`/workers?profession=${profession}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch workers" };
    }
  },
};

export default workerService;
