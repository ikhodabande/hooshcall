'use client';

import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { iranSans } from '@/lib/fonts';
import { useLogin } from '@/lib/hooks/useLogin';
import { showToast } from '@/utils/toastService';
import { AnimatePresence, motion } from 'framer-motion';
import Cookies from 'js-cookie';
import { Eye, EyeOff } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import DbConfigForm from './database/DbConfigForm';
import axios from 'axios';

// Validation schema
const loginSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'نام کاربری باید حداقل ۳ کاراکتر باشد' })
    .max(50, { message: 'نام کاربری نمی‌تواند بیشتر از ۵۰ کاراکتر باشد' }),
  password: z
    .string()
    .min(8, { message: 'رمز عبور باید حداقل ۸ کاراکتر باشد' })
    .max(50, { message: 'رمز عبور نمی‌تواند بیشتر از ۵۰ کاراکتر باشد' }),
  system: z.enum(['holo', 'sepidar'], {
    required_error: 'لطفا نوع حسابداری را انتخاب کنید',
  }),
});

export default function LoginForm() {
  // Form state
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState<{
    username?: string[];
    password?: string[];
    system?: string[];
  }>({});

  const [showPassword, setShowPassword] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState<'holo' | 'sepidar' | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const { theme } = useTheme();
  const { login, isLoading } = useLogin();
  const { toast } = useToast();
  const router = useRouter();

  // Asset paths for different themes
  const hamgamImage = '/assets/static-image/hamgamPic-desktop.svg';
  const hamgamImageMobile = '/assets/static-image/hamgamPic-mobile.svg';
  const sepidarLogoLight = '/assets/static-logo/Sepidar-light.svg';
  const sepidarLogoDark = '/assets/static-logo/Sepidar-dark.svg';
  const holoLogoLight = '/assets/static-logo/Holo-light.svg';
  const holoLogoDark = '/assets/static-logo/Holo-dark.svg';
  const screenImageLight = '/assets/static-image/Gradient Background-light.svg';
  const screenImageDark = '/assets/static-image/Gradient Background-dark.svg';
  const dbConfigImage = '/assets/static-image/dbConfig.png';

  /**
   * Helper function to get the appropriate logo based on current theme and system
   * @param system - The selected system ('holo' or 'sepidar')
   * @returns The path to the appropriate logo image
   */
  const getSystemLogo = (system: 'holo' | 'sepidar') => {
    if (theme === 'dark') {
      return system === 'holo' ? holoLogoDark : sepidarLogoDark;
    }
    return system === 'holo' ? holoLogoLight : sepidarLogoLight;
  };

  useEffect(() => {}, [theme]);

  /**
   * Effect to update the system attribute on the document element
   * This is used for CSS custom properties and styling
   */
  useEffect(() => {
    // Remove previous system
    document.documentElement.removeAttribute('data-system');
    // localStorage.removeItem('data-system');
    Cookies.remove('data-system');
    // Set new system
    if (selectedSystem) {
      document.documentElement.setAttribute('data-system', selectedSystem);
      // localStorage.setItem('data-system', selectedSystem);
      Cookies.set('data-system', selectedSystem);
    }
  }, [selectedSystem]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  async function checkStatic(username: string, password: string) {
    try {
      const res = await fetch('https://CheckUserNewHamgam.mainapi.ir/api/Utility/StaticCheck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'خطا در ورود');
      }

      return data;
    } catch (error: any) {
      throw new Error(error.message || 'خطا در ارتباط با سرور');
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validatedData = loginSchema.parse({
        ...formData,
        system: selectedSystem,
      });

      // ✨ ابتدا چک با static
      const staticRes = await checkStatic(validatedData.username, validatedData.password);

      if (staticRes.error) {
        showToast('خطا', staticRes.error, 'destructive');
        return;
      }

      // در صورت موفقیت، staticRes.ip_address موجوده
      Cookies.set('server_ip', staticRes.serviceUrl);
      // console.log(Cookies.get('server_ip'));


      // سپس login اصلی
      const response = await login(validatedData);
      if (response) {
        if (response?.type_application == null) {
          showToast('خطا', 'دسترسی شما به همگام مجاز نمیباشد!', 'destructive');
          return;
        }
        setUserData(response);
        Cookies.set('type_application', response?.type_application);
        Cookies.set('token', response?.apikey);
        setIsFlipped(true);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      if (error instanceof z.ZodError) {
        setFormErrors(error.formErrors.fieldErrors);
        toast({
          variant: 'destructive',
          title: 'خطا در اعتبارسنجی',
          description: 'لطفا اطلاعات وارد شده را بررسی کنید',
          duration: 5000,
          className: 'bg-destructive text-destructive-foreground border shadow-lg',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'خطا',
          description: 'خطایی در ورود رخ داده است',
          duration: 5000,
          className: 'bg-destructive text-destructive-foreground border shadow-lg',
        });
      }
    }
  };
  return (
    <div
      className={`w-full h-screen flex justify-center items-center relative ${iranSans.variable} font-sans`}
    >
      {/* Animated background image that changes with theme */}
      <AnimatePresence mode="wait">
        <motion.img
          key={theme}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="absolute top-0 left-0 w-full h-full object-cover"
          src={theme === 'dark' ? screenImageDark : screenImageLight}
          alt="background"
        />
      </AnimatePresence>
      {/* Login form container with max width and height */}
      <div className="md:w-full w-[95%] max-w-5xl h-[90%] max-h-[700px] md:h-[90vh] overflow-hidden perspective-1000">
        <div className="flex flex-col md:flex-row-reverse h-full relative preserve-3d">
          <motion.div
            className="w-full h-full"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{
              duration: 1,
              ease: [0.4, 0, 0.2, 1],
              type: 'spring',
              stiffness: 100,
            }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Front side - Login Form */}
            <div
              className={`absolute w-full h-full backdrop-blur-[80px]  bg-none rounded-3xl backface-hidden  ${
                !isFlipped ? 'z-10' : 'z-0'
              }`}
            >
              <div className="flex flex-col  md:flex-row-reverse h-full ">
                {/* Theme toggle for both mobile and desktop */}
                <div className="absolute m-6 md:bg-transparent bg-white rounded-xl flex items-center justify-center top-0 right-0 z-20">
                  <ThemeToggle />
                </div>
                {/* Login card with glassmorphism effect */}

                {/* Right side decorative image - Desktop only */}
                <div className="hidden md:block flex-1  rounded-l-3xl px-6 p-4 bg-background/85 backdrop-blur-md relative">
                  <img
                    src={hamgamImage}
                    alt="hamgam login bg"
                    className="w-full h-full object-contain"
                    width={1000}
                    height={1000}
                  />
                </div>

                <Card className="flex-1 md:h-full h-fit   bg-background/85  border-none rounded-none rounded-r-3xl shadow-none rounded-l-3xl md:rounded-l-none  p-4 md:p-10 rtl relative sm:overflow-hidden overflow-y-auto">
                  {/* Mobile Hamgam image */}
                  <div className="md:hidden w-full h-[200px]  relative">
                    <img
                      src={hamgamImage}
                      alt="hamgam login bg"
                      className="w-full h-full object-cover rounded-3xl"
                      width={1000}
                      height={1000}
                    />
                  </div>
                  {/* Animated system logo background */}
                  <AnimatePresence mode="wait">
                    {selectedSystem && (
                      <motion.div
                        key={`${selectedSystem}-${theme}`}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 0.6, scale: 0.5 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                        className="absolute -top-[0%] md:top-[70%] inset-0 z-0"
                      >
                        <img
                          src={getSystemLogo(selectedSystem)}
                          alt={`${selectedSystem} background`}
                          className="w-full h-full object-contain"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Login form content */}
                  <div className="relative z-10  ">
                    {/* Header with theme toggle - Remove this since we moved it to top */}
                    <div className="hidden md:flex h-12 top-0 left-0 justify-between items-center mb-2">
                      <div className="px-4 py-2"></div>
                    </div>

                    {/* Main form content */}
                    <div className=" max-w-md mx-auto px-10 ">
                      {/* Title and description */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-8 mt-5 md:mt-0 "
                      >
                        <h1 className="md:text-2xl text-xl font-semibold mb-2">ورود به همگام</h1>
                        <p className="text-muted-foreground md:text-sm text-xs">
                          توسعه داده شده توسط شرکت وبکام
                        </p>
                      </motion.div>

                      <form onSubmit={handleSubmit} className="space-y-4  ">
                        <div className="space-y-2 relative">
                          <Label htmlFor="username" className="font-iransans">
                            نام کاربری
                          </Label>
                          <Input
                            className={`bg-transparent md:text-sm text-xs font-iransans ${
                              formErrors.username ? 'border-red-500' : ''
                            }`}
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            placeholder="نام کاربری خود را وارد کنید"
                            dir="rtl"
                          />
                          {formErrors.username?.map((error, i) => (
                            <p key={i} className="text-red-500 text-xs absolute -bottom-5 right-0">
                              {error}
                            </p>
                          ))}
                        </div>

                        <div className="space-y-2 relative">
                          <Label htmlFor="password" className="font-iransans">
                            رمز عبور
                          </Label>
                          <div className="relative">
                            <Input
                              className={`bg-transparent md:text-sm text-xs font-iransans ${
                                formErrors.password ? 'border-red-500' : ''
                              }`}
                              id="password"
                              name="password"
                              type={showPassword ? 'text' : 'password'}
                              value={formData.password}
                              onChange={handleInputChange}
                              placeholder="••••••••••••••••"
                              dir="rtl"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute left-3 top-1/2 -translate-y-1/2"
                            >
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                          {formErrors.password?.map((error, i) => (
                            <p key={i} className="text-red-500 text-xs absolute -bottom-5 right-0">
                              {error}
                            </p>
                          ))}
                        </div>

                        <div className="relative space-y-8">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border"></div>
                          </div>
                          <div className="relative flex justify-center text-xs">
                            <span className="px-2 text-muted-foreground font-iransans">
                              نوع حسابداری خود را انتخاب کنید
                            </span>
                          </div>
                          {formErrors.system?.map((error, i) => (
                            <p key={i} className="text-red-500 text-xs absolute -bottom-5 right-0">
                              {error}
                            </p>
                          ))}
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-10">
                          <Button
                            type="button"
                            variant={selectedSystem === 'holo' ? 'holo' : 'secondary'}
                            className="flex items-center justify-center text-black border-holo h-12 border-2 gap-2 font-iransans"
                            onClick={() => setSelectedSystem('holo')}
                          >
                            <AnimatePresence mode="wait">
                              <motion.img
                                key={`holo-${theme}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                src={getSystemLogo('holo')}
                                alt="holo logo"
                              />
                            </AnimatePresence>
                          </Button>
                          <Button
                            type="button"
                            variant={selectedSystem === 'sepidar' ? 'sepidar' : 'secondary'}
                            className="flex items-center justify-center gap-2 h-12 border-sepidar border-2 font-iransans"
                            onClick={() => setSelectedSystem('sepidar')}
                          >
                            <AnimatePresence mode="wait">
                              <motion.img
                                key={`sepidar-${theme}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                src={getSystemLogo('sepidar')}
                                alt="sepidar logo"
                              />
                            </AnimatePresence>
                          </Button>
                        </div>

                        <Button
                          type="submit"
                          variant="default"
                          className="w-full h-12 py-4 font-iransans"
                          disabled={isLoading || (!selectedSystem && isFlipped === false)}
                        >
                          {isLoading ? 'در حال ورود...' : 'ورود'}
                        </Button>

                        {/* Footer links */}
                        <div className="flex justify-between text-foreground/50 items-center px-2 gap-2 text-xs w-full">
                          <p className="font-iransans">نسخه ۰.۰</p>
                          <Link
                            href="https://webcomco.com"
                            target="_blank"
                            className="hover:text-foreground font-iransans"
                          >
                            webcomco.com
                          </Link>
                        </div>
                      </form>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Back side - User Info */}
            <div
              className={`absolute w-full h-full bg-background/85 backface-hidden rotate-y-180 ${
                isFlipped ? 'z-20  opacity-100' : '-z-10 opacity-0'
              }`}
            >
              <motion.div
                className="h-full  "
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0, ease: 'easeInOut' }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <Card className="flex-1 bg-background/85 flex flex-col md:flex-row items-center justify-center backdrop-blur-md border-none rounded-3xl p-8 h-full">
                  <DbConfigForm dbData={userData} onFlip={() => setIsFlipped(false)} />
                  <img
                    src={dbConfigImage}
                    alt="dbConfig"
                    className="h-full z-0 md:block hidden rounded-xl object-cover"
                  />
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
