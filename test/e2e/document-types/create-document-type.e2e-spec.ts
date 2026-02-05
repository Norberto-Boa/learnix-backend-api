import request from 'supertest';
import { INestApplication } from '@nestjs/common';

import { createTestApp } from '@test/create-test-app';
import { PrismaService } from '@/prisma/prisma.service';
import { authenticateAsSuperAdmin } from '../helpers/auth.e2e';

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
    const { token } = await authenticateAsSuperAdmin(app);

    const res = await request(app.getHttpServer())
      .post('/document-types')
      .set('Authorization', `Bearer ${token}`)
      .send({
        type: 'BI',
        label: 'Bilhete de Identidade',
      });

    expect(res.status).toBe(201);

    const doc = await prisma.documentType.findFirst({
      where: { type: 'BI' },
    });

    expect(doc).not.toBeNull();
  });
});
