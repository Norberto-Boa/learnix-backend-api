import type {
  CreateProductRepositoryData,
  FindManyProductsParams,
  ProductsRepository,
  UpdateProductRepositoryData,
} from '../products.repository';
import { Product } from '../../domain/product';

export class InMemoryProductsRepository implements ProductsRepository {
  public items: Product[] = [];

  async save(
    data: CreateProductRepositoryData,
    schoolId: string,
  ): Promise<Product> {
    const product: Product = {
      id: crypto.randomUUID(),
      name: data.name,
      code: data.code ?? null,
      price: data.price,
      schoolId: schoolId,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    this.items.push(product);

    return product;
  }

  async findById(id: string, schoolId: string) {
    const product = this.items.find(
      (item) =>
        item.id === id && item.schoolId === schoolId && item.deletedAt === null,
    );

    return product ?? null;
  }

  async findByName(name: string, schoolId: string): Promise<Product | null> {
    const product = this.items.find(
      (item) =>
        item.name === name &&
        item.schoolId === schoolId &&
        item.deletedAt === null,
    );

    return product ?? null;
  }

  async findMany(
    schoolId: string,
    { page, limit, search }: FindManyProductsParams,
  ): Promise<Product[]> {
    const products = this.items
      .filter((item) => {
        if (item.schoolId !== schoolId) return false;
        if (item.deletedAt !== null) return false;

        if (search) {
          const normalizedSearch = search.toLowerCase();

          const nameMatches = item.name
            .toLowerCase()
            .includes(normalizedSearch);
          const codeMatches = item.code
            ?.toLowerCase()
            .includes(normalizedSearch);

          return nameMatches || codeMatches;
        }

        return true;
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return products.slice((page - 1) * limit, page * limit);
  }

  async countMany(
    schoolId: string,
    params: { search?: string },
  ): Promise<number> {
    const { search } = params;

    return this.items.filter((item) => {
      if (item.schoolId !== schoolId) return false;
      if (item.deletedAt !== null) return false;

      if (search) {
        const normalizedSearch = search.toLowerCase();

        const nameMatches = item.name.toLowerCase().includes(normalizedSearch);
        const codeMatches = item.code?.toLowerCase().includes(normalizedSearch);

        return nameMatches || codeMatches;
      }

      return true;
    }).length;
  }

  async delete(id: string, schoolId: string): Promise<void> {
    const index = this.items.findIndex(
      (item) =>
        item.id === id && item.schoolId === schoolId && item.deletedAt === null,
    );

    if (index < 0) {
      throw new Error('Product not found');
    }

    this.items[index] = {
      ...this.items[index],
      deletedAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
