import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api, { getOrderList, getReservationList } from '../api';
import type { Order, Reservation } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import StaffDashboardHeader from '../components/StaffDashboardHeader';
import StaffDashboardStats from '../components/StaffDashboardStats';
import StaffDashboardRecent from '../components/StaffDashboardRecent';
import StaffDashboardActions from '../components/StaffDashboardActions';

export default function StaffDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Record<string, unknown> | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [recentReservations, setRecentReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [statsRes, orders, reservations] = await Promise.all([
        api.get('/admin/stats/'),
        getOrderList(),
        getReservationList(),
      ]);

      const statsData: Record<string, unknown> | null = statsRes?.data || null;
      setStats(statsData);

      const orderList: Order[] = Array.isArray(orders) ? orders : [];
      const sortedOrders = [...orderList].sort(
        (a: Order, b: Order) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setRecentOrders(sortedOrders.slice(0, 5));

      const reservationList: Reservation[] = Array.isArray(reservations) ? reservations : [];
      const sortedReservations = [...reservationList].sort(
        (a: Reservation, b: Reservation) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setRecentReservations(sortedReservations.slice(0, 5));
    } catch (err) {
      setError('Dashboard data will appear here as records are added.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="ds-stack-lg">
      <StaffDashboardHeader
        userName={typeof user?.first_name === 'string' ? user.first_name : user?.username}
        onRefresh={loadData}
      />

      {loading && <LoadingSpinner size="lg" />}
      {!loading && error && <ErrorMessage message={error} />}

      {!loading && !error && (
        <>
          <StaffDashboardStats stats={stats} />
          <StaffDashboardRecent
            recentOrders={recentOrders}
            recentReservations={recentReservations}
          />
          <StaffDashboardActions />
        </>
      )}
    </div>
  );
}
