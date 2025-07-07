'use client';

import createHttpService from '@/hooks/useHttps';
import { useEffect, useState } from 'react';

type Props = {};

export default function useFetchvisitors() {
  const [visitors, setVisitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { httpService } = createHttpService();

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        setLoading(true);
        const res = await httpService.get('/get_visitors');
        const data = res.data;
        setVisitors(data);
        setLoading(false);
      } catch (error) {
        console.error('❌ خطا در دریافت اطلاعات بازاریاب‌ها:', error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchVisitors();
  }, []);


  return { loading, visitors };
}
