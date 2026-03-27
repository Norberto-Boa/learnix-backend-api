import type { DomainException } from '@/shared/@types/DomainException';

export class FeeTypeNotFoundError extends Error implements DomainException {
  statusCode = 404;

  constructor() {
    super('Esse registo de tipo de despesa nao foi encontrado!');
  }
}
