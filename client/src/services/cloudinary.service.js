import API from "../api/api";

/**
 * Frontend Cloudinary service helpers.
 *
 * This file is a client-side API wrapper for uploading profile photos
 * and worker documents that rely on backend Cloudinary integration.
 * The actual Cloudinary upload logic runs on the server in
 * server/services/cloudinary.service.js.
 *
 * Use this helper from profile or dashboard pages that need to save
 * a new avatar / document to the authenticated worker profile.
 */

export const cloudinaryService = {
  async uploadWorkerProfilePhoto(photoBase64) {
    try {
      const response = await API.patch("/workers/profile", {
        profilePhoto: photoBase64,
      });
      return response.data?.worker ?? response.data;
    } catch (error) {
      console.error("Error uploading worker profile photo:", error);
      throw error;
    }
  },

  async uploadWorkerDocument(fieldName, fileBase64) {
    try {
      const response = await API.patch("/workers/profile", {
        [fieldName]: fileBase64,
      });
      return response.data?.worker ?? response.data;
    } catch (error) {
      console.error(`Error uploading worker document ${fieldName}:`, error);
      throw error;
    }
  },
};
