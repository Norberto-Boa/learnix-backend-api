export interface DocumentTypeDomain {
  id: string;
  type: string;
  label: string;
  schoolId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
