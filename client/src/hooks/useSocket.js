import { useEffect, useRef, useCallback } from 'react';
import io from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

let socket = null;

/**
 * Custom hook for Socket.io connection and event handling
 * Usage: const { socket, emit, on, off } = useSocket();
 */
export const useSocket = () => {
  const socketRef = useRef(null);
  const isConnectedRef = useRef(false);

  // Initialize socket connection
  useEffect(() => {
    if (!socket) {
      socket = io(SOCKET_URL, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });

      socket.on('connect', () => {
        console.log('🟢 Socket.io connected:', socket.id);
        isConnectedRef.current = true;
      });

      socket.on('disconnect', () => {
        console.log('🔴 Socket.io disconnected');
        isConnectedRef.current = false;
      });

      socket.on('error', (error) => {
        console.error('❌ Socket.io error:', error);
      });
    }

    socketRef.current = socket;

    return () => {
      // Don't disconnect on unmount - keep connection for other components
    };
  }, []);

  // Emit event
  const emit = useCallback((eventName, data) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(eventName, data);
    } else {
      console.warn('Socket not connected, cannot emit:', eventName);
    }
  }, []);

  // Listen for event
  const on = useCallback((eventName, callback) => {
    if (socketRef.current) {
      socketRef.current.on(eventName, callback);
    }
  }, []);

  // Stop listening for event
  const off = useCallback((eventName, callback) => {
    if (socketRef.current) {
      socketRef.current.off(eventName, callback);
    }
  }, []);

  // Register user
  const registerUser = useCallback((userId, role) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('user_register', {
        userId,
        role,
        ack: (response) => {
          console.log('✅ User registered:', response);
        },
      });
    }
  }, []);

  return {
    socket: socketRef.current,
    emit,
    on,
    off,
    registerUser,
    isConnected: isConnectedRef.current,
  };
};

export default useSocket;
