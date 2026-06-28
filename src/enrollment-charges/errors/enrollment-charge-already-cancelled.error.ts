import type { DomainException } from '@/shared/@types/DomainException';

export class EnrollmentChargeAlreadyCancelled
  extends Error
  implements DomainException
{
  statusCode = 400;

  constructor() {
    super(`A cobrança para esta matricula já foi cancelada!`);
  }
}
