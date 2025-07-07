'use client';

import VisitorsSetting from '@/components/dashboard/visitors/visitors-table/visitors-settings/VisitorsSetting';
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
        <VisitorsSetting />
      </Suspense>
    </>
  );
}
