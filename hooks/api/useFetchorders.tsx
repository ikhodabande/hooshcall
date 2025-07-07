'use client';

import createHttpService from '@/hooks/useHttps';
import { showToast } from '@/utils/toastService';
import { useEffect, useState } from 'react';

type Order = {
  id: number;
  name: string;
  // ... other fields
};

export default function useFetchOrders() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalCost, setTotalCost] = useState();
  const { httpService } = createHttpService();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await httpService.post('/get_order_details', {
          R_Date_From: 'all',
          R_Date_To: 'all',
        });
        setOrders(res?.data?.Orders);
        setTotalCost(
          res?.data?.Orders?.map((item: any) => item?.RQDETAIL)
            .flat()
            .reduce((sum: any, item: any) => sum + (item?.R_Cost || 0), 0)
        );
        
      } catch (error: any) {
        // Axios errors are already handled by interceptor
        // But we handle any unexpected error here
        if (!error.response) {
          showToast('خطا', 'مشکلی در دریافت اطلاعات سفارش‌ها پیش آمد', 'destructive');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return { loading, orders, totalCost };
}
