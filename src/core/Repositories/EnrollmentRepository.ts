import { Enrollment } from "../Entities/Enrollment";
import { IEnrollmentRepository } from "./IEnrollmentRepository";

export class EnrollmentRepository implements IEnrollmentRepository {
  private readonly baseUrl = process.env.API_GATEWAY_URL || "http://e-learning-docker-api-1";

  async getUserEnrollments(userId: string): Promise<Enrollment[]> {
    try {
      if (!userId) return [];
      const response = await fetch(`${this.baseUrl}/api/v1/enrollments/${userId}`, {
        next: { revalidate: 15, tags: ["enrollments-" + userId] }
      });
      if (!response.ok) return [];
      const json = await response.json();
      return (json.data || []) as Enrollment[];
    } catch (error) {
      console.error("[EnrollmentRepository] getUserEnrollments error:", error);
      return [];
    }
  }
}
