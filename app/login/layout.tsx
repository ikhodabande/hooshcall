import { Metadata } from 'next';
import React from 'react';

type Props = {};

export const metadata: Metadata = {
  title: 'ورود به همگام',
  description: 'سامانه مدیریت یکپارچه',
  icons: {
    icon: '/favicon.ico',
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function layout({ children }: RootLayoutProps) {
  return <div>{children}</div>;
}
