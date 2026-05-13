import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
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
import { UpdateProductUseCase } from './use-cases/update-product.use-case';
import { RolesGuard } from '@/auth/guard/roles.guard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  updateProductSchema,
  type UpdateProductDto,
} from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly auditService: AuditService,
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
  ) {}

  @Post()
  @Roles('MANAGER', 'ADMIN')
  @UseGuards(RolesGuard)
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

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('MANAGER', 'ADMIN')
  @ApiOperation({ summary: 'Update product' })
  @ApiResponse({ status: 200, description: 'Product successfully updated' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 409, description: 'Product already exists' })
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateProductSchema))
    { name, code, price }: UpdateProductDto,
    @GetSchoolId('schoolId') schoolId: string,
    @GetUser('id') userId: string,
  ) {
    return this.prismaService.$transaction(async (tx) => {
      const { oldProduct, newProduct } =
        await this.updateProductUseCase.execute(
          { id, name, code, price },
          schoolId,
          tx,
        );

      await this.auditService.log(
        {
          action: 'CREATE_PRODUCT',
          entity: 'PRODUCT',
          entityId: oldProduct.id,
          schoolId,
          userId,
          oldData: {
            id: oldProduct.id,
            ...(name !== undefined && { name: oldProduct.name }),
            ...(code !== undefined && { code: oldProduct.code }),
            ...(price !== undefined && { price: oldProduct.price }),
          },
          newData: {
            id: newProduct.id,
            ...(name !== undefined && { name: newProduct.name }),
            ...(code !== undefined && { code: newProduct.code }),
            ...(price !== undefined && { price: newProduct.price }),
          },
        },
        tx,
      );

      return {
        old: oldProduct,
        new: newProduct
      }
    });
  }
}
