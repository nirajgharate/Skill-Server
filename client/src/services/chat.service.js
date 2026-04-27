import API from "../api/api";

export const chatService = {
  async getChatThread(bookingId) {
    const response = await API.get(`/chat/${bookingId}`);
    return response.data?.data ?? response.data;
  },

  async sendMessage(bookingId, content) {
    const response = await API.post(`/chat/${bookingId}`, { content });
    return response.data?.data ?? response.data;
  },
};

export default chatService;
