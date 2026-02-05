import request from 'supertest';
import { INestApplication } from '@nestjs/common';

import { createTestApp } from '@test/create-test-app';
import { PrismaService } from '@/prisma/prisma.service';
import { authenticateAsSuperAdmin } from '../helpers/auth.e2e';
import { schoolFactory } from '../factories/school.factory';

describe('POST /document-types (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    app = await createTestApp();
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('creates a document type', async () => {
    const schoolData = schoolFactory();

    const school = await prisma.school.create({
      data: schoolData,
    });

    expect(school).toBeDefined();
    expect(school.id).toBeDefined();
  });
});
