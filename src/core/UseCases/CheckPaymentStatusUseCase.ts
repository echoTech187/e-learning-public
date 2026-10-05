import { IOrderRepository } from '../Repositories/IOrderRepository';

export class CheckPaymentStatusUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(orderCode: string): Promise<{ success: boolean; status?: string; message?: string }> {
    return await this.orderRepository.checkPaymentStatus(orderCode);
  }
}
