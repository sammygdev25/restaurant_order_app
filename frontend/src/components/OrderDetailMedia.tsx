import { Section, Split, Media, Badge, Price, Button, CardMeta } from '../components/ui';
import { Icon } from '../components/icons';
import type { Order } from '../types';

interface OrderDetailMediaProps {
  order: Order;
  onReorder?: () => void;
}

const STATUS_TONE: Record<string, 'neutral' | 'primary' | 'soft' | 'success' | 'danger'> = {
  pending: 'neutral',
  paid: 'primary',
  preparing: 'soft',
  ready: 'soft',
  out_for_delivery: 'primary',
  completed: 'success',
  cancelled: 'danger',
};

const STATUS_LABEL: Record<string, string> = {
  pending: 'Pending',
  paid: 'Paid',
  preparing: 'Preparing',
  ready: 'Ready',
  out_for_delivery: 'Out for Delivery',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export default function OrderDetailMedia({ order, onReorder }: OrderDetailMediaProps) {
  const createdAt = order?.created_at
    ? new Date(order.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  const typeLabel = order?.order_type === 'delivery' ? 'Delivery Order' : 'Pickup Order';

  return (
    <Section tight>
      <Split>
        <Media
          src=""
          alt={`Order #${order?.id} from the kitchen`}
          ratio="wide"
          badge={order?.order_type === 'delivery' ? 'Delivery' : 'Pickup'}
        />
        <div className="ds-stack">
          <span className="ds-eyebrow">
            <Icon name="package" size={16} /> {typeLabel}
          </span>
          <h1 className="ds-card-title">Order #{order?.id}</h1>
          <CardMeta>
            Placed {createdAt}
            {order?.order_type === 'delivery' && order?.delivery_address
              ? ` · Delivering to ${order.delivery_address}`
              : ' · Ready for pickup'}
          </CardMeta>
          <div className="ds-cluster">
            <Badge tone={STATUS_TONE[order?.status] || 'neutral'}>
              {STATUS_LABEL[order?.status] || order?.status}
            </Badge>
            <Price value={order?.total_amount} />
          </div>
          <Button variant="primary" size="lg" onClick={onReorder}>
            <Icon name="refresh" size={18} /> Reorder these dishes
          </Button>
        </div>
      </Split>
    </Section>
  );
}