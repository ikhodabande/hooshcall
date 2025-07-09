import type React from "react"
import type { Metadata } from "next"
import { Noto_Sans_Arabic } from "next/font/google"
import "./globals.css"

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-persian",
})

export const metadata: Metadata = {
  title: "داشبورد مرکز تماس هوشمند | HOOSH CALL",
  description: "سیستم مدیریت و تحلیل مرکز تماس هوشمند با قابلیت‌های پیشرفته مدیریت تماس، ایمیل و پیام‌رسانی",
  keywords: "مرکز تماس, هوشمند, داشبورد, مدیریت تماس, CRM, ایمیل, پیام‌رسانی",
  authors: [{ name: "HOOSH CALL Team" }],
  creator: "HOOSH CALL",
  publisher: "HOOSH CALL",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: "https://hooshcall.com",
    title: "داشبورد مرکز تماس هوشمند | HOOSH CALL",
    description: "سیستم مدیریت و تحلیل مرکز تماس هوشمند با قابلیت‌های پیشرفته",
    siteName: "HOOSH CALL",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "HOOSH CALL Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "داشبورد مرکز تماس هوشمند | HOOSH CALL",
    description: "سیستم مدیریت و تحلیل مرکز تماس هوشمند",
    images: ["/twitter-image.jpg"],
  },
  alternates: {
    canonical: "https://hooshcall.com",
    languages: {
      "fa-IR": "https://hooshcall.com",
      "en-US": "https://hooshcall.com/en",
    },
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#14b8a6",
  manifest: "/manifest.json",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fa" dir="rtl" className={notoSansArabic.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="HOOSH CALL" />
        <meta name="application-name" content="HOOSH CALL" />
        <meta name="msapplication-TileColor" content="#14b8a6" />
        <meta name="theme-color" content="#14b8a6" />
      </head>
      <body className={`${notoSansArabic.className} font-persian antialiased`}>{children}</body>
    </html>
  )
}
