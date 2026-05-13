import { productFactory } from "@test/factories/product.factory";
import { InMemoryProductsRepository } from "../repositories/in-memory/in-memory-products.repository";
import { DeleteProductUseCase } from "../use-cases/delete-product.use-case";
import { ProductNotFoundError } from "../errors/product-not-found.error";

let productsRepository: InMemoryProductsRepository;
let sut: DeleteProductUseCase;

describe('DeleteProductUseCase', () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();
    sut = new DeleteProductUseCase(productsRepository);
  })

  it('Should be able to delete a product', async () => {
    const product = await productsRepository.save(productFactory(), 'school-1');


    await sut.execute({id: product.id}, 'school-1');

    expect(productsRepository.items[0].deletedAt).toBeTruthy();
    expect(productsRepository.items[0].deletedAt).toEqual(expect.any(Date));
  })

  it('Should not be able to delete a non-existent product', async () => {
    await expect(() =>
      sut.execute({
        id: 'non-existent-product-id'
      }, 'school-1')
    ).rejects.toBeInstanceOf(ProductNotFoundError);
  });

  it('Should not be able to delete product from another school', async () => {
    const product = await productsRepository.save(productFactory(), 'school-1');

    await expect(() => 
      sut.execute({
        id: product.id
      }, 'school-2')
    ).rejects.toBeInstanceOf(ProductNotFoundError);
  })

  it('Should not find product after deletion', async () => {
    const product = await productsRepository.save(productFactory(), 'school-1');

    await sut.execute({id: product.id}, 'school-1');

    const deletedProduct = await productsRepository.findById(product.id, 'school-1');

    expect(deletedProduct).toBeNull();
  })
})