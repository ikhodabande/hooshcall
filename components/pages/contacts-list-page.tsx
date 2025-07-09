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
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Phone,
  Mail,
  MessageSquare,
  Eye,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Contact {
  id: number
  name: string
  score: number
  date: string
  analysisStatus: "همه" | "تکمیل شده" | "در حال پردازش"
  role: "خریدار" | "مشتری" | "پشتیبانی"
  reportSummary: "دریافت"
  avatar: string
  email: string
  phone: string
  address: string
  summary: string
}

export default function ContactsListPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("همه")
  const [roleFilter, setRoleFilter] = useState("همه")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedDate, setSelectedDate] = useState("1404-04-11")
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const contacts: Contact[] = [
    {
      id: 1,
      name: "رضا افشار",
      score: 10.0,
      date: "1404-04-11",
      analysisStatus: "همه",
      role: "خریدار",
      reportSummary: "دریافت",
      avatar: "ر.ا",
      email: "reza.afshar@email.com",
      phone: "09123456789",
      address: "تهران، خیابان اصلی، پلاک ۱۲۳",
      summary: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است",
    },
    {
      id: 2,
      name: "نرگس سپاحی",
      score: 9.0,
      date: "1404-04-11",
      analysisStatus: "تکمیل شده",
      role: "مشتری",
      reportSummary: "دریافت",
      avatar: "ن.س",
      email: "narges.sepahi@email.com",
      phone: "09187654321",
      address: "تهران، خیابان ولیعصر، پلاک ۴۵۶",
      summary: "مشتری وفادار با سابقه خرید بالا و رضایت مندی مناسب از خدمات ارائه شده",
    },
    {
      id: 3,
      name: "پدرام شریفی",
      score: 8.8,
      date: "1404-04-11",
      analysisStatus: "در حال پردازش",
      role: "پشتیبانی",
      reportSummary: "دریافت",
      avatar: "پ.ش",
      email: "pedram.sharifi@email.com",
      phone: "09112233445",
      address: "تهران، خیابان انقلاب، پلاک ۷۸۹",
      summary: "کارشناس پشتیبانی با عملکرد مناسب و توانایی حل مسائل فنی مشتریان",
    },
    {
      id: 4,
      name: "دریا عظیمی",
      score: 7.4,
      date: "1404-04-11",
      analysisStatus: "همه",
      role: "خریدار",
      reportSummary: "دریافت",
      avatar: "د.ع",
      email: "darya.azimi@email.com",
      phone: "09198765432",
      address: "تهران، خیابان کریمخان، پلاک ۱۰۱",
      summary: "مشتری جدید با پتانسیل خرید بالا و علاقه به محصولات پریمیوم",
    },
    {
      id: 5,
      name: "نیما غلامی",
      score: 5.2,
      date: "1404-04-11",
      analysisStatus: "تکمیل شده",
      role: "خریدار",
      reportSummary: "دریافت",
      avatar: "ن.غ",
      email: "nima.gholami@email.com",
      phone: "09156789012",
      address: "تهران، خیابان فردوسی، پلاک ۲۰۲",
      summary: "مشتری با نیازهای خاص که نیاز به پیگیری بیشتر و ارائه راهکارهای متنوع دارد",
    },
    {
      id: 6,
      name: "فرهاد جوانی",
      score: 4.8,
      date: "1404-04-11",
      analysisStatus: "تکمیل شده",
      role: "پشتیبانی",
      reportSummary: "دریافت",
      avatar: "ف.ج",
      email: "farhad.javani@email.com",
      phone: "09134567890",
      address: "تهران، خیابان شریعتی، پلاک ۳۰۳",
      summary: "کارشناس پشتیبانی جدید که در حال یادگیری فرآیندها و بهبود مهارت‌های ارتباطی است",
    },
    {
      id: 7,
      name: "بهنام قربانی",
      score: 6.4,
      date: "1404-04-11",
      analysisStatus: "همه",
      role: "مشتری",
      reportSummary: "دریافت",
      avatar: "ب.ق",
      email: "behnam.ghorbani@email.com",
      phone: "09145678901",
      address: "تهران، خیابان پاسداران، پلاک ۴۰۴",
      summary: "مشتری منظم با خریدهای متوسط و رضایت قابل قبول از کیفیت خدمات",
    },
  ]

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "تکمیل شده":
        return "default"
      case "در حال پردازش":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "خریدار":
        return "default"
      case "مشتری":
        return "secondary"
      case "پشتیبانی":
        return "outline"
      default:
        return "outline"
    }
  }

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "همه" || contact.analysisStatus === statusFilter
    const matchesRole = roleFilter === "همه" || contact.role === roleFilter
    return matchesSearch && matchesStatus && matchesRole
  })

  const handleContactAction = (action: string, contactName: string) => {
    toast({
      title: "عملیات انجام شد",
      description: `${action} برای ${contactName} انجام شد.`,
      variant: "success",
    })
  }

  const handleViewDetails = (contact: Contact) => {
    setSelectedContact(contact)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedContact(null)
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
            <BreadcrumbLink href="#" className="text-muted-foreground">
              لیست تماس ها
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>آخرین تماس ها</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-center w-full lg:w-auto">
              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="جستجو تماس"
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
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 ml-2" />
                  <SelectValue placeholder="وضعیت" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="همه">همه</SelectItem>
                  <SelectItem value="تکمیل شده">تکمیل شده</SelectItem>
                  <SelectItem value="در حال پردازش">در حال پردازش</SelectItem>
                </SelectContent>
              </Select>

              {/* Role Filter */}
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="فیلتر" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="همه">همه</SelectItem>
                  <SelectItem value="خریدار">خریدار</SelectItem>
                  <SelectItem value="مشتری">مشتری</SelectItem>
                  <SelectItem value="پشتیبانی">پشتیبانی</SelectItem>
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
                  <TableHead className="text-right">نام</TableHead>
                  <TableHead className="text-center w-24">امتیاز</TableHead>
                  <TableHead className="text-center w-32">تاریخ</TableHead>
                  <TableHead className="text-center w-40">وضعیت تحلیل</TableHead>
                  <TableHead className="text-center w-32">نقش</TableHead>
                  <TableHead className="text-center w-40">خلاصه گزارش</TableHead>
                  <TableHead className="text-center w-16">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.map((contact) => (
                  <TableRow key={contact.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="text-center font-medium persian-numbers">{contact.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-teal-100 text-teal-700 text-sm">
                            {contact.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{contact.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-bold persian-numbers text-lg">{contact.score.toFixed(1)}</span>
                    </TableCell>
                    <TableCell className="text-center persian-numbers text-muted-foreground">{contact.date}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Badge variant={getStatusBadgeVariant(contact.analysisStatus)}>{contact.analysisStatus}</Badge>
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Badge variant={getRoleBadgeVariant(contact.role)}>{contact.role}</Badge>
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-sm">{contact.reportSummary}</span>
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="w-8 h-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(contact)} className="gap-2">
                            <Eye className="w-4 h-4" />
                            مشاهده جزئیات
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleContactAction("تماس", contact.name)} className="gap-2">
                            <Phone className="w-4 h-4" />
                            تماس
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleContactAction("ایمیل", contact.name)}
                            className="gap-2"
                          >
                            <Mail className="w-4 h-4" />
                            ایمیل
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleContactAction("پیام", contact.name)} className="gap-2">
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
            {filteredContacts.map((contact) => (
              <Card key={contact.id} className="border border-border/50 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  {/* Header Row */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-teal-100 text-teal-700 text-sm">{contact.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-base">{contact.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-2xl font-bold persian-numbers text-teal-600">
                            {contact.score.toFixed(1)}
                          </span>
                          <span className="text-xs text-muted-foreground">امتیاز</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm persian-numbers text-muted-foreground mb-1">{contact.date}</div>
                      <Badge className="persian-numbers text-xs">#{contact.id}</Badge>
                    </div>
                  </div>

                  {/* Status and Role Row */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">وضعیت:</span>
                        <Badge variant={getStatusBadgeVariant(contact.analysisStatus)} className="text-xs">
                          {contact.analysisStatus}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">نقش:</span>
                        <Badge variant={getRoleBadgeVariant(contact.role)} className="text-xs">
                          {contact.role}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">گزارش:</span>
                      <span className="text-sm font-medium">{contact.reportSummary}</span>
                    </div>
                  </div>

                  {/* Action Buttons Row */}
                  <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(contact)}
                        className="gap-1 text-xs"
                      >
                        <Eye className="w-3 h-3" />
                        جزئیات
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleContactAction("تماس", contact.name)}
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
                        <DropdownMenuItem onClick={() => handleContactAction("ایمیل", contact.name)} className="gap-2">
                          <Mail className="w-4 h-4" />
                          ایمیل
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleContactAction("پیام", contact.name)} className="gap-2">
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
          نمایش {filteredContacts.length} مورد از {contacts.length} مورد
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
          selectedContact
            ? {
                id: selectedContact.id,
                customerName: selectedContact.name,
                date: selectedContact.date,
                time: "14:45",
                score: selectedContact.score,
                role: selectedContact.role,
                summary: selectedContact.summary,
                email: selectedContact.email,
                phone: selectedContact.phone,
                address: selectedContact.address,
              }
            : undefined
        }
      />
    </div>
  )
}
