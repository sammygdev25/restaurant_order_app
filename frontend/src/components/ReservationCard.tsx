import type { Reservation } from '../types';
import { Card, CardBody, CardTitle, CardMeta, CardFooter, Badge, Button, Stack } from '../components/ui';
import { Icon } from '../components/icons';

interface ReservationCardProps {
  reservation: Reservation;
  onCancel: (id: number) => void;
}

const statusTone: Record<string, 'neutral' | 'primary' | 'soft' | 'success' | 'danger'> = {
  pending: 'soft',
  confirmed: 'success',
  cancelled: 'danger',
  completed: 'neutral',
};

function formatDate(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(timeStr: string): string {
  const [hours, minutes] = timeStr.split(':');
  const h = parseInt(hours, 10);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${minutes} ${period}`;
}

function ReservationCard({ reservation, onCancel }: ReservationCardProps) {
  const canCancel = reservation.status === 'pending' || reservation.status === 'confirmed';

  return (
    <Card>
      <CardBody>
        <Stack gap="sm">
          <div className="ds-between">
            <CardTitle>Table for {reservation.party_size}</CardTitle>
            <Badge tone={statusTone[reservation.status] || 'neutral'}>
              {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
            </Badge>
          </div>
          <CardMeta>
            <Icon name="calendar" size={16} /> {formatDate(reservation.date)}
          </CardMeta>
          <CardMeta>
            <Icon name="clock" size={16} /> {formatTime(reservation.time)}
          </CardMeta>
          <CardMeta>
            <Icon name="users" size={16} /> Party of {reservation.party_size}
          </CardMeta>
          {reservation.notes ? (
            <p className="ds-muted ds-small">{reservation.notes}</p>
          ) : null}
        </Stack>
      </CardBody>
      {canCancel && (
        <CardFooter>
          <Button
            variant="danger"
            size="md"
            onClick={() => onCancel(reservation.id)}
          >
            <Icon name="close" size={16} /> Cancel Reservation
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

export default ReservationCard;