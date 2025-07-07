import VisitorsCustomers from '@/components/dashboard/visitors/visitors-customers/VisitorsCustomers';
import { Suspense } from 'react';

type Props = {};

export default function page({}: Props) {
  return (
    <Suspense fallback={<div>در حال بارگذاری...</div>}>
      <VisitorsCustomers />
    </Suspense>
  );
}
