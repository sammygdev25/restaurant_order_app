import { PageHeader, Badge, Cluster } from '../components/ui';
import { Icon } from '../components/icons';

interface CheckoutHeaderProps {
  orderType: string;
  step?: number;
}

export default function CheckoutHeader({ orderType, step = 1 }: CheckoutHeaderProps) {
  const steps = [
    { label: 'Cart', icon: 'cart' as const },
    { label: 'Details', icon: 'edit' as const },
    { label: 'Payment', icon: 'credit-card' as const },
  ];

  return (
    <PageHeader
      eyebrow="Checkout"
      title="Complete your order"
      subtitle={
        orderType === 'delivery'
          ? "We'll get your meal delivered hot and fresh to your door."
          : "We'll have your order ready for pickup at the counter."
      }
      actions={
        <Cluster gap="sm" align="center">
          {(Array.isArray(steps) ? steps : []).map((s, idx) => (
            <Badge
              key={s.label}
              tone={idx + 1 === step ? 'primary' : idx + 1 < step ? 'success' : 'neutral'}
            >
              <Icon name={s.icon} size={14} /> {s.label}
            </Badge>
          ))}
        </Cluster>
      }
    />
  );
}