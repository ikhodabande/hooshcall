import { DashboardLayout } from '@/components/dashboard/layout';
import Settings from '@/components/dashboard/shop/settings/Settings';
import Loading from '@/components/ui/loading';
import { Suspense } from 'react';

type Props = {};

export default function page({}: Props) {
  return (
    <Suspense
      fallback={
        <>
          <Loading />
        </>
      }
    >
      <DashboardLayout>
        <Settings />
      </DashboardLayout>
    </Suspense>
  );
}
