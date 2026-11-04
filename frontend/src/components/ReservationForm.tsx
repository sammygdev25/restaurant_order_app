import React, { useState } from 'react';
import { Button } from './ui';
import { Icon } from './icons';

interface ReservationFormProps {
  onSubmit: (data: { date: string; time: string; party_size: number; notes: string }) => void;
  loading: boolean;
}

export default function ReservationForm({ onSubmit, loading }: ReservationFormProps) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [partySize, setPartySize] = useState(2);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!date || !time) {
      setError('Please choose a date and a time for your table.');
      return;
    }
    if (partySize < 1) {
      setError('Party size must be at least 1.');
      return;
    }
    onSubmit({ date, time, party_size: partySize, notes });
    setDate('');
    setTime('');
    setPartySize(2);
    setNotes('');
  };

  return (
    <form className="ds-form" onSubmit={handleSubmit}>
      {error && (
        <div className="ds-alert" role="alert">
          <Icon name="alert" size={16} /> {error}
        </div>
      )}
      <div className="ds-form-row">
        <div className="ds-field">
          <label className="ds-label" htmlFor="reservation-date">
            <Icon name="calendar" size={14} /> Date
          </label>
          <input
            id="reservation-date"
            type="date"
            className="input"
            min={today}
            value={date}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="ds-field">
          <label className="ds-label" htmlFor="reservation-time">
            <Icon name="clock" size={14} /> Time
          </label>
          <input
            id="reservation-time"
            type="time"
            className="input"
            value={time}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTime(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="ds-field">
        <label className="ds-label" htmlFor="reservation-party-size">
          <Icon name="users" size={14} /> Party size
        </label>
        <input
          id="reservation-party-size"
          type="number"
          min={1}
          max={20}
          className="input"
          value={partySize}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPartySize(parseInt(e.target.value, 10) || 1)}
          required
        />
        <p className="ds-help">How many guests will be joining you at the table?</p>
      </div>
      <div className="ds-field">
        <label className="ds-label" htmlFor="reservation-notes">
          <Icon name="message" size={14} /> Special requests
        </label>
        <textarea
          id="reservation-notes"
          className="input"
          rows={3}
          placeholder="Anniversary, window seat, allergies, high chair..."
          value={notes}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
        />
      </div>
      <div className="ds-form-actions">
        <Button type="submit" variant="primary" size="lg" disabled={loading}>
          {loading ? 'Booking your table...' : 'Reserve table'}
        </Button>
      </div>
    </form>
  );
}