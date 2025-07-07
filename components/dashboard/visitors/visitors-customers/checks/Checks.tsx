'use client';

import PageTitles from '@/components/modules/PageTitles';
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
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type Props = {};

export default function Checks({}: Props) {
  const { httpService } = createHttpService();
  const [checks, setChecks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const searchparams = useSearchParams();

  useEffect(() => {
    const fetchChecks = async () => {
      try {
        const res = await httpService.post('fetch_checks', {
          C_Code_Source: searchparams.get('code'),
        });
        setChecks(res.data.data);
      } catch (error) {
        console.error('❌ خطا در دریافت چک‌ها:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChecks();
  }, [searchparams]);

  return (
    <>
      <div className="m-4 space-y-4">
        <PageTitles
          breadcrumbs={[
            { label: 'همگام', href: '/dashboard' },
            { label: 'بازاریاب', href: '/dashboard/visitors' },
            { label: 'مشتریان حسابداری', href: '/dashboard/visitors/customers' },
            { label: 'لیست چک های مشتری', href: '/dashboard/visitors/customers/checks' },
          ]}
          showSearch={false}
          title={'لیست چک های مشتری'}
        />

        {loading ? (
          <Loading className="h-[60vh]" />
        ) : (
          <Card className="overflow-auto">
            <ScrollArea>
              <Table dir="rtl">
                <TableHeader className="bg-muted text-xs md:text-sm">
                  <TableRow>
                    <TableHead className="text-start">شماره چک</TableHead>
                    <TableHead className="text-start">تاریخ دریافت</TableHead>
                    <TableHead className="text-start">تاریخ وصول</TableHead>
                    <TableHead className="text-start">کد بانک</TableHead>
                    <TableHead className="text-start">مبلغ</TableHead>
                    <TableHead className="text-start">وضعیت</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-xs md:text-sm">
                  {checks.map((check, i) => (
                    <TableRow key={i} className={cn(i % 2 === 0 ? 'bg-white' : 'bg-muted/50')}>
                      <TableCell>{check.Check_Number}</TableCell>
                      <TableCell>
                        {new Date(check.Receive_Date).toLocaleDateString('fa-IR')}
                      </TableCell>
                      <TableCell>
                        {new Date(check.Attain_Date).toLocaleDateString('fa-IR')}
                      </TableCell>
                      <TableCell>{check.Bank_Code}</TableCell>
                      <TableCell className="font-DanaNum">{check.Cust.toLocaleString()}</TableCell>
                      <TableCell>{check.Vosool ? 'وصول شده' : 'در انتظار وصول'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </Card>
        )}
      </div>
    </>
  );
}
