import { Body, Controller, Get, Post } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateProductUseCase } from './use-cases/create-product.use-case';
import { Roles } from '@/auth/decorators/roles.decorator';
import { ZodValidationPipe } from '@/shared/pipes/zod-validation.pipe';
import {
  createProductSchema,
  CreateProductDto,
} from './dto/create-product.dto';
import { GetSchoolId } from '@/auth/decorators/get-school.decorator';
import { GetUser } from '@/auth/decorators/get-user.decorator';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly auditService: AuditService,
    private readonly createProductUseCase: CreateProductUseCase,
  ) {}

  @Post()
  @Roles('MANAGER', 'CLERK', 'ADMIN')
  async create(
    @Body(new ZodValidationPipe(createProductSchema))
    { name, code, price }: CreateProductDto,
    @GetSchoolId('school-id') schoolId: string,
    @GetUser('id') userId: string,
  ) {
    return this.prismaService.$transaction(async (tx) => {
      const { product } = await this.createProductUseCase.execute(
        { name, code, price },
        schoolId,
        tx,
      );

      await this.auditService.log(
        {
          action: 'CREATE_PRODUCT',
          entity: 'PRODUCT',
          entityId: product.id,
          schoolId,
          userId,
          newData: {
            id: product.id,
            name: product.name,
          },
        },
        tx,
      );
    });
  }

  @Get()
  async fetchProducts() {
    return {};
  }
}
