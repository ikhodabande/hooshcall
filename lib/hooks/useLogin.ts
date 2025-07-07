'use client';

import { useToast } from '@/components/ui/use-toast';
import createHttpService from '@/hooks/useHttps';
import createShopHttpService from '@/hooks/useShopHttps';
import { showToast } from '@/utils/toastService';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface LoginCredentials {
  username: string;
  password: string;
  system: 'holo' | 'sepidar';
}

interface LoginResponse {
  token: string;
  user: any;
}

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { httpService } = createShopHttpService();


  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const response = await httpService.post('/get-user-conn', credentials);

      if (response.status === 200) {
        // Show success message
        showToast('', 'ورود موفق به همگام خوش آمدید');
        return response?.data;
      } else {
        throw new Error(response?.data?.message);
      }
    } catch (error: any) {
      showToast('خطا', 'مشکلی از سمت سرور پیش آمده لطفاً بعداً تلاش کنید', 'destructive');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    isLoading,
  };
};
