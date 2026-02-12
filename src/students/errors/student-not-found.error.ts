import type { DomainException } from '@/shared/@types/DomainException';

export class StudentNotFoundError extends Error implements DomainException {
  statusCode = 404;

  constructor() {
    super('Estudante nao registado no sistema!');
  }
}
