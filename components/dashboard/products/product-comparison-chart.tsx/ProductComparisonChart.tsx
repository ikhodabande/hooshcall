'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ApexOptions } from 'apexcharts';
import Cookies from 'js-cookie';
import moment from 'moment-jalaali';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Dynamically import ApexCharts to avoid SSR issues
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function ProductComparisonChart() {
  // State to handle client-side rendering
  const [mounted, setMounted] = useState(false);
  const [system, setSystem] = useState('webcom');
  const { theme } = useTheme();
  const [selectedDay, setSelectedDay] = useState('today');
  const [shamsiDate, setShamsiDate] = useState('');

  useEffect(() => {
    // Get current Shamsi date with day name and month name
    const today = moment();

    // Get day name in Persian
    const dayNames = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'];
    const dayName = dayNames[today.day()];

    // Get month name in Persian
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

    // Format: یکشنبه 22 آذر 1404
    const formattedDate = `${dayName} ${today.jDate()} ${monthName} ${today.jYear()}`;
    setShamsiDate(formattedDate);
  }, []);

  const dayOptions = [
    { value: 'today', label: 'امروز' },
    { value: 'yesterday', label: 'دیروز' },
    { value: 'lastWeek', label: 'هفته گذشته' },
    { value: 'lastMonth', label: 'ماه گذشته' },
  ];

  useEffect(() => {
    // setSystem(localStorage.getItem('data-system') || '');
    setSystem(Cookies.get('data-system') || '');
  }, []);

  const systemColor = system == 'holo' ? '#CF3A3A' : '#96B22E';

  useEffect(() => {
    setMounted(true);
  }, []);

  // Chart data
  const series = [
    {
      name: 'تعداد سفارشات',
      data: [75, 66, 57, 88, 63],
    },
    {
      name: 'تعداد ارسال شده',
      data: [24, 35, 20, 80, 60],
    },
  ];

  // Chart options
  const options: ApexOptions = {
    chart: {
      type: 'bar',
      height: 500,
      toolbar: {
        show: false,
      },
      fontFamily: 'danaNumber',
      //   background: "#ffffff",
    },
    colors: [systemColor, '#CCCCCC'], // Gold/orange for orders, light gray for shipped

    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 4,
        dataLabels: {
          position: 'top',
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: val => val.toString(),
      offsetY: -30,
      style: {
        fontSize: '14px',
        fontWeight: 'bold',
        colors: [systemColor, '#AAAAAA'],
      },
    },
    stroke: {
      show: false,
    },
    grid: {
      borderColor: '#f5f5f5',
      row: {
        colors: ['transparent'],
      },
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    xaxis: {
      categories: ['محصول ۱', 'محصول ۲', 'محصول ۳', 'محصول ۴', 'محصول ۵'],
      position: 'bottom',

      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          fontSize: '14px',
          colors: theme === 'dark' ? '#fff' : '#000',
        },
      },
    },
    yaxis: {
      min: 0,
      max: 100,
      tickAmount: 10,
      labels: {
        style: {
          fontSize: '12px',
          colors: '#aaaaaa',
        },
      },
    },
    legend: {
      show: true,
      labels: {
        colors: theme === 'dark' ? '#fff' : '#000',
      },
      position: 'bottom',
      horizontalAlign: 'center',
      offsetY: 20,
      markers: {
        size: 12,
      },
    },
    tooltip: {
      y: {
        formatter: val => val.toString(),
      },
    },
  };

  if (!mounted) return <div className=" w-full rounded-3xl border border-gray-100 "></div>;

  return (
    <>
      {' '}
      {/* Header with date and selector */}
      <div className="flex flex-row-reverse justify-between items-center mt-4">
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
      <ReactApexChart options={options} series={series} type="bar" height={650} />
    </>
  );
}
