import request from 'supertest';

import { PrismaService } from '@/prisma/prisma.service';
import type { INestApplication } from '@nestjs/common';
import { createTestApp } from '@test/create-test-app';
import { resetdb } from '../helpers/resetDatabase.e2e';
import type { School, Student, User } from '@prisma/client';
import { authenticate, type AuthResult } from '../helpers/auth.e2e';
import { schoolFactory } from '../factories/school.factory';
import { userFactory } from '../factories/user.factory';
import type { DocumentType } from '@/generated/prisma/client';
import { randomUUID } from 'crypto';

describe('GET /students/:id (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let admin: User;
  let school: School;
  let student: Student;
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

    student = await prisma.student.create({
      data: {
        name: 'John Doe',
        registrationNumber: 'REG-001',
        dateOfBirth: new Date('2007-01-06'),
        gender: 'MALE',
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

  it('Should return student by id', async () => {
    const response = await request(app.getHttpServer())
      .get(`/students/${student.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('Should return 404 when student does not exist', async () => {
    const fakeUUID = randomUUID();

    const response = await request(app.getHttpServer())
      .get(`/students/${fakeUUID}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
  });
});
