'use client';

import Checks from '@/components/dashboard/visitors/visitors-customers/checks/Checks';
import Loading from '@/components/ui/loading';
import { Suspense } from 'react';

type Props = {};

export default function page({}: Props) {
  return (
    <>
      <Suspense
        fallback={
          <div>
            <Loading />
          </div>
        }
      >
        <Checks />
      </Suspense>
    </>
  );
}
