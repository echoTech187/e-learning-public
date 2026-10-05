import { Enrollment } from "../Entities/Enrollment";

export interface IEnrollmentRepository {
  getUserEnrollments(userId: string): Promise<Enrollment[]>;
}
