import AnbarakSetting from '@/components/dashboard/visitors/visitors-table/anbarak-setting/AnbarakSetting';
import { Suspense } from 'react';

type Props = {};

export default function page({}: Props) {
  return (
    <Suspense fallback={<div>در حال بارگذاری...</div>}>
      <AnbarakSetting />
    </Suspense>
  );
}
