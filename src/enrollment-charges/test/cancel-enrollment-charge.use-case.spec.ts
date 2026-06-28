import { InMemoryEnrollmentChargesRepository } from '@/enrollment-charges/repositories/in-memory/in-memory-enrollment-charges.repository';
import { CancelEnrollmentChargeUseCase } from '../use-cases/cancel-enrollment-charge.use-case';
import { enrollmentChargeFactory } from '@test/factories/enrollment-charges.factory';
import { EnrollmentChargeNotFoundError } from '@/enrollment-charges/errors/enrollment-charge-not-found.error';
import { EnrollmentChargeAlreadyCancelled } from '../errors/enrollment-charge-already-cancelled.error';
import { EnrollmentChargeWithPaymentCannotBeCancelled } from '@/enrollment-charges/errors/enrollment-charge-with-payment-cannot-be-cancelled.error';

let enrollmentChargesRepository: InMemoryEnrollmentChargesRepository;
let sut: CancelEnrollmentChargeUseCase;

describe('CancelEnrollmentChargeUseCase', () => {
  beforeEach(() => {
    enrollmentChargesRepository = new InMemoryEnrollmentChargesRepository();
    sut = new CancelEnrollmentChargeUseCase(enrollmentChargesRepository);
  });

  it('Should be able to cancel a pending enrollment charge', async () => {
    const enrollmentCharge = await enrollmentChargesRepository.save(
      {
        ...enrollmentChargeFactory({
          baseAmount: 3500,
          status: 'PENDING',
        }),
        totalAmount: 3500,
        paidAmount: 0,
        balanceAmount: 3500,
      },
      'school-id',
    );

    const result = await sut.execute(
      {
        id: enrollmentCharge.id,
      },
      'school-id',
    );

    expect(result.enrollmentCharge.status).toBe('CANCELLED');
  });

  it('Should be able to cancel an invoiced enrollment charge', async () => {
    const enrollmentCharge = await enrollmentChargesRepository.save(
      {
        ...enrollmentChargeFactory({
          baseAmount: 3500,
          status: 'INVOICED',
        }),
        totalAmount: 3500,
        paidAmount: 0,
        balanceAmount: 3500,
      },
      'school-id',
    );

    const result = await sut.execute(
      {
        id: enrollmentCharge.id,
      },
      'school-id',
    );

    expect(result.enrollmentCharge.status).toBe('CANCELLED');
  });

  it('Should not be able to cancel non-existing enrollment charge', async () => {
    await expect(() =>
      sut.execute(
        {
          id: 'non-existing-charge',
        },
        'school-id',
      ),
    ).rejects.toBeInstanceOf(EnrollmentChargeNotFoundError);
  });

  it('Should not be able to cancel an enrollment charge from another school', async () => {
    const enrollmentCharge = await enrollmentChargesRepository.save(
      {
        ...enrollmentChargeFactory({
          baseAmount: 3500,
          status: 'INVOICED',
        }),
        totalAmount: 3500,
        paidAmount: 0,
        balanceAmount: 3500,
      },
      'school-1',
    );

    await expect(() =>
      sut.execute(
        {
          id: enrollmentCharge.id,
        },
        'school-id',
      ),
    ).rejects.toBeInstanceOf(EnrollmentChargeNotFoundError);
  });

  it('Should not be able to cancel an already cancelled enrollment charge', async () => {
    const enrollmentCharge = await enrollmentChargesRepository.save(
      {
        ...enrollmentChargeFactory({
          baseAmount: 3500,
          status: 'CANCELLED',
        }),
        totalAmount: 3500,
        paidAmount: 0,
        balanceAmount: 3500,
      },
      'school-id',
    );

    await expect(() =>
      sut.execute(
        {
          id: enrollmentCharge.id,
        },
        'school-id',
      ),
    ).rejects.toBeInstanceOf(EnrollmentChargeAlreadyCancelled);
  });

  it('Should not be able to cancel an enrollment charge associated with a payment', async () => {
    const enrollmentCharge = await enrollmentChargesRepository.save(
      {
        ...enrollmentChargeFactory({
          baseAmount: 3500,
          status: 'PARTIALLY_PAID',
        }),
        totalAmount: 3500,
        paidAmount: 0,
        balanceAmount: 3500,
      },
      'school-id',
    );

    await expect(() =>
      sut.execute(
        {
          id: enrollmentCharge.id,
        },
        'school-id',
      ),
    ).rejects.toBeInstanceOf(EnrollmentChargeWithPaymentCannotBeCancelled);
  });
});
