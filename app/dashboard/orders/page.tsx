import { DashboardLayout } from '@/components/dashboard/layout';
import OrderStatus from '@/components/dashboard/orders/order-status/OrderStatus';

type Props = {};

export default function page({}: Props) {
  return (
    <>
      <DashboardLayout>
        {/* <Orders /> */}
        <OrderStatus />
      </DashboardLayout>
    </>
  );
}
