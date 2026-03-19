import React, { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, ComposedChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import {
  DollarSign, TrendingUp, TrendingDown, PiggyBank,
  Plus, Target, Wallet, CreditCard, Edit2, Trash2, X
} from 'lucide-react';
import Topbar from '../components/layout/Topbar';
import {
  budgetCategories, budgetTransactions, incomes,
  budgetMonthly, savingsGoals
} from '../data/mockDataPerso';
import './Perso.css';

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || p.stroke || p.fill }} className="chart-tooltip-value">
          {p.name} : {typeof p.value === 'number' ? `${p.value.toLocaleString('fr-FR')} €` : p.value}
        </p>
      ))}
    </div>
  );
};

const GOAL_ICONS = ['🛡️','✈️','🚗','🏠','💻','🎓','🏖️','💍','🎸','🏋️','📱','🌍'];
const GOAL_COLORS = ['#2dd4a0','#3d7fff','#f5c842','#a78bfa','#fb923c','#ff4d6a','#69C9D0','#8892aa'];

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

// ─── Modal Dépense (ajout + édition) ─────────────────────────────────────────
function ExpenseModal({ tx, categories, onClose, onSave }) {
  const [form, setForm] = useState(tx
    ? { ...tx }
    : {
        date:       new Date().toISOString().slice(0, 10),
        label:      '',
        amount:     '',
        categoryId: categories[0]?.id || 1,
        type:       'expense',
      }
  );
  const s = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.label || !form.amount) return;
    onSave({ ...form, id: form.id || Date.now(), amount: Number(form.amount) });
    onClose();
  };

  const selectedCat = categories.find(c => c.id === Number(form.categoryId));

  return (
    <Modal title={tx ? '✏️ Modifier la dépense' : '➕ Ajouter une dépense'} onClose={onClose}>
      <div className="add-form">

        {/* Libellé */}
        <label>Libellé *</label>
        <input
          className="japan-input flex"
          placeholder="Ex : Courses Monoprix, Netflix, Restaurant..."
          value={form.label}
          onChange={e => s('label', e.target.value)}
          autoFocus
        />

        {/* Montant + Date */}
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <label>Montant (€) *</label>
            <div className="budget-amount-input-wrap">
              <span className="budget-currency-symbol">€</span>
              <input
                className="japan-input flex"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={form.amount}
                onChange={e => s('amount', e.target.value)}
                style={{ paddingLeft: 28 }}
              />
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <label>Date *</label>
            <input className="japan-input flex" type="date" value={form.date} onChange={e => s('date', e.target.value)} />
          </div>
        </div>

        {/* Catégorie */}
        <label>Catégorie *</label>
        <div className="budget-cat-grid">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`budget-cat-btn ${form.categoryId === cat.id ? 'active' : ''}`}
              style={form.categoryId === cat.id ? { borderColor: cat.color, background: cat.color + '18', color: cat.color } : {}}
              onClick={() => s('categoryId', cat.id)}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Prévisualisation */}
        {form.label && form.amount && selectedCat && (
          <div className="budget-expense-preview">
            <span style={{ fontSize: 20 }}>{selectedCat.icon}</span>
            <div>
              <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 13 }}>{form.label}</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{selectedCat.name} · {form.date}</p>
            </div>
            <span className="mono" style={{ color: 'var(--red)', fontWeight: 800, fontSize: 16, marginLeft: 'auto' }}>
              -{Number(form.amount).toLocaleString('fr-FR')} €
            </span>
          </div>
        )}

        <button className="perso-add-btn" style={{ height: 40, fontSize: 13, marginTop: 4 }} onClick={handleSave}>
          {tx ? <><Edit2 size={14} /> Enregistrer les modifications</> : <><Plus size={14} /> Ajouter la dépense</>}
        </button>
      </div>
    </Modal>
  );
}

// ─── Modal Objectif d'épargne (ajout + édition) ───────────────────────────────
function SavingsGoalModal({ goal, onClose, onSave }) {
  const [form, setForm] = useState(goal
    ? { ...goal }
    : { name: '', target: '', current: '', color: '#3d7fff', icon: '🎯', deadline: '' }
  );
  const s = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const pct = form.target && form.current
    ? Math.round((Number(form.current) / Number(form.target)) * 100)
    : 0;

  const handleSave = () => {
    if (!form.name || !form.target) return;
    onSave({
      ...form,
      id:      form.id || Date.now(),
      target:  Number(form.target),
      current: Number(form.current) || 0,
    });
    onClose();
  };

  return (
    <Modal title={goal ? '✏️ Modifier l\'objectif' : '🎯 Nouvel objectif d\'épargne'} onClose={onClose}>
      <div className="add-form">

        {/* Nom */}
        <label>Nom de l'objectif *</label>
        <input
          className="japan-input flex"
          placeholder="Ex : Fonds d'urgence, Voyage Japon, Apport immobilier..."
          value={form.name}
          onChange={e => s('name', e.target.value)}
          autoFocus
        />

        {/* Montants */}
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <label>Objectif cible (€) *</label>
            <input className="japan-input flex" type="number" placeholder="Ex : 10000"
              value={form.target} onChange={e => s('target', e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Déjà épargné (€)</label>
            <input className="japan-input flex" type="number" placeholder="Ex : 3500"
              value={form.current} onChange={e => s('current', e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Échéance</label>
            <input className="japan-input flex" type="date" value={form.deadline}
              onChange={e => s('deadline', e.target.value)} />
          </div>
        </div>

        {/* Barre de progression preview */}
        {pct > 0 && (
          <div className="budget-goal-progress-preview">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
              <span style={{ color: 'var(--text-muted)' }}>Progression actuelle</span>
              <span className="mono" style={{ color: form.color, fontWeight: 700 }}>{pct}%</span>
            </div>
            <div style={{ height: 8, background: 'var(--border-soft)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min(pct, 100)}%`, background: form.color, borderRadius: 4, transition: 'width 0.4s ease' }} />
            </div>
          </div>
        )}

        {/* Icône */}
        <label>Icône</label>
        <div className="jcm-icon-grid">
          {GOAL_ICONS.map(ic => (
            <button
              key={ic}
              className={`jcm-icon-btn ${form.icon === ic ? 'active' : ''}`}
              onClick={() => s('icon', ic)}
            >
              {ic}
            </button>
          ))}
        </div>

        {/* Couleur */}
        <label>Couleur</label>
        <div className="budget-color-grid">
          {GOAL_COLORS.map(c => (
            <button
              key={c}
              className={`budget-color-btn ${form.color === c ? 'active' : ''}`}
              style={{ background: c }}
              onClick={() => s('color', c)}
            />
          ))}
        </div>

        <button className="perso-add-btn" style={{ height: 40, fontSize: 13, marginTop: 4 }} onClick={handleSave}>
          {goal ? <><Edit2 size={14} /> Enregistrer</> : <><Plus size={14} /> Créer l'objectif</>}
        </button>
      </div>
    </Modal>
  );
}

// ─── Modal Confirmation suppression ──────────────────────────────────────────
function ConfirmDeleteModal({ label, onClose, onConfirm }) {
  return (
    <Modal title="🗑️ Confirmer la suppression" onClose={onClose}>
      <div className="add-form">
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          Supprimer <strong style={{ color: 'var(--text-primary)' }}>"{label}"</strong> ? Cette action est irréversible.
        </p>
        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button className="sante-secondary-btn" style={{ flex: 1, height: 40, fontSize: 13, justifyContent: 'center' }} onClick={onClose}>
            Annuler
          </button>
          <button
            style={{ flex: 1, height: 40, fontSize: 13, borderRadius: 8, fontWeight: 700, background: 'var(--red-dim)', color: 'var(--red)', border: '1px solid rgba(255,77,106,0.3)', cursor: 'pointer', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
            onClick={() => { onConfirm(); onClose(); }}
          >
            <Trash2 size={14} /> Supprimer
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
export default function Budget() {
  const [tab, setTab] = useState('overview');

  // State local
  const [transactions,  setTransactions]  = useState(budgetTransactions);
  const [goals,         setGoals]         = useState(savingsGoals);

  // Modals dépenses
  const [showAddExpense,  setShowAddExpense]  = useState(false);
  const [editingExpense,  setEditingExpense]  = useState(null);
  const [deletingExpense, setDeletingExpense] = useState(null);

  // Modals épargne
  const [showAddGoal,  setShowAddGoal]  = useState(false);
  const [editingGoal,  setEditingGoal]  = useState(null);
  const [deletingGoal, setDeletingGoal] = useState(null);

  // ── Handlers dépenses ──
  const saveExpense = (tx) => {
    setTransactions(prev =>
      prev.find(t => t.id === tx.id)
        ? prev.map(t => t.id === tx.id ? tx : t)
        : [tx, ...prev]
    );
  };

  const deleteExpense = (id) => setTransactions(prev => prev.filter(t => t.id !== id));

  // ── Handlers épargne ──
  const saveGoal = (goal) => {
    setGoals(prev =>
      prev.find(g => g.id === goal.id)
        ? prev.map(g => g.id === goal.id ? goal : g)
        : [...prev, goal]
    );
  };

  const deleteGoal = (id) => setGoals(prev => prev.filter(g => g.id !== id));

  // ── Calculs ──
  const totalIncome   = incomes.reduce((s, i) => s + i.amount, 0);
  const totalExpenses = transactions.reduce((s, t) => s + t.amount, 0);
  const balance       = totalIncome - totalExpenses;
  const savingsRate   = Math.round((balance / totalIncome) * 100);

  const expensesByCategory = budgetCategories.map(cat => {
    const actual = transactions.filter(t => t.categoryId === cat.id).reduce((s, t) => s + t.amount, 0);
    const pct    = cat.planned > 0 ? Math.round((actual / cat.planned) * 100) : 0;
    return { ...cat, actual, pct, over: actual > cat.planned };
  }).filter(c => c.actual > 0 || c.planned > 0);

  const fullData = [
    ...budgetMonthly.map(m => ({ ...m, type: 'actual' })),
    { month: 'Avr', income: 12000, expenses: 4500, savings: 7500, type: 'forecast' },
    { month: 'Mai', income: 11500, expenses: 4200, savings: 7300, type: 'forecast' },
  ];

  return (
    <div className="page">
      <Topbar
        title="Budget & Dépenses"
        subtitle={`Solde mars : +${balance.toLocaleString('fr-FR')} € · Taux épargne ${savingsRate}%`}
      />
      <div className="page-content">

        {/* ── Modals dépenses ── */}
        {showAddExpense  && <ExpenseModal categories={budgetCategories} onClose={() => setShowAddExpense(false)}  onSave={saveExpense} />}
        {editingExpense  && <ExpenseModal categories={budgetCategories} tx={editingExpense} onClose={() => setEditingExpense(null)}  onSave={saveExpense} />}
        {deletingExpense && (
          <ConfirmDeleteModal
            label={deletingExpense.label}
            onClose={() => setDeletingExpense(null)}
            onConfirm={() => deleteExpense(deletingExpense.id)}
          />
        )}

        {/* ── Modals épargne ── */}
        {showAddGoal  && <SavingsGoalModal onClose={() => setShowAddGoal(false)}  onSave={saveGoal} />}
        {editingGoal  && <SavingsGoalModal goal={editingGoal} onClose={() => setEditingGoal(null)}  onSave={saveGoal} />}
        {deletingGoal && (
          <ConfirmDeleteModal
            label={deletingGoal.name}
            onClose={() => setDeletingGoal(null)}
            onConfirm={() => deleteGoal(deletingGoal.id)}
          />
        )}

        {/* Tabs */}
        <div className="perso-tabs">
          {[
            { id: 'overview', label: 'Vue d\'ensemble' },
            { id: 'depenses', label: `Dépenses (${transactions.length})` },
            { id: 'revenus',  label: 'Revenus' },
            { id: 'epargne',  label: `Épargne (${goals.length})` },
          ].map(t => (
            <button key={t.id} className={`perso-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── VUE D'ENSEMBLE ── */}
        {tab === 'overview' && (
          <>
            <div className="perso-kpis stagger">
              {[
                { icon: TrendingUp,  label: 'Revenus mars',    value: `${totalIncome.toLocaleString('fr-FR')} €`,   color: '#2dd4a0', sub: `${incomes.length} sources` },
                { icon: TrendingDown,label: 'Dépenses mars',   value: `${totalExpenses.toLocaleString('fr-FR')} €`, color: '#ff4d6a', sub: `${transactions.length} transactions` },
                { icon: Wallet,      label: 'Solde net',        value: `+${balance.toLocaleString('fr-FR')} €`,     color: '#3d7fff', sub: 'Avant épargne' },
                { icon: PiggyBank,   label: 'Taux d\'épargne', value: `${savingsRate}%`,                            color: '#a78bfa', sub: 'Objectif : 40%' },
                { icon: Target,      label: 'Budget restant',   value: `${(expensesByCategory.reduce((s,c) => s+c.planned, 0) - totalExpenses).toLocaleString('fr-FR')} €`, color: '#f5c842', sub: 'Ce mois' },
                { icon: CreditCard,  label: 'Objectifs épargne',value: goals.length,                                color: '#2dd4a0', sub: `${goals.filter(g => Math.round(g.current/g.target*100) >= 100).length} atteints` },
              ].map(({ icon: Icon, label, value, color, sub }) => (
                <div key={label} className="perso-kpi">
                  <div className="perso-kpi-icon" style={{ background: color + '18', color }}><Icon size={14} strokeWidth={1.8} /></div>
                  <div>
                    <p className="perso-kpi-val mono">{value}</p>
                    <p className="perso-kpi-label">{label}</p>
                    <p className="perso-kpi-sub">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="perso-card">
              <div className="perso-card-header">
                <div>
                  <h3 className="perso-card-title">Revenus · Dépenses · Épargne</h3>
                  <p className="perso-card-sub">7 mois historique + 2 mois prévisions</p>
                </div>
                <div className="perso-legend">
                  {[['Revenus','#2dd4a0'],['Dépenses','#ff4d6a'],['Épargne','#3d7fff']].map(([n,c]) => (
                    <span key={n}><span className="perso-legend-dot" style={{ background: c }} />{n}</span>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <ComposedChart data={fullData} margin={{ top: 5, right: 10, bottom: 0, left: -10 }}>
                  <defs>
                    <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2dd4a0" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#2dd4a0" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3d7fff" stopOpacity={0.18} />
                      <stop offset="100%" stopColor="#3d7fff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#1e2740" strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: '#4a5470', fontSize: 11, fontFamily: 'Syne' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#4a5470', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v/1000}k`} />
                  <Tooltip content={<Tip />} />
                  <Area type="monotone" dataKey="income"   name="Revenus"  stroke="#2dd4a0" strokeWidth={2.5} fill="url(#incomeGrad)" dot={false} />
                  <Area type="monotone" dataKey="savings"  name="Épargne"  stroke="#3d7fff" strokeWidth={2}   fill="url(#savingsGrad)" dot={false} />
                  <Line  type="monotone" dataKey="expenses" name="Dépenses" stroke="#ff4d6a" strokeWidth={2} strokeDasharray="4 3" dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="perso-card">
              <div className="perso-card-header">
                <h3 className="perso-card-title">Budget vs Réel — Mars 2026</h3>
                <button className="perso-add-btn" onClick={() => setShowAddExpense(true)}>
                  <Plus size={13} /> Ajouter une dépense
                </button>
              </div>
              <div className="budget-categories">
                {expensesByCategory.map(cat => (
                  <div key={cat.id} className="budget-cat-row">
                    <span className="budget-cat-emoji">{cat.icon}</span>
                    <div className="budget-cat-info">
                      <div className="budget-cat-header-row">
                        <span className="budget-cat-name">{cat.name}</span>
                        <span className="mono budget-cat-actual" style={{ color: cat.over ? 'var(--red)' : 'var(--green)' }}>
                          {cat.actual.toLocaleString('fr-FR')} € / {cat.planned.toLocaleString('fr-FR')} €
                        </span>
                        <span className="mono budget-cat-pct" style={{ color: cat.over ? 'var(--red)' : 'var(--text-muted)' }}>
                          {cat.pct}%
                        </span>
                      </div>
                      <div className="budget-bar-wrap">
                        <div className="budget-bar-fill" style={{ width: `${Math.min(cat.pct, 100)}%`, background: cat.over ? 'var(--red)' : cat.pct > 80 ? 'var(--yellow)' : cat.color }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── DÉPENSES ── */}
        {tab === 'depenses' && (
          <div className="perso-card">
            <div className="perso-card-header">
              <h3 className="perso-card-title">Transactions — Mars 2026 <span style={{ color:'var(--text-muted)', fontWeight:400, fontSize:12 }}>{transactions.length} entrées · {totalExpenses.toLocaleString('fr-FR')} €</span></h3>
              <button className="perso-add-btn" onClick={() => setShowAddExpense(true)}>
                <Plus size={13} /> Ajouter
              </button>
            </div>
            <table className="perso-table">
              <thead>
                <tr><th>Date</th><th>Libellé</th><th>Catégorie</th><th>Montant</th><th style={{ width: 72 }}>Actions</th></tr>
              </thead>
              <tbody>
                {[...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).map(t => {
                  const cat = budgetCategories.find(c => c.id === t.categoryId);
                  return (
                    <tr key={t.id} className="perso-table-row">
                      <td className="mono">{t.date}</td>
                      <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{t.label}</td>
                      <td>
                        <span className="budget-cat-tag" style={{ color: cat?.color, background: (cat?.color || '#8892aa') + '18' }}>
                          {cat?.icon} {cat?.name}
                        </span>
                      </td>
                      <td className="mono" style={{ color: 'var(--red)', fontWeight: 700 }}>
                        -{t.amount.toLocaleString('fr-FR')} €
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 5 }}>
                          <button
                            className="budget-row-action-btn"
                            onClick={() => setEditingExpense(t)}
                            title="Modifier"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            className="budget-row-action-btn danger"
                            onClick={() => setDeletingExpense(t)}
                            title="Supprimer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ── REVENUS ── */}
        {tab === 'revenus' && (
          <>
            <div className="perso-kpis stagger">
              {[
                { label: 'Salaire',     value: incomes.find(i => i.category === 'salaire')?.amount     || 0, color: '#3d7fff' },
                { label: 'Immobilier',  value: incomes.find(i => i.category === 'immobilier')?.amount  || 0, color: '#2dd4a0' },
                { label: 'Contenu',     value: incomes.find(i => i.category === 'contenu')?.amount     || 0, color: '#ff4d6a' },
                { label: 'Freelance',   value: incomes.find(i => i.category === 'freelance')?.amount   || 0, color: '#a78bfa' },
                { label: 'Dividendes',  value: incomes.find(i => i.category === 'dividendes')?.amount  || 0, color: '#f5c842' },
                { label: 'Total',       value: totalIncome, color: 'var(--green)' },
              ].map(({ label, value, color }) => (
                <div key={label} className="perso-kpi">
                  <p className="perso-kpi-val mono" style={{ color }}>+{value.toLocaleString('fr-FR')} €</p>
                  <p className="perso-kpi-label">{label}</p>
                </div>
              ))}
            </div>
            <div className="perso-card">
              <div className="perso-card-header"><h3 className="perso-card-title">Revenus mars 2026</h3></div>
              {incomes.map(inc => {
                const catColor = { salaire:'#3d7fff', immobilier:'#2dd4a0', contenu:'#ff4d6a', freelance:'#a78bfa', dividendes:'#f5c842' }[inc.category] || '#8892aa';
                return (
                  <div key={inc.id} className="budget-income-row">
                    <div className="bir-dot" style={{ background: catColor }} />
                    <div className="bir-info">
                      <p className="bir-label">{inc.label}</p>
                      <p className="bir-date mono">{inc.date}</p>
                    </div>
                    {inc.recurrent && <span className="bir-recurrent">Récurrent</span>}
                    <p className="mono bir-amount" style={{ color: 'var(--green)' }}>+{inc.amount.toLocaleString('fr-FR')} €</p>
                  </div>
                );
              })}
              <div className="budget-total-row">
                <span>Total revenus</span>
                <span className="mono" style={{ color: 'var(--green)', fontWeight: 700 }}>+{totalIncome.toLocaleString('fr-FR')} €</span>
              </div>
            </div>
          </>
        )}

        {/* ── ÉPARGNE ── */}
        {tab === 'epargne' && (
          <>
            <div className="perso-card">
              <div className="perso-card-header">
                <h3 className="perso-card-title">Objectifs d'épargne ({goals.length})</h3>
                <button className="perso-add-btn" onClick={() => setShowAddGoal(true)}>
                  <Plus size={13} /> Nouvel objectif
                </button>
              </div>
              <div className="savings-goals-grid">
                {goals.map(goal => {
                  const pct      = Math.round((goal.current / goal.target) * 100);
                  const remaining = goal.target - goal.current;
                  const daysLeft  = goal.deadline ? Math.ceil((new Date(goal.deadline) - new Date()) / 86400000) : null;
                  return (
                    <div key={goal.id} className="savings-goal-card">
                      <div className="sgc-header">
                        <span className="sgc-icon">{goal.icon}</span>
                        <div style={{ flex: 1 }}>
                          <p className="sgc-name">{goal.name}</p>
                          {goal.deadline && (
                            <p className="sgc-deadline mono">
                              Échéance : {goal.deadline} ({daysLeft > 0 ? `J-${daysLeft}` : '✓ Passé'})
                            </p>
                          )}
                        </div>
                        {/* Actions modifier / supprimer */}
                        <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                          <button className="budget-row-action-btn" onClick={() => setEditingGoal(goal)} title="Modifier">
                            <Edit2 size={12} />
                          </button>
                          <button className="budget-row-action-btn danger" onClick={() => setDeletingGoal(goal)} title="Supprimer">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                      <div className="sgc-amounts">
                        <span className="mono sgc-current" style={{ color: goal.color }}>{goal.current.toLocaleString('fr-FR')} €</span>
                        <span className="sgc-sep">/</span>
                        <span className="mono sgc-target">{goal.target.toLocaleString('fr-FR')} €</span>
                      </div>
                      <div className="sgc-bar-wrap">
                        <div className="sgc-bar" style={{ width: `${Math.min(pct, 100)}%`, background: goal.color }} />
                      </div>
                      <div className="sgc-footer">
                        <span className="mono sgc-pct" style={{ color: pct >= 100 ? 'var(--green)' : goal.color }}>
                          {pct >= 100 ? '✓ Atteint' : `${pct}%`}
                        </span>
                        <span className="mono sgc-remaining">
                          {pct < 100 ? `Reste : ${remaining.toLocaleString('fr-FR')} €` : '🎉 Félicitations !'}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {goals.length === 0 && (
                  <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                    <p style={{ fontSize: 14, marginBottom: 12 }}>Aucun objectif d'épargne</p>
                    <button className="perso-add-btn" onClick={() => setShowAddGoal(true)}><Plus size={13} /> Créer un objectif</button>
                  </div>
                )}
              </div>
            </div>

            <div className="perso-card">
              <div className="perso-card-header"><h3 className="perso-card-title">Évolution de l'épargne mensuelle</h3></div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={budgetMonthly} margin={{ top: 5, right: 10, bottom: 0, left: -10 }}>
                  <CartesianGrid stroke="#1e2740" strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: '#4a5470', fontSize: 11, fontFamily: 'Syne' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#4a5470', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v/1000}k`} />
                  <Tooltip content={<Tip />} />
                  <Bar dataKey="savings" name="Épargne" radius={[3,3,0,0]}>
                    {budgetMonthly.map((_, i) => <Cell key={i} fill="#3d7fff" opacity={i === budgetMonthly.length-1 ? 1 : 0.6} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
}