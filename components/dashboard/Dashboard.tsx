'use client';

import ProductComparisonChart from '@/components/dashboard/products/product-comparison-chart.tsx/ProductComparisonChart';
import ProductsList from '@/components/dashboard/products/products-list/ProductsList';
import SellingCharts from '@/components/dashboard/products/selling-charts/SellingCharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCcw } from 'lucide-react';
import moment from 'moment-jalaali';
import { useEffect, useState } from 'react';

// Client-side only wrapper component
function ClientOnly({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
}

// Dashboard Card Component
function DashboardCard({
  title,
  children,
  className = '',
  onRefresh,
  lastUpdated,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  onRefresh?: () => void;
  lastUpdated?: string;
}) {
  return (
    <Card
      className={`w-full xl:w-full md:h-[75vh] md:overflow-y-scroll no-scrollbar rounded-lg backdrop-blur-[60px] bg-secondary ${className}`}
    >
      <CardHeader className="bg-muted-foreground/20 h-10 px-3 flex items-center justify-center rounded-t-lg">
        <CardTitle className="text-base text-center items-center flex justify-between w-full px-0">
          <div className="w-1/3"></div>
          <div className="flex-1 text-sm md:text-base flex-shrink-0 w-1/3">{title}</div>
          <div className="w-1/3 flex text-[10px] justify-end gap-2 items-center">
            <div className="flex flex-col justify-start items-center">
              <p>آخرین بروزرسانی:</p>
              <p className="-mt-2 font-DanaNum">{lastUpdated ?? '...'}</p>
            </div>
            <RefreshCcw className="w-4 cursor-pointer" onClick={onRefresh} />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent
        className={title === 'فروش محصولات' ? 'w-full flex flex-col items-center p-3 ' : ''}
      >
        <ClientOnly>{children}</ClientOnly>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [refreshKeys, setRefreshKeys] = useState<number[]>([0, 0, 0, 0]);
  const [lastUpdatedTimes, setLastUpdatedTimes] = useState<string[]>(['', '', '', '']);

  const updateTime = () => moment().format('HH:mm');

  const handleRefresh = (index: number) => {
    const newKeys = [...refreshKeys];
    newKeys[index] = Date.now(); // Unique key to trigger refresh
    setRefreshKeys(newKeys);

    const newTimes = [...lastUpdatedTimes];
    newTimes[index] = updateTime();
    setLastUpdatedTimes(newTimes);
  };

  const dashboardCards = [
    {
      title: 'لیست سفارشات',
      content: <ProductsList refreshKey={refreshKeys[0]} />,
    },
    // {
    //   title: 'نمودار کالاهای پرفروش',
    //   content: (
    //     <>
    //       <ProductFunnelChart key={refreshKeys[1]} />
    //       <HorizontalFunnelChart key={refreshKeys[1]} />
    //     </>
    //   ),
    // },
    {
      title: 'نمودار سفارشات',
      content: <ProductComparisonChart key={refreshKeys[1]} />,
    },
    {
      title: 'فروش محصولات',
      content: <SellingCharts key={refreshKeys[2]} />,
    },
  ];

  return (
    <div className="grid w-full gap-4 grid-cols-1 md:grid-cols-2 xl:flex items-start mt-8">
      {dashboardCards.map((card, index) => (
        <DashboardCard
          key={index}
          title={card.title}
          onRefresh={() => handleRefresh(index)}
          lastUpdated={lastUpdatedTimes[index]}
        >
          {card.content}
        </DashboardCard>
      ))}
    </div>
  );
}
