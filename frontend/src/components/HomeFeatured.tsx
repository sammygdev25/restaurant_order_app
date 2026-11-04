import { Section, Grid, Card, CardBody, CardTitle, CardMeta, Price, Media, SkeletonCards, EmptyState, Button } from '../components/ui';
import { Icon } from '../components/icons';
import type { Dish } from '../types';

interface HomeFeaturedProps {
  dishes: Dish[];
  loading: boolean;
  onAddToCart: (dish: Dish) => void;
}

export default function HomeFeatured({ dishes, loading, onAddToCart }: HomeFeaturedProps) {
  const featured = (Array.isArray(dishes) ? dishes : []).filter((d) => d.is_available).slice(0, 8);

  return (
    <Section
      eyebrow="From the kitchen"
      title="Featured dishes"
      subtitle="Chef-picked favorites, fired fresh and ready for pickup, delivery or dine-in."
    >
      {loading ? (
        <SkeletonCards count={8} />
      ) : featured.length === 0 ? (
        <EmptyState
          icon="package"
          title="No dishes available yet"
          text="Check back soon — our kitchen is updating the menu."
        />
      ) : (
        <Grid size="md" cols={4}>
          {(Array.isArray(featured) ? featured : []).map((dish) => (
            <Card key={dish.id}>
              <Media src={dish.image || ''} alt={dish.name} ratio="square" />
              <CardBody>
                <CardTitle>{dish.name}</CardTitle>
                <CardMeta>{dish.description}</CardMeta>
                <div className="ds-between">
                  <Price value={dish.price} />
                  <Button variant="primary" size="md" onClick={() => onAddToCart(dish)}>
                    <Icon name="cart" size={16} />
                    Add
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </Grid>
      )}
    </Section>
  );
}
