import React, { useState } from 'react';
import { Search, Bell, Plus, Command } from 'lucide-react';
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
        {/* Search */}
        <div className={`search-box ${searchFocused ? 'focused' : ''}`}>
          <Search size={14} className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="search-input"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          <kbd className="search-kbd">
            <Command size={10} /> K
          </kbd>
        </div>

        {/* Notifications */}
        <button className="topbar-btn notif-btn">
          <Bell size={16} />
          <span className="notif-dot" />
        </button>

        {/* Quick Add */}
        <button className="topbar-cta">
          <Plus size={15} strokeWidth={2.5} />
          <span>Nouveau</span>
        </button>
      </div>
    </header>
  );
}
