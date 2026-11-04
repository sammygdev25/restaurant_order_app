import React from 'react';
import DishCard from './DishCard';
import { EmptyState } from '../components/ui';
import type { Dish } from '../types';

interface MenuListProps {
  dishes: Dish[];
  onAddToCart: (dish: Dish) => void;
}

function MenuList({ dishes, onAddToCart }: MenuListProps) {
  const list = Array.isArray(dishes) ? dishes : [];

  if (list.length === 0) {
    return (
      <EmptyState
        icon="package"
        title="No dishes found"
        text="There are no dishes available right now — check back soon for fresh additions to the menu."
      />
    );
  }

  return (
    <div className="ds-grid ds-grid-md">
      {list.map((dish) => (
        <DishCard key={dish.id} dish={dish} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
}

export default MenuList;