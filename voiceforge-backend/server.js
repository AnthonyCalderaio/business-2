const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// CORS middleware to handle HTTP requests from the frontend
const corsOptions = {
  origin: 'http://localhost:4200',  // Allow requests from the frontend (Angular app)
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};

// Apply the CORS middleware to HTTP routes
app.use(cors(corsOptions));

// WebSocket server setup with Socket.IO and WebSocket CORS configuration
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:4200',  // Allow WebSocket connections from the Angular app
    methods: ['GET', 'POST'],
  }
});

// Handle WebSocket connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Optional: Send a welcome message to the frontend
  socket.emit('message', 'Hello from backend!');

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// Start the server on port 3000
server.listen(3000, () => {
  console.log('VoiceForge Backend is running on http://localhost:3000');
});
