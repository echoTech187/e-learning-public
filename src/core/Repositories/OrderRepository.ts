import { IOrderRepository } from './IOrderRepository';
import { OrderEntity } from '../Entities/Order';
import { getUserOrders, createCheckoutSession, checkPaymentStatus, autoExpireOrders } from '@/app/actions/checkout';

export class OrderRepository implements IOrderRepository {
  async getUserOrders(): Promise<{ success: boolean; data?: OrderEntity[]; message?: string }> {
    const response = await getUserOrders();
    if (response && response.success && Array.isArray(response.data)) {
      return { success: true, data: response.data as OrderEntity[] };
    }
    return { success: false, message: 'Failed to fetch orders' };
  }

  async createCheckoutSession(courseId: string, couponCode?: string): Promise<{ success: boolean; data?: { snap_token: string; order_code: string }; message?: string }> {
    return await createCheckoutSession(courseId, couponCode);
  }

  async checkPaymentStatus(orderCode: string): Promise<{ success: boolean; status?: string; message?: string }> {
    return await checkPaymentStatus(orderCode);
  }

  async autoExpireOrders(): Promise<void> {
    await autoExpireOrders();
  }
}
