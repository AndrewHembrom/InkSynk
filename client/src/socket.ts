import { io } from "socket.io-client";

const socket = io("http://localhost:3001"); // Update for AWS later

export default socket;
