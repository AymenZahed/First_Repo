module.exports = (io, socket) => {
  // Send real-time notification
  socket.on('send_notification', (data) => {
    io.to(data.userId).emit('notification', {
      type: data.type,
      message: data.message,
      data: data.data,
      timestamp: new Date()
    });
  });

  // Join mission room for real-time updates
  socket.on('join_mission', (missionId) => {
    socket.join(`mission_${missionId}`);
  });

  // Leave mission room
  socket.on('leave_mission', (missionId) => {
    socket.leave(`mission_${missionId}`);
  });

  // Mission update notifications
  socket.on('mission_updated', (data) => {
    io.to(`mission_${data.missionId}`).emit('mission_update', data);
  });
};
