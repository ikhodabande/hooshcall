import { DashboardLayout } from '@/components/dashboard/layout';
import Visitors from '@/components/dashboard/visitors/Visitors';
import VisitorsTable from '@/components/dashboard/visitors/visitors-table/VisitorsTable';

type Props = {};

export default function page({}: Props) {
  return (
    <>
      <DashboardLayout>
        <VisitorsTable />
      </DashboardLayout>
    </>
  );
}
