import type { DomainException } from '@/shared/@types/DomainException';

export class EnrollmentChargeNotFoundError
  extends Error
  implements DomainException
{
  statusCode = 404;

  constructor() {
    super('A Cobranca não foi registada!');
  }
}
