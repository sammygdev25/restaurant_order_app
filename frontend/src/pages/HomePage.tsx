import { useEffect, useState } from 'react';
import { getDishList, getCategoryList } from '../api';
import { useCart } from '../contexts/CartContext';
import type { Dish, Category } from '../types';
import HomeHero from '../components/HomeHero';
import HomeFeatured from '../components/HomeFeatured';
import HomeCategories from '../components/HomeCategories';
import HomeAbout from '../components/HomeAbout';
import HomeCta from '../components/HomeCta';
import { Alert } from '../components/ui';

export default function HomePage() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const { addItem } = useCart();

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const [dishList, categoryList] = await Promise.all([
          getDishList(),
          getCategoryList(),
        ]);
        if (!active) return;
        const availableDishes = (Array.isArray(dishList) ? dishList : []).filter(
          (d: Dish) => d.is_available
        );
        setDishes(availableDishes.slice(0, 8));
        setCategories(Array.isArray(categoryList) ? categoryList : []);
      } catch (err) {
        if (active) setError('Could not load the menu right now. Please try again shortly.');
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const heroImage =
    dishes.length > 0 && dishes[0].image ? dishes[0].image : undefined;

  const handleAddToCart = async (dish: Dish) => {
    await addItem(dish.id, 1);
  };

  return (
    <div className="ds-stack-lg relative isolate">
      {error && <Alert tone="danger">{error}</Alert>}
      <div className="relative isolate overflow-hidden"><HomeHero imageUrl={heroImage} /></div>
      <HomeFeatured dishes={dishes} loading={loading} onAddToCart={handleAddToCart} />
      <HomeCategories categories={categories} />
      <div className="relative isolate"><HomeAbout /></div>
      <HomeCta />
    </div>
  );
}