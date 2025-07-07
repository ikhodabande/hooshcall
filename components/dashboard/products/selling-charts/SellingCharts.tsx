import { NumberTicker } from '@/components/ui/number-ticker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useFetcharticles from '@/hooks/api/useFetcharticles';
import useFetchCustomers from '@/hooks/api/useFetchCustomers';
import useFetchOrders from '@/hooks/api/useFetchorders';
import useFetchvisitors from '@/hooks/api/useFetchvisitors';
import Cookies from 'js-cookie';
import moment from 'moment-jalaali';
import { useEffect, useState } from 'react';

export default function SellingCharts() {
  const [selectedDay, setSelectedDay] = useState('today');
  const [shamsiDate, setShamsiDate] = useState('');
  const { loading, orders, totalCost } = useFetchOrders();

  // Convert cookie string to number
  const type_application = Number(Cookies.get('type_application'));

  // Always fetch both, then decide which to use
  const { visitors } = useFetchvisitors();
  const { Customers } = useFetchCustomers();
  const { articles } = useFetcharticles();

  useEffect(() => {
    const today = moment();

    const dayNames = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'];
    const dayName = dayNames[today.day()];

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
    const monthName = monthNames[today.jMonth()];

    const formattedDate = `${dayName} ${today.jDate()} ${monthName} ${today.jYear()}`;
    setShamsiDate(formattedDate);
  }, []);

  const dayOptions = [
    { value: 'today', label: 'امروز' },
    { value: 'yesterday', label: 'دیروز' },
    { value: 'lastWeek', label: 'هفته گذشته' },
    { value: 'lastMonth', label: 'ماه گذشته' },
  ];

  const statisticsData = [
    {
      title: 'تعداد سفارشات',
      value: orders?.length ?? 0,
      hasBorder: false,
      isPrice: false,
    },
    {
      title: 'تعداد سفارشات ارسال شده',
      value: orders?.length ?? 0,
      hasBorder: true,
      isPrice: false,
    },
    {
      title: 'تعداد سفارشات ارسال نشده',
      value: 0,
      hasBorder: false,
      isPrice: false,
    },
    ...(type_application == 2 || type_application == 3
      ? [
          {
            title: 'تعداد کالاها',
            value: articles?.length ?? 0,
            hasBorder: true,
            isPrice: false,
          },
        ]
      : []),
    ...(type_application == 2 || type_application == 3
      ? [
          {
            title: 'تعداد بازاریاب',
            value: visitors?.length ?? 0,
            hasBorder: false,
            isPrice: false,
          },
        ]
      : []),
    ...(type_application == 1 || type_application == 3
      ? [
          {
            title: 'تعداد مشتریان',
            value: Customers?.length ?? 0,
            hasBorder: false,
            isPrice: false,
          },
        ]
      : []),
    {
      title: 'به مبلغ',
      value: totalCost ?? 0,
      hasBorder: true,
      isPrice: true,
    },
  ];

  return (
    <div className="w-full text-base flex flex-col gap-2 px-2">
      {/* Header with date and selector */}
      <div className="flex flex-row-reverse justify-between items-center mb-6">
        <div className="text-sm text-muted-foreground font-DanaNum">{shamsiDate}</div>
        <Select dir="rtl" value={selectedDay} onValueChange={setSelectedDay}>
          <SelectTrigger disabled className="w-fit md:w-[150px]">
            <SelectValue className="w-full " placeholder="انتخاب بازه زمانی" />
          </SelectTrigger>
          <SelectContent>
            {dayOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {statisticsData.map((item, index) => (
        <div
          key={index}
          className={`flex flex-col w-full ${item.hasBorder ? 'border-t-2 pt-6' : ''} ${
            index === statisticsData.length - 1 ? 'pt-6' : ''
          }`}
        >
          <p className="w-full text-start">{item.title} :</p>
          {item.isPrice ? (
            <p className="w-full items-center justify-center gap-1 flex text-center text-5xl bg-gradient-to-l from-primary to-primary/50 font-bold text-transparent bg-clip-text font-DanaNum">
              {item?.value?.toLocaleString()} <span className="text-xl">تومان</span>
            </p>
          ) : (
            <NumberTicker
              value={item.value}
              className="w-full text-center text-5xl bg-gradient-to-r from-primary to-primary/40 font-bold inline-block text-transparent bg-clip-text font-DanaNum"
            />
          )}
        </div>
      ))}
    </div>
  );
}
