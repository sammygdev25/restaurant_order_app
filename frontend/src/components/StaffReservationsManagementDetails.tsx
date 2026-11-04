import { Section, Badge, Button, EmptyState } from '../components/ui';
import { Icon } from '../components/icons';
import type { Reservation } from '../types';

interface StaffReservationsManagementDetailsProps {
  reservation: Reservation | null;
  onUpdateStatus: (id: number, status: string) => void;
  onClose?: () => void;
}

const STATUS_TONE: Record<string, 'neutral' | 'primary' | 'soft' | 'success' | 'danger'> = {
  pending: 'soft',
  confirmed: 'primary',
  completed: 'success',
  cancelled: 'danger',
};

export default function StaffReservationsManagementDetails({
  reservation,
  onUpdateStatus,
  onClose,
}: StaffReservationsManagementDetailsProps) {
  if (!reservation) {
    return (
      <Section title="Reservation details" tight narrow>
        <EmptyState
          icon="calendar"
          title="No reservation selected"
          text="Pick a booking from the table to see its party size, time slot and notes here."
        />
      </Section>
    );
  }

  return (
    <Section title="Reservation details" tight narrow>
      <div className="ds-form">
        <div className="ds-field">
          <span className="ds-label">Guest</span>
          <p>{`Guest #${reservation.user}`}</p>
        </div>

        <div className="ds-form-row">
          <div className="ds-field">
            <span className="ds-label">Date</span>
            <p>{reservation.date}</p>
          </div>
          <div className="ds-field">
            <span className="ds-label">Time</span>
            <p>{reservation.time}</p>
          </div>
        </div>

        <div className="ds-form-row">
          <div className="ds-field">
            <span className="ds-label">Party size</span>
            <p>
              <Icon name="users" size={16} /> {reservation.party_size} guests
            </p>
          </div>
          <div className="ds-field">
            <span className="ds-label">Status</span>
            <p>
              <Badge tone={STATUS_TONE[reservation.status] || 'neutral'}>{reservation.status}</Badge>
            </p>
          </div>
        </div>

        {reservation.notes ? (
          <div className="ds-field">
            <span className="ds-label">Notes</span>
            <p className="ds-muted">{reservation.notes}</p>
          </div>
        ) : null}

        <div className="ds-form-actions">
          {reservation.status === 'pending' && (
            <Button variant="primary" onClick={() => onUpdateStatus(reservation.id, 'confirmed')}>
              <Icon name="check" size={16} /> Confirm table
            </Button>
          )}
          {reservation.status === 'confirmed' && (
            <Button variant="primary" onClick={() => onUpdateStatus(reservation.id, 'completed')}>
              <Icon name="check" size={16} /> Mark seated &amp; done
            </Button>
          )}
          {reservation.status !== 'cancelled' && reservation.status !== 'completed' && (
            <Button variant="danger" onClick={() => onUpdateStatus(reservation.id, 'cancelled')}>
              <Icon name="close" size={16} /> Cancel reservation
            </Button>
          )}
          {onClose && (
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>
    </Section>
  );
}
