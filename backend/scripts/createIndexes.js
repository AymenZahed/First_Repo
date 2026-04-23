require('dotenv').config();
const connectDB = require('../src/config/database');
const User = require('../src/models/User');
const Mission = require('../src/models/Mission');
const Application = require('../src/models/Application');
const Message = require('../src/models/Message');
const Review = require('../src/models/Review');
const Presence = require('../src/models/Presence');

const createIndexes = async () => {
  try {
    await connectDB();

    console.log('Creating indexes...');

    await Promise.all([
      User.createIndexes(),
      Mission.createIndexes(),
      Application.createIndexes(),
      Message.createIndexes(),
      Review.createIndexes(),
      Presence.createIndexes()
    ]);

    console.log('✅ All indexes created successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
    process.exit(1);
  }
};

createIndexes();
