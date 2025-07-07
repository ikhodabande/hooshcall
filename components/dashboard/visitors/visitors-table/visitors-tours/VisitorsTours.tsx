'use client';

import VisitorMobileSetting from '@/components/dashboard/visitors/visitors-table/modals/visitor-mobilesetting/VisitorMobileSetting';
import VisitorSettingModal from '@/components/dashboard/visitors/visitors-table/modals/visitorsetting-modal/VisitorSettingModal';
import PageTitles from '@/components/modules/PageTitles';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
import { cn } from '@/lib/utils';
import { Ban, Check, Info, LucideDelete } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

type Props = {};

export default function VisitorsTours({}: Props) {
  const [selectedDates, setSelectedDates] = useState<{ [key: number]: string }>({});
  const [selectedRegions, setSelectedRegions] = useState<{ [key: number]: string }>({});

  const dateOptions = [
    { value: 'today', label: 'امروز' },
    { value: 'yesterday', label: 'دیروز' },
    { value: 'lastWeek', label: 'هفته گذشته' },
    { value: 'lastMonth', label: 'ماه گذشته' },
  ];

  const regionOptions = [
    { value: 'tehran', label: 'تهران' },
    { value: 'qazvin', label: 'قزوین' },
    { value: 'isfahan', label: 'اصفهان' },
    { value: 'shiraz', label: 'شیراز' },
  ];

  const handleDateChange = (rowIndex: number, value: string) => {
    setSelectedDates(prev => ({ ...prev, [rowIndex]: value }));
  };

  const handleRegionChange = (rowIndex: number, value: string) => {
    setSelectedRegions(prev => ({ ...prev, [rowIndex]: value }));
  };

  return (
    <>
      <div className="p-4 space-y-4">
        <PageTitles
          breadcrumbs={[
            { label: 'همگام', href: '/dashboard' },
            // { label: 'بازاریاب', href: '/dashboard/visitors' },
            { label: 'مشاهده بازاریاب‌ها', href: '/dashboard/visitors' },
            { label: 'تور ویزیت', href: '/dashboard/visitors/table/visit-tours' },
          ]}
          title={'تور ویزیت'}
        />
        <Card className="overflow-auto my-4">
          <ScrollArea>
            <Table dir="rtl">
              <TableHeader className="bg-muted text-xs md:text-sm">
                <TableRow>
                  <TableHead className="text-right hidden md:table-cell">شماره</TableHead>
                  <TableHead className="text-right">نام ویزیتور</TableHead>
                  <TableHead className="text-right hidden md:table-cell">شماره تلفن</TableHead>
                  <TableHead className="text-right hidden md:table-cell">منطقه</TableHead>
                  <TableHead className="text-right hidden md:table-cell">تاریخ</TableHead>
                  <TableHead className="text-right">وضعیت</TableHead>
                  <TableHead className="text-right hidden md:table-cell">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-xs md:text-sm">
                {Array.from({ length: 15 }).map((_, i) => (
                  <TableRow key={i} className={cn(i % 2 === 0 ? 'bg-white' : 'bg-muted/50')}>
                    <TableCell className="hidden md:table-cell font-DanaNum">
                      {(i % 3) + 1}
                    </TableCell>
                    <TableCell>{i % 2 === 0 ? 'امیر محمد خواننده' : 'عرفان بوند'}</TableCell>
                    <TableCell className="hidden md:table-cell">۰۹۱۴۱۵۱۵۱۵</TableCell>
                    <TableCell>
                      <Select
                        value={selectedRegions[i] || ''}
                        onValueChange={value => handleRegionChange(i, value)}
                      >
                        <SelectTrigger className="w-[120px] h-8">
                          <SelectValue placeholder="انتخاب منطقه" />
                        </SelectTrigger>
                        <SelectContent>
                          {regionOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={selectedDates[i] || ''}
                        onValueChange={value => handleDateChange(i, value)}
                      >
                        <SelectTrigger className="w-[120px] h-8">
                          <SelectValue placeholder="انتخاب تاریخ" />
                        </SelectTrigger>
                        <SelectContent>
                          {dateOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right flex items-center justify-between">
                      {i % 3 === 0 ? (
                        <span className="text-[#53D060] font-medium flex items-center gap-1">
                          {' '}
                          <span className="hidden md:flex ">
                            <Check />
                          </span>
                          ثبت شده
                        </span>
                      ) : (
                        <span className="text-[#F96161] font-medium flex items-center gap-1">
                          {' '}
                          <span className="hidden md:flex">
                            <Ban />
                          </span>
                          ثبت نشده
                        </span>
                      )}
                      <div className="md:hidden flex">
                        {' '}
                        <VisitorSettingModal order={i} />
                      </div>
                    </TableCell>
                    <TableCell className="table-cell">
                      <div className="hidden md:flex gap-2 text-xs ">
                        <Link href={'tours-map'} className="flex items-center gap-1">
                          <Info />
                          <p>مشاهده جزییات</p>
                        </Link>
                        <Button variant="ghost" size="sm">
                          <LucideDelete />
                          <p>حذف تور</p>
                        </Button>
                      </div>
                      <div className="md:hidden flex">
                        <VisitorMobileSetting />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </Card>
      </div>
    </>
  );
}
