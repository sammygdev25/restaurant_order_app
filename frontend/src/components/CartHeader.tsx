import React from 'react';
import { PageHeader, Badge } from '../components/ui';

interface CartHeaderProps {
  itemCount: number;
}

export default function CartHeader({ itemCount }: CartHeaderProps) {
  const subtitle =
    itemCount > 0
      ? `${itemCount} ${itemCount === 1 ? 'dish' : 'dishes'} ready for checkout`
      : 'Your cart is currently empty';

  return (
    <PageHeader
      eyebrow="Your Order"
      title="Shopping Cart"
      subtitle={subtitle}
      actions={<Badge tone="primary">{itemCount} {itemCount === 1 ? 'item' : 'items'}</Badge>}
    />
  );
}