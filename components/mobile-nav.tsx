"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Menu, Grid3X3, Mail, MessageSquare, Settings, Users, UserCircle, Bell, Phone } from "lucide-react"
import { useAppDispatch, useAppSelector } from "../hooks/redux"
import { setCurrentPage, type PageType } from "../lib/store"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function MobileNav() {
  const dispatch = useAppDispatch()
  const { currentPage, user } = useAppSelector((state) => state.app)

  const handlePageChange = (page: PageType) => {
    dispatch(setCurrentPage(page))
  }

  // Admin sidebar items
  const adminSidebarItems = [
    { id: "dashboard" as PageType, label: "داشبورد", icon: Grid3X3 },
    { id: "email" as PageType, label: "ایمیل", icon: Mail },
    { id: "contacts-list" as PageType, label: "لیست تماس", icon: Users },
    { id: "messages" as PageType, label: "پیام ها", icon: MessageSquare },
    { id: "settings" as PageType, label: "تنظیمات", icon: Settings },
    { id: "profile" as PageType, label: "پروفایل", icon: UserCircle },
  ]

  // User sidebar items (limited access)
  const userSidebarItems = [
    { id: "user-calls" as PageType, label: "تماس های من", icon: Phone },
    { id: "settings" as PageType, label: "تنظیمات", icon: Settings },
    { id: "profile" as PageType, label: "پروفایل", icon: UserCircle },
  ]

  const sidebarItems = user?.role === "admin" ? adminSidebarItems : userSidebarItems

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white hover:bg-teal-600 lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80">
        <SheetHeader>
          <SheetTitle className="text-right">منوی اصلی</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          {/* User Info */}
          {user && (
            <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-teal-500 text-white">
                    {user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{user.username}</div>
                  <div className="text-sm text-muted-foreground">
                    {user.role === "admin" ? "مدیر سیستم" : "کاربر عادی"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">دسترسی سریع</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                <Bell className="w-4 h-4 ml-2" />
                اعلان ها
                <Badge className="mr-2 h-5 w-5 p-0 bg-red-500 text-white text-xs">۳</Badge>
              </Button>
              {user?.role === "admin" && (
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Mail className="w-4 h-4 ml-2" />
                  پیام ها
                </Button>
              )}
            </div>
          </div>

          <Separator />

          {/* Navigation Items */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">صفحات</h3>
            <nav className="space-y-1">
              {sidebarItems.map((item) => (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? "default" : "ghost"}
                  className={`w-full justify-start gap-3 ${
                    currentPage === item.id ? "bg-teal-500 hover:bg-teal-600 text-white" : ""
                  }`}
                  onClick={() => handlePageChange(item.id)}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Button>
              ))}
            </nav>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
