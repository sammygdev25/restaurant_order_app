import { Section, Grid, Card, CardBody, CardTitle, CardMeta, EmptyState } from '../components/ui';
import { Icon } from '../components/icons';
import { Link } from 'react-router-dom';
import type { Category } from '../types';

interface HomeCategoriesProps {
  categories: Category[];
}

export default function HomeCategories({ categories }: HomeCategoriesProps) {
  const list = Array.isArray(categories) ? categories : [];

  return (
    <Section
      eyebrow="Explore the menu"
      title="Browse by category"
      subtitle="From sizzling starters to decadent desserts, find exactly what you're craving."
    >
      {list.length === 0 ? (
        <EmptyState
          icon="menu"
          title="Categories coming soon"
          text="Our kitchen is still plating up the menu categories. Check back shortly."
        />
      ) : (
        <Grid size="sm">
          {list.map((category) => (
            <Card key={category.id} to={`/dishes?category=${category.id}`}>
              <CardBody>
                <Icon name="tag" size={22} />
                <CardTitle>{category.name}</CardTitle>
                {category.description && (
                  <CardMeta>{category.description}</CardMeta>
                )}
                <Link
                  to={`/dishes?category=${category.id}`}
                  className="ds-btn-ghost"
                >
                  View dishes
                  <Icon name="arrow-right" size={16} />
                </Link>
              </CardBody>
            </Card>
          ))}
        </Grid>
      )}
    </Section>
  );
}