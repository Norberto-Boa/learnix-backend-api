import { Injectable } from '@nestjs/common';
import type { Product } from '../domain/product';
import { ProductsRepository } from '../repositories/products.repository';
import { ProductNotFoundError } from '../errors/product-not-found.error';

export interface GetProductUseCaseRequest {
  id: string;
}

export interface GetProductUseCaseResponse {
  product: Product;
}

@Injectable()
export class GetProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute(
    { id }: GetProductUseCaseRequest,
    schoolId: string,
  ): Promise<GetProductUseCaseResponse> {
    const product = await this.productsRepository.findById(id, schoolId);

    if (!product) {
      throw new ProductNotFoundError();
    }

    return {
      product,
    };
  }
}
