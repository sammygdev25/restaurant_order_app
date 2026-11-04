import React from 'react';
import ReservationCard from './ReservationCard';
import { EmptyState } from '../components/ui';
import type { Reservation } from '../types';

interface ReservationListProps {
  reservations: Reservation[];
  onCancel: (id: number) => void;
}

export default function ReservationList({ reservations, onCancel }: ReservationListProps) {
  const list = Array.isArray(reservations) ? reservations : [];

  if (list.length === 0) {
    return (
      <EmptyState
        icon="calendar"
        title="No reservations yet"
        text="Book a table and it will show up here with its confirmation status."
      />
    );
  }

  return (
    <div className="ds-stack">
      {list.map((reservation) => (
        <ReservationCard
          key={reservation.id}
          reservation={reservation}
          onCancel={onCancel}
        />
      ))}
    </div>
  );
}