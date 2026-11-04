import { Section } from '../components/ui';
import { Icon } from '../components/icons';
import type { Category } from '../types';

interface DishListFiltersProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categorySlug: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
}

export default function DishListFilters({
  categories,
  selectedCategory,
  onSelectCategory,
  search,
  onSearchChange,
  sort,
  onSortChange,
}: DishListFiltersProps) {
  return (
    <Section tight>
      <div className="ds-filters">
        <div className="ds-field">
          <label className="ds-label" htmlFor="dish-search">
            Search the menu
          </label>
          <div className="ds-cluster">
            <Icon name="search" size={18} />
            <input
              id="dish-search"
              type="text"
              className="input"
              placeholder="Search dishes like Grilled Salmon or Truffle Fries..."
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        <div className="ds-field">
          <label className="ds-label" htmlFor="dish-category">
            Category
          </label>
          <select
            id="dish-category"
            className="input"
            value={selectedCategory}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onSelectCategory(e.target.value)}
          >
            <option value="">All categories</option>
            {(Array.isArray(categories) ? categories : []).map((category) => (
              <option key={category.id} value={String(category.id)}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="ds-field">
          <label className="ds-label" htmlFor="dish-sort">
            Sort by
          </label>
          <select
            id="dish-sort"
            className="input"
            value={sort}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onSortChange(e.target.value)}
          >
            <option value="name">Name (A-Z)</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
          </select>
        </div>
      </div>
    </Section>
  );
}