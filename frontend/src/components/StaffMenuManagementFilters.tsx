import { Section } from '../components/ui';
import { Icon } from '../components/icons';
import type { Category } from '../types';

interface StaffMenuManagementFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  categories: Category[];
}

export default function StaffMenuManagementFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  sort,
  onSortChange,
  categories,
}: StaffMenuManagementFiltersProps) {
  return (
    <Section tight>
      <div className="ds-filters">
        <div className="ds-field">
          <label className="ds-label" htmlFor="dish-search">
            Search dishes
          </label>
          <div className="ds-cluster">
            <Icon name="search" size={18} />
            <input
              id="dish-search"
              className="input"
              type="text"
              placeholder="Search by name, e.g. Wood-Fired Margherita"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
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
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="">All categories</option>
            {(Array.isArray(categories) ? categories : []).map((cat) => (
              <option key={cat.id} value={String(cat.id)}>
                {cat.name}
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
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="name">Name (A-Z)</option>
            <option value="price_low">Price (Low to High)</option>
            <option value="price_high">Price (High to Low)</option>
            <option value="unavailable">Unavailable first</option>
          </select>
        </div>
      </div>
    </Section>
  );
}