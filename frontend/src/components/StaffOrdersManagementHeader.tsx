import { PageHeader, Badge } from '../components/ui';
import { Icon } from '../components/icons';
import { useAuth } from '../contexts/AuthContext';

interface StaffOrdersManagementHeaderProps {
  pendingCount?: number;
}

export default function StaffOrdersManagementHeader(props: StaffOrdersManagementHeaderProps) {
  const { pendingCount = 0 } = props;
  const { user } = useAuth();
  const displayName = user?.username || user?.email || 'Staff Member';

  return (
    <PageHeader
      eyebrow="Staff Dashboard"
      title="Orders Management"
      subtitle={`Signed in as ${displayName} — track and update incoming pickup and delivery orders in real time.`}
      actions={
        <div className="ds-cluster">
          <Badge tone={pendingCount > 0 ? 'primary' : 'neutral'}>
            <Icon name="package" size={16} />
            {pendingCount > 0 ? `${pendingCount} awaiting action` : 'All caught up'}
          </Badge>
        </div>
      }
    />
  );
}