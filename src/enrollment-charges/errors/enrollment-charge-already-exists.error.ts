import type { DomainException } from '@/shared/@types/DomainException';

export class EnrollmentChargeAlreadyExistsError
  extends Error
  implements DomainException
{
  statusCode = 409;

  constructor() {
    super(`A cobranca para esta matricula, deste ano e mes ja existe!`);
  }
}
