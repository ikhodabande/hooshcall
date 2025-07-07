import cookieUtils from '@/utils/cookieutils';
import { showToast } from '@/utils/toastService';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

const debug = true;

const getHeaders = (): Record<string, string> => {
  const token = cookieUtils.getDecryptedCookie('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const createShopHttpService = (): { httpService: AxiosInstance } => {
  const httpService = axios.create({
    headers: getHeaders(),
  });

  httpService.interceptors.request.use(
    (config: AxiosRequestConfig):any => {
      // 🟢 هر بار کوکی رو تازه بخون
      const dynamicBaseURL = 'http://192.168.10.136:5000' || 'http://localhost:3000';
      config.baseURL = dynamicBaseURL;
      return config;
    },
    (error) => Promise.reject(error)
  );

  httpService.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => response,
    async (error: AxiosError<any>) => {
      const { response } = error;
      if (!response) {
        showToast('خطا', 'اتصال به سرور برقرار نشد', 'destructive');
        return Promise.reject(error);
      }

      const { status, data } = response;

      switch (status) {
        case 401:
          Cookies.remove('token');
          Cookies.remove('cache_key');
          showToast('هشدار', 'شما از حساب کاربری خود خارج شده‌اید', 'destructive');
          break;
        case 400:
          showToast('خطا', debug ? data.message ?? 'درخواست نامعتبر' : 'مشکلی در اطلاعات ارسالی وجود دارد', 'destructive');
          break;
        case 403:
          showToast('خطا', data?.error ?? 'دسترسی غیرمجاز', 'destructive');
          break;
        case 404:
          showToast('خطا', data?.message ?? 'درخواست مورد نظر شما پیدا نشد', 'destructive');
          break;
        case 422:
          showToast('خطا', data.message ?? 'خطای اعتبارسنجی', 'destructive');
          break;
        case 500:
          showToast('خطا', 'مشکلی از سمت سرور پیش آمده لطفاً بعداً تلاش کنید', 'destructive');
          break;
        default:
          if (data?.msg && debug) {
            showToast('خطا', data.msg, 'destructive');
          }
          break;
      }

      return Promise.reject(error);
    }
  );

  return { httpService };
};

export default createShopHttpService;
