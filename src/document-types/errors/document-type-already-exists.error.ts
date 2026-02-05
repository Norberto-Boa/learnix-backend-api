import type { DomainException } from '@/shared/@types/DomainException';

export class DocumentTypeAlreadyExistsError
  extends Error
  implements DomainException
{
  statusCode = 409;

  constructor() {
    super('Este tipo de documento ja existe para esta escola!');
  }
}
