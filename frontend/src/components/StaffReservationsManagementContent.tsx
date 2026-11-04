import { Section, Card, CardBody, CardTitle, CardMeta, CardFooter, Badge, EmptyState, Button } from '../components/ui';
import { Icon } from '../components/icons';
import type { Reservation } from '../types';

interface StaffReservationsManagementContentProps {
  reservations: Reservation[];
  onSelect?: (reservation: Reservation) => void;
}

function statusTone(status: string): 'neutral' | 'primary' | 'soft' | 'success' | 'danger' {
  switch (status) {
    case 'confirmed':
      return 'success';
    case 'pending':
      return 'primary';
    case 'completed':
      return 'soft';
    case 'cancelled':
      return 'danger';
    default:
      return 'neutral';
  }
}

export default function StaffReservationsManagementContent({
  reservations,
  onSelect,
}: StaffReservationsManagementContentProps) {
  if (!reservations || reservations.length === 0) {
    return (
      <Section
        eyebrow="Reservations"
        title="Table bookings"
        subtitle="Every reservation made by guests will show up here."
      >
        <EmptyState
          icon="calendar"
          title="No reservations yet"
          text="Once guests start booking tables, their reservations will appear here for you to confirm or manage."
          action={<Button variant="primary" to="/dishes">Browse Menu</Button>}
        />
      </Section>
    );
  }

  return (
    <Section
      eyebrow="Reservations"
      title="Table bookings"
      subtitle="Review upcoming and past reservations placed by guests."
    >
      <div className="ds-grid ds-grid-md ds-grid-3">
        {(Array.isArray(reservations) ? reservations : []).map((reservation) => (
          <Card
            key={reservation.id}
            onClick={onSelect ? () => onSelect(reservation) : undefined}
          >
            <CardBody>
              <CardTitle>
                Party of {reservation.party_size}
              </CardTitle>
              <CardMeta>
                <Icon name="calendar" size={14} /> {reservation.date} at {reservation.time}
              </CardMeta>
              {reservation.notes && (
                <p className="ds-small ds-muted">{reservation.notes}</p>
              )}
            </CardBody>
            <CardFooter>
              <Badge tone={statusTone(reservation.status)}>
                {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
              </Badge>
              <Button
                variant="ghost"
                size="md"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  onSelect && onSelect(reservation);
                }}
              >
                View <Icon name="arrow-right" size={14} />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </Section>
  );
}