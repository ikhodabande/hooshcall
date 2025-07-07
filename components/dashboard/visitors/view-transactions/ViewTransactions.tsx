'use client';

import PageTitles from '@/components/modules/PageTitles';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

type Props = {};

export default function ViewTransactions({}: Props) {
  return (
    <>
      <div className="p-4 space-y-4">
        <PageTitles
          breadcrumbs={[
            { label: 'همگام', href: '/dashboard' },
            { label: 'بازاریاب', href: '/dashboard/visitors' },
            { label: 'تراکنش ها', href: '/dashboard/visitors/view-transactions' },
          ]}
          title={'تراکنش ها'}
          showSearch={false}
          visitorName="عماد دشتی"
          visitorCode="1012"
          showFilter={true}
        />

        <Card className="overflow-auto my-4">
          <ScrollArea>
            <Table dir="rtl">
              <TableHeader className="bg-muted text-xs md:text-sm">
                <TableRow>
                  <TableHead className="text-right hidden md:table-cell">انتخاب</TableHead>
                  <TableHead className="text-right">نام مشتری</TableHead>
                  <TableHead className="text-right hidden md:table-cell">نام ویزیتور</TableHead>
                  <TableHead className="text-right hidden md:table-cell">شماره ثبت</TableHead>
                  <TableHead className="text-right hidden md:table-cell">نوع پرداخت</TableHead>
                  <TableHead className="text-right hidden md:table-cell">مبلغ</TableHead>
                  <TableHead className="text-right hidden md:table-cell">شماره چک</TableHead>
                  <TableHead className="text-right hidden md:table-cell">تاریخ چک</TableHead>
                  <TableHead className="text-right hidden md:table-cell">بانک</TableHead>
                  <TableHead className="text-right hidden md:table-cell">تاریخ ثبت </TableHead>
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
                    <TableCell className="hidden md:table-cell">۰۹۱۴۱۵۱۵۱۵</TableCell>
                    <TableCell className="hidden md:table-cell">۰۹۱۴۱۵۱۵۱۵</TableCell>
                    <TableCell className="hidden md:table-cell">۰۹۱۴۱۵۱۵۱۵</TableCell>
                    <TableCell className="hidden md:table-cell">۰۹۱۴۱۵۱۵۱۵</TableCell>
                    <TableCell className="hidden md:table-cell">۰۹۱۴۱۵۱۵۱۵</TableCell>
                    <TableCell className="hidden md:table-cell">۰۹۱۴۱۵۱۵۱۵</TableCell>
                    <TableCell className="hidden md:table-cell">۰۹۱۴۱۵۱۵۱۵</TableCell>
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
