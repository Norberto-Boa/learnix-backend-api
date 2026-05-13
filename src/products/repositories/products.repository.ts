import type { DbContext } from '@/prisma/shared/db-context';
import type { Product } from '../domain/product';

export interface CreateProductRepositoryData {
  name: string;
  code: string;
  price: number;
}

export interface UpdateProductRepositoryData {
  name?: string;
  code?: string;
  price?: number;
}

export interface FindManyProductsParams {
  page: number;
  limit: number;
  search?: string;
}
export abstract class ProductsRepository {
  abstract save(
    data: CreateProductRepositoryData,
    schoolId: string,
    tx?: DbContext,
  ): Promise<Product>;

  abstract findById(id: string, schoolId: string): Promise<Product | null>;
  abstract findByName(name: string, schoolId: string): Promise<Product | null>;
  abstract findMany(
    schoolId: string,
    params: FindManyProductsParams,
  ): Promise<Product[]>;

  abstract countMany(
    schoolId: string,
    params: Pick<FindManyProductsParams, 'search'>,
  ): Promise<number>;

  abstract update(
    id: string,
    schoolId: string,
    data: UpdateProductRepositoryData,
    db?: DbContext,
  ): Promise<Product>;

  abstract delete(id: string, schoolId: string, tx?: DbContext): Promise<void>;
}
