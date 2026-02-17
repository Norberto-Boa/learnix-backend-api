import { GENDER, STUDENT_STATUS } from '@/generated/prisma/enums';

export interface StudentDomain {
  id: string;
  name: string;
  registrationNumber: string;
  dateOfBirth: Date;
  gender: GENDER;
  status: STUDENT_STATUS;
  schoolId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface StudentProps {
  id: string;
  name: string;
  registrationNumber: string;
  dateOfBirth: Date;
  gender: GENDER;
  status: STUDENT_STATUS;
  schoolId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export class Student {
  private constructor(private props: StudentProps) {}

  static create(
    props: Omit<StudentProps, 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ) {
    if (!props.name.trim()) {
      throw new Error('Student name is required');
    }

    if (!props.registrationNumber.trim()) {
      throw new Error('Registration number is required');
    }

    if (props.dateOfBirth > new Date()) {
      throw new Error('Invalid birth date');
    }

    return new Student({
      ...props,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });
  }

  update(data: Partial<StudentProps>) {
    if (data.name !== undefined && !data.name.trim()) {
      throw new Error('Student name cannot be empty');
    }

    this.props = {
      ...this.props,
      ...data,
      updatedAt: new Date(),
    };
  }

  softDelete() {
    this.props.deletedAt = new Date();
    this.props.status = STUDENT_STATUS.INACTIVE;
  }

  get data(): StudentProps {
    return this.props;
  }
}
