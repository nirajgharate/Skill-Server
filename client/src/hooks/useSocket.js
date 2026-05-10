import { useEffect, useRef, useCallback, useState } from 'react';
import io from 'socket.io-client';

const rawApiUrl = import.meta.env.VITE_API_URL || 'https://synapthire.onrender.com/api';
const socketHost = rawApiUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '');
const SOCKET_URL = socketHost || 'https://synapthire.onrender.com';

let sharedSocket = null;

/**
 * Custom hook for Socket.io connection and event handling
 * Usage: const { socket, emit, on, off, registerUser } = useSocket();
 */
export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);
  const isConnectedRef = useRef(false);
  const pendingRegisterRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    if (!sharedSocket) {
      sharedSocket = io(SOCKET_URL, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });

      sharedSocket.on('connect', () => {
        console.log('🟢 Socket.io connected:', sharedSocket.id);
        isConnectedRef.current = true;
        setSocket(sharedSocket);

        if (pendingRegisterRef.current) {
          sharedSocket.emit('user_register', {
            ...pendingRegisterRef.current,
            ack: (response) => {
              console.log('✅ User registered:', response);
            },
          });
        }
      });

      sharedSocket.on('disconnect', () => {
        console.log('🔴 Socket.io disconnected');
        isConnectedRef.current = false;
      });

      sharedSocket.on('error', (error) => {
        console.error('❌ Socket.io error:', error);
      });
    }

    socketRef.current = sharedSocket;

    if (sharedSocket && !socket) {
      setSocket(sharedSocket);
    }

    return () => {
      // Keep shared socket alive across components
    };
  }, [socket]);

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
    pendingRegisterRef.current = { userId, role };

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
    socket,
    emit,
    on,
    off,
    registerUser,
    isConnected: isConnectedRef.current,
  };
};

export default useSocket;
