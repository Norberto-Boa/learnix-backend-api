import type { DomainException } from '@/shared/@types/DomainException';

export class StudentMustHaveDocumentError
  extends Error
  implements DomainException
{
  statusCode = 400;

  constructor() {
    super('Estudante precisa ter um documento para ser registado!');
  }
}
