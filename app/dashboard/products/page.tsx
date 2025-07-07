import { DashboardLayout } from '@/components/dashboard/layout';
import List from '@/components/dashboard/products/list/List';
import Products from '@/components/dashboard/products/Products';

type Props = {};

export default function page({}: Props) {
  return (
    <>
      <DashboardLayout>
        <Products/>
      </DashboardLayout>
    </>
  );
}
