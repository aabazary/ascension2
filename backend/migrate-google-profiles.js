import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const migrateGoogleProfiles = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find users with googleId but no originalGoogleProfilePicture
    const usersToUpdate = await User.find({
      googleId: { $exists: true, $ne: null },
      $or: [
        { originalGoogleProfilePicture: { $exists: false } },
        { originalGoogleProfilePicture: '' }
      ]
    });

    console.log(`Found ${usersToUpdate.length} OAuth users to update`);

    if (usersToUpdate.length === 0) {
      console.log('No users need migration');
      return;
    }

    // Update each user
    for (const user of usersToUpdate) {
      // If they currently have a Google profile picture URL, use that as the original
      if (user.profilePicture && user.profilePicture.startsWith('http')) {
        user.originalGoogleProfilePicture = user.profilePicture;
        await user.save();
        console.log(`Updated user ${user.username}: set originalGoogleProfilePicture to current profilePicture`);
      } else {
        // If they don't have a Google profile picture URL, we can't determine the original
        // This would require them to log in again with Google to get the original URL
        console.log(`User ${user.username} has no Google profile picture URL - they may need to log in again`);
      }
    }

    console.log('Google profile migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

migrateGoogleProfiles();
