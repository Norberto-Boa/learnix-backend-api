import request from 'supertest';
import { INestApplication } from '@nestjs/common';

import { createTestApp } from '@test/create-test-app';
import { PrismaService } from '@/prisma/prisma.service';
import { authenticateAsSuperAdmin } from '../helpers/auth.e2e';
import { schoolFactory } from '../factories/school.factory';
import { userFactory } from '../factories/user.factory';

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
    const school = await prisma.school.create({
      data: schoolFactory(),
    });

    const admin = await prisma.user.create({
      data: userFactory({
        role: 'ADMIN',
        schoolId: school.id,
      }),
    });

    expect(admin).toBeDefined();
    expect(admin.id).toBeDefined();
  });
});
