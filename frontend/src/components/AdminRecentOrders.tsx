import React from 'react';
import { Link } from 'react-router-dom';
import { Badge, EmptyState, Icon } from './ui';
import type { Order } from '../types';
import { formatCurrency, formatDate } from '../utils';

interface AdminRecentOrdersProps {
  orders: Order[];
}

const statusTone = (status: string): 'neutral' | 'primary' | 'soft' | 'success' | 'danger' => {
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
};

const statusLabel = (status: string): string => {
  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

function AdminRecentOrders({ orders }: AdminRecentOrdersProps) {
  const list = Array.isArray(orders) ? orders : [];

  if (list.length === 0) {
    return (
      <EmptyState
        icon="package"
        title="No recent orders"
        text="New orders placed by customers will show up here as soon as they come in."
      />
    );
  }

  return (
    <div className="ds-table-wrap">
      <table className="ds-table">
        <thead>
          <tr>
            <th>Order</th>
            <th>Customer</th>
            <th>Type</th>
            <th>Status</th>
            <th>Total</th>
            <th>Placed</th>
          </tr>
        </thead>
        <tbody>
          {list.map((order) => (
            <tr key={order.id}>
              <td>
                <Link to={`/orders/${order.id}`} className="ds-card-title">
                  #{order.id}
                </Link>
              </td>
              <td>{`User #${order.user}`}</td>
              <td>
                <span className="ds-cluster" style={{ gap: 'var(--space-xs)' }}>
                  <Icon name={order.order_type === 'delivery' ? 'truck' : 'package'} size={16} />
                  {order.order_type === 'delivery' ? 'Delivery' : 'Pickup'}
                </span>
              </td>
              <td>
                <Badge tone={statusTone(order.status)}>{statusLabel(order.status)}</Badge>
              </td>
              <td>{formatCurrency(Number(order.total_amount))}</td>
              <td className="ds-muted">{formatDate(order.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminRecentOrders;
