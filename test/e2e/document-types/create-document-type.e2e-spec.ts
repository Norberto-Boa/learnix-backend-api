import request from 'supertest';
import { INestApplication } from '@nestjs/common';

import { createTestApp } from '@test/create-test-app';
import { PrismaService } from '@/prisma/prisma.service';
import { schoolFactory } from '../factories/school.factory';
import { userFactory } from '../factories/user.factory';
import { authenticate, type AuthResult } from '../helpers/auth.e2e';
import type { UserDelegate } from '@/generated/prisma/models';
import type { School, User } from '@/generated/prisma/client';
import {
  countAuditLogs,
  expectAuditCountUnchaged,
  testAuditLog,
} from '../helpers/audit.e2e';
import { DOCUMENT_TYPE_AUDIT_ACTIONS } from '@/document-types/constants/document-type-audit-actions';

describe('POST /document-types (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let admin: User;
  let school: School;
  let token: AuthResult;

  beforeEach(async () => {
    app = await createTestApp();
    prisma = app.get(PrismaService);

    school = await prisma.school.create({
      data: schoolFactory(),
    });

    admin = await prisma.user.create({
      data: userFactory({
        role: 'ADMIN',
        schoolId: school.id,
      }),
    });

    token = await authenticate({
      app,
      email: admin.email,
      password: 'admin123',
    });
  });

  afterEach(async () => {
    await prisma.$executeRawUnsafe(`
    DO $$ DECLARE
    r RECORD;
  BEGIN
    FOR r IN (
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
        AND tablename <> '_prisma_migrations'
    ) LOOP
      EXECUTE 'TRUNCATE TABLE "' || r.tablename || '" CASCADE';
    END LOOP;
  END $$;
  `);
  });

  afterAll(async () => {
    await app.close();
  });

  it('creates a document type', async () => {
    const response = await request(app.getHttpServer())
      .post('/document-types')
      .set('Authorization', `Bearer ${token}`)
      .send({
        type: 'BI',
        label: 'Bilhete de Identidade',
      });

    await testAuditLog({
      prisma,
      action: DOCUMENT_TYPE_AUDIT_ACTIONS.CREATE,
      entity: 'DOCUMENT_TYPE',
      schoolId: school.id,
      userId: admin.id,
    });
    expect(response.status).toBe(201);
    expect(token).toBeDefined();
    expect(admin).toBeDefined();
    expect(admin.id).toBeDefined();
  });

  it('does not allow duplicate document types per school', async () => {
    const response = await request(app.getHttpServer())
      .post('/document-types')
      .set('Authorization', `Bearer ${token}`)
      .send({
        type: 'BI',
        label: 'Bilhete de Identidade',
      });

    const beforeCount = await countAuditLogs({
      prisma,
      action: 'CREATE_DOCUMENT_TYPE',
      entity: 'DOCUMENT_TYPE',
      schoolId: school.id,
      userId: admin.id,
    });

    expect(response.status).toBe(201);

    const responseFailed = await request(app.getHttpServer())
      .post('/document-types')
      .set('Authorization', `Bearer ${token}`)
      .send({
        type: 'BI',
        label: 'Bilhete de Identidade',
      });

    await expectAuditCountUnchaged({
      prisma,
      action: DOCUMENT_TYPE_AUDIT_ACTIONS.CREATE,
      entity: 'DOCUMENT_TYPE',
      schoolId: school.id,
      userId: admin.id,
      beforeCount,
    });
    expect(responseFailed.status).toBe(409);
  });

  it('does not allow clerk to create a document type', async () => {
    const clerk = await prisma.user.create({
      data: userFactory({
        role: 'CLERK',
        schoolId: school.id,
      }),
    });

    const token_clerk = await authenticate({
      app,
      email: clerk.email,
      password: 'admin123',
    });

    const response = await request(app.getHttpServer())
      .post('/document-types')
      .set('Authorization', `Bearer ${token_clerk}`)
      .send({
        type: 'BI',
        label: 'Bilhete de Identidade',
      });

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
  });
});
