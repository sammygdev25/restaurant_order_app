import type { OrderItem } from '../types';
import { Icon } from '../components/icons';

interface OrderItemsTableProps {
  items: OrderItem[];
}

function formatCurrency(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(Number.isFinite(num) ? num : 0);
}

export default function OrderItemsTable({ items }: OrderItemsTableProps) {
  const safeItems = Array.isArray(items) ? items : [];

  if (safeItems.length === 0) {
    return (
      <div className="ds-empty">
        <Icon name="package" size={32} />
        <p className="ds-muted">No dishes found on this order.</p>
      </div>
    );
  }

  const total = safeItems.reduce((sum, item) => {
    const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
    return sum + (Number.isFinite(price) ? price : 0) * item.quantity;
  }, 0);

  return (
    <div className="ds-table-wrap">
      <table className="ds-table">
        <thead>
          <tr>
            <th>Dish</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Line Total</th>
          </tr>
        </thead>
        <tbody>
          {safeItems.map((item) => {
            const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
            const lineTotal = (Number.isFinite(price) ? price : 0) * item.quantity;
            return (
              <tr key={item.id}>
                <td>{`Dish #${item.dish}`}</td>
                <td>{formatCurrency(price)}</td>
                <td>{item.quantity}</td>
                <td>{formatCurrency(lineTotal)}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} className="ds-small">
              Items Total
            </td>
            <td>
              <strong>{formatCurrency(total)}</strong>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
