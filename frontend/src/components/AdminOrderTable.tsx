import type { Order } from '../types';
import { Badge } from '../components/ui';

interface AdminOrderTableProps {
  orders: Order[];
  onUpdateStatus: (orderId: number, status: string) => void;
}

const STATUS_OPTIONS = [
  'pending',
  'paid',
  'preparing',
  'ready',
  'out_for_delivery',
  'completed',
  'cancelled',
];

function statusTone(status: string): 'neutral' | 'primary' | 'soft' | 'success' | 'danger' {
  switch (status) {
    case 'pending':
      return 'neutral';
    case 'paid':
    case 'preparing':
      return 'primary';
    case 'ready':
    case 'out_for_delivery':
      return 'soft';
    case 'completed':
      return 'success';
    case 'cancelled':
      return 'danger';
    default:
      return 'neutral';
  }
}

function formatStatusLabel(status: string): string {
  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function AdminOrderTable({ orders, onUpdateStatus }: AdminOrderTableProps) {
  const safeOrders = Array.isArray(orders) ? orders : [];

  if (safeOrders.length === 0) {
    return (
      <div className="ds-empty">
        <p>No orders found yet. Orders placed by customers will appear here.</p>
      </div>
    );
  }

  return (
    <div className="ds-table-wrap">
      <table className="ds-table">
        <thead>
          <tr>
            <th>Order #</th>
            <th>Type</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Subtotal</th>
            <th>Delivery Fee</th>
            <th>Total</th>
            <th>Status</th>
            <th>Update Status</th>
          </tr>
        </thead>
        <tbody>
          {safeOrders.map((order) => (
            <tr key={order.id}>
              <td>#{order.id}</td>
              <td>{order.order_type === 'delivery' ? 'Delivery' : 'Pickup'}</td>
              <td>{order.phone || '—'}</td>
              <td>{order.delivery_address || '—'}</td>
              <td>${Number(order.subtotal).toFixed(2)}</td>
              <td>${Number(order.delivery_fee).toFixed(2)}</td>
              <td>${Number(order.total_amount).toFixed(2)}</td>
              <td>
                <Badge tone={statusTone(order.status)}>{formatStatusLabel(order.status)}</Badge>
              </td>
              <td>
                <select
                  className="input"
                  value={order.status}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    onUpdateStatus(order.id, e.target.value)
                  }
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {formatStatusLabel(option)}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}