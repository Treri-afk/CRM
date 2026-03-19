import React, { useState } from 'react';
import {
  FileText, Search, Plus, Filter,
  Scale, ClipboardList, ShieldCheck,
  Microscope, Download, Eye, Folder
} from 'lucide-react';
import Topbar from '../components/layout/Topbar';
import { propertyDocuments, properties } from '../data/mockDataImmo';
import './Immo.css';

const typeConfig = {
  legal:      { label: 'Légal',       icon: Scale,         color: '#3d7fff', emoji: '⚖️' },
  lease:      { label: 'Bail',        icon: ClipboardList, color: '#2dd4a0', emoji: '📋' },
  diagnostic: { label: 'Diagnostic',  icon: Microscope,    color: '#a78bfa', emoji: '🔍' },
  insurance:  { label: 'Assurance',   icon: ShieldCheck,   color: '#f5c842', emoji: '🛡️' },
  fiscal:     { label: 'Fiscal',      icon: FileText,      color: '#fb923c', emoji: '📊' },
  other:      { label: 'Autre',       icon: FileText,      color: '#8892aa', emoji: '📄' },
};

// Docs supplémentaires simulés
const allDocs = [
  ...propertyDocuments,
  { id: 13, propertyId: 1, name: 'Déclaration revenus fonciers 2023', type: 'fiscal',     date: '2024-03-15', size: '340 KB' },
  { id: 14, propertyId: 2, name: 'Devis peinture façade',             type: 'other',      date: '2024-02-20', size: '220 KB' },
  { id: 15, propertyId: 3, name: 'Licence exploitation meublé',       type: 'legal',      date: '2023-03-01', size: '520 KB' },
  { id: 16, propertyId: 4, name: 'Rapport inspection pré-location',   type: 'diagnostic', date: '2024-03-05', size: '1.8 MB' },
  { id: 17, propertyId: 5, name: 'Assurance PNO 2024',                type: 'insurance',  date: '2024-01-01', size: '580 KB' },
  { id: 18, propertyId: 5, name: 'Diagnostic plomb & amiante',        type: 'diagnostic', date: '2023-05-20', size: '2.1 MB' },
];

export default function ImmoDocuments() {
  const [search,      setSearch]      = useState('');
  const [typeFilter,  setTypeFilter]  = useState('all');
  const [propFilter,  setPropFilter]  = useState('all');
  const [view,        setView]        = useState('grid');

  const filtered = allDocs
    .filter(d => typeFilter === 'all' || d.type === typeFilter)
    .filter(d => propFilter === 'all' || d.propertyId === Number(propFilter))
    .filter(d => d.name.toLowerCase().includes(search.toLowerCase()));

  // Stats
  const byType = Object.entries(typeConfig).map(([type, cfg]) => ({
    type, ...cfg,
    count: allDocs.filter(d => d.type === type).length,
  })).filter(t => t.count > 0);

  // Groupés par bien
  const byProperty = properties.map(p => ({
    property: p,
    docs: allDocs.filter(d => d.propertyId === p.id),
  }));

  return (
    <div className="page">
      <Topbar title="Documents" subtitle={`${allDocs.length} documents · ${properties.length} biens`} />
      <div className="page-content">

        {/* ── Stat strips ── */}
        <div className="immo-summary-strip stagger">
          <div className="iss-stat">
            <p className="iss-val mono">{allDocs.length}</p>
            <p className="iss-lbl">Documents total</p>
          </div>
          {byType.map(t => (
            <div key={t.type} className="iss-stat">
              <p className="iss-val mono" style={{ color: t.color }}>{t.emoji} {t.count}</p>
              <p className="iss-lbl">{t.label}</p>
            </div>
          ))}
          <button className="immo-add-btn"><Plus size={14} /> Ajouter</button>
        </div>

        {/* ── Controls ── */}
        <div className="immo-controls-row">
          <div className="search-field">
            <Search size={13} />
            <input
              placeholder="Rechercher un document..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="filter-tabs">
            <button className={`filter-tab ${typeFilter === 'all' ? 'active' : ''}`} onClick={() => setTypeFilter('all')}>Tous</button>
            {byType.map(t => (
              <button key={t.type} className={`filter-tab ${typeFilter === t.type ? 'active' : ''}`} onClick={() => setTypeFilter(t.type)}>
                {t.emoji} {t.label}
              </button>
            ))}
          </div>
          <select className="immo-sort-select" value={propFilter} onChange={e => setPropFilter(e.target.value)}>
            <option value="all">Tous les biens</option>
            {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <div className="view-tabs">
            <button className={`view-tab ${view === 'grid' ? 'active' : ''}`} onClick={() => setView('grid')}>Grille</button>
            <button className={`view-tab ${view === 'grouped' ? 'active' : ''}`} onClick={() => setView('grouped')}>Par bien</button>
          </div>
        </div>

        {/* ── Vue grille ── */}
        {view === 'grid' && (
          <div className="immo-docs-grid-full">
            {filtered.map(doc => {
              const prop = properties.find(p => p.id === doc.propertyId);
              const tc   = typeConfig[doc.type] || typeConfig.other;
              return (
                <div key={doc.id} className="immo-doc-card-full">
                  <div className="idcf-type-badge" style={{ background: tc.color + '18', color: tc.color }}>
                    <span>{tc.emoji}</span>
                    <span>{tc.label}</span>
                  </div>
                  <div className="idcf-icon-wrap" style={{ color: tc.color }}>
                    <FileText size={28} strokeWidth={1.2} />
                  </div>
                  <p className="idcf-name">{doc.name}</p>
                  <div className="idcf-meta">
                    <span className="idcf-prop" style={{ color: prop?.color }}>
                      <Folder size={10} /> {prop?.name}
                    </span>
                    <span className="mono idcf-size">{doc.size}</span>
                  </div>
                  <p className="mono idcf-date">{doc.date}</p>
                  <div className="idcf-actions">
                    <button className="idcf-btn"><Eye size={13} /> Voir</button>
                    <button className="idcf-btn primary"><Download size={13} /> Télécharger</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Vue par bien ── */}
        {view === 'grouped' && (
          <div className="immo-docs-grouped">
            {byProperty.map(({ property: p, docs }) => {
              const propDocs = docs.filter(d =>
                (typeFilter === 'all' || d.type === typeFilter) &&
                d.name.toLowerCase().includes(search.toLowerCase())
              );
              if (propDocs.length === 0) return null;
              return (
                <div key={p.id} className="immo-docs-group">
                  <div className="idg-header" style={{ borderLeftColor: p.color }}>
                    <div className="idg-prop-dot" style={{ background: p.color }} />
                    <h3 className="idg-prop-name">{p.name}</h3>
                    <span className="idg-count">{propDocs.length} doc{propDocs.length > 1 ? 's' : ''}</span>
                    <button className="immo-add-btn-sm"><Plus size={12} /> Ajouter</button>
                  </div>
                  <div className="idg-docs">
                    {propDocs.map(doc => {
                      const tc = typeConfig[doc.type] || typeConfig.other;
                      return (
                        <div key={doc.id} className="idg-doc-row">
                          <span className="idg-doc-emoji">{tc.emoji}</span>
                          <div className="idg-doc-info">
                            <p className="idg-doc-name">{doc.name}</p>
                            <p className="idg-doc-meta mono">{tc.label} · {doc.date} · {doc.size}</p>
                          </div>
                          <div className="idg-doc-actions">
                            <button className="idcf-btn"><Eye size={12} /></button>
                            <button className="idcf-btn primary"><Download size={12} /></button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}