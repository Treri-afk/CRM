import React, { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, ComposedChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  Home, MapPin, TrendingUp, DollarSign, Wrench,
  Users, AlertTriangle, CheckCircle2, Clock,
  Plus, ArrowUpRight, Building2, Key, FileText
} from 'lucide-react';
import Topbar from '../components/layout/Topbar';
import { properties, tenants, repairs, rentalRevenue, propertyDocuments } from '../data/mockDataImmo';
import { useNavigate } from 'react-router-dom';
import './Immo.css';

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || p.fill }} className="chart-tooltip-value">
          {p.name} : {typeof p.value === 'number' ? `${p.value.toLocaleString('fr-FR')} ¥` : p.value}
        </p>
      ))}
    </div>
  );
};

const typeLabel = { appartement: 'Appt.', maison: 'Maison', studio: 'Studio' };
const statusCfg = {
  rented:  { label: 'Loué',    color: 'var(--green)',       bg: 'var(--green-dim)' },
  vacant:  { label: 'Vacant',  color: 'var(--yellow)',      bg: 'var(--yellow-dim)' },
  for_sale:{ label: 'À vendre',color: 'var(--accent-bright)',bg: 'var(--accent-dim)' },
};

function PropertyCard({ property, onClick }) {
  const navigate = useNavigate();
  const st       = statusCfg[property.status];
  const tenant   = tenants.find(t => t.propertyId === property.id);
  const propRepairs = repairs.filter(r => r.propertyId === property.id);
  const urgentRepairs = propRepairs.filter(r => r.status !== 'completed' && r.priority === 'high');
  const plusValue = property.currentValue - property.purchasePrice;
  const plusPct   = ((plusValue / property.purchasePrice) * 100).toFixed(1);

  return (
    <div className="immo-prop-card" onClick={onClick} style={{ '--prop-color': property.color }}>
      <div className="immo-prop-accent" style={{ background: property.color }} />
      <div className="immo-prop-body">
        <div className="immo-prop-header">
          <div className="immo-prop-icon" style={{ background: property.color + '20', color: property.color }}>
            <Home size={16} strokeWidth={1.8} />
          </div>
          <div className="immo-prop-info">
            <p className="immo-prop-name">{property.name}</p>
            <p className="immo-prop-address"><MapPin size={10} /> {property.city}, {property.district}</p>
          </div>
          <span className="immo-status-pill" style={{ color: st.color, background: st.bg }}>{st.label}</span>
        </div>

        <div className="immo-prop-stats">
          <div className="immo-prop-stat">
            <p className="mono">{property.surface} m²</p>
            <p>{property.rooms} pièces</p>
          </div>
          <div className="immo-prop-stat">
            <p className="mono">{(property.currentValue / 1000000).toFixed(1)}M ¥</p>
            <p>Valeur actuelle</p>
          </div>
          <div className="immo-prop-stat">
            <p className="mono" style={{ color: 'var(--green)' }}>+{plusPct}%</p>
            <p>Plus-value</p>
          </div>
        </div>

        {tenant && (
          <div className="immo-prop-tenant">
            <Key size={10} />
            <span>{tenant.name}</span>
            <span className="mono">{tenant.monthlyRent.toLocaleString('fr-FR')} ¥/mois</span>
          </div>
        )}

        {urgentRepairs.length > 0 && (
          <div className="immo-prop-alert">
            <AlertTriangle size={11} />
            <span>{urgentRepairs.length} réparation{urgentRepairs.length > 1 ? 's' : ''} urgente{urgentRepairs.length > 1 ? 's' : ''}</span>
          </div>
        )}

        <div className="immo-prop-footer">
          <span className="immo-prop-type">{typeLabel[property.type]}</span>
          <span className="immo-prop-year">Construit {property.yearBuilt}</span>
          <button
            className="immo-prop-detail-btn"
            onClick={e => { e.stopPropagation(); onClick(); }}
          >
            Détail <ArrowUpRight size={11} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ImmoDashboard() {
  const navigate = useNavigate();

  // KPIs
  const totalValue     = properties.reduce((s, p) => s + p.currentValue, 0);
  const totalPurchase  = properties.reduce((s, p) => s + p.purchasePrice, 0);
  const totalPlusValue = totalValue - totalPurchase;
  const rentedCount    = properties.filter(p => p.status === 'rented').length;
  const vacantCount    = properties.filter(p => p.status === 'vacant').length;
  const totalMonthlyRevenue = rentalRevenue[rentalRevenue.length - 1].total;
  const yearlyRevenue  = rentalRevenue.reduce((s, m) => s + m.total, 0);
  const totalCharges   = properties.reduce((s, p) => s + p.managementFeeMonthly, 0) * 7 +
                         properties.reduce((s, p) => s + p.taxAnnual, 0) * (7 / 12);
  const netRevenue     = yearlyRevenue - totalCharges -
                         repairs.filter(r => r.realCost).reduce((s, r) => s + r.realCost, 0);

  const openRepairs    = repairs.filter(r => r.status !== 'completed');
  const urgentRepairs  = openRepairs.filter(r => r.priority === 'high');

  // Rendement brut
  const annualGross    = totalMonthlyRevenue * 12;
  const grossYield     = ((annualGross / totalValue) * 100).toFixed(2);

  const occupancyRate  = Math.round((rentedCount / properties.length) * 100);

  return (
    <div className="page">
      <Topbar title="Parc Immobilier Japon" subtitle={`${properties.length} biens · ${(totalValue / 1000000).toFixed(1)}M ¥ de patrimoine`} />
      <div className="page-content">

        {/* ── KPIs ── */}
        <div className="immo-kpis stagger">
          {[
            { icon: Building2,    label: 'Patrimoine total',    value: `${(totalValue/1000000).toFixed(1)}M ¥`,          color: '#3d7fff',  sub: `+${(totalPlusValue/1000000).toFixed(1)}M ¥ plus-value` },
            { icon: DollarSign,   label: 'Revenus ce mois',     value: `${totalMonthlyRevenue.toLocaleString('fr-FR')} ¥`, color: '#2dd4a0',  sub: `${(yearlyRevenue/1000000).toFixed(2)}M ¥/an` },
            { icon: TrendingUp,   label: 'Rendement brut',      value: `${grossYield}%`,                                  color: '#a78bfa',  sub: 'Sur valeur actuelle' },
            { icon: Home,         label: 'Taux d\'occupation',  value: `${occupancyRate}%`,                               color: '#f5c842',  sub: `${rentedCount}/${properties.length} biens loués` },
            { icon: Wrench,       label: 'Travaux en cours',    value: openRepairs.length,                                 color: urgentRepairs.length > 0 ? 'var(--red)' : '#fb923c', sub: `${urgentRepairs.length} urgents` },
            { icon: FileText,     label: 'Documents',           value: propertyDocuments.length,                           color: '#8892aa',  sub: `${properties.length} biens` },
          ].map(({ icon: Icon, label, value, color, sub }) => (
            <div key={label} className="immo-kpi">
              <div className="immo-kpi-icon" style={{ background: color + '18', color }}><Icon size={15} strokeWidth={1.8} /></div>
              <div>
                <p className="immo-kpi-val mono">{value}</p>
                <p className="immo-kpi-label">{label}</p>
                <p className="immo-kpi-sub">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Alertes ── */}
        {urgentRepairs.length > 0 && (
          <div className="immo-alerts">
            {urgentRepairs.map(r => {
              const prop = properties.find(p => p.id === r.propertyId);
              return (
                <div key={r.id} className="immo-alert">
                  <AlertTriangle size={13} />
                  <span><strong>{prop?.name}</strong> — {r.title}</span>
                  <span className="immo-alert-status">
                    {r.status === 'in_progress' ? '🔧 En cours' : '📅 Planifié'}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Graphe revenus ── */}
        <div className="immo-charts-row">
          <div className="immo-card wide">
            <div className="immo-card-header">
              <div>
                <h3 className="immo-card-title">Revenus locatifs mensuels</h3>
                <p className="immo-card-sub">Par bien — 7 derniers mois</p>
              </div>
              <div className="immo-legend">
                {properties.map(p => (
                  <span key={p.id}><span className="immo-dot" style={{ background: p.color }} />{p.city}</span>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={rentalRevenue}
                margin={{ top: 5, right: 10, bottom: 0, left: -10 }}
              >
                <CartesianGrid stroke="#1e2740" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#4a5470', fontSize: 11, fontFamily: 'Syne' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#4a5470', fontSize: 10, fontFamily: 'Syne' }} axisLine={false} tickLine={false} tickFormatter={v => `${v/1000}k`} />
                <Tooltip content={<Tip />} />
                <Bar dataKey="shibuya"  name="Shibuya"  stackId="a" fill="#3d7fff" />
                <Bar dataKey="kyoto"    name="Kyoto"    stackId="a" fill="#2dd4a0" />
                <Bar dataKey="osaka"    name="Osaka"    stackId="a" fill="#a78bfa" />
                <Bar dataKey="sapporo"  name="Sapporo"  stackId="a" fill="#f5c842" />
                <Bar dataKey="fukuoka"  name="Fukuoka"  stackId="a" fill="#fb923c" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Résumé financier */}
          <div className="immo-card">
            <div className="immo-card-header">
              <h3 className="immo-card-title">Résumé financier</h3>
            </div>
            <div className="immo-finance-rows">
              {[
                { label: 'Revenus bruts (7 mois)', value: yearlyRevenue, color: 'var(--green)', sign: '+' },
                { label: 'Charges gestion', value: -properties.reduce((s,p) => s+p.managementFeeMonthly, 0)*7, color: 'var(--red)', sign: '' },
                { label: 'Taxes foncières', value: -Math.round(properties.reduce((s,p) => s+p.taxAnnual, 0) * 7/12), color: 'var(--red)', sign: '' },
                { label: 'Travaux réalisés', value: -repairs.filter(r => r.realCost).reduce((s,r) => s+r.realCost, 0), color: 'var(--red)', sign: '' },
              ].map(({ label, value, color, sign }) => (
                <div key={label} className="immo-finance-row">
                  <span>{label}</span>
                  <span className="mono" style={{ color }}>
                    {value >= 0 ? sign : ''}{Math.abs(value).toLocaleString('fr-FR')} ¥
                  </span>
                </div>
              ))}
              <div className="immo-finance-row total">
                <span>Revenu net estimé</span>
                <span className="mono" style={{ color: netRevenue >= 0 ? 'var(--green)' : 'var(--red)' }}>
                  {netRevenue >= 0 ? '+' : ''}{netRevenue.toLocaleString('fr-FR')} ¥
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Biens ── */}
        <div className="immo-section-header">
          <div>
            <h3 className="immo-section-title">Mes biens</h3>
            <p className="immo-section-sub">{properties.length} propriétés au Japon</p>
          </div>
          <button className="immo-add-btn" onClick={() => navigate('/immo/new')}>
            <Plus size={14} /> Ajouter un bien
          </button>
        </div>

        <div className="immo-props-grid">
          {properties.map(p => (
            <PropertyCard
              key={p.id}
              property={p}
              onClick={() => navigate(`/immo/${p.id}`)}
            />
          ))}
        </div>

        {/* ── Travaux récents ── */}
        <div className="immo-card">
          <div className="immo-card-header">
            <h3 className="immo-card-title">Travaux & Réparations</h3>
            <button className="immo-link-btn" onClick={() => navigate('/immo/repairs')}>
              Voir tout <ArrowUpRight size={12} />
            </button>
          </div>
          <div className="immo-repairs-list">
            {repairs.slice(0, 5).map(r => {
              const prop = properties.find(p => p.id === r.propertyId);
              const catColors = {
                plomberie: '#3d7fff', électricité: '#f5c842', toiture: '#a78bfa',
                peinture: '#2dd4a0', serrurerie: '#fb923c', inspection: '#8892aa',
              };
              const stCfg = {
                completed:   { label: 'Terminé',    color: 'var(--green)',  icon: CheckCircle2 },
                in_progress: { label: 'En cours',   color: 'var(--yellow)', icon: Clock },
                planned:     { label: 'Planifié',   color: 'var(--accent)', icon: Clock },
              };
              const sc  = stCfg[r.status];
              const StIcon = sc.icon;
              return (
                <div key={r.id} className="immo-repair-row">
                  <div className="immo-repair-dot" style={{ background: catColors[r.category] || '#8892aa' }} />
                  <div className="immo-repair-info">
                    <p className="immo-repair-title">{r.title}</p>
                    <p className="immo-repair-prop">{prop?.name} · {r.contractor}</p>
                  </div>
                  <div className="immo-repair-cost">
                    {r.realCost
                      ? <span className="mono">{r.realCost.toLocaleString('fr-FR')} ¥</span>
                      : <span className="mono" style={{ color: 'var(--text-muted)' }}>~{r.estimatedCost.toLocaleString('fr-FR')} ¥</span>
                    }
                  </div>
                  <div className="immo-repair-priority" style={{ color: r.priority === 'high' ? 'var(--red)' : r.priority === 'medium' ? 'var(--yellow)' : 'var(--text-muted)' }}>
                    {r.priority === 'high' ? '🔴' : r.priority === 'medium' ? '🟡' : '🟢'}
                  </div>
                  <span className="immo-repair-status" style={{ color: sc.color, background: sc.color + '18' }}>
                    <StIcon size={11} strokeWidth={2} /> {sc.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
