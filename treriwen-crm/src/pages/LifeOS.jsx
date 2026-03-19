import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  TrendingUp, TrendingDown, ArrowUpRight, Bell,
  CheckCircle2, Circle, AlertTriangle, Zap
} from 'lucide-react';
import Topbar from '../components/layout/Topbar';

// Données de tous les modules
import { deals, clients, tasks } from '../data/mockData';
import { contentRevenueMonthly, channelStats, videos } from '../data/mockDataContent';
import { socialProfiles, socialMonthly } from '../data/mockDataSocial';
import { properties, rentalRevenue, repairs, tenants } from '../data/mockDataImmo';
import { portfolioHistory, holdings } from '../data/mockDataPerso';
import { bodyMetrics, workoutSessions, nutritionGoals, nutritionLog } from '../data/mockDataPerso';
import { budgetMonthly, incomes, savingsGoals } from '../data/mockDataPerso';
import { objectives } from '../data/mockDataPerso';
import { habits, habitHistory, notifications } from '../data/mockDataLifeOS';

import './LifeOS.css';

// ─── Mini tooltip ─────────────────────────────────────────────────────────────
const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || p.stroke }} className="chart-tooltip-value">
          {p.name} : {typeof p.value === 'number' ? p.value.toLocaleString('fr-FR') : p.value}
        </p>
      ))}
    </div>
  );
};

// ─── Module Card wrapper ───────────────────────────────────────────────────────
function ModuleCard({ title, emoji, link, color, children, span = 1 }) {
  const navigate = useNavigate();
  return (
    <div className={`los-card los-span-${span}`} style={{ '--card-color': color }}>
      <div className="los-card-header">
        <div className="los-card-title-row">
          <span className="los-card-emoji">{emoji}</span>
          <h3 className="los-card-title">{title}</h3>
        </div>
        <button className="los-card-link" onClick={() => navigate(link)}>
          <ArrowUpRight size={13} />
        </button>
      </div>
      <div className="los-card-body">{children}</div>
    </div>
  );
}

// ─── KPI pill ─────────────────────────────────────────────────────────────────
function KPill({ label, value, color, trend }) {
  return (
    <div className="los-kpill">
      <p className="los-kpill-val mono" style={{ color }}>{value}</p>
      <p className="los-kpill-label">{label}</p>
      {trend !== undefined && (
        <span className={`los-kpill-trend ${trend >= 0 ? 'pos' : 'neg'}`}>
          {trend >= 0 ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
          {Math.abs(trend)}%
        </span>
      )}
    </div>
  );
}

export default function LifeOS() {
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  // ── CRM ──
  const openDeals      = deals.filter(d => !['won','lost'].includes(d.stage));
  const pipeline       = openDeals.reduce((s, d) => s + d.value * d.probability / 100, 0);
  const pendingTasks   = tasks.filter(t => t.status !== 'done').length;

  // ── Contenu ──
  const lastContentRev = contentRevenueMonthly[contentRevenueMonthly.length - 1].total;
  const prevContentRev = contentRevenueMonthly[contentRevenueMonthly.length - 2].total;
  const contentGrowth  = Math.round(((lastContentRev - prevContentRev) / prevContentRev) * 100);

  // ── Réseaux ──
  const totalFollowers = Object.values(socialProfiles).reduce((s, p) => s + p.followers, 0);
  const totalViewsMon  = Object.entries(socialMonthly).reduce((s, [, d]) => s + d[d.length-1].views, 0);

  // ── Immobilier ──
  const totalPatrimony = properties.reduce((s, p) => s + p.currentValue, 0);
  const lastMonthRent  = rentalRevenue[rentalRevenue.length - 1].total;
  const urgentRepairs  = repairs.filter(r => r.status !== 'completed' && r.priority === 'high').length;

  // ── Investissements ──
  const portfolioValue = holdings.reduce((s, h) => s + h.shares * h.currentPrice, 0);
  const portfolioCost  = holdings.reduce((s, h) => s + h.shares * h.avgPrice, 0);
  const portfolioPnL   = ((portfolioValue - portfolioCost) / portfolioCost * 100).toFixed(1);
  const lastPort       = portfolioHistory[portfolioHistory.length - 1].value;
  const prevPort       = portfolioHistory[portfolioHistory.length - 2].value;
  const portMonthGrowth = ((lastPort - prevPort) / prevPort * 100).toFixed(1);

  // ── Santé ──
  const latestMetric   = bodyMetrics[bodyMetrics.length - 1];
  const sessionsWeek   = workoutSessions.filter(s => new Date(s.date) >= new Date(Date.now() - 7*86400000)).length;
  const todayNutrition = nutritionLog[0];
  const calPct         = Math.round((todayNutrition.calories / nutritionGoals.calories) * 100);

  // ── Budget ──
  const lastBudget     = budgetMonthly[budgetMonthly.length - 1];
  const totalIncome    = incomes.reduce((s, i) => s + i.amount, 0);
  const savingsRate    = Math.round((lastBudget.savings / lastBudget.income) * 100);

  // ── OKR ──
  const okrScore       = Math.round(objectives.reduce((s, o) => s + o.progress, 0) / objectives.length);
  const atRiskOKR      = objectives.filter(o => o.status === 'at_risk').length;

  // ── Habitudes ──
  const todayStr       = new Date().toISOString().slice(0, 10);
  const doneTodayCount = habits.filter(h => {
    const hist = habitHistory[h.id];
    return hist?.find(d => d.date === todayStr)?.done;
  }).length;
  const bestStreak     = Math.max(...habits.map(h => h.currentStreak));
  const bestHabit      = habits.find(h => h.currentStreak === bestStreak);

  // ── Notifications non lues ──
  const unreadCount    = notifications.filter(n => !n.read).length;
  const urgentNotifs   = notifications.filter(n => !n.read && n.priority === 'high');

  return (
    <div className="page">
      <Topbar title="Life OS" subtitle={today} />
      <div className="page-content">

        {/* ── Header global ── */}
        <div className="los-header-strip">
          <div className="los-greeting">
            <h2 className="los-greeting-text">Bonjour 👋 Voici votre journée en un coup d'œil</h2>
            <p className="los-greeting-sub">Mercredi 18 mars 2026</p>
          </div>
          <div className="los-header-stats">
            <div className="los-header-stat" onClick={() => navigate('/okr')}>
              <div className="los-okr-ring">
                <svg width="52" height="52" viewBox="0 0 52 52">
                  <circle cx="26" cy="26" r="22" fill="none" stroke="var(--border-soft)" strokeWidth="5" />
                  <circle cx="26" cy="26" r="22" fill="none"
                    stroke={okrScore >= 70 ? 'var(--green)' : okrScore >= 50 ? 'var(--yellow)' : 'var(--red)'}
                    strokeWidth="5"
                    strokeDasharray={`${okrScore * 1.382} 138.2`}
                    strokeLinecap="round"
                    transform="rotate(-90 26 26)"
                  />
                </svg>
                <span className="los-okr-ring-val mono">{okrScore}%</span>
              </div>
              <div><p className="los-hs-val">Score OKR</p><p className="los-hs-sub">{atRiskOKR} à risque</p></div>
            </div>
            <div className="los-header-stat" onClick={() => navigate('/notifications')}>
              <div className="los-notif-badge">
                <Bell size={20} color="var(--accent-bright)" />
                {unreadCount > 0 && <span className="los-notif-count">{unreadCount}</span>}
              </div>
              <div><p className="los-hs-val">{unreadCount} alertes</p><p className="los-hs-sub">{urgentNotifs.length} urgentes</p></div>
            </div>
            <div className="los-header-stat" onClick={() => navigate('/habitudes')}>
              <span style={{ fontSize: 28 }}>{bestHabit?.icon}</span>
              <div><p className="los-hs-val">{doneTodayCount}/{habits.length} habitudes</p><p className="los-hs-sub">Streak max : {bestStreak}j 🔥</p></div>
            </div>
          </div>
        </div>

        {/* ── Alertes urgentes ── */}
        {urgentNotifs.length > 0 && (
          <div className="los-urgent-alerts">
            {urgentNotifs.slice(0, 3).map(n => (
              <div key={n.id} className="los-urgent-item" onClick={() => navigate(n.link)}>
                <AlertTriangle size={13} />
                <span className="los-urgent-module">{n.module}</span>
                <span className="los-urgent-title">{n.title}</span>
                <ArrowUpRight size={11} />
              </div>
            ))}
          </div>
        )}

        {/* ══════ GRILLE MODULES ══════ */}
        <div className="los-grid">

          {/* ── CRM ── */}
          <ModuleCard title="CRM Business" emoji="💼" link="/deals" color="#3d7fff">
            <div className="los-kpills">
              <KPill label="Pipeline pondéré" value={`${(pipeline/1000).toFixed(0)}k €`} color="#3d7fff" />
              <KPill label="Deals actifs"     value={openDeals.length}                   color="#3d7fff" />
              <KPill label="Tâches"           value={`${pendingTasks} en attente`}        color="var(--yellow)" />
              <KPill label="Clients"          value={clients.length}                      color="var(--text-secondary)" />
            </div>
            <div className="los-deals-mini">
              {openDeals.slice(0, 3).map(d => (
                <div key={d.id} className="los-deal-row">
                  <div className="los-deal-bar" style={{ background: d.probability >= 70 ? 'var(--green)' : 'var(--yellow)', width: `${d.probability}%` }} />
                  <span className="los-deal-title">{d.title}</span>
                  <span className="mono los-deal-val">{d.value.toLocaleString('fr-FR')} €</span>
                  <span className="los-deal-prob" style={{ color: d.probability >= 70 ? 'var(--green)' : 'var(--yellow)' }}>{d.probability}%</span>
                </div>
              ))}
            </div>
          </ModuleCard>

          {/* ── Contenu YouTube ── */}
          <ModuleCard title="Contenu YouTube" emoji="🎬" link="/content" color="#ff4d6a">
            <div className="los-kpills">
              <KPill label="Revenus mars"    value={`${lastContentRev.toLocaleString('fr-FR')} €`} color="#ff4d6a" trend={contentGrowth} />
              <KPill label="Abonnés YT"      value={`${(channelStats.subscribers/1000).toFixed(1)}k`} color="var(--text-secondary)" trend={12.4} />
              <KPill label="Vidéos"          value={channelStats.totalVideos}                         color="var(--text-secondary)" />
              <KPill label="Vues dernier mois" value={`${(videos[0].views/1000).toFixed(0)}k`}       color="var(--text-secondary)" />
            </div>
            <ResponsiveContainer width="100%" height={70}>
              <BarChart data={contentRevenueMonthly.slice(-5)} margin={{ top: 2, right: 0, bottom: 0, left: -20 }}>
                <XAxis dataKey="month" tick={{ fill: '#4a5470', fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-soft)', borderRadius: 8, fontSize: 11 }} formatter={v => `${v}€`} />
                <Bar dataKey="total" fill="#ff4d6a" radius={[2,2,0,0]} opacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </ModuleCard>

          {/* ── Réseaux sociaux ── */}
          <ModuleCard title="Réseaux Sociaux" emoji="📱" link="/social" color="#69C9D0">
            <div className="los-kpills">
              <KPill label="Abonnés total"  value={`${(totalFollowers/1000).toFixed(1)}k`}   color="#69C9D0" />
              <KPill label="Vues mars"      value={`${(totalViewsMon/1000).toFixed(0)}k`}     color="var(--text-secondary)" />
              <KPill label="TikTok"         value={`${(socialProfiles.tiktok.followers/1000).toFixed(1)}k`} color="#69C9D0" />
              <KPill label="Instagram"      value={`${(socialProfiles.instagram.followers/1000).toFixed(1)}k`} color="#E1306C" />
            </div>
            <div className="los-social-platforms">
              {Object.values(socialProfiles).map(p => {
                const last = socialMonthly[p.id]?.[socialMonthly[p.id].length - 1];
                return (
                  <div key={p.id} className="los-social-row">
                    <div className="los-social-logo" style={{ background: p.color + '22', color: p.color }}>{p.icon}</div>
                    <span className="los-social-name">{p.name.split(' ')[0]}</span>
                    <span className="mono los-social-followers">{(p.followers/1000).toFixed(1)}k</span>
                    <span className="mono" style={{ color: 'var(--green)', fontSize: 11 }}>+{last?.followers}</span>
                  </div>
                );
              })}
            </div>
          </ModuleCard>

          {/* ── Immobilier ── */}
          <ModuleCard title="Parc Immobilier 🇯🇵" emoji="🏠" link="/immo" color="#f5c842" span={2}>
            <div className="los-kpills">
              <KPill label="Patrimoine"     value={`${(totalPatrimony/1000000).toFixed(1)}M ¥`} color="#f5c842" />
              <KPill label="Loyers mars"    value={`${lastMonthRent.toLocaleString('fr-FR')} ¥`} color="var(--green)" />
              <KPill label="Taux d'occu."   value={`${Math.round(properties.filter(p=>p.status==='rented').length/properties.length*100)}%`} color="var(--text-secondary)" />
              <KPill label="Travaux urgents" value={urgentRepairs}                               color={urgentRepairs > 0 ? 'var(--red)' : 'var(--green)'} />
              <KPill label="Biens"          value={properties.length}                            color="var(--text-secondary)" />
            </div>
            <ResponsiveContainer width="100%" height={80}>
              <BarChart data={rentalRevenue} margin={{ top: 2, right: 0, bottom: 0, left: -20 }}>
                <XAxis dataKey="month" tick={{ fill: '#4a5470', fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-soft)', borderRadius: 8, fontSize: 11 }} formatter={v => `${v.toLocaleString('fr-FR')} ¥`} />
                <Bar dataKey="total" name="Total" fill="#f5c842" radius={[2,2,0,0]} opacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          </ModuleCard>

          {/* ── Investissements ── */}
          <ModuleCard title="Investissements" emoji="💰" link="/patrimoine" color="#2dd4a0" span={2}>
            <div className="los-kpills">
              <KPill label="Portfolio"      value={`${portfolioValue.toLocaleString('fr-FR', {maximumFractionDigits: 0})} €`} color="#2dd4a0" trend={Number(portMonthGrowth)} />
              <KPill label="P&L total"      value={`+${portfolioPnL}%`}                                                       color="var(--green)" />
              <KPill label="Ce mois"        value={`+${portMonthGrowth}%`}                                                    color={portMonthGrowth >= 0 ? 'var(--green)' : 'var(--red)'} />
              <KPill label="Positions"      value={holdings.length}                                                            color="var(--text-secondary)" />
            </div>
            <ResponsiveContainer width="100%" height={80}>
              <AreaChart data={portfolioHistory} margin={{ top: 2, right: 0, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="losPortGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2dd4a0" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#2dd4a0" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fill: '#4a5470', fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-soft)', borderRadius: 8, fontSize: 11 }} formatter={v => `${v.toLocaleString('fr-FR')} €`} />
                <Area type="monotone" dataKey="value" name="Valeur" stroke="#2dd4a0" strokeWidth={2} fill="url(#losPortGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </ModuleCard>

          {/* ── Santé & Sport ── */}
          <ModuleCard title="Santé & Sport" emoji="🏋️" link="/sante" color="#a78bfa">
            <div className="los-kpills">
              <KPill label="Poids"          value={`${latestMetric.weight} kg`}  color="#a78bfa" />
              <KPill label="Masse grasse"   value={`${latestMetric.bodyFat}%`}   color="var(--yellow)" />
              <KPill label="Séances / sem." value={sessionsWeek}                  color="var(--green)" />
              <KPill label="Calories auj."  value={`${calPct}%`}                  color={calPct <= 105 ? 'var(--green)' : 'var(--red)'} />
            </div>
            <ResponsiveContainer width="100%" height={70}>
              <LineChart data={bodyMetrics} margin={{ top: 2, right: 0, bottom: 0, left: -20 }}>
                <XAxis dataKey="date" tick={{ fill: '#4a5470', fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={v => v.slice(5, 7)} />
                <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-soft)', borderRadius: 8, fontSize: 11 }} />
                <Line type="monotone" dataKey="weight" name="Poids (kg)" stroke="#a78bfa" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ModuleCard>

          {/* ── Budget ── */}
          <ModuleCard title="Budget" emoji="💳" link="/budget" color="#fb923c">
            <div className="los-kpills">
              <KPill label="Revenus mars"  value={`${totalIncome.toLocaleString('fr-FR')} €`}      color="var(--green)" />
              <KPill label="Taux épargne"  value={`${savingsRate}%`}                               color="#fb923c" />
              <KPill label="Épargne mars"  value={`${lastBudget.savings.toLocaleString('fr-FR')} €`} color="var(--green)" />
              <KPill label="Dépenses"      value={`${lastBudget.expenses.toLocaleString('fr-FR')} €`} color="var(--red)" />
            </div>
            {/* Objectifs d'épargne */}
            <div className="los-savings-mini">
              {savingsGoals.slice(0, 3).map(g => {
                const pct = Math.round((g.current / g.target) * 100);
                return (
                  <div key={g.id} className="los-savings-row">
                    <span>{g.icon}</span>
                    <span className="los-savings-name">{g.name}</span>
                    <div className="los-savings-bar-wrap">
                      <div className="los-savings-bar" style={{ width: `${pct}%`, background: g.color }} />
                    </div>
                    <span className="mono" style={{ color: g.color, fontSize: 11 }}>{pct}%</span>
                  </div>
                );
              })}
            </div>
          </ModuleCard>

          {/* ── OKR ── */}
          <ModuleCard title="Objectifs & OKR" emoji="🎯" link="/okr" color="#3d7fff">
            <div className="los-kpills">
              <KPill label="Score global"  value={`${okrScore}%`}             color={okrScore >= 70 ? 'var(--green)' : 'var(--yellow)'} />
              <KPill label="Dans les temps" value={objectives.filter(o=>o.status==='on_track').length} color="var(--green)" />
              <KPill label="À risque"      value={atRiskOKR}                   color={atRiskOKR > 0 ? 'var(--red)' : 'var(--green)'} />
            </div>
            <div className="los-okr-list">
              {objectives.map(o => (
                <div key={o.id} className="los-okr-row">
                  <span>{o.icon}</span>
                  <span className="los-okr-title">{o.title.slice(0, 32)}…</span>
                  <div className="los-okr-bar-wrap">
                    <div className="los-okr-bar" style={{ width: `${o.progress}%`, background: o.color }} />
                  </div>
                  <span className="mono los-okr-pct" style={{ color: o.status === 'at_risk' ? 'var(--yellow)' : 'var(--text-muted)' }}>
                    {o.progress}%{o.status === 'at_risk' ? ' ⚠' : ''}
                  </span>
                </div>
              ))}
            </div>
          </ModuleCard>

          {/* ── Habitudes du jour ── */}
          <ModuleCard title="Habitudes du jour" emoji="🌱" link="/habitudes" color="#2dd4a0">
            <div className="los-kpills">
              <KPill label="Complétées auj." value={`${doneTodayCount}/${habits.length}`} color="#2dd4a0" />
              <KPill label="Meilleur streak"  value={`${bestStreak}j ${bestHabit?.icon}`}  color="var(--yellow)" />
            </div>
            <div className="los-habits-grid">
              {habits.map(h => {
                const hist = habitHistory[h.id];
                const todayDone = hist?.find(d => d.date === todayStr)?.done;
                return (
                  <div key={h.id} className={`los-habit-item ${todayDone ? 'done' : ''}`}>
                    <span className="los-habit-emoji">{h.icon}</span>
                    <span className="los-habit-name">{h.name}</span>
                    <div className="los-habit-streak" style={{ color: h.color }}>
                      {h.currentStreak > 0 && <>{h.currentStreak}🔥</>}
                    </div>
                    {todayDone
                      ? <CheckCircle2 size={14} color="var(--green)" strokeWidth={2} />
                      : <Circle size={14} color="var(--border-bright)" strokeWidth={1.5} />
                    }
                  </div>
                );
              })}
            </div>
          </ModuleCard>

        </div>
      </div>
    </div>
  );
}