'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ApexOptions } from 'apexcharts';
import { RefreshCcw } from 'lucide-react';
import moment from 'moment-jalaali';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

// Dynamically import ApexCharts to avoid SSR issues
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function AreaChartWithFill() {
  // State to handle client-side rendering
  const [mounted, setMounted] = useState(false);
  const [system, setSystem] = useState('webcom');
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
    // setSystem(localStorage.getItem('data-system') || "");
    setSystem(Cookies.get('data-system') || "")
  }, []);

  const systemColor = system == 'holo' ? '#CF3A3A' : '#96B22E';

  useEffect(() => {
    setMounted(true);
  }, []);

  // Chart data - creating realistic fluctuating data
  const upperData = [
    1404, 1403.2, 1403.5, 1403.8, 1403.7, 1403.6, 1404.2, 1403.5, 1404.5, 1404.9, 1404.2, 1404,
  ];
  const lowerData = [
    1403.2, 1403, 1403.4, 1403.6, 1403.2, 1402.8, 1403.5, 1402.7, 1403, 1404.2, 1404.2, 1403.8,
  ];

  // Chart options
  const options: ApexOptions = {
    chart: {
      type: 'area',
      height: 200,
      toolbar: {
        show: false,
      },
      fontFamily: 'system-ui, -apple-system, sans-serif',
      // background: "#ffffff",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    colors: [systemColor, '#999'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 100],
      },
    },
    grid: {
      borderColor: '#f5f5f5',
      row: {
        colors: ['transparent'],
        opacity: 0.5,
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
      categories: ['۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹', '۱۰', '۱۱', '۱۲'],
      labels: {
        style: {
          colors: '#A0A0A0',
          fontSize: '14px',
        },
      },
      axisBorder: {
        show: true,
        color: '#666',
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      min: 1402.5,
      max: 1405,
      tickAmount: 5,
      labels: {
        style: {
          colors: '#666',
          fontSize: '14px',
        },
        formatter: val => val.toFixed(0).toString(),
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: val => val.toFixed(1).toString(),
      },
    },
    legend: {
      show: false,
    },
  };

  if (!mounted) return <div className=" w-full rounded-3xl border border-gray-100 bg-white"></div>;

  return (
    <div className="w-full pt-4 border-t-2 ">
      {/* <p className="text-sm font-bold">نمودار میزان فروش</p> */}
      <div className="bg-muted-foreground/20 w-full min-h-10 px-3 flex items-center justify-center rounded-t-lg">
        <div className="text-base text-center items-center flex justify-between w-full px-0">
          <div className="w-1/3"></div>
          <div className="flex-1 flex-shrink-0 w-1/3 text-sm md:text-base font-semibold">نمودار میزان فروش</div>
          <div className="w-1/3 flex text-[10px] justify-end md:gap-2 items-center">
            <div className="flex flex-col justify-start items-center">
              <p>آخرین بروزرسانی:</p>
              <p className="-mt-2">10 دقیقه قبل</p>
            </div>
            <RefreshCcw className="w-4" />
          </div>
        </div>
      </div>

      {/* Header with date and selector */}
      <div className="flex flex-row-reverse justify-between items-center mt-3">
        <div className="  text-sm text-muted-foreground font-DanaNum">{shamsiDate}</div>
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
      <ReactApexChart
        options={options}
        series={[
          { name: 'سری اول', data: upperData },
          { name: 'سری دوم', data: lowerData },
        ]}
        type="area"
        height={250}
      />
    </div>
  );
}

