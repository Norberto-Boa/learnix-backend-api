export interface Product {
  id: string;
  name: string;
  code: string;
  price: number;
  schoolId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
