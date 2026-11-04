import React from 'react';
import { PageHeader, Button } from '../components/ui';
import { Icon } from '../components/icons';

interface ReservationsHeaderUser {
  name?: string;
  username?: string;
  email?: string;
}

interface ReservationsHeaderProps {
  user: ReservationsHeaderUser | null;
  onNewReservation?: () => void;
}

export default function ReservationsHeader({ user, onNewReservation }: ReservationsHeaderProps) {
  const displayName = user?.name || user?.username || user?.email || 'Guest';

  return (
    <PageHeader
      eyebrow="Table Reservations"
      title="Your Reservations"
      subtitle={`Signed in as ${displayName} — book a table or manage your upcoming visits.`}
      actions={
        onNewReservation ? (
          <Button variant="primary" size="lg" onClick={onNewReservation}>
            <Icon name="calendar" size={18} />
            New Reservation
          </Button>
        ) : undefined
      }
    />
  );
}