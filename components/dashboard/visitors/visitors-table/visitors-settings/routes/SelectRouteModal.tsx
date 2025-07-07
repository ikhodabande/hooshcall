'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import createHttpService from '@/hooks/useHttps';
import { Eye } from 'lucide-react';
import { useEffect, useState } from 'react';

interface City {
  City_Code: number;
  Name: string;
}

interface Customer {
  C_Code: number;
  C_Name: string;
  C_Mobile: string;
}

interface SelectRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  visitorCode: number;
}

export default function SelectRouteModal({ isOpen, onClose, visitorCode }: SelectRouteModalProps) {
  const [cities, setCities] = useState<City[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCity, setSelectedCity] = useState<number | null>(null);
  const [selectedCustomers, setSelectedCustomers] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const { httpService } = createHttpService();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [visitors, setVisitors] = useState<any[]>([]);
  const [loadingVisitors, setLoadingVisitors] = useState(false);
  const [searchVisitors, setSearchVisitors] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchCities();
    }
  }, [isOpen]);

  const fetchCities = async () => {
    try {
      setLoadingCities(true);
      const res = await httpService.get('/get_customer_cities');
      setCities(res.data.cities);
    } catch (err) {
      console.error('خطا در دریافت لیست شهرها:', err);
    } finally {
      setLoadingCities(false);
    }
  };

  const fetchCustomersByCity = async (cityId: number) => {
    try {
      setLoadingCustomers(true);
      setSelectedCity(cityId);
      const res = await httpService.post(`/get_customers_by_city`, {
        City_Code: cityId,
        page: 2,
        per_page: 5,
      });
      setCustomers(res.data.customers);
      setSelectedCustomers([]);
    } catch (err) {
      console.error('خطا در دریافت مشتری‌ها:', err);
    } finally {
      setLoadingCustomers(false);
    }
  };

  const handleCustomerSelect = async (customer: Customer) => {
    setSelectedCustomer(customer);
      setLoadingVisitors(true);
      try {
        const res = await httpService.post('/get_visitors_by_customer', {
          C_Code: customer.C_Code,
        });
        setVisitors(res.data.visitors);
      } catch (error) {
        console.error('خطا در دریافت ویزیتورها', error);
      } finally {
        setLoadingVisitors(false);
      }
    
  };

  useEffect(() => {
    const getCustomersOfVisitor = async () => {
      try {
        const res = await httpService.post('/get_customers_by_visitor', {
          V_Code: visitorCode,
        });

        setCustomers(res.data.customers);
      } catch (error) {}
    };

    getCustomersOfVisitor();
  }, []);

  // useEffect(() => {
  //   const addCustomerVisitorTable = async () => {
  //     try {
  //       await httpService.post('/create_customer_visitor_table');
  //     } catch (error) {
  //       console.log('خطا در ثبت جدول مشتریان ویزیتور', error);
  //     }
  //   };

  //   addCustomerVisitorTable();
  // }, []);

  const assignVisitor = async (V_Code: string) => {
    if (!selectedCustomer) return;
    try {
      await httpService.post('/assign_customer_to_visitor', {
        C_Code: selectedCustomer.C_Code,
        V_Code,
      });
      await handleCustomerSelect(selectedCustomer);
    } catch (error) {
      console.error('خطا در اختصاص ویزیتور', error);
    }
  };

  const unassignVisitor = async (V_Code: string) => {
    if (!selectedCustomer) return;
    try {
      await httpService.post('/unassign_customer_from_visitor', {
        C_Code: selectedCustomer.C_Code,
        V_Code,
      });
      await handleCustomerSelect(selectedCustomer);
    } catch (error) {
      console.error('خطا در لغو اختصاص ویزیتور', error);
    }
  };

  const assignSelectedCustomersToVisitor = async () => {
    if (!selectedCustomers.length || !visitorCode) return;

    try {
      await Promise.all(
        selectedCustomers.map(C_Code =>
          httpService.post('/assign_customer_to_visitor', {
            C_Code,
            V_Code: visitorCode,
          })
        )
      );
      onClose(); // مودال را ببند
    } catch (error) {
      console.error('خطا در اختصاص مشتریان به ویزیتور', error);
    }
  };

  const toggleCustomer = (id: number) => {
    setSelectedCustomers(prev => (prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]));
  };

  const selectAll = () => {
    setSelectedCustomers(filteredCustomers.map(c => c.C_Code));
  };

  const deselectAll = () => {
    setSelectedCustomers([]);
  };

  const filteredCustomers = customers.filter(
    customer =>
      customer.C_Name?.includes(searchQuery) ||
      customer.C_Code?.toString()?.includes(searchQuery) ||
      customer.C_Mobile?.includes(searchQuery)
  );

  const filteredVisitors = visitors.filter(
    visitor => visitor?.Visitor_Name?.includes(searchVisitors) || visitor?.V_Code?.includes(searchVisitors)
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent dir="rtl" className="sm:max-w-[900px] w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader className="w-full flex items-start px-4">
          <DialogTitle>انتخاب مسیر</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-1/3 w-full border md:border-r pr-0 md:pr-4">
            <h3 className="font-semibold mb-2">شهرها</h3>
            {loadingCities ? (
              <p>در حال بارگذاری...</p>
            ) : (
              <ul className="space-y-2">
                {cities?.map(city => (
                  <li key={city.City_Code}>
                    <Button
                      variant={selectedCity === city.City_Code ? 'default' : 'outline'}
                      onClick={() => fetchCustomersByCity(city.City_Code)}
                      className="w-full"
                    >
                      {city.Name}
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="md:w-2/3 w-full overflow-x-auto">
            <Input
              placeholder="جستجوی مشتری..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="mb-4 w-full"
            />

            <div className="flex flex-wrap justify-between gap-2 mb-2">
              <Button variant="ghost" onClick={selectAll} className="text-sm">
                انتخاب همه
              </Button>
              <Button variant="ghost" onClick={deselectAll} className="text-sm">
                لغو انتخاب همه
              </Button>
            </div>

            {loadingCustomers ? (
              <p>در حال بارگذاری مشتری‌ها...</p>
            ) : (
              <ScrollArea className="max-h-[60vh] md:max-h-[400px] overflow-auto">
                <div className="overflow-x-auto">
                  <table dir="rtl" className="min-w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-right p-2">انتخاب</th>
                        <th className="text-right p-2">نام</th>
                        <th className="text-right p-2">شماره موبایل</th>
                        <th className="text-right p-2">کد مشتری</th>
                        <th className="text-right p-2">عملیات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCustomers?.map(customer => (
                        <tr
                          key={customer.C_Code}
                          className={`border-b cursor-pointer ${
                            selectedCustomer?.C_Code === customer.C_Code ? 'bg-gray-100' : ''
                          }`}
                          onClick={() => handleCustomerSelect(customer)}
                        >
                          <td className="p-2">
                            <Checkbox
                              checked={selectedCustomers.includes(customer.C_Code)}
                              onCheckedChange={() => toggleCustomer(customer.C_Code)}
                            />
                          </td>
                          <td className="p-2">{customer.C_Name}</td>
                          <td className="p-2">{customer.C_Mobile}</td>
                          <td className="p-2">{customer.C_Code}</td>
                          <td className="p-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {!filteredCustomers.length && <p className="p-2">مشتری‌ای یافت نشد.</p>}

                  { selectedCustomer && (
                    <div className="mt-4 text-right overflow-hidden">
                      <h4 className="text-base font-semibold border-b pb-1 mb-2">
                        ویزیتورهای مربوط به {selectedCustomer.C_Name}
                      </h4>

                      <Input
                        placeholder="... جستجوی ویزیتور"
                        value={searchVisitors}
                        onChange={e => setSearchVisitors(e.target.value)}
                        className="mb-4 w-full text-right"
                      />

                      {loadingVisitors ? (
                        <p>در حال بارگذاری ویزیتورها...</p>
                      ) : filteredVisitors.length ? (
                        <ul className="space-y-2">
                          {filteredVisitors.map(visitor => (
                            <li
                              key={visitor.V_Code}
                              className="flex flex-wrap justify-between items-center border p-2 rounded gap-2"
                            >
                              <span>{visitor.Visitor_Name}</span>
                              {true ? (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => unassignVisitor(visitor.V_Code)}
                                >
                                  لغو اختصاص
                                </Button>
                              ) : (
                                <Button size="sm" onClick={() => assignVisitor(visitor.V_Code)}>
                                  اختصاص
                                </Button>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>ویزیتوری برای این مشتری وجود ندارد.</p>
                      )}
                    </div>
                  )}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            انصراف
          </Button>
          <Button onClick={assignSelectedCustomersToVisitor} className="w-full sm:w-auto">
            تایید
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
