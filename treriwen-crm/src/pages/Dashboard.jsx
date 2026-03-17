import React from 'react';
import {
  ComposedChart, AreaChart, Area, Line,
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';
import {
  DollarSign, Users, TrendingUp, CheckCircle,
  Award, Mail, Calendar, UserPlus, ArrowUpRight,
  RefreshCw, AlertTriangle, Clock
} from 'lucide-react';
import Topbar from '../components/layout/Topbar';
import StatCard from '../components/ui/StatCard';
import Badge from '../components/ui/Badge';
import { stats, revenueData, activities, deals, tasks } from '../data/mockData';
import { abonnements, mrrEvolution } from '../data/mockDataSubs';
import './Dashboard.css';

// Fusion revenueData + MRR réel + MRR objectif sur les mêmes mois
const mrrTargets = [3000, 3500, 4000, 4500, 5000, 6000, 8000];
const chartData = revenueData.map((d, i) => ({
  ...d,
  mrr:       mrrEvolution[i]?.mrr ?? null,
  mrrTarget: mrrTargets[i] ?? null,
}));

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip-label">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="chart-tooltip-value">
            {p.name}: {p.value.toLocaleString('fr-FR')} €
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const activityIcons = {
  trophy: Award, mail: Mail, calendar: Calendar,
  'user-plus': UserPlus, 'trending-up': TrendingUp,
};

function daysUntil(dateStr) {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
}

export default function Dashboard() {
  const openDeals = deals.filter(d => !['won', 'lost'].includes(d.stage)).slice(0, 4);
  const pendingTasks = tasks.filter(t => t.status !== 'done').slice(0, 4);

  const activeSubs = abonnements.filter(s => s.status === 'active' || s.status === 'at_risk');
  const mrr = activeSubs.reduce((s, a) => s + a.monthlyCost, 0);
  const arr = mrr * 12;
  const atRisk = abonnements.filter(s => s.status === 'at_risk');
  const renewingSoon = abonnements.filter(a => {
    const d = daysUntil(a.renewalDate);
    return d !== null && d <= 30 && d > 0 && a.status !== 'cancelled';
  });

  return (
    <div className="page">
      <Topbar title="Dashboard" subtitle="Mardi 17 mars 2026" />
      <div className="page-content">

        {/* ── ROW 1 : KPIs ── */}
        <div className="stats-grid stagger">
          <StatCard icon={DollarSign} label="Revenu total" value={`${(stats.totalRevenue / 1000).toFixed(0)}k €`} change={stats.revenueGrowth} changeLabel="vs mois dernier" accentColor="#3d7fff" mono />
          <StatCard icon={Users} label="Clients actifs" value={stats.activeClients} change={stats.newClients} changeLabel={`+${stats.newClients} nouveaux`} accentColor="#2dd4a0" />
          <StatCard icon={TrendingUp} label="Pipeline ouvert" value={`${(stats.pipelineValue / 1000).toFixed(0)}k €`} change={12.3} changeLabel={`${stats.openDeals} deals actifs`} accentColor="#a78bfa" mono />
          <StatCard icon={CheckCircle} label="Taux de conversion" value={`${stats.conversionRate}%`} change={-3.1} changeLabel="Cible: 50%" accentColor="#f5c842" />
        </div>

        {/* ── ROW 2 : MRR Banner ── */}
        <div className="mrr-banner stagger">
          {/* MRR principal avec sparkline */}
          <div className="mrr-block main">
            <div className="mrr-icon-wrap">
              <RefreshCw size={15} strokeWidth={2} />
            </div>
            <div className="mrr-block-content">
              <p className="mrr-block-label">MRR · Revenu Mensuel Récurrent</p>
              <p className="mrr-block-value mono">{mrr.toLocaleString('fr-FR')} €</p>
              <p className="mrr-block-sub">{activeSubs.length} abonnements actifs</p>
            </div>
            <div className="mrr-sparkline">
              <ResponsiveContainer width="100%" height={40}>
                <AreaChart data={mrrEvolution} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="dashMrr" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3d7fff" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#3d7fff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="mrr" stroke="#3d7fff" strokeWidth={2} fill="url(#dashMrr)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ARR */}
          <div className="mrr-block">
            <p className="mrr-block-label">ARR</p>
            <p className="mrr-block-value mono" style={{ color: 'var(--green)' }}>{(arr / 1000).toFixed(1)}k €</p>
            <p className="mrr-block-sub">Revenu annuel projeté</p>
          </div>

          {/* À risque */}
          <div className="mrr-block">
            <p className="mrr-block-label">MRR à risque</p>
            <p className="mrr-block-value mono" style={{ color: atRisk.length > 0 ? 'var(--yellow)' : 'var(--text-secondary)' }}>
              {atRisk.reduce((s, a) => s + a.monthlyCost, 0).toLocaleString('fr-FR')} €
            </p>
            {atRisk.length > 0
              ? <p className="mrr-block-sub warn"><AlertTriangle size={10} /> {atRisk.length} client{atRisk.length > 1 ? 's' : ''} à risque</p>
              : <p className="mrr-block-sub">Aucun risque détecté</p>
            }
          </div>

          {/* Renouvellements */}
          <div className="mrr-block">
            <p className="mrr-block-label">Renouvellements</p>
            <p className="mrr-block-value mono" style={{ color: renewingSoon.length > 0 ? 'var(--purple)' : 'var(--text-secondary)' }}>
              {renewingSoon.length}
            </p>
            <p className="mrr-block-sub">dans les 30 prochains jours</p>
          </div>

          {/* CTA */}
          <a href="/abonnements" className="mrr-cta">
            <RefreshCw size={13} />
            <span>Gérer les abonnements</span>
            <ArrowUpRight size={13} />
          </a>
        </div>

        {/* ── ROW 3 : Charts + Activity ── */}
        <div className="charts-row">
          <div className="chart-card">
            <div className="card-header">
              <div>
                <h3 className="card-title">Revenu, Objectif & MRR</h3>
                <p className="card-sub">6 derniers mois</p>
              </div>
              <div className="chart-legend">
                <span><span className="legend-dot" style={{ background: '#3d7fff' }} />CA</span>
                <span><span className="legend-dot" style={{ background: '#4a5470' }} />Objectif CA</span>
                <span><span className="legend-dot" style={{ background: '#2dd4a0' }} />MRR</span>
                <span style={{ color: '#a78bfa' }}><span className="legend-dash" style={{ color: '#a78bfa' }} />Objectif MRR</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={210}>
              <ComposedChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3d7fff" stopOpacity={0.22} />
                    <stop offset="100%" stopColor="#3d7fff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="targetGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4a5470" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#4a5470" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2dd4a0" stopOpacity={0.18} />
                    <stop offset="100%" stopColor="#2dd4a0" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1e2740" strokeDasharray="4 4" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: '#4a5470', fontSize: 11, fontFamily: 'Syne' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />

                {/* Objectif CA — zone grisée en arrière-plan */}
                <Area
                  type="monotone"
                  dataKey="target"
                  name="Objectif CA"
                  stroke="#4a5470"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  fill="url(#targetGrad)"
                  dot={false}
                />
                {/* CA réel — zone bleue principale */}
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="CA"
                  stroke="#3d7fff"
                  strokeWidth={2.5}
                  fill="url(#revenueGrad)"
                  dot={false}
                  activeDot={{ r: 4, fill: '#3d7fff', stroke: '#0d1117', strokeWidth: 2 }}
                />
                {/* MRR réel — ligne verte */}
                <Area
                  type="monotone"
                  dataKey="mrr"
                  name="MRR"
                  stroke="#2dd4a0"
                  strokeWidth={2}
                  fill="url(#mrrGrad)"
                  dot={{ fill: '#2dd4a0', r: 3, stroke: '#0d1117', strokeWidth: 1.5 }}
                  activeDot={{ r: 5, fill: '#2dd4a0', stroke: '#0d1117', strokeWidth: 2 }}
                />
                {/* Objectif MRR — ligne violette pointillée */}
                <Line
                  type="monotone"
                  dataKey="mrrTarget"
                  name="Objectif MRR"
                  stroke="#a78bfa"
                  strokeWidth={1.5}
                  strokeDasharray="5 3"
                  dot={false}
                  activeDot={{ r: 4, fill: '#a78bfa', stroke: '#0d1117', strokeWidth: 2 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="activity-card">
            <div className="card-header">
              <h3 className="card-title">Activité récente</h3>
            </div>
            <div className="activity-list">
              {activities.map(act => {
                const Icon = activityIcons[act.icon] || TrendingUp;
                return (
                  <div key={act.id} className="activity-item">
                    <div className="activity-icon"><Icon size={13} /></div>
                    <div className="activity-content">
                      <p className="activity-text">{act.text}</p>
                      <p className="activity-meta">
                        <span className="activity-client">{act.client}</span>
                        <span>·</span>
                        <span>{act.time}</span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── ROW 4 : Abonnements ── */}
        <div className="subs-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Abonnements en cours</h3>
              <p className="card-sub">MRR total : <span className="mono" style={{ color: 'var(--accent-bright)' }}>{mrr.toLocaleString('fr-FR')} €</span></p>
            </div>
            <a href="/abonnements" className="card-link">Voir tout <ArrowUpRight size={12} /></a>
          </div>
          <div className="subs-list">
            {abonnements.filter(s => s.status !== 'cancelled').map(sub => {
              const days = daysUntil(sub.renewalDate);
              const statusColor = sub.status === 'active' ? 'var(--green)' : sub.status === 'at_risk' ? 'var(--yellow)' : 'var(--text-muted)';
              const statusLabel = sub.status === 'active' ? 'Actif' : sub.status === 'at_risk' ? 'À risque' : 'Pause';
              return (
                <div key={sub.id} className="sub-row">
                  <div className="sub-row-avatar" style={{ background: sub.color + '22', color: sub.color }}>
                    {sub.client.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                  <div className="sub-row-info">
                    <p className="sub-row-client">{sub.client}</p>
                    <p className="sub-row-plan">{sub.plan}</p>
                  </div>
                  <div className="sub-row-freq">
                    <RefreshCw size={10} />
                    {sub.frequency === 'monthly' ? 'Mensuel' : sub.frequency === 'quarterly' ? 'Trim.' : 'Annuel'}
                  </div>
                  <div className="sub-row-mrr">
                    <span className="mono">{sub.monthlyCost.toLocaleString('fr-FR')} €</span>
                    <span className="sub-row-per">/mois</span>
                  </div>
                  {days !== null && (
                    <span className={`sub-row-days ${days <= 30 ? 'soon' : ''}`}>
                      <Clock size={10} /> J-{days}
                    </span>
                  )}
                  <span className="sub-row-status" style={{ color: statusColor, background: statusColor + '18' }}>
                    {statusLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── ROW 5 : Deals + Tasks ── */}
        <div className="bottom-row">
          <div className="list-card">
            <div className="card-header">
              <h3 className="card-title">Deals en cours</h3>
              <a href="/deals" className="card-link">Voir tout <ArrowUpRight size={12} /></a>
            </div>
            <table className="mini-table">
              <thead>
                <tr><th>Deal</th><th>Valeur</th><th>Statut</th><th>Proba.</th></tr>
              </thead>
              <tbody>
                {openDeals.map(deal => (
                  <tr key={deal.id}>
                    <td>
                      <div className="deal-name">{deal.title}</div>
                      <div className="deal-client">{deal.client}</div>
                    </td>
                    <td className="mono">{deal.value.toLocaleString('fr-FR')} €</td>
                    <td><Badge type={deal.stage} /></td>
                    <td>
                      <div className="proba-bar">
                        <div className="proba-fill" style={{ width: `${deal.probability}%`, background: deal.probability > 70 ? 'var(--green)' : deal.probability > 40 ? 'var(--yellow)' : 'var(--accent)' }} />
                      </div>
                      <span className="proba-label mono">{deal.probability}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="tasks-card">
            <div className="card-header">
              <h3 className="card-title">Tâches en attente</h3>
              <a href="/tasks" className="card-link">Voir tout <ArrowUpRight size={12} /></a>
            </div>
            <div className="tasks-list">
              {pendingTasks.map(task => (
                <div key={task.id} className="task-item">
                  <div className={`task-checkbox ${task.status === 'done' ? 'done' : ''}`} />
                  <div className="task-info">
                    <p className="task-title">{task.title}</p>
                    <p className="task-meta">{task.client} · {task.dueDate}</p>
                  </div>
                  <Badge type={task.priority} />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}