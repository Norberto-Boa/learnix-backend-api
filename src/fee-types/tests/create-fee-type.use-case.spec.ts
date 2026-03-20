import { InMemoryFeeTypesRepository } from "../repositories/in-memory/in-memory-fee-types.repository";
import { CreateFeeTypeUseCase } from "../use-cases/create-fee-type.use-case";
import { feeTypeFactory } from '../../../test/factories/feeType.factory';

let inMemoryFeeTypesRepository: InMemoryFeeTypesRepository;
let sut: CreateFeeTypeUseCase;

describe('Create Fee Type Use Case', () => {
  beforeEach(() => {
    inMemoryFeeTypesRepository = new InMemoryFeeTypesRepository();
    sut = new CreateFeeTypeUseCase(inMemoryFeeTypesRepository);
  });

  it('Should be able to create a fee type', async () => {
    const result = await sut.execute({
      ...feeTypeFactory()
    }, 'school-id')

    expect(result.id).toEqual(expect.any(String));
  })

  it('should create with default values when optional fields are not provided', async () => {
    const result = await sut.execute({
      name: 'Late Fine',
      code: 'LT'
    }, 'school-id')

    expect(result.category).toBe('NORMAL')
    expect(result.isRecurring).toBe(false)
  })

  it('Should allow same code in different schools', async () => {
    await sut.execute(feeTypeFactory({
      code: 'Tuition'
    }), 'school-1')

    const result = await sut.execute(feeTypeFactory({
      code: 'Tuition'
    }), 'school-2')

    expect(result.schoolId).toBe('school-2');
  })

  it('Should allow same code in different schools', async () => {
    await sut.execute(feeTypeFactory({
      code: 'Tuition'
    }), 'school-1')

    const result = await sut.execute(feeTypeFactory({
      code: 'Tuition'
    }), 'school-2')

    expect(result.schoolId).toBe('school-2');
  })
})