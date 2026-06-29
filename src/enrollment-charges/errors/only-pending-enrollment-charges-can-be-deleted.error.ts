import type { DomainException } from '@/shared/@types/DomainException';

export class OnlyPendingEnrollmentChargesCanBeDeleted
  extends Error
  implements DomainException
{
  statusCode = 400;

  constructor() {
    super('A Cobranca não pode ser apagada!');
  }
}
