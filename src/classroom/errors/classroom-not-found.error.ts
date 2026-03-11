import type { DomainException } from '@/shared/@types/DomainException';

export class ClassroomNotFoundError extends Error implements DomainException {
  statusCode = 404;

  constructor() {
    super('Esta nao esta registada no sistema!');
  }
}
