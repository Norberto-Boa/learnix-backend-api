export interface ClassroomDomain {
  id: string;
  name: string;
  capacity: number;
  gradeId: string;
  academicYearId: string;
  schoolId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
