import type { DomainException } from '@/shared/@types/DomainException';

export class ProductNotFoundError extends Error implements DomainException {
  statusCode = 404;

  constructor() {
    super('Produto não encontrado!');
  }
}
