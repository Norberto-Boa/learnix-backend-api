import type { AuditService } from '@/audit/audit.service';
import type { PrismaService } from '@/prisma/prisma.service';
import { ZodValidationPipe } from '@/shared/pipes/zod-validation.pipe';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  createDocumentTypeSchema,
  type CreateDocumentTypeDTO,
} from './dto/create-document-types.dto';
import { GetUser } from '@/auth/decorators/get-user.decorator';
import { GetSchoolId } from '@/auth/decorators/get-school.decorator';
import { PrismaDocumentTypesRepository } from './repositories/prisma-document-types.repository';
import { CreateDocumentTypeUseCase } from './use-cases/create-document-type.use-case';
import { DOCUMENT_TYPE_AUDIT_ACTIONS } from './constants/document-type-audit-actions';
import { Roles } from '@/auth/decorators/roles.decorator';
import { RolesGuard } from '@/auth/guard/roles.guard';

@Controller('document-types')
export class DocumentTypesController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly auditService: AuditService,
    private readonly createDocumentTypeUseCase: CreateDocumentTypeUseCase,
  ) {}

  @Post()
  @Roles('MANAGER', 'ADMIN')
  @UseGuards(RolesGuard)
  async create(
    @Body(new ZodValidationPipe(createDocumentTypeSchema))
    { label, type }: CreateDocumentTypeDTO,
    @GetUser('id') userId: string,
    @GetSchoolId('schoolId') schoolId: string,
  ) {
    return this.prismaService.$transaction(async (tx) => {
      const documentType = await this.createDocumentTypeUseCase.execute(
        { label, type },
        { schoolId: schoolId, performedByUserId: userId },
      );

      await this.auditService.log(
        {
          action: DOCUMENT_TYPE_AUDIT_ACTIONS.CREATE,
          entity: 'DOCUMENT_TYPE',
          entityId: documentType.id,
          schoolId,
          userId: userId,
          newData: documentType,
        },
        tx,
      );

      return documentType;
    });
  }
}
