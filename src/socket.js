import { io } from "socket.io-client";
import API_BASE_URL from "./config/api";

export const socket = io(API_BASE_URL, {
  transports: ["websocket"],
});

// Join user room when connected
socket.on("connect", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.id) {
    socket.emit("join-user", { userId: user.id });
  }
});