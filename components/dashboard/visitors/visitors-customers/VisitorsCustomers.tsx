'use client';

import PageTitles from '@/components/modules/PageTitles';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Loading from '@/components/ui/loading';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import createHttpService from '@/hooks/useHttps';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
type Props = {};

export default function VisitorsCustomers({}: Props) {
  const { httpService } = createHttpService();
  const [visitors, setVisitors] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const Get_Customers_Visitory = 'send_customers_Visitory';
  const searchParams = useSearchParams();
  const code = searchParams.get('code'); // 👈 This is how you get the code

  useEffect(() => {
    const getArticles = async () => {
      try {
        setLoading(true);
        const res = await httpService.get(Get_Customers_Visitory, {
          params: { page, per_page: perPage, visitor_code: code },
        });

        const data = res.data.customers;
        setLoading(false);
        setVisitors(Object.values(data));
        setTotalPages(Math.ceil(data.total_items / perPage));
      } catch (error) {
        console.error('❌ خطا:', error);
        setLoading(false);
      }
    };
    getArticles();
  }, [page, perPage]);

  return (
    <Suspense fallback={<div>در حال بارگذاری...</div>}>
      <div className="p-4 space-y-4">
        <PageTitles
          breadcrumbs={[
            { label: 'همگام', href: '/dashboard' },
            { label: 'بازاریاب', href: '/dashboard/visitors' },
            { label: 'مشتریان حسابداری', href: '/dashboard/visitors/customers' },
          ]}
          title={'مشتریان حسابداری'}
        />
        <Card className="overflow-auto md:w-full mx-auto overflow-x-auto md:max-w-[100vw] max-w-[90vw] my-2">
          <ScrollArea>
            <Table className="overflow-x-auto" dir="rtl">
              <TableHeader className="bg-muted text-xs md:text-sm">
                <TableRow>
                  <TableHead className="text-right hidden md:table-cell">کد مشتری</TableHead>
                  <TableHead className="text-right">نام مشتری</TableHead>
                  <TableHead className="text-right hidden md:table-cell">شماره تلفن</TableHead>
                  <TableHead className="text-right">منطقه</TableHead>
                  <TableHead className="text-right">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-xs md:text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={4}>
                      <Loading className="h-32" />
                    </td>
                  </tr>
                ) : visitors.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-4">
                      موردی یافت نشد.
                    </td>
                  </tr>
                ) : (
                  visitors.map((item, i) => (
                    <TableRow key={i} className={cn(i % 2 === 0 ? 'bg-white' : 'bg-muted/50')}>
                      <TableCell className="hidden md:table-cell font-DanaNum">
                        {item.FldC_Ashkhas || 'نامشخص'}
                      </TableCell>
                      <TableCell>{item.FldN_Ashkhas || 'نامشخص'}</TableCell>
                      <TableCell className="hidden md:table-cell font-DanaNum">
                        {item.FldMob || item.FldTell || 'نامشخص'}
                      </TableCell>
                      <TableCell className="text-right">{item.FldAddress || '—'}</TableCell>
                      <TableCell className="text-right flex gap-2">
                        <Link href={`checks?code=${item.FldC_Ashkhas}`}>
                          <Button className="text-white">مشاهده چک</Button>
                        </Link>
                        {/* <Link href={`moeins?code=${item.FldC_Ashkhas}`}>
                          <Button className="text-white">مشاهده معین</Button>
                        </Link> */}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </Card>
      </div>
    </Suspense>
  );
}
