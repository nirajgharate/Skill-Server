import API from "../api/api";

/**
 * USER SERVICE - All user-related API calls
 */
export const userService = {
  // Get user profile
  async getProfile() {
    try {
      const response = await API.get("/auth/profile");
      return response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },

  // Update user profile
  async updateProfile(profileData) {
    try {
      const response = await API.patch("/auth/profile", profileData);
      return response.data;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  },

  // Upload profile photo
  async uploadProfilePhoto(file) {
    try {
      const formData = new FormData();
      formData.append("profilePhoto", file);
      const response = await API.post("/auth/upload-photo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      console.error("Error uploading profile photo:", error);
      throw error;
    }
  },

  // Get user bookings
  async getUserBookings() {
    try {
      const response = await API.get("/bookings/user/me");
      return response.data;
    } catch (error) {
      console.error("Error fetching user bookings:", error);
      throw error;
    }
  },

  // Get user dashboard stats
  async getDashboardStats() {
    try {
      const response = await API.get("/bookings/user/dashboard");
      return response.data;
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw error;
    }
  },

  // Get user reviews
  async getUserReviews() {
    try {
      const response = await API.get("/users/reviews");
      return response.data;
    } catch (error) {
      console.error("Error fetching user reviews:", error);
      throw error;
    }
  },

  // Change password
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await API.post("/auth/change-password", {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      console.error("Error changing password:", error);
      throw error;
    }
  },

  // Logout
  async logout() {
    try {
      const response = await API.post("/auth/logout");
      return response.data;
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  },
};

/**
 * WORKER SERVICE - All worker-related API calls
 */
export const workerService = {
  // Get worker profile
  async getProfile(workerId) {
    try {
      const response = await API.get(`/workers/${workerId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching worker profile:", error);
      throw error;
    }
  },

  // Update worker profile
  async updateProfile(profileData) {
    try {
      const response = await API.patch("/workers/profile", profileData);
      return response.data;
    } catch (error) {
      console.error("Error updating worker profile:", error);
      throw error;
    }
  },

  // Get worker jobs/bookings
  async getJobs() {
    try {
      const response = await API.get("/workers/jobs");
      return response.data;
    } catch (error) {
      console.error("Error fetching worker jobs:", error);
      throw error;
    }
  },

  // Get worker earnings
  async getEarnings() {
    try {
      const response = await API.get("/workers/earnings");
      return response.data;
    } catch (error) {
      console.error("Error fetching worker earnings:", error);
      throw error;
    }
  },

  // Get worker services
  async getServices() {
    try {
      const response = await API.get("/workers/services");
      return response.data;
    } catch (error) {
      console.error("Error fetching worker services:", error);
      throw error;
    }
  },

  // Get worker reviews/ratings
  async getReviews() {
    try {
      const response = await API.get("/workers/reviews");
      return response.data;
    } catch (error) {
      console.error("Error fetching worker reviews:", error);
      throw error;
    }
  },

  // Update availability status
  async updateAvailability(status) {
    try {
      const response = await API.patch("/workers/availability", { status });
      return response.data;
    } catch (error) {
      console.error("Error updating availability:", error);
      throw error;
    }
  },

  // Get worker dashboard stats
  async getDashboardStats() {
    try {
      const response = await API.get("/workers/dashboard");
      return response.data;
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw error;
    }
  },
};

/**
 * BOOKING SERVICE - All booking-related API calls
 */
export const bookingService = {
  // Create booking
  async createBooking(bookingData) {
    try {
      const response = await API.post("/bookings", bookingData);
      return response.data.data;
    } catch (error) {
      console.error("Error creating booking:", error);
      throw error;
    }
  },

  // Get booking details
  async getBookingDetails(bookingId) {
    try {
      const response = await API.get(`/bookings/${bookingId}/details`);
      return response.data;
    } catch (error) {
      console.error("Error fetching booking details:", error);
      throw error;
    }
  },

  // Get worker bookings
  async getWorkerBookings() {
    try {
      const response = await API.get("/bookings/worker/me");
      return response.data?.data || [];
    } catch (error) {
      console.error("Error fetching worker bookings:", error);
      throw error;
    }
  },

  // Update booking status
  async updateBookingStatus(bookingId, status) {
    try {
      const response = await API.patch(`/bookings/${bookingId}/status`, {
        status,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating booking status:", error);
      throw error;
    }
  },

  // Accept booking (Worker)
  async acceptBooking(bookingId) {
    try {
      const response = await API.patch(`/bookings/${bookingId}/accept`);
      return response.data;
    } catch (error) {
      console.error("Error accepting booking:", error);
      throw error;
    }
  },

  // Reject booking (Worker)
  async rejectBooking(bookingId, reason) {
    try {
      const response = await API.patch(`/bookings/${bookingId}/reject`, {
        reason,
      });
      return response.data;
    } catch (error) {
      console.error("Error rejecting booking:", error);
      throw error;
    }
  },

  // Mark work as done
  async markWorkDone(bookingId, data) {
    try {
      const response = await API.patch(`/bookings/${bookingId}/mark-done`, data);
      return response.data;
    } catch (error) {
      console.error("Error marking work done:", error);
      throw error;
    }
  },

  // Cancel booking
  async cancelBooking(bookingId) {
    try {
      const response = await API.post(`/bookings/${bookingId}/cancel`);
      return response.data;
    } catch (error) {
      console.error("Error canceling booking:", error);
      throw error;
    }
  },

  // Rate booking/worker
  async rateBooking(bookingId, rating, review) {
    try {
      const response = await API.post(`/bookings/${bookingId}/rate`, {
        rating,
        review,
      });
      return response.data;
    } catch (error) {
      console.error("Error rating booking:", error);
      throw error;
    }
  },
};

export const paymentService = {
  async createOrder(payload) {
    try {
      const response = await API.post("/payments/create-order", payload);
      return response.data.data;
    } catch (error) {
      console.error("Error creating payment order:", error);
      throw error;
    }
  },

  async verifyPayment(payload) {
    try {
      const response = await API.post("/payments/verify", payload);
      return response.data.data;
    } catch (error) {
      console.error("Error verifying payment:", error);
      throw error;
    }
  },

  async getUserPayments() {
    try {
      const response = await API.get("/payments/user/payments");
      return response.data;
    } catch (error) {
      console.error("Error fetching user payments:", error);
      throw error;
    }
  },

  async getPaymentDetails(paymentId) {
    try {
      const response = await API.get(`/payments/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching payment details:", error);
      throw error;
    }
  },
};

/**
 * SERVICE LISTING SERVICE - All service-related API calls
 */
export const serviceService = {
  // Get all services
  async getAllServices(filters = {}) {
    try {
      const response = await API.get("/services", { params: filters });
      return response.data;
    } catch (error) {
      console.error("Error fetching services:", error);
      throw error;
    }
  },

  // Get service details
  async getServiceDetails(serviceId) {
    try {
      const response = await API.get(`/services/${serviceId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching service details:", error);
      throw error;
    }
  },

  // Create service
  async createService(serviceData) {
    try {
      const response = await API.post("/services", serviceData);
      return response.data;
    } catch (error) {
      console.error("Error creating service:", error);
      throw error;
    }
  },

  // Update service
  async updateService(serviceId, serviceData) {
    try {
      const response = await API.patch(`/services/${serviceId}`, serviceData);
      return response.data;
    } catch (error) {
      console.error("Error updating service:", error);
      throw error;
    }
  },

  // Delete service
  async deleteService(serviceId) {
    try {
      const response = await API.delete(`/services/${serviceId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting service:", error);
      throw error;
    }
  },

  // Get services by worker
  async getWorkerServices(workerId) {
    try {
      const response = await API.get(`/services/worker/${workerId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching worker services:", error);
      throw error;
    }
  },
};

/**
 * SEARCH SERVICE - All search-related API calls
 */
export const searchService = {
  // Search services/workers
  async search(query, type = "all") {
    try {
      const response = await API.get("/search", {
        params: { q: query, type },
      });
      return response.data;
    } catch (error) {
      console.error("Error searching:", error);
      throw error;
    }
  },

  // Get recommendations
  async getRecommendations() {
    try {
      const response = await API.get("/recommendations");
      return response.data;
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      throw error;
    }
  },
};

export default {
  userService,
  workerService,
  bookingService,
  serviceService,
  searchService,
};
