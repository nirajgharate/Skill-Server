/**
 * Socket.io Events Utility
 * Handles all Socket.io event management
 */

// Event Names (Constants)
export const SOCKET_EVENTS = {
  // Connection
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',

  // Worker Events
  WORKER_JOINED: 'worker_joined',
  WORKER_UPDATED: 'worker_updated',
  WORKER_OFFLINE: 'worker_offline',
  WORKER_ONLINE: 'worker_online',

  // Booking Events
  BOOKING_CREATED: 'booking_created',
  BOOKING_ACCEPTED: 'booking_accepted',
  BOOKING_REJECTED: 'booking_rejected',
  BOOKING_COMPLETED: 'booking_completed',
  BOOKING_CANCELLED: 'booking_cancelled',

  // User Events
  USER_ONLINE: 'user_online',
  USER_OFFLINE: 'user_offline',
  USER_PROFILE_UPDATED: 'user_profile_updated',

  // Real-time Updates
  NEW_SERVICE_REQUEST: 'new_service_request',
  AVAILABILITY_CHANGED: 'availability_changed',
  RATING_RECEIVED: 'rating_received',
  MESSAGE_SENT: 'message_sent',

  // Error Events
  ERROR: 'error',
};

// User Rooms (for targeted messaging)
export const USER_ROOMS = {
  WORKERS: 'workers_room',
  USERS: 'users_room',
  ADMINS: 'admins_room',
  GLOBAL: 'global_room',
};

/**
 * Broadcast event to specific user
 * @param {Object} io - Socket.io server instance
 * @param {string} userId - User ID to target
 * @param {string} eventName - Event name
 * @param {Object} data - Event data
 */
export const emitToUser = (io, userId, eventName, data) => {
  io.to(`user_${userId}`).emit(eventName, data);
};

/**
 * Broadcast event to all workers
 * @param {Object} io - Socket.io server instance
 * @param {string} eventName - Event name
 * @param {Object} data - Event data
 */
export const broadcastToWorkers = (io, eventName, data) => {
  io.to(USER_ROOMS.WORKERS).emit(eventName, data);
};

/**
 * Broadcast event to all users
 * @param {Object} io - Socket.io server instance
 * @param {string} eventName - Event name
 * @param {Object} data - Event data
 */
export const broadcastToUsers = (io, eventName, data) => {
  io.to(USER_ROOMS.USERS).emit(eventName, data);
};

/**
 * Broadcast event to everyone
 * @param {Object} io - Socket.io server instance
 * @param {string} eventName - Event name
 * @param {Object} data - Event data
 */
export const broadcastToAll = (io, eventName, data) => {
  io.emit(eventName, data);
};

/**
 * Send acknowledgment to requesting user
 * @param {Function} callback - Socket.io callback function
 * @param {boolean} success - Success status
 * @param {string} message - Message
 * @param {Object} data - Response data
 */
export const sendAck = (callback, success = true, message = '', data = null) => {
  if (typeof callback === 'function') {
    callback({
      success,
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  }
};

/**
 * Format worker online status event
 * @param {Object} worker - Worker object
 * @returns {Object} - Formatted event data
 */
export const formatWorkerStatusEvent = (worker) => {
  return {
    workerId: worker._id,
    name: worker.name,
    profession: worker.profession,
    availability: worker.availabilityStatus,
    location: worker.serviceArea,
    profilePhoto: worker.profilePhoto,
    rating: worker.rating,
    completionPercentage: worker.profileCompletionPercentage,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Format booking event
 * @param {Object} booking - Booking object
 * @returns {Object} - Formatted event data
 */
export const formatBookingEvent = (booking) => {
  return {
    bookingId: booking._id,
    userId: booking.userId,
    workerId: booking.workerId,
    service: booking.service,
    status: booking.status,
    scheduledAt: booking.scheduledAt,
    amount: booking.amount,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Format notification event
 * @param {string} type - Notification type
 * @param {string} message - Notification message
 * @param {Object} data - Additional data
 * @returns {Object} - Formatted notification
 */
export const formatNotification = (type, message, data = null) => {
  return {
    type,
    message,
    data,
    timestamp: new Date().toISOString(),
    read: false,
  };
};

export default {
  SOCKET_EVENTS,
  USER_ROOMS,
  emitToUser,
  broadcastToWorkers,
  broadcastToUsers,
  broadcastToAll,
  sendAck,
  formatWorkerStatusEvent,
  formatBookingEvent,
  formatNotification,
};
