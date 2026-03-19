import React, { useState } from 'react';
import {
  Home, MapPin, Plus, Search, Filter,
  TrendingUp, TrendingDown, Eye, ArrowUpRight,
  Building2, Users, Wrench, Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../components/layout/Topbar';
import { properties, tenants, repairs } from '../data/mockDataImmo';
import './Immo.css';

const typeLabel  = { appartement: 'Appartement', maison: 'Maison', studio: 'Studio' };
const statusCfg  = {
  rented:  { label: 'Loué',   color: 'var(--green)',  bg: 'var(--green-dim)' },
  vacant:  { label: 'Vacant', color: 'var(--yellow)', bg: 'var(--yellow-dim)' },
};

export default function ImmoProperties() {
  const navigate = useNavigate();
  const [search,  setSearch]  = useState('');
  const [filter,  setFilter]  = useState('all');
  const [view,    setView]    = useState('grid');
  const [sortBy,  setSortBy]  = useState('value');

  const filtered = properties
    .filter(p => filter === 'all' || p.status === filter || p.type === filter)
    .filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'value')    return b.currentValue - a.currentValue;
      if (sortBy === 'yield')    return getYield(b) - getYield(a);
      if (sortBy === 'plusvalue') return (b.currentValue - b.purchasePrice) - (a.currentValue - a.purchasePrice);
      if (sortBy === 'name')     return a.name.localeCompare(b.name);
      return 0;
    });

  function getYield(p) {
    const t = tenants.find(t => t.propertyId === p.id);
    if (!t) return 0;
    return (t.monthlyRent * 12 / p.currentValue) * 100;
  }

  function getNetYield(p) {
    const t = tenants.find(t => t.propertyId === p.id);
    if (!t) return 0;
    const annual = t.monthlyRent * 12;
    const charges = (p.managementFeeMonthly * 12) + p.taxAnnual + 28000;
    return ((annual - charges) / p.currentValue) * 100;
  }

  const totalValue    = properties.reduce((s, p) => s + p.currentValue, 0);
  const totalPurchase = properties.reduce((s, p) => s + p.purchasePrice, 0);
  const avgYield      = (properties.reduce((s, p) => s + getYield(p), 0) / properties.length).toFixed(2);

  return (
    <div className="page">
      <Topbar title="Mes Biens" subtitle={`${properties.length} propriétés · ${(totalValue / 1000000).toFixed(1)}M ¥`} />
      <div className="page-content">

        {/* Summary strip */}
        <div className="immo-summary-strip stagger">
          <div className="iss-stat">
            <p className="iss-val mono">{properties.length}</p>
            <p className="iss-lbl">Biens</p>
          </div>
          <div className="iss-stat">
            <p className="iss-val mono">{(totalValue / 1000000).toFixed(1)}M ¥</p>
            <p className="iss-lbl">Valeur patrimoine</p>
          </div>
          <div className="iss-stat">
            <p className="iss-val mono" style={{ color: 'var(--green)' }}>
              +{((totalValue - totalPurchase) / 1000000).toFixed(1)}M ¥
            </p>
            <p className="iss-lbl">Plus-value totale</p>
          </div>
          <div className="iss-stat">
            <p className="iss-val mono">{avgYield}%</p>
            <p className="iss-lbl">Rendement brut moy.</p>
          </div>
          <div className="iss-stat">
            <p className="iss-val mono">{properties.filter(p => p.status === 'rented').length}/{properties.length}</p>
            <p className="iss-lbl">Taux d'occupation</p>
          </div>
          <button className="immo-add-btn" onClick={() => navigate('/immo/new')}>
            <Plus size={14} /> Ajouter un bien
          </button>
        </div>

        {/* Controls */}
        <div className="immo-controls-row">
          <div className="search-field">
            <Search size={13} />
            <input
              placeholder="Rechercher un bien, une ville..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="filter-tabs">
            {[
              { id: 'all',          label: 'Tous' },
              { id: 'rented',       label: 'Loués' },
              { id: 'vacant',       label: 'Vacants' },
              { id: 'appartement',  label: 'Appartements' },
              { id: 'maison',       label: 'Maisons' },
              { id: 'studio',       label: 'Studios' },
            ].map(f => (
              <button key={f.id} className={`filter-tab ${filter === f.id ? 'active' : ''}`} onClick={() => setFilter(f.id)}>
                {f.label}
              </button>
            ))}
          </div>
          <select className="immo-sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="value">Valeur</option>
            <option value="yield">Rendement</option>
            <option value="plusvalue">Plus-value</option>
            <option value="name">Nom</option>
          </select>
          <div className="view-tabs">
            <button className={`view-tab ${view === 'grid' ? 'active' : ''}`} onClick={() => setView('grid')}>Grille</button>
            <button className={`view-tab ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>Liste</button>
          </div>
        </div>

        {/* Grid view */}
        {view === 'grid' && (
          <div className="immo-props-grid">
            {filtered.map(p => {
              const tenant      = tenants.find(t => t.propertyId === p.id);
              const propRepairs = repairs.filter(r => r.propertyId === p.id && r.status !== 'completed');
              const grossYield  = getYield(p).toFixed(2);
              const netYield    = getNetYield(p).toFixed(2);
              const plusValue   = p.currentValue - p.purchasePrice;
              const plusPct     = ((plusValue / p.purchasePrice) * 100).toFixed(1);
              const st          = statusCfg[p.status] || statusCfg.vacant;

              return (
                <div key={p.id} className="immo-prop-card-full" onClick={() => navigate(`/immo/${p.id}`)} style={{ '--prop-color': p.color }}>
                  {/* Bande couleur top */}
                  <div className="ipcf-top-bar" style={{ background: p.color }} />

                  <div className="ipcf-body">
                    {/* Header */}
                    <div className="ipcf-header">
                      <div className="ipcf-icon" style={{ background: p.color + '20', color: p.color }}>
                        <Home size={18} strokeWidth={1.6} />
                      </div>
                      <div className="ipcf-title">
                        <p className="ipcf-name">{p.name}</p>
                        <p className="ipcf-addr"><MapPin size={10} /> {p.city} · {p.district}</p>
                      </div>
                      <span className="immo-status-pill" style={{ color: st.color, background: st.bg }}>{st.label}</span>
                    </div>

                    {/* Stats principales */}
                    <div className="ipcf-main-stats">
                      <div className="ipcf-mstat">
                        <p className="mono" style={{ color: p.color }}>{(p.currentValue / 1000000).toFixed(1)}M ¥</p>
                        <p>Valeur</p>
                      </div>
                      <div className="ipcf-mstat">
                        <p className="mono" style={{ color: 'var(--green)' }}>+{plusPct}%</p>
                        <p>Plus-value</p>
                      </div>
                      <div className="ipcf-mstat">
                        <p className="mono">{grossYield}%</p>
                        <p>Rdt brut</p>
                      </div>
                      <div className="ipcf-mstat">
                        <p className="mono" style={{ color: 'var(--green)' }}>{netYield}%</p>
                        <p>Rdt net</p>
                      </div>
                    </div>

                    {/* Infos */}
                    <div className="ipcf-info-row">
                      <span><Building2 size={11} /> {typeLabel[p.type]}</span>
                      <span><Star size={11} /> {p.surface} m²</span>
                      <span>{p.rooms} pièces</span>
                    </div>

                    {/* Locataire */}
                    {tenant ? (
                      <div className="ipcf-tenant">
                        <Users size={11} />
                        <span>{tenant.name}</span>
                        <span className="mono">{tenant.monthlyRent.toLocaleString('fr-FR')} ¥/mois</span>
                        {tenant.leaseEnd && (
                          <span className="ipcf-lease-end">Bail → {tenant.leaseEnd}</span>
                        )}
                      </div>
                    ) : (
                      <div className="ipcf-vacant">Aucun locataire · Vacant</div>
                    )}

                    {/* Alertes */}
                    {propRepairs.length > 0 && (
                      <div className="ipcf-repairs-badge">
                        <Wrench size={11} /> {propRepairs.length} travaux en cours
                      </div>
                    )}

                    {/* Footer */}
                    <div className="ipcf-footer">
                      <span className="ipcf-built">Construit {p.yearBuilt}</span>
                      <span className="ipcf-purchase mono">{(p.purchasePrice / 1000000).toFixed(1)}M ¥ achat</span>
                      <button className="ipcf-open-btn"><ArrowUpRight size={13} /></button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* List view */}
        {view === 'list' && (
          <div className="immo-card">
            <table className="immo-table">
              <thead>
                <tr>
                  <th>Bien</th>
                  <th>Type</th>
                  <th>Ville</th>
                  <th>Surface</th>
                  <th>Valeur</th>
                  <th>Plus-value</th>
                  <th>Rdt brut</th>
                  <th>Rdt net</th>
                  <th>Loyer/mois</th>
                  <th>Statut</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => {
                  const tenant   = tenants.find(t => t.propertyId === p.id);
                  const plusPct  = (((p.currentValue - p.purchasePrice) / p.purchasePrice) * 100).toFixed(1);
                  const st       = statusCfg[p.status] || statusCfg.vacant;
                  return (
                    <tr key={p.id} className="immo-table-row" onClick={() => navigate(`/immo/${p.id}`)}>
                      <td>
                        <div className="immo-table-name-cell">
                          <div className="immo-table-dot" style={{ background: p.color }} />
                          <span>{p.name}</span>
                        </div>
                      </td>
                      <td className="immo-table-muted">{typeLabel[p.type]}</td>
                      <td className="immo-table-muted">{p.city}</td>
                      <td className="mono">{p.surface} m²</td>
                      <td className="mono">{(p.currentValue / 1000000).toFixed(1)}M ¥</td>
                      <td className="mono" style={{ color: 'var(--green)' }}>+{plusPct}%</td>
                      <td className="mono">{getYield(p).toFixed(2)}%</td>
                      <td className="mono" style={{ color: 'var(--green)' }}>{getNetYield(p).toFixed(2)}%</td>
                      <td className="mono">{tenant ? `${tenant.monthlyRent.toLocaleString('fr-FR')} ¥` : '—'}</td>
                      <td><span className="immo-status-pill" style={{ color: st.color, background: st.bg }}>{st.label}</span></td>
                      <td><ArrowUpRight size={14} color="var(--text-muted)" /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}