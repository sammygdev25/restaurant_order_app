import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ReservationForm from '../components/ReservationForm';
import ReservationsHeader from '../components/ReservationsHeader';
import ReservationsContent from '../components/ReservationsContent';
import ReservationsDetails from '../components/ReservationsDetails';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { Alert } from '../components/ui';
import { getReservationList, createReservation, updateReservation } from '../api';
import type { Reservation } from '../types';

export default function ReservationsPage() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>('');

  const loadReservations = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getReservationList();
      setReservations(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Could not load your reservations. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  const showFeedback = (message: string) => {
    setFeedback(message);
    setTimeout(() => setFeedback(''), 2000);
  };

  const handleSubmit = async (data: { date: string; time: string; party_size: number; notes: string }) => {
    setFormLoading(true);
    setError('');
    try {
      await createReservation(data);
      await loadReservations();
      setShowForm(false);
      showFeedback('Reservation booked');
    } catch (err) {
      setError('Could not create the reservation. Please check the details and try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    setError('');
    try {
      await updateReservation(id, { status: 'cancelled' });
      await loadReservations();
      showFeedback('Reservation cancelled');
    } catch (err) {
      setError('Could not cancel the reservation. Please try again.');
    }
  };

  const totalReservations = reservations.length;
  const upcomingReservations = reservations.filter(
    (r) => r.status === 'pending' || r.status === 'confirmed'
  ).length;
  const cancelledReservations = reservations.filter((r) => r.status === 'cancelled').length;

  return (
    <div className="ds-stack-lg">
      <ReservationsHeader user={user} onNewReservation={() => setShowForm((prev) => !prev)} />

      {feedback && <Alert tone="success">{feedback}</Alert>}
      {error && <ErrorMessage message={error} />}

      {showForm && <ReservationForm onSubmit={handleSubmit} loading={formLoading} />}

      {loading ? (
        <LoadingSpinner size="lg" />
      ) : (
        <ReservationsContent reservations={reservations} onCancel={handleCancel} />
      )}

      <ReservationsDetails
        user={user}
        totalReservations={totalReservations}
        upcomingReservations={upcomingReservations}
        cancelledReservations={cancelledReservations}
      />
    </div>
  );
}