'use client';

import { Calendar as CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import MultiDatePicker from 'react-multi-date-picker';

interface DatePickerProps {
  date: Date | null;
  setDate: (date: Date | null) => void;
  placeholder?: string;
  calendar?: 'persian' | 'gregorian';
}

export function DatePicker({
  date,
  setDate,
  placeholder = 'انتخاب تاریخ',
  calendar = 'persian',
}: DatePickerProps) {
  const [value, setValue] = useState(date);

  return (
    <div className="relative sm:w-[180px]">
      <MultiDatePicker
        value={value}
        onChange={date => {
          setValue(date?.toDate() || null);
          setDate(date?.toDate() || null);
        }}
        calendar={persian}
        locale={persian_fa}
        calendarPosition="bottom-right"
        inputClass="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        placeholder={placeholder}
        digits={['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']}
        containerClassName="w-full"
        inputMode="none"
      />
      <CalendarIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
    </div>
  );
}
