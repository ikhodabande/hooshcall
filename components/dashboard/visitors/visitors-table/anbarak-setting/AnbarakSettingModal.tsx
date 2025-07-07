'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Ban, Check } from 'lucide-react';

interface AnbarakSettingModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: any;
  selected: boolean;
  count: string;
  onCheckboxChange: () => void;
  onCountChange: (value: string) => void;
}

export default function AnbarakSettingModal({
  isOpen,
  onClose,
  item,
  selected,
  count,
  onCheckboxChange,
  onCountChange,
}: AnbarakSettingModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>جزئیات محصول</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh]">
          <div className="space-y-4 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">انتخاب</span>
              <Checkbox checked={selected} onCheckedChange={onCheckboxChange} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">نام کالا</span>
              <span className="text-sm">{item.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">کد کالا</span>
              <span className="text-sm">{item.code}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">مانده کل</span>
              <span className="text-sm">{item.totalBalance}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">مانده ثبت شده</span>
              <span className="text-sm">{item.registeredBalance}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">وضعیت</span>
              <span
                className={`text-sm font-medium flex items-center gap-1 ${
                  item.isActive ? 'text-[#53D060]' : 'text-[#F96161]'
                }`}
              >
                {item.isActive ? (
                  <>
                    <Check className="h-4 w-4" />
                    فعال
                  </>
                ) : (
                  <>
                    <Ban className="h-4 w-4" />
                    غیرفعال
                  </>
                )}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">تعداد</span>
              <Input
                type="number"
                value={count}
                onChange={e => onCountChange(e.target.value)}
                className="w-20 text-left"
                placeholder="تعداد"
              />
            </div>
          </div>
        </ScrollArea>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            بستن
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
