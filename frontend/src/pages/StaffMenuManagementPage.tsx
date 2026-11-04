import React, { useEffect, useState, useMemo } from 'react';
import { getDishList, getCategoryList, createDish, updateDish, deleteDish } from '../api';
import type { Dish, Category } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import AdminDishForm from '../components/AdminDishForm';
import StaffMenuManagementHeader from '../components/StaffMenuManagementHeader';
import StaffMenuManagementFilters from '../components/StaffMenuManagementFilters';
import StaffMenuManagementGrid from '../components/StaffMenuManagementGrid';
import StaffMenuManagementPagination from '../components/StaffMenuManagementPagination';
import { Alert } from '../components/ui';

const PAGE_SIZE = 9;

export default function StaffMenuManagementPage() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const [search, setSearch] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [sort, setSort] = useState<string>('name');
  const [page, setPage] = useState<number>(1);

  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [dishList, categoryList] = await Promise.all([getDishList(), getCategoryList()]);
      setDishes(Array.isArray(dishList) ? dishList : []);
      setCategories(Array.isArray(categoryList) ? categoryList : []);
    } catch (err) {
      setError('Failed to load menu data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, category, sort]);

  const filteredDishes = useMemo(() => {
    let result = Array.isArray(dishes) ? [...dishes] : [];

    if (search.trim()) {
      const term = search.trim().toLowerCase();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(term) ||
          (d.description || '').toLowerCase().includes(term)
      );
    }

    if (category) {
      result = result.filter((d) => String(d.category) === String(category));
    }

    result.sort((a, b) => {
      if (sort === 'price_asc') return Number(a.price) - Number(b.price);
      if (sort === 'price_desc') return Number(b.price) - Number(a.price);
      if (sort === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

    return result;
  }, [dishes, search, category, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredDishes.length / PAGE_SIZE));
  const paginatedDishes = filteredDishes.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleAddNew = () => {
    setEditingDish(null);
    setFormError('');
    setShowForm(true);
  };

  const handleEdit = (dish: Dish) => {
    setEditingDish(dish);
    setFormError('');
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingDish(null);
    setFormError('');
  };

  const handleSubmitForm = async (formData: FormData) => {
    setSaving(true);
    setFormError('');
    try {
      const imageValue = formData.get('image');
      const data: Partial<Dish> = {
        name: String(formData.get('name') ?? ''),
        description: String(formData.get('description') ?? ''),
        price: Number(formData.get('price') ?? 0),
        category: Number(formData.get('category') ?? 0),
        image: imageValue ? String(imageValue) : null,
        is_available:
          formData.get('is_available') === 'true' || formData.get('is_available') === 'on',
      };

      if (editingDish) {
        await updateDish(editingDish.id, data);
      } else {
        await createDish(data);
      }
      await loadData();
      setShowForm(false);
      setEditingDish(null);
    } catch (err) {
      setFormError('Could not save this dish. Please check the fields and try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this dish from the menu?')) return;
    try {
      await deleteDish(id);
      setDishes((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      setError('Failed to delete dish. Please try again.');
    }
  };

  if (loading && dishes.length === 0) {
    return (
      <div className="ds-container ds-section">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="ds-stack-lg">
      <StaffMenuManagementHeader
        dishCount={filteredDishes.length}
        loading={loading}
        onAddDish={handleAddNew}
      />

      {error && (
        <div className="ds-container">
          <ErrorMessage message={error} />
        </div>
      )}

      {showForm && (
        <div className="ds-container">
          <div className="card">
            {formError && <Alert tone="danger">{formError}</Alert>}
            <AdminDishForm
              dish={editingDish}
              onSubmit={handleSubmitForm}
              onCancel={handleCancelForm}
            />
            {saving && <p className="ds-muted ds-small">Saving dish...</p>}
          </div>
        </div>
      )}

      <StaffMenuManagementFilters
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        sort={sort}
        onSortChange={setSort}
        categories={categories}
      />

      <StaffMenuManagementGrid
        dishes={paginatedDishes}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddNew={handleAddNew}
      />

      <StaffMenuManagementPagination
        currentPage={page}
        totalPages={totalPages}
        onPrevious={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
      />
    </div>
  );
}
