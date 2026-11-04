import { Section, Cluster, Button } from '../components/ui';
import { Icon } from '../components/icons';

interface StaffDashboardActionsProps {
  section?: string;
  page?: string;
}

export default function StaffDashboardActions(props: StaffDashboardActionsProps) {
  return (
    <Section title="Quick Actions" tight>
      <Cluster gap="sm" justify="start">
        <Button variant="primary" to="/staff/menu">
          <Icon name="plus" size={16} />
          Add New Dish
        </Button>
        <Button variant="secondary" to="/staff/orders">
          <Icon name="package" size={16} />
          View Orders
        </Button>
        <Button variant="secondary" to="/staff/reservations">
          <Icon name="calendar" size={16} />
          Manage Reservations
        </Button>
        <Button variant="ghost" to="/staff/menu">
          <Icon name="list" size={16} />
          Edit Menu
        </Button>
        <Button variant="ghost" to="/dishes">
          <Icon name="external" size={16} />
          View Live Menu
        </Button>
      </Cluster>
    </Section>
  );
}