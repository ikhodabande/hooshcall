"use client"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CallAnalysisModal } from "@/components/call-analysis-modal"
import {
  Search,
  Filter,
  Calendar,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Phone,
  Mail,
  MessageSquare,
  Eye,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface UserCall {
  id: number
  customerName: string
  score: number
  date: string
  duration: string
  status: "موفق" | "ناموفق" | "در انتظار"
  type: "ورودی" | "خروجی"
  avatar: string
  email: string
  phone: string
  address: string
  summary: string
}

export default function UserCallsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("همه")
  const [typeFilter, setTypeFilter] = useState("همه")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedDate, setSelectedDate] = useState("1404-04-11")
  const [selectedCall, setSelectedCall] = useState<UserCall | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // User's own calls - limited data
  const userCalls: UserCall[] = [
    {
      id: 1,
      customerName: "احمد محمدی",
      score: 8.5,
      date: "1404-04-11",
      duration: "05:23",
      status: "موفق",
      type: "ورودی",
      avatar: "ا.م",
      email: "ahmad.mohammadi@email.com",
      phone: "09123456789",
      address: "تهران، خیابان آزادی، پلاک ۱۲۳",
      summary: "مشتری راضی از خدمات ارائه شده و تمایل به ادامه همکاری دارد",
    },
    {
      id: 2,
      customerName: "مریم احمدی",
      score: 7.2,
      date: "1404-04-10",
      duration: "03:45",
      status: "موفق",
      type: "خروجی",
      avatar: "م.ا",
      email: "maryam.ahmadi@email.com",
      phone: "09187654321",
      address: "تهران، خیابان ولیعصر، پلاک ۴۵۶",
      summary: "پیگیری سفارش قبلی و ارائه اطلاعات تکمیلی به مشتری",
    },
    {
      id: 3,
      customerName: "حسن رضایی",
      score: 6.8,
      date: "1404-04-10",
      duration: "02:15",
      status: "ناموفق",
      type: "ورودی",
      avatar: "ح.ر",
      email: "hassan.rezaei@email.com",
      phone: "09112233445",
      address: "تهران، خیابان انقلاب، پلاک ۷۸۹",
      summary: "مشتری نارضایتی از کیفیت محصول داشت و نیاز به پیگیری بیشتر دارد",
    },
    {
      id: 4,
      customerName: "زهرا کریمی",
      score: 9.1,
      date: "1404-04-09",
      duration: "07:12",
      status: "موفق",
      type: "ورودی",
      avatar: "ز.ک",
      email: "zahra.karimi@email.com",
      phone: "09198765432",
      address: "تهران، خیابان کریمخان، پلاک ۱۰۱",
      summary: "مشتری جدید با علاقه بالا به محصولات و خرید موفق",
    },
    {
      id: 5,
      customerName: "علی نوری",
      score: 5.5,
      date: "1404-04-09",
      duration: "01:30",
      status: "در انتظار",
      type: "خروجی",
      avatar: "ع.ن",
      email: "ali.nouri@email.com",
      phone: "09156789012",
      address: "تهران، خیابان فردوسی، پلاک ۲۰۲",
      summary: "تماس برای پیگیری که نیاز به بررسی بیشتر دارد",
    },
  ]

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "موفق":
        return "default"
      case "ناموفق":
        return "destructive"
      case "در انتظار":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "ورودی":
        return "default"
      case "خروجی":
        return "secondary"
      default:
        return "outline"
    }
  }

  const filteredCalls = userCalls.filter((call) => {
    const matchesSearch = call.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "همه" || call.status === statusFilter
    const matchesType = typeFilter === "همه" || call.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const handleCallAction = (action: string, customerName: string) => {
    toast({
      title: "عملیات انجام شد",
      description: `${action} برای ${customerName} انجام شد.`,
      variant: "success",
    })
  }

  const handleViewDetails = (call: UserCall) => {
    setSelectedCall(call)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedCall(null)
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#" className="text-muted-foreground">
              داشبورد
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>تماس های من</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">تماس های من</h1>
          <p className="text-muted-foreground">مشاهده و مدیریت تماس های شخصی</p>
        </div>
        <Badge variant="secondary" className="persian-numbers">
          {filteredCalls.length} تماس
        </Badge>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-center w-full lg:w-auto">
              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="جستجو مشتری"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>

              {/* Date Filter */}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-32 persian-numbers"
                  placeholder="1404-04-11"
                />
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <Filter className="w-4 h-4 ml-2" />
                  <SelectValue placeholder="وضعیت" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="همه">همه</SelectItem>
                  <SelectItem value="موفق">موفق</SelectItem>
                  <SelectItem value="ناموفق">ناموفق</SelectItem>
                  <SelectItem value="در انتظار">در انتظار</SelectItem>
                </SelectContent>
              </Select>

              {/* Type Filter */}
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="نوع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="همه">همه</SelectItem>
                  <SelectItem value="ورودی">ورودی</SelectItem>
                  <SelectItem value="خروجی">خروجی</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="bg-teal-500 hover:bg-teal-600 text-white">جستجو</Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Table - Desktop and Mobile Responsive */}
      <Card>
        <CardContent className="p-0">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-center w-16">#</TableHead>
                  <TableHead className="text-right">مشتری</TableHead>
                  <TableHead className="text-center w-24">امتیاز</TableHead>
                  <TableHead className="text-center w-32">تاریخ</TableHead>
                  <TableHead className="text-center w-24">مدت</TableHead>
                  <TableHead className="text-center w-32">وضعیت</TableHead>
                  <TableHead className="text-center w-32">نوع</TableHead>
                  <TableHead className="text-center w-16">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCalls.map((call) => (
                  <TableRow key={call.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="text-center font-medium persian-numbers">{call.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-teal-100 text-teal-700 text-sm">{call.avatar}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{call.customerName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-bold persian-numbers text-lg">{call.score.toFixed(1)}</span>
                    </TableCell>
                    <TableCell className="text-center persian-numbers text-muted-foreground">{call.date}</TableCell>
                    <TableCell className="text-center persian-numbers text-muted-foreground">{call.duration}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={getStatusBadgeVariant(call.status)}>{call.status}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={getTypeBadgeVariant(call.type)}>{call.type}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="w-8 h-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(call)} className="gap-2">
                            <Eye className="w-4 h-4" />
                            مشاهده جزئیات
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleCallAction("تماس", call.customerName)}
                            className="gap-2"
                          >
                            <Phone className="w-4 h-4" />
                            تماس مجدد
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleCallAction("ایمیل", call.customerName)}
                            className="gap-2"
                          >
                            <Mail className="w-4 h-4" />
                            ایمیل
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleCallAction("پیام", call.customerName)}
                            className="gap-2"
                          >
                            <MessageSquare className="w-4 h-4" />
                            پیام
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4 p-4">
            {filteredCalls.map((call) => (
              <Card key={call.id} className="border border-border/50 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  {/* Header Row */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-teal-100 text-teal-700 text-sm">{call.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-base">{call.customerName}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-2xl font-bold persian-numbers text-teal-600">
                            {call.score.toFixed(1)}
                          </span>
                          <span className="text-xs text-muted-foreground">امتیاز</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm persian-numbers text-muted-foreground mb-1">{call.date}</div>
                      <Badge className="persian-numbers text-xs">#{call.id}</Badge>
                    </div>
                  </div>

                  {/* Call Details Row */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">مدت:</span>
                        <span className="text-sm font-medium persian-numbers">{call.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">نوع:</span>
                        <Badge variant={getTypeBadgeVariant(call.type)} className="text-xs">
                          {call.type}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">وضعیت:</span>
                      <Badge variant={getStatusBadgeVariant(call.status)} className="text-xs">
                        {call.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Action Buttons Row */}
                  <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(call)}
                        className="gap-1 text-xs"
                      >
                        <Eye className="w-3 h-3" />
                        جزئیات
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCallAction("تماس", call.customerName)}
                        className="gap-1 text-xs"
                      >
                        <Phone className="w-3 h-3" />
                        تماس
                      </Button>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="gap-1 text-xs">
                          <MoreHorizontal className="w-4 h-4" />
                          بیشتر
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleCallAction("ایمیل", call.customerName)}
                          className="gap-2"
                        >
                          <Mail className="w-4 h-4" />
                          ایمیل
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCallAction("پیام", call.customerName)} className="gap-2">
                          <MessageSquare className="w-4 h-4" />
                          پیام
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          نمایش {filteredCalls.length} مورد از {userCalls.length} مورد
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="gap-2"
          >
            <ChevronRight className="w-4 h-4" />
            قبلی
          </Button>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="w-8 h-8 p-0 persian-numbers"
              >
                {page}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={() => setCurrentPage(currentPage + 1)} className="gap-2">
            بعدی
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Call Analysis Modal */}
      <CallAnalysisModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        callData={
          selectedCall
            ? {
                id: selectedCall.id,
                customerName: selectedCall.customerName,
                date: selectedCall.date,
                time: "14:45",
                score: selectedCall.score,
                role: "مشتری",
                summary: selectedCall.summary,
                email: selectedCall.email,
                phone: selectedCall.phone,
                address: selectedCall.address,
              }
            : undefined
        }
      />
    </div>
  )
}
