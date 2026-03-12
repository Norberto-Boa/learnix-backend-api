import type { DomainException } from '@/shared/@types/DomainException';

export class AcademicYearAndClassroomYearDoNotMatchFoundError
  extends Error
  implements DomainException
{
  statusCode = 400;

  constructor() {
    super(
      'O ano Lectivo selecionado, nao corresponde ao ano lectivo da turma!',
    );
  }
}
