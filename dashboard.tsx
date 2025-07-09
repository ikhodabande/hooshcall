"use client"
import { useEffect } from "react"
import { Provider } from "react-redux"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
} from "lucide-react"
import { store } from "./lib/store"
import { useAppDispatch, useAppSelector } from "./hooks/redux"
import { setCurrentPage, updateTime, type PageType } from "./lib/store"
import DashboardPage from "./components/pages/dashboard-page"
import EmailPage from "./components/pages/email-page"
import ContactsPage from "./components/pages/contacts-page"
import MessagesPage from "./components/pages/messages-page"
import SettingsPage from "./components/pages/settings-page"
import ProfilePage from "./components/pages/profile-page"

function DashboardContent() {
  const dispatch = useAppDispatch()
  const { currentPage, currentTime } = useAppSelector((state) => state.app)

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const persianTime = now.toLocaleString("fa-IR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "Asia/Tehran",
      })
      dispatch(updateTime(persianTime))
    }, 1000)

    return () => clearInterval(timer)
  }, [dispatch])

  const handlePageChange = (page: PageType) => {
    dispatch(setCurrentPage(page))
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage />
      case "email":
        return <EmailPage />
      case "contacts":
        return <ContactsPage />
      case "messages":
        return <MessagesPage />
      case "settings":
        return <SettingsPage />
      case "profile":
        return <ProfilePage />
      default:
        return <DashboardPage />
    }
  }

  const sidebarItems = [
    { id: "dashboard" as PageType, label: "داشبورد", icon: Grid3X3 },
    { id: "email" as PageType, label: "ایمیل", icon: Mail },
    { id: "contacts" as PageType, label: "مخاطبین", icon: Users },
    { id: "messages" as PageType, label: "پیام ها", icon: MessageSquare },
    { id: "settings" as PageType, label: "تنظیمات", icon: Settings },
    { id: "profile" as PageType, label: "پروفایل", icon: UserCircle },
  ]

  const getPageTitle = (page: PageType) => {
    const titles = {
      dashboard: "داشبورد",
      email: "صندوق پستی",
      contacts: "مخاطبین",
      messages: "پیام ها",
      settings: "تنظیمات",
      profile: "پروفایل کاربری",
    }
    return titles[page]
  }

  return (
    <div className="min-h-screen bg-background font-persian" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-teal-500 text-white px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white hover:bg-teal-600 gap-2 font-medium">
                  <ChevronDown className="w-4 h-4" />
                  <User className="w-4 h-4" />
                  ساحل ظاهری
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem onClick={() => handlePageChange("profile")} className="gap-2">
                  <UserCircle className="w-4 h-4" />
                  پروفایل
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handlePageChange("settings")} className="gap-2">
                  <Settings className="w-4 h-4" />
                  تنظیمات
                </DropdownMenuItem>
                <Separator />
                <DropdownMenuItem className="gap-2 text-red-600">خروج</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Separator orientation="vertical" className="h-6 bg-white/30" />

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-white hover:bg-teal-600 relative">
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-red-500 text-white text-xs">۳</Badge>
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-teal-600">
                <Mail className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-teal-600">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="جستجو کنید ..."
                className="pr-10 bg-white/20 border-white/30 text-white placeholder:text-white/70 w-64 focus:bg-white/30"
              />
            </div>
            <Separator orientation="vertical" className="h-6 bg-white/30" />
            <div className="text-sm font-medium persian-numbers">{currentTime}</div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="font-bold text-lg">{getPageTitle(currentPage)}</div>
              <div className="text-sm opacity-90">تحلیلگر مرکز تماس هوشمند</div>
            </div>
            <Separator orientation="vertical" className="h-8 bg-white/30" />
            <div className="bg-white p-2 rounded-lg shadow-sm">
              <div className="text-teal-500 font-bold text-sm">HOOSH CALL</div>
              <div className="text-xs text-gray-600">مرکز تماس هوشمند</div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        {/* Main Content */}
        <main className="flex-1 p-6 min-h-[calc(100vh-80px)]">{renderCurrentPage()}</main>

        {/* Right Sidebar */}
        <aside className="w-20 bg-card shadow-sm border-l">
          <nav className="p-2 space-y-4 pt-6">
            {sidebarItems.map((item) => (
              <div key={item.id} className="text-center">
                <Button
                  variant={currentPage === item.id ? "default" : "ghost"}
                  size="icon"
                  className={`w-12 h-12 mx-auto block transition-all ${
                    currentPage === item.id ? "bg-teal-500 hover:bg-teal-600 text-white shadow-md" : "hover:bg-muted"
                  }`}
                  onClick={() => handlePageChange(item.id)}
                >
                  <item.icon className="w-6 h-6" />
                </Button>
                <div
                  className={`text-xs mt-1 transition-colors ${
                    currentPage === item.id ? "text-teal-600 font-medium" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </div>
              </div>
            ))}
          </nav>
        </aside>
      </div>
    </div>
  )
}

export default function Component() {
  return (
    <Provider store={store}>
      <DashboardContent />
    </Provider>
  )
}
