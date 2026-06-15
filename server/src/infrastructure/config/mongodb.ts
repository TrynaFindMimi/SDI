import mongoose from 'mongoose';

export async function connectMongoDB(): Promise<void> {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sdi_db';
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

export async function disconnectMongoDB(): Promise<void> {
  await mongoose.disconnect();
}
