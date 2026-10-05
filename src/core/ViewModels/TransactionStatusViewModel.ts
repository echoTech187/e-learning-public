import { useState, useMemo, useEffect, useRef } from 'react';
import { CheckPaymentStatusUseCase } from '../UseCases/CheckPaymentStatusUseCase';
import { AutoExpireOrdersUseCase } from '../UseCases/AutoExpireOrdersUseCase';
import { GetTransactionHistoryUseCase } from '../UseCases/GetTransactionHistoryUseCase';
import { OrderRepository } from '../Repositories/OrderRepository';
import { OrderEntity } from '../Entities/Order';


export function useTransactionStatusViewModel(orderCode: string | null) {
  const [status, setStatus] = useState<string>('pending');
  const [order, setOrder] = useState<OrderEntity | null>(null);
  const [user, setUser] = useState<{name?: string, email?: string, role?: string}>({});
  const [loading, setLoading] = useState<boolean>(true);
  const hasStartedAutoExpire = useRef(false);

  const checkStatusUseCase = useMemo(() => {
    const repository = new OrderRepository();
    return new CheckPaymentStatusUseCase(repository);
  }, []);

  const autoExpireUseCase = useMemo(() => {
    const repository = new OrderRepository();
    return new AutoExpireOrdersUseCase(repository);
  }, []);
  
  const getTransactionHistoryUseCase = useMemo(() => {
      const repository = new OrderRepository();
      return new GetTransactionHistoryUseCase(repository);
  }, []);

  const checkStatus = async () => {
    if (!orderCode) return { success: false };
    try {
      return await checkStatusUseCase.execute(orderCode);
    } catch (error) {
      console.error('Error checking status:', error);
      return { success: false };
    }
  };

  const triggerAutoExpire = async () => {
    try {
      await autoExpireUseCase.execute();
    } catch (error) {
      console.error('Error auto expiring orders:', error);
    }
  };

  useEffect(() => {
    if (hasStartedAutoExpire.current) return;
    hasStartedAutoExpire.current = true;

    triggerAutoExpire();
    const expireInterval = setInterval(() => {
      triggerAutoExpire();
    }, 5 * 60 * 1000);

    return () => clearInterval(expireInterval);
  }, [autoExpireUseCase]);
  
  useEffect(() => {
      const fetchOrderDetails = async () => {
          if (!orderCode) {
              setLoading(false);
              return;
          }
          setLoading(true);
          try {
              const orders = await getTransactionHistoryUseCase.execute();
              const found = orders.find(o => o.order_code === orderCode);
              if (found) {
                  setOrder(found);
              }
              
              // Parse user from cookie if available
              if (typeof document !== 'undefined') {
                  const cookies = document.cookie.split(';');
                  const userCookie = cookies.find(c => c.trim().startsWith('user='));
                  if (userCookie) {
                      const userCookieStr = userCookie.split('=')[1];
                      try {
                          setUser(JSON.parse(decodeURIComponent(userCookieStr)));
                      } catch(e) {
                          console.error("Failed to parse user cookie", e);
                      }
                  }
              }
          } catch(e) {
              console.error(e);
          } finally {
              setLoading(false);
          }
      };
      
      fetchOrderDetails();
  }, [orderCode, getTransactionHistoryUseCase]);

  return {
    status,
    setStatus,
    checkStatus,
    order,
    user,
    loading
  };
}
