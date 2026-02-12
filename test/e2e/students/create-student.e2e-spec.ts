import request from 'supertest';

import { PrismaService } from '@/prisma/prisma.service';
import type { INestApplication } from '@nestjs/common';
import type { School, User } from '@prisma/client';
import { createTestApp } from '@test/create-test-app';
import { authenticate, type AuthResult } from '../helpers/auth.e2e';
import { schoolFactory } from '../factories/school.factory';
import { userFactory } from '../factories/user.factory';
import type { DocumentType } from '@/generated/prisma/client';
import { resetdb } from '../helpers/resetDatabase.e2e';

describe('POST /students (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let admin: User;
  let school: School;
  let token: AuthResult;
  let documentType: DocumentType;

  beforeAll(async () => {
    app = await createTestApp();
    prisma = app.get(PrismaService);
  });

  beforeEach(async () => {
    await resetdb(prisma);

    school = await prisma.school.create({
      data: schoolFactory(),
    });

    admin = await prisma.user.create({
      data: userFactory({
        role: 'ADMIN',
        schoolId: school.id,
      }),
    });

    documentType = await prisma.documentType.create({
      data: {
        type: 'BI',
        label: 'Bilhete de identificacao',
        schoolId: school.id,
      },
    });

    token = await authenticate({
      app,
      email: admin.email,
      password: 'admin123',
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it('Creates a student with document', async () => {
    const response = await request(app.getHttpServer())
      .post('/students')
      .set(`Authorization`, `Bearer ${token}`)
      .send({
        name: 'John Doe',
        registrationNumber: 'REG-001',
        dateOfBirth: '2010-01-01',
        gender: 'MALE',
        documentTypeId: documentType.id,
        documentNumber: '123456',
      });

    expect(response.status).toBe(201);

    const student = await prisma.student.findFirst({
      where: {
        registrationNumber: 'REG-001',
      },
    });

    const document = await prisma.studentDocument.findFirst({
      where: {
        documentNumber: '123456',
      },
    });

    expect(student).toBeDefined();
    expect(document).toBeDefined();
  });

  it('Does not allow creating student without document', async () => {
    const response = await request(app.getHttpServer())
      .post('/students')
      .set(`Authorization`, `Bearer ${token}`)
      .send({
        name: 'John Doe',
        registrationNumber: 'REG-001',
        dateOfBirth: '2010-01-01',
        gender: 'MALE',
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});
