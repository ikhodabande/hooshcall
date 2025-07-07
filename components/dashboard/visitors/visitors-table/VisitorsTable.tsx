'use client';

import VisitorMobileSetting from '@/components/dashboard/visitors/visitors-table/modals/visitor-mobilesetting/VisitorMobileSetting';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Loading from '@/components/ui/loading';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import createHttpService from '@/hooks/useHttps';
import { cn } from '@/lib/utils';
import { PackageSearch, SettingsIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function VisitorsTable() {
  const [visitors, setVisitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { httpService } = createHttpService();

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        setLoading(true);
        const res = await httpService.get('/get_visitors');
        const data = res.data;
        setVisitors(data);
        setLoading(false);
      } catch (error) {
        console.error('❌ خطا در دریافت اطلاعات بازاریاب‌ها:', error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchVisitors();
  }, []);

  
  return (
    <div className="p-4 space-y-4">
      {/* <PageTitles LoadingSet={setLoading} title={'مشاهده بازاریاب ها'} /> */}
      {loading ? (
        <>
          <Loading className="h-[60vh]" />
        </>
      ) : (
        <>
          <Card className="overflow-auto">
            <ScrollArea>
              <Table dir="rtl">
                <TableHeader className="bg-muted text-xs md:text-sm">
                  <TableRow>
                    <TableHead className="text-right hidden md:table-cell">شماره</TableHead>
                    <TableHead className="text-right">نام ویزیتور</TableHead>
                    <TableHead className="text-right">کد ویزیتور</TableHead>
                    <TableHead className="text-right hidden md:table-cell">شماره تلفن</TableHead>
                    <TableHead className="text-right hidden md:table-cell">عملیات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-xs md:text-sm">
                  {visitors.map((visitor, i) => (
                    <TableRow key={i} className={cn(i % 2 === 0 ? 'bg-white' : 'bg-muted/50')}>
                      <TableCell className="hidden md:table-cell font-DanaNum">{i + 1}</TableCell>
                      <TableCell className="font-DanaNum">{visitor.FldN_Visitor}</TableCell>
                      <TableCell className="font-DanaNum">{visitor.FldC_Visitor}</TableCell>
                      <TableCell className="hidden md:table-cell font-DanaNum">
                        {visitor.FldMob}
                      </TableCell>

                      <TableCell className="table-cell">
                        <div className="hidden md:flex gap-2 text-xs ">
                          <Link
                            href={`table/visitors-setting/?VisitorCode=${visitor.FldC_Visitor}`}
                          >
                            <Button variant="ghost" size="sm">
                              {/* <Settings /> */}
                              <SettingsIcon />
                              <p>تنظیمات ویزیتور</p>
                            </Button>
                          </Link>{' '}
                          <Link href={`table/anbarak-setting?code=${visitor.FldC_Visitor}`}>
                            <Button variant="ghost" size="sm">
                              <PackageSearch />
                              <p>تنظیم انبارک</p>
                            </Button>
                          </Link>
                          <Link href={`customers?code=${visitor.FldC_Visitor}`}>
                            <Button variant="ghost" size="sm">
                              <PackageSearch />
                              <p>مشتریان حسابداری</p>
                            </Button>
                          </Link>
                          <Link href={`/dashboard/products/eshantiun?code=${visitor.FldC_Visitor}`}>
                            <Button variant="ghost" size="sm">
                              <PackageSearch />
                              <p>اشانتیون کالا</p>
                            </Button>
                          </Link>
                          {/* <Link href={'table/visit-tours'}>
                            <Button variant="ghost" size="sm">
                              <LocateFixedIcon />
                              <p>تور ویزیت</p>
                            </Button>
                          </Link> */}
                        </div>
                        <div className="md:hidden flex">
                          <VisitorMobileSetting
                            anbLink={`table/anbarak-setting?code=${visitor.FldC_Visitor}`}
                            setLink={`table/visitors-setting/?VisitorCode=${visitor.FldC_Visitor}`}
                            cusLink={`customers?code=${visitor.FldC_Visitor}`}
                            visitorName={visitor.FldN_Visitor}
                            visitorCode={visitor.FldC_Visitor}
                            visitorMob={visitor.FldMob}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>{' '}
            {!loading && visitors.length === 0 && (
              <div className="text-center text-sm w-full text-muted-foreground py-4">
                ویزیتوری برای شما یافت نشد!
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
