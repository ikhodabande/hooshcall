import Moeins from '@/components/dashboard/shop/customers/Moeins/Moeins';
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
      <Moeins />
    </Suspense>
  );
}
