import { IOrderRepository } from '../Repositories/IOrderRepository';

export class CreateCheckoutSessionUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(courseId: string, couponCode?: string): Promise<{ success: boolean; data?: { snap_token: string; order_code: string; id?: string }; message?: string; pendingOrderId?: string }> {
    // Business Logic: Cegah duplikasi order pending
    const historyRes = await this.orderRepository.getUserOrders();
    if (historyRes.success && historyRes.data) {
      const pendingOrder = historyRes.data.find(
        (o: any) => (o.course_id === courseId || o.course_id == courseId) && (o.status === "pending" || o.status === "draft")
      );
      if (pendingOrder) {
        return {
          success: false,
          message: "Anda sudah memiliki tagihan pending untuk kursus ini.",
          pendingOrderId: pendingOrder.id
        };
      }
    }

    return await this.orderRepository.createCheckoutSession(courseId, couponCode);
  }
}
