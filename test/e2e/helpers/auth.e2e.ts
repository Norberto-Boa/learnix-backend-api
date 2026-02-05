import type { UserPayload } from '@/auth/types/user-payload.interface';
import { PrismaService } from '@/prisma/prisma.service';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { JwtService } from '@nestjs/jwt';

interface AuthResult {
  access_token: string;
}

interface AuthenticateParams {
  app: INestApplication;
  email: string;
  password: string;
}

export async function authenticate({
  app,
  email,
  password,
}: AuthenticateParams): Promise<AuthResult> {
  const response = await request(app.getHttpServer()).post('/auth/login').send({
    email,
    password,
  });

  if (response.status !== 201 && response.status !== 200) {
    console.error('[E2E AUTH] Authentication failed', {
      status: response.status,
      body: response.body,
    });

    throw new Error('Failed to authenticate test user');
  }

  const { access_token } = response.body.data;

  if (!access_token) {
    throw new Error('Auth response missing access token');
  }
  return access_token;
}
