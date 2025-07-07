'use client';

import { Button } from '@/components/ui/button';
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
import { useState } from 'react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  visitorName: string;
};

export default function AddOffpriceModal({ isOpen, onClose, visitorName }: Props) {
  const [discounts, setDiscounts] = useState([
    { count: '', percent: '' },
    { count: '', percent: '' },
    { count: '', percent: '' },
    { count: '', percent: '' },
    { count: '', percent: '' },
  ]);

  const handleCountChange = (index: number, value: string) => {
    const newDiscounts = [...discounts];
    newDiscounts[index] = { ...newDiscounts[index], count: value };
    setDiscounts(newDiscounts);
  };

  const handlePercentChange = (index: number, value: string) => {
    const newDiscounts = [...discounts];
    newDiscounts[index] = { ...newDiscounts[index], percent: value };
    setDiscounts(newDiscounts);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Adding offprice for', visitorName, discounts);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] text-right" dir="rtl">
        <DialogHeader className="flex flex-col items-start justify-start ">
          <DialogTitle>اعمال تخفیف تعدادی</DialogTitle>
          <DialogDescription>برای بازاریاب {visitorName} تخفیف تعدادی اعمال کنید</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {discounts.map((discount, index) => (
              <div key={index} className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor={`count-${index}`} className="text-right">
                    تعداد
                  </Label>
                  <Input
                    id={`count-${index}`}
                    type="number"
                    value={discount.count}
                    onChange={e => handleCountChange(index, e.target.value)}
                    className="col-span-3 text-right"
                    placeholder="تعداد"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor={`percent-${index}`} className="text-right">
                    درصد تخفیف
                  </Label>
                  <Input
                    id={`percent-${index}`}
                    type="number"
                    value={discount.percent}
                    onChange={e => handlePercentChange(index, e.target.value)}
                    className="col-span-3 text-right"
                    placeholder="درصد تخفیف"
                  />
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button type="submit">تایید</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
