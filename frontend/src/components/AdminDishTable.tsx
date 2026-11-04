import React from 'react';
import type { Dish } from '../types';
import { Button, Badge } from '../components/ui';
import { Icon } from '../components/icons';

interface AdminDishTableProps {
  dishes: Dish[];
  onEdit: (dish: Dish) => void;
  onDelete: (id: number) => void;
}

export default function AdminDishTable({ dishes, onEdit, onDelete }: AdminDishTableProps) {
  const list = Array.isArray(dishes) ? dishes : [];

  if (list.length === 0) {
    return (
      <div className="ds-empty">
        <Icon name="package" size={32} />
        <p>No dishes found. Add your first dish to the menu.</p>
      </div>
    );
  }

  const formatPrice = (price: number | string) => {
    const num = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
      Number.isFinite(num) ? num : 0
    );
  };

  const categoryName = (dish: Dish): string => {
    const cat: any = (dish as any).category;
    if (cat && typeof cat === 'object' && 'name' in cat) return cat.name;
    return typeof cat === 'string' ? cat : '—';
  };

  return (
    <div className="ds-table-wrap">
      <table className="ds-table">
        <thead>
          <tr>
            <th>Dish</th>
            <th>Category</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {list.map((dish) => (
            <tr key={dish.id}>
              <td>
                <div className="ds-cluster" style={{ alignItems: 'center', gap: 'var(--space-sm)' }}>
                  <span>{dish.name}</span>
                </div>
              </td>
              <td>{categoryName(dish)}</td>
              <td>{formatPrice(dish.price)}</td>
              <td>
                <Badge tone={dish.is_available ? 'success' : 'danger'}>
                  {dish.is_available ? 'Available' : 'Unavailable'}
                </Badge>
              </td>
              <td>
                <div className="ds-cluster" style={{ gap: 'var(--space-sm)' }}>
                  <Button variant="secondary" size="md" onClick={() => onEdit(dish)}>
                    <Icon name="edit" size={16} />
                    Edit
                  </Button>
                  <Button variant="danger" size="md" onClick={() => onDelete(dish.id)}>
                    <Icon name="trash" size={16} />
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}