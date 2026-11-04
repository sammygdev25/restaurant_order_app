import React from 'react';
import { PageHeader } from '../components/ui';

interface DishListHeaderProps {
  resultCount?: number;
  loading?: boolean;
}

export default function DishListHeader({ resultCount = 0, loading = false }: DishListHeaderProps) {
  const subtitle = loading
    ? 'Loading our kitchen lineup...'
    : `${resultCount} ${resultCount === 1 ? 'dish' : 'dishes'} ready to order`;

  return (
    <PageHeader
      eyebrow="Our Menu"
      title="Explore Every Dish on the Menu"
      subtitle={`Fresh, made-to-order plates from our kitchen — browse by category or search for something specific. ${subtitle}`}
    />
  );
}