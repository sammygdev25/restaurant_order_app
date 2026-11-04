import React from 'react';
import OrderCard from './OrderCard';
import { EmptyState } from '../components/ui';
import type { Order } from '../types';

interface OrderListProps {
  orders: Order[];
}

export default function OrderList({ orders }: OrderListProps) {
  const safeOrders = Array.isArray(orders) ? orders : [];

  if (safeOrders.length === 0) {
    return (
      <EmptyState
        icon="package"
        title="No orders yet"
        text="Once you place an order for pickup or delivery, it will show up here."
      />
    );
  }

  return (
    <div className="ds-stack">
      {safeOrders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}