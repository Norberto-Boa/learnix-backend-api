import { InMemoryEnrollmentChargesRepository } from '../repositories/in-memory/in-memory-enrollment-charges.repository';
import { DeleteEnrollmentChargeUseCase } from '../use-cases/delete-enrollment-charg.use-case';
import { enrollmentChargeFactory } from '../../../test/factories/enrollment-charges.factory';
import { EnrollmentChargeNotFoundError } from '../errors/enrollment-charge-not-found.error';
import { OnlyPendingEnrollmentChargesCanBeDeleted } from '../errors/only-pending-enrollment-charges-can-be-deleted.error';

let enrollmentChargesRepository: InMemoryEnrollmentChargesRepository;
let sut: DeleteEnrollmentChargeUseCase;

describe('DeleteEnrollmentChargeUseCase', () => {
  beforeEach(() => {
    enrollmentChargesRepository = new InMemoryEnrollmentChargesRepository();
    sut = new DeleteEnrollmentChargeUseCase(enrollmentChargesRepository);
  });

  it('Should be able to a pending enrollment charge', async () => {
    const enrollmentCharge = await enrollmentChargesRepository.save(
      {
        ...enrollmentChargeFactory({
          baseAmount: 3500,
          status: 'PENDING',
        }),
        baseAmount: 3500,
        totalAmount: 4500,
        penaltyAmount: 500,
        paidAmount: 1000,
        balanceAmount: 3000,
      },
      'school-id',
    );

    await sut.execute({ id: enrollmentCharge.id }, 'school-id');

    expect(enrollmentChargesRepository.items[0].deletedAt).toBeInstanceOf(Date);
  });

  it('Should not be able to get a deleted enrollment charge after delete', async () => {
    const enrollmentCharge = await enrollmentChargesRepository.save(
      {
        ...enrollmentChargeFactory({
          baseAmount: 3500,
          status: 'PENDING',
        }),
        baseAmount: 3500,
        totalAmount: 4500,
        penaltyAmount: 500,
        paidAmount: 1000,
        balanceAmount: 3000,
      },
      'school-id',
    );

    await sut.execute({ id: enrollmentCharge.id }, 'school-id');

    const deletedEnrollmentCharge = await enrollmentChargesRepository.findById(
      enrollmentCharge.id,
      'school-1',
    );

    expect(deletedEnrollmentCharge).toBeNull();
  });

  it('should not be able to delete a non-existing enrollment charge', async () => {
    await expect(() =>
      sut.execute(
        {
          id: 'non-existing-charge',
        },
        'school-id',
      ),
    ).rejects.toBeInstanceOf(EnrollmentChargeNotFoundError);
  });

  it('Should not be able to delete an enrollment charge from another school', async () => {
    const enrollmentCharge = await enrollmentChargesRepository.save(
      {
        ...enrollmentChargeFactory({
          baseAmount: 3500,
          status: 'PENDING',
        }),
        totalAmount: 3500,
        paidAmount: 3000,
        balanceAmount: 3500,
      },
      'school-id',
    );

    await expect(() =>
      sut.execute(
        {
          id: enrollmentCharge.id,
        },
        'school-1',
      ),
    ).rejects.toBeInstanceOf(EnrollmentChargeNotFoundError);
  });

  it('Should not be able to delete an invoiced enrollment charge', async () => {
    const enrollmentCharge = await enrollmentChargesRepository.save(
      {
        ...enrollmentChargeFactory({
          baseAmount: 3500,
          status: 'INVOICED',
        }),
        totalAmount: 3500,
        paidAmount: 3000,
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
    ).rejects.toBeInstanceOf(OnlyPendingEnrollmentChargesCanBeDeleted);
  });

  it('Should not be able to delete an partially paid enrollment charge', async () => {
    const enrollmentCharge = await enrollmentChargesRepository.save(
      {
        ...enrollmentChargeFactory({
          baseAmount: 3500,
          status: 'PARTIALLY_PAID',
        }),
        totalAmount: 3500,
        paidAmount: 3000,
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
    ).rejects.toBeInstanceOf(OnlyPendingEnrollmentChargesCanBeDeleted);
  });

  it('Should not be able to delete a paid enrollment charge', async () => {
    const enrollmentCharge = await enrollmentChargesRepository.save(
      {
        ...enrollmentChargeFactory({
          baseAmount: 3500,
          status: 'PAID',
        }),
        totalAmount: 3500,
        paidAmount: 3000,
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
    ).rejects.toBeInstanceOf(OnlyPendingEnrollmentChargesCanBeDeleted);
  });

  it('Should not be able to delete a cancelled enrollment charge', async () => {
    const enrollmentCharge = await enrollmentChargesRepository.save(
      {
        ...enrollmentChargeFactory({
          baseAmount: 3500,
          status: 'CANCELLED',
        }),
        totalAmount: 3500,
        paidAmount: 3000,
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
    ).rejects.toBeInstanceOf(OnlyPendingEnrollmentChargesCanBeDeleted);
  });
});
