import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getOrderList, updateOrder } from '../api';
import type { Order } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import StaffOrdersManagementHeader from '../components/StaffOrdersManagementHeader';
import StaffOrdersManagementContent from '../components/StaffOrdersManagementContent';
import StaffOrdersManagementDetails from '../components/StaffOrdersManagementDetails';
import AdminOrderTable from '../components/AdminOrderTable';
import { Alert } from '../components/ui';

export default function StaffOrdersManagementPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [statusFeedback, setStatusFeedback] = useState<string>('');

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getOrderList();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleUpdateStatus = async (orderId: number, status: string) => {
    setStatusFeedback('Updating...');
    try {
      await updateOrder(orderId, { status });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
      setStatusFeedback('Status updated');
      setTimeout(() => setStatusFeedback(''), 2000);
    } catch (err) {
      setStatusFeedback('');
      setError('Failed to update order status.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const pendingOrders = orders.filter(
    (o) => o.status === 'pending' || o.status === 'paid' || o.status === 'preparing'
  );

  if (loading) {
    return (
      <div className="ds-container ds-section">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="ds-stack-lg">
      <StaffOrdersManagementHeader pendingCount={pendingOrders.length} />

      {error && (
        <div className="ds-container">
          <Alert tone="danger">{error}</Alert>
        </div>
      )}

      {statusFeedback && (
        <div className="ds-container">
          <Alert tone="success">{statusFeedback}</Alert>
        </div>
      )}

      <StaffOrdersManagementContent
        orders={orders}
        selectedOrderId={selectedOrderId}
        onSelectOrder={setSelectedOrderId}
      />

      <div className="ds-container">
        <AdminOrderTable orders={orders} onUpdateStatus={handleUpdateStatus} />
      </div>

      <StaffOrdersManagementDetails
        staffName={user?.username || user?.email || 'Staff Member'}
        staffEmail={user?.email || ''}
        role="Staff"
        totalOrders={orders.length}
        pendingOrders={pendingOrders.length}
      />
    </div>
  );
}