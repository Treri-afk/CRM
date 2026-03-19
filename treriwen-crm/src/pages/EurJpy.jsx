import React, { useState } from 'react';
import {
  AreaChart, Area, ComposedChart, Line, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import {
  TrendingUp, TrendingDown, Bell, Plus, Trash2,
  Calculator, ArrowRightLeft, Clock, CheckCircle2,
  AlertTriangle, Info, DollarSign
} from 'lucide-react';
import Topbar from '../components/layout/Topbar';
import {
  eurJpyHistory, eurJpyAlerts, transfers, rentalEurImpact
} from '../data/mockDataJapan';
import './Japan.css';

const currentRate = eurJpyHistory[eurJpyHistory.length - 1].rate;
const prevRate    = eurJpyHistory[eurJpyHistory.length - 2].rate;
const rateChange  = (currentRate - prevRate).toFixed(2);
const rateChangePct = ((currentRate - prevRate) / prevRate * 100).toFixed(2);

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

// Timing advice basé sur le taux
function getTimingAdvice(rate) {
  if (rate >= 165) return { label: 'Excellent — Virer maintenant', color: 'var(--green)',  icon: '🟢', detail: 'Taux historiquement haut. Moment idéal pour convertir.' };
  if (rate >= 160) return { label: 'Favorable — Bon moment',       color: '#2dd4a0',       icon: '🟢', detail: 'Taux au-dessus de la moyenne. Virement conseillé.' };
  if (rate >= 155) return { label: 'Acceptable — À surveiller',    color: 'var(--yellow)', icon: '🟡', detail: 'Taux moyen. Attendre si possible une amélioration.' };
  return              { label: 'Défavorable — Attendre',           color: 'var(--red)',    icon: '🔴', detail: 'Taux bas. Éviter les virements importants.' };
}

export default function EurJpy() {
  const [calcEur, setCalcEur]       = useState('');
  const [calcJpy, setCalcJpy]       = useState('');
  const [direction, setDirection]   = useState('eur_to_jpy');
  const [alerts, setAlerts]         = useState(eurJpyAlerts);
  const [newThreshold, setNewThreshold] = useState('');
  const [newType, setNewType]       = useState('above');
  const [newLabel, setNewLabel]     = useState('');
  const [tab, setTab]               = useState('dashboard');

  const timing = getTimingAdvice(currentRate);

  // Calcul conversions
  const handleCalc = (val, dir) => {
    if (dir === 'eur_to_jpy') {
      setCalcEur(val);
      setCalcJpy(val ? Math.round(val * currentRate).toLocaleString('fr-FR') : '');
    } else {
      setCalcJpy(val);
      setCalcEur(val ? (val / currentRate).toFixed(2) : '');
    }
  };

  const swapDirection = () => {
    setDirection(d => d === 'eur_to_jpy' ? 'jpy_to_eur' : 'eur_to_jpy');
    setCalcEur(''); setCalcJpy('');
  };

  const addAlert = () => {
    if (!newThreshold) return;
    setAlerts(prev => [...prev, {
      id: Date.now(), type: newType,
      threshold: Number(newThreshold),
      label: newLabel || `Taux ${newType === 'above' ? '>' : '<'} ${newThreshold}`,
      active: true, triggered: false,
    }]);
    setNewThreshold(''); setNewLabel('');
  };

  const removeAlert = (id) => setAlerts(prev => prev.filter(a => a.id !== id));

  // KPIs loyers en €
  const totalJpy  = rentalEurImpact.reduce((s, m) => s + m.jpyRevenue, 0);
  const totalEur  = rentalEurImpact.reduce((s, m) => s + m.eurRevenue, 0);
  const avgRate   = (totalJpy / totalEur).toFixed(2);
  const bestMonth = [...rentalEurImpact].sort((a, b) => a.rate - b.rate)[0];
  const worstMonth = [...rentalEurImpact].sort((a, b) => b.rate - a.rate)[0];
  const lostToRate = Math.round(totalJpy / Number(avgRate) - totalJpy / 163);

  return (
    <div className="page">
      <Topbar title="Suivi EUR/JPY" subtitle={`Taux actuel : ${currentRate} · ${rateChange >= 0 ? '+' : ''}${rateChange} (${rateChangePct >= 0 ? '+' : ''}${rateChangePct}%)`} />
      <div className="page-content">

        {/* KPIs */}
        <div className="japan-kpis stagger">
          {[
            { label: 'Taux actuel',      value: `${currentRate}`, unit: '¥/€', color: currentRate >= 160 ? 'var(--green)' : 'var(--yellow)', sub: `${rateChange >= 0 ? '+' : ''}${rateChange} aujourd'hui` },
            { label: 'Variation 1 mois', value: `${rateChangePct >= 0 ? '+' : ''}${rateChangePct}%`, unit: '', color: rateChangePct >= 0 ? 'var(--green)' : 'var(--red)', sub: `${prevRate} → ${currentRate}` },
            { label: 'Conseil timing',   value: timing.icon,      unit: timing.label, color: timing.color, sub: timing.detail },
            { label: 'Loyers 7 mois (€)', value: `${totalEur.toLocaleString('fr-FR')} €`, unit: '', color: '#2dd4a0', sub: `Taux moy. : ${avgRate}` },
            { label: 'Virements réalisés', value: transfers.length, unit: 'transfers', color: '#3d7fff', sub: `${transfers.reduce((s, t) => s + t.amountEur, 0).toLocaleString('fr-FR')} € envoyés` },
            { label: 'Alertes actives',  value: alerts.filter(a => a.active).length, unit: '', color: '#a78bfa', sub: `${alerts.filter(a => a.triggered).length} déclenchées` },
          ].map(({ label, value, unit, color, sub }) => (
            <div key={label} className="japan-kpi">
              <p className="japan-kpi-val mono" style={{ color }}>{value} <span className="japan-kpi-unit">{unit}</span></p>
              <p className="japan-kpi-label">{label}</p>
              <p className="japan-kpi-sub">{sub}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="perso-tabs">
          {[
            { id: 'dashboard',  label: 'Tableau de bord' },
            { id: 'historique', label: 'Historique' },
            { id: 'alertes',    label: `Alertes (${alerts.length})` },
            { id: 'convertir',  label: 'Convertir' },
            { id: 'virements',  label: 'Virements' },
            { id: 'impact',     label: 'Impact loyers' },
          ].map(t => (
            <button key={t.id} className={`perso-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── DASHBOARD ── */}
        {tab === 'dashboard' && (
          <>
            {/* Conseil timing */}
            <div className="japan-timing-card" style={{ borderColor: timing.color + '44', background: timing.color + '0a' }}>
              <div className="jtc-icon" style={{ color: timing.color }}><Clock size={22} strokeWidth={1.6} /></div>
              <div>
                <p className="jtc-label" style={{ color: timing.color }}>{timing.icon} {timing.label}</p>
                <p className="jtc-detail">{timing.detail}</p>
                <p className="jtc-rate mono">Taux actuel : <strong style={{ color: timing.color }}>{currentRate} ¥/€</strong></p>
              </div>
              <div className="jtc-examples">
                {[1000, 5000, 10000].map(eur => (
                  <div key={eur} className="jtc-example">
                    <span className="mono">{eur.toLocaleString('fr-FR')} €</span>
                    <span>→</span>
                    <span className="mono" style={{ color: timing.color }}>{Math.round(eur * currentRate).toLocaleString('fr-FR')} ¥</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Graphe rapide */}
            <div className="perso-card">
              <div className="perso-card-header">
                <h3 className="perso-card-title">Évolution EUR/JPY — 7 mois</h3>
                <div style={{ display: 'flex', gap: 8, fontSize: 12 }}>
                  <span style={{ color: 'var(--green)' }}>▬ Taux vert (160+)</span>
                  <span style={{ color: 'var(--red)' }}>▬ Seuil critique (155)</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={eurJpyHistory.filter(d => d.date.length === 10 && d.date <= '2026-03-01')} margin={{ top: 5, right: 10, bottom: 0, left: -10 }}>
                  <defs>
                    <linearGradient id="rateGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f5c842" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#f5c842" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#1e2740" strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: '#4a5470', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => v.slice(0, 7)} />
                  <YAxis domain={[150, 170]} tick={{ fill: '#4a5470', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<Tip />} />
                  <ReferenceLine y={160} stroke="var(--green)" strokeDasharray="6 3" strokeWidth={1.5} label={{ value: '160 — Favorable', fill: 'var(--green)', fontSize: 10, position: 'right' }} />
                  <ReferenceLine y={155} stroke="var(--red)" strokeDasharray="6 3" strokeWidth={1.5} label={{ value: '155 — Critique', fill: 'var(--red)', fontSize: 10, position: 'right' }} />
                  <Area type="monotone" dataKey="rate" name="EUR/JPY" stroke="#f5c842" strokeWidth={2.5} fill="url(#rateGrad)" dot={{ fill: '#f5c842', r: 4, stroke: '#0d1117', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* ── HISTORIQUE ── */}
        {tab === 'historique' && (
          <div className="perso-card">
            <div className="perso-card-header"><h3 className="perso-card-title">Historique complet EUR/JPY</h3></div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={eurJpyHistory} margin={{ top: 5, right: 10, bottom: 0, left: -10 }}>
                <defs>
                  <linearGradient id="rateGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f5c842" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#f5c842" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1e2740" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: '#4a5470', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => v.slice(0, 7)} />
                <YAxis domain={[148, 170]} tick={{ fill: '#4a5470', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<Tip />} />
                <ReferenceLine y={160} stroke="var(--green)" strokeDasharray="4 3" strokeWidth={1} />
                <ReferenceLine y={155} stroke="var(--red)" strokeDasharray="4 3" strokeWidth={1} />
                <Area type="monotone" dataKey="rate" name="EUR/JPY" stroke="#f5c842" strokeWidth={2.5} fill="url(#rateGrad2)" dot={{ fill: '#f5c842', r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
            <table className="perso-table" style={{ marginTop: 12 }}>
              <thead><tr><th>Date</th><th>Taux</th><th>Variation</th><th>Conseil</th></tr></thead>
              <tbody>
                {[...eurJpyHistory].reverse().map((d, i, arr) => {
                  const prev = arr[i + 1];
                  const diff = prev ? (d.rate - prev.rate).toFixed(2) : null;
                  const adv = getTimingAdvice(d.rate);
                  return (
                    <tr key={d.date} className="perso-table-row">
                      <td className="mono">{d.date}</td>
                      <td className="mono" style={{ fontWeight: 700, color: '#f5c842' }}>{d.rate}</td>
                      <td className="mono" style={{ color: diff >= 0 ? 'var(--green)' : 'var(--red)' }}>
                        {diff ? `${diff >= 0 ? '+' : ''}${diff}` : '—'}
                      </td>
                      <td style={{ color: adv.color, fontSize: 12 }}>{adv.icon} {adv.label}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ── ALERTES ── */}
        {tab === 'alertes' && (
          <>
            <div className="japan-alerts-list">
              {alerts.map(a => (
                <div key={a.id} className={`japan-alert-row ${a.triggered ? 'triggered' : ''} ${!a.active ? 'inactive' : ''}`}>
                  <div className="jar-icon" style={{ color: a.type === 'above' ? 'var(--green)' : 'var(--red)', background: a.type === 'above' ? 'var(--green-dim)' : 'var(--red-dim)' }}>
                    {a.type === 'above' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  </div>
                  <div className="jar-info">
                    <p className="jar-label">{a.label}</p>
                    <p className="jar-threshold mono">
                      {a.type === 'above' ? 'Déclencher si >' : 'Déclencher si <'} <strong>{a.threshold} ¥/€</strong>
                    </p>
                  </div>
                  <span className={`jar-status ${a.triggered ? 'triggered' : a.active ? 'active' : 'off'}`}>
                    {a.triggered ? '🔔 Déclenché' : a.active ? '✅ Actif' : '⏸ Inactif'}
                  </span>
                  <button className="japan-icon-btn danger" onClick={() => removeAlert(a.id)}><Trash2 size={13} /></button>
                </div>
              ))}
            </div>

            <div className="perso-card">
              <div className="perso-card-header"><h3 className="perso-card-title">Nouvelle alerte</h3></div>
              <div className="japan-alert-form">
                <select className="perso-select" value={newType} onChange={e => setNewType(e.target.value)}>
                  <option value="above">Si taux dépasse</option>
                  <option value="below">Si taux tombe sous</option>
                </select>
                <input className="japan-input" type="number" placeholder="Ex : 165" value={newThreshold} onChange={e => setNewThreshold(e.target.value)} />
                <input className="japan-input flex" placeholder="Label (optionnel)" value={newLabel} onChange={e => setNewLabel(e.target.value)} />
                <button className="perso-add-btn" onClick={addAlert}><Plus size={13} /> Ajouter</button>
              </div>
            </div>
          </>
        )}

        {/* ── CONVERTIR ── */}
        {tab === 'convertir' && (
          <div className="perso-card">
            <div className="perso-card-header">
              <h3 className="perso-card-title">Calculateur de conversion</h3>
              <span className="mono" style={{ color: '#f5c842', fontWeight: 700 }}>1 € = {currentRate} ¥</span>
            </div>
            <div className="japan-calc">
              <div className="japan-calc-field">
                <label>{direction === 'eur_to_jpy' ? 'Euros (€)' : 'Yens (¥)'}</label>
                <div className="japan-calc-input-wrap">
                  <span className="japan-calc-currency">{direction === 'eur_to_jpy' ? '€' : '¥'}</span>
                  <input
                    className="japan-calc-input"
                    type="number"
                    placeholder="0"
                    value={direction === 'eur_to_jpy' ? calcEur : calcJpy}
                    onChange={e => handleCalc(e.target.value, direction)}
                  />
                </div>
              </div>

              <button className="japan-swap-btn" onClick={swapDirection}>
                <ArrowRightLeft size={18} />
              </button>

              <div className="japan-calc-field">
                <label>{direction === 'eur_to_jpy' ? 'Yens (¥)' : 'Euros (€)'}</label>
                <div className="japan-calc-input-wrap result">
                  <span className="japan-calc-currency">{direction === 'eur_to_jpy' ? '¥' : '€'}</span>
                  <input
                    className="japan-calc-input"
                    type="number"
                    placeholder="0"
                    value={direction === 'eur_to_jpy' ? calcJpy : calcEur}
                    onChange={e => handleCalc(e.target.value, direction === 'eur_to_jpy' ? 'jpy_to_eur' : 'eur_to_jpy')}
                    readOnly={direction === 'eur_to_jpy'}
                  />
                </div>
              </div>
            </div>

            {/* Tableau de conversion rapide */}
            <div className="japan-quick-convert">
              <p className="perso-card-title" style={{ marginBottom: 12 }}>Conversions rapides</p>
              <table className="perso-table">
                <thead><tr><th>Euros</th><th>Yens (taux actuel {currentRate})</th><th>Yens (taux 160)</th><th>Écart</th></tr></thead>
                <tbody>
                  {[500, 1000, 2000, 5000, 10000, 20000, 50000].map(eur => {
                    const jpy = Math.round(eur * currentRate);
                    const jpy160 = Math.round(eur * 160);
                    const diff = jpy - jpy160;
                    return (
                      <tr key={eur} className="perso-table-row">
                        <td className="mono">{eur.toLocaleString('fr-FR')} €</td>
                        <td className="mono" style={{ color: '#f5c842', fontWeight: 600 }}>{jpy.toLocaleString('fr-FR')} ¥</td>
                        <td className="mono" style={{ color: 'var(--text-muted)' }}>{jpy160.toLocaleString('fr-FR')} ¥</td>
                        <td className="mono" style={{ color: diff >= 0 ? 'var(--green)' : 'var(--red)' }}>
                          {diff >= 0 ? '+' : ''}{diff.toLocaleString('fr-FR')} ¥
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── VIREMENTS ── */}
        {tab === 'virements' && (
          <div className="perso-card">
            <div className="perso-card-header">
              <h3 className="perso-card-title">Historique des virements</h3>
              <button className="perso-add-btn"><Plus size={13} /> Nouveau virement</button>
            </div>
            <table className="perso-table">
              <thead><tr><th>Date</th><th>Montant (€)</th><th>Taux</th><th>Reçu (¥)</th><th>Méthode</th><th>Note</th></tr></thead>
              <tbody>
                {[...transfers].sort((a, b) => new Date(b.date) - new Date(a.date)).map(t => {
                  const adv = getTimingAdvice(t.rate);
                  return (
                    <tr key={t.id} className="perso-table-row">
                      <td className="mono">{t.date}</td>
                      <td className="mono" style={{ fontWeight: 700 }}>{t.amountEur.toLocaleString('fr-FR')} €</td>
                      <td className="mono" style={{ color: adv.color }}>{t.rate} {adv.icon}</td>
                      <td className="mono" style={{ color: '#f5c842' }}>{t.amountJpy.toLocaleString('fr-FR')} ¥</td>
                      <td><span className="japan-method-badge">{t.method}</span></td>
                      <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{t.note}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="japan-transfer-total">
              <span>Total envoyé</span>
              <span className="mono" style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
                {transfers.reduce((s, t) => s + t.amountEur, 0).toLocaleString('fr-FR')} €
              </span>
              <span className="mono" style={{ color: '#f5c842', fontWeight: 700 }}>
                {transfers.reduce((s, t) => s + t.amountJpy, 0).toLocaleString('fr-FR')} ¥
              </span>
            </div>
          </div>
        )}

        {/* ── IMPACT LOYERS ── */}
        {tab === 'impact' && (
          <>
            <div className="japan-kpis">
              {[
                { label: 'Total loyers (¥)',  value: `${(totalJpy/1000).toFixed(0)}k ¥`,  color: '#f5c842' },
                { label: 'Total loyers (€)',  value: `${totalEur.toLocaleString('fr-FR')} €`, color: 'var(--green)' },
                { label: 'Taux moyen appliqué', value: avgRate, color: 'var(--text-secondary)' },
                { label: 'Meilleur mois (€)', value: `${bestMonth.month} — ${bestMonth.eurRevenue.toLocaleString('fr-FR')} €`, color: 'var(--green)' },
                { label: 'Pire mois (€)',     value: `${worstMonth.month} — ${worstMonth.eurRevenue.toLocaleString('fr-FR')} €`, color: 'var(--red)' },
                { label: 'Impact taux vs 163', value: `${lostToRate >= 0 ? '-' : '+'}${Math.abs(lostToRate).toLocaleString('fr-FR')} €`, color: lostToRate >= 0 ? 'var(--red)' : 'var(--green)' },
              ].map(({ label, value, color }) => (
                <div key={label} className="japan-kpi">
                  <p className="japan-kpi-val mono" style={{ color }}>{value}</p>
                  <p className="japan-kpi-label">{label}</p>
                </div>
              ))}
            </div>

            <div className="perso-card">
              <div className="perso-card-header">
                <h3 className="perso-card-title">Loyers en € vs ¥ par mois</h3>
                <p className="perso-card-sub">Impact visible du taux de change sur votre revenu réel</p>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <ComposedChart data={rentalEurImpact} margin={{ top: 5, right: 10, bottom: 0, left: -10 }}>
                  <CartesianGrid stroke="#1e2740" strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: '#4a5470', fontSize: 11, fontFamily: 'Syne' }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="jpy" tick={{ fill: '#4a5470', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v/1000}k¥`} />
                  <YAxis yAxisId="eur" orientation="right" tick={{ fill: '#4a5470', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}€`} />
                  <Tooltip content={<Tip />} />
                  <Bar yAxisId="jpy" dataKey="jpyRevenue" name="Loyers (¥)" fill="#f5c842" opacity={0.4} radius={[2,2,0,0]} />
                  <Line yAxisId="eur" type="monotone" dataKey="eurRevenue" name="Loyers (€)" stroke="#2dd4a0" strokeWidth={2.5} dot={{ fill: '#2dd4a0', r: 4 }} />
                  <Line yAxisId="jpy" type="monotone" dataKey="rate" name="Taux EUR/JPY" stroke="#fb923c" strokeWidth={1.5} strokeDasharray="4 3" dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

      </div>
    </div>
  );
}