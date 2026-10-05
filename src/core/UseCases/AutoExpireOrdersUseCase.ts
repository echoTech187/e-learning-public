import { IOrderRepository } from '../Repositories/IOrderRepository';

export class AutoExpireOrdersUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(): Promise<void> {
    await this.orderRepository.autoExpireOrders();
  }
}
