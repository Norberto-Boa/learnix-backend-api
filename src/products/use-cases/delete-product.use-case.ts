import { Injectable } from "@nestjs/common";
import { ProductsRepository } from '../repositories/products.repository';
import type { DbContext } from "@/prisma/shared/db-context";
import { ProductNotFoundError } from "../errors/product-not-found.error";

export interface DeleteProductUseCaseRequest{
  id: string
}

@Injectable()
export class DeleteProductUseCase {
  constructor (private readonly productsRepository: ProductsRepository){}

  async execute({id}: DeleteProductUseCaseRequest, schoolId: string, db?: DbContext){
    const product = await this.productsRepository.findById(id, schoolId);

    if(!product){
      throw new ProductNotFoundError();
    }

    await this.productsRepository.delete(id, schoolId, db);
  }
}