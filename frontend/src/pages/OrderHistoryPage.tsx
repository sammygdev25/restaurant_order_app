import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getOrderList } from '../api';
import type { Order } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import OrderHistoryHeader from '../components/OrderHistoryHeader';
import OrderHistoryContent from '../components/OrderHistoryContent';
import OrderHistoryDetails from '../components/OrderHistoryDetails';

export default function OrderHistoryPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let mounted = true;
    const loadOrders = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getOrderList();
        if (mounted) {
          setOrders(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (mounted) {
          setError('Unable to load your order history right now. Please try again shortly.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    loadOrders();
    return () => {
      mounted = false;
    };
  }, []);

  const userName = user?.username || user?.email || '';

  if (loading) {
    return (
      <div className="ds-container ds-section">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="ds-stack-lg">
      <OrderHistoryHeader title="Your Order History" userName={userName} />
      {error && (
        <div className="ds-container">
          <ErrorMessage message={error} />
        </div>
      )}
      <OrderHistoryContent orders={orders} />
      <OrderHistoryDetails
        name={userName}
        email={user?.email || ''}
        phone=""
        totalOrders={orders.length}
      />
    </div>
  );
}