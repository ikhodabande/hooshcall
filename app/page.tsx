import LoginForm from '@/components/auth/login/login-form';
import Dashboard from '@/components/dashboard/Dashboard';
import { DashboardLayout } from '@/components/dashboard/layout';

export default function Home() {
  return (
    <DashboardLayout>
      <Dashboard />
    </DashboardLayout>
  );
}
