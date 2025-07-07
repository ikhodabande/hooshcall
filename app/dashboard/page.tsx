import Dashboard from '@/components/dashboard/Dashboard';
import { DashboardLayout } from '@/components/dashboard/layout';

type Props = {};

export default function page({}: Props) {
  return (
    <>
      <DashboardLayout>
        <Dashboard />
      </DashboardLayout>
    </>
  );
}
