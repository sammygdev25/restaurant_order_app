import { Section, Stack, Badge } from '../components/ui';
import { Icon } from '../components/icons';

interface OrderHistoryDetailsProps {
  name?: string;
  email?: string;
  phone?: string;
  totalOrders?: number;
}

export default function OrderHistoryDetails({
  name = '',
  email = '',
  phone = '',
  totalOrders = 0,
}: OrderHistoryDetailsProps) {
  return (
    <Section eyebrow="Your account" title="Account details" tight narrow>
      <div className="ds-form">
        <Stack gap="md">
          <div className="ds-field">
            <span className="ds-label">
              <Icon name="user" size={16} /> Name
            </span>
            <p className="ds-muted">{name || 'Not provided'}</p>
          </div>
          <div className="ds-field">
            <span className="ds-label">
              <Icon name="mail" size={16} /> Email
            </span>
            <p className="ds-muted">{email || 'Not provided'}</p>
          </div>
          <div className="ds-field">
            <span className="ds-label">
              <Icon name="phone" size={16} /> Phone
            </span>
            <p className="ds-muted">{phone || 'Not provided'}</p>
          </div>
          <div className="ds-field">
            <span className="ds-label">
              <Icon name="package" size={16} /> Orders placed
            </span>
            <Badge tone="primary">{totalOrders}</Badge>
          </div>
          <p className="ds-small ds-muted">
            Need to update your delivery details or contact number? Set them on your
            next checkout — we'll keep this history updated with every order you place.
          </p>
        </Stack>
      </div>
    </Section>
  );
}