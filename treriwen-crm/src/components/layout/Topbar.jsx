import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import NotificationBell from '../ui/NotificationBell';
import './Topbar.css';

export default function Topbar({ title, subtitle }) {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="topbar-title-block">
          <h1 className="topbar-title">{title}</h1>
          {subtitle && <p className="topbar-subtitle">{subtitle}</p>}
        </div>
      </div>

      <div className="topbar-right">
        <div className={`search-box ${searchFocused ? 'focused' : ''}`}>
          <Search size={14} className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="search-input"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          <kbd className="search-kbd">⌘ K</kbd>
        </div>

        <NotificationBell />

        <button className="topbar-cta">
          <Plus size={15} strokeWidth={2.5} />
          <span>Nouveau</span>
        </button>
      </div>
    </header>
  );
}