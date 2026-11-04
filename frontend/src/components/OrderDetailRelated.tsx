import type { Dish } from '../types';
import { Section, Grid, Card, CardBody, CardTitle, CardMeta, CardFooter, Price, Media } from '../components/ui';
import { Icon } from '../components/icons';

interface OrderDetailRelatedProps {
  dishes: Dish[];
  onAddToCart?: (dishId: number) => void;
}

export default function OrderDetailRelated({ dishes, onAddToCart }: OrderDetailRelatedProps) {
  if (!dishes || dishes.length === 0) {
    return null;
  }

  return (
    <Section
      eyebrow="You might also like"
      title="More from this category"
      subtitle="Popular dishes our guests often order together."
      tight
    >
      <Grid size="sm">
        {dishes.slice(0, 6).map((dish) => (
          <Card key={dish.id}>
            <Media
              src={dish.image || ''}
              alt={dish.name}
              ratio="wide"
              badge={!dish.is_available ? 'Sold out' : undefined}
            />
            <CardBody>
              <CardTitle>{dish.name}</CardTitle>
              <CardMeta>{dish.description}</CardMeta>
              <CardFooter>
                <Price value={dish.price} />
                {onAddToCart && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={!dish.is_available}
                    onClick={() => onAddToCart(dish.id)}
                  >
                    <Icon name="cart" size={16} />
                    Add
                  </button>
                )}
              </CardFooter>
            </CardBody>
          </Card>
        ))}
      </Grid>
    </Section>
  );
}