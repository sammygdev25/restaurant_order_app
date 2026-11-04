import type { Reservation } from '../types';
import { Badge, Button } from './ui';
import { Icon } from './icons';

interface AdminReservationTableProps {
  reservations: Reservation[];
  onUpdateStatus: (id: number, status: string) => void;
}

const STATUS_OPTIONS: Array<{ value: Reservation['status']; label: string }> = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'completed', label: 'Completed' },
];

function toneForStatus(status: string): 'neutral' | 'primary' | 'soft' | 'success' | 'danger' {
  switch (status) {
    case 'confirmed':
      return 'success';
    case 'pending':
      return 'soft';
    case 'cancelled':
      return 'danger';
    case 'completed':
      return 'primary';
    default:
      return 'neutral';
  }
}

export default function AdminReservationTable({ reservations, onUpdateStatus }: AdminReservationTableProps) {
  if (!Array.isArray(reservations) || reservations.length === 0) {
    return (
      <div className="ds-empty">
        <Icon name="calendar" size={32} />
        <h3>No reservations yet</h3>
        <p className="ds-muted">Table bookings will appear here once guests reserve a spot.</p>
      </div>
    );
  }

  return (
    <div className="ds-table-wrap">
      <table className="ds-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Guest</th>
            <th>Date</th>
            <th>Time</th>
            <th>Party Size</th>
            <th>Notes</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => (
            <tr key={reservation.id}>
              <td>#{reservation.id}</td>
              <td>{reservation.user || '—'}</td>
              <td>{reservation.date}</td>
              <td>{reservation.time}</td>
              <td>{reservation.party_size}</td>
              <td className="ds-small">{reservation.notes || '—'}</td>
              <td>
                <Badge tone={toneForStatus(reservation.status)}>
                  {reservation.status.replace(/_/g, ' ')}
                </Badge>
              </td>
              <td>
                <div className="ds-cluster">
                  {STATUS_OPTIONS.filter((opt) => opt.value !== reservation.status).map((opt) => (
                    <Button
                      key={opt.value}
                      variant="ghost"
                      size="md"
                      onClick={() => onUpdateStatus(reservation.id, opt.value)}
                    >
                      {opt.label}
                    </Button>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
