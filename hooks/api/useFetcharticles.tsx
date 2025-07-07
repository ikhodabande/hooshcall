'use client';

import createHttpService from '@/hooks/useHttps';
import { useEffect, useState } from 'react';

type Props = {};

export default function useFetcharticles() {
  const { httpService } = createHttpService();
  const [groups, setGroups] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [mainGroupCode, setMainGroupCode] = useState('');
  const [subGroupCode, setSubGroupCode] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const Get_Holoo_Articles = '/Get_Holoo_Articles';

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const res = await httpService.post(Get_Holoo_Articles, {
          page,
          per_page: perPage
        });

        const data = res.data;

        setArticles(Object.values(data?.data));
        setTotalPages(Math.ceil(data.total / perPage));
        setLoading(false);
      } catch (error) {
        console.error('❌ خطا در دریافت کالاها:', error);
        setLoading(false);
      }
    };

    fetchArticles();
  }, [mainGroupCode, subGroupCode, page, perPage]);

  return { loading, articles, totalPages, setPage , setPerPage, page, perPage };
}
