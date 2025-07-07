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
import createShopHttpService from '@/hooks/useShopHttps';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Customers() {
  const [visitors, setVisitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { httpService } = createShopHttpService();

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        setLoading(true);
        const res = await httpService.get('/send_customers_Visitory');
        setVisitors(res.data.customers);
      } catch (error) {
        console.error('❌ خطا در دریافت اطلاعات بازاریاب‌ها:', error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch immediately
    fetchVisitors();

    // Set interval
    const intervalId = setInterval(fetchVisitors, 60000);

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="p-4 space-y-4">
      <PageTitles
        breadcrumbs={[
          { label: 'همگام', href: '/dashboard' },
          { label: 'فروشگاه', href: '/dashboard/shop' },
          { label: 'مشتریان ', href: '/dashboard/shop/customers' },
        ]}
        title={'مشتریان فروشگاه'}
        showSearch={false}
      />
      <div className="">
        {loading ? (
          <>
            <Loading className="h-[60vh]" />
          </>
        ) : (
          <>
            <Card className="overflow-auto">
              <ScrollArea>
                <Table dir="rtl">
                  <TableHeader className="bg-muted text-xs md:text-sm">
                    <TableRow>
                      <TableHead className="text-right">کد مشتری</TableHead>
                      <TableHead className="text-right">نام مشتری</TableHead>
                      <TableHead className="text-right hidden md:table-cell">شماره تلفن</TableHead>
                      <TableHead className="text-right hidden md:table-cell">مانده حساب</TableHead>
                      <TableHead className="text-right hidden md:table-cell">عملیات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="text-xs md:text-sm">
                    {visitors.map((visitor, i) => (
                      <TableRow key={i} className={cn(i % 2 === 0 ? 'bg-white' : 'bg-muted/50')}>
                        <TableCell className="font-DanaNum">{visitor.FldC_Ashkhas}</TableCell>
                        <TableCell className="font-DanaNum">{visitor.FldN_Ashkhas}</TableCell>
                        <TableCell className="hidden md:table-cell font-DanaNum">
                          {visitor.FldMob}
                        </TableCell>
                        <TableCell className="hidden md:table-cell font-DanaNum">
                          {visitor.FldMandeHesab}
                        </TableCell>
                        <TableCell className="hidden md:table-cell font-DanaNum">
                          <Link href={`moeins?mobile=${visitor.FldMob}`}>
                            <Button>مشاهده معین</Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>{' '}
              {!loading && visitors.length === 0 && (
                <div className="text-center text-sm w-full text-muted-foreground py-4">
                  مشتری برای شما یافت نشد!
                </div>
              )}
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
