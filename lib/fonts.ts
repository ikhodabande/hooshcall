import { Vazirmatn } from 'next/font/google';

// Define Vazirmatn font from Google Fonts
export const vazirmatn = Vazirmatn({
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-vazirmatn',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  adjustFontFallback: false,
});

// Define the IRANSans font from Google Fonts
export const iranSans = Vazirmatn({
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-iransans',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  adjustFontFallback: false,
});
