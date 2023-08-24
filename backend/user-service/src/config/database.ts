// config/database.ts
import mongoose from 'mongoose';
import { env } from './env';

const connectDB = async () => {
  try {
    await mongoose.connect(env.db_url, {
        autoIndex: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

export default connectDB;
