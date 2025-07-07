import { DashboardLayout } from '@/components/dashboard/layout';
import Shop from '@/components/dashboard/shop/shop';

type Props = {};

export default function page({}: Props) {
  return (
    <DashboardLayout>
      <Shop />
    </DashboardLayout>
  );
}
