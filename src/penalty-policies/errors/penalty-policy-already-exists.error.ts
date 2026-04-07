import type { DomainException } from '@/shared/@types/DomainException';

export class PenaltyPolicyAlreadyExistsError
  extends Error
  implements DomainException
{
  statusCode = 409;

  constructor() {
    super(`A politica de multas ja existe!`);
  }
}
