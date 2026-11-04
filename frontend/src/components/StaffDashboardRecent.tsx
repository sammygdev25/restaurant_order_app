import React from 'react';
import { Link } from 'react-router-dom';
import { Section, EmptyState, Badge } from '../components/ui';
import { Icon } from '../components/icons';
import type { Order, Reservation } from '../types';

interface StaffDashboardRecentProps {
  recentOrders: Order[];
  recentReservations: Reservation[];
}

function statusTone(status: string): 'neutral' | 'primary' | 'soft' | 'success' | 'danger' {
  if (status === 'completed' || status === 'confirmed' || status === 'paid') return 'success';
  if (status === 'cancelled') return 'danger';
  if (status === 'pending') return 'soft';
  return 'primary';
}

export default function StaffDashboardRecent({ recentOrders, recentReservations }: StaffDashboardRecentProps) {
  const orders = Array.isArray(recentOrders) ? recentOrders : [];
  const reservations = Array.isArray(recentReservations) ? recentReservations : [];

  return (
    <Section eyebrow="Recent Activity" title="What's happening at the kitchen">
      <div className="ds-grid-split">
        <div className="ds-stack">
          <h3 className="ds-card-title">Latest Orders</h3>
          {orders.length === 0 ? (
            <EmptyState
              icon="package"
              title="No orders yet"
              text="New pickup and delivery orders will show up here as soon as customers place them."
            />
          ) : (
            <div className="ds-table-wrap">
              <table className="ds-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 6).map((order) => (
                    <tr key={order.id}>
                      <td>
                        <Link to={`/orders/${order.id}`}>#{order.id}</Link>
                      </td>
                      <td>{order.order_type === 'delivery' ? 'Delivery' : 'Pickup'}</td>
                      <td>
                        <Badge tone={statusTone(order.status)}>{order.status.replace(/_/g, ' ')}</Badge>
                      </td>
                      <td>${Number(order.total_amount).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="ds-stack">
          <h3 className="ds-card-title">Upcoming Reservations</h3>
          {reservations.length === 0 ? (
            <EmptyState
              icon="calendar"
              title="No reservations yet"
              text="Table bookings from guests will appear here once they reserve a spot."
            />
          ) : (
            <div className="ds-table-wrap">
              <table className="ds-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Party</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.slice(0, 6).map((reservation) => (
                    <tr key={reservation.id}>
                      <td>
                        <Link to="/reservations">
                          <Icon name="calendar" size={14} /> {reservation.date}
                        </Link>
                      </td>
                      <td>{reservation.time}</td>
                      <td>{reservation.party_size}</td>
                      <td>
                        <Badge tone={statusTone(reservation.status)}>{reservation.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}