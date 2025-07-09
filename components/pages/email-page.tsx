"use client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Search, Star, Archive, Trash2 } from "lucide-react"

export default function EmailPage() {
  const emails = [
    {
      id: 1,
      sender: "احمد محمدی",
      subject: "گزارش فروش ماهانه",
      preview: "گزارش فروش ماه جاری آماده شده است...",
      time: "۱۰:۳۰",
      unread: true,
      starred: true,
    },
    {
      id: 2,
      sender: "فاطمه احمدی",
      subject: "جلسه فردا",
      preview: "جلسه فردا ساعت ۹ صبح برگزار خواهد شد...",
      time: "۰۹:۱۵",
      unread: false,
      starred: false,
    },
    {
      id: 3,
      sender: "علی رضایی",
      subject: "پیگیری پروژه",
      preview: "وضعیت پروژه جدید چگونه است؟",
      time: "دیروز",
      unread: true,
      starred: false,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">صندوق پستی</h1>
        <Button className="bg-teal-500 hover:bg-teal-600">
          <Mail className="w-4 h-4 ml-2" />
          ایمیل جدید
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="جستجو در ایمیل ها..." className="pr-10" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Archive className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {emails.map((email) => (
              <div key={email.id} className={`p-4 hover:bg-gray-50 cursor-pointer ${email.unread ? "bg-blue-50" : ""}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex items-center gap-2">
                      {email.starred && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                      {email.unread && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`font-medium ${email.unread ? "font-bold" : ""}`}>{email.sender}</span>
                        <span className="text-sm text-gray-500">{email.time}</span>
                      </div>
                      <div className={`text-sm ${email.unread ? "font-semibold" : "text-gray-600"}`}>
                        {email.subject}
                      </div>
                      <div className="text-sm text-gray-500 truncate">{email.preview}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
