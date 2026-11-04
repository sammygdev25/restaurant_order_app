import { Link } from 'react-router-dom';
import type { Order } from '../types';
import { Card, CardBody, CardTitle, CardMeta, CardFooter, Badge, Price } from '../components/ui';
import { Icon } from '../components/icons';

interface OrderCardProps {
  order: Order;
}

const STATUS_TONE: Record<string, 'neutral' | 'primary' | 'soft' | 'success' | 'danger'> = {
  pending: 'neutral',
  paid: 'primary',
  preparing: 'soft',
  ready: 'primary',
  out_for_delivery: 'soft',
  completed: 'success',
  cancelled: 'danger',
};

const STATUS_LABEL: Record<string, string> = {
  pending: 'Pending',
  paid: 'Paid',
  preparing: 'Preparing',
  ready: 'Ready for Pickup',
  out_for_delivery: 'Out for Delivery',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function OrderCard({ order }: OrderCardProps) {
  const tone = STATUS_TONE[order.status] || 'neutral';
  const label = STATUS_LABEL[order.status] || order.status;

  return (
    <Card to={`/orders/${order.id}`}>
      <CardBody>
        <div className="ds-between">
          <CardTitle>Order #{order.id}</CardTitle>
          <Badge tone={tone}>{label}</Badge>
        </div>
        <CardMeta>
          <Icon name="calendar" size={14} /> {formatDate(order.created_at)}
          {' · '}
          <Icon name={order.order_type === 'delivery' ? 'truck' : 'package'} size={14} />{' '}
          {order.order_type === 'delivery' ? 'Delivery' : 'Pickup'}
        </CardMeta>
        <CardFooter>
          <Price value={order.total_amount} />
          <span className="ds-muted ds-small">
            <Icon name="arrow-right" size={14} /> View details
          </span>
        </CardFooter>
      </CardBody>
    </Card>
  );
}
