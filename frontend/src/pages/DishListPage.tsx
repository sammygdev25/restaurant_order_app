import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import DishListHeader from '../components/DishListHeader';
import DishListFilters from '../components/DishListFilters';
import DishListGrid from '../components/DishListGrid';
import DishListPagination from '../components/DishListPagination';
import { Alert } from '../components/ui';
import { getDishList, getCategoryList } from '../api';
import { useCart } from '../contexts/CartContext';
import type { Dish, Category } from '../types';

const PAGE_SIZE = 9;

export default function DishListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [cartError, setCartError] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  const selectedCategory = searchParams.get('category') || '';
  const search = searchParams.get('q') || '';
  const sort = searchParams.get('sort') || 'name-asc';

  const { addItem } = useCart();

  useEffect(() => {
    let active = true;
    async function loadData() {
      setLoading(true);
      setError('');
      try {
        const [dishList, categoryList] = await Promise.all([
          getDishList(),
          getCategoryList(),
        ]);
        if (!active) return;
        setDishes(Array.isArray(dishList) ? dishList : []);
        setCategories(Array.isArray(categoryList) ? categoryList : []);
      } catch (err) {
        if (!active) return;
        setError('Could not load the menu right now. Please try again shortly.');
      } finally {
        if (active) setLoading(false);
      }
    }
    loadData();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setPage(1);
  }, [selectedCategory, search, sort]);

  const handleSelectCategory = (categorySlug: string) => {
    const next = new URLSearchParams(searchParams);
    if (categorySlug) {
      next.set('category', categorySlug);
    } else {
      next.delete('category');
    }
    setSearchParams(next);
  };

  const handleSearchChange = (value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set('q', value);
    } else {
      next.delete('q');
    }
    setSearchParams(next);
  };

  const handleSortChange = (value: string) => {
    const next = new URLSearchParams(searchParams);
    next.set('sort', value);
    setSearchParams(next);
  };

  const handleClearFilters = () => {
    setSearchParams({});
  };

  const filteredDishes = useMemo(() => {
    let result = Array.isArray(dishes) ? [...dishes] : [];

    if (selectedCategory) {
      result = result.filter((dish) => String(dish.category) === String(selectedCategory));
    }

    if (search.trim()) {
      const term = search.trim().toLowerCase();
      result = result.filter(
        (dish) =>
          dish.name.toLowerCase().includes(term) ||
          (dish.description || '').toLowerCase().includes(term)
      );
    }

    result.sort((a, b) => {
      switch (sort) {
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-asc':
          return Number(a.price) - Number(b.price);
        case 'price-desc':
          return Number(b.price) - Number(a.price);
        case 'name-asc':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return result;
  }, [dishes, selectedCategory, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredDishes.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedDishes = filteredDishes.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleAddToCart = async (dishId: number) => {
    setCartError('');
    try {
      await addItem(dishId, 1);
    } catch (err) {
      setCartError('Could not add that dish to your cart. Please try again.');
    }
  };

  return (
    <div className="ds-stack-lg">
      <DishListHeader resultCount={filteredDishes.length} loading={loading} />

      {error && <Alert tone="danger">{error}</Alert>}
      {cartError && <Alert tone="danger">{cartError}</Alert>}

      <DishListFilters
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        search={search}
        onSearchChange={handleSearchChange}
        sort={sort}
        onSortChange={handleSortChange}
      />

      <DishListGrid
        dishes={paginatedDishes}
        loading={loading}
        onAddToCart={handleAddToCart}
        onClearFilters={handleClearFilters}
      />

      <DishListPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}