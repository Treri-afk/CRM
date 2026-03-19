import React, { useState } from 'react';
import {
  Search, Plus, Tag, Bookmark, Lightbulb, FileText,
  Link2, Star, Pin, Filter, Edit2, Trash2, ExternalLink
} from 'lucide-react';
import Topbar from '../components/layout/Topbar';
import { knowledgeItems } from '../data/mockDataLifeOS';
import './LifeOS.css';

const typeConfig = {
  note:     { label: 'Note',     icon: FileText,  color: '#3d7fff', emoji: '📝' },
  bookmark: { label: 'Bookmark', icon: Bookmark,  color: '#2dd4a0', emoji: '🔖' },
  idea:     { label: 'Idée',     icon: Lightbulb, color: '#f5c842', emoji: '💡' },
  resource: { label: 'Ressource',icon: Link2,     color: '#a78bfa', emoji: '📎' },
};

const allTags = [...new Set(knowledgeItems.flatMap(i => i.tags))].sort();
const allCats = [...new Set(knowledgeItems.map(i => i.category))].sort();

function ItemCard({ item, onClick }) {
  const tc = typeConfig[item.type] || typeConfig.note;
  return (
    <div
      className="kb-card"
      style={{ borderTopColor: item.color }}
      onClick={() => onClick(item)}
    >
      <div className="kb-card-header">
        <div className="kb-type-badge" style={{ background: item.color + '18', color: item.color }}>
          <span>{tc.emoji}</span> {tc.label}
        </div>
        {item.pinned && <Pin size={13} color="var(--yellow)" />}
        <span className="kb-category">{item.category}</span>
      </div>

      <p className="kb-title">{item.title}</p>

      <p className="kb-preview">
        {item.content.replace(/#{1,3}\s/g, '').slice(0, 120)}…
      </p>

      {item.url && (
        <a href={item.url} className="kb-url" onClick={e => e.stopPropagation()}>
          <ExternalLink size={11} /> {item.url.replace('https://example.com/', '')}
        </a>
      )}

      {item.linkedProject && (
        <div className="kb-linked-project">
          <Link2 size={10} /> {item.linkedProject}
        </div>
      )}

      <div className="kb-tags">
        {item.tags.slice(0, 4).map(t => (
          <span key={t} className="kb-tag">#{t}</span>
        ))}
      </div>

      <div className="kb-footer">
        <span className="mono kb-date">{item.updatedAt}</span>
        <div className="kb-actions" onClick={e => e.stopPropagation()}>
          <button className="kb-action-btn"><Edit2 size={12} /></button>
          <button className="kb-action-btn danger"><Trash2 size={12} /></button>
        </div>
      </div>
    </div>
  );
}

function ItemDetail({ item, onClose }) {
  const tc = typeConfig[item.type] || typeConfig.note;

  // Rendu markdown simplifié
  const renderMd = (text) => {
    return text
      .split('\n')
      .map((line, i) => {
        if (line.startsWith('### ')) return <h4 key={i} className="kb-md-h3">{line.slice(4)}</h4>;
        if (line.startsWith('## '))  return <h3 key={i} className="kb-md-h2">{line.slice(3)}</h3>;
        if (line.startsWith('# '))   return <h2 key={i} className="kb-md-h1">{line.slice(2)}</h2>;
        if (line.startsWith('- [ ]')) return <div key={i} className="kb-md-todo">☐ {line.slice(6)}</div>;
        if (line.startsWith('- [x]')) return <div key={i} className="kb-md-todo done">☑ {line.slice(6)}</div>;
        if (line.startsWith('- '))   return <div key={i} className="kb-md-li">• {line.slice(2)}</div>;
        if (line.match(/^\d+\./))    return <div key={i} className="kb-md-li">{line}</div>;
        if (line === '')             return <div key={i} className="kb-md-br" />;
        // Bold
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <p key={i} className="kb-md-p">
            {parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}
          </p>
        );
      });
  };

  return (
    <div className="kb-detail fade-in">
      <div className="kb-detail-header" style={{ borderBottomColor: item.color + '55' }}>
        <div className="kb-type-badge lg" style={{ background: item.color + '18', color: item.color }}>
          <span>{tc.emoji}</span> {tc.label}
        </div>
        <h2 className="kb-detail-title">{item.title}</h2>
        <div className="kb-detail-meta">
          <span className="kb-category">{item.category}</span>
          <span className="mono kb-date">Créé {item.createdAt}</span>
          <span className="mono kb-date">Modifié {item.updatedAt}</span>
        </div>
        {item.linkedProject && (
          <div className="kb-linked-project"><Link2 size={11} /> Lié à : <strong>{item.linkedProject}</strong></div>
        )}
        {item.url && (
          <a href={item.url} className="kb-url-full" target="_blank" rel="noopener noreferrer">
            <ExternalLink size={13} /> {item.url}
          </a>
        )}
        <div className="kb-detail-tags">
          {item.tags.map(t => <span key={t} className="kb-tag">#{t}</span>)}
        </div>
      </div>
      <div className="kb-detail-content">
        {renderMd(item.content)}
      </div>
      <div className="kb-detail-actions">
        <button className="perso-add-btn"><Edit2 size={13} /> Modifier</button>
        <button className="kb-close-btn" onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
}

export default function KnowledgeBase() {
  const [search,     setSearch]    = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [tagFilter,  setTagFilter]  = useState(null);
  const [selected,   setSelected]   = useState(null);
  const [view,       setView]       = useState('grid');

  const filtered = knowledgeItems
    .filter(i => typeFilter === 'all' || i.type === typeFilter)
    .filter(i => !tagFilter || i.tags.includes(tagFilter))
    .filter(i =>
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.content.toLowerCase().includes(search.toLowerCase()) ||
      i.tags.some(t => t.includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });

  const byType = Object.entries(typeConfig).map(([type, cfg]) => ({
    type, ...cfg,
    count: knowledgeItems.filter(i => i.type === type).length,
  }));

  return (
    <div className="page">
      <Topbar title="Base de connaissances" subtitle={`${knowledgeItems.length} éléments · Notes, bookmarks, idées, ressources`} />
      <div className="page-content">

        {/* Stats */}
        <div className="kb-stats-strip">
          {byType.map(t => (
            <div key={t.type} className={`kb-stat-pill ${typeFilter === t.type ? 'active' : ''}`}
              style={typeFilter === t.type ? { borderColor: t.color, background: t.color + '14' } : {}}
              onClick={() => setTypeFilter(typeFilter === t.type ? 'all' : t.type)}
            >
              <span>{t.emoji}</span>
              <span style={{ color: t.color, fontWeight: 700 }}>{t.count}</span>
              <span>{t.label}s</span>
            </div>
          ))}
          <button className="perso-add-btn" style={{ marginLeft: 'auto' }}><Plus size={13} /> Ajouter</button>
        </div>

        <div className={`kb-layout ${selected ? 'with-detail' : ''}`}>
          <div className="kb-main">
            {/* Controls */}
            <div className="kb-controls">
              <div className="search-field">
                <Search size={13} />
                <input
                  placeholder="Rechercher dans toute la base…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div className="view-tabs">
                <button className={`view-tab ${view === 'grid' ? 'active' : ''}`} onClick={() => setView('grid')}>Grille</button>
                <button className={`view-tab ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>Liste</button>
              </div>
            </div>

            {/* Tags cloud */}
            <div className="kb-tags-cloud">
              <Tag size={12} color="var(--text-muted)" />
              {allTags.map(t => (
                <button
                  key={t}
                  className={`kb-tag-filter ${tagFilter === t ? 'active' : ''}`}
                  onClick={() => setTagFilter(tagFilter === t ? null : t)}
                >
                  #{t}
                </button>
              ))}
            </div>

            {/* Cards */}
            {view === 'grid' ? (
              <div className="kb-grid">
                {filtered.map(item => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onClick={i => setSelected(selected?.id === i.id ? null : i)}
                  />
                ))}
              </div>
            ) : (
              <div className="perso-card">
                {filtered.map(item => {
                  const tc = typeConfig[item.type];
                  return (
                    <div key={item.id} className="kb-list-row" onClick={() => setSelected(selected?.id === item.id ? null : item)}>
                      <span className="kb-list-emoji">{tc.emoji}</span>
                      <div className="kb-list-info">
                        <p className="kb-list-title">{item.title}</p>
                        <p className="kb-list-meta">{item.category} · {item.updatedAt}</p>
                      </div>
                      <div className="kb-tags">
                        {item.tags.slice(0, 3).map(t => <span key={t} className="kb-tag">#{t}</span>)}
                      </div>
                      {item.pinned && <Pin size={13} color="var(--yellow)" />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Détail */}
          {selected && (
            <ItemDetail item={selected} onClose={() => setSelected(null)} />
          )}
        </div>

      </div>
    </div>
  );
}