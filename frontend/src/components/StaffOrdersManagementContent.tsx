import React from 'react';
import { Section, Card, CardBody, CardTitle, CardMeta, CardFooter, Badge, EmptyState, Button, Grid } from '../components/ui';
import { Icon } from '../components/icons';
import type { Order } from '../types';

interface StaffOrdersManagementContentProps {
  orders: Order[];
  selectedOrderId: number | null;
  onSelectOrder: (id: number) => void;
}

function statusTone(status: string): 'neutral' | 'primary' | 'soft' | 'success' | 'danger' {
  switch (status) {
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

function statusLabel(status: string): string {
  return status
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export default function StaffOrdersManagementContent({
  orders,
  selectedOrderId,
  onSelectOrder,
}: StaffOrdersManagementContentProps) {
  if (!orders || orders.length === 0) {
    return (
      <Section
        eyebrow="Orders"
        title="Kitchen queue"
        subtitle="Pickup and delivery orders placed through the dining room will appear here."
      >
        <EmptyState
          icon="package"
          title="No orders yet"
          text="Once diners start placing pickup or delivery orders, they will show up here ready for the kitchen."
          action={<Button variant="primary" to="/dishes">Browse menu</Button>}
        />
      </Section>
    );
  }

  return (
    <Section
      eyebrow="Orders"
      title="Kitchen queue"
      subtitle="Select an order to review its items and update its status."
    >
      <Grid size="md" cols={3}>
        {(Array.isArray(orders) ? orders : []).map((order) => (
          <Card
            key={order.id}
            onClick={() => onSelectOrder(order.id)}
            className={selectedOrderId === order.id ? 'ds-card-active' : undefined}
          >
            <CardBody>
              <CardTitle>Order #{order.id}</CardTitle>
              <CardMeta>
                <Icon name={order.order_type === 'delivery' ? 'truck' : 'package'} size={16} />
                {order.order_type === 'delivery' ? 'Delivery' : 'Pickup'}
              </CardMeta>
              <CardMeta>
                <Icon name="dollar" size={16} />
                ${Number(order.total_amount).toFixed(2)}
              </CardMeta>
              <CardMeta>
                <Icon name="clock" size={16} />
                {new Date(order.created_at).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </CardMeta>
            </CardBody>
            <CardFooter>
              <Badge tone={statusTone(order.status)}>{statusLabel(order.status)}</Badge>
            </CardFooter>
          </Card>
        ))}
      </Grid>
    </Section>
  );
}