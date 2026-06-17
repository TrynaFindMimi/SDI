import mongoose from 'mongoose';

function getMongoUri(): string {
  if (process.env.MONGODB_URI) return process.env.MONGODB_URI;
  if (process.env.MONGO_URL) return process.env.MONGO_URL;

  const host = process.env.MONGOHOST || 'localhost';
  const port = process.env.MONGOPORT || '27017';
  const user = process.env.MONGOUSER || process.env.MONGO_INITDB_ROOT_USERNAME;
  const pass = process.env.MONGOPASSWORD || process.env.MONGO_INITDB_ROOT_PASSWORD;
  const db = process.env.MONGO_INITDB_DATABASE || 'cdi_db';

  if (user && pass) {
    return `mongodb://${user}:${encodeURIComponent(pass)}@${host}:${port}/${db}?authSource=admin`;
  }
  return `mongodb://${host}:${port}/${db}`;
}

export async function connectMongoDB(): Promise<void> {
  try {
    const uri = getMongoUri();
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
