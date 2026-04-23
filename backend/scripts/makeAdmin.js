import { connect } from 'mongoose';
import { findOne } from '../src/models/User';

const makeAdmin = async (email) => {
  try {
    await connect(process.env.MONGODB_URI);
    console.log('Connected to DB...');

    const user = await findOne({ email });
    if (!user) {
      console.log(`User with email ${email} not found.`);
      process.exit(1);
    }

    user.role = 'admin';
    user.isVerified = true; // Also verify them automatically so they can login
    await user.save();
    
    console.log(`Successfully updated ${email} to admin!`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const email = process.argv[2];
if (!email) {
  console.log('Please provide an email address. Example: node makeAdmin.js admin@example.com');
  process.exit(1);
}

makeAdmin(email);
