import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrder, getDishList, getOrderItemList } from '../api';
import type { Order, Dish, OrderItem } from '../types';
import { useCart } from '../contexts/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import OrderItemsTable from '../components/OrderItemsTable';
import OrderDetailMedia from '../components/OrderDetailMedia';
import OrderDetailFacts from '../components/OrderDetailFacts';
import OrderDetailRelated from '../components/OrderDetailRelated';

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [relatedDishes, setRelatedDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [reordering, setReordering] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;
    loadOrder(Number(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadOrder = async (orderId: number) => {
    setLoading(true);
    setError('');
    try {
      const data = await getOrder(orderId);
      setOrder(data);
      const items = await getOrderItemList({ order: orderId });
      setOrderItems(items);
      await loadRelated(items);
    } catch (err) {
      setError('Unable to load this order. It may not exist or you may not have access to it.');
    } finally {
      setLoading(false);
    }
  };

  const loadRelated = async (items: OrderItem[]) => {
    try {
      const allDishes = await getDishList();
      const orderDishIds = new Set(items.map((item) => item.dish));
      const firstDish = allDishes.find((d) => orderDishIds.has(d.id));
      if (!firstDish) {
        setRelatedDishes([]);
        return;
      }
      const related = allDishes
        .filter((d) => d.category === firstDish.category && !orderDishIds.has(d.id) && d.is_available)
        .slice(0, 6);
      setRelatedDishes(related);
    } catch {
      setRelatedDishes([]);
    }
  };

  const handleReorder = async () => {
    if (!order) return;
    setReordering(true);
    try {
      for (const item of orderItems) {
        await addItem(item.dish, item.quantity);
      }
      navigate('/cart');
    } catch {
      setError('Could not reorder these items. Please try again.');
    } finally {
      setReordering(false);
    }
  };

  const handleAddToCart = async (dishId: number) => {
    try {
      await addItem(dishId, 1);
    } catch {
      setError('Could not add this dish to your cart.');
    }
  };

  if (loading) {
    return (
      <div className="ds-container ds-section">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="ds-container ds-section">
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="ds-container ds-section">
        <ErrorMessage message="Order not found." />
      </div>
    );
  }

  return (
    <div className="ds-stack-lg">
      {error && (
        <div className="ds-container">
          <ErrorMessage message={error} />
        </div>
      )}
      <OrderDetailMedia order={order} onReorder={handleReorder} />
      <OrderDetailFacts order={order} />
      <section className="ds-section">
        <div className="ds-container">
          <OrderItemsTable items={orderItems} />
        </div>
      </section>
      <OrderDetailRelated dishes={relatedDishes} onAddToCart={handleAddToCart} />
    </div>
  );
}
