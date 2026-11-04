import { PageHeader, Button } from '../components/ui';
import { Icon } from '../components/icons';

interface StaffMenuManagementHeaderProps {
  dishCount?: number;
  loading?: boolean;
  onAddDish?: () => void;
}

export default function StaffMenuManagementHeader({ dishCount = 0, loading = false, onAddDish }: StaffMenuManagementHeaderProps) {
  const subtitle = loading
    ? 'Loading your menu...'
    : `${dishCount} dish${dishCount === 1 ? '' : 'es'} on the menu`;

  return (
    <PageHeader
      eyebrow="Staff Dashboard"
      title="Menu Management"
      subtitle={subtitle}
      actions={
        onAddDish ? (
          <Button variant="primary" onClick={onAddDish}>
            <Icon name="plus" size={16} />
            Add Dish
          </Button>
        ) : undefined
      }
    />
  );
}