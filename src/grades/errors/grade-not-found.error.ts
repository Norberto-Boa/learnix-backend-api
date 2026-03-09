import type { DomainException } from '@/shared/@types/DomainException';

export class GradeNotFoundError extends Error implements DomainException {
  statusCode = 404;

  constructor() {
    super('A classe referenciada não foi encontrada!');
  }
}
