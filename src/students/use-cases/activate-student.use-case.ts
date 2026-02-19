import { Injectable } from '@nestjs/common';
import { StudentsRepository } from '../repositories/students.repository';
import type { DbContext } from '@/prisma/shared/db-context';
import { StudentNotFoundError } from '../errors/student-not-found.error';
import { StudentAlreadyActiveError } from '../errors/student-already-active.error';

Injectable();
export class ActivateStudentUseCase {
  constructor(private studentsRepository: StudentsRepository) {}

  async execute(id: string, schoolId: string, db?: DbContext) {
    const student = await this.studentsRepository.findById(id, schoolId, db);

    if (!student) {
      throw new StudentNotFoundError();
    }

    if (student.status === 'ACTIVE') {
      throw new StudentAlreadyActiveError();
    }

    return this.studentsRepository.setStatus(id, schoolId, 'ACTIVE', db);
  }
}
