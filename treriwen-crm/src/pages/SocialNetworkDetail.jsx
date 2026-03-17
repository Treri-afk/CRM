import React, { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  Eye, Heart, MessageSquare, Share2, Users,
  TrendingUp, TrendingDown, Zap, ArrowLeft,
  BookmarkIcon, BarChart2
} from 'lucide-react';
import Topbar from '../components/layout/Topbar';
import {
  socialProfiles, socialMonthly, socialPosts
} from '../data/mockDataSocial';
import './Social.css';

const Tip = ({ active, payload, label, suffix = '' }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || p.fill || '#e8edf8' }} className="chart-tooltip-value">
          {p.name} : {typeof p.value === 'number' ? p.value.toLocaleString('fr-FR') : p.value}{suffix}
        </p>
      ))}
    </div>
  );
};

const typeConfig = {
  reel:     { label: 'Reel',    bg: 'rgba(225,48,108,0.15)',  color: '#E1306C' },
  carousel: { label: 'Carousel',bg: 'rgba(61,127,255,0.12)',  color: '#3d7fff' },
  story:    { label: 'Story',   bg: 'rgba(167,139,250,0.12)', color: '#a78bfa' },
  video:    { label: 'Vidéo',   bg: 'rgba(105,201,208,0.15)', color: '#69C9D0' },
  short:    { label: 'Short',   bg: 'rgba(255,0,0,0.12)',     color: '#FF0000' },
  thread:   { label: 'Thread',  bg: 'rgba(29,161,242,0.12)',  color: '#1DA1F2' },
  tweet:    { label: 'Tweet',   bg: 'rgba(29,161,242,0.12)',  color: '#1DA1F2' },
};

export default function SocialNetworkDetail({ networkId, onBack }) {
  const [sortBy, setSortBy] = useState('views');

  const profile  = socialProfiles[networkId];
  const monthly  = socialMonthly[networkId];
  const posts    = socialPosts[networkId] || [];

  if (!profile) return null;

  const last   = monthly[monthly.length - 1];
  const prev   = monthly[monthly.length - 2];

  const totalViews    = monthly.reduce((s, m) => s + m.views, 0);
  const totalLikes    = monthly.reduce((s, m) => s + m.likes, 0);
  const totalComments = monthly.reduce((s, m) => s + m.comments, 0);
  const totalShares   = monthly.reduce((s, m) => s + m.shares, 0);
  const totalSubs     = monthly.reduce((s, m) => s + m.followers, 0);
  const avgEng        = (monthly.reduce((s, m) => s + m.engagement, 0) / monthly.length).toFixed(1);

  const viewsGrowth  = Math.round(((last.views - prev.views) / prev.views) * 100);
  const likesGrowth  = Math.round(((last.likes - prev.likes) / prev.likes) * 100);
  const subsGrowth   = last.followers - prev.followers;

  const bestPost = [...posts].sort((a, b) => b.views - a.views)[0];
  const mostEngaged = [...posts].filter(p => p.engagement > 0).sort((a, b) => b.engagement - a.engagement)[0];

  const sortedPosts = [...posts].sort((a, b) => {
    if (sortBy === 'views')    return b.views - a.views;
    if (sortBy === 'likes')    return b.likes - a.likes;
    if (sortBy === 'comments') return b.comments - a.comments;
    if (sortBy === 'engagement') return b.engagement - a.engagement;
    return new Date(b.publishedAt) - new Date(a.publishedAt);
  });

  return (
    <div className="page">
      <Topbar
        title={profile.name}
        subtitle={`${profile.handle} · ${profile.followers.toLocaleString('fr-FR')} abonnés`}
      />
      <div className="page-content">

        {/* ── Header réseau ── */}
        <div className="snd-header" style={{ borderColor: profile.color + '44' }}>
          <div className="snd-header-left">
            <div className="snd-logo" style={{ background: profile.gradient }}>
              <span>{profile.icon}</span>
            </div>
            <div>
              <h2 className="snd-name">{profile.name}</h2>
              <p className="snd-handle">{profile.handle}</p>
            </div>
          </div>
          <div className="snd-header-stats">
            <div className="snd-stat-pill">
              <p className="mono">{profile.followers.toLocaleString('fr-FR')}</p>
              <p>Abonnés</p>
            </div>
            <div className="snd-stat-pill">
              <p className="mono">{profile.posts.toLocaleString('fr-FR')}</p>
              <p>Publications</p>
            </div>
            {profile.following > 0 && (
              <div className="snd-stat-pill">
                <p className="mono">{profile.following.toLocaleString('fr-FR')}</p>
                <p>Suivis</p>
              </div>
            )}
          </div>
        </div>

        {/* ── KPIs ── */}
        <div className="snd-kpis stagger">
          {[
            { icon: Eye,          label: 'Vues totales',   value: `${(totalViews/1000).toFixed(0)}k`,   change: viewsGrowth, color: profile.color  },
            { icon: Heart,        label: 'Likes totaux',   value: `${(totalLikes/1000).toFixed(1)}k`,   change: likesGrowth, color: '#E1306C'       },
            { icon: MessageSquare,label: 'Commentaires',   value: totalComments.toLocaleString('fr-FR'), change: null,        color: '#a78bfa'       },
            { icon: Share2,       label: 'Partages',       value: `${(totalShares/1000).toFixed(1)}k`,  change: null,        color: '#2dd4a0'       },
            { icon: Users,        label: 'Nouveaux abonnés',value: `+${totalSubs.toLocaleString('fr-FR')}`, change: null,   color: '#f5c842'       },
            { icon: Zap,          label: 'Engagement moy.',value: `${avgEng}%`,                          change: null,        color: '#fb923c'       },
          ].map(({ icon: Icon, label, value, change, color }) => (
            <div key={label} className="snd-kpi">
              <div className="snd-kpi-icon" style={{ background: color + '18', color }}><Icon size={14} strokeWidth={1.8} /></div>
              <div>
                <p className="snd-kpi-val mono">{value}</p>
                <p className="snd-kpi-label">{label}</p>
              </div>
              {change !== null && (
                <div className={`snd-kpi-change ${change >= 0 ? 'pos' : 'neg'}`}>
                  {change >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {Math.abs(change)}%
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── Meilleurs posts highlights ── */}
        <div className="snd-highlights">
          {bestPost && (
            <div className="snd-highlight" style={{ borderColor: profile.color + '44' }}>
              <p className="snd-highlight-label">🏆 Post le plus vu</p>
              <p className="snd-highlight-caption">{bestPost.caption.slice(0, 80)}…</p>
              <div className="snd-highlight-stats">
                <span className="mono" style={{ color: profile.color }}>{bestPost.views.toLocaleString('fr-FR')} vues</span>
                <span className="mono">{bestPost.likes.toLocaleString('fr-FR')} likes</span>
                <span>{bestPost.publishedAt}</span>
              </div>
            </div>
          )}
          {mostEngaged && (
            <div className="snd-highlight" style={{ borderColor: '#2dd4a0' + '44' }}>
              <p className="snd-highlight-label">⚡ Meilleur engagement</p>
              <p className="snd-highlight-caption">{mostEngaged.caption.slice(0, 80)}…</p>
              <div className="snd-highlight-stats">
                <span className="mono" style={{ color: '#2dd4a0' }}>{mostEngaged.engagement}% engagement</span>
                <span className="mono">{mostEngaged.likes.toLocaleString('fr-FR')} likes</span>
                <span>{mostEngaged.publishedAt}</span>
              </div>
            </div>
          )}
        </div>

        {/* ── Graphiques ── */}
        <div className="snd-charts-row">
          {/* Vues + likes */}
          <div className="social-card wide">
            <div className="social-card-header">
              <h3 className="social-card-title">Vues & Likes mensuels</h3>
              <p className="social-card-sub">7 derniers mois</p>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <ComposedChart data={monthly} margin={{ top: 5, right: 10, bottom: 0, left: -10 }}>
                <defs>
                  <linearGradient id="sndViewsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={profile.color} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={profile.color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1e2740" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#4a5470', fontSize: 11, fontFamily: 'Syne' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="v" hide />
                <YAxis yAxisId="l" hide orientation="right" />
                <Tooltip content={<Tip />} />
                <Area yAxisId="v" type="monotone" dataKey="views" name="Vues" stroke={profile.color} strokeWidth={2.5} fill="url(#sndViewsGrad)" dot={false} activeDot={{ r: 4, fill: profile.color }} />
                <Line yAxisId="l" type="monotone" dataKey="likes" name="Likes" stroke="#E1306C" strokeWidth={2} dot={false} activeDot={{ r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Engagement + abonnés */}
          <div className="social-card">
            <div className="social-card-header">
              <h3 className="social-card-title">Engagement & Abonnés</h3>
            </div>
            <ResponsiveContainer width="100%" height={100}>
              <AreaChart data={monthly} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="sndEngGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f5c842" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#f5c842" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fill: '#4a5470', fontSize: 10, fontFamily: 'Syne' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip content={<Tip suffix="%" />} />
                <Area type="monotone" dataKey="engagement" name="Engagement" stroke="#f5c842" strokeWidth={2} fill="url(#sndEngGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>

            <div className="social-card-header" style={{ marginTop: 14 }}>
              <h3 className="social-card-title">Nouveaux abonnés / mois</h3>
            </div>
            <ResponsiveContainer width="100%" height={80}>
              <BarChart data={monthly} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <XAxis dataKey="month" tick={{ fill: '#4a5470', fontSize: 10, fontFamily: 'Syne' }} axisLine={false} tickLine={false} />
                <Tooltip content={<Tip />} />
                <Bar dataKey="followers" name="Abonnés" fill={profile.color} radius={[3,3,0,0]} opacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Commentaires + partages ── */}
        <div className="social-card">
          <div className="social-card-header">
            <h3 className="social-card-title">Commentaires & Partages</h3>
            <p className="social-card-sub">Interaction mensuelle</p>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={monthly} margin={{ top: 5, right: 10, bottom: 0, left: -10 }}>
              <CartesianGrid stroke="#1e2740" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#4a5470', fontSize: 11, fontFamily: 'Syne' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#4a5470', fontSize: 10, fontFamily: 'Syne' }} axisLine={false} tickLine={false} />
              <Tooltip content={<Tip />} />
              <Bar dataKey="comments" name="Commentaires" fill="#a78bfa" radius={[2,2,0,0]} />
              <Bar dataKey="shares"   name="Partages"     fill="#2dd4a0" radius={[2,2,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ── Posts ── */}
        <div className="social-card">
          <div className="social-card-header">
            <div>
              <h3 className="social-card-title">Publications — {profile.name}</h3>
              <p className="social-card-sub">{posts.length} publications</p>
            </div>
            <select
              className="snd-sort-select"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              <option value="date">Plus récentes</option>
              <option value="views">Plus vues</option>
              <option value="likes">Plus likées</option>
              <option value="comments">Plus commentées</option>
              <option value="engagement">Meilleur engagement</option>
            </select>
          </div>
          <div className="posts-table-header">
            <span>Type</span>
            <span>Contenu</span>
            <span>Date</span>
            <span><Eye size={11} /></span>
            <span><Heart size={11} /></span>
            <span><MessageSquare size={11} /></span>
            <span><Share2 size={11} /></span>
            {posts[0]?.saves !== undefined && <span><BookmarkIcon size={11} /></span>}
            <span><Zap size={11} /></span>
          </div>
          <div className="posts-list">
            {sortedPosts.map(post => {
              const tc = typeConfig[post.type] || { label: post.type, bg: 'rgba(136,146,170,0.1)', color: '#8892aa' };
              return (
                <div key={post.id} className="post-row">
                  <div className="post-type-badge" style={{ background: tc.bg, color: tc.color }}>{tc.label}</div>
                  <div className="post-caption">{post.caption.slice(0, 60)}{post.caption.length > 60 ? '…' : ''}</div>
                  <div className="post-date mono">{post.publishedAt}</div>
                  <div className="post-metric"><Eye size={10} />{(post.views/1000).toFixed(0)}k</div>
                  <div className="post-metric"><Heart size={10} />{(post.likes/1000).toFixed(1)}k</div>
                  <div className="post-metric"><MessageSquare size={10} />{post.comments.toLocaleString('fr-FR')}</div>
                  <div className="post-metric"><Share2 size={10} />{(post.shares/1000).toFixed(1)}k</div>
                  {post.saves !== undefined && (
                    <div className="post-metric"><BookmarkIcon size={10} />{(post.saves/1000).toFixed(1)}k</div>
                  )}
                  {post.engagement > 0
                    ? <div className="post-engagement" style={{ color: post.engagement >= 7 ? 'var(--green)' : post.engagement >= 4 ? 'var(--yellow)' : 'var(--text-muted)' }}>
                        <Zap size={10} />{post.engagement}%
                      </div>
                    : <div className="post-engagement" style={{ color: 'var(--text-muted)' }}>—</div>
                  }
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}