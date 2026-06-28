import type { DomainException } from '@/shared/@types/DomainException';

export class EnrollmentChargeWithPaymentCannotBeCancelled
  extends Error
  implements DomainException
{
  statusCode = 400;

  constructor() {
    super(
      `A cobrança para esta matricula não pode ser cancelada por ter um pagamento associado!`,
    );
  }
}
