import { PageHeader, Button } from '../components/ui';
import { Icon } from '../components/icons';

interface StaffDashboardHeaderProps {
  userName?: string;
  onRefresh?: () => void;
}

export default function StaffDashboardHeader({ userName, onRefresh }: StaffDashboardHeaderProps) {
  const greeting = userName ? `Welcome back, ${userName}` : 'Welcome back';

  return (
    <PageHeader
      eyebrow="Staff Dashboard"
      title="Restaurant Operations Overview"
      subtitle={`${greeting} — here is what's happening across orders, reservations and the menu today.`}
      actions={
        <Button variant="primary" onClick={onRefresh}>
          <Icon name="refresh" size={16} />
          Refresh Data
        </Button>
      }
    />
  );
}