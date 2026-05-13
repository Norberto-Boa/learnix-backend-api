import { Injectable } from '@nestjs/common';
import { Product } from '../domain/product';
import { ProductsRepository } from '../repositories/products.repository';
import type { DbContext } from '@/prisma/shared/db-context';
import { ProductAlreadyExistsError } from '../errors/product-already-exists.error';

interface CreateProductUseCaseRequest {
  name: string;
  code: string;
  price: number;
}

interface CreateProductUseCaseResponse {
  product: Product;
}

@Injectable()
export class CreateProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute(
    { name, price, code }: CreateProductUseCaseRequest,
    schoolId: string,
    tx?: DbContext,
  ): Promise<CreateProductUseCaseResponse> {
    const productWithSameName = await this.productsRepository.findByName(
      name,
      schoolId,
    );

    if (productWithSameName) {
      throw new ProductAlreadyExistsError();
    }

    const product = await this.productsRepository.save(
      { name, code, price },
      schoolId,
      tx,
    );

    return {
      product,
    };
  }
}
