import axios, { type AxiosResponse, type AxiosError } from "axios"
import { toast } from "@/hooks/use-toast"

// Create axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://api.hooshcall.com/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Accept-Language": "fa-IR",
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem("auth_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Add request timestamp
    config.metadata = { startTime: new Date() }

    return config
  },
  (error) => {
    toast({
      variant: "destructive",
      title: "خطا در ارسال درخواست",
      description: "مشکلی در ارسال درخواست به سرور رخ داده است.",
    })
    return Promise.reject(error)
  },
)

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Calculate request duration
    const endTime = new Date()
    const startTime = response.config.metadata?.startTime
    if (startTime) {
      const duration = endTime.getTime() - startTime.getTime()
      console.log(`Request to ${response.config.url} took ${duration}ms`)
    }

    // Show success toast for certain operations
    if (response.config.method !== "get" && response.status >= 200 && response.status < 300) {
      const successMessages: Record<string, string> = {
        post: "اطلاعات با موفقیت ذخیره شد",
        put: "اطلاعات با موفقیت به‌روزرسانی شد",
        patch: "اطلاعات با موفقیت به‌روزرسانی شد",
        delete: "اطلاعات با موفقیت حذف شد",
      }

      const method = response.config.method?.toLowerCase()
      if (method && successMessages[method]) {
        toast({
          variant: "success",
          title: "عملیات موفق",
          description: successMessages[method],
        })
      }
    }

    return response
  },
  (error: AxiosError) => {
    const { response, request, message } = error

    // Handle different error scenarios
    if (response) {
      // Server responded with error status
      const status = response.status
      const data = response.data as any

      switch (status) {
        case 400:
          toast({
            variant: "destructive",
            title: "خطا در اطلاعات ورودی",
            description: data?.message || "اطلاعات ارسالی نامعتبر است.",
          })
          break
        case 401:
          toast({
            variant: "destructive",
            title: "خطا در احراز هویت",
            description: "لطفاً مجدداً وارد حساب کاربری خود شوید.",
          })
          // Redirect to login or clear auth token
          localStorage.removeItem("auth_token")
          window.location.href = "/login"
          break
        case 403:
          toast({
            variant: "destructive",
            title: "عدم دسترسی",
            description: "شما مجوز دسترسی به این بخش را ندارید.",
          })
          break
        case 404:
          toast({
            variant: "destructive",
            title: "یافت نشد",
            description: "اطلاعات درخواستی یافت نشد.",
          })
          break
        case 422:
          toast({
            variant: "destructive",
            title: "خطا در اعتبارسنجی",
            description: data?.message || "اطلاعات ارسالی نامعتبر است.",
          })
          break
        case 429:
          toast({
            variant: "warning",
            title: "تعداد درخواست زیاد",
            description: "لطفاً کمی صبر کنید و مجدداً تلاش کنید.",
          })
          break
        case 500:
          toast({
            variant: "destructive",
            title: "خطا در سرور",
            description: "مشکلی در سرور رخ داده است. لطفاً بعداً تلاش کنید.",
          })
          break
        default:
          toast({
            variant: "destructive",
            title: "خطای غیرمنتظره",
            description: data?.message || "خطای غیرمنتظره‌ای رخ داده است.",
          })
      }
    } else if (request) {
      // Request was made but no response received
      toast({
        variant: "destructive",
        title: "خطا در اتصال",
        description: "امکان اتصال به سرور وجود ندارد. اتصال اینترنت خود را بررسی کنید.",
      })
    } else {
      // Something else happened
      toast({
        variant: "destructive",
        title: "خطای غیرمنتظره",
        description: message || "خطای غیرمنتظره‌ای رخ داده است.",
      })
    }

    return Promise.reject(error)
  },
)

// API methods
export const apiClient = {
  // GET request
  get: <T = any>(url: string, config = {}) => api.get<T>(url, config),

  // POST request
  post: <T = any>(url: string, data = {}, config = {}) => api.post<T>(url, data, config),

  // PUT request
  put: <T = any>(url: string, data = {}, config = {}) => api.put<T>(url, data, config),

  // PATCH request
  patch: <T = any>(url: string, data = {}, config = {}) => api.patch<T>(url, data, config),

  // DELETE request
  delete: <T = any>(url: string, config = {}) => api.delete<T>(url, config),

  // Upload file
  upload: <T = any>(url: string, file: File, onProgress?: (progress: number) => void) => {
    const formData = new FormData()
    formData.append("file", file)

    return api.post<T>(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(progress)
        }
      },
    })
  },
}

// Specific API endpoints
export const dashboardAPI = {
  getStats: () => apiClient.get("/dashboard/stats"),
  getCalls: (params?: any) => apiClient.get("/calls", { params }),
  getEmails: (params?: any) => apiClient.get("/emails", { params }),
  getContacts: (params?: any) => apiClient.get("/contacts", { params }),
  getMessages: (params?: any) => apiClient.get("/messages", { params }),
}

export const userAPI = {
  getProfile: () => apiClient.get("/user/profile"),
  updateProfile: (data: any) => apiClient.put("/user/profile", data),
  changePassword: (data: any) => apiClient.post("/user/change-password", data),
  uploadAvatar: (file: File) => apiClient.upload("/user/avatar", file),
}

export const authAPI = {
  login: (credentials: any) => apiClient.post("/auth/login", credentials),
  logout: () => apiClient.post("/auth/logout"),
  refresh: () => apiClient.post("/auth/refresh"),
  forgotPassword: (email: string) => apiClient.post("/auth/forgot-password", { email }),
}

export default api
