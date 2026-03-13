import type { DomainException } from '@/shared/@types/DomainException';

export class enrollmentNotActiveError extends Error implements DomainException {
  statusCode = 400;

  constructor() {
    super('A matricula não está activa!');
  }
}
