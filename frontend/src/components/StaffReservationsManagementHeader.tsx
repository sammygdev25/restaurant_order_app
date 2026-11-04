import { PageHeader, Button } from '../components/ui';
import { Icon } from '../components/icons';
import { useAuth } from '../contexts/AuthContext';

interface StaffReservationsManagementHeaderProps {
  pendingCount?: number;
  onRefresh?: () => void;
}

export default function StaffReservationsManagementHeader({
  pendingCount,
  onRefresh,
}: StaffReservationsManagementHeaderProps) {
  const { user } = useAuth();
  const displayName = user?.first_name || user?.username || user?.email || 'Staff';

  return (
    <PageHeader
      eyebrow="Staff Dashboard"
      title="Reservations Management"
      subtitle={`Signed in as ${displayName} · Review and confirm table bookings for the dining room${
        typeof pendingCount === 'number' ? ` · ${pendingCount} pending` : ''
      }`}
      actions={
        onRefresh ? (
          <Button variant="secondary" onClick={onRefresh}>
            <Icon name="refresh" size={16} />
            Refresh
          </Button>
        ) : undefined
      }
    />
  );
}