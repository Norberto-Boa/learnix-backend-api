import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { CreateProductUseCase } from './use-cases/create-product.use-case';
import { ProductsRepository } from './repositories/products.repository';
import { PrismaProductsRepository } from './repositories/prisma/prisma-products.repository';

@Module({
  controllers: [ProductsController],
  providers: [
    CreateProductUseCase,
    {
      provide: ProductsRepository,
      useClass: PrismaProductsRepository,
    },
  ],
})
export class ProductsModule {}
