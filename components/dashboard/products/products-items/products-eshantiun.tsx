'use client';

import PageTitles from '@/components/modules/PageTitles';
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
import useFetcharticles from '@/hooks/api/useFetcharticles';
import createHttpService from '@/hooks/useHttps';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import AddEshantionModal from './modals/add-eshantion-modal/AddEshantionModal';

type Props = {};

export default function ProductsEshantiun({}: Props) {
  const [selectedproduct, setSelectedproduct] = useState<{
    name: string;
    code: number;
    showEshantion: boolean;
    showOffprice: boolean;
  } | null>(null);
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const { loading, articles, totalPages, setPage, setPerPage, page, perPage } = useFetcharticles();

  const handleEshantionClick = (product: any) => {
    setSelectedproduct({
      name: product?.FldN_Kala as string,
      code: product?.FldC_Kala as number,
      showEshantion: true,
      showOffprice: false,
    });
  };

  const handleOffpriceClick = (product: any) => {
    setSelectedproduct({
      name: product?.FldN_Kala as string,
      code: product?.FldC_Kala as number,
      showEshantion: false,
      showOffprice: true,
    });
  };

  const handleCloseModal = () => {
    setSelectedproduct(null);
  };

  return (
    <Suspense fallback={<div>در حال بارگذاری...</div>}>
      <div className="p-4 space-y-4">
        <PageTitles
          breadcrumbs={[
            { label: 'همگام', href: '/dashboard' },
            { label: 'کالا', href: '/dashboard/products' },
            { label: 'انتخاب اشانتیون', href: '/dashboard/products/eshantiun' },
          ]}
          showSearch={true}
          showDateRange={false}
          title={'انتخاب اشانتیون'}
          searchPlaceholder={'جستجو کالا'}
        />
        {loading ? (
          <Loading className="h-[60vh]" />
        ) : (
          <>
            <Card className="overflow-auto">
              <ScrollArea>
                <Table dir="rtl">
                  <TableHeader className="bg-muted text-xs md:text-sm">
                    <TableRow>
                      <TableHead className="text-right ">کدکالا</TableHead>
                      <TableHead className="text-right">نام کالا</TableHead>
                      <TableHead className="text-right ">عملیات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="text-xs md:text-sm">
                    {articles?.map((article, i) => (
                      <TableRow key={i} className={cn(i % 2 === 0 ? 'bg-white' : 'bg-muted/50')}>
                        <TableCell className=" font-DanaNum">{article.FldC_Kala}</TableCell>
                        <TableCell>{article.FldN_Kala}</TableCell>
                        <TableCell className="table-cell">
                          <div className="gap-2 text-xs flex flex-col md:flex-row">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEshantionClick(article)}
                            >
                              <p className="text-xs md:text-sm">اضافه کردن اشانتیون</p>
                            </Button>
                            {/* <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOffpriceClick(article.FldN_Kala)}
                            >
                              <p className="text-xs md:text-sm">اعمال تخفیف تعدادی</p>
                            </Button> */}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
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
            </Card>
          </>
        )}
      </div>

      {selectedproduct?.showEshantion && (
        <AddEshantionModal
          vcode={code}
          isOpen={true}
          onClose={handleCloseModal}
          productName={selectedproduct.name}
          productCode={selectedproduct.code}
        />
      )}

      {/* {selectedproduct?.showOffprice && (
        <AddOffpriceModal
          isOpen={true}
          onClose={handleCloseModal}
          productName={selectedproduct.name}
          productCode={selectedproduct.code}
        />
      )} */}
    </Suspense>
  );
}
