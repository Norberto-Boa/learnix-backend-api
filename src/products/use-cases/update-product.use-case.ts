import { Injectable } from '@nestjs/common';
import { ProductsRepository } from '../repositories/products.repository';
import type { DbContext } from '@/prisma/shared/db-context';
import { ProductAlreadyExistsError } from '../errors/product-already-exists.error';
import { ProductNotFoundError } from '../errors/product-not-found.error';
import type { Product } from '../domain/product';

export interface UpdateProductUseCaseRequest {
  id: string;
  name?: string;
  code?: string;
  price?: number;
}

export interface UpdateProductUseCaseResponse {
  product: Product;
}

@Injectable()
export class UpdateProductUseCase {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async execute(
    { id, code, name, price }: UpdateProductUseCaseRequest,
    schoolId: string,
    tx?: DbContext,
  ) {
    const product = await this.productsRepository.findById(id, schoolId);

    console.log('Producto encontrado ' + product?.id);

    if (!product) {
      throw new ProductNotFoundError();
    }

    if (name && name !== product.name) {
      const productWithSameName = await this.productsRepository.findByName(
        name,
        schoolId,
      );

      if (productWithSameName && productWithSameName.id !== id) {
        throw new ProductAlreadyExistsError();
      }
    }

    const updateProduct = await this.productsRepository.update(
      id,
      schoolId,
      { name, code, price },
      tx,
    );

    return {
      oldProduct: product,
      newProduct: updateProduct,
    };
  }
}
