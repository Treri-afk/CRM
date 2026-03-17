import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import './StatCard.css';

export default function StatCard({ icon: Icon, label, value, change, changeLabel, accentColor, mono }) {
  const isPositive = change >= 0;

  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <div className="stat-icon" style={{ background: `${accentColor}18`, color: accentColor }}>
          <Icon size={16} strokeWidth={1.8} />
        </div>
        {change !== undefined && (
          <div className={`stat-change ${isPositive ? 'positive' : 'negative'}`}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>

      <div className="stat-body">
        <p className={`stat-value ${mono ? 'mono' : ''}`}>{value}</p>
        <p className="stat-label">{label}</p>
      </div>

      {changeLabel && <p className="stat-change-label">{changeLabel}</p>}

      <div
        className="stat-card-accent"
        style={{ background: `linear-gradient(90deg, ${accentColor}22, transparent)` }}
      />
    </div>
  );
}
