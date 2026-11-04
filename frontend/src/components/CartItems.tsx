import React from 'react';
import { Link } from 'react-router-dom';
import { Section, Stack, Card, CardBody, Media, Button, EmptyState, Price } from '../components/ui';
import { Icon } from '../components/icons';
import { CartItemType } from '../contexts/CartContext';

interface CartItemsProps {
  items: CartItemType[];
  onUpdateQuantity: (itemId: number, quantity: number) => void;
  onRemove: (itemId: number) => void;
}

export default function CartItems({ items, onUpdateQuantity, onRemove }: CartItemsProps) {
  if (!items || items.length === 0) {
    return (
      <Section title="Your Order" tight>
        <EmptyState
          icon="cart"
          title="Your cart is empty"
          text="Browse our menu and add a few dishes to get your order started."
          action={
            <Button to="/dishes" variant="primary">
              Browse the Menu
            </Button>
          }
        />
      </Section>
    );
  }

  return (
    <Section title="Your Order" subtitle={`${items.length} item${items.length === 1 ? '' : 's'} in your cart`} tight>
      <Stack gap="md">
        {(Array.isArray(items) ? items : []).map((item) => {
          const dish = item.dish;
          const lineTotal = dish ? parseFloat(String(dish.price)) * item.quantity : 0;
          return (
            <Card key={item.id} className="ds-between">
              <CardBody>
                <div className="ds-cluster">
                  <Media
                    src={dish?.image || ''}
                    alt={dish?.name || 'Dish'}
                    ratio="square"
                  />
                  <Stack gap="xs">
                    <span className="ds-card-title">{dish?.name || 'Dish'}</span>
                    <span className="ds-card-meta">{dish?.description || ''}</span>
                    <Price value={dish ? parseFloat(String(dish.price)) : 0} />
                  </Stack>
                </div>
                <Stack gap="sm" align="end">
                  <div className="ds-cluster">
                    <Button
                      variant="ghost"
                      size="md"
                      aria-label="Decrease quantity"
                      onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    >
                      <Icon name="minus" />
                    </Button>
                    <span className="ds-small">{item.quantity}</span>
                    <Button
                      variant="ghost"
                      size="md"
                      aria-label="Increase quantity"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      <Icon name="plus" />
                    </Button>
                  </div>
                  <Price value={lineTotal} />
                  <Button
                    variant="danger"
                    size="md"
                    aria-label="Remove item"
                    onClick={() => onRemove(item.id)}
                  >
                    <Icon name="trash" />
                    Remove
                  </Button>
                </Stack>
              </CardBody>
            </Card>
          );
        })}
      </Stack>
      <div className="ds-form-actions">
        <Link to="/dishes" className="ds-btn-ghost">
          <Icon name="arrow-left" /> Add more dishes
        </Link>
      </div>
    </Section>
  );
}