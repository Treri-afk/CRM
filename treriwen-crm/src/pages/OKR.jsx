import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import {
  Target, TrendingUp, CheckCircle2, AlertTriangle, Clock,
  Plus, ChevronDown, ChevronUp, Calendar, Zap, Link2
} from 'lucide-react';
import Topbar from '../components/layout/Topbar';
import { objectives, weeklyCheckIns } from '../data/mockDataPerso';
import './Perso.css';

const statusCfg = {
  on_track: { label: 'Dans les temps', color: 'var(--green)',  bg: 'var(--green-dim)',  icon: CheckCircle2 },
  at_risk:  { label: 'À risque',       color: 'var(--yellow)', bg: 'var(--yellow-dim)', icon: AlertTriangle },
  off_track:{ label: 'En retard',      color: 'var(--red)',    bg: 'var(--red-dim)',     icon: Clock },
  done:     { label: 'Atteint',        color: 'var(--accent-bright)', bg: 'var(--accent-dim)', icon: CheckCircle2 },
};

const catColors = {
  finance:    '#2dd4a0',
  contenu:    '#ff4d6a',
  santé:      '#a78bfa',
  immobilier: '#f5c842',
};

function OKRCard({ obj, expanded, onToggle }) {
  const sc   = statusCfg[obj.status];
  const Icon = sc.icon;

  return (
    <div className="okr-card" style={{ borderLeftColor: obj.color }}>
      {/* Header */}
      <div className="okr-card-header" onClick={onToggle}>
        <span className="okr-icon">{obj.icon}</span>
        <div className="okr-title-block">
          <div className="okr-title-row">
            <p className="okr-title">{obj.title}</p>
            <span className="okr-status-pill" style={{ color: sc.color, background: sc.bg }}>
              <Icon size={11} strokeWidth={2} /> {sc.label}
            </span>
            {obj.quarter && (
              <span className="okr-period-badge">Q{obj.quarter} {obj.year}</span>
            )}
          </div>
          <p className="okr-description">{obj.description}</p>
        </div>
        <div className="okr-progress-block">
          <div className="okr-progress-ring-wrap">
            <svg width="56" height="56" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r="24" fill="none" stroke="var(--border-soft)" strokeWidth="5" />
              <circle
                cx="28" cy="28" r="24" fill="none"
                stroke={obj.color}
                strokeWidth="5"
                strokeDasharray={`${obj.progress * 1.508} 150.8`}
                strokeLinecap="round"
                transform="rotate(-90 28 28)"
              />
            </svg>
            <span className="okr-ring-pct mono" style={{ color: obj.color }}>{obj.progress}%</span>
          </div>
          {expanded ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
        </div>
      </div>

      {/* Key Results */}
      {expanded && (
        <div className="okr-krs fade-in">
          <p className="okr-krs-title">Key Results</p>
          {obj.keyResults.map(kr => (
            <div key={kr.id} className="okr-kr-row">
              <div className="okr-kr-info">
                <p className="okr-kr-label">{kr.label}</p>
                <div className="okr-kr-values">
                  <span className="mono">{typeof kr.current === 'number' ? kr.current.toLocaleString('fr-FR') : kr.current} {kr.unit}</span>
                  <span className="okr-kr-sep">→</span>
                  <span className="mono okr-kr-target">{kr.target.toLocaleString('fr-FR')} {kr.unit}</span>
                </div>
              </div>
              <div className="okr-kr-bar-wrap">
                <div
                  className="okr-kr-bar"
                  style={{
                    width: `${kr.progress}%`,
                    background: kr.progress >= 100 ? 'var(--green)' : kr.progress >= 70 ? obj.color : kr.progress >= 40 ? 'var(--yellow)' : 'var(--red)',
                  }}
                />
              </div>
              <span className="mono okr-kr-pct" style={{ color: kr.progress >= 100 ? 'var(--green)' : 'var(--text-muted)' }}>
                {kr.progress}%
              </span>
            </div>
          ))}

          {/* Modules liés */}
          {obj.linkedModules && (
            <div className="okr-linked">
              <Link2 size={12} />
              {obj.linkedModules.map(m => (
                <span key={m} className="okr-linked-badge">{m}</span>
              ))}
            </div>
          )}

          {/* Check-ins */}
          {weeklyCheckIns.filter(c => c.objectiveId === obj.id).length > 0 && (
            <div className="okr-checkins">
              <p className="okr-krs-title">Derniers check-ins</p>
              {weeklyCheckIns.filter(c => c.objectiveId === obj.id).slice(0, 2).map(c => (
                <div key={c.id} className="okr-checkin-row">
                  <span className="mono okr-ci-date">{c.date}</span>
                  <span>{'⭐'.repeat(c.mood)}</span>
                  <p className="okr-ci-note">{c.note}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function OKR() {
  const [expanded, setExpanded] = useState(null);
  const [filter,   setFilter]   = useState('all');

  // Score global
  const globalScore = Math.round(objectives.reduce((s, o) => s + o.progress, 0) / objectives.length);
  const onTrack     = objectives.filter(o => o.status === 'on_track').length;
  const atRisk      = objectives.filter(o => o.status === 'at_risk').length;
  const totalKRs    = objectives.reduce((s, o) => s + o.keyResults.length, 0);
  const doneKRs     = objectives.reduce((s, o) => s + o.keyResults.filter(kr => kr.progress >= 100).length, 0);

  // Graphe par objectif
  const barData = objectives.map(o => ({ name: o.icon + ' ' + o.title.slice(0, 20), progress: o.progress, color: o.color }));

  const filtered = objectives.filter(o => filter === 'all' || o.category === filter || o.status === filter);
  const categories = [...new Set(objectives.map(o => o.category))];

  return (
    <div className="page">
      <Topbar title="Objectifs & OKR" subtitle={`Score global ${globalScore}% · ${onTrack} dans les temps`} />
      <div className="page-content">

        {/* Score global */}
        <div className="okr-global-banner">
          <div className="okr-global-score">
            <div className="okr-global-ring">
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="44" fill="none" stroke="var(--border-soft)" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="44" fill="none"
                  stroke={globalScore >= 70 ? 'var(--green)' : globalScore >= 50 ? 'var(--yellow)' : 'var(--red)'}
                  strokeWidth="8"
                  strokeDasharray={`${globalScore * 2.764} 276.4`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="okr-global-center">
                <span className="mono">{globalScore}%</span>
                <span>Score</span>
              </div>
            </div>
          </div>
          <div className="okr-global-stats">
            {[
              { label: 'Objectifs actifs', value: objectives.length,   color: 'var(--text-primary)' },
              { label: 'Dans les temps',   value: onTrack,             color: 'var(--green)' },
              { label: 'À risque',         value: atRisk,              color: 'var(--yellow)' },
              { label: 'KRs atteints',     value: `${doneKRs}/${totalKRs}`, color: 'var(--accent-bright)' },
            ].map(({ label, value, color }) => (
              <div key={label} className="okr-global-stat">
                <p className="mono" style={{ color, fontSize: 22, fontWeight: 700 }}>{value}</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{label}</p>
              </div>
            ))}
          </div>
          <div className="okr-bar-chart">
            <ResponsiveContainer width="100%" height={80}>
              <BarChart data={barData} margin={{ top: 5, right: 0, bottom: 0, left: 0 }}>
                <XAxis dataKey="name" tick={{ fill: '#4a5470', fontSize: 9, fontFamily: 'Syne' }} axisLine={false} tickLine={false} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-soft)', borderRadius: 8 }} />
                <Bar dataKey="progress" name="Progression" radius={[3,3,0,0]}>
                  {barData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Filtres */}
        <div className="okr-controls">
          <div className="filter-tabs">
            <button className={`filter-tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>Tous</button>
            {categories.map(c => (
              <button key={c} className={`filter-tab ${filter === c ? 'active' : ''}`} onClick={() => setFilter(c)}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}
            <button className={`filter-tab ${filter === 'at_risk' ? 'active' : ''}`} onClick={() => setFilter('at_risk')}>⚠ À risque</button>
          </div>
          <button className="perso-add-btn"><Plus size={13} /> Nouvel objectif</button>
        </div>

        {/* OKR Cards */}
        <div className="okr-list">
          {filtered.map(obj => (
            <OKRCard
              key={obj.id}
              obj={obj}
              expanded={expanded === obj.id}
              onToggle={() => setExpanded(expanded === obj.id ? null : obj.id)}
            />
          ))}
        </div>

        {/* Check-ins récents */}
        <div className="perso-card">
          <div className="perso-card-header">
            <h3 className="perso-card-title">Journal de check-ins</h3>
            <button className="perso-add-btn"><Plus size={13} /> Check-in</button>
          </div>
          {[...weeklyCheckIns].sort((a, b) => new Date(b.date) - new Date(a.date)).map(c => {
            const obj = objectives.find(o => o.id === c.objectiveId);
            return (
              <div key={c.id} className="okr-checkin-full">
                <span className="mono okr-ci-date-full">{c.date}</span>
                <div className="okr-ci-obj">
                  <span style={{ color: obj?.color }}>{obj?.icon}</span>
                  <span className="okr-ci-obj-name">{obj?.title.slice(0, 40)}…</span>
                </div>
                <p className="okr-ci-note-full">{c.note}</p>
                <span>{'⭐'.repeat(c.mood)}</span>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}