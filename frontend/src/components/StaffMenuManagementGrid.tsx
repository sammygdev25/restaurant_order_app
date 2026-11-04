import { Grid, Card, CardBody, CardTitle, CardMeta, CardFooter, Price, Media, Badge, Button, EmptyState, SkeletonCards } from '../components/ui';
import { Icon } from '../components/icons';
import type { Dish } from '../types';

interface StaffMenuManagementGridProps {
  dishes: Dish[];
  loading: boolean;
  onEdit: (dish: Dish) => void;
  onDelete: (id: number) => void;
  onAddNew: () => void;
}

export default function StaffMenuManagementGrid({
  dishes,
  loading,
  onEdit,
  onDelete,
  onAddNew,
}: StaffMenuManagementGridProps) {
  if (loading) {
    return <SkeletonCards count={6} />;
  }

  if (!dishes || dishes.length === 0) {
    return (
      <EmptyState
        icon="package"
        title="No dishes found"
        text="Add your first dish to start building the menu customers see at checkout."
        action={
          <Button variant="primary" onClick={onAddNew}>
            <Icon name="plus" size={16} /> Add Dish
          </Button>
        }
      />
    );
  }

  return (
    <Grid size="md" cols={3}>
      {(Array.isArray(dishes) ? dishes : []).map((dish) => (
        <Card key={dish.id}>
          <Media
            src={dish.image || ''}
            alt={dish.name}
            ratio="wide"
            badge={!dish.is_available ? 'Unavailable' : undefined}
          />
          <CardBody>
            <CardTitle>{dish.name}</CardTitle>
            <CardMeta>{dish.description || 'No description provided.'}</CardMeta>
            <div className="ds-between">
              <Price value={dish.price} />
              <Badge tone={dish.is_available ? 'success' : 'danger'}>
                {dish.is_available ? 'Available' : 'Unavailable'}
              </Badge>
            </div>
            <CardFooter>
              <Button variant="secondary" size="md" onClick={() => onEdit(dish)}>
                <Icon name="edit" size={16} /> Edit
              </Button>
              <Button variant="danger" size="md" onClick={() => onDelete(dish.id)}>
                <Icon name="trash" size={16} /> Delete
              </Button>
            </CardFooter>
          </CardBody>
        </Card>
      ))}
    </Grid>
  );
}