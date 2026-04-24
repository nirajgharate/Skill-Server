import {
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
} from '../utils/socketio.utils.js';

// Track connected users
const connectedUsers = new Map(); // userId -> socketId
const connectedWorkers = new Map(); // workerId -> socketId

/**
 * Initialize Socket.io connection handlers
 * @param {Object} io - Socket.io server instance
 */
export const initializeSocketIO = (io) => {
  io.on(SOCKET_EVENTS.CONNECT, (socket) => {
    console.log(`🟢 User connected: ${socket.id}`);

    // ===== AUTHENTICATION & ROOM MANAGEMENT =====
    
    /**
     * User joins their personal room & role room
     */
    socket.on('user_register', (data) => {
      const { userId, role } = data;

      // Join personal room
      socket.join(`user_${userId}`);
      connectedUsers.set(userId, socket.id);

      // Join role-specific room
      if (role === 'worker') {
        socket.join(USER_ROOMS.WORKERS);
        connectedWorkers.set(userId, socket.id);
        console.log(`👷 Worker registered: ${userId}`);
        
        // Broadcast worker online status
        broadcastToAll(io, SOCKET_EVENTS.WORKER_ONLINE, {
          workerId: userId,
          status: 'online',
          timestamp: new Date().toISOString(),
        });
      } else {
        socket.join(USER_ROOMS.USERS);
        console.log(`👤 User registered: ${userId}`);
        
        // Broadcast user online status
        broadcastToAll(io, SOCKET_EVENTS.USER_ONLINE, {
          userId: userId,
          status: 'online',
          timestamp: new Date().toISOString(),
        });
      }

      // Send acknowledgment
      sendAck(data.ack, true, 'User registered successfully', {
        userId,
        socketId: socket.id,
      });
    });

    // ===== WORKER EVENTS =====

    /**
     * Worker updates profile
     */
    socket.on(SOCKET_EVENTS.WORKER_UPDATED, (data) => {
      console.log(`✏️ Worker profile updated: ${data.workerId}`);
      
      // Broadcast to all users that worker profile changed
      broadcastToUsers(io, SOCKET_EVENTS.WORKER_UPDATED, {
        workerId: data.workerId,
        updates: data.updates,
        timestamp: new Date().toISOString(),
      });

      sendAck(data.ack, true, 'Worker profile updated successfully');
    });

    /**
     * Worker changes availability
     */
    socket.on(SOCKET_EVENTS.AVAILABILITY_CHANGED, (data) => {
      const { workerId, status } = data;
      console.log(`🔄 Worker availability changed: ${workerId} -> ${status}`);

      // Update worker status
      broadcastToAll(io, SOCKET_EVENTS.AVAILABILITY_CHANGED, {
        workerId,
        status, // online, offline, busy
        timestamp: new Date().toISOString(),
      });

      sendAck(data.ack, true, 'Availability status updated');
    });

    /**
     * Worker joins (signup)
     */
    socket.on(SOCKET_EVENTS.WORKER_JOINED, (data) => {
      const { workerId, workerData } = data;
      console.log(`🆕 New worker joined: ${workerId}`);

      broadcastToUsers(io, SOCKET_EVENTS.WORKER_JOINED, {
        workerId,
        name: workerData.name,
        profession: workerData.profession,
        serviceArea: workerData.serviceArea,
        profilePhoto: workerData.profilePhoto,
        timestamp: new Date().toISOString(),
      });

      sendAck(data.ack, true, 'Worker profile created and broadcast');
    });

    // ===== BOOKING EVENTS =====

    /**
     * New booking created
     */
    socket.on(SOCKET_EVENTS.BOOKING_CREATED, (data) => {
      const { bookingData } = data;
      console.log(`📝 New booking created: ${bookingData.bookingId}`);

      // Send to specific worker
      emitToUser(
        io,
        bookingData.workerId,
        SOCKET_EVENTS.BOOKING_CREATED,
        {
          ...bookingData,
          notification: `New booking request from ${bookingData.userName}`,
          timestamp: new Date().toISOString(),
        }
      );

      // Send to requesting user
      emitToUser(
        io,
        bookingData.userId,
        'booking_sent_confirmation',
        {
          bookingId: bookingData.bookingId,
          message: 'Booking request sent to worker',
        }
      );

      sendAck(data.ack, true, 'Booking created successfully');
    });

    /**
     * Booking accepted by worker
     */
    socket.on(SOCKET_EVENTS.BOOKING_ACCEPTED, (data) => {
      const { bookingId, workerId, userId } = data;
      console.log(`✅ Booking accepted: ${bookingId}`);

      // Send to customer
      emitToUser(io, userId, SOCKET_EVENTS.BOOKING_ACCEPTED, {
        bookingId,
        workerId,
        message: 'Booking accepted',
        timestamp: new Date().toISOString(),
      });

      // Send to worker confirmation
      emitToUser(io, workerId, 'booking_accepted_confirmation', {
        bookingId,
        message: 'Booking accepted successfully',
      });

      sendAck(data.ack, true, 'Booking accepted');
    });

    /**
     * Booking rejected by worker
     */
    socket.on(SOCKET_EVENTS.BOOKING_REJECTED, (data) => {
      const { bookingId, userId, reason } = data;
      console.log(`❌ Booking rejected: ${bookingId}`);

      emitToUser(io, userId, SOCKET_EVENTS.BOOKING_REJECTED, {
        bookingId,
        reason,
        message: 'Booking was rejected',
        timestamp: new Date().toISOString(),
      });

      sendAck(data.ack, true, 'Booking rejected');
    });

    /**
     * Booking completed
     */
    socket.on(SOCKET_EVENTS.BOOKING_COMPLETED, (data) => {
      const { bookingId, userId, workerId } = data;
      console.log(`🎉 Booking completed: ${bookingId}`);

      // Notify both parties
      emitToUser(io, userId, SOCKET_EVENTS.BOOKING_COMPLETED, {
        bookingId,
        message: 'Service completed',
        timestamp: new Date().toISOString(),
      });

      emitToUser(io, workerId, 'booking_completion_notification', {
        bookingId,
        message: 'Service marked as completed',
      });

      sendAck(data.ack, true, 'Booking completed');
    });

    /**
     * Booking cancelled
     */
    socket.on(SOCKET_EVENTS.BOOKING_CANCELLED, (data) => {
      const { bookingId, userId, workerId, reason } = data;
      console.log(`🚫 Booking cancelled: ${bookingId}`);

      emitToUser(io, workerId, SOCKET_EVENTS.BOOKING_CANCELLED, {
        bookingId,
        reason,
        message: 'Booking was cancelled',
        timestamp: new Date().toISOString(),
      });

      emitToUser(io, userId, 'booking_cancellation_confirmation', {
        bookingId,
        message: 'Booking cancelled successfully',
      });

      sendAck(data.ack, true, 'Booking cancelled');
    });

    // ===== RATING & REVIEW =====

    /**
     * Rating submitted
     */
    socket.on(SOCKET_EVENTS.RATING_RECEIVED, (data) => {
      const { workerId, rating, review, bookingId } = data;
      console.log(`⭐ Rating received for worker: ${workerId}`);

      emitToUser(io, workerId, SOCKET_EVENTS.RATING_RECEIVED, {
        rating,
        review,
        bookingId,
        message: `You received a ${rating}-star rating`,
        timestamp: new Date().toISOString(),
      });

      sendAck(data.ack, true, 'Rating submitted successfully');
    });

    // ===== MESSAGING =====

    /**
     * Message sent
     */
    socket.on(SOCKET_EVENTS.MESSAGE_SENT, (data) => {
      const { senderId, recipientId, message, bookingId } = data;
      console.log(`💬 Message from ${senderId} to ${recipientId}`);

      emitToUser(io, recipientId, SOCKET_EVENTS.MESSAGE_SENT, {
        senderId,
        message,
        bookingId,
        timestamp: new Date().toISOString(),
      });

      sendAck(data.ack, true, 'Message sent');
    });

    // ===== ERROR HANDLING =====

    socket.on(SOCKET_EVENTS.ERROR, (error) => {
      console.error(`❌ Socket error: ${error}`);
    });

    // ===== DISCONNECT =====

    socket.on(SOCKET_EVENTS.DISCONNECT, (reason) => {
      console.log(`🔴 User disconnected: ${socket.id} - Reason: ${reason}`);

      // Find and remove user from tracking
      for (let [userId, socketId] of connectedUsers.entries()) {
        if (socketId === socket.id) {
          connectedUsers.delete(userId);
          console.log(`👤 User offline: ${userId}`);
          
          broadcastToAll(io, SOCKET_EVENTS.USER_OFFLINE, {
            userId,
            timestamp: new Date().toISOString(),
          });
          break;
        }
      }

      // Find and remove worker from tracking
      for (let [workerId, socketId] of connectedWorkers.entries()) {
        if (socketId === socket.id) {
          connectedWorkers.delete(workerId);
          console.log(`👷 Worker offline: ${workerId}`);
          
          broadcastToAll(io, SOCKET_EVENTS.WORKER_OFFLINE, {
            workerId,
            timestamp: new Date().toISOString(),
          });
          break;
        }
      }
    });

    // ===== PING PONG (Keep-alive) =====
    socket.on('ping', (data, callback) => {
      callback({ pong: true, timestamp: new Date().toISOString() });
    });
  });
};

/**
 * Get connected users count
 * @returns {Object} - Count statistics
 */
export const getConnectionStats = () => {
  return {
    totalConnectedUsers: connectedUsers.size,
    totalConnectedWorkers: connectedWorkers.size,
    totalConnected: connectedUsers.size + connectedWorkers.size,
    users: Array.from(connectedUsers.keys()),
    workers: Array.from(connectedWorkers.keys()),
  };
};

export default {
  initializeSocketIO,
  getConnectionStats,
};
