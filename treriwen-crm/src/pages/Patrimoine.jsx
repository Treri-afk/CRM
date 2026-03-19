import React, { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  TrendingUp, TrendingDown, Plus, ArrowUpRight,
  ArrowDownRight, X
} from 'lucide-react';
import Topbar from '../components/layout/Topbar';
import { portfolioAccounts, holdings, portfolioHistory, transactions } from '../data/mockDataPerso';
import './Perso.css';

const typeColors = {
  action: '#3d7fff', etf: '#2dd4a0', crypto: '#f5c842',
  fonds: '#a78bfa', livret: '#fb923c',
};

const txTypeConfig = {
  buy:      { label: 'Achat',     color: 'var(--green)',  icon: ArrowDownRight },
  sell:     { label: 'Vente',     color: 'var(--red)',    icon: ArrowUpRight   },
  dividend: { label: 'Dividende', color: '#a78bfa',       icon: Plus           },
};

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || p.fill || p.stroke }} className="chart-tooltip-value">
          {p.name} : {typeof p.value === 'number' ? `${p.value.toLocaleString('fr-FR')} €` : p.value}
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

// ─── Modal Ajouter une position ───────────────────────────────────────────────
function AddHoldingModal({ accounts, onClose, onAdd }) {
  const [form, setForm] = useState({
    ticker: '', name: '', type: 'action', category: '',
    shares: '', avgPrice: '', currentPrice: '', currency: 'EUR',
    country: 'FR', accountId: accounts[0]?.id || 1,
  });
  const s = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleAdd = () => {
    if (!form.ticker || !form.name || !form.shares || !form.avgPrice || !form.currentPrice) return;
    onAdd({
      ...form,
      id: Date.now(),
      shares: Number(form.shares),
      avgPrice: Number(form.avgPrice),
      currentPrice: Number(form.currentPrice),
      accountId: Number(form.accountId),
    });
    onClose();
  };

  return (
    <Modal title="📈 Ajouter une position" onClose={onClose}>
      <div className="add-form">
        {/* Ticker + Nom */}
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: '0 0 100px' }}>
            <label>Ticker *</label>
            <input className="japan-input flex" placeholder="AAPL" value={form.ticker}
              onChange={e => s('ticker', e.target.value.toUpperCase())}
              style={{ fontWeight: 800, textTransform: 'uppercase' }} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Nom complet *</label>
            <input className="japan-input flex" placeholder="Ex : Apple Inc." value={form.name}
              onChange={e => s('name', e.target.value)} />
          </div>
        </div>

        {/* Type + Catégorie */}
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <label>Type d'actif *</label>
            <select className="perso-select" style={{ width: '100%', height: 36 }} value={form.type}
              onChange={e => s('type', e.target.value)}>
              {Object.entries(typeColors).map(([k]) => (
                <option key={k} value={k}>{k.charAt(0).toUpperCase() + k.slice(1)}</option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label>Catégorie</label>
            <input className="japan-input flex" placeholder="Ex : S&P500, CAC40, ETF Monde"
              value={form.category} onChange={e => s('category', e.target.value)} />
          </div>
        </div>

        {/* Quantité + Prix achat + Prix actuel */}
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <label>Quantité *</label>
            <input className="japan-input flex" type="number" placeholder="Ex : 10"
              value={form.shares} onChange={e => s('shares', e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Prix moyen d'achat (€) *</label>
            <input className="japan-input flex" type="number" placeholder="Ex : 180.50"
              value={form.avgPrice} onChange={e => s('avgPrice', e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Prix actuel (€) *</label>
            <input className="japan-input flex" type="number" placeholder="Ex : 210.00"
              value={form.currentPrice} onChange={e => s('currentPrice', e.target.value)} />
          </div>
        </div>

        {/* Prévisualisation P&L */}
        {form.shares && form.avgPrice && form.currentPrice && (
          <div className="patrimoine-preview-pnl">
            <span>Valeur estimée</span>
            <span className="mono">{(Number(form.shares) * Number(form.currentPrice)).toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €</span>
            <span>P&L</span>
            <span className="mono" style={{ color: Number(form.currentPrice) >= Number(form.avgPrice) ? 'var(--green)' : 'var(--red)', fontWeight: 700 }}>
              {Number(form.currentPrice) >= Number(form.avgPrice) ? '+' : ''}
              {((Number(form.currentPrice) - Number(form.avgPrice)) * Number(form.shares)).toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €
              {' '}({(((Number(form.currentPrice) - Number(form.avgPrice)) / Number(form.avgPrice)) * 100).toFixed(1)}%)
            </span>
          </div>
        )}

        {/* Pays + Compte */}
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <label>Pays</label>
            <input className="japan-input flex" placeholder="Ex : FR, US, IE"
              value={form.country} onChange={e => s('country', e.target.value.toUpperCase())} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Compte *</label>
            <select className="perso-select" style={{ width: '100%', height: 36 }} value={form.accountId}
              onChange={e => s('accountId', e.target.value)}>
              {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
        </div>

        <button className="perso-add-btn" style={{ marginTop: 8, height: 40, fontSize: 13 }} onClick={handleAdd}>
          <Plus size={14} /> Ajouter la position
        </button>
      </div>
    </Modal>
  );
}

// ─── Modal Ajouter une transaction ───────────────────────────────────────────
function AddTransactionModal({ accounts, holdingsList, onClose, onAdd }) {
  const [form, setForm] = useState({
    type: 'buy', date: new Date().toISOString().slice(0, 10),
    ticker: '', shares: '', price: '', fees: '', amount: '',
    accountId: accounts[0]?.id || 1, note: '',
  });
  const s = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // Suggestions tickers depuis les positions existantes
  const tickers = [...new Set(holdingsList.map(h => h.ticker))];

  const handleAdd = () => {
    if (!form.date || !form.ticker) return;
    onAdd({
      ...form,
      id:        Date.now(),
      shares:    form.type === 'dividend' ? 0 : Number(form.shares),
      price:     Number(form.price)  || 0,
      fees:      Number(form.fees)   || 0,
      amount:    Number(form.amount) || (Number(form.shares) * Number(form.price)),
      accountId: Number(form.accountId),
    });
    onClose();
  };

  const estAmount = form.type === 'dividend'
    ? Number(form.amount) || 0
    : Number(form.shares) * Number(form.price) || 0;

  return (
    <Modal title="💸 Ajouter une transaction" onClose={onClose}>
      <div className="add-form">

        {/* Type */}
        <label>Type de transaction *</label>
        <div className="filter-tabs">
          {Object.entries(txTypeConfig).map(([k, v]) => (
            <button
              key={k}
              className={`filter-tab ${form.type === k ? 'active' : ''}`}
              style={form.type === k ? { borderColor: v.color, color: v.color } : {}}
              onClick={() => s('type', k)}
            >
              {v.label}
            </button>
          ))}
        </div>

        {/* Date + Ticker */}
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <label>Date *</label>
            <input className="japan-input flex" type="date" value={form.date}
              onChange={e => s('date', e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Ticker *</label>
            <input
              className="japan-input flex"
              placeholder="Ex : NVDA"
              value={form.ticker}
              onChange={e => s('ticker', e.target.value.toUpperCase())}
              list="ticker-suggestions"
              style={{ fontWeight: 700, textTransform: 'uppercase' }}
            />
            <datalist id="ticker-suggestions">
              {tickers.map(t => <option key={t} value={t} />)}
            </datalist>
          </div>
        </div>

        {/* Quantité + Prix + Frais (pas pour dividende) */}
        {form.type !== 'dividend' ? (
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label>Quantité *</label>
              <input className="japan-input flex" type="number" placeholder="Ex : 5"
                value={form.shares} onChange={e => s('shares', e.target.value)} />
            </div>
            <div style={{ flex: 1 }}>
              <label>Prix unitaire (€) *</label>
              <input className="japan-input flex" type="number" placeholder="Ex : 820"
                value={form.price} onChange={e => s('price', e.target.value)} />
            </div>
            <div style={{ flex: 1 }}>
              <label>Frais (€)</label>
              <input className="japan-input flex" type="number" placeholder="Ex : 2.50"
                value={form.fees} onChange={e => s('fees', e.target.value)} />
            </div>
          </div>
        ) : (
          <div>
            <label>Montant dividende reçu (€) *</label>
            <input className="japan-input flex" type="number" placeholder="Ex : 48"
              value={form.amount} onChange={e => s('amount', e.target.value)} />
          </div>
        )}

        {/* Prévisualisation montant */}
        {estAmount > 0 && (
          <div className="patrimoine-preview-pnl">
            <span>Montant total</span>
            <span className="mono" style={{ color: form.type === 'buy' ? 'var(--red)' : 'var(--green)', fontWeight: 700 }}>
              {form.type === 'buy' ? '-' : '+'}{estAmount.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €
              {form.fees > 0 ? ` (dont ${form.fees}€ frais)` : ''}
            </span>
          </div>
        )}

        {/* Compte + Note */}
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <label>Compte *</label>
            <select className="perso-select" style={{ width: '100%', height: 36 }} value={form.accountId}
              onChange={e => s('accountId', e.target.value)}>
              {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label>Note (optionnel)</label>
            <input className="japan-input flex" placeholder="Ex : DCA mensuel"
              value={form.note} onChange={e => s('note', e.target.value)} />
          </div>
        </div>

        <button className="perso-add-btn" style={{ marginTop: 8, height: 40, fontSize: 13 }} onClick={handleAdd}>
          <Plus size={14} /> Enregistrer la transaction
        </button>
      </div>
    </Modal>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
export default function Patrimoine() {
  const [tab,           setTab]           = useState('portfolio');
  const [accountFilter, setAccountFilter] = useState('all');
  const [holdingsList,  setHoldingsList]  = useState(holdings);
  const [txList,        setTxList]        = useState(transactions);
  const [showAddHolding, setShowAddHolding] = useState(false);
  const [showAddTx,      setShowAddTx]     = useState(false);

  // ── Calculs ──
  const totalValue  = holdingsList.reduce((s, h) => s + h.shares * h.currentPrice, 0);
  const totalCost   = holdingsList.reduce((s, h) => s + h.shares * h.avgPrice, 0);
  const totalPnL    = totalValue - totalCost;
  const totalPnLPct = ((totalPnL / totalCost) * 100).toFixed(2);
  const lastMonth   = portfolioHistory[portfolioHistory.length - 1].value;
  const prevMonth   = portfolioHistory[portfolioHistory.length - 2].value;
  const monthGrowth = ((lastMonth - prevMonth) / prevMonth * 100).toFixed(2);

  const byType = Object.entries(
    holdingsList.reduce((acc, h) => {
      acc[h.type] = (acc[h.type] || 0) + h.shares * h.currentPrice;
      return acc;
    }, {})
  ).map(([type, value]) => ({ type, value, color: typeColors[type] || '#8892aa' }));

  const byAccount = portfolioAccounts.map(acc => ({
    ...acc,
    value: holdingsList.filter(h => h.accountId === acc.id).reduce((s, h) => s + h.shares * h.currentPrice, 0),
    cost:  holdingsList.filter(h => h.accountId === acc.id).reduce((s, h) => s + h.shares * h.avgPrice, 0),
    count: holdingsList.filter(h => h.accountId === acc.id).length,
  }));

  const filteredHoldings = accountFilter === 'all'
    ? holdingsList
    : holdingsList.filter(h => h.accountId === Number(accountFilter));

  return (
    <div className="page">
      <Topbar
        title="Patrimoine & Investissements"
        subtitle={`${totalValue.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} € · ${Number(totalPnLPct) >= 0 ? '+' : ''}${totalPnLPct}%`}
      />
      <div className="page-content">

        {/* Modals */}
        {showAddHolding && (
          <AddHoldingModal
            accounts={portfolioAccounts}
            onClose={() => setShowAddHolding(false)}
            onAdd={h => setHoldingsList(prev => [...prev, h])}
          />
        )}
        {showAddTx && (
          <AddTransactionModal
            accounts={portfolioAccounts}
            holdingsList={holdingsList}
            onClose={() => setShowAddTx(false)}
            onAdd={tx => setTxList(prev => [tx, ...prev])}
          />
        )}

        {/* KPIs */}
        <div className="perso-kpis stagger">
          {[
            { label: 'Valeur totale',   value: `${totalValue.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €`, color: '#3d7fff', sub: `${holdingsList.length} positions` },
            { label: 'P&L total',       value: `${totalPnL >= 0 ? '+' : ''}${totalPnL.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €`, color: totalPnL >= 0 ? 'var(--green)' : 'var(--red)', sub: `${Number(totalPnLPct) >= 0 ? '+' : ''}${totalPnLPct}%` },
            { label: 'Ce mois',         value: `${Number(monthGrowth) >= 0 ? '+' : ''}${monthGrowth}%`, color: Number(monthGrowth) >= 0 ? 'var(--green)' : 'var(--red)', sub: `${(lastMonth - prevMonth).toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €` },
            { label: 'Comptes',         value: portfolioAccounts.length, color: '#a78bfa', sub: 'PEA, CTO, AV, Crypto…' },
            { label: 'Crypto',          value: `${holdingsList.filter(h => h.type === 'crypto').reduce((s, h) => s + h.shares * h.currentPrice, 0).toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €`, color: '#f5c842', sub: 'BTC, ETH, SOL' },
            { label: 'Épargne livrets', value: `${holdingsList.filter(h => h.type === 'livret').reduce((s, h) => s + h.shares * h.currentPrice, 0).toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €`, color: '#fb923c', sub: 'Livret A + LDDS' },
          ].map(({ label, value, color, sub }) => (
            <div key={label} className="perso-kpi">
              <p className="perso-kpi-val mono" style={{ color }}>{value}</p>
              <p className="perso-kpi-label">{label}</p>
              <p className="perso-kpi-sub">{sub}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="perso-tabs">
          {[
            { id: 'portfolio',    label: `Portfolio (${holdingsList.length})` },
            { id: 'allocation',   label: 'Allocation' },
            { id: 'performance',  label: 'Performance' },
            { id: 'transactions', label: `Transactions (${txList.length})` },
          ].map(t => (
            <button key={t.id} className={`perso-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── PORTFOLIO ── */}
        {tab === 'portfolio' && (
          <>
            <div className="perso-accounts-grid">
              {byAccount.map(acc => {
                const pnl    = acc.value - acc.cost;
                const pnlPct = acc.cost > 0 ? ((pnl / acc.cost) * 100).toFixed(1) : '0.0';
                return (
                  <div key={acc.id} className="perso-account-card" style={{ '--acc-color': acc.color }}>
                    <div className="pac-accent" style={{ background: acc.color }} />
                    <div className="pac-body">
                      <p className="pac-name">{acc.name}</p>
                      <p className="pac-broker">{acc.broker} · {acc.count} positions</p>
                      <p className="pac-value mono">{acc.value.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €</p>
                      <p className="pac-pnl" style={{ color: pnl >= 0 ? 'var(--green)' : 'var(--red)' }}>
                        {pnl >= 0 ? '+' : ''}{pnl.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} € ({pnlPct}%)
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="perso-card">
              <div className="perso-card-header">
                <h3 className="perso-card-title">Positions</h3>
                <div style={{ display: 'flex', gap: 8 }}>
                  <select className="perso-select" value={accountFilter} onChange={e => setAccountFilter(e.target.value)}>
                    <option value="all">Tous les comptes</option>
                    {portfolioAccounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                  <button className="perso-add-btn" onClick={() => setShowAddHolding(true)}>
                    <Plus size={13} /> Ajouter une position
                  </button>
                </div>
              </div>
              <table className="perso-table">
                <thead>
                  <tr>
                    <th>Actif</th><th>Type</th><th>Qté</th>
                    <th>Prix moy.</th><th>Prix actuel</th>
                    <th>Valeur</th><th>P&L €</th><th>P&L %</th><th>Compte</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHoldings.map(h => {
                    const value  = h.shares * h.currentPrice;
                    const cost   = h.shares * h.avgPrice;
                    const pnl    = value - cost;
                    const pnlPct = ((pnl / cost) * 100).toFixed(1);
                    const acc    = portfolioAccounts.find(a => a.id === h.accountId);
                    return (
                      <tr key={h.id} className="perso-table-row">
                        <td>
                          <div className="perso-holding-cell">
                            <span className="perso-ticker" style={{ background: (typeColors[h.type] || '#8892aa') + '20', color: typeColors[h.type] || '#8892aa' }}>
                              {h.ticker}
                            </span>
                            <div>
                              <p className="perso-holding-name">{h.name}</p>
                              <p className="perso-holding-country">{h.country}</p>
                            </div>
                          </div>
                        </td>
                        <td><span className="perso-type-badge" style={{ color: typeColors[h.type], background: (typeColors[h.type] || '#8892aa') + '18' }}>{h.type}</span></td>
                        <td className="mono">{h.shares}</td>
                        <td className="mono">{h.avgPrice.toLocaleString('fr-FR')} €</td>
                        <td className="mono">{h.currentPrice.toLocaleString('fr-FR')} €</td>
                        <td className="mono" style={{ fontWeight: 700 }}>{value.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €</td>
                        <td className="mono" style={{ color: pnl >= 0 ? 'var(--green)' : 'var(--red)', fontWeight: 600 }}>
                          {pnl >= 0 ? '+' : ''}{pnl.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €
                        </td>
                        <td className="mono" style={{ color: pnl >= 0 ? 'var(--green)' : 'var(--red)' }}>
                          {pnl >= 0 ? '+' : ''}{pnlPct}%
                        </td>
                        <td>
                          <span className="perso-acc-dot" style={{ background: acc?.color }} />
                          <span className="perso-acc-name">{acc?.name.split(' ')[0]}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ── ALLOCATION ── */}
        {tab === 'allocation' && (
          <div className="perso-two-col">
            <div className="perso-card">
              <div className="perso-card-header"><h3 className="perso-card-title">Par type d'actif</h3></div>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={byType} dataKey="value" nameKey="type" cx="50%" cy="50%" outerRadius={90} innerRadius={50}>
                    {byType.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={v => `${v.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €`} contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-soft)', borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="perso-alloc-list">
                {byType.sort((a, b) => b.value - a.value).map(t => (
                  <div key={t.type} className="perso-alloc-row">
                    <div className="perso-alloc-dot" style={{ background: t.color }} />
                    <span className="perso-alloc-label">{t.type}</span>
                    <div className="perso-alloc-bar-wrap">
                      <div className="perso-alloc-bar" style={{ width: `${(t.value / totalValue) * 100}%`, background: t.color }} />
                    </div>
                    <span className="mono perso-alloc-val">{t.value.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €</span>
                    <span className="mono perso-alloc-pct">{((t.value / totalValue) * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="perso-card">
              <div className="perso-card-header"><h3 className="perso-card-title">Par compte</h3></div>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={byAccount} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={50}>
                    {byAccount.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={v => `${v.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €`} contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-soft)', borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="perso-alloc-list">
                {byAccount.sort((a, b) => b.value - a.value).map(a => (
                  <div key={a.id} className="perso-alloc-row">
                    <div className="perso-alloc-dot" style={{ background: a.color }} />
                    <span className="perso-alloc-label">{a.name}</span>
                    <div className="perso-alloc-bar-wrap">
                      <div className="perso-alloc-bar" style={{ width: `${(a.value / totalValue) * 100}%`, background: a.color }} />
                    </div>
                    <span className="mono perso-alloc-val">{a.value.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €</span>
                    <span className="mono perso-alloc-pct">{((a.value / totalValue) * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── PERFORMANCE ── */}
        {tab === 'performance' && (
          <div className="perso-card">
            <div className="perso-card-header">
              <h3 className="perso-card-title">Évolution du portfolio</h3>
              <p className="perso-card-sub">7 derniers mois</p>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={portfolioHistory} margin={{ top: 5, right: 10, bottom: 0, left: -10 }}>
                <defs>
                  <linearGradient id="portGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3d7fff" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#3d7fff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1e2740" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#4a5470', fontSize: 11, fontFamily: 'Syne' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#4a5470', fontSize: 10, fontFamily: 'Syne' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<Tip />} />
                <Area type="monotone" dataKey="value" name="Valeur" stroke="#3d7fff" strokeWidth={2.5} fill="url(#portGrad)" dot={{ fill: '#3d7fff', r: 4, stroke: '#0d1117', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="perso-card-header" style={{ marginTop: 20 }}>
              <h3 className="perso-card-title">Meilleures performances</h3>
            </div>
            {[...holdingsList]
              .map(h => ({ ...h, pnlPct: ((h.currentPrice - h.avgPrice) / h.avgPrice * 100) }))
              .sort((a, b) => b.pnlPct - a.pnlPct)
              .slice(0, 6)
              .map(h => (
                <div key={h.id} className="perso-perf-row">
                  <span className="perso-ticker" style={{ background: (typeColors[h.type] || '#8892aa') + '20', color: typeColors[h.type] }}>{h.ticker}</span>
                  <span className="perso-perf-name">{h.name}</span>
                  <div className="perso-perf-bar-wrap">
                    <div className="perso-perf-bar" style={{ width: `${Math.min(Math.abs(h.pnlPct), 100)}%`, background: h.pnlPct >= 0 ? 'var(--green)' : 'var(--red)' }} />
                  </div>
                  <span className="mono" style={{ color: h.pnlPct >= 0 ? 'var(--green)' : 'var(--red)', fontWeight: 700 }}>
                    {h.pnlPct >= 0 ? '+' : ''}{h.pnlPct.toFixed(1)}%
                  </span>
                </div>
              ))
            }
          </div>
        )}

        {/* ── TRANSACTIONS ── */}
        {tab === 'transactions' && (
          <div className="perso-card">
            <div className="perso-card-header">
              <h3 className="perso-card-title">Historique des transactions</h3>
              <button className="perso-add-btn" onClick={() => setShowAddTx(true)}>
                <Plus size={13} /> Ajouter une transaction
              </button>
            </div>
            <table className="perso-table">
              <thead>
                <tr><th>Date</th><th>Type</th><th>Actif</th><th>Qté</th><th>Prix</th><th>Frais</th><th>Montant</th><th>Compte</th></tr>
              </thead>
              <tbody>
                {[...txList].sort((a, b) => new Date(b.date) - new Date(a.date)).map(tx => {
                  const tc     = txTypeConfig[tx.type] || txTypeConfig.buy;
                  const Icon   = tc.icon;
                  const acc    = portfolioAccounts.find(a => a.id === tx.accountId);
                  const amount = tx.amount || (tx.shares * tx.price);
                  return (
                    <tr key={tx.id} className="perso-table-row">
                      <td className="mono">{tx.date}</td>
                      <td><span className="perso-tx-badge" style={{ color: tc.color, background: tc.color + '18' }}><Icon size={10} /> {tc.label}</span></td>
                      <td className="perso-ticker-sm">{tx.ticker}</td>
                      <td className="mono">{tx.shares > 0 ? tx.shares : '—'}</td>
                      <td className="mono">{tx.price > 0 ? `${tx.price.toLocaleString('fr-FR')} €` : '—'}</td>
                      <td className="mono" style={{ color: 'var(--text-muted)' }}>{tx.fees > 0 ? `${tx.fees} €` : '—'}</td>
                      <td className="mono" style={{ fontWeight: 700, color: tx.type === 'buy' ? 'var(--red)' : 'var(--green)' }}>
                        {tx.type === 'buy' ? '-' : '+'}{amount.toLocaleString('fr-FR')} €
                      </td>
                      <td>
                        <span className="perso-acc-dot" style={{ background: acc?.color }} />
                        <span className="perso-acc-name">{acc?.name.split(' ')[0]}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}