import type { DomainException } from '@/shared/@types/DomainException';

export class EnrollmentNotFoundError extends Error implements DomainException {
  statusCode = 404;

  constructor() {
    super('Esse registo de matricula nao foi encontrado!');
  }
}
