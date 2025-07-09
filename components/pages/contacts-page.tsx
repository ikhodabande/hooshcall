"use client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Phone, Mail, Search, Plus, MessageSquare } from "lucide-react"

export default function ContactsPage() {
  const contacts = [
    {
      id: 1,
      name: "احمد محمدی",
      phone: "۰۹۱۲۳۴۵۶۷۸۹",
      email: "ahmad@example.com",
      company: "شرکت تکنولوژی",
      initials: "ا.م",
    },
    {
      id: 2,
      name: "فاطمه احمدی",
      phone: "۰۹۸۷۶۵۴۳۲۱",
      email: "fateme@example.com",
      company: "مؤسسه مالی",
      initials: "ف.ا",
    },
    {
      id: 3,
      name: "علی رضایی",
      phone: "۰۹۱۱۲۲۳۳۴۴",
      email: "ali@example.com",
      company: "شرکت بازرگانی",
      initials: "ع.ر",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">مخاطبین</h1>
        <Button className="bg-teal-500 hover:bg-teal-600">
          <Plus className="w-4 h-4 ml-2" />
          مخاطب جدید
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder="جستجو در مخاطبین..." className="pr-10" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {contacts.map((contact) => (
              <Card key={contact.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback className="bg-teal-100 text-teal-700">{contact.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{contact.name}</h3>
                      <p className="text-sm text-gray-600">{contact.company}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {contact.phone}
                        </span>
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {contact.email}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Mail className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
