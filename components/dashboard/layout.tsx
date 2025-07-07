'use client';

import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleSidebar } from '@/store/slices/dashboardSlice';
import Cookies from 'js-cookie';
import {
  Bell,
  Box,
  Building2,
  Calendar,
  Clock,
  Database,
  Home,
  Laptop,
  ListOrdered,
  LogOut,
  Mail,
  MenuIcon,
  Settings,
  Shield,
  ShoppingBagIcon,
  ShoppingCart,
  User,
  UserPlus,
  X,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import hooshcallLogo from '@/public/assets/static-logo/hooshcall-logo.svg';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { sidebarOpen } = useAppSelector(state => state.dashboard);
  const [selectedSystem, setSelectedSystem] = useState('');
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const storedSystem = Cookies.get('data-system') || 'webcom';
    document.documentElement.setAttribute('data-system', storedSystem);
    setSelectedSystem(storedSystem);
  }, [selectedSystem]);

  // Real-time clock state
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('data-system');
    Cookies.remove('user');
    Cookies.remove('server_ip');
    Cookies.remove('type_application');
    localStorage.clear();
    router.replace('/login');
  };

  const type_application: any = Cookies.get('type_application');

  const menuItems = [
    { icon: Home, label: 'صفحه اصلی', href: '/dashboard/' },
    { icon: Box, label: 'بازاریاب', href: '/dashboard/visitors/' },
    { icon: ShoppingCart, label: 'کالا', href: '/dashboard/products/' },
    { icon: ListOrdered, label: 'سفارشات', href: '/dashboard/orders/' },
    // { icon: ShoppingBagIcon, label: 'فروشگاه', href: '/dashboard/shop/' },
  ];

  const menuShopItems = [
    { icon: Home, label: 'صفحه اصلی', href: '/dashboard/' },
    { icon: ShoppingBagIcon, label: 'فروشگاه', href: '/dashboard/shop/' },
  ];

  const allItems = [
    { icon: Home, label: 'صفحه اصلی', href: '/dashboard/' },
    { icon: Box, label: 'بازاریاب', href: '/dashboard/visitors/' },
    { icon: ShoppingCart, label: 'کالا', href: '/dashboard/products/' },
    { icon: ListOrdered, label: 'سفارشات', href: '/dashboard/orders/' },
    { icon: ShoppingBagIcon, label: 'فروشگاه', href: '/dashboard/shop/' },
  ];

  let selectedItems;

  if (type_application == 1) {
    selectedItems = menuShopItems;
  } else if (type_application == 2) {
    selectedItems = menuItems;
  } else {
    selectedItems = allItems;
  }

  return (
    <>
      <div>
        {/* Sidebar */}
        <div
          className={`fixed sm:hidden top-0 right-0 z-40 h-screen transition-transform rtl ${
            sidebarOpen ? 'translate-x-0' : 'translate-x-full'
          } md:translate-x-0 w-64 bg-card border-l`}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between p-6">
              <h2 className="text-xl px-2 font-semibold">همگام | HAMGAM</h2>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => dispatch(toggleSidebar())}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            {hasMounted && (
              <nav className="flex-1 space-y-1 p-4">
                {selectedItems?.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
                      pathname == item.href
                        ? 'bg-primary text-accent-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            )}

            <div className="p-4 border-t">
              <DropdownMenu dir="rtl">
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="default"
                    className="w-full flex items-center  gap-3 justify-center"
                  >
                    <Settings className="h-5 w-5" />
                    <span>تنظیمات</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => router.push('/dashboard/settings/system')}>
                      <Laptop className="ml-2 h-4 w-4" />
                      <span>تنظیمات برنامه</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => router.push('/dashboard/settings/organization')}
                    >
                      <Building2 className="ml-2 h-4 w-4" />
                      <span>تنظیمات خرید </span>
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <UserPlus className="ml-2 h-4 w-4" />
                        <span>تنظیم اسلایدر</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem
                          onClick={() => router.push('/dashboard/settings/users/add')}
                        >
                          تنظیم نوع نمایش
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => router.push('/dashboard/settings/users/roles')}
                        >
                          مدیریت کامنت ها
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuItem onClick={() => router.push('/dashboard/settings/database')}>
                      <Database className="ml-2 h-4 w-4" />
                      <span>تنظیمات پایگاه داده</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/dashboard/settings/security')}>
                      <Shield className="ml-2 h-4 w-4" />
                      <span>امنیت</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => router.push('/dashboard/settings/notifications')}
                    >
                      <Mail className="ml-2 h-4 w-4" />
                      <span>اعلان‌ها</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>{' '}
        <aside className="fixed right-0 top-0 flex flex-col   w-[188px] z-40 h-screen bg-white">
          <Image alt="هوشکال" width={200} height={150} src={hooshcallLogo} />
          <div className=" flex flex-col gap-2 items-start justify-start px-2">
            {selectedItems?.map(item => (
              <Button variant={'ghost'} className="w-full">
                <div className="flex gap-2 text-center w-full mx-auto justify-start items-center">
                  <item.icon className="  " />
                  {item?.label}
                </div>
              </Button>
            ))}
          </div>
        </aside>
        {/* Main Content */}
        <div className={`mr-[188px] flex  h-full`}>
          {/* Header */}
          <header className=" z-30 p-3 border-b bg-primary backdrop-blur h-[228px] flex items-start w-full"></header>
          {/* Page Content */}
        </div>{' '}
        <main className="flex-1 mr-[188px]">{children}</main>
      </div>
    </>
  );
}
