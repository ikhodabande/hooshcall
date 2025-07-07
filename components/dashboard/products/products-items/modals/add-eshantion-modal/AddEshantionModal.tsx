'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import useFetcharticles from '@/hooks/api/useFetcharticles';
import createHttpService from '@/hooks/useHttps';
import { cn } from '@/lib/utils';
import { showToast } from '@/utils/toastService';
import { useState } from 'react';
type Props = {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  productCode: number;
  vcode: any;
};

export default function AddEshantionModal({
  isOpen,
  onClose,
  productName,
  productCode,
  vcode,
}: Props) {
  const [buyMoreThan, setBuyMoreThan] = useState('');
  const [countOfGift, setCountOfGift] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [selectedproduct, setSelectedproduct] = useState<{
    name: string;
    code: number;
    showEshantion: boolean;
    showOffprice: boolean;
  } | null>(null);
  const { httpService } = createHttpService();
  const { loading, articles, totalPages, setPage, setPerPage, page, perPage } = useFetcharticles();


 

  const handleProductToggle = (productId: number) => {
    setSelectedProducts(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!buyMoreThan || !countOfGift || selectedProducts.length === 0) {
      showToast('', 'لطفاً تمام فیلدها را پر کرده و حداقل یک محصول را انتخاب کنید.');
      return;
    }

    try {
      for (const giftCode of selectedProducts) {
        const body = {
          A_Code: String(productCode), // main product code
          quantity: Number(countOfGift), // number of gifts
          gift_code: String(giftCode), // selected gift product
          threshold: Number(buyMoreThan), // threshold to qualify for gift
          visitor_code: Number(vcode),
        };

        await httpService.post('/assign_gift', body);
      }

      showToast('اشانتیون‌ها با موفقیت ثبت شدند.', '');
      onClose();
    } catch (error) {
      console.error('❌ خطا در ارسال اشانتیون:', error);
      showToast('خطایی در ثبت اشانتیون رخ داد.', 'خطا', 'destructive');
    }
  };

  const handleDeleteEshantion = () => {
    // Handle delete eshantion here
    console.log('Deleting eshantion for', productName);
    onClose();
  };

  const filteredProducts = articles?.filter(
    product => product.FldN_Kala.includes(searchQuery) || product.FldC_Kala.includes(searchQuery)
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-w-[95vw] rounded-xl text-right" dir="rtl">
        <DialogHeader className="flex m-2 flex-col items-start justify-start">
          <DialogTitle className="">اضافه کردن اشانتیون</DialogTitle>
          <DialogDescription>برای کالای <span className='  text-black font-semibold'>{productName}</span> اشانتیون اضافه کنید</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="buyMoreThan" className="text-right">
                  خرید بیشتر از
                </Label>
                <Input
                  id="buyMoreThan"
                  type="number"
                  value={buyMoreThan}
                  onChange={e => setBuyMoreThan(e.target.value)}
                  className="col-span-3 text-right"
                  placeholder="تعداد خرید"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="countOfGift" className="text-right">
                  تعداد هدیه
                </Label>
                <Input
                  id="countOfGift"
                  type="number"
                  value={countOfGift}
                  onChange={e => setCountOfGift(e.target.value)}
                  className="col-span-3 text-right"
                  placeholder="تعداد هدیه"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="search">جستجوی محصول</Label>
              <Input
                id="search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="جستجو بر اساس نام یا کد محصول"
                className="text-right "
              />
            </div>

            <div className="border rounded-md p-2">
              <Label className="mb-2 block">لیست محصولات</Label>
              <ScrollArea className="h-[200px] px-4 no-scrollbar">
                <div className="space-y-2 py-2">
                  {filteredProducts?.map(product => (
                    <div key={product.FldC_Kala} className="flex items-center gap-2">
                      <Label htmlFor={`product-${product.FldC_Kala}`} className="flex-1 text-sm">
                        {product.FldN_Kala} - {product.FldC_Kala}
                      </Label>
                      <Checkbox
                        id={`product-${product.FldC_Kala}`}
                        checked={selectedProducts.includes(product.FldC_Kala)}
                        onCheckedChange={() => handleProductToggle(product.FldC_Kala)}
                      />
                    </div>
                  ))}
                </div>
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
            </div>
          </div>
          <DialogFooter className="flex gap-2 justify-between">
            <Button type="button" variant="destructive" onClick={handleDeleteEshantion}>
              حذف اشانتیون
            </Button>
            <Button type="submit">تایید</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
