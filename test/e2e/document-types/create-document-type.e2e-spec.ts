import request from 'supertest';
import { INestApplication } from '@nestjs/common';

import { createTestApp } from '@test/create-test-app';
import { PrismaService } from '@/prisma/prisma.service';

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
    const res = await request(app.getHttpServer())
      .post('/document-types')
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
