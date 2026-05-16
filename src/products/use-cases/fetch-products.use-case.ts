import { Injectable } from '@nestjs/common';
import type { Product } from '../domain/product';
import { ProductsRepository } from '../repositories/products.repository';

export interface FetchProductsUseCaseRequest {
  page: number;
  limit: number;
  search?: string;
}

export interface FetchProductsUseCaseResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class FetchProductsUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute(
    { limit, page, search }: FetchProductsUseCaseRequest,
    schoolId: string,
  ): Promise<FetchProductsUseCaseResponse> {
    const [products, total] = await Promise.all([
      this.productsRepository.findMany(schoolId, { limit, page, search }),
      this.productsRepository.countMany(schoolId, { search }),
    ]);

    return {
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
