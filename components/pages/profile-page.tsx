"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Phone, MapPin, Calendar, Edit } from "lucide-react"

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">پروفایل کاربری</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6 text-center">
            <Avatar className="w-24 h-24 mx-auto mb-4">
              <AvatarFallback className="bg-teal-100 text-teal-700 text-2xl">س.ظ</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold mb-2">ساحل ظاهری</h2>
            <Badge variant="secondary" className="mb-4">
              مدیر سیستم
            </Badge>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" />
                sahel@example.com
              </div>
              <div className="flex items-center justify-center gap-2">
                <Phone className="w-4 h-4" />
                ۰۹۱۲۳۴۵۶۷۸۹
              </div>
              <div className="flex items-center justify-center gap-2">
                <MapPin className="w-4 h-4" />
                تهران، ایران
              </div>
              <div className="flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" />
                عضو از ۱۴۰۲
              </div>
            </div>
            <Button className="w-full mt-4 bg-teal-500 hover:bg-teal-600">
              <Edit className="w-4 h-4 ml-2" />
              ویرایش پروفایل
            </Button>
          </CardContent>
        </Card>

        {/* Edit Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              اطلاعات شخصی
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">نام</Label>
                <Input id="firstName" defaultValue="ساحل" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">نام خانوادگی</Label>
                <Input id="lastName" defaultValue="ظاهری" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">ایمیل</Label>
              <Input id="email" type="email" defaultValue="sahel@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">شماره تلفن</Label>
              <Input id="phone" defaultValue="۰۹۱۲۳۴۵۶۷۸۹" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">آدرس</Label>
              <Input id="address" defaultValue="تهران، ایران" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">درباره من</Label>
              <textarea
                id="bio"
                className="w-full p-3 border rounded-md resize-none h-24"
                placeholder="درباره خود بنویسید..."
                defaultValue="مدیر سیستم با ۵ سال تجربه در زمینه مرکز تماس و خدمات مشتریان"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Stats */}
      <Card>
        <CardHeader>
          <CardTitle>آمار فعالیت</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">۱۲۳</div>
              <div className="text-sm text-gray-600">تماس های پردازش شده</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">۴۵</div>
              <div className="text-sm text-gray-600">ایمیل های ارسالی</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">۶۷</div>
              <div className="text-sm text-gray-600">پیام های پاسخ داده شده</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">%۹۸</div>
              <div className="text-sm text-gray-600">رضایت مشتریان</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline">لغو</Button>
        <Button className="bg-teal-500 hover:bg-teal-600">ذخیره تغییرات</Button>
      </div>
    </div>
  )
}
