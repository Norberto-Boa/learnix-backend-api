import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
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
import { DeleteProductUseCase } from './use-cases/delete-product.use-case';
import { GetProductUseCase } from './use-cases/get-product.use-case';
import { FetchProductsUseCase } from './use-cases/fetch-products.use-case';
import {
  getProductsQuerySchema,
  type GetProductsQueryDTO,
} from './dto/get-products-query.dto';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly auditService: AuditService,
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
    private readonly getProductUseCase: GetProductUseCase,
    private readonly fetchProductsUseCase: FetchProductsUseCase,
  ) {}

  @Post()
  @Roles('MANAGER', 'ADMIN')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product successfully created' })
  @ApiResponse({ status: 409, description: 'Product already exists' })
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
          action: 'UPDATE_PRODUCT',
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
        new: newProduct,
      };
    });
  }

  @Delete()
  @UseGuards(RolesGuard)
  @Roles('MANAGER', 'ADMIN')
  @ApiOperation({ summary: 'Delete product' })
  @ApiResponse({ status: 200, description: 'Product successfully deleted' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async delete(
    @Param('id') id: string,
    @GetSchoolId('schoolId') schoolId: string,
    @GetUser('id') userId: string,
  ) {
    return this.prismaService.$transaction(async (tx) => {
      await this.deleteProductUseCase.execute({ id }, schoolId, tx);

      await this.auditService.log(
        {
          action: 'DELETE_PRODUCT',
          entity: 'PRODUCT',
          entityId: id,
          schoolId,
          userId,
        },
        tx,
      );

      return {
        Message: 'Deleted product successfully!',
      };
    });
  }

  @Get('id')
  @UseGuards(RolesGuard)
  @Roles('MANAGER', 'ADMIN', 'CLERK')
  @ApiOperation({ summary: 'Get product by id' })
  @ApiResponse({ status: 200, description: 'Product successfully found' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async get(
    @Param('id') id: string,
    @GetSchoolId('schoolId') schoolId: string,
  ) {
    const { product } = await this.getProductUseCase.execute({ id }, schoolId);

    return { product };
  }

  @Get()
  @Roles('MANAGER', 'ADMIN', 'CLERK')
  @ApiOperation({ summary: 'Fetch products' })
  @ApiResponse({ status: 200, description: 'Products successfully fetched' })
  async fecth(
    @Query(new ZodValidationPipe(getProductsQuerySchema))
    { page, limit, search }: GetProductsQueryDTO,
    @GetSchoolId('schoolId') schoolId: string,
  ) {
    return this.fetchProductsUseCase.execute(
      {
        page,
        limit,
        search,
      },
      schoolId,
    );
  }
}
