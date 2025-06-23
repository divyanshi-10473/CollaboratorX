// socket.js
import { io } from 'socket.io-client';

let socketInstance = null;

export const initializeSocket = (projectId) => {
  if (!projectId) {
    console.error('Project ID is required to initialize socket.');
    return null;
  }


const token = JSON.parse(sessionStorage.getItem("token")); // or localStorage

if (!socketInstance) {
  socketInstance = io(import.meta.env.VITE_SOCKET_URL, {
    query: { projectId },
    transports: ['websocket'],
    auth: {
      token: token, 
    },
  });



    socketInstance.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });
  }

  return socketInstance;
};

export const getSocket = () => socketInstance;

export const recieveMessage = (eventName, cb) => {
  if (!socketInstance) return console.warn('Socket not initialized');
  socketInstance.on(eventName, cb);
};

export const sendMessage = (eventName, data) => {
  if (!socketInstance) {
    console.error('Socket not initialized');
    return;
  }
  socketInstance.emit(eventName, data);
};
