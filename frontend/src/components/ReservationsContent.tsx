import { Section, Grid, Card, CardBody, CardTitle, CardMeta, CardFooter, Badge, Button, EmptyState } from '../components/ui';
import { Icon } from '../components/icons';
import type { Reservation } from '../types';

interface ReservationsContentProps {
  reservations: Reservation[];
  onCancel: (id: number) => void;
}

function statusTone(status: string): 'neutral' | 'primary' | 'soft' | 'success' | 'danger' {
  switch (status) {
    case 'confirmed':
      return 'success';
    case 'cancelled':
      return 'danger';
    case 'completed':
      return 'primary';
    default:
      return 'soft';
  }
}

export default function ReservationsContent({ reservations, onCancel }: ReservationsContentProps) {
  const upcoming = Array.isArray(reservations) ? reservations : [];

  if (upcoming.length === 0) {
    return (
      <Section
        eyebrow="Your Table"
        title="Reservations"
        subtitle="Keep track of every booking at our restaurant"
      >
        <EmptyState
          icon="calendar"
          title="No reservations yet"
          text="Book a table and we'll keep your reservation details right here."
          action={
            <Button variant="primary" to="/dishes">
              Browse the menu
            </Button>
          }
        />
      </Section>
    );
  }

  return (
    <Section
      eyebrow="Your Table"
      title="Reservations"
      subtitle="Every booking you've made with us, past and upcoming"
    >
      <Grid size="md" cols={3}>
        {upcoming.map((reservation) => (
          <Card key={reservation.id}>
            <CardBody>
              <Badge tone={statusTone(reservation.status)}>{reservation.status}</Badge>
              <CardTitle>
                Table for {reservation.party_size}
              </CardTitle>
              <CardMeta>
                <Icon name="calendar" size={16} /> {reservation.date}
              </CardMeta>
              <CardMeta>
                <Icon name="clock" size={16} /> {reservation.time}
              </CardMeta>
              {reservation.notes ? (
                <CardMeta>
                  <Icon name="message" size={16} /> {reservation.notes}
                </CardMeta>
              ) : null}
            </CardBody>
            <CardFooter>
              {reservation.status === 'pending' || reservation.status === 'confirmed' ? (
                <Button variant="danger" size="md" onClick={() => onCancel(reservation.id)}>
                  Cancel reservation
                </Button>
              ) : (
                <span className="ds-muted ds-small">No actions available</span>
              )}
            </CardFooter>
          </Card>
        ))}
      </Grid>
    </Section>
  );
}