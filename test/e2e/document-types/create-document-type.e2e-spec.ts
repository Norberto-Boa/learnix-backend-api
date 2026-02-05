import request from 'supertest';
import { INestApplication } from '@nestjs/common';

import { createTestApp } from '@test/create-test-app';
import { PrismaService } from '@/prisma/prisma.service';
import { schoolFactory } from '../factories/school.factory';
import { userFactory } from '../factories/user.factory';
import { authenticate } from '../helpers/auth.e2e';

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

    const token = await authenticate({
      app,
      email: admin.email,
      password: 'admin123',
    });

    console.log(await prisma.documentType.count());

    const response = await request(app.getHttpServer())
      .post('/document-types')
      .set('Authorization', `Bearer ${token}`)
      .send({
        type: 'BI',
        label: 'Bilhete de Identidade',
      });

    console.log(response.body);
    expect(response.status).toBe(201);

    expect(token).toBeDefined();
    expect(admin).toBeDefined();
    expect(admin.id).toBeDefined();
  });
});
