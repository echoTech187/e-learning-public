import { Enrollment } from "../Entities/Enrollment";
import { IEnrollmentRepository } from "../Repositories/IEnrollmentRepository";

export class GetUserEnrollmentsUseCase {
  constructor(private readonly enrollmentRepository: IEnrollmentRepository) {}

  async execute(userId: string): Promise<Enrollment[]> {
    if (!userId) return [];
    return this.enrollmentRepository.getUserEnrollments(userId);
  }
}
