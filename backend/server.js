require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const connectDB = require('./src/config/database');
const initializeSocket = require('./src/sockets/socketServer');

// Import jobs
const reminderJobs = require('./src/jobs/reminderJobs');
const statsJobs = require('./src/jobs/statsJobs');
const cleanupJobs = require('./src/jobs/cleanupJobs');

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = initializeSocket(server);

// Make io accessible to routes
app.set('io', io);

// Connect to database
connectDB();

// Start cron jobs
if (process.env.NODE_ENV === 'production') {
  reminderJobs.sendMissionReminders.start();
  statsJobs.updateGlobalStats.start();
  statsJobs.updateMissionStatus.start();
  cleanupJobs.cleanupUnverifiedUsers.start();
  cleanupJobs.cleanupOldMessages.start();
  cleanupJobs.clearExpiredCache.start();
}

// Start server
server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
