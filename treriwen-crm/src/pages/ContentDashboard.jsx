import React from 'react';
import {
  AreaChart, Area, BarChart, Bar, ComposedChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  Youtube, Eye, ThumbsUp, Users, DollarSign,
  TrendingUp, TrendingDown, Play, Film, ArrowUpRight,
  Zap, RefreshCw
} from 'lucide-react';
import Topbar from '../components/layout/Topbar';
import {
  channelStats, contentRevenueMonthly, videos,
  partnerships, viewsMonthly, contentTools
} from '../data/mockDataContent';
import './Content.css';

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || p.fill || '#e8edf8' }} className="chart-tooltip-value">
          {p.name} : {typeof p.value === 'number' ? p.value.toLocaleString('fr-FR') : p.value}
          {['AdSense', 'Partenariats', 'Affiliation', 'Merch', 'Total'].includes(p.name) ? ' €' : ''}
        </p>
      ))}
    </div>
  );
};

export default function ContentDashboard() {
  // Calculs globaux
  const totalRevenue   = contentRevenueMonthly.reduce((s, m) => s + m.total, 0);
  const totalViews     = viewsMonthly.reduce((s, m) => s + m.views, 0);
  const totalSubs      = viewsMonthly.reduce((s, m) => s + m.subs, 0);
  const avgRetention   = Math.round(videos.reduce((s, v) => s + v.retentionRate, 0) / videos.length);
  const avgCtr         = (videos.reduce((s, v) => s + v.ctr, 0) / videos.length).toFixed(1);
  const totalAdsense   = contentRevenueMonthly.reduce((s, m) => s + m.adsense, 0);
  const totalPartners  = contentRevenueMonthly.reduce((s, m) => s + m.partnerships, 0);
  const totalAffil     = contentRevenueMonthly.reduce((s, m) => s + m.affiliation, 0);
  const totalMerch     = contentRevenueMonthly.reduce((s, m) => s + m.merch, 0);
  const toolsCost      = contentTools.reduce((s, t) => s + t.cost, 0);
  const prodCosts      = videos.reduce((s, v) => s + v.productionCost, 0);
  const totalCosts     = toolsCost * 7 + prodCosts; // 7 mois
  const netRevenue     = totalRevenue - totalCosts;

  // Croissance Mar vs Fév
  const lastM  = contentRevenueMonthly[contentRevenueMonthly.length - 1].total;
  const prevM  = contentRevenueMonthly[contentRevenueMonthly.length - 2].total;
  const growth = Math.round(((lastM - prevM) / prevM) * 100);

  // Dernières vidéos
  const recentVideos = [...videos].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)).slice(0, 5);

  // Partenariats actifs
  const activePartners = partnerships.filter(p => p.status === 'in_progress' || p.status === 'negotiation');

  return (
    <div className="page">
      <Topbar title="YouTube & Contenu" subtitle={`${channelStats.name} · ${channelStats.subscribers.toLocaleString('fr-FR')} abonnés`} />
      <div className="page-content">

        {/* ── Bandeau chaîne ── */}
        <div className="channel-banner">
          <div className="channel-avatar">{channelStats.avatar}</div>
          <div className="channel-info">
            <h2 className="channel-name">{channelStats.name}</h2>
            <p className="channel-handle">{channelStats.handle} · {channelStats.category}</p>
          </div>
          <div className="channel-stats-row">
            <div className="channel-stat">
              <p className="channel-stat-value mono">{channelStats.subscribers.toLocaleString('fr-FR')}</p>
              <p className="channel-stat-label">Abonnés</p>
            </div>
            <div className="channel-stat">
              <p className="channel-stat-value mono">{(channelStats.totalViews / 1000000).toFixed(1)}M</p>
              <p className="channel-stat-label">Vues totales</p>
            </div>
            <div className="channel-stat">
              <p className="channel-stat-value mono">{channelStats.totalVideos}</p>
              <p className="channel-stat-label">Vidéos</p>
            </div>
          </div>
          <div className="channel-growth">
            <TrendingUp size={14} color="var(--green)" />
            <span>+{channelStats.subscribersGrowth}% ce mois</span>
          </div>
        </div>

        {/* ── KPIs ── */}
        <div className="content-kpis stagger">
          {[
            { icon: DollarSign, label: "Revenus bruts",     value: `${totalRevenue.toLocaleString('fr-FR')} €`,    change: growth,   color: '#3d7fff', sub: `Net : ${netRevenue.toLocaleString('fr-FR')} €` },
            { icon: Eye,        label: "Vues totales",      value: `${(totalViews/1000).toFixed(0)}k`,              change: 38.2,     color: '#2dd4a0', sub: "7 derniers mois" },
            { icon: Users,      label: "Nouveaux abonnés",  value: `+${totalSubs.toLocaleString('fr-FR')}`,         change: 52.1,     color: '#a78bfa', sub: "7 derniers mois" },
            { icon: Play,       label: "Rétention moyenne", value: `${avgRetention}%`,                              change: 3.8,      color: '#f5c842', sub: "Toutes vidéos" },
            { icon: Zap,        label: "CTR moyen",         value: `${avgCtr}%`,                                    change: 1.2,      color: '#fb923c', sub: "Taux de clic miniature" },
            { icon: Film,       label: "Partenariats",      value: `${totalPartners.toLocaleString('fr-FR')} €`,    change: 66.7,     color: '#ff4d6a', sub: `${partnerships.filter(p=>p.status==='completed').length} terminés` },
          ].map(({ icon: Icon, label, value, change, color, sub }) => (
            <div key={label} className="content-kpi">
              <div className="content-kpi-icon" style={{ background: color + '18', color }}><Icon size={15} strokeWidth={1.8} /></div>
              <div className="content-kpi-body">
                <p className="content-kpi-value mono">{value}</p>
                <p className="content-kpi-label">{label}</p>
                {sub && <p className="content-kpi-sub">{sub}</p>}
              </div>
              <div className={`content-kpi-change ${change >= 0 ? 'pos' : 'neg'}`}>
                {change >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {Math.abs(change)}%
              </div>
            </div>
          ))}
        </div>

        {/* ── Graphes ── */}
        <div className="content-charts-row">
          {/* Revenus par source */}
          <div className="content-card wide">
            <div className="content-card-header">
              <div>
                <h3 className="content-card-title">Revenus par source</h3>
                <p className="content-card-sub">7 derniers mois</p>
              </div>
              <div className="content-legend">
                <span><span className="legend-dot-sm" style={{background:'#3d7fff'}}/>AdSense</span>
                <span><span className="legend-dot-sm" style={{background:'#a78bfa'}}/>Partenariats</span>
                <span><span className="legend-dot-sm" style={{background:'#2dd4a0'}}/>Affiliation</span>
                <span><span className="legend-dot-sm" style={{background:'#f5c842'}}/>Merch</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={contentRevenueMonthly} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
                <CartesianGrid stroke="#1e2740" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#4a5470', fontSize: 11, fontFamily: 'Syne' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#4a5470', fontSize: 10, fontFamily: 'Syne' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}€`} />
                <Tooltip content={<Tip />} />
                <Bar dataKey="adsense"      name="AdSense"      stackId="a" fill="#3d7fff" radius={[0,0,0,0]} />
                <Bar dataKey="partnerships" name="Partenariats" stackId="a" fill="#a78bfa" />
                <Bar dataKey="affiliation"  name="Affiliation"  stackId="a" fill="#2dd4a0" />
                <Bar dataKey="merch"        name="Merch"        stackId="a" fill="#f5c842" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
            {/* Répartition % */}
            <div className="revenue-split">
              {[
                { label: 'AdSense',      value: totalAdsense,  color: '#3d7fff' },
                { label: 'Partenariats', value: totalPartners, color: '#a78bfa' },
                { label: 'Affiliation',  value: totalAffil,    color: '#2dd4a0' },
                { label: 'Merch',        value: totalMerch,    color: '#f5c842' },
              ].map(s => (
                <div key={s.label} className="revenue-split-item">
                  <div className="revenue-split-dot" style={{ background: s.color }} />
                  <span className="revenue-split-label">{s.label}</span>
                  <span className="revenue-split-amount mono">{s.value.toLocaleString('fr-FR')} €</span>
                  <span className="revenue-split-pct mono">{Math.round((s.value / totalRevenue) * 100)}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Vues + abonnés */}
          <div className="content-card">
            <div className="content-card-header">
              <h3 className="content-card-title">Vues & Abonnés</h3>
              <p className="content-card-sub">Croissance mensuelle</p>
            </div>
            <ResponsiveContainer width="100%" height={150}>
              <ComposedChart data={viewsMonthly} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
                <defs>
                  <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3d7fff" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#3d7fff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1e2740" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#4a5470', fontSize: 10, fontFamily: 'Syne' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="views" hide />
                <YAxis yAxisId="subs"  hide orientation="right" />
                <Tooltip content={<Tip />} />
                <Area yAxisId="views" type="monotone" dataKey="views" name="Vues" stroke="#3d7fff" strokeWidth={2} fill="url(#viewsGrad)" dot={false} />
                <Line  yAxisId="subs"  type="monotone" dataKey="subs"  name="Abonnés" stroke="#2dd4a0" strokeWidth={2} dot={{ fill: '#2dd4a0', r: 3, stroke: '#0d1117', strokeWidth: 1.5 }} />
              </ComposedChart>
            </ResponsiveContainer>

            {/* Partenariats actifs */}
            <div className="content-card-header" style={{ marginTop: 16 }}>
              <h3 className="content-card-title">Partenariats en cours</h3>
              <a href="/content/partnerships" className="content-link">Voir tout <ArrowUpRight size={11} /></a>
            </div>
            {activePartners.length === 0
              ? <p className="content-empty">Aucun partenariat actif</p>
              : activePartners.map(p => (
                <div key={p.id} className="partner-mini-row">
                  <div className="partner-mini-logo" style={{ background: p.color + '22', color: p.color }}>{p.logo}</div>
                  <div className="partner-mini-info">
                    <p className="partner-mini-brand">{p.brand}</p>
                    <p className="partner-mini-type">{p.type}</p>
                  </div>
                  <span className={`partner-status-pill ${p.status}`}>
                    {p.status === 'in_progress' ? 'En cours' : 'Négociation'}
                  </span>
                  <span className="partner-mini-amount mono">{p.amount.toLocaleString('fr-FR')} €</span>
                </div>
              ))
            }
          </div>
        </div>

        {/* ── Vidéos récentes ── */}
        <div className="content-card">
          <div className="content-card-header">
            <div>
              <h3 className="content-card-title">Vidéos récentes</h3>
              <p className="content-card-sub">Performances des dernières publications</p>
            </div>
            <a href="/content/videos" className="content-link">Voir tout <ArrowUpRight size={11} /></a>
          </div>
          <table className="content-table">
            <thead>
              <tr>
                <th>Vidéo</th>
                <th>Vues</th>
                <th>Likes</th>
                <th>Rétention</th>
                <th>CTR</th>
                <th>AdSense</th>
                <th>Partenariat</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {recentVideos.map(v => {
                const total = v.adsenseRevenue + v.affiliationRevenue + v.partnershipRevenue;
                return (
                  <tr key={v.id}>
                    <td>
                      <div className="video-title-cell">
                        <span className="video-category-tag">{v.category}</span>
                        <p className="video-title-text">{v.title}</p>
                        <p className="video-date">{v.publishedAt} · {v.duration}</p>
                      </div>
                    </td>
                    <td className="mono video-metric">{v.views.toLocaleString('fr-FR')}</td>
                    <td className="mono video-metric">{v.likes.toLocaleString('fr-FR')}</td>
                    <td>
                      <div className="retention-bar-wrap">
                        <div className="retention-bar" style={{ width: `${v.retentionRate}%`, background: v.retentionRate >= 55 ? 'var(--green)' : v.retentionRate >= 45 ? 'var(--yellow)' : 'var(--red)' }} />
                      </div>
                      <span className="mono video-metric-sm">{v.retentionRate}%</span>
                    </td>
                    <td className="mono video-metric">{v.ctr}%</td>
                    <td className="mono video-revenue">{v.adsenseRevenue} €</td>
                    <td className="mono video-revenue">{v.partnershipRevenue > 0 ? `${v.partnershipRevenue.toLocaleString('fr-FR')} €` : '—'}</td>
                    <td className="mono video-total">{total.toLocaleString('fr-FR')} €</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ── Coûts ── */}
        <div className="content-costs-row">
          <div className="content-card">
            <div className="content-card-header">
              <h3 className="content-card-title">Charges mensuelles outils</h3>
              <span className="mono" style={{ color: 'var(--red)', fontSize: 13, fontWeight: 700 }}>
                -{toolsCost.toFixed(2)} €/mois
              </span>
            </div>
            {contentTools.map(t => (
              <div key={t.name} className="tool-cost-row">
                <span className="tool-name">{t.name}</span>
                <span className="tool-billing">{t.billing === 'monthly' ? 'Mensuel' : 'Annuel'}</span>
                <span className="mono tool-cost" style={{ color: 'var(--red)' }}>-{t.cost.toFixed(2)} €</span>
              </div>
            ))}
          </div>

          <div className="content-card">
            <div className="content-card-header">
              <h3 className="content-card-title">Résumé financier contenu</h3>
            </div>
            <div className="financial-summary">
              {[
                { label: 'Revenus bruts',        value: totalRevenue,         color: 'var(--green)',  sign: '+' },
                { label: 'Coûts de production',  value: -prodCosts,           color: 'var(--red)',    sign: '' },
                { label: 'Outils (7 mois)',       value: -(toolsCost * 7),    color: 'var(--red)',    sign: '' },
                { label: 'Revenus nets',          value: netRevenue,          color: netRevenue >= 0 ? 'var(--green)' : 'var(--red)', sign: '+', bold: true },
              ].map(({ label, value, color, sign, bold }) => (
                <div key={label} className={`fin-row ${bold ? 'fin-row-total' : ''}`}>
                  <span>{label}</span>
                  <span className="mono" style={{ color, fontWeight: bold ? 700 : 500 }}>
                    {value >= 0 ? sign : ''}{value.toLocaleString('fr-FR')} €
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}