import { Server } from "socket.io";

let connections = {};
let messages = {};
let timeOnline = {};

export const connectToSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["*"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("join-call", (roomId) => {
      if (!connections[roomId]) connections[roomId] = [];
      connections[roomId].push(socket.id);
      timeOnline[socket.id] = new Date();

      // Notify all users (including sender)
      for (let id of connections[roomId]) {
        io.to(id).emit("user-joined", socket.id, connections[roomId]);
      }

      // Send existing chat to just the newly joined user
      if (messages[roomId]) {
        messages[roomId].forEach((msg) => {
          io.to(socket.id).emit(
            "chat-message",
            msg.data,
            msg.sender,
            msg.socketIdSender
          );
        });
      }
    });

    socket.on("signal", (toId, message) => {
      io.to(toId).emit("signal", socket.id, message);
    });

    socket.on("chat-message", (data, sender) => {
      let roomId = Object.keys(connections).find((room) =>
        connections[room].includes(socket.id)
      );
      if (!roomId) return;

      if (!messages[roomId]) messages[roomId] = [];
      messages[roomId].push({ data, sender, socketIdSender: socket.id });

      for (let id of connections[roomId]) {
        io.to(id).emit("chat-message", data, sender, socket.id);
      }
    });

    socket.on("disconnect", () => {
      let roomId = Object.keys(connections).find((room) =>
        connections[room].includes(socket.id)
      );
      if (!roomId) return;

      connections[roomId] = connections[roomId].filter((id) => id !== socket.id);
      for (let id of connections[roomId]) {
        io.to(id).emit("user-left", socket.id);
      }

      if (connections[roomId].length === 0) {
        delete connections[roomId];
        delete messages[roomId];
      }

      delete timeOnline[socket.id];
    });
  });

  return io;
};
