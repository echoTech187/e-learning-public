import { useState, useEffect, useMemo, useRef } from 'react';
import { OrderEntity } from '../Entities/Order';
import { GetTransactionHistoryUseCase } from '../UseCases/GetTransactionHistoryUseCase';
import { OrderRepository } from '../Repositories/OrderRepository';

export function useTransactionHistoryViewModel(initialOrders: OrderEntity[]) {
  const [orders, setOrders] = useState<OrderEntity[]>(initialOrders);
  const [isLoading, setIsLoading] = useState<boolean>(initialOrders.length === 0);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedInvoice, setSelectedInvoice] = useState<OrderEntity | null>(null);
  
  const hasFetchedRef = useRef(false);

  // Instansiasi UseCase (Dependency Injection Sederhana)
  const useCase = useMemo(() => {
    const repository = new OrderRepository();
    return new GetTransactionHistoryUseCase(repository);
  }, []);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    async function fetchOrders() {
      try {
        const fetchedOrders = await useCase.execute();
        setOrders(fetchedOrders);
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrders();
  }, [useCase]);

  const isCoursePaid = (courseId: string) => {
    return orders.some(o => o.course_id === courseId && o.status === 'paid');
  };

  const OTHER_STATUSES = ['failed', 'cancelled', 'expired', 'refunded'];

  const stats = useMemo(() => {
    const total = orders.length;
    const paid = orders.filter((o) => o.status === 'paid').length;
    const pending = orders.filter((o) => o.status === 'pending' || o.status === 'draft').length;
    const other = orders.filter((o) => OTHER_STATUSES.includes(o.status)).length;
    const totalSpent = orders
      .filter((o) => o.status === 'paid')
      .reduce((sum, o) => sum + parseFloat(o.total || '0'), 0);

    return { total, paid, pending, other, totalSpent };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Status filter
      if (filterStatus === 'other') {
        if (!OTHER_STATUSES.includes(order.status)) return false;
      } else if (filterStatus === 'pending' && order.status !== 'pending' && order.status !== 'draft') {
          return false;
        } else if (filterStatus !== 'all' && filterStatus !== 'pending' && order.status !== filterStatus) {
        return false;
      }
      // Search filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const codeMatch = order.order_code.toLowerCase().includes(q);
        const titleMatch = (order.course_title || '').toLowerCase().includes(q);
        const mentorMatch = (order.instructor_name || '').toLowerCase().includes(q);
        if (!codeMatch && !titleMatch && !mentorMatch) return false;
      }
      return true;
    });
  }, [orders, filterStatus, searchQuery]);

  return {
    orders,
    isLoading,
    filterStatus,
    setFilterStatus,
    searchQuery,
    setSearchQuery,
    selectedInvoice,
    setSelectedInvoice,
    stats,
    filteredOrders,
    isCoursePaid
  };
}
