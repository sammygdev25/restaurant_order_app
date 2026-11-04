import React from 'react';
import { Card, CardBody, CardTitle, Media, Price, Button, Stack } from '../components/ui';
import { Icon } from '../components/icons';
import type { CartItem as CartItemType, Dish } from '../types';

interface CheckoutItem extends Omit<CartItemType, 'dish'> {
  dish: Dish;
}

interface CheckoutSummaryProps {
  items: CheckoutItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  orderType: string;
  onSubmit: () => void;
  loading: boolean;
}

export default function CheckoutSummary({
  items,
  subtotal,
  deliveryFee,
  total,
  orderType,
  onSubmit,
  loading,
}: CheckoutSummaryProps) {
  return (
    <Card className="ds-card">
      <CardBody>
        <CardTitle>Order Summary</CardTitle>
        <Stack gap="sm">
          {items.length === 0 ? (
            <p className="ds-muted ds-small">Your cart is empty.</p>
          ) : (
            (Array.isArray(items) ? items : []).map((item) => (
              <div key={item.id} className="ds-between">
                <Stack gap="xs" align="start">
                  <div className="ds-cluster">
                    <Media
                      src={item.dish?.image || ''}
                      alt={item.dish?.name || 'Dish'}
                      ratio="square"
                    />
                    <div>
                      <p className="ds-small">{item.dish?.name}</p>
                      <p className="ds-muted ds-small">Qty: {item.quantity}</p>
                    </div>
                  </div>
                </Stack>
                <Price value={(Number(item.dish?.price) || 0) * item.quantity} />
              </div>
            ))
          )}
        </Stack>

        <div className="ds-stack" style={{ marginTop: 'var(--space-md)' }}>
          <div className="ds-between">
            <span className="ds-small ds-muted">Subtotal</span>
            <Price value={subtotal} />
          </div>
          <div className="ds-between">
            <span className="ds-small ds-muted">
              {orderType === 'delivery' ? 'Delivery Fee' : 'Pickup Fee'}
            </span>
            <Price value={deliveryFee} />
          </div>
          <div className="ds-between">
            <span className="ds-small" style={{ fontWeight: 600 }}>
              Total
            </span>
            <Price value={total} />
          </div>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={onSubmit}
          disabled={loading || items.length === 0}
          style={{ width: '100%', marginTop: 'var(--space-md)' }}
        >
          {loading ? (
            <>
              <Icon name="refresh" size={16} /> Processing...
            </>
          ) : (
            <>
              <Icon name="credit-card" size={16} /> Place Order
            </>
          )}
        </Button>
      </CardBody>
    </Card>
  );
}
