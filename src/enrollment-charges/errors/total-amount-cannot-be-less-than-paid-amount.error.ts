import type { DomainException } from '@/shared/@types/DomainException';

export class TotalAmountCannotBeLessThanPaidAmountError
  extends Error
  implements DomainException
{
  statusCode = 400;

  constructor() {
    super('O valor total nao pode ser menor que valor pago!');
  }
}
