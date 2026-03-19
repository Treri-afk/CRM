import React, { useState } from 'react';
import {
  Wrench, AlertTriangle, CheckCircle2, Clock,
  Plus, Filter, BarChart2, TrendingUp, TrendingDown,
  Calendar, User, FileText, ChevronDown, ChevronUp
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import Topbar from '../components/layout/Topbar';
import { repairs, properties, maintenanceAlerts } from '../data/mockDataImmo';
import './Immo.css';

const statusCfg = {
  completed:   { label: 'Terminé',   color: 'var(--green)',  bg: 'var(--green-dim)',  icon: CheckCircle2 },
  in_progress: { label: 'En cours',  color: 'var(--yellow)', bg: 'var(--yellow-dim)', icon: Clock },
  planned:     { label: 'Planifié',  color: 'var(--accent)', bg: 'var(--accent-dim)', icon: Calendar },
};

const categoryCfg = {
  plomberie:   { color: '#3d7fff', emoji: '🔧' },
  électricité: { color: '#f5c842', emoji: '⚡' },
  toiture:     { color: '#a78bfa', emoji: '🏠' },
  peinture:    { color: '#2dd4a0', emoji: '🎨' },
  serrurerie:  { color: '#fb923c', emoji: '🔐' },
  inspection:  { color: '#8892aa', emoji: '🔍' },
  climatisation:{ color: '#69C9D0', emoji: '❄️' },
  chauffage:   { color: '#ff4d6a', emoji: '🔥' },
  structure:   { color: '#a78bfa', emoji: '🏗️' },
  ventilation: { color: '#2dd4a0', emoji: '💨' },
};

const priorityCfg = {
  high:   { label: 'Urgent',  color: 'var(--red)',    dot: '🔴' },
  medium: { label: 'Moyen',   color: 'var(--yellow)', dot: '🟡' },
  low:    { label: 'Bas',     color: 'var(--green)',  dot: '🟢' },
};

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.fill }} className="chart-tooltip-value">
          {p.name} : {p.value?.toLocaleString('fr-FR')} ¥
        </p>
      ))}
    </div>
  );
};

export default function ImmoRepairs() {
  const navigate   = useNavigate();
  const [filter,   setFilter]   = useState('all');
  const [propFilter, setPropFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);

  // KPIs
  const totalCompleted  = repairs.filter(r => r.status === 'completed');
  const totalOpen       = repairs.filter(r => r.status !== 'completed');
  const totalBudget     = repairs.reduce((s, r) => s + r.estimatedCost, 0);
  const totalSpent      = repairs.filter(r => r.realCost).reduce((s, r) => s + r.realCost, 0);
  const budgetVariance  = totalSpent - repairs.filter(r => r.realCost).reduce((s, r) => s + r.estimatedCost, 0);
  const urgentOpen      = totalOpen.filter(r => r.priority === 'high');
  const maintenanceDue  = maintenanceAlerts.filter(m => !m.done && new Date(m.dueDate) <= new Date(Date.now() + 30 * 86400000));

  // Budget par catégorie
  const budgetByCategory = Object.entries(
    repairs.reduce((acc, r) => {
      acc[r.category] = acc[r.category] || { estimated: 0, real: 0 };
      acc[r.category].estimated += r.estimatedCost;
      if (r.realCost) acc[r.category].real += r.realCost;
      return acc;
    }, {})
  ).map(([cat, vals]) => ({ category: cat, estimé: vals.estimated, réel: vals.real || null }));

  // Planning mensuel
  const planningData = repairs
    .filter(r => r.plannedDate)
    .reduce((acc, r) => {
      const month = r.plannedDate.slice(0, 7);
      acc[month] = acc[month] || { month: month.slice(0, 7), planned: 0, done: 0 };
      if (r.status === 'completed') acc[month].done += r.realCost || r.estimatedCost;
      else acc[month].planned += r.estimatedCost;
      return acc;
    }, {});
  const planningChart = Object.values(planningData)
    .sort((a, b) => a.month.localeCompare(b.month))
    .map(d => ({ ...d, month: d.month.replace('-', '/') }));

  const filtered = repairs
    .filter(r => filter === 'all' || r.status === filter || r.priority === filter)
    .filter(r => propFilter === 'all' || r.propertyId === Number(propFilter));

  return (
    <div className="page">
      <Topbar title="Travaux & Réparations" subtitle={`${repairs.length} interventions · ${totalSpent.toLocaleString('fr-FR')} ¥ dépensés`} />
      <div className="page-content">

        {/* ── KPIs ── */}
        <div className="immo-kpis stagger">
          {[
            { icon: Wrench,        label: 'Travaux ouverts',    value: totalOpen.length,                                  color: 'var(--yellow)', sub: `${totalCompleted.length} terminés` },
            { icon: AlertTriangle, label: 'Urgents',            value: urgentOpen.length,                                 color: 'var(--red)',    sub: 'Priorité haute' },
            { icon: BarChart2,     label: 'Budget total estimé',value: `${(totalBudget/1000000).toFixed(2)}M ¥`,          color: 'var(--accent)', sub: 'Tous travaux' },
            { icon: CheckCircle2,  label: 'Total dépensé',      value: `${(totalSpent/1000000).toFixed(2)}M ¥`,           color: 'var(--green)',  sub: 'Travaux terminés' },
            { icon: budgetVariance >= 0 ? TrendingUp : TrendingDown, label: 'Écart budget', value: `${budgetVariance >= 0 ? '+' : ''}${budgetVariance.toLocaleString('fr-FR')} ¥`, color: budgetVariance > 0 ? 'var(--red)' : 'var(--green)', sub: budgetVariance > 0 ? 'Dépassement' : 'Dans le budget' },
            { icon: Calendar,      label: 'Maintenance à venir', value: maintenanceDue.length,                            color: 'var(--purple)', sub: 'Dans les 30 jours' },
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

        {/* ── Alertes maintenance préventive ── */}
        {maintenanceDue.length > 0 && (
          <div className="immo-maint-banner">
            <div className="immo-maint-banner-title">
              <Calendar size={14} /> <strong>{maintenanceDue.length} maintenance{maintenanceDue.length > 1 ? 's' : ''} prévue{maintenanceDue.length > 1 ? 's' : ''}</strong> dans les 30 prochains jours
            </div>
            <div className="immo-maint-items">
              {maintenanceDue.map(m => {
                const prop = properties.find(p => p.id === m.propertyId);
                const cat  = categoryCfg[m.category] || { color: '#8892aa', emoji: '🔧' };
                const pri  = priorityCfg[m.priority];
                return (
                  <div key={m.id} className="immo-maint-item">
                    <span className="immo-maint-emoji">{cat.emoji}</span>
                    <div>
                      <p className="immo-maint-title">{m.title}</p>
                      <p className="immo-maint-prop">{prop?.name}</p>
                    </div>
                    <span className="immo-maint-date mono">{m.dueDate}</span>
                    <span className="immo-maint-cost mono">~{m.estimatedCost.toLocaleString('fr-FR')} ¥</span>
                    <span style={{ color: pri.color, fontSize: 12, fontWeight: 700 }}>{pri.dot}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Graphiques ── */}
        <div className="immo-charts-row">
          {/* Budget par catégorie */}
          <div className="immo-card wide">
            <div className="immo-card-header">
              <h3 className="immo-card-title">Budget par catégorie</h3>
              <p className="immo-card-sub">Estimé vs réel</p>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={budgetByCategory} margin={{ top: 5, right: 10, bottom: 20, left: -10 }}>
                <CartesianGrid stroke="#1e2740" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="category" tick={{ fill: '#4a5470', fontSize: 10, fontFamily: 'Syne' }} axisLine={false} tickLine={false} angle={-20} textAnchor="end" />
                <YAxis tick={{ fill: '#4a5470', fontSize: 10, fontFamily: 'Syne' }} axisLine={false} tickLine={false} tickFormatter={v => `${v/1000}k`} />
                <Tooltip content={<Tip />} />
                <Bar dataKey="estimé" name="Estimé" fill="#3d7fff" opacity={0.5} radius={[2,2,0,0]} />
                <Bar dataKey="réel"   name="Réel"   radius={[2,2,0,0]}>
                  {budgetByCategory.map((entry, i) => (
                    <Cell key={i} fill={entry.réel > entry.estimé ? 'var(--red)' : 'var(--green)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Planning mensuel */}
          <div className="immo-card">
            <div className="immo-card-header">
              <h3 className="immo-card-title">Planning mensuel</h3>
              <p className="immo-card-sub">Dépenses planifiées vs réalisées</p>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={planningChart} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <CartesianGrid stroke="#1e2740" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#4a5470', fontSize: 10, fontFamily: 'Syne' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#4a5470', fontSize: 10, fontFamily: 'Syne' }} axisLine={false} tickLine={false} tickFormatter={v => `${v/1000}k`} />
                <Tooltip content={<Tip />} />
                <Bar dataKey="done"    name="Réalisé"  fill="var(--green)" opacity={0.85} radius={[2,2,0,0]} />
                <Bar dataKey="planned" name="Planifié" fill="var(--accent)" opacity={0.5} radius={[2,2,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Planning visuel (timeline) ── */}
        <div className="immo-card">
          <div className="immo-card-header">
            <h3 className="immo-card-title">Planning des interventions</h3>
            <p className="immo-card-sub">Vue chronologique</p>
          </div>
          <div className="immo-timeline">
            {[...repairs]
              .sort((a, b) => new Date(a.plannedDate) - new Date(b.plannedDate))
              .map(r => {
                const prop = properties.find(p => p.id === r.propertyId);
                const sc   = statusCfg[r.status];
                const Icon = sc.icon;
                const cat  = categoryCfg[r.category] || { color: '#8892aa', emoji: '🔧' };
                const over = r.realCost && r.realCost > r.estimatedCost;
                return (
                  <div key={r.id} className="immo-tl-item">
                    <div className="immo-tl-dot" style={{ background: sc.color }} />
                    <div className="immo-tl-line" />
                    <div className="immo-tl-card" style={{ borderLeftColor: cat.color }}>
                      <div className="immo-tl-card-header">
                        <span className="immo-tl-emoji">{cat.emoji}</span>
                        <p className="immo-tl-title">{r.title}</p>
                        <span className="immo-repair-status" style={{ color: sc.color, background: sc.color + '18' }}>
                          <Icon size={10} strokeWidth={2} /> {sc.label}
                        </span>
                        <span className="mono immo-tl-date">{r.plannedDate}</span>
                      </div>
                      <div className="immo-tl-card-body">
                        <span className="immo-tl-prop" style={{ color: prop?.color }}>{prop?.name}</span>
                        <span className="immo-tl-contractor"><User size={10} /> {r.contractor}</span>
                        <span className="mono immo-tl-cost">
                          Estimé : {r.estimatedCost.toLocaleString('fr-FR')} ¥
                          {r.realCost && (
                            <> · Réel : <span style={{ color: over ? 'var(--red)' : 'var(--green)' }}>{r.realCost.toLocaleString('fr-FR')} ¥</span>
                              {over && ' ⚠️'}
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            }
          </div>
        </div>

        {/* ── Filtres + liste ── */}
        <div className="immo-section-header">
          <h3 className="immo-section-title">Toutes les interventions</h3>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <select className="immo-sort-select" value={propFilter} onChange={e => setPropFilter(e.target.value)}>
              <option value="all">Tous les biens</option>
              {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <div className="filter-tabs">
              {[
                { id: 'all',         label: 'Tous' },
                { id: 'in_progress', label: 'En cours' },
                { id: 'planned',     label: 'Planifiés' },
                { id: 'completed',   label: 'Terminés' },
                { id: 'high',        label: '🔴 Urgents' },
              ].map(f => (
                <button key={f.id} className={`filter-tab ${filter === f.id ? 'active' : ''}`} onClick={() => setFilter(f.id)}>
                  {f.label}
                </button>
              ))}
            </div>
            <button className="immo-add-btn-sm"><Plus size={13} /> Nouvelle réparation</button>
          </div>
        </div>

        <div className="immo-repairs-cards">
          {filtered.map(r => {
            const prop = properties.find(p => p.id === r.propertyId);
            const sc   = statusCfg[r.status];
            const Icon = sc.icon;
            const cat  = categoryCfg[r.category] || { color: '#8892aa', emoji: '🔧' };
            const over = r.realCost && r.realCost > r.estimatedCost;
            const isExp = expanded === r.id;

            return (
              <div key={r.id} className="immo-repair-card-full">
                <div className="immo-rcf-header" onClick={() => setExpanded(isExp ? null : r.id)}>
                  <span className="immo-rcf-emoji">{cat.emoji}</span>
                  <div className="immo-rcf-info">
                    <p className="immo-rcf-title">{r.title}</p>
                    <p className="immo-rcf-prop" style={{ color: prop?.color }}>{prop?.name}</p>
                  </div>
                  <div className="immo-rcf-right">
                    <span className={`immo-rcf-priority ${r.priority}`}>{priorityCfg[r.priority].dot}</span>
                    <span className="immo-repair-status" style={{ color: sc.color, background: sc.color + '18' }}>
                      <Icon size={10} strokeWidth={2} /> {sc.label}
                    </span>
                    <div className="immo-rcf-budget">
                      {r.realCost
                        ? <span className="mono" style={{ color: over ? 'var(--red)' : 'var(--green)' }}>{r.realCost.toLocaleString('fr-FR')} ¥ {over ? '↑' : '✓'}</span>
                        : <span className="mono" style={{ color: 'var(--text-muted)' }}>~{r.estimatedCost.toLocaleString('fr-FR')} ¥</span>
                      }
                    </div>
                    <span className="mono immo-rcf-date">{r.plannedDate}</span>
                    {isExp ? <ChevronUp size={14} color="var(--text-muted)" /> : <ChevronDown size={14} color="var(--text-muted)" />}
                  </div>
                </div>

                {isExp && (
                  <div className="immo-rcf-detail fade-in">
                    <p className="immo-rcf-desc">{r.description}</p>
                    <div className="immo-repair-card-grid">
                      {[
                        ['Catégorie',     r.category],
                        ['Signalé le',    r.reportedDate],
                        ['Planifié le',   r.plannedDate],
                        ['Terminé le',    r.completedDate || '—'],
                        ['Prestataire',   r.contractor || 'À définir'],
                        ['Téléphone',     r.contractorPhone || '—'],
                        ['Coût estimé',   `${r.estimatedCost.toLocaleString('fr-FR')} ¥`],
                        ['Coût réel',     r.realCost ? `${r.realCost.toLocaleString('fr-FR')} ¥${over ? ' ⚠️' : ''}` : '—'],
                      ].map(([k, v]) => (
                        <div key={k} className="immo-repair-card-info">
                          <span className="label">{k}</span>
                          <span>{v}</span>
                        </div>
                      ))}
                    </div>
                    {r.notes && <p className="immo-repair-notes">{r.notes}</p>}
                    {r.documents.length > 0 && (
                      <div className="immo-repair-docs">
                        {r.documents.map(d => <span key={d} className="immo-repair-doc"><FileText size={10} /> {d}</span>)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Toutes les maintenances préventives ── */}
        <div className="immo-section-header" style={{ marginTop: 8 }}>
          <h3 className="immo-section-title">Maintenance préventive planifiée</h3>
        </div>
        <div className="immo-card">
          <div className="immo-maint-table">
            {maintenanceAlerts.map(m => {
              const prop = properties.find(p => p.id === m.propertyId);
              const cat  = categoryCfg[m.category] || { color: '#8892aa', emoji: '🔧' };
              const pri  = priorityCfg[m.priority];
              const today = new Date();
              const due   = new Date(m.dueDate);
              const daysLeft = Math.ceil((due - today) / 86400000);
              return (
                <div key={m.id} className={`immo-maint-full-row ${daysLeft <= 0 ? 'overdue' : daysLeft <= 30 ? 'soon' : ''}`}>
                  <span className="immo-maint-emoji">{cat.emoji}</span>
                  <div className="immo-maint-info">
                    <p className="immo-maint-title">{m.title}</p>
                    <p className="immo-maint-prop" style={{ color: prop?.color }}>{prop?.name}</p>
                  </div>
                  <span className="mono immo-maint-date" style={{ color: daysLeft <= 0 ? 'var(--red)' : daysLeft <= 30 ? 'var(--yellow)' : 'var(--text-muted)' }}>
                    {daysLeft <= 0 ? `En retard (${Math.abs(daysLeft)}j)` : `J-${daysLeft} · ${m.dueDate}`}
                  </span>
                  <span className="mono immo-maint-cost">~{m.estimatedCost.toLocaleString('fr-FR')} ¥</span>
                  <span style={{ color: pri.color, fontSize: 12, fontWeight: 700 }}>{pri.dot} {pri.label}</span>
                  <button className="immo-maint-done-btn">✓ Planifier</button>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}