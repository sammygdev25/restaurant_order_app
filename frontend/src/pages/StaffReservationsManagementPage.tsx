import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getReservationList, updateReservation } from '../api';
import type { Reservation } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import StaffReservationsManagementHeader from '../components/StaffReservationsManagementHeader';
import StaffReservationsManagementContent from '../components/StaffReservationsManagementContent';
import StaffReservationsManagementDetails from '../components/StaffReservationsManagementDetails';

export default function StaffReservationsManagementPage() {
  useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selected, setSelected] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const loadReservations = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getReservationList();
      const list = Array.isArray(data) ? data : [];
      setReservations(list);
    } catch (err) {
      setError('Failed to load reservations. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  const handleSelect = (reservation: Reservation) => {
    setSelected(reservation);
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await updateReservation(id, { status });
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );
      setSelected((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
    } catch (err) {
      setError('Failed to update reservation status.');
    }
  };

  const pendingCount = reservations.filter((r) => r.status === 'pending').length;

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  return (
    <div className="ds-stack-lg">
      <StaffReservationsManagementHeader
        pendingCount={pendingCount}
        onRefresh={loadReservations}
      />
      {error && <ErrorMessage message={error} />}
      <StaffReservationsManagementContent
        reservations={reservations}
        onSelect={handleSelect}
      />
      <StaffReservationsManagementDetails
        reservation={selected}
        onUpdateStatus={handleUpdateStatus}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}