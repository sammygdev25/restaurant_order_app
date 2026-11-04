import React from 'react';
import { Card, CardBody, CardTitle, CardMeta, CardFooter, Price, Media, Badge, Button } from '../components/ui';
import { Icon } from '../components/icons';
import type { Dish } from '../types';

interface DishCardProps {
  dish: Dish;
  onAddToCart: (dish: Dish) => void;
}

export default function DishCard({ dish, onAddToCart }: DishCardProps) {
  const imageSrc = dish.image ? dish.image : '';

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(dish);
  };

  return (
    <Card className="dish-card">
      <Media
        src={imageSrc}
        alt={dish.name}
        ratio="wide"
        badge={!dish.is_available ? 'Sold out' : undefined}
      />
      <CardBody>
        <CardTitle>{dish.name}</CardTitle>
        {dish.description && (
          <CardMeta>{dish.description}</CardMeta>
        )}
        <CardFooter>
          <Price value={dish.price} />
          {dish.is_available ? (
            <Button variant="primary" size="md" onClick={handleAddToCart}>
              <Icon name="cart" size={16} />
              Add to cart
            </Button>
          ) : (
            <Badge tone="danger">Unavailable</Badge>
          )}
        </CardFooter>
      </CardBody>
    </Card>
  );
}