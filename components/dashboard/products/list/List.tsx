'use client';

import PageTitles from '@/components/modules/PageTitles';
import { Card } from '@/components/ui/card';
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
import { AnimatePresence, motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

const Get_Holoo_Articles = '/Get_Holoo_Articles';
const ArticleByGroups = '/ArticleByGroups';

export default function List() {
  const { httpService } = createHttpService();
  const [groups, setGroups] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [mainGroupCode, setMainGroupCode] = useState('');
  const [subGroupCode, setSubGroupCode] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState(searchValue);
  const searchPlaceholder = 'جستجو کالاها';

  // Debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(searchValue);
    }, 500); // نصف ثانیه تاخیر برای تایپ

    return () => {
      clearTimeout(handler);
    };
  }, [searchValue]);

  // Fetch groups on mount
  useEffect(() => {
    const getGroups = async () => {
      try {
        const res = await httpService.get('GroupsKala');
        const data = res.data;
        setGroups(Object.values(data));
      } catch (error) {
        // console.error('❌ خطا در دریافت گروه‌ها:', error);f
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
          // Fetch filtered articles
          res = await httpService.post(ArticleByGroups, {
            M_groupcode: mainGroupCode,
            S_groupcode: subGroupCode,
          });
          const data = res.data;
          setArticles(Object.values(data.Articles));
          setTotalPages(0);
        } else {
          // Fetch all articles initially
          res = await httpService.post(Get_Holoo_Articles, {
            page,
            per_page: perPage,
          });
          const data = res.data;
          setArticles(Object.values(data.data));
          setTotalPages(Math.ceil(data.total / perPage));
        }

        // setTotalPages(Math.ceil(data.total_items / perPage));
        setLoading(false);
      } catch (error) {
        console.error('❌ خطا در دریافت کالاها:', error);
        setLoading(false);
      }
    };

    fetchArticles();
  }, [mainGroupCode, subGroupCode, page, perPage]);

  const handleMainGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMainGroupCode(e.target.value);
    setSubGroupCode('');
  };

  const handleSubGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSubGroupCode(e.target.value);
  };
  const selectedMainGroup = groups.find(group => group.M_groupcode === mainGroupCode);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!debouncedValue.trim()) {
          // اگر مقدار خالی است، همه مقالات را بگیر
          const result = await httpService.post('/Get_Holoo_Articles', {
            page,
            per_page: perPage,
          });
          setArticles(result.data.data);
          setTotalPages(Math.ceil(result?.data?.total / perPage));
        } else {
          // در غیر این صورت جستجو کن
          const result = await httpService.get(`Search_Holoo_Articles?search=${debouncedValue}`);
          setArticles(result.data.Articles);
          setTotalPages(0);
        }
      } catch (err) {
        console.error('خطا در جستجو:', err);
        setTotalPages(0);
        setArticles([]);
      }
    };

    fetchData();
  }, [debouncedValue]);

  return (
    <div className="p-4 space-y-4">
      {/* Selection Filters */}
      <PageTitles
        breadcrumbs={[
          { label: 'همگام', href: '/dashboard' },
          { label: 'کالا', href: '/dashboard/shop' },
          { label: 'لیست کالاها ', href: '/dashboard/shop/customers' },
        ]}
        title={'لیست کالاها'}
        showSearch={false}
      />

      <div className="flex flex-row gap-4 items-start md:items-center">
        {/* گروه اصلی */}
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

        {/* زیرگروه */}
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
      <div className="relative md:hidden w-full max-w-md">
        <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={searchPlaceholder}
          className="pr-8 text-xs md:text-sm"
          onChange={e => setSearchValue(e.target.value)}
        />
      </div>

      {loading ? (
        <Loading className="h-[60vh]" />
      ) : (
        <>
          <Card className="overflow-auto my-4">
            <ScrollArea>
              <Table dir="rtl">
                <TableHeader className="bg-muted text-xs md:text-sm">
                  <TableRow>
                    <TableHead className="text-right hidden md:table-cell">شماره</TableHead>
                    <TableHead className="text-right">نام کالا</TableHead>
                    <TableHead className="text-right hidden md:table-cell">کد کالا</TableHead>
                    <TableHead className="text-right hidden md:table-cell">قیمت</TableHead>
                    <TableHead className="text-right hidden md:table-cell">کارتن</TableHead>
                    <TableHead className="text-right">وضعیت</TableHead>
                    <TableHead className="text-right hidden md:table-cell">تصویر کالا</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-xs md:text-sm">
                  <AnimatePresence mode="wait">
                    {articles?.map((item, i) => (
                      <motion.tr
                        key={item.FldC_Kala}
                        initial={{ opacity: 0.2 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className={cn(i % 2 === 0 ? 'bg-white' : 'bg-muted/50')}
                      >
                        <TableCell className="hidden md:table-cell font-DanaNum">
                          {(page - 1) * perPage + i + 1}
                        </TableCell>
                        <TableCell>{item.FldN_Kala || 'نامشخص'}</TableCell>
                        <TableCell className="hidden md:table-cell">{item.FldC_Kala}</TableCell>
                        <TableCell className="hidden md:table-cell font-DanaNum">
                          {item.FldFee?.toLocaleString()}
                        </TableCell>
                        <TableCell className="hidden md:table-cell font-DanaNum">
                          {item.FldTedadKarton || 'نامشخص'}
                        </TableCell>
                        <TableCell>{item.FldMande === 0 ? 'موجود نیست' : 'موجود'}</TableCell>
                        <TableCell>
                          <img alt="image" src={item.FldImage} height={150} width={150} />
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
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
  );
}
