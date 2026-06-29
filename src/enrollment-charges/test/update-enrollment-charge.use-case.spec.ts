import { enrollmentChargeFactory } from '@test/factories/enrollment-charges.factory';
import { InMemoryEnrollmentChargesRepository } from '../repositories/in-memory/in-memory-enrollment-charges.repository';
import { UpdateEnrollmentChargeUseCase } from '../use-cases/update-enrollment-charge.use-case';
import { EnrollmentChargeNotFoundError } from '@/enrollment-charges/errors/enrollment-charge-not-found.error';
import { EnrollmentChargeCannotBeUpdatedError } from '@/enrollment-charges/errors/enrollment-charge-cannot-be-updated.error';

let enrollmentChargesRepository: InMemoryEnrollmentChargesRepository;
let sut: UpdateEnrollmentChargeUseCase;

describe('UpdateEnrollmentChargeUseCase', () => {
  beforeEach(() => {
    enrollmentChargesRepository = new InMemoryEnrollmentChargesRepository();
    sut = new UpdateEnrollmentChargeUseCase(enrollmentChargesRepository);
  });

  it('Should be able to update an enrollment charge', async () => {
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

    const result = await sut.execute(enrollmentCharge.id, 'school-id', {
      dueDate: new Date('2026-01-15'),
      baseAmount: 4000,
      penaltyAmount: 500,
    });

    expect(result.new.baseAmount).toBe(4000);
    expect(result.old.balanceAmount).toBe(3500);
  });

  it('Should be able to update only the due date', async () => {
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

    const result = await sut.execute(enrollmentCharge.id, 'school-id', {
      dueDate: new Date('2026-01-20'),
    });

    expect(result.new.balanceAmount).toBe(3500);
  });

  it('Should be able to update only the base amount and recalculate total and balance', async () => {
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

    const result = await sut.execute(enrollmentCharge.id, 'school-id', {
      baseAmount: 5000,
    });

    expect(result.new.balanceAmount).toBe(5000);
  });

  it('Should be able to update only the penalty amount and recalcuaate total and balance', async () => {
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

    const result = await sut.execute(enrollmentCharge.id, 'school-id', {
      penaltyAmount: 1000,
    });

    expect(result.new.balanceAmount).toBe(4500);
    expect(result.new.totalAmount).toBe(4500);
  });

  it('Should be able to keep paid amount unchaged and recalculate balance amount', async () => {
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

    const result = await sut.execute(enrollmentCharge.id, 'school-id', {
      penaltyAmount: 500,
      baseAmount: 5000,
    });

    expect(result.new.balanceAmount).toBe(4500);
    expect(result.new.totalAmount).toBe(5500);
  });

  it('Should not be able to update an enrollment charge from another school', async () => {
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

    await expect(() =>
      sut.execute(enrollmentCharge.id, 'school-2', { baseAmount: 4000 }),
    ).rejects.toBeInstanceOf(EnrollmentChargeNotFoundError);
  });

  it('Should not be able to update an invoiced enrollment charge', async () => {
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

    await expect(() =>
      sut.execute(enrollmentCharge.id, 'school-id', { baseAmount: 400 }),
    ).rejects.toBeInstanceOf(EnrollmentChargeCannotBeUpdatedError);
  });

  it('Should not be able to update an partially paid enrollment charge', async () => {
    const enrollmentCharge = await enrollmentChargesRepository.save(
      {
        ...enrollmentChargeFactory({
          baseAmount: 3500,
          status: 'PARTIALLY_PAID',
        }),
        totalAmount: 3500,
        paidAmount: 200,
        balanceAmount: 3500,
      },
      'school-id',
    );

    await expect(() =>
      sut.execute(enrollmentCharge.id, 'school-id', { baseAmount: 4000 }),
    ).rejects.toBeInstanceOf(EnrollmentChargeCannotBeUpdatedError);
  });

  it('Should not be able to update an paid enrollment charge', async () => {
    const enrollmentCharge = await enrollmentChargesRepository.save(
      {
        ...enrollmentChargeFactory({
          baseAmount: 3500,
          status: 'PAID',
        }),
        totalAmount: 3500,
        paidAmount: 3500,
        balanceAmount: 3500,
      },
      'school-id',
    );

    await expect(() =>
      sut.execute(enrollmentCharge.id, 'school-id', { baseAmount: 4000 }),
    ).rejects.toBeInstanceOf(EnrollmentChargeCannotBeUpdatedError);
  });

  it('Should not be able to update an cancelled enrollment charge', async () => {
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
      sut.execute(enrollmentCharge.id, 'school-id', { baseAmount: 4000 }),
    ).rejects.toBeInstanceOf(EnrollmentChargeCannotBeUpdatedError);
  });

  it('Should not be able to update tolal amount to lower than paid amount', async () => {
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
      sut.execute(enrollmentCharge.id, 'school-id', { baseAmount: 2000 }),
    ).rejects.toBeInstanceOf(EnrollmentChargeCannotBeUpdatedError);
  });
});
