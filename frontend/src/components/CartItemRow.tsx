import React from 'react';
import { Media, Button, Stack, Cluster } from '../components/ui';
import { Icon } from '../components/icons';
import { CartItemType } from '../contexts/CartContext';

interface CartItemRowProps {
  item: CartItemType;
  onUpdateQuantity: (itemId: number, quantity: number) => void;
  onRemove: (itemId: number) => void;
}

function CartItemRow({ item, onUpdateQuantity, onRemove }: CartItemRowProps) {
  const dish = item.dish;
  const price = dish && dish.price ? parseFloat(String(dish.price)) : 0;
  const lineTotal = price * item.quantity;

  const handleDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    } else {
      onRemove(item.id);
    }
  };

  const handleIncrease = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  return (
    <div className="ds-card cart-item-row">
      <Cluster gap="md" align="center">
        <div className="cart-item-row-media">
          <Media
            src={dish?.image || ''}
            alt={dish?.name || 'Dish'}
            ratio="square"
          />
        </div>
        <Stack gap="xs" className="cart-item-row-info">
          <span className="ds-card-title">{dish?.name || 'Unknown Dish'}</span>
          <span className="ds-muted ds-small">
            ${Number(price || 0).toFixed(2)} each
          </span>
        </Stack>
        <Cluster gap="sm" align="center" className="cart-item-row-qty">
          <Button
            variant="secondary"
            size="md"
            onClick={handleDecrease}
            aria-label="Decrease quantity"
          >
            <Icon name="minus" size={16} />
          </Button>
          <span className="cart-item-row-qty-value">{item.quantity}</span>
          <Button
            variant="secondary"
            size="md"
            onClick={handleIncrease}
            aria-label="Increase quantity"
          >
            <Icon name="plus" size={16} />
          </Button>
        </Cluster>
        <div className="cart-item-row-total">
          <span className="ds-price">${Number(lineTotal || 0).toFixed(2)}</span>
        </div>
        <Button
          variant="danger"
          size="md"
          onClick={() => onRemove(item.id)}
          aria-label="Remove item"
        >
          <Icon name="trash" size={16} />
        </Button>
      </Cluster>
    </div>
  );
}

export default CartItemRow;