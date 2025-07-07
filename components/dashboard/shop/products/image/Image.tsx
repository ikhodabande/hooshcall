'use client';

import PageTitles from '@/components/modules/PageTitles';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import Loading from '@/components/ui/loading';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { showToast } from '@/utils/toastService';
import { AnimatePresence, motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

const Get_Holoo_Articles = '/Get_Holoo_Articles';
const ArticleByGroups = '/ArticleByGroups';
const Search_Holoo_Articles = '/Search_Holoo_Articles';
const GetImagesByCodes = '/get_images_by_codes';

type Props = {};

export default function Image({}: Props) {
  const { httpService } = createHttpService();
  const [groups, setGroups] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [mainGroupCode, setMainGroupCode] = useState('');
  const [subGroupCode, setSubGroupCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState(searchValue);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [itemNames, setItemNames] = useState<Record<string, string>>({});
  const [saveCodes, setSaveCodes] = useState<string[]>([]);
  const [forceRefresh, setForceRefresh] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const searchPlaceholder = 'جستجو کالاها';

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(searchValue);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchValue]);

  useEffect(() => {
    const getGroups = async () => {
      try {
        const res = await httpService.get('GroupsKala');
        setGroups(Object.values(res.data));
      } catch (error) {
        console.error(error);
      }
    };
    getGroups();
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        let res;
        if (mainGroupCode || subGroupCode) {
          res = await httpService.post(ArticleByGroups, {
            M_groupcode: mainGroupCode,
            S_groupcode: subGroupCode,
          });
          setArticles(Object.values(res.data.Articles));
        } else {
          res = await httpService.post(Get_Holoo_Articles, { page, per_page: perPage });
          setArticles(Object.values(res.data.data));
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching articles:', error);
        setLoading(false);
      }
    };
    fetchArticles();
  }, [mainGroupCode, subGroupCode, reloadKey]); // اضافه کردن reloadKey

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!debouncedValue.trim()) {
          const result = await httpService.post(Get_Holoo_Articles, { page, per_page: perPage });
          setArticles(result.data.data);
        } else {
          const result = await httpService.get(
            `${Search_Holoo_Articles}?search=${debouncedValue}&page=1&per_page=10`
          );
          setArticles(result.data.Articles);
        }
      } catch (err) {
        console.error('Search error:', err);
        setArticles([]);
      }
    };
    fetchData();
  }, [debouncedValue]);

  const handleSelect = (code: string, name: string) => {
    if (selectedProducts.includes(code)) {
      setSelectedProducts(prev => prev.filter(c => c !== code));
    } else {
      setSelectedProducts(prev => [...prev, code]);
      setItemNames(prev => ({ ...prev, [code]: name || 'نامشخص' }));
    }
  };

  const handleChangeAllSelected = async () => {
    try {
      await httpService.post(GetImagesByCodes, {
        item_codes: selectedProducts,
        item_names: itemNames,
        item_names_only: [],
        save_codes: [],
        force_refresh: false,
      });
    } catch (error) {
      console.error('Error changing all selected:', error);
    }
  };

  const handleSaveAllSelected = async () => {
    try {
      await httpService.post(GetImagesByCodes, {
        item_codes: selectedProducts,
        item_names: itemNames,
        item_names_only: [],
        save_codes: selectedProducts,
        force_refresh: false,
      });

      setSaveCodes([]);
      setSelectedProducts([]);
      setReloadKey(prev => prev + 1);

      showToast('موفق!', 'تصاویر با موفقیت ذخیره شدند.');
    } catch (error) {
      console.error('Error saving all selected:', error);
      showToast('خطا', 'مشکلی در ذخیره تصاویر پیش آمد.', 'destructive');
    }
  };

  const handleDeleteAllSelected = async () => {
    try {
      await httpService.post(GetImagesByCodes, {
        item_codes: selectedProducts,
        item_names: itemNames,
        item_names_only: [],
        save_codes: [],
        force_refresh: false,
        delete: true,
      });

      setSelectedProducts([]);
      setReloadKey(prev => prev + 1);

      showToast('حذف موفق!', 'تصاویر انتخاب‌شده حذف شدند.');
    } catch (error) {
      console.error('Error deleting images:', error);
      showToast('خطا', 'حذف تصاویر با خطا مواجه شد.', 'destructive');
    }
  };

  const selectedMainGroup = groups.find(group => group.M_groupcode === mainGroupCode);

  return (
    <div className="p-4 space-y-4">
      <PageTitles
        breadcrumbs={[
          { label: 'همگام', href: '/dashboard' },
          // { label: 'فروشگاه', href: '/dashboard/shop' },
          // { label: 'لیست کالاها', href: '/dashboard/shop/products' },
          { label: 'اضافه کردن تصویر', href: '/dashboard/shop/products/image' },
        ]}
        title={'انتخاب تصویر کالا با AI'}
        showSearch={false}
      />

      <div className="flex flex-row gap-4 items-start md:items-center">
        <div className="flex flex-col gap-1 w-full md:w-auto">
          <label className="text-sm">گروه اصلی</label>
          <Select
            dir="rtl"
            value={mainGroupCode}
            onValueChange={value => {
              setMainGroupCode(value);
              setSubGroupCode('');
            }}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="انتخاب کنید" />
            </SelectTrigger>
            <SelectContent>
              {groups.map((group, idx) => (
                <SelectItem key={idx} value={group.M_groupcode}>
                  {group.M_groupname}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1 w-full md:w-auto">
          <label className="text-sm">زیرگروه</label>
          <Select
            dir="rtl"
            value={subGroupCode}
            onValueChange={setSubGroupCode}
            disabled={!mainGroupCode}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="انتخاب کنید" />
            </SelectTrigger>
            <SelectContent>
              {selectedMainGroup?.sub_categories?.map((sub: any, idx: number) => (
                <SelectItem key={idx} value={sub.S_groupcode}>
                  {sub.S_groupname}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="hidden md:flex flex-col gap-6 items-start justify-end w-full">
          <div></div>
          <div className="relative w-full max-w-md">
            <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={searchPlaceholder}
              className="pr-8 text-xs md:text-sm"
              onChange={e => setSearchValue(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {/* <Button onClick={handleChangeAllSelected} variant="outline">
          تغییر تصاویرانتخاب‌شده‌
        </Button> */}
        <Button onClick={handleSaveAllSelected} variant="sepidar">
          ذخیره همه انتخاب‌شده‌ها
        </Button>
        <Button onClick={handleDeleteAllSelected} variant="holo">
          حذف تصاویر انتخاب‌شده‌
        </Button>
      </div>

      {loading ? (
        <Loading className="h-[60vh]" />
      ) : (
        <>
          <Card className="overflow-auto my-4">
            <ScrollArea>
              <Table className="font-DanaNum" dir="rtl">
                <TableHeader className="bg-muted text-xs md:text-sm">
                  <TableRow>
                    <TableHead className="text-center">انتخاب</TableHead>
                    <TableHead className="text-center">کد کالا</TableHead>
                    <TableHead className="text-center">نام کالا</TableHead>
                    <TableHead className="text-center">تصویر کالا</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-xs md:text-sm">
                  <AnimatePresence mode="wait">
                    {articles?.map((item, i) => {
                      const isChecked = selectedProducts.includes(item.FldC_Kala);
                      return (
                        <motion.tr
                          key={item.FldC_Kala}
                          initial={{ opacity: 0.2 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5 }}
                          className={cn(i % 2 === 0 ? 'bg-white' : 'bg-muted/50')}
                        >
                          <TableCell className="text-center">
                            <Checkbox
                              checked={isChecked}
                              onCheckedChange={() => handleSelect(item.FldC_Kala, item.FldN_Kala)}
                            />
                          </TableCell>
                          <TableCell className="text-center">{item.FldC_Kala}</TableCell>
                          <TableCell className="text-center">
                            {item.FldN_Kala || 'نامشخص'}
                          </TableCell>
                          <TableCell className="flex items-center justify-center">
                            <img alt="image" src={item.FldImage} height={150} width={150} />
                          </TableCell>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </ScrollArea>
            {!loading && articles?.length === 0 && (
              <div className="text-center text-sm w-full text-muted-foreground py-4">
                کالایی برای شما یافت نشد!
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
