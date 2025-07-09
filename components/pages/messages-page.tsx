"use client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Search, Plus } from "lucide-react"

export default function MessagesPage() {
  const conversations = [
    {
      id: 1,
      name: "احمد محمدی",
      lastMessage: "سلام، چطور می‌تونم کمکتون کنم؟",
      time: "۱۰:۳۰",
      unread: 2,
      online: true,
      initials: "ا.م",
    },
    {
      id: 2,
      name: "فاطمه احمدی",
      lastMessage: "ممنون از پاسخ سریعتون",
      time: "۰۹:۱۵",
      unread: 0,
      online: false,
      initials: "ف.ا",
    },
    {
      id: 3,
      name: "علی رضایی",
      lastMessage: "لطفاً اطلاعات بیشتری بدید",
      time: "دیروز",
      unread: 1,
      online: true,
      initials: "ع.ر",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">پیام ها</h1>
        <Button className="bg-teal-500 hover:bg-teal-600">
          <Plus className="w-4 h-4 ml-2" />
          گفتگوی جدید
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="جستجو در گفتگوها..." className="pr-10" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {conversations.map((conversation) => (
                <div key={conversation.id} className="p-4 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarFallback className="bg-teal-100 text-teal-700">{conversation.initials}</AvatarFallback>
                      </Avatar>
                      {conversation.online && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium truncate">{conversation.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">{conversation.time}</span>
                          {conversation.unread > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {conversation.unread}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>گفتگویی را انتخاب کنید تا شروع کنید</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
