import { Section, Split, Card, CardBody } from '../components/ui';
import { Icon } from '../components/icons';

interface HomeAboutProps {
  section?: string;
  page?: string;
}

const values = [
  {
    icon: 'award' as const,
    title: 'Chef-crafted menu',
    text: 'Every dish on our menu is prepared fresh to order using seasonal ingredients sourced from local farms.',
  },
  {
    icon: 'clock' as const,
    title: 'Fast, reliable service',
    text: 'From a quick weeknight delivery to a reserved table for date night, we keep things on time, every time.',
  },
  {
    icon: 'credit-card' as const,
    title: 'Secure checkout',
    text: 'Pay with confidence — every order and reservation is processed through secure, encrypted Stripe payments.',
  },
];

export default function HomeAbout(props: HomeAboutProps) {
  return (
    <Section
      eyebrow="Our story"
      title="A table, a tray, or your doorstep — we've got you covered"
    >
      <Split>
        <div className="ds-stack">
          <p className="ds-lead">
            We built this restaurant platform to make great food effortless to get. Browse
            our full menu, order ahead for pickup or delivery, or reserve a table for a
            proper sit-down meal — all from one place.
          </p>
          <p className="ds-muted">
            Behind the scenes, our kitchen and front-of-house team use the same dashboard
            to manage every incoming order and reservation in real time, so what you see
            on your screen is exactly what's happening in the kitchen. No surprises, just
            good food served the way you want it.
          </p>
        </div>
        <div className="ds-stack">
          {(Array.isArray(values) ? values : []).map((value) => (
            <Card key={value.title}>
              <CardBody>
                <div className="ds-cluster">
                  <Icon name={value.icon} size={24} />
                  <div>
                    <h3 className="ds-card-title">{value.title}</h3>
                    <p className="ds-card-meta">{value.text}</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </Split>
    </Section>
  );
}