'use client';

import PageTitles from '@/components/modules/PageTitles';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableHeader } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import createShopHttpService from '@/hooks/useShopHttps';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type Props = {};

const checkboxFields = [
  { key: 'mandeh', label: 'نمایش مانده مشتری' },
  { key: 'forooshbishazhad', label: 'فروش بیشتر از حد' },
  { key: 'marjooii', label: 'مرجوعی' },
  { key: 'taiid', label: ' تأیید دو مرحله ای ' },
  { key: 'gift', label: 'اشانتیون' },
  // { key: 'hide_exist', label: 'عدم نمایش کالاهای ناموجود' },
  { key: 'expire_login', label: 'انقضای ورود' },
  { key: 'hidemojoodi', label: ' عدم نمایش موجودی' },
  { key: 'hidenamojood', label: 'عدم نمایش کالاهای ناموجود' },
];

const inputFields = [
  { key: 'nameforooshgah', label: 'نام فروشگاه' },
  { key: 'tellforooshgah', label: 'تلفن فروشگاه' },
  { key: 'addressforooshgah', label: 'آدرس فروشگاه' },
  { key: 'vahedpool', label: 'واحد پول' },
  { key: 'shomare_card', label: 'شماره کارت' },
];

export default function ShopSettings({}: Props) {
  const [isSelectRouteModalOpen, setIsSelectRouteModalOpen] = useState(false);
  const [isSelectAllRouteModalOpen, setIsSelectAllRouteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { httpService } = createShopHttpService();
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
    const fetchVisitorsSettings = async () => {
      try {
        setIsChanged(false);
        setLoading(true);
        const res = await httpService.get('/update_setting');

        const visitorData = res.data;
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
      // setIsDirty(false);
    }
  }, [isDirty, toast]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const cleanedFormData = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => value !== null && value !== undefined)
      );

      const body = {
        // FldC_Visitor: searchParams.get('VisitorCode'),
        ...cleanedFormData,
      };

      await httpService.post('/update_setting', body);
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
          title={'تنظیمات فروشگاه'}
          breadcrumbs={[
            { label: 'همگام', href: '/dashboard' },
            { label: 'فروشگاه', href: '/dashboard/shop' },
            { label: 'تنظیمات فروشگاه', href: '/dashboard/shop/settings' },
          ]}
          visitorCode={VISITORCODE || ''}
          visitorName={formData.FldN_Visitor || ''}
          showDateRange={false}
          showSearch={false}
          classNames=""
        />
        <div className="grid grid-cols-1  gap-4">
          <div>
            <Card className=" md:h-[78vh]">
              <ScrollArea>
                <Table className="" dir="rtl">
                  <TableHeader className="bg-primary flex items-center justify-center h-12 text-xs md:text-sm">
                    <p>تنظیمات</p>
                  </TableHeader>
                  <TableBody className="text-xs md:text-sm">
                    <div className="md:p-8 p-10 w-full h-full space-y-4 flex flex-col items-center justify-between">
                      <div className="space-y-2 w-full  grid grid-cols-3 md:gap-4">
                        {[...checkboxFields, ...inputFields].map(({ key, label }, index) => (
                          <div
                            key={key}
                            className={
                              checkboxFields.find(f => f.key === key)
                                ? 'flex items-center gap-2'
                                : 'flex flex-col items-start justify-start gap-2 mb-4 '
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
                            <Input
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
                                  ? 'border font-DanaNum rounded-md px-2 py-1 text-sm w-fit'
                                  : 'w-fit'
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>{' '}
                    <div
                      className={`w-full flex items-center md:m-8  rounded-lg p-1  justify-center `}
                    >
                      <Button disabled={!isDirty} onClick={handleSubmit}>
                        ثبت تغییرات
                      </Button>
                    </div>
                  </TableBody>
                </Table>
              </ScrollArea>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
