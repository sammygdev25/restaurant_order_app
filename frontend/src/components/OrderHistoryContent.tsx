import React from 'react';
import { Link } from 'react-router-dom';
import { Section, Card, Badge, EmptyState, Price } from '../components/ui';
import { Icon } from '../components/icons';
import type { Order } from '../types';

interface OrderHistoryContentProps {
  orders: Order[];
}

const STATUS_TONE: Record<string, 'neutral' | 'primary' | 'soft' | 'success' | 'danger'> = {
  pending: 'neutral',
  paid: 'primary',
  preparing: 'soft',
  ready: 'soft',
  out_for_delivery: 'primary',
  completed: 'success',
  cancelled: 'danger',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  paid: 'Paid',
  preparing: 'Preparing',
  ready: 'Ready',
  out_for_delivery: 'Out for Delivery',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export default function OrderHistoryContent({ orders }: OrderHistoryContentProps) {
  if (!orders || orders.length === 0) {
    return (
      <Section title="Your orders" eyebrow="Order history">
        <EmptyState
          icon="package"
          title="No orders yet"
          text="Once you place an order for pickup or delivery, it will show up here so you can track its status and reorder your favorites."
          action={
            <Link to="/dishes" className="ds-btn-primary">
              Browse the menu
            </Link>
          }
        />
      </Section>
    );
  }

  return (
    <Section title="Your orders" eyebrow="Order history">
      <div className="ds-table-wrap">
        <table className="ds-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Date</th>
              <th>Type</th>
              <th>Status</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {(Array.isArray(orders) ? orders : []).map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                <td>{order.order_type === 'delivery' ? 'Delivery' : 'Pickup'}</td>
                <td>
                  <Badge tone={STATUS_TONE[order.status] || 'neutral'}>
                    {STATUS_LABELS[order.status] || order.status}
                  </Badge>
                </td>
                <td>
                  <Price value={order.total_amount} />
                </td>
                <td>
                  <Link to={`/orders/${order.id}`} className="ds-btn-ghost">
                    View details <Icon name="arrow-right" size={16} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
