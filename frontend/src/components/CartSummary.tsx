import { Card, CardBody, Price, Button, Stack } from '../components/ui';
import { Icon } from '../components/icons';

export interface CartSummaryProps {
  subtotal: number;
  deliveryFee: number;
  total: number;
  orderType: string;
}

export default function CartSummary({ subtotal, deliveryFee, total, orderType }: CartSummaryProps) {
  return (
    <Card>
      <CardBody>
        <Stack gap="md">
          <h3 className="ds-card-title">Order Summary</h3>

          <div className="ds-between">
            <span className="ds-muted">Subtotal</span>
            <Price value={subtotal} />
          </div>

          <div className="ds-between">
            <span className="ds-muted">
              {orderType === 'delivery' ? 'Delivery fee' : 'Service fee'}
            </span>
            {deliveryFee > 0 ? (
              <Price value={deliveryFee} />
            ) : (
              <span className="ds-small">Free</span>
            )}
          </div>

          <div className="ds-between">
            <span className="ds-stat">Total</span>
            <Price value={total} />
          </div>

          <Button variant="primary" size="lg" to="/checkout">
            <Icon name="credit-card" size={18} />
            Proceed to Checkout
          </Button>

          <p className="ds-small ds-muted">
            {orderType === 'delivery'
              ? 'Delivery times vary by distance and order volume.'
              : 'Pay now and pick up your order at the counter.'}
          </p>
        </Stack>
      </CardBody>
    </Card>
  );
}