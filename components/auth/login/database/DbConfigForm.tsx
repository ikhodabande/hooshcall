'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface DbConfigFormProps {
  onFlip?: () => void;
  dbData?: any;
}

const DbConfigForm = ({ onFlip, dbData }: DbConfigFormProps) => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    server: '',
    database: '',
    username: '',
    password: '',
    driver: '',
  });

  const [loading, setLoading] = useState(false);

  // Load saved config on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('dbConfig');
    if (savedConfig) {
      setFormData(JSON.parse(savedConfig));
    } else if (dbData) {
      setFormData({
        server: dbData.server || '',
        database: dbData.database || '',
        username: dbData.username || '',
        password: dbData.password || '',
        driver: dbData.driver || '',
      });
    }
  }, [dbData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      localStorage.setItem('dbConfig', JSON.stringify(formData));
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
      router.push('/dashboard');
    } catch (error) {
      console.error('خطا در ذخیره تنظیمات:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full border-none shadow-none max-w-md mx-auto rtl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">تنظیمات پایگاه داده</CardTitle>
        <CardDescription className="text-center">
          اطلاعات اتصال به پایگاه داده را وارد کنید
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="server">سرور</Label>
            <Input
              id="server"
              name="server"
              type="text"
              required
              placeholder="آدرس سرور را وارد کنید"
              value={formData.server}
              onChange={handleChange}
              className="text-right"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="database">پایگاه داده</Label>
            <Input
              id="database"
              name="database"
              type="text"
              required
              placeholder="نام پایگاه داده را وارد کنید"
              value={formData.database}
              onChange={handleChange}
              className="text-right"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">نام کاربری</Label>
            <Input
              id="username"
              name="username"
              type="text"
              required
              placeholder="نام کاربری را وارد کنید"
              value={formData.username}
              onChange={handleChange}
              className="text-right"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">رمز عبور</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              placeholder="رمز عبور را وارد کنید"
              value={formData.password}
              onChange={handleChange}
              className="text-right"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="driver">درایور</Label>
            <Input
              id="driver"
              name="driver"
              type="text"
              required
              placeholder="نام درایور را وارد کنید"
              value={formData.driver}
              onChange={handleChange}
              className="text-right"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'در حال ذخیره…' : 'ذخیره تنظیمات'}
            </Button>
            <Button type="button" variant="outline" className="w-full" onClick={onFlip}>
              بازگشت به صفحه ورود
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DbConfigForm;
