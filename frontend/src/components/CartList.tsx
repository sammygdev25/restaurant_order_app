import React from 'react';
import CartItemRow from './CartItemRow';
import { CartItemType } from '../contexts/CartContext';
import { EmptyState, Button } from './ui';

interface CartListProps {
  items: CartItemType[];
  onUpdateQuantity: (itemId: number, quantity: number) => void;
  onRemove: (itemId: number) => void;
}

function CartList({ items, onUpdateQuantity, onRemove }: CartListProps) {
  const cartItems = Array.isArray(items) ? items : [];

  if (cartItems.length === 0) {
    return (
      <EmptyState
        icon="cart"
        title="Your cart is empty"
        text="Browse our menu and add some dishes to get started."
        action={
          <a href="/dishes">
            <Button variant="primary">Browse Dishes</Button>
          </a>
        }
      />
    );
  }

  return (
    <div className="ds-stack">
      {cartItems.map((item) => (
        <CartItemRow
          key={item.id}
          item={item}
          onUpdateQuantity={onUpdateQuantity}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}

export default CartList;
