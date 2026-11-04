import React from 'react';
import { Link } from 'react-router-dom';
import { Section, Button } from '../components/ui';
import { Icon } from '../components/icons';

interface HomeCtaProps {
  title?: string;
  text?: string;
}

export default function HomeCta({
  title = 'Hungry? Browse our menu and get fresh dishes delivered or ready to pick up.',
  text = '',
}: HomeCtaProps) {
  return (
    <Section tight>
      <div className="ds-hero ds-between">
        <div className="ds-stack">
          <h2 className="ds-card-title">{title}</h2>
          {text && <p className="ds-lead">{text}</p>}
        </div>
        <Button variant="primary" size="lg" to="/dishes">
          Browse the Menu
          <Icon name="arrow-right" size={18} />
        </Button>
      </div>
    </Section>
  );
}