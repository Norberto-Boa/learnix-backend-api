import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { execSync } from 'node:child_process';

let postgres: StartedTestContainer;

export default async function () {
  postgres = await new GenericContainer('postgres:16')
    .withEnvironment({
      POSTGRES_USER: 'test',
      POSTGRES_PASSWORD: 'test',
      POSTGRES_DB: 'test',
    })
    .withExposedPorts(5432)
    .start();

  const port = postgres.getMappedPort(5432);
  const host = postgres.getHost();

  process.env.DATABASE_URL = `postgresql://test:test@${host}:${port}/test`;
  process.env.JWT_SECRET_KEY ??= 'e2e-secret-key';

  execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
  });

  execSync('npx prisma db seed', { stdio: 'inherit' });

  (global as any).__POSTGRES_CONTAINER__ = postgres;
}
