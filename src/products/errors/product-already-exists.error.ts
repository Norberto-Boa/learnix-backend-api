import type { DomainException } from '@/shared/@types/DomainException';

export class ProductAlreadyExistsError
  extends Error
  implements DomainException
{
  statusCode = 409;

  constructor() {
    super(`Produto com mesmo nome ja existe!`);
  }
}
