'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Phone,
  Clock,
  TrendingUp,
  Users,
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  Activity,
  BarChart3,
  PieChart,
} from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <span>داشبورد</span>
        <Separator orientation="vertical" className="h-4" />
        <span className="text-foreground">نمای کلی</span>
      </div>

      <div className=" flex gap-6 items-start justify-between">
        <div className="w-full max-w-[393px] grid grid-cols-1 gap-2">
          <Card className="hover:shadow-md w-full max-w-[393px] transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">نرخ پیشرفت</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold persian-numbers">%۲۱.۴</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+۵%</span> نسبت به دیروز
              </p>
              <Progress value={21} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">همه تماس ها</CardTitle>
              <Phone className="h-4 w-4 text-teal-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold persian-numbers">۳۴۵</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+۱۲%</span> نسبت به ماه گذشته
              </p>
              <Progress value={75} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                میانگین زمان پاسخ
              </CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold persian-numbers">
                ۵۵.۳ ثانیه
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-red-600">+۳%</span> نسبت به هفته گذشته
              </p>
              <Progress value={60} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                کاربران فعال
              </CardTitle>
              <Users className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold persian-numbers">۱۲۳</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+۸%</span> نسبت به امروز
              </p>
              <Progress value={85} className="mt-2" />
            </CardContent>
          </Card>
        </div>
        <div className='w-full min-w-[756px] flex flex-col  gap-10'>
          {/* Hero Section */}
          <Card className="bg-gradient-to-r  from-slate-800 to-slate-900 text-white overflow-hidden border-0 shadow-lg  ">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h1 className="text-4xl font-bold text-balance">هوشکال</h1>
                    <p className="text-xl opacity-90 text-balance">
                      همراه هوشمند شما در هر تماس
                    </p>
                    <Badge
                      variant="secondary"
                      className="bg-white/20 text-white border-white/30"
                    >
                      نسخه ۲.۱.۰
                    </Badge>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      className="text-white border-white hover:bg-white hover:text-slate-900 bg-transparent"
                    >
                      <PhoneCall className="w-4 h-4 ml-2" />
                      آخرین تماس ها
                    </Button>
                    <Button
                      variant="outline"
                      className="text-white border-white hover:bg-white hover:text-slate-900 bg-transparent"
                    >
                      <BarChart3 className="w-4 h-4 ml-2" />
                      گزارش هفتگی
                    </Button>
                    <Button
                      variant="outline"
                      className="text-white border-white hover:bg-white hover:text-slate-900 bg-transparent"
                    >
                      <PieChart className="w-4 h-4 ml-2" />
                      خلاصه گزارش
                    </Button>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <div className="w-48 h-32 bg-gradient-to-br from-teal-400/20 to-blue-400/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <div className="w-24 h-16 bg-white/10 rounded border border-white/20 flex items-center justify-center">
                      <Activity className="w-8 h-8 text-white/80" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Bottom Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className='border-none shadow-xl'>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PhoneIncoming className="w-5 h-5 text-green-500" />
                  میز کار
                </CardTitle>
                <CardDescription>وضعیت فعلی تماس ها</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium">همه تماس ها</span>
                  <Badge variant="secondary" className="persian-numbers">
                    %۲۱.۴
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium">در حال پاسخگویی</span>
                  <Badge
                    variant="default"
                    className="bg-green-500 persian-numbers"
                  >
                    ۱۲۳
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium">به پایان رسیده</span>
                  <Badge
                    variant="default"
                    className="bg-blue-500 persian-numbers"
                  >
                    ۲۲۲
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <span className="text-sm font-medium">در انتظار</span>
                  <Badge
                    variant="default"
                    className="bg-orange-500 persian-numbers"
                  >
                    ۴۵
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className='border-none shadow-xl'>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PhoneOutgoing className="w-5 h-5 text-blue-500" />
                  جزئیات آمار
                </CardTitle>
                <CardDescription>تحلیل عملکرد سیستم</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium">تماس های معتبر</span>
                  <div className="text-left">
                    <div className="font-bold persian-numbers">۴۸۲</div>
                    <div className="text-xs text-muted-foreground persian-numbers">
                      %۴۷
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium">کل زمان</span>
                  <div className="font-bold persian-numbers">۲۲:۳۲:۲۹</div>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium">میانگین زمان</span>
                  <div className="font-bold persian-numbers">۰۱:۴۶</div>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium">نرخ موفقیت</span>
                  <Badge
                    variant="default"
                    className="bg-green-500 persian-numbers"
                  >
                    %۹۲
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
