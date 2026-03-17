import React, { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';
import {
  RefreshCw, AlertTriangle, XCircle, CheckCircle2,
  Plus, ChevronDown, ChevronUp, Calendar, Euro,
  TrendingUp, TrendingDown, Clock, MoreHorizontal,
  CreditCard, ArrowRight, Zap
} from 'lucide-react';
import Topbar from '../components/layout/Topbar';
import { abonnements, mrrEvolution } from '../data/mockDataSubs';
import './Abonnements.css';

const statusConfig = {
  active:    { label: 'Actif',      icon: CheckCircle2, color: 'var(--green)',   bg: 'var(--green-dim)' },
  at_risk:   { label: 'À risque',   icon: AlertTriangle, color: 'var(--yellow)', bg: 'var(--yellow-dim)' },
  cancelled: { label: 'Résilié',    icon: XCircle,       color: 'var(--red)',    bg: 'var(--red-dim)' },
  paused:    { label: 'En pause',   icon: Clock,         color: 'var(--text-muted)', bg: 'rgba(136,146,170,0.1)' },
};

const freqLabel = { monthly: '/mois', quarterly: '/trim.', annual: '/an' };
const freqMonths = { monthly: 1, quarterly: 3, annual: 12 };

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function PaymentBadge({ status }) {
  const cfg = {
    paid: { label: 'Payé', color: 'var(--green)', bg: 'var(--green-dim)' },
    late: { label: 'En retard', color: 'var(--red)', bg: 'var(--red-dim)' },
    pending: { label: 'En attente', color: 'var(--yellow)', bg: 'var(--yellow-dim)' },
  };
  const c = cfg[status] || cfg.pending;
  return (
    <span className="pay-badge" style={{ color: c.color, background: c.bg }}>
      {c.label}
    </span>
  );
}

function SubCard({ sub, selected, onClick }) {
  const st = statusConfig[sub.status];
  const Icon = st.icon;
  const days = daysUntil(sub.renewalDate);
  const monthlyMrr = sub.monthlyCost;

  return (
    <div
      className={`sub-card ${selected ? 'selected' : ''} status-${sub.status}`}
      onClick={onClick}
    >
      {/* Left accent bar */}
      <div className="sub-card-accent" style={{ background: sub.color }} />

      <div className="sub-card-body">
        <div className="sub-card-header">
          <div className="sub-card-client-info">
            <div className="sub-card-avatar" style={{ background: sub.color + '22', color: sub.color }}>
              {sub.client.split(' ').map(w => w[0]).join('').slice(0, 2)}
            </div>
            <div>
              <p className="sub-card-client">{sub.client}</p>
              <p className="sub-card-plan">{sub.plan}</p>
            </div>
          </div>
          <div className="sub-card-right">
            <span className="sub-status-pill" style={{ color: st.color, background: st.bg }}>
              <Icon size={11} strokeWidth={2} /> {st.label}
            </span>
          </div>
        </div>

        <div className="sub-card-metrics">
          <div className="sub-metric">
            <p className="sub-metric-value mono">
              {monthlyMrr.toLocaleString('fr-FR')} €
            </p>
            <p className="sub-metric-label">MRR</p>
          </div>
          <div className="sub-metric">
            <p className="sub-metric-value mono">
              {(monthlyMrr * 12).toLocaleString('fr-FR')} €
            </p>
            <p className="sub-metric-label">ARR</p>
          </div>
          <div className="sub-metric">
            <p className="sub-metric-value mono">
              {sub.paymentHistory.length}
            </p>
            <p className="sub-metric-label">Paiements</p>
          </div>
        </div>

        <div className="sub-card-footer">
          <span className="sub-freq-tag">
            <RefreshCw size={10} />
            {freqLabel[sub.frequency]}
          </span>
          {sub.renewalDate && sub.status !== 'cancelled' && (
            <span className={`sub-renewal ${days !== null && days <= 30 ? 'soon' : ''}`}>
              <Calendar size={10} />
              Renouvellement dans {days} j
            </span>
          )}
          {sub.status === 'cancelled' && sub.endDate && (
            <span className="sub-ended">
              <XCircle size={10} /> Terminé le {sub.endDate}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function SubDetail({ sub, onClose }) {
  const [historyOpen, setHistoryOpen] = useState(true);
  const st = statusConfig[sub.status];
  const Icon = st.icon;
  const days = daysUntil(sub.renewalDate);
  const totalPaid = sub.paymentHistory
    .filter(p => p.status === 'paid')
    .reduce((s, p) => s + p.amount, 0);

  return (
    <div className="sub-detail fade-in">
      {/* Header */}
      <div className="sub-detail-header">
        <div className="sub-detail-avatar" style={{ background: sub.color + '22', color: sub.color }}>
          {sub.client.split(' ').map(w => w[0]).join('').slice(0, 2)}
        </div>
        <div className="sub-detail-titles">
          <h3>{sub.client}</h3>
          <p>{sub.plan}</p>
        </div>
        <span className="sub-status-pill lg" style={{ color: st.color, background: st.bg }}>
          <Icon size={12} strokeWidth={2} /> {st.label}
        </span>
      </div>

      {/* MRR / ARR */}
      <div className="sub-detail-metrics">
        <div className="sub-detail-metric" style={{ borderColor: sub.color + '44' }}>
          <p className="sub-detail-metric-label">MRR</p>
          <p className="sub-detail-metric-value mono" style={{ color: sub.color }}>
            {sub.monthlyCost.toLocaleString('fr-FR')} €
          </p>
        </div>
        <div className="sub-detail-metric">
          <p className="sub-detail-metric-label">ARR</p>
          <p className="sub-detail-metric-value mono">
            {(sub.monthlyCost * 12).toLocaleString('fr-FR')} €
          </p>
        </div>
        <div className="sub-detail-metric">
          <p className="sub-detail-metric-label">Total encaissé</p>
          <p className="sub-detail-metric-value mono">
            {totalPaid.toLocaleString('fr-FR')} €
          </p>
        </div>
      </div>

      {/* Info rows */}
      <div className="sub-detail-rows">
        <div className="sub-detail-row">
          <span className="sub-detail-row-label">Fréquence</span>
          <span className="sub-detail-row-value">
            <RefreshCw size={12} />
            {sub.frequency === 'monthly' ? 'Mensuel' : sub.frequency === 'quarterly' ? 'Trimestriel' : 'Annuel'}
          </span>
        </div>
        <div className="sub-detail-row">
          <span className="sub-detail-row-label">Début</span>
          <span className="sub-detail-row-value mono">{sub.startDate}</span>
        </div>
        {sub.renewalDate && (
          <div className="sub-detail-row">
            <span className="sub-detail-row-label">Prochain renouvellement</span>
            <span className={`sub-detail-row-value mono ${days !== null && days <= 30 ? 'warn' : ''}`}>
              {sub.renewalDate}
              {days !== null && days <= 30 && ` (J-${days})`}
            </span>
          </div>
        )}
        {sub.endDate && (
          <div className="sub-detail-row">
            <span className="sub-detail-row-label">Date de fin</span>
            <span className="sub-detail-row-value mono">{sub.endDate}</span>
          </div>
        )}
        {sub.devisRef && (
          <div className="sub-detail-row">
            <span className="sub-detail-row-label">Devis lié</span>
            <span className="sub-detail-row-value accent mono">{sub.devisRef}</span>
          </div>
        )}
        <div className="sub-detail-row">
          <span className="sub-detail-row-label">Contact</span>
          <span className="sub-detail-row-value">{sub.contact}</span>
        </div>
      </div>

      {/* Notes */}
      {sub.notes && (
        <div className="sub-detail-notes">
          <p>{sub.notes}</p>
        </div>
      )}

      {/* Payment History */}
      <div className="sub-detail-history">
        <button
          className="sub-history-toggle"
          onClick={() => setHistoryOpen(o => !o)}
        >
          <CreditCard size={13} />
          <span>Historique des paiements</span>
          <span className="sub-history-count">{sub.paymentHistory.length}</span>
          {historyOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>

        {historyOpen && (
          <div className="sub-history-list">
            {sub.paymentHistory.map((p, i) => (
              <div key={i} className="sub-history-item">
                <span className="sub-history-date mono">{p.date}</span>
                <span className="sub-history-amount mono">{p.amount.toLocaleString('fr-FR')} €</span>
                <PaymentBadge status={p.status} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      {sub.status !== 'cancelled' && (
        <div className="sub-detail-actions">
          <button className="sub-action-btn primary">
            <ArrowRight size={13} /> Voir le client
          </button>
          <button className="sub-action-btn danger">
            <XCircle size={13} /> Résilier
          </button>
        </div>
      )}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p style={{ color: 'var(--text-secondary)', fontSize: 11, marginBottom: 4 }}>{label}</p>
      <p style={{ color: 'var(--accent-bright)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
        MRR : {payload[0]?.value?.toLocaleString('fr-FR')} €
      </p>
    </div>
  );
};

export default function Abonnements() {
  const [filter, setFilter] = useState('all');
  const [selectedSub, setSelectedSub] = useState(null);

  const active = abonnements.filter(s => s.status === 'active');
  const atRisk = abonnements.filter(s => s.status === 'at_risk');
  const cancelled = abonnements.filter(s => s.status === 'cancelled');

  const mrr = active.reduce((s, a) => s + a.monthlyCost, 0)
            + atRisk.reduce((s, a) => s + a.monthlyCost, 0);
  const arr = mrr * 12;
  const churnRate = Math.round((cancelled.length / abonnements.length) * 100);
  const atRiskMrr = atRisk.reduce((s, a) => s + a.monthlyCost, 0);

  const renewingSoon = abonnements.filter(a => {
    const d = daysUntil(a.renewalDate);
    return d !== null && d <= 30 && d > 0 && a.status !== 'cancelled';
  });

  const filtered = abonnements.filter(a => {
    if (filter === 'all') return true;
    return a.status === filter;
  });

  return (
    <div className="page">
      <Topbar
        title="Abonnements"
        subtitle={`${active.length + atRisk.length} actifs · MRR ${mrr.toLocaleString('fr-FR')} €`}
      />

      <div className="page-content">

        {/* KPI Banner */}
        <div className="sub-kpis stagger">
          <div className="sub-kpi main">
            <div className="sub-kpi-icon" style={{ background: 'rgba(61,127,255,0.15)', color: 'var(--accent)' }}>
              <TrendingUp size={18} strokeWidth={1.8} />
            </div>
            <div>
              <p className="sub-kpi-label">MRR</p>
              <p className="sub-kpi-value mono">{mrr.toLocaleString('fr-FR')} €</p>
              <p className="sub-kpi-sub">+{mrrEvolution[mrrEvolution.length-1].mrr > mrrEvolution[mrrEvolution.length-2].mrr ? 0 : 0}% ce mois</p>
            </div>
            <div className="sub-kpi-sparkline">
              <ResponsiveContainer width="100%" height={40}>
                <AreaChart data={mrrEvolution} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3d7fff" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#3d7fff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="mrr" stroke="#3d7fff" strokeWidth={2} fill="url(#mrrGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="sub-kpi">
            <div className="sub-kpi-icon" style={{ background: 'rgba(45,212,160,0.15)', color: 'var(--green)' }}>
              <Zap size={16} strokeWidth={1.8} />
            </div>
            <div>
              <p className="sub-kpi-label">ARR</p>
              <p className="sub-kpi-value mono">{(arr / 1000).toFixed(1)}k €</p>
              <p className="sub-kpi-sub">{active.length + atRisk.length} abonnements actifs</p>
            </div>
          </div>

          <div className="sub-kpi">
            <div className="sub-kpi-icon" style={{ background: 'rgba(255,77,106,0.15)', color: 'var(--red)' }}>
              <TrendingDown size={16} strokeWidth={1.8} />
            </div>
            <div>
              <p className="sub-kpi-label">Churn Rate</p>
              <p className="sub-kpi-value mono">{churnRate}%</p>
              <p className="sub-kpi-sub">{cancelled.length} résilié{cancelled.length > 1 ? 's' : ''}</p>
            </div>
          </div>

          <div className="sub-kpi">
            <div className="sub-kpi-icon" style={{ background: 'rgba(245,200,66,0.15)', color: 'var(--yellow)' }}>
              <AlertTriangle size={16} strokeWidth={1.8} />
            </div>
            <div>
              <p className="sub-kpi-label">MRR à risque</p>
              <p className="sub-kpi-value mono" style={{ color: atRiskMrr > 0 ? 'var(--yellow)' : 'inherit' }}>
                {atRiskMrr.toLocaleString('fr-FR')} €
              </p>
              <p className="sub-kpi-sub">{atRisk.length} client{atRisk.length > 1 ? 's' : ''} à risque</p>
            </div>
          </div>

          <div className="sub-kpi">
            <div className="sub-kpi-icon" style={{ background: 'rgba(167,139,250,0.15)', color: 'var(--purple)' }}>
              <Calendar size={16} strokeWidth={1.8} />
            </div>
            <div>
              <p className="sub-kpi-label">Renouvellements</p>
              <p className="sub-kpi-value mono">{renewingSoon.length}</p>
              <p className="sub-kpi-sub">dans les 30 prochains jours</p>
            </div>
          </div>
        </div>

        {/* MRR Chart */}
        <div className="sub-chart-card">
          <div className="sub-chart-header">
            <div>
              <h3 className="sub-chart-title">Évolution du MRR</h3>
              <p className="sub-chart-sub">7 derniers mois</p>
            </div>
            <div className="sub-chart-current">
              <span className="sub-chart-current-label">MRR actuel</span>
              <span className="sub-chart-current-value mono">{mrr.toLocaleString('fr-FR')} €</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={mrrEvolution} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="mrrMainGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3d7fff" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#3d7fff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#1e2740" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#4a5470', fontSize: 11, fontFamily: 'Syne' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="mrr"
                stroke="#3d7fff"
                strokeWidth={2.5}
                fill="url(#mrrMainGrad)"
                dot={{ fill: '#3d7fff', r: 3, stroke: '#0d1117', strokeWidth: 2 }}
                activeDot={{ r: 5, fill: '#3d7fff', stroke: '#0d1117', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Renewals Alert */}
        {renewingSoon.length > 0 && (
          <div className="sub-alert-banner">
            <Clock size={14} />
            <span>
              <strong>{renewingSoon.length} abonnement{renewingSoon.length > 1 ? 's' : ''}</strong> à renouveler dans les 30 prochains jours —{' '}
              {renewingSoon.map(s => s.client).join(', ')}
            </span>
            <button className="sub-alert-cta">Voir <ArrowRight size={12} /></button>
          </div>
        )}

        {/* Filter + New */}
        <div className="sub-controls">
          <div className="filter-tabs">
            {[
              { id: 'all', label: 'Tous' },
              { id: 'active', label: 'Actifs' },
              { id: 'at_risk', label: 'À risque' },
              { id: 'cancelled', label: 'Résiliés' },
            ].map(f => (
              <button
                key={f.id}
                className={`filter-tab ${filter === f.id ? 'active' : ''}`}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <button className="sub-new-btn">
            <Plus size={14} /> Nouvel abonnement
          </button>
        </div>

        {/* Cards + Detail */}
        <div className={`sub-layout ${selectedSub ? 'with-detail' : ''}`}>
          <div className="sub-cards-grid">
            {filtered.map(sub => (
              <SubCard
                key={sub.id}
                sub={sub}
                selected={selectedSub?.id === sub.id}
                onClick={() => setSelectedSub(selectedSub?.id === sub.id ? null : sub)}
              />
            ))}
          </div>

          {selectedSub && (
            <SubDetail
              sub={selectedSub}
              onClose={() => setSelectedSub(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}