import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function connectPostgres(): Promise<void> {
  try {
    await prisma.$connect();
    console.log('✅ PostgreSQL connected');
  } catch (error) {
    console.error('❌ PostgreSQL connection error:', error);
    throw error;
  }
}

export async function disconnectPostgres(): Promise<void> {
  await prisma.$disconnect();
}

export default prisma;
