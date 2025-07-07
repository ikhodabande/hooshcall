'use client';

import createHttpService from '@/hooks/useHttps';
import createShopHttpService from '@/hooks/useShopHttps';
import { useEffect, useState } from 'react';

type Props = {};

export default function useFetchCustomers() {
  const [Customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { httpService } = createShopHttpService();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const res = await httpService.get('/send_customers_Visitory');
        const data = res?.data?.customers;
        setCustomers(data);
        setLoading(false);
      } catch (error) {
        console.error('❌ خطا در دریافت اطلاعات بازاریاب‌ها:', error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);


  return { loading, Customers };
}
