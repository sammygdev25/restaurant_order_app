import React from 'react';
import { Section, Stack } from '../components/ui';
import { Icon } from '../components/icons';

interface CheckoutFormProps {
  orderType: string;
  onOrderTypeChange: (value: string) => void;
  address: string;
  onAddressChange: (value: string) => void;
  phone: string;
  onPhoneChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export default function CheckoutForm({
  orderType,
  onOrderTypeChange,
  address,
  onAddressChange,
  phone,
  onPhoneChange,
  onSubmit,
  loading,
}: CheckoutFormProps) {
  return (
    <Section
      eyebrow="Checkout"
      title="Delivery details"
      subtitle="Tell us how you'd like to receive your order from the kitchen."
      tight
    >
      <form className="ds-form" onSubmit={onSubmit}>
        <div className="ds-field">
          <label className="ds-label">
            <Icon name="truck" size={16} /> Order type
          </label>
          <Stack gap="sm" align="center" justify="start">
            <label className="ds-cluster">
              <input
                type="radio"
                name="orderType"
                value="pickup"
                checked={orderType === 'pickup'}
                onChange={() => onOrderTypeChange('pickup')}
              />
              Pickup
            </label>
            <label className="ds-cluster">
              <input
                type="radio"
                name="orderType"
                value="delivery"
                checked={orderType === 'delivery'}
                onChange={() => onOrderTypeChange('delivery')}
              />
              Delivery
            </label>
          </Stack>
          <p className="ds-help">
            Pickup orders are ready at the counter; delivery arrives hot to your door.
          </p>
        </div>

        {orderType === 'delivery' && (
          <div className="ds-field">
            <label className="ds-label" htmlFor="address">
              <Icon name="map-pin" size={16} /> Delivery address
            </label>
            <input
              id="address"
              className="input"
              type="text"
              placeholder="123 Main St, Apt 4B, Springfield"
              value={address}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onAddressChange(e.target.value)}
              required={orderType === 'delivery'}
            />
          </div>
        )}

        <div className="ds-field">
          <label className="ds-label" htmlFor="phone">
            <Icon name="phone" size={16} /> Phone number
          </label>
          <input
            id="phone"
            className="input"
            type="tel"
            placeholder="(555) 123-4567"
            value={phone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onPhoneChange(e.target.value)}
            required
          />
          <p className="ds-help">We'll text you when your order is on its way.</p>
        </div>

        <div className="ds-form-actions">
          <button type="submit" className="btn btn-primary ds-btn-lg" disabled={loading}>
            {loading ? (
              <>
                <Icon name="refresh" size={16} /> Processing payment...
              </>
            ) : (
              <>
                <Icon name="credit-card" size={16} /> Confirm &amp; pay
              </>
            )}
          </button>
        </div>
      </form>
    </Section>
  );
}