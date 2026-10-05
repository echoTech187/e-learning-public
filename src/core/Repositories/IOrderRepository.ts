import { OrderEntity } from '../Entities/Order';

export interface IOrderRepository {
  getUserOrders(): Promise<{ success: boolean; data?: OrderEntity[]; message?: string }>;
  createCheckoutSession(courseId: string, couponCode?: string): Promise<{ success: boolean; data?: { snap_token: string; order_code: string }; message?: string }>;
  checkPaymentStatus(orderCode: string): Promise<{ success: boolean; status?: string; message?: string }>;
  autoExpireOrders(): Promise<void>;
}
