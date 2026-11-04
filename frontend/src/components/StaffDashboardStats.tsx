import { Grid, Stat } from '../components/ui';

interface DashboardStats {
  totalOrders?: number;
  pendingOrders?: number;
  totalReservations?: number;
  totalRevenue?: number;
}

interface StaffDashboardStatsProps {
  stats: DashboardStats | null;
}

export default function StaffDashboardStats({ stats }: StaffDashboardStatsProps) {
  const totalOrders = stats?.totalOrders ?? 0;
  const pendingOrders = stats?.pendingOrders ?? 0;
  const totalReservations = stats?.totalReservations ?? 0;
  const totalRevenue = stats?.totalRevenue ?? 0;

  return (
    <div className="ds-section">
      <Grid size="sm" cols={4}>
        <Stat
          value={totalOrders}
          label="Total Orders"
          icon="package"
        />
        <Stat
          value={pendingOrders}
          label="Pending Orders"
          icon="clock"
        />
        <Stat
          value={totalReservations}
          label="Reservations"
          icon="calendar"
        />
        <Stat
          value={`$${Number(totalRevenue || 0).toFixed(2)}`}
          label="Revenue"
          icon="dollar"
        />
      </Grid>
    </div>
  );
}
