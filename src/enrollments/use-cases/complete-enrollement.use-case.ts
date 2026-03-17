import { Injectable } from "@nestjs/common";
import { EnrollmentsRepository } from '../repositories/enrollments.repository';
import type { DbContext } from "@/prisma/shared/db-context";
import { ACTIVE_ENROLLMENT_STATUSES, type Enrollment } from "../domain/enrollment";
import { EnrollmentNotFoundError } from "../errors/enrollment-not-found.error";
import { ENROLLMENT_STATUS } from "@/generated/prisma/enums";
import { enrollmentAlreadyCompletedError } from "../errors/enrollment-already-completed.error";
import { EnrollmentNotActiveError } from "../errors/enrollment-not-active.error";

@Injectable()
export class CompleteEnrollmentUseCase {
  constructor (private enrollmentsRepository: EnrollmentsRepository){}

  async execute (id: string, schoolId: string, db?: DbContext) : Promise<Enrollment>{
    const enrollment = await this.enrollmentsRepository.findById(id, schoolId);

    if(!enrollment){ 
      throw new EnrollmentNotFoundError();
    }

    if(enrollment.status === ENROLLMENT_STATUS.COMPLETED){
      throw new enrollmentAlreadyCompletedError()
    }

    if(!ACTIVE_ENROLLMENT_STATUSES.includes(enrollment.status)){
      throw new EnrollmentNotActiveError();
    }

    const updatedEnrollment = await this.enrollmentsRepository.updateStatus(
      id,
      schoolId,
      ENROLLMENT_STATUS.COMPLETED,
      db
    );

    return updatedEnrollment;
  }
}