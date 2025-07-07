import Customers from '@/components/dashboard/shop/customers/customers';
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
      <Customers />
    </Suspense>
  );
}
