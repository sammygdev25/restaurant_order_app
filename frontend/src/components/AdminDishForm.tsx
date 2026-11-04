import React, { useEffect, useState } from 'react';
import { Button } from '../components/ui';
import { Icon } from '../components/icons';
import api from '../api';
import type { Dish, Category } from '../types';

interface AdminDishFormProps {
  dish: Dish | null;
  onSubmit: (formData: FormData) => void | Promise<void>;
  onCancel: () => void;
}

export default function AdminDishForm({ dish, onSubmit, onCancel }: AdminDishFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await api.get('/categories/');
        const list = Array.isArray(res.data) ? res.data : (res.data.results || []);
        setCategories(list);
      } catch (err) {
        setCategories([]);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    if (dish) {
      setName(dish.name || '');
      setDescription(dish.description || '');
      setPrice(dish.price != null ? String(dish.price) : '');
      setCategoryId(dish.category != null ? String(dish.category) : '');
      setIsAvailable(dish.is_available !== undefined ? dish.is_available : true);
      setImagePreview(dish.image || '');
      setImageFile(null);
    } else {
      setName('');
      setDescription('');
      setPrice('');
      setCategoryId('');
      setIsAvailable(true);
      setImagePreview('');
      setImageFile(null);
    }
  }, [dish]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Dish name is required.');
      return;
    }
    if (!price || isNaN(Number(price)) || Number(price) < 0) {
      setError('Enter a valid price.');
      return;
    }
    if (!categoryId) {
      setError('Please select a category.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name.trim());
    formData.append('description', description.trim());
    formData.append('price', price);
    formData.append('category', categoryId);
    formData.append('is_available', String(isAvailable));
    if (imageFile) {
      formData.append('image', imageFile);
    }

    setSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="ds-form" onSubmit={handleSubmit}>
      {error && (
        <div className="ds-alert ds-alert-danger" role="alert">
          <Icon name="alert" size={16} />
          <span>{error}</span>
        </div>
      )}

      <div className="ds-field">
        <label className="ds-label" htmlFor="dish-name">Dish name</label>
        <input
          id="dish-name"
          className="input"
          type="text"
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          placeholder="e.g. Smoked Brisket Tacos"
        />
      </div>

      <div className="ds-field">
        <label className="ds-label" htmlFor="dish-description">Description</label>
        <textarea
          id="dish-description"
          className="input"
          rows={3}
          value={description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
          placeholder="Describe the dish, ingredients and preparation"
        />
      </div>

      <div className="ds-form-row">
        <div className="ds-field">
          <label className="ds-label" htmlFor="dish-price">Price ($)</label>
          <input
            id="dish-price"
            className="input"
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrice(e.target.value)}
            placeholder="12.99"
          />
        </div>

        <div className="ds-field">
          <label className="ds-label" htmlFor="dish-category">Category</label>
          <select
            id="dish-category"
            className="input"
            value={categoryId}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCategoryId(e.target.value)}
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="ds-field">
        <label className="ds-label" htmlFor="dish-image">Dish photo</label>
        <input
          id="dish-image"
          className="input"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt={name || 'Dish preview'}
            className="ds-media ds-media-square"
            style={{ width: '96px', height: '96px', objectFit: 'cover', marginTop: 'var(--space-sm)', borderRadius: 'var(--radius-md)' }}
          />
        )}
        <p className="ds-help">Images are stored under /img/ for this app.</p>
      </div>

      <div className="ds-field">
        <label className="ds-label" htmlFor="dish-available">
          <input
            id="dish-available"
            type="checkbox"
            checked={isAvailable}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIsAvailable(e.target.checked)}
          />
          {' '}Available on menu
        </label>
      </div>

      <div className="ds-form-actions">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? 'Saving...' : dish ? 'Save Changes' : 'Create Dish'}
        </Button>
      </div>
    </form>
  );
}