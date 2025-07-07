'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import createHttpService from '@/hooks/useHttps';
import type { ApexOptions } from 'apexcharts';
import chroma from 'chroma-js';
import Cookies from 'js-cookie';
import moment from 'moment-jalaali';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Dynamically import ApexCharts to avoid SSR issues
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function ProductFunnelChart() {
  const [mounted, setMounted] = useState(false);
  const [system, setSystem] = useState('webcom');
  const { theme } = useTheme();
  const systemColor = system == 'holo' ? '#CF3A3A' : '#96B22E';
  // Generate gradient colors
  const gradientColors = chroma?.scale([systemColor, 'black']).mode('lab').colors(8);
  const [selectedDay, setSelectedDay] = useState('today');
  const [shamsiDate, setShamsiDate] = useState('');
  const { httpService } = createHttpService();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBestSelling = async () => {
      try {
        setLoading(true);
        const res = await httpService.post('get_best_selling_articles', {
          R_Date: 'all',
        });
      } catch (error) {
        console.error('❌ خطا در دریافت اطلاعات کالاها:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSelling();
  }, []);

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
    // setSystem(localStorage?.getItem('data-system') || '');
    setSystem(Cookies.get('data-system') || '');
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Chart data
  const series = [30, 25, 18, 15, 7, 4, 3, 2];

  // Product names
  const labels = [
    'محصول ۱',
    'محصول ۲',
    'محصول ۳',
    'محصول ۴',
    'محصول ۵',
    'محصول ۶',
    'محصول ۷',
    // 'محصول ۸',
  ];

  // Chart options
  const options: ApexOptions = {
    chart: {
      type: 'bar',
      height: 70,
      toolbar: { show: false },
      fontFamily: 'danaNumber',
      animations: { enabled: true },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        distributed: true,
        barHeight: '100%',
        borderRadius: 4,
      },
    },
    colors: gradientColors,
    dataLabels: {
      enabled: true,
      formatter: val => `%${val}`, // Show percentage at end of each bar
      //   offsetX: 50,
      style: {
        fontSize: '12px',
        fontWeight: 500,
        colors: [system == 'holo' ? '#fff' : '#fff'],
      },
    },
    grid: {
      show: false,
    },
    xaxis: {
      categories: labels,
      labels: {
        show: false,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
      // reversed: true, // Invert direction
    },
    yaxis: {
      labels: {
        show: true,
        align: 'right',
        offsetX: -50,
        style: {
          fontSize: '14px',
          fontWeight: 500,
          colors: [theme === 'dark' ? '#fff' : '#000'],
        },
      },
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: val => `%${val}`,
      },
    },
    legend: {
      show: false,
    },
  };

  if (!mounted) return <div className=" w-full rounded-3xl border border-gray-100"></div>;

  return (
    <>
      <div className="flex flex-row-reverse justify-between items-center mt-3">
        <div className="text-sm text-muted-foreground font-DanaNum">{shamsiDate}</div>
        <Select dir="rtl" value={selectedDay} onValueChange={setSelectedDay}>
          <SelectTrigger className="w-fit md:w-[150px]">
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

      <ReactApexChart options={options} series={[{ data: series }]} type="bar" height={300} />
    </>
  );
}
