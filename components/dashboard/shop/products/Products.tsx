'use client';

import PageTitles from '@/components/modules/PageTitles';
import { Button } from '@/components/ui/button';
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
import createShopHttpService from '@/hooks/useShopHttps';
import { cn } from '@/lib/utils';
import { showToast } from '@/utils/toastService';
import { AnimatePresence, motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

const Get_Holoo_Articles = '/Get_Holoo_Articles';
const ArticleByGroups = '/ArticleByGroups';
const HidePriceAPI = '/hide_price';
const DisableHidePriceAPI = '/dissable_hide_price';

export default function ShopProducts() {
  const { httpService } = createShopHttpService();
  const [groups, setGroups] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [mainGroupCode, setMainGroupCode] = useState('');
  const [subGroupCode, setSubGroupCode] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState(searchValue);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]); // <-- selected product codes
  const searchPlaceholder = 'جستجو کالاها';
  const [showHidden, setShowHidden] = useState(false);
  const [checkboxLoading, setCheckboxLoading] = useState<string | null>(null);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(searchValue);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchValue]);

  // Fetch groups on mount
  useEffect(() => {
    const getGroups = async () => {
      try {
        const res = await httpService.get('GroupsKala');
        const data = res.data;
        setGroups(Object.values(data));
      } catch (error) {
        // Handle error
      }
    };
    getGroups();
  }, []);

  // Fetch articles based on filters/search
  const fetchArticles = async () => {
    try {
      setLoading(true);
      const noCache = `&_=${Date.now()}`; // 👈 unique per call

      let res;

      if (mainGroupCode || subGroupCode) {
        res = await httpService.post(ArticleByGroups, {
          M_groupcode: mainGroupCode,
          S_groupcode: subGroupCode,
        });
        const data = res.data;
        setArticles(Object.values(data.Articles));
      } else {
        const result = await httpService.get(
          `/Get_Holoo_Articles?page=${page}&per_page=${perPage}&hidden_only=${showHidden}${noCache}`
        );
        setArticles(result?.data?.articles || []);
        setTotalPages(Math.ceil(result?.data?.total / perPage));
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [mainGroupCode, subGroupCode, page, perPage, showHidden]);

  // Search articles effect
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!debouncedValue.trim()) {
          const result = await httpService.get(
            `/Get_Holoo_Articles?page=${page}&per_page=${perPage}&hidden_only=${showHidden}`
          );
          setArticles(result?.data?.articles || []);
          setTotalPages(Math.ceil(result?.data?.total / perPage));
        } else {
          const result = await httpService.get(
            `Search_Holoo_Articles?search=${debouncedValue}&page=${page}&per_page=${perPage}`
          );
          setArticles(result.data.Articles || []);
          setTotalPages(Math.ceil(result.data?.total / perPage));
        }
      } catch (err) {
        console.error('Search error:', err);
        setArticles([]);
        setTotalPages(1);
      }
    };
    fetchData();
  }, [debouncedValue, page, perPage]);

  useEffect(() => {
    setPage(1); // Reset to page 1 when filters change
  }, [mainGroupCode, subGroupCode, debouncedValue]);

  const selectedMainGroup = groups.find(group => group.M_groupcode === mainGroupCode);

  // --- NEW HANDLERS FOR SELECTION ---

  // Call hide_price API to hide price for selected products
  const hidePriceForProducts = async (codes: string[]) => {
    try {
      const res = await httpService.post(HidePriceAPI, { a_codes: codes });
      if (res.status === 200) {
        showToast('', 'قیمت و موجودی کالا با موفقیت مخفی شد');
      }
    } catch (err) {
      console.error('Error hiding prices:', err);
    }
  };

  // Call dissable_hide_price API to unhide prices
  const disableHidePriceForProducts = async (codes: string[]) => {
    try {
      const res = await httpService.post(DisableHidePriceAPI, { a_codes: codes });
      if (res.status === 200) {
        showToast('', 'قیمت و موجودی کالا با موفقیت قابل نمایش شد');
        await fetchArticles();
      }
    } catch (err) {
      console.error('Error disabling hide prices:', err);
    }
  };

  // Handle single product selection toggle
  const toggleProductSelection = async (code: string) => {
    setCheckboxLoading(code); // شروع لودینگ

    const updatedArticles = [...articles];
    const index = updatedArticles.findIndex(item => item.FldC_Kala === code);
    const article = updatedArticles[index];

    let updatedSelection: string[] = [];

    try {
      if (selectedProducts.includes(code)) {
        // Unselect: disable hiding
        updatedSelection = selectedProducts.filter(c => c !== code);
        await disableHidePriceForProducts([code]);

        updatedArticles[index] = {
          ...article,
          FldFee: article.OriginalFee ?? article.FldFee,
          FldMande: article.OriginalMande ?? article.FldMande,
        };
      } else {
        // Select: hide price
        updatedSelection = [...selectedProducts, code];
        await hidePriceForProducts([code]);

        updatedArticles[index] = {
          ...article,
          OriginalFee: article.FldFee,
          FldFee: 'تماس بگیرید',
          OriginalMande: article.FldMande,
          FldMande: 'تماس بگیرید',
        };
      }

      setSelectedProducts(updatedSelection);
      setArticles(updatedArticles);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setCheckboxLoading(null); // پایان لودینگ
    }
  };

  // Handle select/unselect all toggle
  const toggleSelectAll = async () => {
    if (selectedProducts.length === articles.length) {
      // Unselect all
      setSelectedProducts([]);
      await disableHidePriceForProducts(['all']);
    } else {
      // Select all
      const allCodes = articles.map(item => item.FldC_Kala);
      setSelectedProducts(allCodes);
      await hidePriceForProducts(allCodes);
    }
  };

  // Check if all products are selected
  const allSelected = articles.length > 0 && selectedProducts.length === articles.length;

  return (
    <div className="p-4 space-y-4">
      <PageTitles
        breadcrumbs={[
          { label: 'همگام', href: '/dashboard' },
          { label: 'فروشگاه', href: '/dashboard/shop' },
          { label: 'لیست کالاها', href: '/dashboard/shop/products' },
        ]}
        title={'لیست کالاها'}
        showSearch={false}
      />

      <div className="flex flex-row gap-4 items-start md:items-center">
        {/* Main Group */}
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

        {/* Sub Group */}
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

        {/* Search */}
        <div className="hidden md:flex gap-6 pt-6 items-end w-full">
          <Button
            onClick={() => setShowHidden(prev => !prev)}
            className=" px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition"
          >
            {showHidden ? 'نمایش کالاهای عادی' : 'نمایش کالاهای مخفی'}
          </Button>
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

        {/* <div className="flex flex-col gap-1 w-full md:w-auto">
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
        </div> */}
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
      <Button
        onClick={() => setShowHidden(prev => !prev)}
        className="w-full px-4 py-2 bg-primary md:hidden text-white rounded hover:bg-primary/90 transition"
      >
        {showHidden ? 'نمایش کالاهای عادی' : 'نمایش کالاهای مخفی'}
      </Button>

      {loading ? (
        <Loading className="h-[60vh]" />
      ) : (
        <>
          <Card className="overflow-auto my-4">
            <ScrollArea>
              <Table dir="rtl">
                <TableHeader className="bg-muted text-xs md:text-sm">
                  <TableRow>
                    {/* Select All Checkbox */}
                    <TableHead className="text-center flex items-center gap-2 md:w-56">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={toggleSelectAll}
                        aria-label="Select all products"
                      />
                      <p className="hidden md:block">مخفی کردن قیمت و تعداد </p>
                    </TableHead>
                    <TableHead className="text-right hidden md:table-cell">شماره</TableHead>
                    <TableHead className="text-center">نام کالا</TableHead>
                    <TableHead className="text-right hidden md:table-cell">کد کالا</TableHead>
                    <TableHead className="text-right ">قیمت</TableHead>
                    <TableHead className="text-right hidden md:table-cell">کارتن</TableHead>
                    <TableHead className="text-right">موجودی کالا</TableHead>
                    <TableHead className="text-center hidden md:table-cell">تصویر کالا</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-xs md:text-sm  font-DanaNum">
                  <AnimatePresence mode="wait">
                    {articles?.map((item, i) => {
                      const isStringType =
                        typeof item.FldMande === 'string' || typeof item.FldFee === 'string';
                      const isSelected = isStringType || selectedProducts.includes(item.FldC_Kala);
                      return (
                        <motion.tr
                          key={item.FldC_Kala}
                          initial={{ opacity: 0.2 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5 }}
                          className={cn(i % 2 === 0 ? 'bg-white ' : 'bg-muted/50')}
                        >
                          <TableCell className="text-center w-12">
                            {checkboxLoading === item.FldC_Kala ? (
                              <div className="w-4 h-4 border-2 border-gray-300 border-t-primary rounded-full animate-spin mx-auto" />
                            ) : (
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleProductSelection(item.FldC_Kala)}
                                aria-label={`Select product ${item.FldN_Kala}`}
                              />
                            )}
                          </TableCell>

                          <TableCell className="hidden md:table-cell font-DanaNum">
                            {(page - 1) * perPage + i + 1}
                          </TableCell>
                          <TableCell className="text-center">
                            {item.FldN_Kala || 'نامشخص'}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{item.FldC_Kala}</TableCell>
                          <TableCell className=" font-DanaNum">
                            {item.FldFee?.toLocaleString()}
                          </TableCell>
                          <TableCell className="hidden md:table-cell font-DanaNum">
                            {item.FldTedadKarton || 'نامشخص'}
                          </TableCell>
                          <TableCell className="text-center">{item.FldMande}</TableCell>
                          <TableCell className="text-center hidden md:flex items-center justify-center">
                            <img
                              alt="image"
                              className=""
                              src={item.FldImage}
                              height={150}
                              width={150}
                            />
                          </TableCell>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </ScrollArea>
            {/* Pagination Controls */}
            {/* Desktop Pagination (Full) */}
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

            {!loading && articles.length === 0 && (
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
