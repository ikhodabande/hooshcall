import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { ReduxProvider } from '@/providers/redux-provider';
import '@fontsource/vazirmatn';
import '@fontsource/vazirmatn/400.css';
import 'leaflet/dist/leaflet.css';
import { Metadata } from 'next';
import { Vazirmatn } from 'next/font/google';
import '../styles/fontiran.css';
import './globals.css';

const vazirmatn = Vazirmatn({
  subsets: ['arabic'],
  variable: '--font-vazirmatn',
});

export const metadata: Metadata = {
  title: 'هوشکال',
  description: 'سامانه پاسخگویی هوشمند',
  icons: {
    icon: '/favicon.ico',
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body  className={vazirmatn.className}>
        <ReduxProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster />
            {children}
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
