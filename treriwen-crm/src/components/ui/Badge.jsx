import React from 'react';
import './Badge.css';

const variants = {
  active: { label: 'Actif', cls: 'green' },
  inactive: { label: 'Inactif', cls: 'red' },
  prospect: { label: 'Prospect', cls: 'yellow' },
  qualification: { label: 'Qualification', cls: 'muted' },
  proposal: { label: 'Proposition', cls: 'purple' },
  negotiation: { label: 'Négociation', cls: 'yellow' },
  won: { label: 'Gagné', cls: 'green' },
  lost: { label: 'Perdu', cls: 'red' },
  high: { label: 'Haute', cls: 'red' },
  medium: { label: 'Moyenne', cls: 'yellow' },
  low: { label: 'Basse', cls: 'muted' },
  todo: { label: 'À faire', cls: 'muted' },
  inprogress: { label: 'En cours', cls: 'blue' },
  done: { label: 'Terminé', cls: 'green' },
};

export default function Badge({ type, custom }) {
  const variant = variants[type] || { label: type, cls: 'muted' };
  return (
    <span className={`badge badge-${variant.cls}`}>
      {custom || variant.label}
    </span>
  );
}
