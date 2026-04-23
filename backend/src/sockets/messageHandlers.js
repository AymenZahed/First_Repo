const Message = require('../models/Message');

module.exports = (io, socket) => {
  // Send message
  socket.on('send_message', async (data) => {
    try {
      const message = await Message.create({
        sender: socket.user._id,
        recipient: data.recipient,
        content: data.content,
        mission: data.mission
      });

      const populatedMessage = await Message.findById(message._id)
        .populate('sender', 'firstName lastName organizationName profilePicture logo')
        .populate('recipient', 'firstName lastName organizationName');

      // Send to recipient
      io.to(data.recipient).emit('new_message', populatedMessage);

      // Confirm to sender
      socket.emit('message_sent', populatedMessage);
    } catch (error) {
      socket.emit('message_error', { message: error.message });
    }
  });

  // Typing indicator
  socket.on('typing', (data) => {
    io.to(data.recipient).emit('user_typing', {
      sender: socket.user._id,
      isTyping: data.isTyping
    });
  });

  // Mark message as read
  socket.on('mark_read', async (data) => {
    try {
      await Message.findByIdAndUpdate(data.messageId, {
        isRead: true,
        readAt: new Date()
      });

      io.to(data.senderId).emit('message_read', {
        messageId: data.messageId
      });
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });
};
