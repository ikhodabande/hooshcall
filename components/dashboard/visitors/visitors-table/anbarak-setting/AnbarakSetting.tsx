'use client';

import PageTitles from '@/components/modules/PageTitles';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useIsMobile } from '@/hooks/use-mobile';
import createHttpService from '@/hooks/useHttps';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import AnbarakSettingModal from './AnbarakSettingModal';

type Props = {
  visitorName?: string;
  visitorCode?: string;
};

export default function AnbarakSetting({ visitorName, visitorCode }: Props) {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [counts, setCounts] = useState<{ [key: number]: string }>({});
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const isMobile = useIsMobile();
  const { httpService } = createHttpService();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState<any[]>([]);
  const searchParams = useSearchParams();
  const code = searchParams.get('code'); // 👈 This is how you get the code

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);

        const res = await httpService.post('/Get_Holoo_Articles', {
          page,
          per_page: perPage,
        });

        const data = res.data;

        const normalized = Object.values(data.data).map((a: any) => ({
          article_code: a.FldC_Kala,
          name: a.FldN_Kala,
          code: a.FldACode_C,
          price: a.FldFee,
          registeredBalance: a.FldMande,
          image: a.FldImage,
        }));

        setArticles(normalized);
        setTotalPages(Math.ceil(data.total / perPage));
      } catch (error) {
        console.error('❌ خطا در دریافت کالاها:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [page, perPage]);

  useEffect(() => {
    const fetchAssignedItems = async () => {
      if (!articles?.length || !code) return;

      const res = await httpService.get(`/miniwarehouse/${code}`);
      const assignedItems = res.data.items || [];

      setSelectedItems(
        assignedItems
          .map((item: any) => articles.findIndex(a => a.article_code === item.article_code))
          .filter((index: any) => index !== -1)
      );

      setCounts(prev => {
        const updatedCounts = { ...prev };
        assignedItems.forEach((item: any) => {
          const index = articles.findIndex(a => a.article_code === item.article_code);
          if (index !== -1) updatedCounts[index] = String(item.quantity);
        });
        return updatedCounts;
      });
    };

    fetchAssignedItems();
  }, [articles, code]);

  const handleCheckboxChange = async (index: number) => {
    const alreadySelected = selectedItems.includes(index);
    const newSelected = alreadySelected
      ? selectedItems.filter(i => i !== index)
      : [...selectedItems, index];

    setSelectedItems(newSelected);

    if (alreadySelected) {
      try {
        await httpService.post('delete_from_miniwarehouse', {
          visitor_code: code,
          article_codes: [articles[index].article_code],
        });
      } catch (error) {
        console.error('❌ Error deleting article:', error);
      }
    }
  };

  const handleCountChange = (index: number, value: string) => {
    setCounts(prev => ({
      ...prev,
      [index]: value,
    }));
  };

  const handleRowClick = (index: number) => {
    if (isMobile) {
      setSelectedItem(index);
    }
  };

  const handleModalClose = () => {
    setSelectedItem(null);
  };

  return (
    <Suspense fallback={<div>در حال بارگذاری...</div>}>
      <div className="p-5 space-y-4">
        <PageTitles
          breadcrumbs={[
            { label: 'همگام', href: '/dashboard' },
            // { label: 'بازاریاب', href: '/dashboard/visitors' },
            { label: 'مشاهده بازاریاب‌ها', href: '/dashboard/visitors' },
            { label: 'تنظیم انبارک', href: '/dashboard/visitors/table/tours-map' },
          ]}
          showSearch={true}
          showDateRange={false}
          title={'تنظیم انبارک'}
          searchPlaceholder={'جستجو کالا'}
          visitorName={visitorName}
          visitorCode={visitorCode}
          onSearchResult={data => {
            setArticles(data);
          }}
        />
        <Card className="overflow-auto">
          <ScrollArea>
            <Table dir="rtl">
              <TableHeader className="bg-muted text-xs md:text-sm">
                <TableRow>
                  <TableHead className="text-right hidden md:table-cell">شماره</TableHead>
                  <TableHead className="text-center">انتخاب</TableHead>
                  <TableHead className="text-right">نام کالا</TableHead>
                  <TableHead className="text-right hidden md:table-cell">کد کالا</TableHead>
                  <TableHead className="text-right">مانده کل</TableHead>
                  <TableHead className="text-right hidden md:table-cell">مانده ثبت شده</TableHead>
                  <TableHead className="text-right">تعداد</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-xs md:text-sm">
                {articles?.map((item, i) => (
                  <TableRow
                    key={i}
                    className={cn(
                      i % 2 === 0 ? 'bg-white' : 'bg-muted/50',
                      isMobile ? 'cursor-pointer' : 'cursor-default'
                    )}
                    onClick={() => handleRowClick(i)}
                  >
                    <TableCell className="hidden md:table-cell font-DanaNum">{i}</TableCell>
                    <TableCell className="text-center">
                      <Checkbox
                        checked={selectedItems.includes(i)}
                        onCheckedChange={() => handleCheckboxChange(i)}
                      />
                    </TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="hidden md:table-cell">{item.code}</TableCell>
                    <TableCell className="text-center">100</TableCell>
                    <TableCell className="hidden md:table-cell">{item.registeredBalance}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={counts[i] || ''}
                        onChange={e => handleCountChange(i, e.target.value)}
                        className="w-20 text-center text-sm"
                        placeholder="تعداد"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {/* Per Page Selector */}
            <div className="flex justify-end items-center gap-2 px-4 pt-2">
              <label className="text-sm">تعداد در صفحه:</label>
              <select
                className="border rounded px-2 py-1 text-sm"
                value={perPage}
                onChange={e => {
                  setPage(1); // reset to first page
                  setPerPage(Number(e.target.value));
                }}
              >
                {[5, 10, 15, 20, 50].map(n => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            {totalPages > 1 && (
              <div className="hidden md:flex items-center justify-center gap-2 py-4 text-sm font-DanaNum">
                <button
                  onClick={() => setPage(p => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  قبلی
                </button>

                {(() => {
                  const pages: (number | string)[] = [];
                  const start = Math.max(2, page - 1);
                  const end = Math.min(totalPages - 1, page + 1);

                  pages.push(1);
                  if (start > 2) pages.push('...');
                  for (let i = start; i <= end; i++) pages.push(i);
                  if (end < totalPages - 1) pages.push('...');
                  if (totalPages > 1) pages.push(totalPages);

                  return pages.map((p, index) =>
                    typeof p === 'string' ? (
                      <span key={`ellipsis-${index}`} className="px-2">
                        ...
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={cn(
                          'px-3 py-1 border rounded',
                          p === page ? 'bg-muted font-bold' : 'hover:bg-muted/50'
                        )}
                      >
                        {p}
                      </button>
                    )
                  );
                })()}

                <button
                  onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  بعدی
                </button>
              </div>
            )}

            {/* Mobile Pagination (Simplified) */}
            {totalPages > 1 && (
              <div className="flex md:hidden items-center justify-between p-4 text-sm font-DanaNum">
                <button
                  onClick={() => setPage(p => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  قبلی
                </button>

                <span className="px-4">
                  {page} از {totalPages}
                </span>

                <button
                  onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  بعدی
                </button>
              </div>
            )}

            {!loading && articles?.length === 0 && (
              <div className="text-center text-sm w-full text-muted-foreground py-4">
                کالایی برای شما یافت نشد!
              </div>
            )}

            <Button
              className="w-[90vw] mx-auto left-0 right-0 mt-4 fixed bottom-4"
              onClick={async () => {
                const itemsToAssign = selectedItems.map(i => ({
                  article_code: articles[i].article_code,
                  quantity: parseInt(counts[i] || '0'),
                }));

                await httpService.post('assign_to_miniwarehouse', {
                  visitor_code: code,
                  items: itemsToAssign,
                });

                alert('✅ کالاها با موفقیت ذخیره شدند.');
              }}
            >
              ذخیره انبارک
            </Button>
          </ScrollArea>
        </Card>
      </div>

      {/* Only show modal on mobile */}
      {isMobile && selectedItem !== null && (
        <AnbarakSettingModal
          isOpen={true}
          onClose={handleModalClose}
          item={[selectedItem]}
          selected={selectedItems.includes(selectedItem)}
          count={counts[selectedItem] || ''}
          onCheckboxChange={() => handleCheckboxChange(selectedItem)}
          onCountChange={value => handleCountChange(selectedItem, value)}
        />
      )}
    </Suspense>
  );
}
