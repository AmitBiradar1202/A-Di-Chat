// server.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const {config}=require("dotenv")
const app = express();
const server = http.createServer(app);

config({ path: "./config.env" });
const io = new Server(server, {
  cors: {
    origin: "process.env.FRONTEND",
    methods: ["GET", "POST"]
  }
});

app.use(cors());

// When a client connects

io.on('connection', (socket) => {
  console.log('A user connected');

  // Join a room
  socket.on('joinRoom', (data) => {
    socket.join(data.room);
    io.to(data.room).emit('message', {
      user: 'System',
      text: `${data.user} has joined the chat.`,
    });
  });

  // Listen for chat messages
  socket.on('chatMessage', (data) => {
    io.to(data.room).emit('message', data);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});


server.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
