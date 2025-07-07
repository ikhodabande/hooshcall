'use client';

import SelectAllRouteModal from '@/components/dashboard/visitors/visitors-table/visitors-settings/routes/SelectAllRoutesModal';
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
import { useToast } from '@/hooks/use-toast';
import createHttpService from '@/hooks/useHttps';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import SelectRouteModal from './routes/SelectRouteModal';

type Props = {};

const checkboxFields = [
  { key: 'WIsModir', label: 'ثبت سفارش در تمام مسیرها(مدیر فروش)' },
  { key: 'FldShowBedehkaran', label: 'امکان مشاهده بدهکاران' },
  { key: 'ShowReport', label: 'نمایش گزارش' },
  { key: 'WShowMoiens', label: 'مشاهده معین مشتریان' },
  { key: 'FldNewMoshtari', label: 'اجازه تعریف مشتری جدید' },
  { key: 'FldP_ForooshBishAzMojoodi', label: 'فروش بیشتر از موجودی' },
  { key: 'FldDoVahedi', label: 'فعال بودن دو واحدی' },
  { key: 'FldEtelaResani', label: 'امکان مشاهده موجودی کالا' },
  // { key: 'FldMarjooii', label: 'امکان ثبت مرجوعی' },
  { key: 'WSetEshan', label: 'امکان ثبت اشانتیون' },
  { key: 'WSetTip', label: 'امکان تغییر تیپ قیمت' },
  { key: 'WEnterFee', label: 'امکان وارد کردن قیمت بصورت دستی' },
  { key: 'FldSabtGpsShakhs', label: 'فعال کردن ثبت موقعیت مشتری' },
  { key: 'FldGps', label: 'ثبت موقعیت فاکتور' },
  { key: 'FldShowGpsShakhs', label: 'مشاهده مکان مشتریان' },
  { key: 'AddFactorComment', label: 'اجباری بودن توضیحات سفارش' },
  // { key: 'FldVoroodTozihKala', label: 'اجباری بودن ثبت توضیحات کل فاکتور' },
  { key: 'ShowEndBuyPrice', label: 'امکان مشاهده آخرین قیمت خرید' },
  { key: 'WUseAnbarak', label: 'فروش فقط از طریق انبارک' },
  // { key: 'IsPos', label: 'دستگاه کارتخوان می باشد؟' },
  { key: 'WHideBMande', label: 'عدم نمایش کالاهای ناموجود' },
];

const inputFields = [
  // { key: 'FldS_Foroosh', label: 'تعیین سقف فروش:' },
  { key: 'FldZamanTahvil', label: 'درج زمان تحویل:' },
];

export default function VisitorsSetting({}: Props) {
  const [isSelectRouteModalOpen, setIsSelectRouteModalOpen] = useState(false);
  const [isSelectAllRouteModalOpen, setIsSelectAllRouteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { httpService } = createHttpService();
  const [visitorSettings, setVisitorSettings] = useState();
  const [formData, setFormData] = useState<any>({});
  const searchParams = useSearchParams();
  const [isDirty, setIsDirty] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const { toast } = useToast();
  const VISITORCODE = searchParams.get('VisitorCode');
  type Customer = {
    C_Name: string;
    C_Address: string;
  };

  const [customers, setCustomers] = useState<Customer[] | null>(null);

  const handleCheckboxChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: any) => ({ ...prev, [key]: e.target.checked }));
    setIsDirty(true);
  };

  const handleInputChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: any) => ({ ...prev, [key]: e.target.value }));
    setIsDirty(true);
  };

  useEffect(() => {
    const getCustomersOfVisitor = async () => {
      try {
        const res = await httpService.post('/get_customers_by_visitor', {
          V_Code: VISITORCODE,
        });

        setCustomers(res.data.customers);
      } catch (error) {}
    };

    getCustomersOfVisitor();
  }, []);

  useEffect(() => {
    const fetchVisitorsSettings = async () => {
      try {
        setIsChanged(false);
        setLoading(true);
        const res = await httpService.post('/update_visitor', {
          FldC_Visitor: VISITORCODE,
          FldShowMande: true,
          list: true,
        });

        const visitorData = res.data.visitors?.[0];
        if (visitorData) {
          setVisitorSettings(visitorData);
          setFormData(visitorData);
        } else {
          toast({
            title: 'خطا',
            description: 'اطلاعات بازاریاب پیدا نشد.',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('❌ خطا در دریافت اطلاعات بازاریاب‌ها:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVisitorsSettings();
  }, [isChanged]);

  // نمایش توست وقتی isDirty = true و کاربر تغییرات داشته ولی هنوز ذخیره نکرده
  useEffect(() => {
    if (isDirty) {
      toast({
        // title: 'توجه',
        description: 'تغییرات ذخیره نشده است!',
        // variant: 'destructive',
        duration: 2000,
      });
      setIsDirty(false);
    }
  }, [isDirty, toast]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const cleanedFormData = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => value !== null && value !== undefined)
      );

      const body = {
        FldC_Visitor: searchParams.get('VisitorCode'),
        ...cleanedFormData,
      };

      await httpService.post('/update_visitor', body);
      setIsChanged(true);
      setIsDirty(false);
      toast({
        title: 'موفقیت',
        description: 'تغییرات با موفقیت ذخیره شد.',
      });
    } catch (error) {
      toast({
        title: 'خطا',
        description: 'خطا در ذخیره‌سازی تنظیمات.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="p-4 space-y-4">
        <PageTitles
          title={'تنظیمات بازاریاب'}
          breadcrumbs={[
            { label: 'همگام', href: '/dashboard' },
            // { label: 'بازاریاب', href: '/dashboard/visitors' },
            { label: 'مشاهده بازاریاب‌ها', href: '/dashboard/visitors' },
            {
              label: 'تنظیمات بازاریاب',
              href: `/dashboard/visitors/table/visitors-setting?VisitorCode=${VISITORCODE}`,
            },
          ]}
          visitorCode={VISITORCODE || ''}
          visitorName={formData.FldN_Visitor || ''}
          showDateRange={false}
          showSearch={false}
          classNames=""
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Card className="overflow-auto h-[78vh]">
              <ScrollArea>
                <Table dir="rtl">
                  <TableHeader className="bg-primary flex items-center justify-center h-12 text-xs md:text-sm">
                    <p>تنظیمات</p>
                  </TableHeader>
                  <TableBody className="text-xs md:text-sm">
                    <div className="md:p-8 p-10 w-full h-full space-y-4 flex flex-col items-center justify-between">
                      <div className="space-y-2 w-full grid grid-cols-2 gap-4">
                        {[...checkboxFields, ...inputFields].map(({ key, label }, index) => (
                          <div
                            key={key}
                            className={
                              checkboxFields.find(f => f.key === key)
                                ? 'flex items-center gap-2'
                                : 'flex flex-col items-start justify-start gap-2 mb-4 col-span-2'
                            }
                          >
                            <label
                              htmlFor={`field-${index}`}
                              className={
                                checkboxFields.find(f => f.key === key)
                                  ? ''
                                  : 'text-muted-foreground'
                              }
                            >
                              {label}
                            </label>
                            <input
                              type={checkboxFields.find(f => f.key === key) ? 'checkbox' : 'text'}
                              id={`field-${index}`}
                              onChange={
                                checkboxFields.find(f => f.key === key)
                                  ? handleCheckboxChange(key)
                                  : handleInputChange(key)
                              }
                              checked={
                                checkboxFields.find(f => f.key === key)
                                  ? formData?.[key] || false
                                  : undefined
                              }
                              value={
                                !checkboxFields.find(f => f.key === key)
                                  ? formData?.[key] || ''
                                  : undefined
                              }
                              className={
                                !checkboxFields.find(f => f.key === key)
                                  ? 'border rounded-md px-2 py-1 text-sm w-full'
                                  : ''
                              }
                            />
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-center pt-10 gap-2 mt-4">
                        <Button
                          variant="outline"
                          className="text-xs md:text-sm"
                          size="sm"
                          onClick={() => setIsSelectAllRouteModalOpen(true)}
                        >
                          اختصاص تمام مسیر
                        </Button>
                        <Button
                          variant="outline"
                          className="text-xs md:text-sm"
                          size="sm"
                          onClick={() => setIsSelectRouteModalOpen(true)}
                        >
                          اختصاص بخشی از مسیر
                        </Button>
                      </div>
                      <div className="w-full flex items-center m-4  rounded-lg p-1  justify-center">
                        <Button onClick={handleSubmit}>ثبت تغییرات</Button>
                      </div>
                    </div>
                  </TableBody>
                </Table>
              </ScrollArea>
            </Card>
          </div>

          <div>
            <Card className="overflow-auto h-[78vh]">
              <ScrollArea>
                <Table dir="rtl">
                  <TableHeader className="bg-primary text-xs md:text-sm">
                    <TableRow className="text-black">
                      <TableHead className="text-right text-black">نام مشتری</TableHead>
                      <TableHead className="text-right text-black">نام منطقه</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="text-xs md:text-sm">
                    {customers?.map((customer, i) => (
                      <TableRow key={i} className={cn(i % 2 === 0 ? 'bg-white' : 'bg-muted/50')}>
                        <TableCell>{customer.C_Name}</TableCell>
                        <TableCell>{customer.C_Address}</TableCell>
                      </TableRow>
                    ))}
                    {customers?.length === 0 && (
                      <div className="text-center text-sm text-muted-foreground py-4">
                        هیچ منطقه ای برای این ویزیتور ثبت نشده است
                      </div>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </Card>
          </div>
        </div>
      </div>

      <SelectRouteModal
        visitorCode={VISITORCODE as any}
        isOpen={isSelectRouteModalOpen}
        onClose={() => setIsSelectRouteModalOpen(false)}
      />

      <SelectAllRouteModal
        isOpen={isSelectAllRouteModalOpen}
        onClose={() => setIsSelectAllRouteModalOpen(false)}
      />
    </>
  );
}
