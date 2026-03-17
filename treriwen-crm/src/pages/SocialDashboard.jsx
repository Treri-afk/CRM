import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';
import {
  TrendingUp, TrendingDown, Eye, Heart, MessageSquare,
  Share2, Users, ArrowUpRight, Zap
} from 'lucide-react';
import Topbar from '../components/layout/Topbar';
import {
  socialProfiles, socialMonthly, followersGrowth,
  engagementComparison, socialPosts
} from '../data/mockDataSocial';
import './Social.css';

/* ─── Tooltip ─────────────────────────────────────────────────────────────── */
const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || p.stroke }} className="chart-tooltip-value">
          {p.name} : {typeof p.value === 'number' ? p.value.toLocaleString('fr-FR') : p.value}
          {p.name?.includes('Engagement') ? '%' : ''}
        </p>
      ))}
    </div>
  );
};

/* ─── Platform card ───────────────────────────────────────────────────────── */
function PlatformCard({ profile, monthly, onClick }) {
  const last  = monthly[monthly.length - 1];
  const prev  = monthly[monthly.length - 2];
  const viewsGrowth = Math.round(((last.views - prev.views) / prev.views) * 100);
  const follGrowth  = last.followers;

  return (
    <div className="social-platform-card" onClick={onClick} style={{ '--platform-color': profile.color }}>
      <div className="spc-header">
        <div className="spc-logo" style={{ background: profile.gradient }}>
          <span>{profile.icon}</span>
        </div>
        <div className="spc-info">
          <p className="spc-name">{profile.name}</p>
          <p className="spc-handle">{profile.handle}</p>
        </div>
        <ArrowUpRight size={14} className="spc-arrow" />
      </div>

      <div className="spc-followers">
        <p className="spc-followers-val mono">
          {profile.followers >= 1000
            ? `${(profile.followers / 1000).toFixed(1)}k`
            : profile.followers.toLocaleString('fr-FR')}
        </p>
        <p className="spc-followers-lbl">abonnés</p>
        <span className={`spc-growth ${follGrowth >= 0 ? 'pos' : 'neg'}`}>
          +{follGrowth.toLocaleString('fr-FR')} ce mois
        </span>
      </div>

      <div className="spc-stats">
        <div className="spc-stat">
          <Eye size={11} />
          <span className="mono">{(last.views / 1000).toFixed(0)}k</span>
          <span>vues</span>
        </div>
        <div className="spc-stat">
          <Heart size={11} />
          <span className="mono">{(last.likes / 1000).toFixed(1)}k</span>
          <span>likes</span>
        </div>
        <div className="spc-stat">
          <Zap size={11} />
          <span className="mono">{last.engagement}%</span>
          <span>eng.</span>
        </div>
      </div>

      <div className="spc-mini-chart">
        <ResponsiveContainer width="100%" height={44}>
          <AreaChart data={monthly} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={`grad-${profile.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={profile.color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={profile.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="views"
              stroke={profile.color}
              strokeWidth={2}
              fill={`url(#grad-${profile.id})`}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="spc-footer">
        <span className={`spc-trend ${viewsGrowth >= 0 ? 'pos' : 'neg'}`}>
          {viewsGrowth >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {Math.abs(viewsGrowth)}% vues vs mois dernier
        </span>
      </div>
    </div>
  );
}

/* ─── Post row ────────────────────────────────────────────────────────────── */
function PostRow({ post, color }) {
  const typeConfig = {
    reel:      { label: 'Reel',    bg: 'rgba(225,48,108,0.15)', color: '#E1306C' },
    carousel:  { label: 'Carousel', bg: 'rgba(61,127,255,0.12)', color: '#3d7fff' },
    story:     { label: 'Story',   bg: 'rgba(167,139,250,0.12)', color: '#a78bfa' },
    video:     { label: 'Vidéo',   bg: 'rgba(105,201,208,0.15)', color: '#69C9D0' },
    short:     { label: 'Short',   bg: 'rgba(255,0,0,0.12)', color: '#FF0000' },
    thread:    { label: 'Thread',  bg: 'rgba(29,161,242,0.12)', color: '#1DA1F2' },
    tweet:     { label: 'Tweet',   bg: 'rgba(29,161,242,0.12)', color: '#1DA1F2' },
  };
  const tc = typeConfig[post.type] || { label: post.type, bg: 'rgba(136,146,170,0.1)', color: '#8892aa' };

  return (
    <div className="post-row">
      <div className="post-type-badge" style={{ background: tc.bg, color: tc.color }}>{tc.label}</div>
      <div className="post-caption">{post.caption.slice(0, 60)}{post.caption.length > 60 ? '…' : ''}</div>
      <div className="post-date mono">{post.publishedAt}</div>
      <div className="post-metric"><Eye size={11} />{(post.views / 1000).toFixed(0)}k</div>
      <div className="post-metric"><Heart size={11} />{(post.likes / 1000).toFixed(1)}k</div>
      <div className="post-metric"><MessageSquare size={11} />{post.comments.toLocaleString('fr-FR')}</div>
      <div className="post-metric"><Share2 size={11} />{(post.shares / 1000).toFixed(1)}k</div>
      {post.engagement > 0
        ? <div className="post-engagement" style={{ color: post.engagement >= 7 ? 'var(--green)' : post.engagement >= 4 ? 'var(--yellow)' : 'var(--text-muted)' }}>
            <Zap size={10} />{post.engagement}%
          </div>
        : <div className="post-engagement" style={{ color: 'var(--text-muted)' }}>—</div>
      }
    </div>
  );
}

/* ─── Page principale ─────────────────────────────────────────────────────── */
export default function SocialDashboard() {
  const navigate = useNavigate();
  const [activeNetwork, setActiveNetwork] = useState(null);

  // Totaux globaux (dernier mois)
  const networks = Object.values(socialProfiles);
  const totalFollowers  = networks.reduce((s, p) => s + p.followers, 0);
  const totalViewsMonth = Object.entries(socialMonthly).reduce((s, [, data]) => s + data[data.length - 1].views, 0);
  const totalLikesMonth = Object.entries(socialMonthly).reduce((s, [, data]) => s + data[data.length - 1].likes, 0);
  const totalSubsMonth  = Object.entries(socialMonthly).reduce((s, [, data]) => s + data[data.length - 1].followers, 0);
  const avgEngagement   = (Object.entries(socialMonthly).reduce((s, [, data]) => s + data[data.length - 1].engagement, 0) / networks.length).toFixed(1);

  // Plateforme la + performante ce mois
  const bestPlatform = Object.entries(socialMonthly)
    .map(([id, data]) => ({ id, views: data[data.length - 1].views }))
    .sort((a, b) => b.views - a.views)[0];

  // Tous les posts pour le top
  const allPosts = Object.entries(socialPosts).flatMap(([network, posts]) =>
    posts.map(p => ({ ...p, network, color: socialProfiles[network]?.color }))
  ).sort((a, b) => b.views - a.views);

  return (
    <div className="page">
      <Topbar title="Réseaux Sociaux" subtitle="Dashboard global toutes plateformes" />
      <div className="page-content">

        {/* ── KPIs globaux ── */}
        <div className="social-kpis stagger">
          {[
            { icon: Users,          label: 'Abonnés total',      value: `${(totalFollowers / 1000).toFixed(1)}k`, color: '#3d7fff',  sub: `Sur ${networks.length} plateformes` },
            { icon: Eye,            label: 'Vues ce mois',       value: `${(totalViewsMonth / 1000).toFixed(0)}k`, color: '#2dd4a0', sub: 'Toutes plateformes' },
            { icon: Heart,          label: 'Likes ce mois',      value: `${(totalLikesMonth / 1000).toFixed(1)}k`, color: '#E1306C', sub: 'Toutes plateformes' },
            { icon: Users,          label: 'Nouveaux abonnés',   value: `+${totalSubsMonth.toLocaleString('fr-FR')}`, color: '#a78bfa', sub: 'Ce mois' },
            { icon: Zap,            label: 'Engagement moyen',   value: `${avgEngagement}%`, color: '#f5c842', sub: 'Toutes plateformes' },
            { icon: TrendingUp,     label: 'Meilleure plateforme', value: socialProfiles[bestPlatform?.id]?.name || '—', color: socialProfiles[bestPlatform?.id]?.color || '#3d7fff', sub: `${(bestPlatform?.views / 1000).toFixed(0)}k vues` },
          ].map(({ icon: Icon, label, value, color, sub }) => (
            <div key={label} className="social-kpi">
              <div className="social-kpi-icon" style={{ background: color + '18', color }}><Icon size={15} strokeWidth={1.8} /></div>
              <div>
                <p className="social-kpi-val mono">{value}</p>
                <p className="social-kpi-label">{label}</p>
                <p className="social-kpi-sub">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Cartes plateformes ── */}
        <div className="social-platforms-grid">
          {networks.map(profile => (
            <PlatformCard
              key={profile.id}
              profile={profile}
              monthly={socialMonthly[profile.id]}
              onClick={() => navigate(`/social/${profile.id}`)}
            />
          ))}
        </div>

        {/* ── Graphes comparatifs ── */}
        <div className="social-charts-row">
          {/* Croissance abonnés */}
          <div className="social-card wide">
            <div className="social-card-header">
              <div>
                <h3 className="social-card-title">Croissance des abonnés</h3>
                <p className="social-card-sub">Toutes plateformes — 7 mois</p>
              </div>
              <div className="social-legend">
                {networks.map(p => (
                  <span key={p.id}><span className="soc-dot" style={{ background: p.color }} />{p.name.split(' ')[0]}</span>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={followersGrowth} margin={{ top: 5, right: 10, bottom: 0, left: -10 }}>
                <CartesianGrid stroke="#1e2740" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#4a5470', fontSize: 11, fontFamily: 'Syne' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#4a5470', fontSize: 10, fontFamily: 'Syne' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<Tip />} />
                <Line type="monotone" dataKey="instagram"      name="Instagram"  stroke="#E1306C" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                <Line type="monotone" dataKey="tiktok"         name="TikTok"     stroke="#69C9D0" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                <Line type="monotone" dataKey="twitter"        name="X/Twitter"  stroke="#1DA1F2" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                <Line type="monotone" dataKey="youtube_shorts" name="YT Shorts"  stroke="#FF0000" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Engagement comparatif */}
          <div className="social-card">
            <div className="social-card-header">
              <h3 className="social-card-title">Taux d'engagement</h3>
              <p className="social-card-sub">Par plateforme</p>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={engagementComparison} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <CartesianGrid stroke="#1e2740" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#4a5470', fontSize: 10, fontFamily: 'Syne' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#4a5470', fontSize: 10, fontFamily: 'Syne' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                <Tooltip content={<Tip />} />
                <Line type="monotone" dataKey="instagram"      name="Instagram (%)"  stroke="#E1306C" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="tiktok"         name="TikTok (%)"     stroke="#69C9D0" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="twitter"        name="X/Twitter (%)"  stroke="#1DA1F2" strokeWidth={1.5} strokeDasharray="4 3" dot={false} />
                <Line type="monotone" dataKey="youtube_shorts" name="YT Shorts (%)"  stroke="#FF0000" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Vues par plateforme (barres) ── */}
        <div className="social-card">
          <div className="social-card-header">
            <div>
              <h3 className="social-card-title">Vues mensuelles par plateforme</h3>
              <p className="social-card-sub">7 derniers mois</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={socialMonthly.instagram.map((m, i) => ({
                month: m.month,
                Instagram:  m.views,
                TikTok:     socialMonthly.tiktok[i].views,
                'X/Twitter': socialMonthly.twitter[i].views,
                'YT Shorts': socialMonthly.youtube_shorts[i].views,
              }))}
              margin={{ top: 5, right: 10, bottom: 0, left: -10 }}
            >
              <CartesianGrid stroke="#1e2740" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#4a5470', fontSize: 11, fontFamily: 'Syne' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#4a5470', fontSize: 10, fontFamily: 'Syne' }} axisLine={false} tickLine={false} tickFormatter={v => `${v/1000}k`} />
              <Tooltip content={<Tip />} />
              <Bar dataKey="Instagram"  fill="#E1306C" stackId="a" opacity={0.85} />
              <Bar dataKey="TikTok"     fill="#69C9D0" stackId="a" opacity={0.85} />
              <Bar dataKey="X/Twitter" fill="#1DA1F2" stackId="a" opacity={0.85} />
              <Bar dataKey="YT Shorts" fill="#FF0000" stackId="a" opacity={0.85} radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="social-legend" style={{ marginTop: 10 }}>
            {[['Instagram','#E1306C'],['TikTok','#69C9D0'],['X/Twitter','#1DA1F2'],['YT Shorts','#FF0000']].map(([name,color]) => (
              <span key={name}><span className="soc-dot" style={{ background: color }} />{name}</span>
            ))}
          </div>
        </div>

        {/* ── Top posts tous réseaux ── */}
        <div className="social-card">
          <div className="social-card-header">
            <h3 className="social-card-title">Top posts — Toutes plateformes</h3>
            <p className="social-card-sub">Classés par vues</p>
          </div>
          <div className="posts-table-header">
            <span>Type</span>
            <span>Contenu</span>
            <span>Date</span>
            <span><Eye size={11} /> Vues</span>
            <span><Heart size={11} /> Likes</span>
            <span><MessageSquare size={11} /></span>
            <span><Share2 size={11} /></span>
            <span><Zap size={11} /> Eng.</span>
          </div>
          <div className="posts-list">
            {allPosts.slice(0, 12).map(post => (
              <PostRow key={post.id} post={post} color={post.color} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}