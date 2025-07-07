import PageTitles from '@/components/modules/PageTitles';
import { Button } from '@/components/ui/button';
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
import { Ban, Check, Info, LucideDelete } from 'lucide-react';
import Link from 'next/link';

type Props = {};

export default function RecieveFactor({}: Props) {
  return (
    <>
      <div className="p-4 space-y-4">
        <PageTitles
          breadcrumbs={[
            { label: 'همگام', href: '/dashboard' },
            { label: 'سفارشات', href: '/dashboard/visitors' },
            { label: 'دریافت فاکتور', href: '/dashboard/visitors/table' },
          ]}
          title={'دریافت فاکتور'}
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
                    <TableCell></TableCell>

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
                      <div className="md:hidden flex"> </div>
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
                      <div className="md:hidden flex"></div>
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
