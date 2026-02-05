import { PrismaService } from '@/prisma/prisma.service';
import { Module } from '@nestjs/common';
import { CreateDocumentTypeUseCase } from './use-cases/create-document-type.use-case';
import { DocumentTypesRepository } from './repositories/document-types.repository';
import { PrismaDocumentTypesRepository } from './repositories/prisma-document-types.repository';
import { DocumentTypesController } from './document-types.controller';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DocumentTypesController],
  providers: [
    {
      provide: DocumentTypesRepository,
      useClass: PrismaDocumentTypesRepository,
    },
    CreateDocumentTypeUseCase,
  ],
})
export class DocumentTypesModule {}
