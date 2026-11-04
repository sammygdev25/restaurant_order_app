import { Section, Stack, Stat, Badge } from '../components/ui';
import { Icon } from '../components/icons';
import type { AuthUser } from '../contexts/AuthContext.tsx';

interface ReservationsDetailsProps {
  user: AuthUser | null;
  totalReservations: number;
  upcomingReservations: number;
  cancelledReservations: number;
}

export default function ReservationsDetails({
  user,
  totalReservations,
  upcomingReservations,
  cancelledReservations,
}: ReservationsDetailsProps) {
  return (
    <Section
      narrow
      eyebrow="Account"
      title="Your dining details"
      subtitle="A quick look at the contact info and history tied to your table bookings."
    >
      <div className="ds-card">
        <div className="ds-card-body">
          <Stack gap="md">
            <Stack gap="xs">
              <span className="ds-label">Booking under</span>
              <Stack gap="sm" align="center">
                <Icon name="user" size={18} />
                <span>{user?.username || user?.email || 'Guest diner'}</span>
              </Stack>
              {user?.email && <span className="ds-muted ds-small">{user.email}</span>}
            </Stack>

            <div className="ds-form-row">
              <Stat value={totalReservations} label="Total bookings" icon="calendar" />
              <Stat value={upcomingReservations} label="Upcoming" icon="clock" />
              <Stat value={cancelledReservations} label="Cancelled" icon="close" />
            </div>

            <Stack gap="sm">
              <span className="ds-label">Good to know</span>
              <Stack gap="sm" align="center">
                <Icon name="info" size={16} />
                <span className="ds-small ds-muted">
                  Tables are held for 15 minutes past your reserved time. Need a different
                  party size or time? Cancel below and book a new slot.
                </span>
              </Stack>
              {cancelledReservations > 0 && (
                <Badge tone="neutral">{cancelledReservations} cancelled this year</Badge>
              )}
            </Stack>
          </Stack>
        </div>
      </div>
    </Section>
  );
}