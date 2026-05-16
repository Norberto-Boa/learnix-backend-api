import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { CreateProductUseCase } from './use-cases/create-product.use-case';
import { ProductsRepository } from './repositories/products.repository';
import { PrismaProductsRepository } from './repositories/prisma/prisma-products.repository';
import { UpdateProductUseCase } from './use-cases/update-product.use-case';
import { DeleteProductUseCase } from './use-cases/delete-product.use-case';
import { GetProductUseCase } from './use-cases/get-product.use-case';
import { FetchProductsUseCase } from './use-cases/fetch-products.use-case';

@Module({
  controllers: [ProductsController],
  providers: [
    CreateProductUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
    GetProductUseCase,
    FetchProductsUseCase,
    {
      provide: ProductsRepository,
      useClass: PrismaProductsRepository,
    },
  ],
})
export class ProductsModule {}
