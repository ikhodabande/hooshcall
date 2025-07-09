'use client';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '@/components/theme-toggle';
import { MobileNav } from '@/components/mobile-nav';
import {
  Bell,
  ChevronDown,
  Grid3X3,
  Mail,
  MessageSquare,
  Search,
  Settings,
  User,
  Users,
  UserCircle,
  LogOut,
  Phone,
} from 'lucide-react';
import { store } from './lib/store';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { setCurrentPage, updateTime, logout, type PageType } from './lib/store';
import { toast } from '@/hooks/use-toast';
import LoginPage from './components/auth/login-page';
import DashboardPage from './components/pages/dashboard-page';
import EmailPage from './components/pages/email-page';
import ContactsPage from './components/pages/contacts-page';
import MessagesPage from './components/pages/messages-page';
import SettingsPage from './components/pages/settings-page';
import ProfilePage from './components/pages/profile-page';
import ContactsListPage from './components/pages/contacts-list-page';
import UserCallsPage from './components/pages/user-calls-page';

function DashboardContent() {
  const dispatch = useAppDispatch();
  const { currentPage, currentTime, user, isAuthenticated } = useAppSelector(
    (state) => state.app
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const persianTime = now.toLocaleString('fa-IR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Asia/Tehran',
      });
      dispatch(updateTime(persianTime));
    }, 1000);

    return () => clearInterval(timer);
  }, [dispatch]);

  const handlePageChange = (page: PageType) => {
    dispatch(setCurrentPage(page));
  };

  const handleLogin = (userData: {
    username: string;
    role: 'admin' | 'user';
  }) => {
    // Login is handled in the LoginPage component via dispatch
  };

  const handleLogout = () => {
    dispatch(logout());
    toast({
      title: 'خروج از حساب',
      description: 'با موفقیت از حساب کاربری خارج شدید.',
      variant: 'default',
    });
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'email':
        return <EmailPage />;
      case 'contacts':
        return <ContactsPage />;
      case 'messages':
        return <MessagesPage />;
      case 'settings':
        return <SettingsPage />;
      case 'profile':
        return <ProfilePage />;
      case 'contacts-list':
        return <ContactsListPage />;
      case 'user-calls':
        return <UserCallsPage />;
      default:
        return user?.role === 'admin' ? <DashboardPage /> : <UserCallsPage />;
    }
  };

  // Admin sidebar items
  const adminSidebarItems = [
    { id: 'dashboard' as PageType, label: 'داشبورد', icon: Grid3X3 },
    { id: 'email' as PageType, label: 'ایمیل', icon: Mail },
    { id: 'contacts-list' as PageType, label: 'لیست تماس', icon: Users },
    { id: 'messages' as PageType, label: 'پیام ها', icon: MessageSquare },
    { id: 'settings' as PageType, label: 'تنظیمات', icon: Settings },
    { id: 'profile' as PageType, label: 'پروفایل', icon: UserCircle },
  ];

  // User sidebar items (limited access)
  const userSidebarItems = [
    { id: 'user-calls' as PageType, label: 'تماس های من', icon: Phone },
    { id: 'settings' as PageType, label: 'تنظیمات', icon: Settings },
    { id: 'profile' as PageType, label: 'پروفایل', icon: UserCircle },
  ];

  const sidebarItems =
    user?.role === 'admin' ? adminSidebarItems : userSidebarItems;

  const getPageTitle = (page: PageType) => {
    const titles = {
      dashboard: 'داشبورد',
      email: 'صندوق پستی',
      contacts: 'مخاطبین',
      messages: 'پیام ها',
      settings: 'تنظیمات',
      profile: 'پروفایل کاربری',
      'contacts-list': 'لیست تماس ها',
      'user-calls': 'تماس های من',
    };
    return titles[page];
  };

  const getUserDisplayName = () => {
    if (!user) return 'کاربر';
    return user.role === 'admin' ? 'مدیر سیستم' : 'کاربر';
  };

  const getRoleDisplayName = () => {
    if (!user) return '';
    return user.role === 'admin' ? 'مدیر سیستم' : 'کاربر عادی';
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div
      className="min-h-screen bg-background font-persian transition-colors duration-300"
      dir="rtl"
    >
      {/* Header */}
      <header className="fixed w-full h-[288px] pr-52 top-0 z-0 bg-teal-500 dark:bg-teal-600 text-white pl-24 py-3 shadow-sm">
        <div className="flex flex-row-reverse items-center justify-between  mx-auto">
          {/* Left Section - User Menu */}
          <div className="flex flex-row-reverse items-center gap-2 sm:gap-4">
            <DropdownMenu dir="rtl">
              <DropdownMenuTrigger asChild>
                <Button
                  variant="default"
                  className="text-white w-[156px] hover:bg-teal-600 flex justify-around items-center flex-row-reverse dark:hover:bg-teal-700 gap-2 font-medium"
                >
                  <ChevronDown className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {user?.username || 'کاربر'}
                  </span>{' '}
                  <User className="w-10 h-10" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[156px]">
                <div className="px-2 py-1.5 text-sm text-muted-foreground border-b">
                  {getRoleDisplayName()}
                </div>
                <DropdownMenuItem
                  onClick={() => handlePageChange('profile')}
                  className="gap-2"
                >
                  <UserCircle className="w-4 h-4" />
                  پروفایل
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handlePageChange('settings')}
                  className="gap-2"
                >
                  <Settings className="w-4 h-4" />
                  تنظیمات
                </DropdownMenuItem>
                <Separator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="gap-2 text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  خروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Separator
              orientation="vertical"
              className="h-6 bg-white/30 hidden sm:block"
            />

            <div className="hidden sm:flex items-center gap-2">
              <Button
                variant="default"
                size="icon"
                className="text-white hover:bg-teal-600 dark:hover:bg-teal-700 relative"
              >
                <Bell className="w-5 h-5" />
                {/* <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-red-500 text-white text-xs">
                  ۳
                </Badge> */}
              </Button>
              {user?.role === 'admin' && (
                <Button
                  variant="default"
                  size="icon"
                  className="text-white hover:bg-teal-600 dark:hover:bg-teal-700"
                >
                  <Mail className="w-5 h-5" />
                </Button>
              )}
              <ThemeToggle />
            </div>

            <MobileNav />

            {user?.role === 'admin' && (
              <>
                <div className="relative hidden md:block">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="جستجو کنید ..."
                    className="pr-10 bg-white/20 border-white/30 text-white placeholder:text-white/70 w-48 lg:w-64 focus:bg-white/30"
                  />
                </div>
                <Separator
                  orientation="vertical"
                  className="h-6 bg-white/30 hidden md:block"
                />
              </>
            )}
            <div className="text-xs sm:text-sm font-medium persian-numbers hidden sm:block">
              {currentTime}
            </div>
          </div>

          {/* Center Section - Search & Time */}
          {/* <div className="flex items-center gap-2 sm:gap-4">
            {user?.role === 'admin' && (
              <>
                <div className="relative hidden md:block">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="جستجو کنید ..."
                    className="pr-10 bg-white/20 border-white/30 text-white placeholder:text-white/70 w-48 lg:w-64 focus:bg-white/30"
                  />
                </div>
                <Separator
                  orientation="vertical"
                  className="h-6 bg-white/30 hidden md:block"
                />
              </>
            )}
            <div className="text-xs sm:text-sm font-medium persian-numbers hidden sm:block">
              {currentTime}
            </div>
          </div> */}

          {/* Right Section - Branding */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden lg:block">
              <div className="font-bold text-sm lg:text-lg">
                {getPageTitle(currentPage)}
              </div>
              <div className="text-xs lg:text-sm opacity-90">
                {user?.role === 'admin' ? 'پنل مدیریت' : 'پنل کاربری'}
              </div>
            </div>
            <Separator
              orientation="vertical"
              className="h-8 bg-white/30 hidden lg:block"
            />
            <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm">
              <div className="text-teal-500 dark:text-teal-400 font-bold text-xs sm:text-sm">
                HOOSH CALL
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 hidden sm:block">
                مرکز تماس هوشمند
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex w-full absolute z-20 top-20 mx-auto">
        {/* Right Sidebar - Desktop Only */}
        <aside className="hidden absolute right-0 -top-20 h-screen md:block w-48 bg-card dark:bg-card shadow-sm border-l dark:border-gray-700">
          <nav className="p-2 space-y-4 pt-6">
            {sidebarItems.map((item) => (
              <div
                key={item.id}
                className="text-center flex items-center justify-start gap-2"
              >
                <Button
                  variant={currentPage === item.id ? 'default' : 'ghost'}
                  size="icon"
                  className={`w-10 !m-0 !p-0 h-10 mx-auto flex items-center justify-center  transition-all ${
                    currentPage === item.id
                      ? 'bg-teal-500 hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700 text-white shadow-md'
                      : 'hover:bg-muted dark:hover:bg-gray-700'
                  }`}
                  onClick={() => handlePageChange(item.id)}
                >
                  <item.icon className="w-8 h-8" />
                </Button>
                <div
                  className={`text-sm md:text-base w-full text-start mt-1 transition-colors ${
                    currentPage === item.id
                      ? 'text-teal-600 dark:text-teal-400 font-medium'
                      : 'text-muted-foreground'
                  }`}
                >
                  {item.label}
                </div>
              </div>
            ))}
          </nav>
        </aside>{' '}
        {/* Main Content */}
        <main className="flex-1 mr-48 ml-20 w-full p-3 sm:p-6 min-h-[calc(100vh-80px)]">
          {renderCurrentPage()}
        </main>
      </div>
    </div>
  );
}

export default function Component() {
  return (
    <Provider store={store}>
      <DashboardContent />
    </Provider>
  );
}
