'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import createHttpService from '@/hooks/useHttps';
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
  onConfirm?: (data: { city: City; customers: Customer[] }) => void;
}

export default function SelectAllRouteModal({ isOpen, onClose, onConfirm }: SelectRouteModalProps) {
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const { httpService } = createHttpService();

  useEffect(() => {
    if (isOpen) {
      fetchCities();
      setSelectedCity(null);
      setCustomers([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const addCustomerVisitorTable = async () => {
      try {
        const res = await httpService.post('/create_customer_visitor_table');
      } catch (error) {
        console.log('خطا در ثبت جدول مشتریان ویزیتور', error);
      }
    };
  }, []);

  const getVisitorsLists = async () =>{
    try {
      
    } catch (error) {
      
    }
  }

  const addCustomersToVisitor = async () => {
    try {
      const res = await httpService.post('/assign_customer_to_visitor', {
        C_Code: '00001',
        V_Code: '00012',
      });
    } catch (error) {}
  };

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

  const fetchCustomersByCity = async (city: City) => {
    try {
      setSelectedCity(city);
      setLoadingCustomers(true);
      const res = await httpService.post('/get_customers_by_city', {
        City_Code: city.City_Code,
        page: 1,
        per_page: 1000, // Or whatever number makes sense
      });
      setCustomers(res.data.customers);
    } catch (err) {
      console.error('خطا در دریافت مشتری‌ها:', err);
    } finally {
      setLoadingCustomers(false);
    }
  };

  const handleConfirm = () => {
    if (selectedCity && customers.length > 0 && onConfirm) {
      onConfirm({ city: selectedCity, customers });
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent dir="rtl" className="sm:max-w-[800px] w-full">
        <DialogHeader className="w-full flex items-start px-4">
          <DialogTitle>انتخاب شهر جهت اختصاص مشتریان</DialogTitle>
        </DialogHeader>

        <div className="flex gap-4">
          {/* Sidebar - Cities */}
          <div className="w-1/3 border-r pr-4">
            <h3 className="font-semibold mb-2">شهرها</h3>
            {loadingCities ? (
              <p>در حال بارگذاری...</p>
            ) : (
              <ul className="space-y-2">
                {cities?.map(city => (
                  <li key={city.City_Code}>
                    <Button
                      variant={selectedCity?.City_Code === city.City_Code ? 'default' : 'outline'}
                      onClick={() => fetchCustomersByCity(city)}
                      className="w-full"
                    >
                      {city.Name}
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Optional: Show customer list (read-only) */}
          <div className="w-2/3">
            {loadingCustomers ? (
              <p>در حال بارگذاری مشتری‌ها...</p>
            ) : selectedCity ? (
              <ScrollArea className="h-[400px] text-right border p-2 rounded-md">
                <h4 className="mb-2 font-medium">
                  مشتری‌های مربوط به {selectedCity.Name} ({customers.length})
                </h4>
                <ul className="space-y-1">
                  {customers.map(c => (
                    <li key={c.C_Code} className="border-b py-1">
                      {c.C_Name} - {c.C_Mobile}
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            ) : (
              <p>لطفاً یک شهر را انتخاب کنید.</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            انصراف
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedCity || customers.length === 0}>
            تایید و اختصاص مشتری‌ها
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
