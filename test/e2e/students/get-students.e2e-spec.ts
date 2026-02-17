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
import type { StudentDomain } from '@/students/domain/student';

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

    await prisma.student.create({
      data: {
        name: 'John Doe',
        registrationNumber: 'REG-001',
        dateOfBirth: new Date('2007-01-06'),
        gender: 'MALE',
        schoolId: school.id,
      },
    });

    await prisma.student.create({
      data: {
        name: 'John Doe',
        registrationNumber: 'REG-002',
        dateOfBirth: new Date('2007-01-06'),
        gender: 'MALE',
        schoolId: school.id,
      },
    });

    await prisma.student.create({
      data: {
        name: 'John Doe',
        registrationNumber: 'REG-003',
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

  it('Should return list of students', async () => {
    const response = await request(app.getHttpServer())
      .get(`/students`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data.students.length as StudentDomain[]).toBe(3);
  });

  it('Should return student by users school only', async () => {
    const school2 = await prisma.school.create({
      data: schoolFactory(),
    });

    await prisma.student.create({
      data: {
        name: 'John Doe',
        registrationNumber: 'REG-003',
        dateOfBirth: new Date('2007-01-06'),
        gender: 'MALE',
        schoolId: school2.id,
      },
    });

    const response = await request(app.getHttpServer())
      .get(`/students`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data.students.length as StudentDomain[]).toBe(3);
  });

  it('Should return student by users school only', async () => {
    const studentToBeDeleted = await prisma.student.create({
      data: {
        name: 'John Doe',
        registrationNumber: 'REG-006',
        dateOfBirth: new Date('2007-01-06'),
        gender: 'MALE',
        schoolId: school.id,
      },
    });

    await prisma.student.update({
      where: {
        id: studentToBeDeleted.id,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    const response = await request(app.getHttpServer())
      .get(`/students`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data.students.length as StudentDomain[]).toBe(3);
  });
});
