'use client';

import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import createHttpService from '@/hooks/useHttps';
import { Search } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

type BreadcrumbItem = {
  label: string;
  href: string;
};

type Props = {
  title: string | null;
  breadcrumbs?: BreadcrumbItem[];
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  showDateRange?: boolean;
  startDate?: Date | null;
  endDate?: Date | null;
  onDateRangeChange?: (startDate: Date | null, endDate: Date | null) => void;
  visitorName?: string;
  visitorCode?: string;
  classNames?: string;
  showFilter?: boolean;
  LoadingSet?: (loading: boolean) => void;
};

export default function PageTitles({
  title,
  breadcrumbs = [
    { label: 'همگام', href: '/dashboard' },
    { label: 'بازاریاب', href: '/dashboard/visitors' },
    { label: 'مشاهده بازاریاب‌ها', href: '/dashboard/visitors/table' },
  ],
  showSearch = true,
  searchPlaceholder = 'جستجو بر اساس نام یا IMEI',
  onSearch,
  showDateRange = false,
  onSearchResult,
  startDate: initialStartDate = null,
  endDate: initialEndDate = null,
  onDateRangeChange,
  visitorName,
  visitorCode,
  classNames,
  showFilter,
  LoadingSet,
}: Props & { onSearchResult?: (result: any[]) => void }) {
  const [startDate, setStartDate] = useState<Date | null>(initialStartDate);
  const [endDate, setEndDate] = useState<Date | null>(initialEndDate);
  const [searchValue, setSearchValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState(searchValue);
  const { httpService } = createHttpService();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(searchValue);
    }, 500); // نصف ثانیه تاخیر برای تایپ

    return () => {
      clearTimeout(handler);
    };
  }, [searchValue]);

  showSearch &&
    useEffect(() => {
      const fetchData = async () => {
        try {
          LoadingSet?.(true);
          if (!debouncedValue.trim()) {
            // اگر مقدار خالی است، همه مقالات را بگیر
            const result = await httpService.post('/Get_Holoo_Articles', {
              page,
              per_page: perPage,
            });
            onSearchResult?.(result?.data?.data);
            setTotalPages(Math.ceil(result?.data?.total / perPage));

            LoadingSet?.(false);
          } else {
            // در غیر این صورت جستجو کن
            const result = await httpService.get(`Search_Holoo_Articles?search=${debouncedValue}`);
            onSearchResult?.(result.data.Articles);
            LoadingSet?.(false);
          }
        } catch (err) {
          console.error('خطا در جستجو:', err);
          LoadingSet?.(false);

          onSearchResult?.([]);
        }
      };

      fetchData();
    }, [debouncedValue]);

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
    onDateRangeChange?.(date, endDate);
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
    onDateRangeChange?.(startDate, date);
  };

  return (
    <>
      <div
        className={`bg-background h-fit min-h-[100px] border p-4 relative rounded-xl shadow ${classNames}`}
      >
        <button
          onClick={() => window?.history?.back()}
          className="absolute top-0 left-0 text-2xl p-2 md:p-4 mx-2"
        >
          ×
        </button>

        <div className="flex flex-col items-start md:gap-2  md:justify-between">
          <div className="flex flex-col gap-1">
            <h3 className="text-primary md:text-xl font-semibold">{title}</h3>
          </div>
          <div className="flex items-center gap-1 text-xs md:text-sm  text-muted-foreground">
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={item.href}>
                <Link href={item.href} className="hover:underline">
                  {item.label}
                </Link>
                {index < breadcrumbs.length - 1 && <span>/</span>}
              </React.Fragment>
            ))}
          </div>
          <div className={` ${visitorName || visitorCode ? ' md:  h-14' : ''}`}>
            {(visitorName || visitorCode) && (
              <div className="text-sm text-muted-foreground">
                {visitorName && (
                  <span>
                    نام بازاریاب: <span className="font-semibold">{visitorName}</span>
                  </span>
                )}
                {visitorName && visitorCode && <span className="mx-2">|</span>}
                {visitorCode && (
                  <span>
                    کد بازاریاب: <span className="font-semibold font-DanaNum">{visitorCode}</span>{' '}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center mt-2 md:-mt-10 gap-4">
          {showSearch && (
            <div className="relative w-full max-w-md">
              <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={searchPlaceholder}
                className="pr-8 text-xs md:text-sm"
                onChange={e => setSearchValue(e.target.value)}
              />
            </div>
          )}

          {showDateRange && (
            <div className="flex items-center gap-2">
              <DatePicker
                date={startDate}
                setDate={handleStartDateChange}
                placeholder="از تاریخ"
                calendar="persian"
              />
              <span>تا</span>
              <DatePicker
                date={endDate}
                setDate={handleEndDateChange}
                placeholder="تا تاریخ"
                calendar="persian"
              />
            </div>
          )}

          {showFilter && (
            <div className="flex flex-col md:flex-row items-start gap-8 absolute -bottom-40 md:top-4">
              {/* Column 1: Filters */}
              <div className="flex flex-col gap-2">
                <span className="text-xs md:text-sm text-gray-500">فیلتر بر اساس:</span>
                <div className="flex gap-2">
                  <button className="border text-xs md:text-sm rounded-md px-4 py-2">
                    تراکنش‌های ثبت شده
                  </button>
                  <button className="border text-xs md:text-sm rounded-md px-4 py-2">
                    تراکنش‌های ثبت نشده
                  </button>
                </div>
              </div>

              {/* Column 2: Operations */}
              <div className="flex flex-col gap-2">
                <span className="text-xs md:text-sm text-gray-500">عملیات:</span>
                <div className="flex gap-2">
                  <button className="border text-xs md:text-sm rounded-md px-4 py-2">
                    تایید پرداخت
                  </button>
                  <button className="border text-xs md:text-sm rounded-md px-4 py-2">
                    حذف تراکنش
                  </button>
                  <button className="border text-xs md:text-sm rounded-md px-4 py-2">
                    چاپ گزارش
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
