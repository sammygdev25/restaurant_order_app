import type { Category } from '../types';
import { Icon } from '../components/icons';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
  const list = Array.isArray(categories) ? categories : [];

  return (
    <div className="ds-cluster" role="tablist" aria-label="Filter dishes by category">
      <button
        type="button"
        className={`btn ${selectedCategory === '' ? 'btn-primary' : 'btn-secondary'}`}
        onClick={() => onSelectCategory('')}
        aria-pressed={selectedCategory === ''}
      >
        <Icon name="grid" size={16} />
        All Dishes
      </button>
      {list.map((category) => (
        <button
          key={category.id}
          type="button"
          className={`btn ${selectedCategory === category.name ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => onSelectCategory(category.name)}
          aria-pressed={selectedCategory === category.name}
        >
          <Icon name="tag" size={16} />
          {category.name}
        </button>
      ))}
    </div>
  );
}