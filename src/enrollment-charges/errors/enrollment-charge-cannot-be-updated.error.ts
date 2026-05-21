import type { DomainException } from '@/shared/@types/DomainException';

export class EnrollmentChargeCannotBeUpdatedError
  extends Error
  implements DomainException
{
  statusCode = 400;

  constructor() {
    super('A Cobranca não pode ser actualizada!');
  }
}
