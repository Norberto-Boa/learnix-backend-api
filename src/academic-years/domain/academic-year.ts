export interface AcademicYearDomain {
  id: string;
  year: number;
  label: string;
  startDate: Date;
  endDate: Date;
  schoolId: string;
  isActive: boolean;
  isClosed: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
