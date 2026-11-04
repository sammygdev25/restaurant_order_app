import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import type { CartItemType } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { createOrder } from '../api';
import CheckoutHeader from '../components/CheckoutHeader';
import CheckoutForm from '../components/CheckoutForm';
import CheckoutSummary from '../components/CheckoutSummary';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function CheckoutPage() {
  const { items, subtotal, loading: cartLoading, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [orderType, setOrderType] = useState('pickup');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const deliveryFee = orderType === 'delivery' ? 4.99 : 0;
  const total = subtotal + deliveryFee;

  const placeOrder = async () => {
    setError('');

    if (!isAuthenticated) {
      setError('Please log in to place an order.');
      return;
    }
    if (items.length === 0) {
      setError('Your cart is empty. Add some dishes before checking out.');
      return;
    }
    if (orderType === 'delivery' && !address.trim()) {
      setError('Please provide a delivery address.');
      return;
    }

    setSubmitting(true);
    try {
      const order = await createOrder({
        order_type: orderType,
        delivery_address: orderType === 'delivery' ? address : '',
        phone,
        subtotal,
        delivery_fee: deliveryFee,
        total_amount: total,
        items: (Array.isArray(items) ? items : []).map((item) => ({
          dish: item.dish?.id ?? item.dish,
          quantity: item.quantity,
          price: item.dish?.price ?? 0,
        })),
      } as any);

      await clearCart();
      const orderId = (order as any)?.id;
      navigate(orderId ? `/orders/${orderId}` : '/orders');
    } catch (err: any) {
      setError(err?.message || 'Could not place your order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await placeOrder();
  };

  const handleSummarySubmit = () => {
    placeOrder();
  };

  if (cartLoading) {
    return <LoadingSpinner />;
  }

  const summaryItems: CartItemType[] = Array.isArray(items) ? items : [];

  return (
    <div className="ds-stack-lg">
      <CheckoutHeader orderType={orderType} step={items.length === 0 ? 1 : 2} />

      {error && <ErrorMessage message={error} />}

      <div className="ds-grid-sidebar">
        <CheckoutForm
          orderType={orderType}
          onOrderTypeChange={setOrderType}
          address={address}
          onAddressChange={setAddress}
          phone={phone}
          onPhoneChange={setPhone}
          onSubmit={handleSubmit}
          loading={submitting}
        />

        <CheckoutSummary
          items={summaryItems}
          subtotal={subtotal}
          deliveryFee={deliveryFee}
          total={total}
          orderType={orderType}
          onSubmit={handleSummarySubmit}
          loading={submitting}
        />
      </div>
    </div>
  );
}
