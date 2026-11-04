import { Hero, Button, Media } from '../components/ui';
import { Icon } from '../components/icons';

interface HomeHeroProps {
  imageUrl?: string;
}

export default function HomeHero({ imageUrl = '/img/brand/hero.jpg' }: HomeHeroProps) {
  return (
    <Hero
      eyebrow="Fresh. Fast. Flame-Grilled."
      title="Restaurant-quality meals, ordered your way"
      text="Browse our chef-crafted menu and order for delivery or pickup in minutes. Prefer to dine in? Reserve your table and we'll have it ready when you arrive."
      actions={
        <>
          <Button variant="primary" size="lg" to="/dishes">
            Browse the Menu
          </Button>
          <Button variant="ghost" size="lg" to="/reservations">
            <Icon name="calendar" size={18} />
            Reserve a Table
          </Button>
        </>
      }
      media={imageUrl ? <Media src={imageUrl} alt="Signature dish plated and ready to serve" ratio="wide" /> : undefined}
    />
  );
}