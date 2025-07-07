'use client';

import PageTitles from '@/components/modules/PageTitles';
import ShamsiCalendare from '@/components/modules/ShamsiCalendare';
import { Card } from '@/components/ui/card';
import Loading from '@/components/ui/loading';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import createShopHttpService from '@/hooks/useShopHttps';
import { showToast } from '@/utils/toastService';
import { cn } from '@/utils/utils';
import moment from 'moment-jalaali';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type Props = {};

export default function Moeins({}: Props) {
  const { httpService } = createShopHttpService();
  const [moiens, setMoiens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startFromDate, setStartFromDate] = useState(null);
  const [endFromDate, setEndFromDate] = useState(null);

  const handleStartDateChange = (date: any) => {
    const year = date.year;
    const month = date.month.number;
    const day = date.day;
    const formatted = `${year}-${month.toString().padStart(2, '0')}-${day
      .toString()
      .padStart(2, '0')}`;
    const miladiDate = moment(formatted, 'jYYYY-jMM-jDD').format('YYYY-MM-DD');

    setStartDate(miladiDate as any);
  };

  const handleEndDateChange = (date: any) => {
    const year = date.year;
    const month = date.month.number;
    const day = date.day;
    const formatted = `${year}-${month.toString().padStart(2, '0')}-${day
      .toString()
      .padStart(2, '0')}`;
    const miladiDate = moment(formatted, 'jYYYY-jMM-jDD').format('YYYY-MM-DD');

    setEndDate(miladiDate as any);
  };

  // Number of Moeins to fetch
  const [take, setTake] = useState(10);

  const searchparams = useSearchParams();

  // Fetch function with params
  const fetchMoeins = async () => {
    try {
      if (take > 100) {
        // setLoadingMessage('دریافت اطلاعات ممکن است کمی زمان ببرد...');
        showToast('', 'دریافت اطلاعات ممکن است کمی زمان ببرد...');
      } else {
        setLoadingMessage(null);
      }
      setLoading(true);
      const res = await httpService.post('/send_moien_single_mobile', {
        mobile: searchparams.get('mobile'),
        take,
        start_date: startDate,
        end_date: endDate,
      });
      setMoiens(res?.data?.data);
    } catch (error) {
      console.error('❌ خطا در دریافت اطلاعات بازاریاب‌ها:', error);
      setMoiens([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch when dependencies change
  useEffect(() => {
    fetchMoeins();

    // Set interval to refresh every 60 seconds
    const intervalId = setInterval(fetchMoeins, 60000);
    return () => clearInterval(intervalId);
  }, [take, startDate, endDate]);

  return (
    <>
      <div className="p-4 space-y-4">
        <PageTitles
          breadcrumbs={[
            { label: 'همگام', href: '/dashboard' },
            { label: 'فروشگاه', href: '/dashboard/shop' },
            { label: 'مشتریان ', href: '/dashboard/shop/customers' },
            { label: 'معین مشتری ', href: '/dashboard/shop/customers/moeins' },
          ]}
          title={'معین مشتری'}
          showSearch={false}
        />

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex flex-col">
            <label htmlFor="dateFrom" className="text-sm mb-1">
              تاریخ از
            </label>
            {/* <Input
              id="dateFrom"
              type="date"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              max={dateTo}
              className="w-[150px]"
            /> */}
            <ShamsiCalendare onDateChange={handleStartDateChange} />
          </div>

          <div className="flex flex-col">
            <label htmlFor="dateTo" className="text-sm mb-1">
              تاریخ تا
            </label>
            <ShamsiCalendare onDateChange={handleEndDateChange} />
          </div>

          <div className="flex flex-col">
            <label htmlFor="take" className="text-sm mb-1 font-DanaNum">
              تعداد دریافت (از 10 تا 200)
            </label>
            <Select value={String(take)} onValueChange={value => setTake(Number(value))}>
              <SelectTrigger className="w-[150px] font-DanaNum">
                <SelectValue placeholder="تعداد" />
              </SelectTrigger>
              <SelectContent className="font-DanaNum">
                {Array.from({ length: 20 }, (_, i) => (i + 1) * 10).map(num => (
                  <SelectItem key={num} value={String(num)}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <Loading className="h-[60vh]" />
        ) : (
          <Card className="overflow-auto">
            <ScrollArea>
              <Table dir="rtl">
                <TableHeader className="bg-muted text-xs md:text-sm">
                  <TableRow>
                    <TableHead className="text-start">تاریخ</TableHead>
                    <TableHead className="text-start">کد مشتری</TableHead>
                    <TableHead className="text-start">نام مشتری</TableHead>
                    <TableHead className="text-start">کد فاکتور</TableHead>
                    <TableHead className="text-start">نوع فاکتور</TableHead>
                    <TableHead className="text-start">بدهکار</TableHead>
                    <TableHead className="text-start">بستانکار</TableHead>
                    <TableHead className="text-start">مانده</TableHead>
                    <TableHead className="text-start">جزئیات سفارش</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-xs md:text-sm font-DanaNum">
                  {moiens?.map((item, i) => (
                    <TableRow key={i} className={cn(i % 2 === 0 ? 'bg-white' : 'bg-muted/50')}>
                      <TableCell>{new Date(item.DateTime).toLocaleDateString('fa-IR')}</TableCell>
                      <TableCell>{item.Cust_Code}</TableCell>
                      <TableCell>{item.Cust_Name}</TableCell>
                      <TableCell>{item.Fac_Code}</TableCell>
                      <TableCell>{item.Fac_Type}</TableCell>
                      <TableCell>{item.Bed?.toLocaleString()}</TableCell>
                      <TableCell>{item.Bes?.toLocaleString()}</TableCell>
                      <TableCell>{item.MANDE?.toLocaleString()}</TableCell>
                      <TableCell className="h-12 max-h-[50px]">
                        {item.Order_Details?.map((detail: any, index: any) => (
                          <div key={index} className="border-b py-1">
                            {detail.Kala_Name} - {detail.Few_Article} ×{' '}
                            {detail.Price_BS.toLocaleString()}
                          </div>
                        ))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>

            {!loading && moiens.length === 0 && (
              <div className="text-center text-sm w-full text-muted-foreground py-4">
                گزارش معینی برای این مشتری یافت نشد!
              </div>
            )}
          </Card>
        )}
      </div>
    </>
  );
}
