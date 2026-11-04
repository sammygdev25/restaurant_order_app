import React from 'react';
import { Section, Stack, Badge } from '../components/ui';
import { Icon } from '../components/icons';

interface StaffOrdersManagementDetailsProps {
  staffName: string;
  staffEmail: string;
  role?: string;
  totalOrders: number;
  pendingOrders: number;
}

export default function StaffOrdersManagementDetails({
  staffName,
  staffEmail,
  role = 'Staff',
  totalOrders,
  pendingOrders,
}: StaffOrdersManagementDetailsProps) {
  return (
    <Section
      narrow
      eyebrow="Account"
      title="Account Details"
      subtitle="Signed in as the staff member managing today's kitchen queue."
    >
      <div className="ds-form">
        <Stack gap="md">
          <div className="ds-form-row">
            <div className="ds-field">
              <span className="ds-label">Name</span>
              <div className="ds-cluster">
                <Icon name="user" size={16} />
                <span>{staffName}</span>
              </div>
            </div>
            <div className="ds-field">
              <span className="ds-label">Email</span>
              <div className="ds-cluster">
                <Icon name="mail" size={16} />
                <span>{staffEmail}</span>
              </div>
            </div>
          </div>

          <div className="ds-form-row">
            <div className="ds-field">
              <span className="ds-label">Role</span>
              <Badge tone="primary">{role}</Badge>
            </div>
            <div className="ds-field">
              <span className="ds-label">Orders Handled</span>
              <div className="ds-cluster">
                <Icon name="package" size={16} />
                <span>{totalOrders}</span>
              </div>
            </div>
          </div>

          <div className="ds-field">
            <span className="ds-label">Pending Right Now</span>
            <div className="ds-cluster">
              <Icon name="clock" size={16} />
              <span>
                {pendingOrders} order{pendingOrders === 1 ? '' : 's'} awaiting action
              </span>
            </div>
            <p className="ds-help">
              Keep an eye on pickup and delivery orders — update statuses promptly so the kitchen
              and delivery team stay in sync.
            </p>
          </div>
        </Stack>
      </div>
    </Section>
  );
}