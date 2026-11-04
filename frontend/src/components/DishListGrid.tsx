import { Section, Grid, Card, CardBody, CardTitle, CardMeta, CardFooter, Price, Media, Badge, SkeletonCards, EmptyState, Button } from '../components/ui';
import type { Dish } from '../types';

interface DishListGridProps {
  dishes: Dish[];
  loading: boolean;
  onAddToCart: (dishId: number) => void;
  onClearFilters?: () => void;
}

export default function DishListGrid({ dishes, loading, onAddToCart, onClearFilters }: DishListGridProps) {
  if (loading) {
    return (
      <Section tight>
        <SkeletonCards count={6} />
      </Section>
    );
  }

  if (!dishes || dishes.length === 0) {
    return (
      <Section tight>
        <EmptyState
          icon="search"
          title="No dishes found"
          text="We couldn't find anything matching your search. Try a different category or clear your filters to see the full menu."
          action={
            onClearFilters ? (
              <Button variant="primary" onClick={onClearFilters}>Clear filters</Button>
            ) : undefined
          }
        />
      </Section>
    );
  }

  return (
    <Section tight>
      <Grid size="md" cols={3}>
        {(Array.isArray(dishes) ? dishes : []).map((dish) => (
          <Card key={dish.id}>
            <Media
              src={dish.image || ''}
              alt={dish.name}
              ratio="wide"
              badge={!dish.is_available ? 'Sold out' : undefined}
            />
            <CardBody>
              <CardTitle>{dish.name}</CardTitle>
              <CardMeta>{dish.description || 'A house favorite, made fresh to order.'}</CardMeta>
              <CardFooter>
                <Price value={dish.price} />
                {dish.is_available ? (
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => onAddToCart(dish.id)}
                  >
                    Add to cart
                  </Button>
                ) : (
                  <Badge tone="neutral">Unavailable</Badge>
                )}
              </CardFooter>
            </CardBody>
          </Card>
        ))}
      </Grid>
    </Section>
  );
}