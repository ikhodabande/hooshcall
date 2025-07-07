'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import createHttpService from '@/hooks/useHttps';
import moment from 'moment-jalaali';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type Order = {
  id: number;
  customerCode: string;
  orderDate: string;
  orderAmount: number;
  fullDetails: {
    products: { name: string; price: number; quantity: number }[];
  };
};

export default function ProductsList({ refreshKey }: { refreshKey?: number }) {
  const [selectedDay, setSelectedDay] = useState('today');
  const [shamsiDate, setShamsiDate] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const { httpService } = createHttpService();

  useEffect(() => {
    const today = moment();
    const dayNames = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'];
    const monthNames = [
      'فروردین',
      'اردیبهشت',
      'خرداد',
      'تیر',
      'مرداد',
      'شهریور',
      'مهر',
      'آبان',
      'آذر',
      'دی',
      'بهمن',
      'اسفند',
    ];
    const formattedDate = `${dayNames[today.day()]} ${today.jDate()} ${
      monthNames[today.jMonth()]
    } ${today.jYear()}`;
    setShamsiDate(formattedDate);
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await httpService.post('/get_order_details', {
          R_Date_From: 'all',
          R_Date_To: 'all',
        });

        const data = res.data.Orders;

        const mappedOrders: Order[] = Object.values(data).map((entry: any, index: number) => ({
          id: entry.RQTITLE.RqIndex,
          customerCode: entry.RQTITLE.R_CusCode,
          orderDate: entry.RQTITLE.R_Date,
          orderAmount: entry.RQTITLE.SumPrice,
          fullDetails: {
            products: entry.RQDETAIL.map((product: any) => ({
              name: product.R_ArName,
              price: product.R_Cost,
              quantity: product.R_Few,
            })),
          },
        }));

        setOrders(mappedOrders);
      } catch (error) {
        toast.error('خطا در دریافت اطلاعات سفارش‌ها');
        console.error(error);
      }
    };

    fetchOrders();
  }, [selectedDay, refreshKey]);

  const dayOptions = [
    { value: 'today', label: 'امروز' },
    { value: 'yesterday', label: 'دیروز' },
    { value: 'lastWeek', label: 'هفته گذشته' },
    { value: 'lastMonth', label: 'ماه گذشته' },
  ];

  return (
    <>
      <div className="flex flex-row-reverse justify-between items-center mt-3">
        <div className="text-sm text-muted-foreground font-DanaNum">{shamsiDate}</div>
        <Select dir="rtl" value={selectedDay} onValueChange={setSelectedDay}>
          <SelectTrigger disabled className="w-fit md:w-[150px]">
            <SelectValue className="w-full " placeholder="انتخاب بازه زمانی" />
          </SelectTrigger>
          <SelectContent className="">
            {dayOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Orders grid */}
      <div className="mt-6 max-h-[650px] overflow-y-auto no-scrollbar">
        {orders.length === 0 ? (
          <div className="text-center text-muted-foreground font-Dana text-sm mt-10">
            هیچ سفارشی یافت نشد.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:flex flex-col gap-4">
            {orders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

const OrderCard = ({ order }: { order: Order }) => {
  return (
    <Card className="overflow-hidden min-h-fit border-none bg-transparent rounded-sm py-3 pb-6 px-0">
      {/* <CardHeader className="px-6 py-1">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="">{order.customerCode}</span>
          </div>
        </div>
      </CardHeader> */}

      <CardContent className="pb-2">
        <div className="space-y-2">
          <div className="flex justify-between items-center gap-2 text-sm">
            <p>کد مشتری:</p>
            <span className="font-DanaNum">{order.customerCode}</span>
          </div>
          <div className="flex items-center justify-between gap-2 text-sm">
            <p>تاریخ ثبت سفارش:</p>
            <span className="font-DanaNum">
              {new Date(order.orderDate).toLocaleDateString('fa-IR')}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="py-0 flex justify-between items-center ">
        <div className="flex items-center justify-between text-sm gap-1 font-DanaNum w-full">
          <p> مبلغ سفارش:</p>
          <div className="font-medium">{order.orderAmount.toLocaleString()} تومان</div>
        </div>
      </CardFooter>
    </Card>
  );
};
