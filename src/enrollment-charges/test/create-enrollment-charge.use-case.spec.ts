import { InMemoryEnrollmentChargesRepository } from '../repositories/in-memory/in-memory-enrollment-charges.repository';
import { CreateEnrollmentChargeUseCase } from '../use-cases/create-enrollment-charge.use-case';
import { InMemoryFeeTypesRepository } from '../../fee-types/repositories/in-memory/in-memory-fee-types.repository';
import { InMemoryEnrollmentsRepository } from '../../enrollments/repositories/in-memory/in-memory-enrollments.repository';
import { InMemoryAcademicYearsRepository } from '../../academic-years/repositories/in-memory/in-memory-academic-years-repository';
import type { Enrollment } from '@/enrollments/domain/enrollment';
import type { FeeTypeDomain } from '@/fee-types/domain/fee-type';
import type { AcademicYearDomain } from '@/academic-years/domain/academic-year';
import { enrollmentFactory } from '@test/factories/enrollment.factory';
import { feeTypeFactory } from '@test/factories/feeType.factory';
import { academicYearFactory } from '@test/factories/academicYear.factory';
import { enrollmentChargeFactory } from '../../../test/factories/enrollment-charges.factory';
import { EnrollmentChargeAlreadyExistsError } from '@/enrollment-charges/errors/enrollment-charge-already-exists.error';
import { EnrollmentNotFoundError } from '@/enrollments/errors/enrollment-not-found.error';
import { FeeTypeNotFoundError } from '@/fee-types/errors/fee-type-not-found.error';
import { AcademicYearNotFoundError } from '../../academic-years/errors/academic-year-not-found.error';
import { EnrollmentAcademicYearDoesNotMatchAcademicYearError } from '@/enrollment-charges/errors/enrollment-academic-year-does-not-match-academic-year.error';

let enrollmentChargesRepository: InMemoryEnrollmentChargesRepository;
let feeTypeRepoistory: InMemoryFeeTypesRepository;
let enrollmentsRepository: InMemoryEnrollmentsRepository;
let academicYearRepository: InMemoryAcademicYearsRepository;
let sut: CreateEnrollmentChargeUseCase;

let enrollment: Enrollment;
let feeType: FeeTypeDomain;
let academicYear: AcademicYearDomain;

describe('CreateEnrollmentChargeUseCase', () => {
  beforeEach(async () => {
    enrollmentChargesRepository = new InMemoryEnrollmentChargesRepository();
    feeTypeRepoistory = new InMemoryFeeTypesRepository();
    enrollmentsRepository = new InMemoryEnrollmentsRepository();
    academicYearRepository = new InMemoryAcademicYearsRepository();
    sut = new CreateEnrollmentChargeUseCase(
      enrollmentChargesRepository,
      enrollmentsRepository,
      feeTypeRepoistory,
      academicYearRepository,
    );

    academicYear = await academicYearRepository.save(
      academicYearFactory({ schoolId: 'school-1' }),
    );
    enrollment = await enrollmentsRepository.save(
      enrollmentFactory({
        schoolId: 'school-1',
        academicYearId: academicYear.id,
      }),
    );
    feeType = await feeTypeRepoistory.save(feeTypeFactory(), 'school-1');
  });

  it('Should be able to a create an enrollment charge', async () => {
    const result = await sut.execute(
      enrollmentChargeFactory({
        enrollmentId: enrollment.id,
        feeTypeId: feeType.id,
        academicYearId: academicYear.id,
      }),
      'school-1',
    );

    expect(result.enrollmentCharge.id).toEqual(expect.any(String));
    expect(result.enrollmentCharge.status).toBe('PENDING');
    expect(enrollmentChargesRepository.items).toHaveLength(1);
  });

  it('Should be able calculate total amount using base amount plus penalty amount', async () => {
    const result = await sut.execute(
      enrollmentChargeFactory({
        enrollmentId: enrollment.id,
        feeTypeId: feeType.id,
        academicYearId: academicYear.id,
        baseAmount: 3500,
        penaltyAmount: 500,
      }),
      'school-1',
    );

    expect(result.enrollmentCharge.baseAmount).toBe(3500);
    expect(result.enrollmentCharge.penaltyAmount).toBe(500);
    expect(result.enrollmentCharge.totalAmount).toBe(4000);
    expect(result.enrollmentCharge.balanceAmount).toBe(4000);
  });

  it('Should be able to set penalty amount to zero when is not provided', async () => {
    const result = await sut.execute(
      enrollmentChargeFactory({
        enrollmentId: enrollment.id,
        feeTypeId: feeType.id,
        academicYearId: academicYear.id,
        penaltyAmount: undefined,
      }),
      'school-1',
    );

    expect(result.enrollmentCharge.penaltyAmount).toBe(0);
  });

  it('Should not be able to create duplicated charge for same enrollment, fee type, year and month', async () => {
    await sut.execute(
      enrollmentChargeFactory({
        enrollmentId: enrollment.id,
        feeTypeId: feeType.id,
        academicYearId: academicYear.id,
        referenceYear: 2014,
        referenceMonth: 10,
      }),
      'school-1',
    );

    await expect(() =>
      sut.execute(
        enrollmentChargeFactory({
          enrollmentId: enrollment.id,
          feeTypeId: feeType.id,
          academicYearId: academicYear.id,
          referenceYear: 2014,
          referenceMonth: 10,
        }),
        'school-1',
      ),
    ).rejects.toBeInstanceOf(EnrollmentChargeAlreadyExistsError);
  });

  it('Should allow same fee type and month for different enrollments', async () => {
    const secondEnrollment = await enrollmentsRepository.save(
      enrollmentFactory({
        schoolId: 'school-1',
        academicYearId: academicYear.id,
      }),
    );

    await sut.execute(
      enrollmentChargeFactory({
        enrollmentId: enrollment.id,
        feeTypeId: feeType.id,
        academicYearId: academicYear.id,
        referenceYear: 2014,
        referenceMonth: 1,
      }),
      'school-1',
    );

    await sut.execute(
      enrollmentChargeFactory({
        enrollmentId: secondEnrollment.id,
        feeTypeId: feeType.id,
        academicYearId: academicYear.id,
        referenceYear: 2014,
        referenceMonth: 1,
      }),
      'school-1',
    );

    expect(enrollmentChargesRepository.items).toHaveLength(2);
  });

  it('Should not be able to create an enrollment charge invalid enrollment', async () => {
    await expect(() =>
      sut.execute(
        enrollmentChargeFactory({
          enrollmentId: 'invalid-enrollment',
          feeTypeId: feeType.id,
          academicYearId: academicYear.id,
          referenceYear: 2014,
          referenceMonth: 10,
        }),
        'school-1',
      ),
    ).rejects.toBeInstanceOf(EnrollmentNotFoundError);
  });

  it('Should not be able to create an enrollment charge invalid fee type', async () => {
    await expect(() =>
      sut.execute(
        enrollmentChargeFactory({
          enrollmentId: enrollment.id,
          feeTypeId: 'invalid-fee-type',
          academicYearId: academicYear.id,
          referenceYear: 2014,
          referenceMonth: 10,
        }),
        'school-1',
      ),
    ).rejects.toBeInstanceOf(FeeTypeNotFoundError);
  });

  it('Should not be able to create an enrollment charge invalid academic year', async () => {
    await expect(() =>
      sut.execute(
        enrollmentChargeFactory({
          enrollmentId: enrollment.id,
          feeTypeId: feeType.id,
          academicYearId: 'invalid-academic-year',
          referenceYear: 2014,
          referenceMonth: 10,
        }),
        'school-1',
      ),
    ).rejects.toBeInstanceOf(AcademicYearNotFoundError);
  });

  it('Should not be able to create an enrollment charge  for an academic year different from enrollment academic year', async () => {
    const secondAcademicYear = await academicYearRepository.save(
      academicYearFactory({
        schoolId: 'school-1',
      }),
    );

    await expect(() =>
      sut.execute(
        enrollmentChargeFactory({
          enrollmentId: enrollment.id,
          feeTypeId: feeType.id,
          academicYearId: secondAcademicYear.id,
          referenceYear: 2014,
          referenceMonth: 10,
        }),
        'school-1',
      ),
    ).rejects.toBeInstanceOf(
      EnrollmentAcademicYearDoesNotMatchAcademicYearError,
    );
  });
});
