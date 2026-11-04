import React, { useEffect, useState } from 'react';
import { useCart } from '../contexts/CartContext';
import CartHeader from '../components/CartHeader';
import CartItems from '../components/CartItems';
import CartSummary from '../components/CartSummary';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const DELIVERY_FEE = 4.99;

export default function CartPage() {
  const { items, subtotal, itemCount, loading, updateQuantity, removeItem, fetchCart } = useCart();
  const [error, setError] = useState<string>('');
  const [orderType] = useState<string>('delivery');

  useEffect(() => {
    loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCart = async () => {
    setError('');
    try {
      await fetchCart();
    } catch (err) {
      setError('Unable to load your cart. Please try again.');
    }
  };

  const handleUpdateQuantity = async (itemId: number, quantity: number) => {
    setError('');
    try {
      await updateQuantity(itemId, quantity);
    } catch (err) {
      setError('Could not update the quantity. Please try again.');
    }
  };

  const handleRemove = async (itemId: number) => {
    setError('');
    try {
      await removeItem(itemId);
    } catch (err) {
      setError('Could not remove the item. Please try again.');
    }
  };

  const deliveryFee = itemCount > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  if (loading && items.length === 0) {
    return (
      <div className="ds-container ds-section">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="ds-stack-lg">
      <CartHeader itemCount={itemCount} />

      {error && (
        <div className="ds-container">
          <ErrorMessage message={error} />
        </div>
      )}

      <CartItems items={items} onUpdateQuantity={handleUpdateQuantity} onRemove={handleRemove} />

      <CartSummary
        subtotal={subtotal}
        deliveryFee={deliveryFee}
        total={total}
        orderType={orderType}
      />
    </div>
  );
}