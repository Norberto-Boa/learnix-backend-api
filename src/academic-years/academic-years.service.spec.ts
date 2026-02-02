import { InMemoryAcademicYearsRepository } from '@test/repositories/in-memory-academic-years-repository';
import { AcademicYearsService } from './academic-years.service';
import { ConflictException } from '@nestjs/common';

describe('AcademicYearsService (In-Memory)', () => {
  let service: AcademicYearsService;
  let inMemoryRespository: InMemoryAcademicYearsRepository;
  let mockAudit: any;
  let mockPrisma: any;

  beforeEach(() => {
    inMemoryRespository = new InMemoryAcademicYearsRepository();

    mockAudit = {
      log: vi.fn(),
    };

    mockPrisma = {
      $transaction: vi.fn(async (cb) => {
        const tx = {}; // fake prisma transaction object
        return cb(tx);
      }),
    };

    service = new AcademicYearsService(
      mockPrisma as any,
      inMemoryRespository as any,
      mockAudit,
    );
  });

  it('should create an academic year', async () => {
    const result = await service.create(
      {
        year: 2026,
        label: '2026',
        startDate: new Date('2026-09-01'),
        endDate: new Date('2027-06-30'),
        isActive: true,
      },
      'school-123',
      'user-456',
    );

    expect(result.id).toBeDefined();
    expect(inMemoryRespository.items.length).toBe(1);
    expect(mockPrisma.$transaction).toHaveBeenCalled();
    expect(mockAudit.log).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'CREATE_ACADEMIC_YEAR',
      }),
      expect.anything(),
    );
  });

  it('should not allow creating duplicate academic years', async () => {
    await service.create(
      {
        year: 2026,
        label: '2026',
        startDate: new Date('2026-09-01'),
        endDate: new Date('2027-06-30'),
        isActive: true,
      },
      'school-123',
      'user-456',
    );

    await expect(
      service.create(
        {
          year: 2026,
          label: '2026',
          startDate: new Date('2026-09-01'),
          endDate: new Date('2027-06-30'),
          isActive: true,
        },
        'school-123',
        'user-456',
      ),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('should deactivate other academic years when creating an active one', async () => {
    const first = await service.create(
      {
        year: 2025,
        label: '2025',
        startDate: new Date('2025-09-01'),
        endDate: new Date('2026-06-30'),
        isActive: true,
      },
      'school-123',
      'user-456',
    );

    const second = await service.create(
      {
        year: 2026,
        label: '2026',
        startDate: new Date('2026-09-01'),
        endDate: new Date('2027-06-30'),
        isActive: true,
      },
      'school-123',
      'user-456',
    );

    const activeYears = inMemoryRespository.items.filter(
      (year) => year.isActive,
    );

    expect(activeYears.length).toBe(1);
    expect(activeYears[0].id).toBe(second.id);
  });
});
