import React, { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import {
  Activity, Flame, Clock, CheckCircle2, Circle,
  Plus, Zap, Droplets, Target, X, Trophy, Star
} from 'lucide-react';
import Topbar from '../components/layout/Topbar';
import {
  workoutSessions, bodyMetrics, personalRecords,
  weeklyPlan, nutritionLog, nutritionGoals
} from '../data/mockDataPerso';
import './Perso.css';

const workoutTypeConfig = {
  muscu:    { label: 'Musculation', color: '#3d7fff', emoji: '🏋️' },
  cardio:   { label: 'Cardio',      color: '#ff4d6a', emoji: '🏃' },
  yoga:     { label: 'Yoga',        color: '#a78bfa', emoji: '🧘' },
  natation: { label: 'Natation',    color: '#2dd4a0', emoji: '🏊' },
  hiit:     { label: 'HIIT',        color: '#f5c842', emoji: '⚡' },
  vélo:     { label: 'Vélo',        color: '#fb923c', emoji: '🚴' },
  repos:    { label: 'Repos actif', color: '#8892aa', emoji: '😴' },
};

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

// ─── Modal wrapper ────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

// ─── Modal Logger une séance ──────────────────────────────────────────────────
// "Logger" = enregistrer une séance déjà faite (date passée ou aujourd'hui)
function LogSessionModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    date:     new Date().toISOString().slice(0, 10),
    type:     'muscu',
    name:     '',
    duration: '',
    calories: '',
    feeling:  4,
    location: 'Salle',
    notes:    '',
  });
  const s = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const tc = workoutTypeConfig[form.type] || workoutTypeConfig.muscu;

  // Estimation calories automatique si vide
  const estimateCalories = (type, duration) => {
    const rates = { muscu: 5.5, cardio: 9, yoga: 3, natation: 8, hiit: 10, vélo: 8, repos: 2 };
    return Math.round((rates[type] || 6) * Number(duration));
  };

  const handleAdd = () => {
    if (!form.name || !form.duration) return;
    onAdd({
      ...form,
      id:       Date.now(),
      duration: Number(form.duration),
      calories: Number(form.calories) || estimateCalories(form.type, form.duration),
      feeling:  Number(form.feeling),
    });
    onClose();
  };

  return (
    <Modal title="📝 Logger une séance" onClose={onClose}>
      <div className="add-form">

        {/* Type avec sélecteur visuel */}
        <label>Type de séance *</label>
        <div className="sante-type-grid">
          {Object.entries(workoutTypeConfig).filter(([k]) => k !== 'repos').map(([type, cfg]) => (
            <button
              key={type}
              className={`sante-type-btn ${form.type === type ? 'active' : ''}`}
              style={form.type === type ? { borderColor: cfg.color, background: cfg.color + '18', color: cfg.color } : {}}
              onClick={() => s('type', type)}
            >
              <span>{cfg.emoji}</span>
              <span>{cfg.label}</span>
            </button>
          ))}
        </div>

        {/* Nom de la séance */}
        <label>Nom de la séance *</label>
        <input
          className="japan-input flex"
          placeholder={`Ex : ${form.type === 'muscu' ? 'Push Day, Pull Day, Leg Day' : form.type === 'cardio' ? 'Run 10km, Interval 30min' : tc.label}`}
          value={form.name}
          onChange={e => s('name', e.target.value)}
        />

        {/* Date + Lieu */}
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <label>Date *</label>
            <input className="japan-input flex" type="date" value={form.date} onChange={e => s('date', e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Lieu</label>
            <select className="perso-select" style={{ width: '100%', height: 36 }} value={form.location} onChange={e => s('location', e.target.value)}>
              {['Salle', 'Extérieur', 'Maison', 'Piscine', 'Autre'].map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>

        {/* Durée + Calories */}
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <label>Durée (minutes) *</label>
            <input className="japan-input flex" type="number" placeholder="Ex : 60" value={form.duration} onChange={e => s('duration', e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Calories brûlées <span style={{ color: 'var(--accent-bright)', textTransform: 'none', letterSpacing: 0 }}>(auto si vide)</span></label>
            <input
              className="japan-input flex"
              type="number"
              placeholder={form.duration ? `~${estimateCalories(form.type, form.duration)} kcal` : 'Ex : 450'}
              value={form.calories}
              onChange={e => s('calories', e.target.value)}
            />
          </div>
        </div>

        {/* Feeling */}
        <label>Ressenti</label>
        <div className="sante-feeling-row">
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              className={`sante-feeling-btn ${form.feeling >= n ? 'active' : ''}`}
              onClick={() => s('feeling', n)}
            >
              ⭐
            </button>
          ))}
          <span className="sante-feeling-label">
            {['', 'Difficile', 'Correct', 'Bien', 'Super', 'Excellent !'][form.feeling]}
          </span>
        </div>

        {/* Notes */}
        <label>Notes</label>
        <textarea
          className="japan-input flex"
          style={{ height: 60, resize: 'vertical', padding: '8px 12px', lineHeight: 1.5 }}
          placeholder="Notes, exercices réalisés, sensations..."
          value={form.notes}
          onChange={e => s('notes', e.target.value)}
        />

        {/* Récap */}
        {form.name && form.duration && (
          <div className="sante-session-preview">
            <span>{tc.emoji}</span>
            <div>
              <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 13 }}>{form.name}</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {form.date} · {form.duration}min · ~{form.calories || estimateCalories(form.type, form.duration)} kcal
              </p>
            </div>
            <span style={{ marginLeft: 'auto' }}>{'⭐'.repeat(form.feeling)}</span>
          </div>
        )}

        <button className="perso-add-btn" style={{ marginTop: 4, height: 40, fontSize: 13 }} onClick={handleAdd}>
          <Plus size={14} /> Enregistrer la séance
        </button>
      </div>
    </Modal>
  );
}

// ─── Modal Planifier une séance ───────────────────────────────────────────────
// "Planifier" = créer un template de séance future avec exercices détaillés
function PlanSessionModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    date:     '',
    type:     'muscu',
    name:     '',
    duration: '',
    location: 'Salle',
    notes:    '',
  });
  const [exercises, setExercises] = useState([
    { name: '', sets: '', reps: '', weight: '', unit: 'kg' },
  ]);

  const s = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setEx = (i, k, v) => setExercises(prev => prev.map((e, idx) => idx === i ? { ...e, [k]: v } : e));
  const addEx = () => setExercises(prev => [...prev, { name: '', sets: '', reps: '', weight: '', unit: 'kg' }]);
  const removeEx = (i) => setExercises(prev => prev.filter((_, idx) => idx !== i));

  const handleAdd = () => {
    if (!form.name) return;
    const filledExercises = exercises.filter(e => e.name.trim());
    const notesWithEx = filledExercises.length
      ? `Exercices : ${filledExercises.map(e => `${e.name}${e.sets ? ` ${e.sets}x${e.reps}` : ''}${e.weight ? ` @${e.weight}${e.unit}` : ''}`).join(' · ')}`
      : form.notes;
    onAdd({
      ...form,
      id:       Date.now(),
      duration: Number(form.duration) || 60,
      calories: 0,
      feeling:  0,
      notes:    notesWithEx || form.notes,
      planned:  true,
    });
    onClose();
  };

  const tc = workoutTypeConfig[form.type] || workoutTypeConfig.muscu;

  return (
    <Modal title="🗓️ Planifier une séance" onClose={onClose}>
      <div className="add-form">

        <label>Type *</label>
        <div className="sante-type-grid">
          {Object.entries(workoutTypeConfig).filter(([k]) => k !== 'repos').map(([type, cfg]) => (
            <button
              key={type}
              className={`sante-type-btn ${form.type === type ? 'active' : ''}`}
              style={form.type === type ? { borderColor: cfg.color, background: cfg.color + '18', color: cfg.color } : {}}
              onClick={() => s('type', type)}
            >
              <span>{cfg.emoji}</span><span>{cfg.label}</span>
            </button>
          ))}
        </div>

        <label>Nom de la séance *</label>
        <input className="japan-input flex" placeholder={`Ex : ${form.type === 'muscu' ? 'Push Day A' : tc.label + ' session'}`}
          value={form.name} onChange={e => s('name', e.target.value)} />

        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <label>Date prévue</label>
            <input className="japan-input flex" type="date" value={form.date} onChange={e => s('date', e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Durée estimée (min)</label>
            <input className="japan-input flex" type="number" placeholder="Ex : 70" value={form.duration} onChange={e => s('duration', e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Lieu</label>
            <select className="perso-select" style={{ width: '100%', height: 36 }} value={form.location} onChange={e => s('location', e.target.value)}>
              {['Salle', 'Extérieur', 'Maison', 'Piscine', 'Autre'].map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>

        {/* Exercices (pour muscu) */}
        {form.type === 'muscu' && (
          <>
            <label>Exercices prévus</label>
            {exercises.map((ex, i) => (
              <div key={i} className="sante-exercise-row">
                <input className="japan-input" placeholder="Exercice" value={ex.name}
                  onChange={e => setEx(i, 'name', e.target.value)} style={{ flex: 2 }} />
                <input className="japan-input" placeholder="Séries" type="number" value={ex.sets}
                  onChange={e => setEx(i, 'sets', e.target.value)} style={{ width: 64 }} />
                <input className="japan-input" placeholder="Reps" type="number" value={ex.reps}
                  onChange={e => setEx(i, 'reps', e.target.value)} style={{ width: 64 }} />
                <input className="japan-input" placeholder="Charge" type="number" value={ex.weight}
                  onChange={e => setEx(i, 'weight', e.target.value)} style={{ width: 80 }} />
                <select className="perso-select" value={ex.unit} onChange={e => setEx(i, 'unit', e.target.value)} style={{ width: 60 }}>
                  <option value="kg">kg</option>
                  <option value="lbs">lbs</option>
                  <option value="BW">BW</option>
                </select>
                {exercises.length > 1 && (
                  <button className="modal-close" onClick={() => removeEx(i)}><X size={12} /></button>
                )}
              </div>
            ))}
            <button className="perso-add-btn" style={{ alignSelf: 'flex-start', height: 30, fontSize: 11 }} onClick={addEx}>
              <Plus size={11} /> Exercice
            </button>
          </>
        )}

        <label>Notes</label>
        <textarea className="japan-input flex" style={{ height: 52, resize: 'vertical', padding: '8px 12px', lineHeight: 1.5 }}
          placeholder="Objectifs de la séance, points à travailler..." value={form.notes} onChange={e => s('notes', e.target.value)} />

        <button className="perso-add-btn" style={{ marginTop: 4, height: 40, fontSize: 13 }} onClick={handleAdd}>
          <Plus size={14} /> Planifier la séance
        </button>
      </div>
    </Modal>
  );
}

// ─── Modal Nouveau PR ─────────────────────────────────────────────────────────
function AddPRModal({ existingPRs, onClose, onAdd }) {
  const [form, setForm] = useState({
    exercise: '',
    category: 'muscu',
    value:    '',
    unit:     'kg',
    previous: '',
    date:     new Date().toISOString().slice(0, 10),
  });
  const s = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // Unités selon catégorie
  const units = form.category === 'muscu'
    ? ['kg', 'lbs', 'kg ajoutés', 'répétitions']
    : ['min', 'h', 'km', 'sec'];

  // Suggestions d'exercices
  const suggestions = form.category === 'muscu'
    ? ['Développé couché', 'Squat barre', 'Soulevé de terre', 'Traction lestée', 'Développé militaire', 'Curl barre', 'Rowing barre', 'Hip thrust', 'Dips lestés']
    : ['Run 5km', 'Run 10km', 'Run semi-marathon', 'Vélo 50km', 'Vélo 100km', 'Natation 1km', 'Planche', 'HIIT 20min'];

  const improvement = form.value && form.previous
    ? Math.abs(((Number(form.value) - Number(form.previous)) / Number(form.previous) * 100)).toFixed(1)
    : null;

  const isImprovement = form.category === 'cardio'
    ? Number(form.value) < Number(form.previous)
    : Number(form.value) > Number(form.previous);

  const handleAdd = () => {
    if (!form.exercise || !form.value) return;
    onAdd({
      ...form,
      id:       Date.now(),
      value:    Number(form.value),
      previous: Number(form.previous) || Number(form.value),
    });
    onClose();
  };

  return (
    <Modal title="🏆 Nouveau Record Personnel" onClose={onClose}>
      <div className="add-form">

        {/* Catégorie */}
        <label>Catégorie *</label>
        <div className="filter-tabs">
          {[['muscu','🏋️ Musculation'],['cardio','🏃 Cardio']].map(([k, lbl]) => (
            <button key={k}
              className={`filter-tab ${form.category === k ? 'active' : ''}`}
              onClick={() => { s('category', k); s('unit', k === 'muscu' ? 'kg' : 'min'); }}
            >{lbl}</button>
          ))}
        </div>

        {/* Exercice avec suggestions */}
        <label>Exercice *</label>
        <input
          className="japan-input flex"
          placeholder="Ex : Développé couché"
          value={form.exercise}
          onChange={e => s('exercise', e.target.value)}
          list="exercise-suggestions"
        />
        <datalist id="exercise-suggestions">
          {suggestions.map(sg => <option key={sg} value={sg} />)}
        </datalist>

        {/* Suggestions rapides */}
        <div className="sante-suggestions">
          {suggestions.slice(0, 5).map(sg => (
            <button key={sg} className="sante-suggestion-chip" onClick={() => s('exercise', sg)}>
              {sg}
            </button>
          ))}
        </div>

        {/* Valeur + Unité */}
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 2 }}>
            <label>Nouvelle valeur (PR) *</label>
            <input className="japan-input flex" type="number" step="0.5" placeholder="Ex : 102.5"
              value={form.value} onChange={e => s('value', e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Unité</label>
            <select className="perso-select" style={{ width: '100%', height: 36 }} value={form.unit} onChange={e => s('unit', e.target.value)}>
              {units.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>

        {/* Précédent record + Date */}
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <label>Précédent record</label>
            <input className="japan-input flex" type="number" step="0.5" placeholder="Ex : 100"
              value={form.previous} onChange={e => s('previous', e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Date *</label>
            <input className="japan-input flex" type="date" value={form.date} onChange={e => s('date', e.target.value)} />
          </div>
        </div>

        {/* Prévisualisation progression */}
        {improvement && form.previous && (
          <div className="sante-pr-preview" style={{
            borderColor: isImprovement ? 'rgba(45,212,160,0.4)' : 'rgba(255,77,106,0.3)',
            background:  isImprovement ? 'rgba(45,212,160,0.06)' : 'rgba(255,77,106,0.06)',
          }}>
            <Trophy size={18} color={isImprovement ? 'var(--green)' : 'var(--red)'} />
            <div>
              <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 14 }}>
                {form.exercise || 'Exercice'} — {form.value} {form.unit}
              </p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {Number(form.previous)} {form.unit} →{' '}
                <span style={{ color: isImprovement ? 'var(--green)' : 'var(--red)', fontWeight: 700 }}>
                  {form.value} {form.unit} ({isImprovement ? '+' : '-'}{improvement}%)
                </span>
              </p>
            </div>
          </div>
        )}

        <button className="perso-add-btn" style={{ marginTop: 4, height: 40, fontSize: 13 }} onClick={handleAdd}>
          <Trophy size={14} /> Enregistrer le PR
        </button>
      </div>
    </Modal>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
export default function Sante() {
  const [tab, setTab] = useState('dashboard');

  // State local pour toutes les données
  const [sessions,  setSessions]  = useState(workoutSessions);
  const [prs,       setPrs]       = useState(personalRecords);

  // Modals
  const [showLog,  setShowLog]  = useState(false);
  const [showPlan, setShowPlan] = useState(false);
  const [showPR,   setShowPR]   = useState(false);

  const today        = nutritionLog[0];
  const latestMetric = bodyMetrics[bodyMetrics.length - 1];
  const firstMetric  = bodyMetrics[0];
  const weightLoss   = (firstMetric.weight - latestMetric.weight).toFixed(1);
  const fatLoss      = (firstMetric.bodyFat - latestMetric.bodyFat).toFixed(1);

  const sessionsThisWeek = sessions.filter(s => {
    const d = new Date(s.date);
    return d >= new Date(Date.now() - 7 * 86400000);
  });

  const totalCaloriesWeek = sessionsThisWeek.reduce((s, w) => s + w.calories, 0);
  const totalMinutesWeek  = sessionsThisWeek.reduce((s, w) => s + w.duration, 0);
  const completedPlan     = weeklyPlan.filter(d => d.done).length;

  const weightData = bodyMetrics.map(m => ({ date: m.date.slice(0, 7), poids: m.weight, gras: m.bodyFat }));

  const nutritionPct = (key) => Math.round((today[key] / nutritionGoals[key]) * 100);

  // Barres de calorie par séance colorées
  const sessionChartData = [...sessions].reverse().slice(-12).map(s => ({
    date:     s.date.slice(5),
    calories: s.calories,
    type:     s.type,
    color:    workoutTypeConfig[s.type]?.color || '#8892aa',
  }));

  return (
    <div className="page">
      <Topbar
        title="Santé & Sport"
        subtitle={`${latestMetric.weight} kg · ${latestMetric.bodyFat}% MG · IMC ${latestMetric.bmi}`}
      />
      <div className="page-content">

        {/* ── Modals ── */}
        {showLog  && <LogSessionModal  onClose={() => setShowLog(false)}  onAdd={s => setSessions(prev => [s, ...prev])} />}
        {showPlan && <PlanSessionModal onClose={() => setShowPlan(false)} onAdd={s => setSessions(prev => [s, ...prev])} />}
        {showPR   && <AddPRModal existingPRs={prs} onClose={() => setShowPR(false)} onAdd={pr => setPrs(prev => [pr, ...prev])} />}

        {/* ── Tabs ── */}
        <div className="perso-tabs">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'seances',   label: `Séances (${sessions.length})` },
            { id: 'nutrition', label: 'Nutrition' },
            { id: 'metriques', label: 'Métriques' },
            { id: 'records',   label: `PRs (${prs.length})` },
          ].map(t => (
            <button key={t.id} className={`perso-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ─── DASHBOARD ─── */}
        {tab === 'dashboard' && (
          <>
            <div className="perso-kpis stagger">
              {[
                { label: 'Poids actuel',       value: `${latestMetric.weight} kg`,   color: '#3d7fff', sub: `-${weightLoss} kg en 6 mois` },
                { label: 'Masse grasse',        value: `${latestMetric.bodyFat}%`,    color: '#f5c842', sub: `-${fatLoss}% en 6 mois` },
                { label: 'Séances cette semaine', value: sessionsThisWeek.length,     color: '#2dd4a0', sub: `${completedPlan}/7 plan semaine` },
                { label: 'Calories brûlées',    value: `${totalCaloriesWeek} kcal`,   color: '#fb923c', sub: 'Cette semaine' },
                { label: 'Temps entraîné',      value: `${Math.floor(totalMinutesWeek/60)}h${totalMinutesWeek%60}min`, color: '#a78bfa', sub: 'Cette semaine' },
                { label: 'Calories auj.',       value: `${today.calories} kcal`,      color: today.calories <= nutritionGoals.calories ? 'var(--green)' : 'var(--red)', sub: `Objectif : ${nutritionGoals.calories}` },
              ].map(({ label, value, color, sub }) => (
                <div key={label} className="perso-kpi">
                  <p className="perso-kpi-val mono" style={{ color }}>{value}</p>
                  <p className="perso-kpi-label">{label}</p>
                  <p className="perso-kpi-sub">{sub}</p>
                </div>
              ))}
            </div>

            {/* Plan semaine */}
            <div className="perso-card">
              <div className="perso-card-header">
                <h3 className="perso-card-title">Plan de la semaine</h3>
                <span className="perso-card-sub">{completedPlan}/{weeklyPlan.length} complétés</span>
              </div>
              <div className="health-week-plan">
                {weeklyPlan.map((d, i) => {
                  const tc = workoutTypeConfig[d.type] || workoutTypeConfig.repos;
                  return (
                    <div key={i} className={`hwp-day ${d.done ? 'done' : ''} ${d.type === 'repos' ? 'repos' : ''}`}>
                      <p className="hwp-day-name">{d.day.slice(0, 3)}</p>
                      <div className="hwp-emoji">{tc.emoji}</div>
                      <p className="hwp-workout" style={{ color: d.done ? 'var(--green)' : tc.color }}>{d.name}</p>
                      {d.done ? <CheckCircle2 size={16} color="var(--green)" /> : <Circle size={16} color="var(--border-bright)" strokeWidth={1.5} />}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="perso-two-col">
              <div className="perso-card">
                <div className="perso-card-header">
                  <h3 className="perso-card-title">Évolution du poids</h3>
                </div>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={weightData} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
                    <CartesianGrid stroke="#1e2740" strokeDasharray="4 4" vertical={false} />
                    <XAxis dataKey="date" tick={{ fill: '#4a5470', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis domain={['dataMin - 1', 'dataMax + 0.5']} tick={{ fill: '#4a5470', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}kg`} />
                    <Tooltip content={<Tip />} />
                    <Line type="monotone" dataKey="poids" name="Poids (kg)" stroke="#3d7fff" strokeWidth={2.5} dot={{ fill: '#3d7fff', r: 4, stroke: '#0d1117', strokeWidth: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="perso-card">
                <div className="perso-card-header">
                  <h3 className="perso-card-title">Nutrition aujourd'hui</h3>
                </div>
                <div className="health-nutrition-rings">
                  {[
                    { key: 'calories', label: 'Calories', unit: 'kcal', color: '#fb923c', icon: Flame },
                    { key: 'protein',  label: 'Protéines', unit: 'g',   color: '#3d7fff', icon: Zap   },
                    { key: 'carbs',    label: 'Glucides',  unit: 'g',   color: '#f5c842', icon: Activity },
                    { key: 'fat',      label: 'Lipides',   unit: 'g',   color: '#a78bfa', icon: Target },
                    { key: 'water',    label: 'Eau',       unit: 'L',   color: '#2dd4a0', icon: Droplets },
                  ].map(({ key, label, unit, color, icon: Icon }) => {
                    const pct = Math.min(100, nutritionPct(key));
                    const val = today[key];
                    return (
                      <div key={key} className="hnr-item">
                        <div className="hnr-ring-wrap">
                          <svg width="60" height="60" viewBox="0 0 60 60">
                            <circle cx="30" cy="30" r="25" fill="none" stroke="var(--border-soft)" strokeWidth="5" />
                            <circle cx="30" cy="30" r="25" fill="none" stroke={pct >= 100 ? 'var(--green)' : color}
                              strokeWidth="5" strokeDasharray={`${pct * 1.571} 157.1`}
                              strokeLinecap="round" transform="rotate(-90 30 30)" />
                          </svg>
                          <div className="hnr-icon" style={{ color }}><Icon size={14} strokeWidth={1.8} /></div>
                        </div>
                        <p className="hnr-val mono" style={{ color: pct >= 100 ? 'var(--green)' : 'var(--text-primary)' }}>{val}{unit}</p>
                        <p className="hnr-label">{label}</p>
                        <p className="hnr-goal">/ {nutritionGoals[key]}{unit}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Dernières séances + boutons */}
            <div className="perso-card">
              <div className="perso-card-header">
                <h3 className="perso-card-title">Séances récentes</h3>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="sante-secondary-btn" onClick={() => setShowPlan(true)}>
                    <Plus size={13} /> Planifier
                  </button>
                  <button className="perso-add-btn" onClick={() => setShowLog(true)}>
                    <Plus size={13} /> Logger une séance
                  </button>
                </div>
              </div>
              <div className="health-sessions-list">
                {sessions.slice(0, 5).map(s => {
                  const tc = workoutTypeConfig[s.type] || workoutTypeConfig.muscu;
                  return (
                    <div key={s.id} className="hsl-row">
                      <span className="hsl-emoji">{tc.emoji}</span>
                      <div className="hsl-info">
                        <p className="hsl-name">{s.name}</p>
                        <p className="hsl-date mono">{s.date}{s.location ? ` · ${s.location}` : ''}</p>
                        {s.notes && <p className="hsl-notes">{s.notes}</p>}
                      </div>
                      <div className="hsl-stats">
                        <span><Clock size={11} /> {s.duration}min</span>
                        {s.calories > 0 && <span><Flame size={11} /> {s.calories} kcal</span>}
                        {s.feeling > 0 && <span>{'⭐'.repeat(s.feeling)}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* ─── SÉANCES ─── */}
        {tab === 'seances' && (
          <>
            <div className="health-stats-row">
              {Object.entries(workoutTypeConfig).filter(([k]) => k !== 'repos').map(([type, cfg]) => {
                const count    = sessions.filter(s => s.type === type).length;
                const totalMin = sessions.filter(s => s.type === type).reduce((s, w) => s + w.duration, 0);
                if (count === 0) return null;
                return (
                  <div key={type} className="perso-kpi" style={{ borderColor: cfg.color + '44' }}>
                    <p className="perso-kpi-val">{cfg.emoji} {count}</p>
                    <p className="perso-kpi-label">{cfg.label}</p>
                    <p className="perso-kpi-sub">{Math.floor(totalMin/60)}h{totalMin%60}min total</p>
                  </div>
                );
              })}
            </div>

            <div className="perso-card">
              <div className="perso-card-header"><h3 className="perso-card-title">Calories brûlées — 12 dernières séances</h3></div>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={sessionChartData} margin={{ top: 5, right: 10, bottom: 0, left: -10 }}>
                  <CartesianGrid stroke="#1e2740" strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: '#4a5470', fontSize: 9 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#4a5470', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-soft)', borderRadius: 8 }} />
                  <Bar dataKey="calories" name="Calories" radius={[3,3,0,0]}>
                    {sessionChartData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="perso-card">
              <div className="perso-card-header">
                <h3 className="perso-card-title">Toutes les séances ({sessions.length})</h3>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="sante-secondary-btn" onClick={() => setShowPlan(true)}>
                    🗓️ Planifier
                  </button>
                  <button className="perso-add-btn" onClick={() => setShowLog(true)}>
                    <Plus size={13} /> Logger
                  </button>
                </div>
              </div>
              {sessions.map(s => {
                const tc = workoutTypeConfig[s.type] || workoutTypeConfig.muscu;
                return (
                  <div key={s.id} className="hsl-row">
                    <span className="hsl-emoji">{tc.emoji}</span>
                    <div className="hsl-info">
                      <p className="hsl-name">
                        {s.name}
                        {s.planned && <span className="sante-planned-badge">planifié</span>}
                      </p>
                      <p className="hsl-date mono">{s.date} · {s.location || 'Salle'}</p>
                      {s.notes && <p className="hsl-notes">{s.notes}</p>}
                    </div>
                    <div className="hsl-stats">
                      <span><Clock size={11} /> {s.duration}min</span>
                      {s.calories > 0 && <span><Flame size={11} /> {s.calories} kcal</span>}
                      {s.feeling > 0 && <span>{'⭐'.repeat(s.feeling)}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ─── NUTRITION ─── */}
        {tab === 'nutrition' && (
          <>
            <div className="perso-two-col">
              <div className="perso-card wide">
                <div className="perso-card-header"><h3 className="perso-card-title">Macros — 7 jours</h3></div>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={[...nutritionLog].reverse()} margin={{ top: 5, right: 10, bottom: 0, left: -10 }}>
                    <CartesianGrid stroke="#1e2740" strokeDasharray="4 4" vertical={false} />
                    <XAxis dataKey="date" tick={{ fill: '#4a5470', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => v.slice(5)} />
                    <YAxis tick={{ fill: '#4a5470', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-soft)', borderRadius: 8 }} />
                    <Bar dataKey="protein" name="Protéines (g)" fill="#3d7fff" stackId="a" />
                    <Bar dataKey="carbs"   name="Glucides (g)"  fill="#f5c842" stackId="a" />
                    <Bar dataKey="fat"     name="Lipides (g)"   fill="#a78bfa" stackId="a" radius={[3,3,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="perso-card">
                <div className="perso-card-header"><h3 className="perso-card-title">Eau consommée</h3></div>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={[...nutritionLog].reverse()} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                    <defs>
                      <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2dd4a0" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#2dd4a0" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tick={{ fill: '#4a5470', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => v.slice(5)} />
                    <YAxis domain={[0, 4]} hide />
                    <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-soft)', borderRadius: 8 }} />
                    <Area type="monotone" dataKey="water" name="Eau (L)" stroke="#2dd4a0" strokeWidth={2.5} fill="url(#waterGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="perso-card">
              <div className="perso-card-header"><h3 className="perso-card-title">Journal nutritionnel</h3></div>
              <table className="perso-table">
                <thead><tr><th>Date</th><th>Calories</th><th>Protéines</th><th>Glucides</th><th>Lipides</th><th>Eau</th></tr></thead>
                <tbody>
                  {nutritionLog.map((n, i) => (
                    <tr key={i} className="perso-table-row">
                      <td className="mono">{n.date}</td>
                      <td className="mono" style={{ color: n.calories <= nutritionGoals.calories ? 'var(--green)' : 'var(--red)', fontWeight: 600 }}>{n.calories}</td>
                      <td className="mono">{n.protein}g</td>
                      <td className="mono">{n.carbs}g</td>
                      <td className="mono">{n.fat}g</td>
                      <td className="mono" style={{ color: n.water >= nutritionGoals.water ? 'var(--green)' : 'var(--text-muted)' }}>{n.water}L</td>
                    </tr>
                  ))}
                  <tr style={{ fontWeight: 700 }}>
                    <td>Objectif</td>
                    <td className="mono">{nutritionGoals.calories}</td>
                    <td className="mono">{nutritionGoals.protein}g</td>
                    <td className="mono">{nutritionGoals.carbs}g</td>
                    <td className="mono">{nutritionGoals.fat}g</td>
                    <td className="mono">{nutritionGoals.water}L</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ─── MÉTRIQUES ─── */}
        {tab === 'metriques' && (
          <div className="perso-two-col">
            <div className="perso-card wide">
              <div className="perso-card-header"><h3 className="perso-card-title">Poids & Masse grasse</h3></div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={bodyMetrics} margin={{ top: 5, right: 10, bottom: 0, left: -10 }}>
                  <CartesianGrid stroke="#1e2740" strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: '#4a5470', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => v.slice(0, 7)} />
                  <YAxis yAxisId="w" tick={{ fill: '#4a5470', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="f" orientation="right" tick={{ fill: '#4a5470', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                  <Tooltip content={<Tip />} />
                  <Line yAxisId="w" type="monotone" dataKey="weight"    name="Poids (kg)" stroke="#3d7fff" strokeWidth={2.5} dot={{ fill: '#3d7fff', r: 4, stroke: '#0d1117', strokeWidth: 2 }} />
                  <Line yAxisId="f" type="monotone" dataKey="bodyFat"   name="MG (%)"     stroke="#f5c842" strokeWidth={2} dot={false} />
                  <Line yAxisId="w" type="monotone" dataKey="muscleMass" name="Muscle (kg)" stroke="#2dd4a0" strokeWidth={2} dot={false} strokeDasharray="4 3" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="perso-card">
              <div className="perso-card-header"><h3 className="perso-card-title">Dernière mesure</h3></div>
              <div className="health-metric-big">
                <p className="hmb-val mono">{latestMetric.weight} kg</p>
                <p className="hmb-label">Poids</p>
              </div>
              <div className="immo-info-rows">
                {[
                  ['Masse grasse',     `${latestMetric.bodyFat}%`,    latestMetric.bodyFat <= 15 ? 'var(--green)' : 'var(--yellow)'],
                  ['Masse musculaire', `${latestMetric.muscleMass} kg`, 'var(--green)'],
                  ['IMC',              latestMetric.bmi,               latestMetric.bmi <= 25 ? 'var(--green)' : 'var(--yellow)'],
                  ['Évolution poids',  `-${weightLoss} kg`,            'var(--green)'],
                  ['Évolution MG',     `-${fatLoss}%`,                 'var(--green)'],
                ].map(([k, v, color]) => (
                  <div key={k} className="immo-info-row">
                    <span>{k}</span>
                    <span className="mono" style={{ color, fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── RECORDS ─── */}
        {tab === 'records' && (
          <div className="perso-card">
            <div className="perso-card-header">
              <h3 className="perso-card-title">Records Personnels ({prs.length})</h3>
              <button className="perso-add-btn" onClick={() => setShowPR(true)}>
                <Trophy size={13} /> Nouveau PR
              </button>
            </div>
            <div className="health-pr-grid">
              {prs.map((pr, i) => {
                const improvement = pr.previous
                  ? Math.abs(((pr.value - pr.previous) / pr.previous) * 100).toFixed(1)
                  : null;
                const isTime  = pr.unit && (pr.unit.includes('min') || pr.unit.includes('h'));
                const better  = pr.previous ? (isTime ? pr.value < pr.previous : pr.value > pr.previous) : true;
                return (
                  <div key={pr.id || i} className="health-pr-card">
                    <div className="health-pr-badge" style={{
                      background: pr.category === 'muscu' ? 'rgba(61,127,255,0.15)' : 'rgba(255,77,106,0.15)',
                      color:      pr.category === 'muscu' ? '#3d7fff' : '#ff4d6a',
                    }}>
                      {pr.category === 'muscu' ? '🏋️' : '🏃'} {pr.category}
                    </div>
                    <p className="health-pr-exercise">{pr.exercise}</p>
                    <p className="health-pr-value mono">{pr.value} <span>{pr.unit}</span></p>
                    {pr.previous > 0 && improvement && (
                      <div className="health-pr-vs">
                        <span style={{ color: 'var(--text-muted)', textDecoration: 'line-through', fontSize: 12 }}>
                          {pr.previous} {pr.unit}
                        </span>
                        <span style={{ color: better ? 'var(--green)' : 'var(--red)', fontSize: 11, fontWeight: 700 }}>
                          {better ? '↑' : '↓'} {improvement}%
                        </span>
                      </div>
                    )}
                    <p className="health-pr-date mono">{pr.date}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}