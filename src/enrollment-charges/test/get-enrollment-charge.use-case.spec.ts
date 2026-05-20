import { InMemoryEnrollmentChargesRepository } from '@/enrollment-charges/repositories/in-memory/in-memory-enrollment-charges.repository';
import { GetEnrollmentChargeUseCase } from '../use-cases/get-enrollment-charge.use-case';
import { enrollmentChargeFactory } from '@test/factories/enrollment-charges.factory';
import { EnrollmentChargeNotFoundError } from '@/enrollment-charges/errors/enrollment-charge-not-found.error';

let enrollmentChargesRepository: InMemoryEnrollmentChargesRepository;
let sut: GetEnrollmentChargeUseCase;

describe('GetEnrollmentChargeUseCase', () => {
  beforeEach(() => {
    enrollmentChargesRepository = new InMemoryEnrollmentChargesRepository();
    sut = new GetEnrollmentChargeUseCase(enrollmentChargesRepository);
  });

  it('Should be able to get an enrollment charge', async () => {
    const toBeCreated = enrollmentChargeFactory();

    const enrollmentCharge = await enrollmentChargesRepository.save(
      {
        ...toBeCreated,
        totalAmount: toBeCreated.baseAmount + toBeCreated.penaltyAmount,
        paidAmount: 0,
        balanceAmount: toBeCreated.baseAmount + toBeCreated.penaltyAmount,
      },
      'school-1',
    );

    const result = await sut.execute({ id: enrollmentCharge.id }, 'school-1');

    expect(result.enrollmentCharge.id).toBe(enrollmentCharge.id);
  });

  it('Should not be able to get an enrollment charge from another school', async () => {
    const toBeCreated = enrollmentChargeFactory();

    const enrollmentCharge = await enrollmentChargesRepository.save(
      {
        ...toBeCreated,
        totalAmount: toBeCreated.baseAmount + toBeCreated.penaltyAmount,
        paidAmount: 0,
        balanceAmount: toBeCreated.baseAmount + toBeCreated.penaltyAmount,
      },
      'school-1',
    );

    await expect(() =>
      sut.execute(
        {
          id: enrollmentCharge.id,
        },
        'school-2',
      ),
    ).rejects.toBeInstanceOf(EnrollmentChargeNotFoundError);
  });

  it('Should not be able to get a non-existing enrollment charge', async () => {
    await expect(() =>
      sut.execute(
        {
          id: 'non-existing-charge',
        },
        'school-1',
      ),
    ).rejects.toBeInstanceOf(EnrollmentChargeNotFoundError);
  });

  it('Should not be able to get a deleted enrollment charge', async () => {
    const toBeCreated = enrollmentChargeFactory();

    const enrollmentCharge = await enrollmentChargesRepository.save(
      {
        ...toBeCreated,
        totalAmount: toBeCreated.baseAmount + toBeCreated.penaltyAmount,
        paidAmount: 0,
        balanceAmount: toBeCreated.baseAmount + toBeCreated.penaltyAmount,
      },
      'school-1',
    );

    await enrollmentChargesRepository.delete(enrollmentCharge.id, 'school-1');

    await expect(() =>
      sut.execute(
        {
          id: enrollmentCharge.id,
        },
        'school-1',
      ),
    ).rejects.toBeInstanceOf(EnrollmentChargeNotFoundError);
  });
});
