import React, { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LabelList, ReferenceLine
} from 'recharts';
import {
  TrendingUp, TrendingDown, DollarSign, Users,
  Target, Award, RefreshCw, AlertTriangle,
  CheckCircle, Clock, Zap, ShieldAlert
} from 'lucide-react';
import Topbar from '../components/layout/Topbar';
import { monthlyRevenue, dealsByStage, topClients, conversionFunnel } from '../data/mockDataExtra';
import { abonnements, mrrEvolution } from '../data/mockDataSubs';
import { deals } from '../data/mockData';
import './Analytics.css';

/* ─── Tooltip ─────────────────────────────────────────────────────────────── */
const Tip = ({ active, payload, label, suffix = '' }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || p.fill || '#e8edf8' }} className="chart-tooltip-value">
          {p.name} : {typeof p.value === 'number' ? p.value.toLocaleString('fr-FR') : p.value}
          {suffix || (['CA', 'MRR', 'Prévision', 'Pondéré', 'Objectif'].includes(p.name) ? ' €' : '')}
        </p>
      ))}
    </div>
  );
};

/* ─── Données statiques ───────────────────────────────────────────────────── */
const STAGE_COLORS = ['#8892aa', '#a78bfa', '#f5c842', '#2dd4a0', '#ff4d6a'];

const dealVelocity = [
  { stage: 'Qualification', days: 8 },
  { stage: 'Proposition',   days: 14 },
  { stage: 'Négociation',   days: 22 },
  { stage: 'Closing',       days: 6  },
];

const teamPerf = [
  { name: 'Jean D.',   deals: 12, revenue: 284, target: 300, rate: 68, cac: 4200 },
  { name: 'Marie L.',  deals: 8,  revenue: 142, target: 200, rate: 55, cac: 5800 },
  { name: 'Thomas G.', deals: 5,  revenue: 98,  target: 150, rate: 42, cac: 7100 },
  { name: 'Clara B.',  deals: 3,  revenue: 45,  target: 100, rate: 38, cac: 9200 },
];

const leadSources = [
  { source: 'Référence client', count: 18, rate: 62, cac: 1200 },
  { source: 'LinkedIn',         count: 12, rate: 35, cac: 3400 },
  { source: 'Site web',         count: 9,  rate: 28, cac: 2100 },
  { source: 'Événement',        count: 6,  rate: 45, cac: 4800 },
  { source: 'Cold email',       count: 14, rate: 18, cac: 6200 },
];

const npsData = [
  { month: 'Oct', nps: 42 }, { month: 'Nov', nps: 48 },
  { month: 'Déc', nps: 45 }, { month: 'Jan', nps: 52 },
  { month: 'Fév', nps: 58 }, { month: 'Mar', nps: 61 },
];

// Coût estimé par deal (temps passé + sous-traitance éventuelle)
const dealCosts = { 1: 8400, 2: 6200, 3: 18000, 4: 12000, 5: 14000, 6: 5500, 7: 3200 };

// LTV par client
const clientLtv = [
  { name: 'Strato Ventures',    ltv: 420000, avg_deal: 95000, lifespan: 4.4 },
  { name: 'Nexus Technologies', ltv: 253500, avg_deal: 48000, lifespan: 3.0 },
  { name: 'Orbital Media',      ltv: 126000, avg_deal: 42000, lifespan: 3.0 },
  { name: 'Volt Industries',    ltv: 76000,  avg_deal: 38000, lifespan: 2.0 },
  { name: 'Helix Design',       ltv: 35000,  avg_deal: 35000, lifespan: 1.0 },
  { name: 'Pinnacle Conseil',   ltv: 36000,  avg_deal: 12000, lifespan: 3.0 },
];

// Saisonnalité — CA moyen par mois sur 2 ans (indice 100 = moyenne)
const seasonalityData = [
  { month: 'Jan', index: 82,  revenue: 38000 },
  { month: 'Fév', index: 118, revenue: 51000 },
  { month: 'Mar', index: 108, revenue: 47000 },
  { month: 'Avr', index: 143, revenue: 62000 },
  { month: 'Mai', index: 134, revenue: 58000 },
  { month: 'Jun', index: 164, revenue: 71000 },
  { month: 'Jul', index: 104, revenue: 45000 },
  { month: 'Aoû', index: 90,  revenue: 39000 },
  { month: 'Sep', index: 127, revenue: 55000 },
  { month: 'Oct', index: 157, revenue: 68000 },
  { month: 'Nov', index: 166, revenue: 72000 },
  { month: 'Déc', index: 196, revenue: 85000 },
];

/* ─── Composants réutilisables ────────────────────────────────────────────── */
function KpiCard({ icon: Icon, label, value, change, color, sub, alert }) {
  const pos = change === undefined ? null : change >= 0;
  return (
    <div className={`analytics-kpi ${alert ? 'kpi-alert' : ''}`} style={alert ? { borderColor: color + '55' } : {}}>
      <div className="kpi-icon" style={{ background: color + '18', color }}>
        <Icon size={16} strokeWidth={1.8} />
      </div>
      <div className="kpi-body">
        <p className="kpi-value mono">{value}</p>
        <p className="kpi-label">{label}</p>
        {sub && <p className="kpi-sub">{sub}</p>}
      </div>
      {change !== undefined && (
        <div className={`kpi-change ${pos ? 'pos' : 'neg'}`}>
          {pos ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {Math.abs(change)}%
        </div>
      )}
    </div>
  );
}

function SectionLabel({ emoji, title, sub }) {
  return (
    <div className="analytics-section-block">
      <span className="analytics-section-emoji">{emoji}</span>
      <div>
        <p className="analytics-section-title">{title}</p>
        {sub && <p className="analytics-section-sub-text">{sub}</p>}
      </div>
    </div>
  );
}

/* ─── Page principale ─────────────────────────────────────────────────────── */
export default function Analytics() {
  const [period, setPeriod] = useState('year');

  // ── Calculs de base ──
  const totalRevenue  = monthlyRevenue.reduce((s, m) => s + m.revenue, 0);
  const totalDeals    = monthlyRevenue.reduce((s, m) => s + m.deals, 0);
  const avgDeal       = Math.round(totalRevenue / totalDeals);
  const convRate      = Math.round((conversionFunnel[conversionFunnel.length - 1].count / conversionFunnel[0].count) * 100);
  const mrr           = abonnements.filter(s => s.status !== 'cancelled').reduce((s, a) => s + a.monthlyCost, 0);
  const churn         = Math.round((abonnements.filter(s => s.status === 'cancelled').length / abonnements.length) * 100);
  const avgSalesCycle = dealVelocity.reduce((s, d) => s + d.days, 0);
  const totalLeads    = leadSources.reduce((s, l) => s + l.count, 0);
  const avgNps        = npsData[npsData.length - 1].nps;
  const lastMonth     = monthlyRevenue[monthlyRevenue.length - 1].revenue;
  const prevMonth     = monthlyRevenue[monthlyRevenue.length - 2].revenue;
  const revenueGrowth = Math.round(((lastMonth - prevMonth) / prevMonth) * 100);

  // ── Prévisions pondérées (weighted pipeline) ──
  const openDeals = deals.filter(d => !['won', 'lost'].includes(d.stage));
  const weightedPipeline = Math.round(openDeals.reduce((s, d) => s + d.value * (d.probability / 100), 0));

  const forecastMonths = ['Avr', 'Mai', 'Jun'];

  // Le dernier mois réel (Mar) est le point de jonction :
  // il apparaît à la fois dans CA et dans forecast pour que les courbes se rejoignent visuellement.
  const bridgeMonth = monthlyRevenue[monthlyRevenue.length - 1]; // Mar
  const bridgeMrr   = mrrEvolution[mrrEvolution.length - 1]?.mrr || mrr;

  const forecastData = [
    // Historique — 3 mois avant le pont
    ...monthlyRevenue.slice(-4, -1).map(m => ({
      month: m.month,
      CA:        m.revenue,
      forecast:  null,
      objective: null,
      mrr: mrrEvolution.find(e => e.month.startsWith(m.month.substring(0, 3)))?.mrr || mrr,
    })),
    // Point de jonction — Mar — présent dans les DEUX séries
    {
      month:     bridgeMonth.month,
      CA:        bridgeMonth.revenue,   // courbe réelle se termine ici
      forecast:  bridgeMonth.revenue,   // courbe prévision PART d'ici
      objective: bridgeMonth.revenue,   // courbe objectif aussi
      mrr:       bridgeMrr,
    },
    // Prévisions — Avr, Mai, Jun
    ...forecastMonths.map((month, i) => {
      const weighted = openDeals
        .filter(d => d.closeDate?.startsWith(`2026-0${4 + i}`))
        .reduce((s, d) => s + d.value * (d.probability / 100), 0);
      const base = bridgeMonth.revenue * Math.pow(1.05, i + 1);
      return {
        month,
        CA:        null,
        mrr:       mrr,
        forecast:  Math.round(base + weighted),
        objective: Math.round(bridgeMonth.revenue * Math.pow(1.08, i + 1)),
      };
    }),
  ];

  // ── Concentration du risque ──
  const activeSubs = abonnements.filter(s => s.status !== 'cancelled');
  const topSubClient = activeSubs.reduce((max, a) => a.monthlyCost > (max?.monthlyCost || 0) ? a : max, null);
  const mrrConcentration = topSubClient ? Math.round((topSubClient.monthlyCost / mrr) * 100) : 0;
  const revenueConcentration = Math.round((topClients[0].revenue / totalRevenue) * 100);
  const top3Revenue = topClients.slice(0, 3).reduce((s, c) => s + c.revenue, 0);
  const top3Concentration = Math.round((top3Revenue / totalRevenue) * 100);

  // ── Rentabilité par deal ──
  const dealsWithMargin = deals
    .filter(d => d.stage === 'won' || d.value > 0)
    .map(d => ({
      name: d.title.length > 22 ? d.title.slice(0, 22) + '…' : d.title,
      client: d.client,
      revenue: d.value,
      cost: dealCosts[d.id] || Math.round(d.value * 0.3),
      margin: d.value - (dealCosts[d.id] || Math.round(d.value * 0.3)),
      marginRate: Math.round(((d.value - (dealCosts[d.id] || Math.round(d.value * 0.3))) / d.value) * 100),
    }))
    .sort((a, b) => b.margin - a.margin)
    .slice(0, 6);

  const avgMarginRate = Math.round(dealsWithMargin.reduce((s, d) => s + d.marginRate, 0) / dealsWithMargin.length);

  // ── LTV / CAC ──
  const avgLtv = Math.round(clientLtv.reduce((s, c) => s + c.ltv, 0) / clientLtv.length);
  const avgCac = Math.round(leadSources.reduce((s, l) => s + l.cac * l.count, 0) / totalLeads);
  const ltvCacRatio = Math.round(avgLtv / avgCac);

  // ── CA + MRR combinés (pour graphe principal) ──
  const revenueVsMrr = monthlyRevenue.map((m, i) => ({
    month: m.month,
    CA: m.revenue,
    MRR: mrrEvolution[i]?.mrr || 0,
    deals: m.deals,
  }));

  return (
    <div className="page">
      <Topbar title="Rapports & Analytics" subtitle="Vision complète de la performance commerciale" />
      <div className="page-content">

        {/* Period selector */}
        <div className="analytics-controls">
          <div className="view-tabs">
            {[{ id: 'quarter', label: 'Trimestre' }, { id: 'year', label: 'Année' }].map(p => (
              <button key={p.id} className={`view-tab ${period === p.id ? 'active' : ''}`} onClick={() => setPeriod(p.id)}>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════
            SECTION 1 — REVENUS & RÉCURRENT
        ══════════════════════════════════════════ */}
        <SectionLabel emoji="💰" title="Revenus & Récurrent" sub="CA total, MRR, ARR et santé des abonnements" />
        <div className="analytics-kpis stagger">
          <KpiCard icon={DollarSign} label="CA Total" value={`${(totalRevenue / 1000).toFixed(0)}k €`} change={revenueGrowth} color="#3d7fff" sub={`${lastMonth.toLocaleString('fr-FR')} € ce mois`} />
          <KpiCard icon={RefreshCw}  label="MRR" value={`${mrr.toLocaleString('fr-FR')} €`} change={4.2} color="#2dd4a0" sub={`ARR : ${(mrr * 12 / 1000).toFixed(0)}k €`} />
          <KpiCard icon={Target}     label="Deals conclus" value={totalDeals} change={15.2} color="#a78bfa" sub={`Moy. ${avgDeal.toLocaleString('fr-FR')} €/deal`} />
          <KpiCard icon={Award}      label="Deal moyen" value={`${avgDeal.toLocaleString('fr-FR')} €`} change={8.7} color="#f5c842" />
          <KpiCard icon={CheckCircle} label="Taux de conversion" value={`${convRate}%`} change={-2.1} color="#fb923c" sub="Cible : 50%" />
          <KpiCard icon={AlertTriangle} label="Churn Rate" value={`${churn}%`} change={-1.5} color="#ff4d6a" sub={`${abonnements.filter(s => s.status === 'cancelled').length} résiliation(s)`} />
        </div>

        {/* Graphe CA + MRR */}
        <div className="analytics-card">
          <div className="analytics-card-header">
            <div>
              <h3 className="analytics-card-title">CA mensuel & MRR</h3>
              <p className="analytics-card-sub">Revenu ponctuel vs revenu récurrent — 12 mois</p>
            </div>
            <div className="chart-legend-row">
              <span className="chart-legend-item"><span className="legend-dot" style={{ background: '#3d7fff' }} />CA mensuel</span>
              <span className="chart-legend-item"><span className="legend-dot" style={{ background: '#2dd4a0' }} />MRR</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <ComposedChart data={revenueVsMrr} margin={{ top: 5, right: 10, bottom: 0, left: -10 }}>
              <defs>
                <linearGradient id="caGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3d7fff" stopOpacity={0.22} />
                  <stop offset="100%" stopColor="#3d7fff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="mrrGradMain" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2dd4a0" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="#2dd4a0" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#1e2740" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#4a5470', fontSize: 11, fontFamily: 'Syne' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#4a5470', fontSize: 10, fontFamily: 'Syne' }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}k`} />
              <Tooltip content={<Tip />} />
              <Area type="monotone" dataKey="CA" stroke="#3d7fff" strokeWidth={2.5} fill="url(#caGrad)" dot={false} activeDot={{ r: 4, fill: '#3d7fff', stroke: '#0d1117', strokeWidth: 2 }} />
              <Area type="monotone" dataKey="MRR" stroke="#2dd4a0" strokeWidth={2} fill="url(#mrrGradMain)" dot={false} activeDot={{ r: 4, fill: '#2dd4a0', stroke: '#0d1117', strokeWidth: 2 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* ══════════════════════════════════════════
            SECTION 2 — PRÉVISIONS
        ══════════════════════════════════════════ */}
        <SectionLabel emoji="🔮" title="Prévisions de CA" sub="CA pondéré par probabilité de closing sur les 3 prochains mois" />

        {/* KPIs prévisions */}
        <div className="analytics-kpis-sm stagger">
          <KpiCard icon={TrendingUp} label="Pipeline pondéré"  value={`${(weightedPipeline / 1000).toFixed(0)}k €`}                                  color="#3d7fff" sub="Deals actifs × probabilité" />
          <KpiCard icon={Target}    label="CA prévu Avr."     value={`${((forecastData.find(d => d.month === 'Avr')?.forecast || 0) / 1000).toFixed(0)}k €`} color="#a78bfa" sub="Prévision pondérée" />
          <KpiCard icon={Target}    label="CA prévu Mai"      value={`${((forecastData.find(d => d.month === 'Mai')?.forecast || 0) / 1000).toFixed(0)}k €`} color="#f5c842" sub="Prévision pondérée" />
          <KpiCard icon={Target}    label="CA prévu Jun."     value={`${((forecastData.find(d => d.month === 'Jun')?.forecast || 0) / 1000).toFixed(0)}k €`} color="#2dd4a0" sub="Prévision pondérée" />
        </div>

        {/* Graphe prévisions */}
        <div className="analytics-card">
          <div className="analytics-card-header">
            <div>
              <h3 className="analytics-card-title">CA réel & prévisionnel</h3>
              <p className="analytics-card-sub">Historique + prévision pondérée par probabilité de closing</p>
            </div>
            <div className="chart-legend-row">
              <span className="chart-legend-item"><span className="legend-dot" style={{ background: '#3d7fff' }} />CA réel</span>
              <span className="chart-legend-item"><span className="legend-dot" style={{ background: '#a78bfa' }} />Prévision</span>
              <span className="chart-legend-item" style={{ color: '#f5c842' }}><span className="legend-dash-small" style={{ borderColor: '#f5c842' }} />Objectif</span>
              <span className="chart-legend-item"><span className="legend-dot" style={{ background: '#2dd4a0' }} />MRR</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart data={forecastData} margin={{ top: 8, right: 10, bottom: 0, left: -10 }}>
              <defs>
                <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="caHistGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3d7fff" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#3d7fff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="mrrForecastGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2dd4a0" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#2dd4a0" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#1e2740" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#4a5470', fontSize: 11, fontFamily: 'Syne' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#4a5470', fontSize: 10, fontFamily: 'Syne' }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}k`} />
              <Tooltip content={<Tip />} />
              {/* Ligne de séparation sur le dernier mois réel (pont de jonction) */}
              <ReferenceLine
                x={bridgeMonth.month}
                stroke="#354066"
                strokeWidth={1.5}
                label={{ value: '← Réel  |  Prévision →', fill: '#4a5470', fontSize: 10, position: 'top' }}
              />
              {/* CA réel — s'arrête à Mar (connectNulls=false pour ne pas sauter les null) */}
              <Area type="monotone" dataKey="CA" name="CA" stroke="#3d7fff" strokeWidth={2.5} fill="url(#caHistGrad)" dot={false} connectNulls={false} activeDot={{ r: 4, fill: '#3d7fff', stroke: '#0d1117', strokeWidth: 2 }} />
              {/* Prévision — repart de Mar avec le même point, continue en pointillés */}
              <Area type="monotone" dataKey="forecast" name="Prévision" stroke="#a78bfa" strokeWidth={2} fill="url(#forecastGrad)" strokeDasharray="6 3" connectNulls={false} dot={{ fill: '#a78bfa', r: 4, stroke: '#0d1117', strokeWidth: 2 }} activeDot={{ r: 5 }} />
              {/* Objectif — ligne fine jaune pointillée, repart aussi de Mar */}
              <Line type="monotone" dataKey="objective" name="Objectif" stroke="#f5c842" strokeWidth={1.5} strokeDasharray="4 3" dot={false} connectNulls={false} activeDot={{ r: 3, fill: '#f5c842' }} />
              {/* MRR — fond vert continu */}
              <Area type="monotone" dataKey="mrr" name="MRR" stroke="#2dd4a0" strokeWidth={1.5} fill="url(#mrrForecastGrad)" dot={false} />
            </ComposedChart>
          </ResponsiveContainer>

          {/* Deals qui alimentent la prévision */}
          <div className="forecast-deals">
            <p className="forecast-deals-title">Deals alimentant la prévision</p>
            <div className="forecast-deals-list">
              {openDeals.map(d => (
                <div key={d.id} className="forecast-deal-row">
                  <div className="forecast-deal-bar" style={{ width: `${d.probability}%`, background: d.probability >= 70 ? 'var(--green)' : d.probability >= 40 ? 'var(--yellow)' : 'var(--accent)' }} />
                  <span className="forecast-deal-title">{d.title}</span>
                  <span className="forecast-deal-value mono">{d.value.toLocaleString('fr-FR')} €</span>
                  <span className="forecast-deal-weighted mono">→ {Math.round(d.value * d.probability / 100).toLocaleString('fr-FR')} €</span>
                  <span className="forecast-deal-prob" style={{ color: d.probability >= 70 ? 'var(--green)' : d.probability >= 40 ? 'var(--yellow)' : 'var(--accent)' }}>
                    {d.probability}%
                  </span>
                </div>
              ))}
            </div>
            <div className="forecast-total-row">
              <span>Pipeline pondéré total</span>
              <span className="mono">{weightedPipeline.toLocaleString('fr-FR')} €</span>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            SECTION 3 — CONCENTRATION DU RISQUE
        ══════════════════════════════════════════ */}
        <SectionLabel emoji="⚠️" title="Concentration du risque" sub="Dépendance à un client ou abonnement — plus c'est concentré, plus le risque est élevé" />

        <div className="analytics-risk-row">
          {/* Concentration CA */}
          <div className="analytics-card risk-card">
            <div className="analytics-card-header">
              <h3 className="analytics-card-title">Concentration CA</h3>
              <p className="analytics-card-sub">Part des top clients dans le CA total</p>
            </div>
            <div className="risk-gauge-wrap">
              <div className="risk-gauge">
                <div className="risk-gauge-fill" style={{ width: `${revenueConcentration}%`, background: revenueConcentration > 50 ? 'var(--red)' : revenueConcentration > 35 ? 'var(--yellow)' : 'var(--green)' }} />
              </div>
              <span className="risk-gauge-pct mono" style={{ color: revenueConcentration > 50 ? 'var(--red)' : revenueConcentration > 35 ? 'var(--yellow)' : 'var(--green)' }}>
                {revenueConcentration}%
              </span>
            </div>
            <p className="risk-desc">
              {revenueConcentration > 50
                ? <><AlertTriangle size={12} color="var(--red)" /> <strong style={{ color: 'var(--red)' }}>Risque élevé</strong> — {topClients[0].name} représente {revenueConcentration}% du CA total.</>
                : revenueConcentration > 35
                ? <><AlertTriangle size={12} color="var(--yellow)" /> <strong style={{ color: 'var(--yellow)' }}>Risque modéré</strong> — {topClients[0].name} = {revenueConcentration}% du CA.</>
                : <><CheckCircle size={12} color="var(--green)" /> <strong style={{ color: 'var(--green)' }}>Risque faible</strong> — Bonne diversification.</>
              }
            </p>
            <div className="risk-breakdown">
              {topClients.slice(0, 4).map((c, i) => {
                const pct = Math.round((c.revenue / totalRevenue) * 100);
                const colors = ['#ff4d6a', '#f5c842', '#fb923c', '#8892aa'];
                return (
                  <div key={c.name} className="risk-breakdown-row">
                    <span className="risk-breakdown-name">{c.name}</span>
                    <div className="risk-breakdown-bar-wrap">
                      <div className="risk-breakdown-bar" style={{ width: `${pct}%`, background: colors[i] }} />
                    </div>
                    <span className="risk-breakdown-pct mono">{pct}%</span>
                  </div>
                );
              })}
            </div>
            <p className="risk-note">Top 3 clients = {top3Concentration}% du CA total</p>
          </div>

          {/* Concentration MRR */}
          <div className="analytics-card risk-card">
            <div className="analytics-card-header">
              <h3 className="analytics-card-title">Concentration MRR</h3>
              <p className="analytics-card-sub">Part de chaque abonnement dans le MRR</p>
            </div>
            <div className="risk-gauge-wrap">
              <div className="risk-gauge">
                <div className="risk-gauge-fill" style={{ width: `${mrrConcentration}%`, background: mrrConcentration > 50 ? 'var(--red)' : mrrConcentration > 35 ? 'var(--yellow)' : 'var(--green)' }} />
              </div>
              <span className="risk-gauge-pct mono" style={{ color: mrrConcentration > 50 ? 'var(--red)' : mrrConcentration > 35 ? 'var(--yellow)' : 'var(--green)' }}>
                {mrrConcentration}%
              </span>
            </div>
            <p className="risk-desc">
              {mrrConcentration > 50
                ? <><AlertTriangle size={12} color="var(--red)" /> <strong style={{ color: 'var(--red)' }}>Risque élevé</strong> — {topSubClient?.client} = {mrrConcentration}% du MRR.</>
                : <><CheckCircle size={12} color="var(--green)" /> <strong style={{ color: 'var(--green)' }}>Bonne répartition</strong> — Le MRR est bien distribué.</>
              }
            </p>
            <div className="mrr-breakdown" style={{ marginTop: 12 }}>
              {activeSubs.map(sub => (
                <div key={sub.id} className="mrr-breakdown-item">
                  <div className="mrr-breakdown-dot" style={{ background: sub.color }} />
                  <span className="mrr-breakdown-client">{sub.client.split(' ')[0]}</span>
                  <div className="mrr-breakdown-bar-wrap">
                    <div className="mrr-breakdown-bar" style={{ width: `${(sub.monthlyCost / mrr) * 100}%`, background: sub.color }} />
                  </div>
                  <span className="mrr-breakdown-amount mono">{sub.monthlyCost.toLocaleString('fr-FR')} €</span>
                  <span className="mrr-breakdown-pct mono">{Math.round((sub.monthlyCost / mrr) * 100)}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Saisonnalité */}
          <div className="analytics-card risk-card">
            <div className="analytics-card-header">
              <h3 className="analytics-card-title">Saisonnalité</h3>
              <p className="analytics-card-sub">Indice d'activité mensuel (100 = moyenne)</p>
            </div>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={seasonalityData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <XAxis dataKey="month" tick={{ fill: '#4a5470', fontSize: 10, fontFamily: 'Syne' }} axisLine={false} tickLine={false} />
                <YAxis hide domain={[0, 220]} />
                <ReferenceLine y={100} stroke="#4a5470" strokeDasharray="3 3" />
                <Tooltip content={<Tip suffix=" (indice)" />} />
                <Bar dataKey="index" name="Indice" radius={[3, 3, 0, 0]}>
                  {seasonalityData.map((entry, i) => (
                    <Cell key={i} fill={entry.index >= 150 ? '#2dd4a0' : entry.index >= 100 ? '#3d7fff' : entry.index >= 80 ? '#f5c842' : '#ff4d6a'} opacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="seasonality-legend">
              <span style={{ color: 'var(--green)' }}>■ Très fort (≥150)</span>
              <span style={{ color: 'var(--accent)' }}>■ Fort (≥100)</span>
              <span style={{ color: 'var(--yellow)' }}>■ Moyen (≥80)</span>
              <span style={{ color: 'var(--red)' }}>■ Creux</span>
            </div>
            <p className="risk-note">Mois les plus forts : Déc, Nov, Jun · Creux : Jan, Aoû</p>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            SECTION 4 — RENTABILITÉ
        ══════════════════════════════════════════ */}
        <SectionLabel emoji="📊" title="Rentabilité & Marges" sub="Marge nette par deal et taux de marge moyen" />
        <div className="analytics-charts-row">
          <div className="analytics-card wide">
            <div className="analytics-card-header">
              <div>
                <h3 className="analytics-card-title">Marge par deal</h3>
                <p className="analytics-card-sub">CA, coût estimé et marge nette</p>
              </div>
              <div className="margin-avg-badge">
                Marge moy. <strong className="mono">{avgMarginRate}%</strong>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={dealsWithMargin} margin={{ top: 5, right: 10, bottom: 0, left: -10 }}>
                <CartesianGrid stroke="#1e2740" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#4a5470', fontSize: 10, fontFamily: 'Syne' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#4a5470', fontSize: 10, fontFamily: 'Syne' }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}k`} />
                <Tooltip content={<Tip />} />
                <Bar dataKey="cost"   name="Coût"   stackId="a" fill="#ff4d6a" opacity={0.6} radius={[0,0,3,3]} />
                <Bar dataKey="margin" name="Marge"  stackId="a" fill="#2dd4a0" opacity={0.9} radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
            {/* Table des marges */}
            <div className="margin-table">
              <div className="margin-table-header">
                <span>Deal</span><span>CA</span><span>Coût</span><span>Marge</span><span>Taux</span>
              </div>
              {dealsWithMargin.map(d => (
                <div key={d.name} className="margin-table-row">
                  <span className="margin-deal-name">{d.name}</span>
                  <span className="mono">{d.revenue.toLocaleString('fr-FR')} €</span>
                  <span className="mono" style={{ color: 'var(--red)' }}>{d.cost.toLocaleString('fr-FR')} €</span>
                  <span className="mono" style={{ color: 'var(--green)' }}>{d.margin.toLocaleString('fr-FR')} €</span>
                  <span className="mono margin-rate" style={{ color: d.marginRate >= 60 ? 'var(--green)' : d.marginRate >= 40 ? 'var(--yellow)' : 'var(--red)' }}>
                    {d.marginRate}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Entonnoir + vélocité */}
          <div className="analytics-card">
            <div className="analytics-card-header">
              <h3 className="analytics-card-title">Entonnoir de conversion</h3>
            </div>
            <div className="funnel-list">
              {conversionFunnel.map((step, i) => {
                const pct = Math.round((step.count / conversionFunnel[0].count) * 100);
                const colors = ['#3d7fff', '#a78bfa', '#f5c842', '#fb923c', '#2dd4a0'];
                const dropOff = i > 0 ? Math.round(((conversionFunnel[i - 1].count - step.count) / conversionFunnel[i - 1].count) * 100) : null;
                return (
                  <div key={step.stage} className="funnel-step">
                    <div className="funnel-step-info">
                      <span className="funnel-step-label">{step.stage}</span>
                      <span className="funnel-step-count mono">{step.count}</span>
                    </div>
                    <div className="funnel-bar-track">
                      <div className="funnel-bar-fill" style={{ width: `${pct}%`, background: colors[i] }} />
                    </div>
                    <span className="funnel-pct mono">{pct}%</span>
                    {dropOff !== null && <span className="funnel-drop">-{dropOff}%</span>}
                  </div>
                );
              })}
            </div>
            <div className="analytics-card-header" style={{ marginTop: 20 }}>
              <h3 className="analytics-card-title">Vélocité du cycle de vente</h3>
              <span className="analytics-card-sub">{avgSalesCycle} jours total</span>
            </div>
            {dealVelocity.map(d => (
              <div key={d.stage} className="velocity-row">
                <span className="velocity-stage">{d.stage}</span>
                <div className="velocity-bar-track">
                  <div className="velocity-bar-fill" style={{ width: `${(d.days / 30) * 100}%` }} />
                </div>
                <span className="velocity-days mono">{d.days}j</span>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════
            SECTION 5 — CAC / LTV
        ══════════════════════════════════════════ */}
        <SectionLabel emoji="🎯" title="CAC & LTV" sub="Coût d'acquisition client vs valeur sur toute la durée de vie" />
        <div className="analytics-tri-row">
          {/* LTV par client */}
          <div className="analytics-card">
            <div className="analytics-card-header">
              <h3 className="analytics-card-title">LTV par client</h3>
              <p className="analytics-card-sub">Valeur totale estimée</p>
            </div>
            <div className="ltv-list">
              {clientLtv.map((c, i) => (
                <div key={c.name} className="ltv-row">
                  <span className="ltv-rank mono">0{i + 1}</span>
                  <div className="ltv-info">
                    <div className="ltv-name-row">
                      <span className="ltv-name">{c.name}</span>
                      <span className="ltv-lifespan">{c.lifespan} ans</span>
                    </div>
                    <div className="ltv-bar-track">
                      <div className="ltv-bar-fill" style={{ width: `${(c.ltv / clientLtv[0].ltv) * 100}%`, background: i === 0 ? 'var(--accent)' : `hsl(${200 + i * 20}, 65%, 55%)` }} />
                    </div>
                  </div>
                  <span className="ltv-value mono">{(c.ltv / 1000).toFixed(0)}k €</span>
                </div>
              ))}
            </div>
            <div className="ltv-summary">
              <span>LTV moy. <strong className="mono">{(avgLtv / 1000).toFixed(0)}k €</strong></span>
              <span>CAC moy. <strong className="mono">{avgCac.toLocaleString('fr-FR')} €</strong></span>
              <span className={`ltv-cac-ratio ${ltvCacRatio >= 3 ? 'good' : 'warn'}`}>
                Ratio LTV/CAC : <strong>{ltvCacRatio}x</strong>
              </span>
            </div>
          </div>

          {/* CAC par source */}
          <div className="analytics-card">
            <div className="analytics-card-header">
              <h3 className="analytics-card-title">Sources de leads</h3>
              <p className="analytics-card-sub">Conversion & CAC par canal</p>
            </div>
            <div className="lead-sources-list">
              {leadSources.map((ls, i) => (
                <div key={ls.source} className="lead-source-row">
                  <div className="lead-source-info">
                    <span className="lead-source-name">{ls.source}</span>
                    <span className="lead-source-count mono">{ls.count} leads · {ls.cac.toLocaleString('fr-FR')} € CAC</span>
                  </div>
                  <div className="lead-source-bar-wrap">
                    <div className="lead-source-bar" style={{ width: `${(ls.count / leadSources[0].count) * 100}%`, background: `hsl(${210 + i * 30}, 70%, 60%)` }} />
                  </div>
                  <span className="lead-source-rate" style={{ color: ls.rate >= 40 ? 'var(--green)' : ls.rate >= 25 ? 'var(--yellow)' : 'var(--red)' }}>
                    {ls.rate}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* NPS */}
          <div className="analytics-card">
            <div className="analytics-card-header">
              <h3 className="analytics-card-title">NPS · Satisfaction client</h3>
              <p className="analytics-card-sub">Évolution 6 mois</p>
            </div>
            <div className="nps-score-block">
              <span className="nps-score mono" style={{ color: avgNps >= 50 ? 'var(--green)' : avgNps >= 30 ? 'var(--yellow)' : 'var(--red)' }}>
                {avgNps}
              </span>
              <span className="nps-label">{avgNps >= 50 ? '😊 Excellent' : avgNps >= 30 ? '🙂 Bien' : '😐 À améliorer'}</span>
            </div>
            <ResponsiveContainer width="100%" height={100}>
              <LineChart data={npsData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <XAxis dataKey="month" tick={{ fill: '#4a5470', fontSize: 10, fontFamily: 'Syne' }} axisLine={false} tickLine={false} />
                <YAxis domain={[20, 80]} hide />
                <Tooltip content={<Tip suffix=" pts" />} />
                <ReferenceLine y={50} stroke="#2dd4a0" strokeDasharray="3 3" strokeOpacity={0.4} />
                <Line type="monotone" dataKey="nps" name="NPS" stroke="#a78bfa" strokeWidth={2.5} dot={{ fill: '#a78bfa', r: 3, stroke: '#0d1117', strokeWidth: 2 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
            <p className="nps-ref-label">— Seuil excellent : 50</p>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            SECTION 6 — ACTIVITÉ COMMERCIALE
        ══════════════════════════════════════════ */}
        <SectionLabel emoji="📈" title="Activité commerciale" sub="KPIs de performance de l'équipe et des deals" />
        <div className="analytics-kpis-sm stagger">
          <KpiCard icon={Clock}  label="Cycle de vente moyen" value={`${avgSalesCycle} jours`} change={-8}  color="#3d7fff" />
          <KpiCard icon={Users}  label="Leads totaux"         value={totalLeads}                change={22}  color="#2dd4a0" sub="Toutes sources" />
          <KpiCard icon={Zap}    label="NPS Client"           value={avgNps}                    change={5.2} color="#a78bfa" sub="Score satisfaction" />
          <KpiCard icon={Award}  label="Marge moyenne"        value={`${avgMarginRate}%`}        change={3.1} color="#f5c842" sub="Sur les deals actifs" />
        </div>

        <div className="analytics-bottom-row">
          {/* Performance équipe */}
          <div className="analytics-card">
            <div className="analytics-card-header">
              <h3 className="analytics-card-title">Performance équipe</h3>
              <p className="analytics-card-sub">CA généré vs objectif · CAC par commercial</p>
            </div>
            <div className="team-perf-list">
              {teamPerf.map((m, i) => {
                const pct = Math.round((m.revenue / m.target) * 100);
                const colors = ['#3d7fff', '#a78bfa', '#2dd4a0', '#f5c842'];
                return (
                  <div key={m.name} className="team-perf-row">
                    <div className="team-perf-avatar" style={{ background: colors[i] + '22', color: colors[i] }}>
                      {m.name.split(' ').map(w => w[0]).join('')}
                    </div>
                    <div className="team-perf-info">
                      <div className="team-perf-name-row">
                        <span className="team-perf-name">{m.name}</span>
                        <span className="team-perf-deals">{m.deals} deals</span>
                        <span className="team-perf-pct mono" style={{ color: pct >= 100 ? 'var(--green)' : pct >= 70 ? 'var(--yellow)' : 'var(--red)' }}>
                          {pct}%
                        </span>
                      </div>
                      <div className="team-perf-bar-wrap">
                        <div className="team-perf-bar-fill" style={{ width: `${Math.min(pct, 100)}%`, background: colors[i] }} />
                      </div>
                      <div className="team-perf-values">
                        <span className="mono">{m.revenue}k €</span>
                        <span>/ {m.target}k € · CAC {m.cac.toLocaleString('fr-FR')} €</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top clients */}
          <div className="analytics-card">
            <div className="analytics-card-header">
              <h3 className="analytics-card-title">Top clients — CA & croissance</h3>
            </div>
            <div className="top-clients-list">
              {topClients.map((client, i) => (
                <div key={client.name} className="top-client-row">
                  <span className="top-client-rank mono">0{i + 1}</span>
                  <div className="top-client-info">
                    <p className="top-client-name">{client.name}</p>
                    <div className="top-client-bar-wrap">
                      <div className="top-client-bar" style={{ width: `${(client.revenue / topClients[0].revenue) * 100}%` }} />
                    </div>
                  </div>
                  <div className="top-client-right">
                    <p className="top-client-revenue mono">{(client.revenue / 1000).toFixed(0)}k €</p>
                    <p className={`top-client-growth ${client.growth >= 0 ? 'pos' : 'neg'}`}>
                      {client.growth >= 0 ? '+' : ''}{client.growth}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="analytics-card-header" style={{ marginTop: 20 }}>
              <h3 className="analytics-card-title">Deals conclus / mois</h3>
            </div>
            <ResponsiveContainer width="100%" height={90}>
              <BarChart data={monthlyRevenue} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <XAxis dataKey="month" tick={{ fill: '#4a5470', fontSize: 10, fontFamily: 'Syne' }} axisLine={false} tickLine={false} />
                <Tooltip content={<Tip />} />
                <Bar dataKey="deals" name="Deals" fill="#2dd4a0" radius={[3, 3, 0, 0]} opacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}