import type { DomainException } from '@/shared/@types/DomainException';

export class AmountLessThanZeroError extends Error implements DomainException {
  statusCode = 400;

  constructor() {
    super('O valor da estrutura de taxas deve ser um número positivo!');
  }
}
