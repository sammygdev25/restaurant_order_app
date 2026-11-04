import React from 'react';
import { PageHeader } from '../components/ui';
import { Icon } from '../components/icons';

interface OrderHistoryHeaderProps {
  title?: string;
  userName?: string;
}

export default function OrderHistoryHeader({
  title = 'Your Order History',
  userName,
}: OrderHistoryHeaderProps) {
  return (
    <PageHeader
      eyebrow="Account"
      title={title}
      subtitle={
        userName
          ? `Signed in as ${userName} — track pickups, deliveries and past orders below.`
          : 'Track your pickups, deliveries and past orders below.'
      }
      actions={
        <span className="ds-cluster">
          <Icon name="package" size={20} title="Orders" />
        </span>
      }
    />
  );
}