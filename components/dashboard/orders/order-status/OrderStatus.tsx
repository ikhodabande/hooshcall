'use client';

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
import createHttpService from '@/hooks/useHttps';
import { cn } from '@/lib/utils';
import { Ban, Check, ChevronDown, ChevronUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';

type OrderItem = {
  R_ArCode: string;
  R_ArName: string;
  R_Cost: number;
  R_Few: number;
  RqIndex: number;
  RqType: string;
};

type OrderTitle = {
  R_CusCode: string;
  R_CusName?: string;
  Visitor_Code?: number;
  Phone?: string;
  R_Date: string;
  RqIndex: number;
  RqType: string;
  SumPrice: number;
  T_Date: string;
};

type Order = {
  RQTITLE: OrderTitle;
  RQDETAIL: OrderItem[];
};

export default function OrderStatus() {
  const [loading, setLoading] = useState(true);
  const { httpService } = createHttpService();
  const [products, setProducts] = useState<Order[]>([]);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await httpService.post('/get_order_details', {
          R_Date_From: 'all',
          R_Date_To: 'all',
        });
        const data = res.data.Orders;
        setProducts(data);
      } catch (error) {
        console.error('❌ خطا در دریافت سفارش‌ها:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const toggleRow = (index: number) => {
    if (expandedRows.includes(index)) {
      setExpandedRows(expandedRows.filter(i => i !== index));
    } else {
      setExpandedRows([...expandedRows, index]);
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* --- Table for desktop --- */}
      <Card className="overflow-auto my-4 hidden md:block">
        <ScrollArea>
          <Table dir="rtl">
            <TableHeader className="bg-muted text-xs md:text-sm">
              <TableRow>
                <TableHead className="text-right">ردیف</TableHead>
                <TableHead className="text-right">کد مشتری</TableHead>
                <TableHead className="text-right">کد ویزیتور</TableHead>
                <TableHead className="text-right">تاریخ سفارش</TableHead>
                <TableHead className="text-right">جمع کل</TableHead>
                <TableHead className="text-right">وضعیت</TableHead>
                <TableHead className="text-right">شماره تماس</TableHead>
                <TableHead className="text-right">جزئیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs md:text-sm">
              {products?.map((order, index) => (
                <React.Fragment key={`order-${index}`}>
                  <TableRow className={cn(index % 2 === 0 ? 'bg-muted' : 'bg-muted/50')}>
                    <TableCell className="font-DanaNum">{index + 1}</TableCell>
                    <TableCell className="font-DanaNum">{order.RQTITLE.R_CusCode}</TableCell>
                    <TableCell className="font-DanaNum">
                      {order.RQTITLE.Visitor_Code || '-'}
                    </TableCell>
                    <TableCell>
                      {new Date(order.RQTITLE.R_Date).toLocaleDateString('fa-IR')}
                    </TableCell>
                    <TableCell>{order.RQTITLE.SumPrice.toLocaleString('fa-IR')} ریال</TableCell>
                    <TableCell>
                      {order.RQTITLE.SumPrice > 0 ? (
                        <span className="text-[#53D060] flex items-center gap-1">
                          <Check className="w-4 h-4" />
                          ثبت شده
                        </span>
                      ) : (
                        <span className="text-[#F96161] flex items-center gap-1">
                          <Ban className="w-4 h-4" />
                          ثبت نشده
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{order.RQTITLE.Phone || '-'}</TableCell>
                    <TableCell>
                      <button
                        type="button"
                        onClick={() => toggleRow(index)}
                        className="flex items-center gap-1 text-primary hover:underline"
                      >
                        {expandedRows.includes(index) ? (
                          <>
                            بستن
                            <ChevronUp className="w-4 h-4" />
                          </>
                        ) : (
                          <>
                            نمایش
                            <ChevronDown className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </TableCell>
                  </TableRow>

                  {expandedRows.includes(index) && (
                    <TableRow className="bg-muted/10">
                      <TableCell colSpan={8}>
                        {order.RQDETAIL.map((item, i) => (
                          <div
                            key={`item-${i}`}
                            className="grid  font-DanaNum grid-cols-4 gap-2 p-4 shadow  mb-2 border-b-2 rounded bg-background"
                          >
                            <div>کد کالا: {item.R_ArCode}</div>
                            <div>نام کالا: {item.R_ArName}</div>
                            <div>تعداد: {item.R_Few}</div>
                            <div>قیمت: {item?.R_Cost?.toLocaleString('fa-IR')} ریال</div>
                          </div>
                        ))}
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
        {!loading && products.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-4">
            سفارشی برای شما یافت نشد!
          </div>
        )}
      </Card>

      {/* --- Mobile cards as before --- */}
      {/* 👇 موبایل بدون تغییر می‌مونه چون ساده‌تره */}
      {/* --- Card for mobile --- */}
      <div className="space-y-4 md:hidden">
        {products?.map((order, index) => (
          <Card key={`mobile-${index}`} className="p-4 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="font-bold">مشتری:</span>
              <span>{order.RQTITLE.R_CusName || 'ناموجود'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">کد مشتری:</span>
              <span>{order.RQTITLE.R_CusCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">تاریخ:</span>
              <span>{new Date(order.RQTITLE.R_Date).toLocaleDateString('fa-IR')}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">جمع کل:</span>
              <span>{order.RQTITLE.SumPrice.toLocaleString('fa-IR')} ریال</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold">وضعیت:</span>
              <span
                className={cn(
                  'flex items-center gap-1 font-medium',
                  order.RQTITLE.SumPrice > 0 ? 'text-[#53D060]' : 'text-[#F96161]'
                )}
              >
                {order.RQTITLE.SumPrice > 0 ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Ban className="w-4 h-4" />
                )}
                {order.RQTITLE.SumPrice > 0 ? 'ثبت شده' : 'ثبت نشده'}
              </span>
            </div>

            {/* Items */}
            {order.RQDETAIL.map((item, i) => (
              <Card key={`item-card-${i}`} className="p-2 bg-muted/50 mt-2 space-y-1">
                <div>کد کالا: {item.R_ArCode}</div>
                <div>نام کالا: {item.R_ArName}</div>
                <div>تعداد: {item.R_Few}</div>
                <div>قیمت: {item?.R_Cost?.toLocaleString('fa-IR')} ریال</div>
              </Card>
            ))}
          </Card>
        ))}
        {!loading && products.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-4">
            سفارشی برای شما یافت نشد!
          </div>
        )}
      </div>
    </div>
  );
}
