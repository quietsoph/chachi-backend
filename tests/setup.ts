import { PrismaClient } from '../generated/prisma';
import { beforeAll, afterAll, beforeEach } from 'vitest';

export const testPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

beforeAll(async () => {
  // Clean database before tests
  await testPrisma.$connect();
});

afterAll(async () => {
  // Clean up after tests
  await testPrisma.user.deleteMany();
  await testPrisma.$disconnect();
});

beforeEach(async () => {
  // Clean tables before each test
  await testPrisma.user.deleteMany();
});
