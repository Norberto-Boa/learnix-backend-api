import { InMemoryEnrollmentChargesRepository } from '@/enrollment-charges/repositories/in-memory/in-memory-enrollment-charges.repository';
import { FetchEnrollmentChargesUseCase } from '@/enrollment-charges/use-cases/fetch-enrollment-charges.use-case';
import { enrollmentChargeFactory } from '@test/factories/enrollment-charges.factory';

let enrollmentChargesRepository: InMemoryEnrollmentChargesRepository;
let sut: FetchEnrollmentChargesUseCase;

describe('Fetch Enrollment Charges Use Case', () => {
  beforeEach(() => {
    enrollmentChargesRepository = new InMemoryEnrollmentChargesRepository();
    sut = new FetchEnrollmentChargesUseCase(enrollmentChargesRepository);
  });

  it('Should be able to fetch enrollment charges', async () => {
    const toBeCreated = enrollmentChargeFactory();
    const toBeCreated2 = enrollmentChargeFactory();

    await enrollmentChargesRepository.save(
      {
        ...toBeCreated,
        totalAmount: toBeCreated.baseAmount + toBeCreated.penaltyAmount,
        paidAmount: 0,
        balanceAmount: toBeCreated.baseAmount + toBeCreated.penaltyAmount,
      },
      'school-1',
    );

    await enrollmentChargesRepository.save(
      {
        ...toBeCreated2,
        totalAmount: toBeCreated.baseAmount + toBeCreated.penaltyAmount,
        paidAmount: 0,
        balanceAmount: toBeCreated.baseAmount + toBeCreated.penaltyAmount,
      },
      'school-1',
    );

    const result = await sut.execute('school-1', {});

    expect(result.enrollmentCharges).toHaveLength(2);
  });

  it('Should not to fetch enrollment charges from another school', async () => {
    const toBeCreated = enrollmentChargeFactory();
    const toBeCreated2 = enrollmentChargeFactory();

    await enrollmentChargesRepository.save(
      {
        ...toBeCreated,
        totalAmount: toBeCreated.baseAmount + toBeCreated.penaltyAmount,
        paidAmount: 0,
        balanceAmount: toBeCreated.baseAmount + toBeCreated.penaltyAmount,
      },
      'school-1',
    );

    await enrollmentChargesRepository.save(
      {
        ...toBeCreated2,
        totalAmount: toBeCreated.baseAmount + toBeCreated.penaltyAmount,
        paidAmount: 0,
        balanceAmount: toBeCreated.baseAmount + toBeCreated.penaltyAmount,
      },
      'school-2',
    );

    const result = await sut.execute('school-1', {});

    expect(result.enrollmentCharges).toHaveLength(1);
  });

  it('Should be able filter enrollment charges from by enrollment id', async () => {
    const toBeCreated = enrollmentChargeFactory({
      enrollmentId: 'enrollment-1',
    });
    const toBeCreated2 = enrollmentChargeFactory();

    await enrollmentChargesRepository.save(
      {
        ...toBeCreated,
        totalAmount: toBeCreated.baseAmount + toBeCreated.penaltyAmount,
        paidAmount: 0,
        balanceAmount: toBeCreated.baseAmount + toBeCreated.penaltyAmount,
      },
      'school-1',
    );

    await enrollmentChargesRepository.save(
      {
        ...toBeCreated2,
        totalAmount: toBeCreated.baseAmount + toBeCreated.penaltyAmount,
        paidAmount: 0,
        balanceAmount: toBeCreated.baseAmount + toBeCreated.penaltyAmount,
      },
      'school-1',
    );

    const result = await sut.execute('school-1', {
      enrollmentId: toBeCreated.enrollmentId,
    });

    expect(result.enrollmentCharges).toHaveLength(1);
  });

  it('Should be able filter enrollment charges from by academic year', async () => {
    const toBeCreated = enrollmentChargeFactory({
      enrollmentId: 'enrollment-1',
      academicYearId: 'academic-year-1',
    });
    const toBeCreated2 = enrollmentChargeFactory();

    await enrollmentChargesRepository.save(
      {
        ...toBeCreated,
        totalAmount: toBeCreated.baseAmount + toBeCreated.penaltyAmount,
        paidAmount: 0,
        balanceAmount: toBeCreated.baseAmount + toBeCreated.penaltyAmount,
      },
      'school-1',
    );

    await enrollmentChargesRepository.save(
      {
        ...toBeCreated2,
        totalAmount: toBeCreated.baseAmount + toBeCreated.penaltyAmount,
        paidAmount: 0,
        balanceAmount: toBeCreated.baseAmount + toBeCreated.penaltyAmount,
      },
      'school-1',
    );

    const result = await sut.execute('school-1', {
      academicYearId: toBeCreated.academicYearId,
    });

    expect(result.enrollmentCharges).toHaveLength(1);
  });

  it('Should be able filter enrollment charges from by reference year and month', async () => {
    const toBeCreated = enrollmentChargeFactory({
      referenceMonth: 2,
      referenceYear: 2026,
    });
    const toBeCreated2 = enrollmentChargeFactory();

    await enrollmentChargesRepository.save(
      {
        ...toBeCreated,
        totalAmount: toBeCreated.baseAmount + toBeCreated.penaltyAmount,
        paidAmount: 0,
        balanceAmount: toBeCreated.baseAmount + toBeCreated.penaltyAmount,
      },
      'school-1',
    );

    await enrollmentChargesRepository.save(
      {
        ...toBeCreated2,
        totalAmount: toBeCreated.baseAmount + toBeCreated.penaltyAmount,
        paidAmount: 0,
        balanceAmount: toBeCreated.baseAmount + toBeCreated.penaltyAmount,
      },
      'school-1',
    );

    const result = await sut.execute('school-1', {
      referenceYear: 2026,
      referenceMonth: 2,
    });

    expect(result.enrollmentCharges).toHaveLength(1);
  });

  it('Should be able filter enrollment charges from by status', async () => {
    const toBeCreated = enrollmentChargeFactory({
      status: 'INVOICED',
    });
    const toBeCreated2 = enrollmentChargeFactory();

    await enrollmentChargesRepository.save(
      {
        ...toBeCreated,
        totalAmount: toBeCreated.baseAmount + toBeCreated.penaltyAmount,
        paidAmount: 0,
        balanceAmount: toBeCreated.baseAmount + toBeCreated.penaltyAmount,
      },
      'school-1',
    );

    await enrollmentChargesRepository.save(
      {
        ...toBeCreated2,
        totalAmount: toBeCreated.baseAmount + toBeCreated.penaltyAmount,
        paidAmount: 0,
        balanceAmount: toBeCreated.baseAmount + toBeCreated.penaltyAmount,
      },
      'school-1',
    );

    const result = await sut.execute('school-1', {
      status: 'INVOICED',
    });

    expect(result.enrollmentCharges).toHaveLength(1);
  });

  it('Should be able to paginate charges', async () => {
    const toBeCreated = enrollmentChargeFactory({});
    const toBeCreated2 = enrollmentChargeFactory();

    await enrollmentChargesRepository.save(
      {
        ...toBeCreated,
        totalAmount: toBeCreated.baseAmount + toBeCreated.penaltyAmount,
        paidAmount: 0,
        balanceAmount: toBeCreated.baseAmount + toBeCreated.penaltyAmount,
      },
      'school-1',
    );

    await enrollmentChargesRepository.save(
      {
        ...toBeCreated2,
        totalAmount: toBeCreated.baseAmount + toBeCreated.penaltyAmount,
        paidAmount: 0,
        balanceAmount: toBeCreated.baseAmount + toBeCreated.penaltyAmount,
      },
      'school-1',
    );

    const result = await sut.execute('school-1', {
      page: 1,
      limit: 1,
    });

    expect(result.enrollmentCharges).toHaveLength(1);
  });
});
