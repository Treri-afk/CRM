import React, { useState } from 'react';
import { CheckCircle2, Circle, Flame, Plus, TrendingUp, Star, Target } from 'lucide-react';
import Topbar from '../components/layout/Topbar';
import { habits, habitHistory, routines } from '../data/mockDataLifeOS';
import { objectives } from '../data/mockDataPerso';
import './LifeOS.css';

const DAYS = ['L','M','M','J','V','S','D'];

function HabitRow({ habit, onToggle }) {
  const hist = habitHistory[habit.id] || [];
  const last21 = hist.slice(-21);
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayDone = hist.find(d => d.date === todayStr)?.done;
  const weekDone  = hist.slice(-7).filter(d => d.done).length;
  const linkedOKR = objectives.find(o => o.id === habit.linkedOKRId);

  return (
    <div className={`hab-row ${todayDone ? 'done' : ''}`}>
      {/* Toggle */}
      <button className="hab-toggle" onClick={() => onToggle(habit.id)}>
        {todayDone
          ? <CheckCircle2 size={22} color={habit.color} strokeWidth={2} />
          : <Circle size={22} color="var(--border-bright)" strokeWidth={1.5} />
        }
      </button>

      {/* Emoji + Info */}
      <div className="hab-icon" style={{ background: habit.color + '18', color: habit.color }}>
        {habit.icon}
      </div>
      <div className="hab-info">
        <div className="hab-name-row">
          <p className="hab-name">{habit.name}</p>
          {habit.routine && (
            <span className="hab-routine-badge" style={{ color: habit.color, background: habit.color + '18' }}>
              {habit.routine === 'matin' ? '🌅 Matin' : '🌙 Soir'}
            </span>
          )}
          {linkedOKR && (
            <span className="hab-okr-badge"><Target size={9} /> {linkedOKR.title.slice(0, 25)}…</span>
          )}
        </div>
        <div className="hab-streak-row">
          <span className="hab-streak" style={{ color: habit.color }}>
            <Flame size={12} /> {habit.currentStreak}j en cours
          </span>
          <span className="hab-best">Record : {habit.bestStreak}j</span>
          <span className="hab-week">{weekDone}/7 cette semaine</span>
        </div>
      </div>

      {/* Historique 21 jours */}
      <div className="hab-history">
        {last21.map((d, i) => (
          <div
            key={i}
            className={`hab-day-dot ${d.done ? 'done' : 'miss'}`}
            style={d.done ? { background: habit.color } : {}}
            title={d.date}
          />
        ))}
      </div>

      {/* Score semaine */}
      <div className="hab-score" style={{ color: weekDone >= 5 ? 'var(--green)' : weekDone >= 3 ? 'var(--yellow)' : 'var(--red)' }}>
        {Math.round((weekDone / 7) * 100)}%
      </div>
    </div>
  );
}

export default function Habitudes() {
  const [habitList, setHabitList] = useState(habits);
  const [tab, setTab] = useState('today');

  const todayStr = new Date().toISOString().slice(0, 10);
  const doneToday = habitList.filter(h => habitHistory[h.id]?.find(d => d.date === todayStr)?.done).length;
  const globalScore = Math.round(
    habitList.reduce((s, h) => {
      const weekDone = (habitHistory[h.id] || []).slice(-7).filter(d => d.done).length;
      return s + weekDone / 7 * 100;
    }, 0) / habitList.length
  );

  const toggleHabit = (id) => {
    // Simulation toggle — dans une vraie app, mise à jour BDD
    console.log('Toggle habit', id);
  };

  // Génération grille calendrier mensuel pour un habit
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();

  return (
    <div className="page">
      <Topbar title="Habitudes & Routines" subtitle={`${doneToday}/${habitList.length} complétées aujourd'hui · Score semaine ${globalScore}%`} />
      <div className="page-content">

        {/* KPIs */}
        <div className="hab-kpis stagger">
          {[
            { label: 'Faites aujourd\'hui', value: `${doneToday}/${habitList.length}`, color: doneToday === habitList.length ? 'var(--green)' : 'var(--yellow)' },
            { label: 'Score semaine global', value: `${globalScore}%`, color: globalScore >= 80 ? 'var(--green)' : 'var(--yellow)' },
            { label: 'Meilleur streak actuel', value: `${Math.max(...habitList.map(h=>h.currentStreak))}j 🔥`, color: '#fb923c' },
            { label: 'Habitudes actives', value: habitList.length, color: 'var(--text-secondary)' },
          ].map(({ label, value, color }) => (
            <div key={label} className="hab-kpi">
              <p className="hab-kpi-val mono" style={{ color }}>{value}</p>
              <p className="hab-kpi-label">{label}</p>
            </div>
          ))}
          <button className="perso-add-btn" style={{ gridColumn: 'span 1' }}>
            <Plus size={13} /> Nouvelle habitude
          </button>
        </div>

        {/* Tabs */}
        <div className="perso-tabs">
          {[
            { id: 'today',    label: 'Aujourd\'hui' },
            { id: 'history',  label: 'Historique' },
            { id: 'routines', label: 'Routines' },
          ].map(t => (
            <button key={t.id} className={`perso-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Aujourd'hui ── */}
        {tab === 'today' && (
          <div className="perso-card">
            <div className="perso-card-header">
              <h3 className="perso-card-title">Mes habitudes</h3>
              <div className="hab-legend">
                <span><span className="hab-dot done" style={{ background: 'var(--green)' }} /> Fait</span>
                <span><span className="hab-dot miss" /> Raté</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>← 21 derniers jours</span>
              </div>
            </div>

            {/* Matin */}
            <p className="hab-section-label">🌅 Routine matin</p>
            {habitList.filter(h => h.routine === 'matin').map(h => (
              <HabitRow key={h.id} habit={h} onToggle={toggleHabit} />
            ))}

            {/* Sans routine */}
            <p className="hab-section-label" style={{ marginTop: 16 }}>🎯 Toute la journée</p>
            {habitList.filter(h => !h.routine).map(h => (
              <HabitRow key={h.id} habit={h} onToggle={toggleHabit} />
            ))}

            {/* Soir */}
            <p className="hab-section-label" style={{ marginTop: 16 }}>🌙 Routine soir</p>
            {habitList.filter(h => h.routine === 'soir').map(h => (
              <HabitRow key={h.id} habit={h} onToggle={toggleHabit} />
            ))}
          </div>
        )}

        {/* ── Historique ── */}
        {tab === 'history' && (
          <div className="perso-card">
            <div className="perso-card-header">
              <h3 className="perso-card-title">Vue calendrier — Habitudes ce mois</h3>
            </div>
            {habitList.map(h => {
              const monthHistory = (habitHistory[h.id] || []).slice(-daysInMonth);
              const monthScore = Math.round(monthHistory.filter(d => d.done).length / monthHistory.length * 100);
              return (
                <div key={h.id} className="hab-calendar-row">
                  <div className="hab-cal-info">
                    <span>{h.icon}</span>
                    <span className="hab-cal-name">{h.name}</span>
                  </div>
                  <div className="hab-cal-dots">
                    {monthHistory.map((d, i) => (
                      <div key={i} className={`hab-day-dot ${d.done ? 'done' : 'miss'}`}
                        style={d.done ? { background: h.color } : {}}
                        title={d.date}
                      />
                    ))}
                  </div>
                  <span className="mono hab-cal-score" style={{ color: monthScore >= 80 ? 'var(--green)' : monthScore >= 60 ? 'var(--yellow)' : 'var(--red)' }}>
                    {monthScore}%
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Routines ── */}
        {tab === 'routines' && (
          <div className="hab-routines-grid">
            {['matin', 'soir'].map(r => (
              <div key={r} className="perso-card">
                <div className="perso-card-header">
                  <h3 className="perso-card-title">{r === 'matin' ? '🌅 Routine Matin' : '🌙 Routine Soir'}</h3>
                  <span className="perso-card-sub">
                    {routines[r].filter(s => s.done).length}/{routines[r].length} complétées
                  </span>
                </div>
                {routines[r].map((step, i) => (
                  <div key={i} className={`hab-routine-step ${step.done ? 'done' : ''}`}>
                    <span className="hab-routine-time mono">{step.time}</span>
                    {step.done
                      ? <CheckCircle2 size={16} color="var(--green)" strokeWidth={2} />
                      : <Circle size={16} color="var(--border-bright)" strokeWidth={1.5} />
                    }
                    <span className="hab-routine-label" style={{ textDecoration: step.done ? 'line-through' : 'none', color: step.done ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}