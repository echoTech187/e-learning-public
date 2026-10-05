import { IOrderRepository } from '../Repositories/IOrderRepository';
import { OrderEntity } from '../Entities/Order';

export class GetTransactionHistoryUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(): Promise<OrderEntity[]> {
    const response = await this.orderRepository.getUserOrders();
    if (response.success && response.data) {
      return response.data;
    }
    return [];
  }
}
