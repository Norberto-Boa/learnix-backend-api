import { PrismaService } from '@/prisma/prisma.service';
import { Module } from '@nestjs/common';
import { CreateDocumentTypeUseCase } from './use-cases/create-document-type.use-case';
import { DocumentTypesRepository } from './repositories/document-types.repository';
import { PrismaDocumentTypesRepository } from './repositories/prisma-document-types.repository';
import { DocumentTypesController } from './document-types.controller';

@Module({
  controllers: [DocumentTypesController],
  providers: [
    PrismaService,
    CreateDocumentTypeUseCase,
    {
      provide: DocumentTypesRepository,
      useClass: PrismaDocumentTypesRepository,
    },
  ],
})
export class DocumentTypesModule {}
