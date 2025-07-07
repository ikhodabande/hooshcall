import ProductsEshantiun from '@/components/dashboard/products/products-items/products-eshantiun';
import { Suspense } from 'react';

type Props = {};

export default function page({}: Props) {
  return (
    <Suspense fallback={<div>در حال بارگذاری...</div>}>
      <ProductsEshantiun />
    </Suspense>
  );
}
