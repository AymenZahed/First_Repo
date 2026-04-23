const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const messageHandlers = require('./messageHandlers');
const notificationHandlers = require('./notificationHandlers');

const initializeSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ['GET', 'POST']
    }
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.email}`);

    // Join user to their personal room
    socket.join(socket.user._id.toString());

    // Message handlers
    messageHandlers(io, socket);

    // Notification handlers
    notificationHandlers(io, socket);

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.email}`);
    });
  });

  return io;
};

module.exports = initializeSocket;
