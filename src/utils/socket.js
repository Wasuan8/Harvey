import { io } from "socket.io-client";

// Replace with your backend server URL
const SOCKET_URL = "http://192.168.10.6:5000";

export const socket = io(SOCKET_URL, {
  transports: ["websocket"], 
  autoConnect: true, 
});