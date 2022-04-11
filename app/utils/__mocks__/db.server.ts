import { mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';

const db = mockDeep<PrismaClient>();

export { db };
