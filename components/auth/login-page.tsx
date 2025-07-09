"use client"
import { useState } from "react"
import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react"
import { useAppDispatch } from "../../hooks/redux"
import { login } from "../../lib/store"
import { toast } from "@/hooks/use-toast"

interface LoginPageProps {
  onLogin: (user: { username: string; role: "admin" | "user" }) => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const dispatch = useAppDispatch()

  // Demo credentials
  const demoCredentials = {
    admin: { username: "admin", password: "admin123", role: "admin" as const },
    user: { username: "user", password: "user123", role: "user" as const },
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check credentials
      const isAdmin =
        formData.username === demoCredentials.admin.username && formData.password === demoCredentials.admin.password

      const isUser =
        formData.username === demoCredentials.user.username && formData.password === demoCredentials.user.password

      if (isAdmin) {
        const user = { username: formData.username, role: "admin" as const }
        dispatch(login(user))
        onLogin(user)
        toast({
          title: "ورود موفق",
          description: "به عنوان مدیر سیستم وارد شدید.",
          variant: "success",
        })
      } else if (isUser) {
        const user = { username: formData.username, role: "user" as const }
        dispatch(login(user))
        onLogin(user)
        toast({
          title: "ورود موفق",
          description: "به عنوان کاربر وارد شدید.",
          variant: "success",
        })
      } else {
        setError("نام کاربری یا رمز عبور اشتباه است")
      }
    } catch (err) {
      setError("خطا در ورود به سیستم")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = (role: "admin" | "user") => {
    const credentials = demoCredentials[role]
    setFormData({
      username: credentials.username,
      password: credentials.password,
      rememberMe: false,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Title */}
        <div className="text-center space-y-4">
          <div className="bg-teal-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <div className="text-white font-bold text-xl">HC</div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">HOOSH CALL</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">مرکز تماس هوشمند</p>
          </div>
        </div>

        {/* Login Form */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl text-center">ورود به سیستم</CardTitle>
            <p className="text-sm text-muted-foreground text-center">برای دسترسی به داشبورد وارد شوید</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username">نام کاربری</Label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="نام کاربری خود را وارد کنید"
                    value={formData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    className="pr-10"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">رمز عبور</Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="رمز عبور خود را وارد کنید"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="pr-10 pl-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute left-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id="remember"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) => handleInputChange("rememberMe", checked as boolean)}
                />
                <Label htmlFor="remember" className="text-sm">
                  مرا به خاطر بسپار
                </Label>
              </div>

              {/* Login Button */}
              <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600" disabled={isLoading}>
                {isLoading ? "در حال ورود..." : "ورود"}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-muted-foreground text-center mb-4">حساب‌های آزمایشی:</p>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" size="sm" onClick={() => handleDemoLogin("admin")} className="text-xs">
                  مدیر سیستم
                  <br />
                  <span className="text-muted-foreground">admin / admin123</span>
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDemoLogin("user")} className="text-xs">
                  کاربر عادی
                  <br />
                  <span className="text-muted-foreground">user / user123</span>
                </Button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-center">
              <Button variant="link" className="text-sm text-teal-600 hover:text-teal-700">
                رمز عبور خود را فراموش کرده‌اید؟
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          © ۱۴۰۴ HOOSH CALL. تمامی حقوق محفوظ است.
        </div>
      </div>
    </div>
  )
}
