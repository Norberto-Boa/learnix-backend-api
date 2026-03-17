import type { DomainException } from '@/shared/@types/DomainException';

export class FeeTypeCodeAlreadyExistsError
  extends Error
  implements DomainException {
  statusCode = 409;

  constructor() {
    super('Este codigo ja foi usado!');
  }
}
