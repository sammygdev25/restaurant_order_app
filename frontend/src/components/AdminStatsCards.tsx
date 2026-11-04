import { Grid, Stat } from '../components/ui';
import type { IconName } from '../components/ui';

interface AdminStatsData {
  total_orders?: number;
  pending_orders?: number;
  total_revenue?: number;
  total_reservations?: number;
  pending_reservations?: number;
  total_dishes?: number;
  available_dishes?: number;
  todays_orders?: number;
  [key: string]: number | undefined;
}

interface AdminStatsCardsProps {
  stats: AdminStatsData;
}

function formatCurrencyValue(value: number | undefined): string {
  const amount = typeof value === 'number' ? value : 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

export default function AdminStatsCards({ stats }: AdminStatsCardsProps) {
  const safeStats = stats || {};

  const cards: { key: string; label: string; value: number | string; icon: IconName }[] = [
    {
      key: 'total_orders',
      label: 'Total Orders',
      value: safeStats.total_orders ?? 0,
      icon: 'package',
    },
    {
      key: 'pending_orders',
      label: 'Pending Orders',
      value: safeStats.pending_orders ?? 0,
      icon: 'clock',
    },
    {
      key: 'total_revenue',
      label: 'Total Revenue',
      value: formatCurrencyValue(safeStats.total_revenue),
      icon: 'dollar',
    },
    {
      key: 'total_reservations',
      label: 'Reservations',
      value: safeStats.total_reservations ?? 0,
      icon: 'calendar',
    },
    {
      key: 'pending_reservations',
      label: 'Pending Reservations',
      value: safeStats.pending_reservations ?? 0,
      icon: 'bell',
    },
    {
      key: 'available_dishes',
      label: 'Available Dishes',
      value: safeStats.available_dishes ?? 0,
      icon: 'book',
    },
  ];

  return (
    <Grid size="md" cols={3}>
      {(Array.isArray(cards) ? cards : []).map((card) => (
        <Stat
          key={card.key}
          value={card.value}
          label={card.label}
          icon={card.icon}
        />
      ))}
    </Grid>
  );
}
