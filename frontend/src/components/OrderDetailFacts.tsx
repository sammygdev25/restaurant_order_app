import React from 'react';
import { Section, Grid, Badge } from '../components/ui';
import { Icon } from '../components/icons';
import type { Order } from '../types';

interface OrderDetailFactsProps {
  order: Order;
}

function formatStatus(status: string): string {
  return status
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function statusTone(status: string): 'neutral' | 'primary' | 'soft' | 'success' | 'danger' {
  switch (status) {
    case 'paid':
    case 'completed':
      return 'success';
    case 'cancelled':
      return 'danger';
    case 'preparing':
    case 'ready':
    case 'out_for_delivery':
      return 'primary';
    default:
      return 'neutral';
  }
}

export default function OrderDetailFacts({ order }: OrderDetailFactsProps) {
  const createdAt = order.created_at
    ? new Date(order.created_at).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : '';

  return (
    <Section eyebrow="Order Details" title="Order Facts">
      <Grid cols={2}>
        <div className="ds-field">
          <span className="ds-label">
            <Icon name="package" size={16} /> Order Type
          </span>
          <p className="ds-small">{order.order_type === 'delivery' ? 'Delivery' : 'Pickup'}</p>
        </div>

        <div className="ds-field">
          <span className="ds-label">
            <Icon name="info" size={16} /> Status
          </span>
          <p>
            <Badge tone={statusTone(order.status)}>{formatStatus(order.status)}</Badge>
          </p>
        </div>

        {order.order_type === 'delivery' && (
          <div className="ds-field">
            <span className="ds-label">
              <Icon name="map-pin" size={16} /> Delivery Address
            </span>
            <p className="ds-small">{order.delivery_address || 'Not provided'}</p>
          </div>
        )}

        <div className="ds-field">
          <span className="ds-label">
            <Icon name="phone" size={16} /> Phone
          </span>
          <p className="ds-small">{order.phone || 'Not provided'}</p>
        </div>

        <div className="ds-field">
          <span className="ds-label">
            <Icon name="dollar" size={16} /> Subtotal
          </span>
          <p className="ds-small">${Number(order.subtotal).toFixed(2)}</p>
        </div>

        <div className="ds-field">
          <span className="ds-label">
            <Icon name="truck" size={16} /> Delivery Fee
          </span>
          <p className="ds-small">${Number(order.delivery_fee).toFixed(2)}</p>
        </div>

        <div className="ds-field">
          <span className="ds-label">
            <Icon name="credit-card" size={16} /> Total Amount
          </span>
          <p className="ds-small">${Number(order.total_amount).toFixed(2)}</p>
        </div>

        <div className="ds-field">
          <span className="ds-label">
            <Icon name="calendar" size={16} /> Placed On
          </span>
          <p className="ds-small">{createdAt}</p>
        </div>

        {order.stripe_payment_intent_id && (
          <div className="ds-field">
            <span className="ds-label">
              <Icon name="shield" size={16} /> Payment Reference
            </span>
            <p className="ds-small">{order.stripe_payment_intent_id}</p>
          </div>
        )}
      </Grid>
    </Section>
  );
}