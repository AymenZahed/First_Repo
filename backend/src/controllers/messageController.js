const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
  try {
    const message = await Message.create({
      sender: req.user._id,
      recipient: req.body.recipient,
      content: req.body.content,
      mission: req.body.mission
    });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { recipient: req.user._id }]
    })
      .populate('sender recipient', 'firstName lastName organizationName profilePicture logo')
      .sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    await Message.updateMany(
      { _id: { $in: req.body.messageIds }, recipient: req.user._id },
      { isRead: true, readAt: new Date() }
    );
    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
