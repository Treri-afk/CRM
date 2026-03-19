import React, { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, ComposedChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import {
  DollarSign, TrendingUp, TrendingDown, PieChart,
  FileText, AlertTriangle, CheckCircle2, Calendar,
  Percent, ArrowUpRight
} from 'lucide-react';
import Topbar from '../components/layout/Topbar';
import {
  properties, tenants, repairs,
  rentalRevenue, revenueForecast, propertyCharges, fiscalData
} from '../data/mockDataImmo';
import './Immo.css';

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || p.fill || p.stroke }} className="chart-tooltip-value">
          {p.name} : {typeof p.value === 'number' ? `${p.value.toLocaleString('fr-FR')} ¥` : p.value}
        </p>
      ))}
    </div>
  );
};

function getMonthlyCharges(propertyId) {
  return propertyCharges
    .filter(c => c.propertyId === propertyId)
    .reduce((s, c) => s + (c.frequency === 'monthly' ? c.amount : c.amount / 12), 0);
}

function getAnnualCharges(propertyId) {
  return propertyCharges
    .filter(c => c.propertyId === propertyId)
    .reduce((s, c) => s + (c.frequency === 'monthly' ? c.amount * 12 : c.amount), 0);
}

export default function ImmoFinances() {
  const [period, setPeriod] = useState('7m');

  // ─── Calculs globaux ─────────────────────────────────────────────────────
  const totalAnnualRevenue  = rentalRevenue[rentalRevenue.length - 1].total * 12 / 7 * 12;
  const lastMonthRevenue    = rentalRevenue[rentalRevenue.length - 1].total;
  const totalAnnualCharges  = properties.reduce((s, p) => s + getAnnualCharges(p.id), 0);
  const totalRepairCosts    = repairs.filter(r => r.realCost).reduce((s, r) => s + r.realCost, 0);
  const netAnnualRevenue    = rentalRevenue.reduce((s, m) => s + m.total, 0)
                             - (totalAnnualCharges / 12 * 7)
                             - totalRepairCosts;
  const totalPatrimony      = properties.reduce((s, p) => s + p.currentValue, 0);
  const totalPurchase       = properties.reduce((s, p) => s + p.purchasePrice, 0);
  const totalPlusValue      = totalPatrimony - totalPurchase;
  const grossYieldPortfolio = ((lastMonthRevenue * 12) / totalPatrimony * 100).toFixed(2);

  // ─── Revenu net par bien ──────────────────────────────────────────────────
  const propertyPnL = properties.map(p => {
    const tenant       = tenants.find(t => t.propertyId === p.id);
    const annualRev    = (tenant?.monthlyRent || 0) * 12;
    const annualCh     = getAnnualCharges(p.id);
    const repairCosts  = repairs.filter(r => r.propertyId === p.id && r.realCost).reduce((s, r) => s + r.realCost, 0);
    const netRev       = annualRev - annualCh - repairCosts;
    const grossYield   = annualRev > 0 ? ((annualRev / p.currentValue) * 100).toFixed(2) : '0.00';
    const netYield     = annualRev > 0 ? ((netRev / p.currentValue) * 100).toFixed(2) : '0.00';
    const plusValue    = p.currentValue - p.purchasePrice;
    const plusPct      = ((plusValue / p.purchasePrice) * 100).toFixed(1);
    return {
      id: p.id, name: p.name, city: p.city, color: p.color,
      annualRev, annualCh, repairCosts, netRev,
      grossYield, netYield, plusValue, plusPct,
      currentValue: p.currentValue, purchasePrice: p.purchasePrice,
    };
  });

  // ─── Données graphe revenus vs charges ───────────────────────────────────
  const revenueVsCharges = rentalRevenue.map(m => ({
    month: m.month,
    Revenus: m.total,
    Charges: Math.round(totalAnnualCharges / 12),
    Net: m.total - Math.round(totalAnnualCharges / 12),
  }));

  // ─── Données complètes avec prévisions ───────────────────────────────────
  const fullData = [
    ...revenueVsCharges.map(d => ({ ...d, type: 'actual' })),
    ...revenueForecast.map(f => ({
      month: f.month,
      Revenus: f.total,
      Charges: Math.round(totalAnnualCharges / 12),
      Net: f.total - Math.round(totalAnnualCharges / 12),
      type: 'forecast',
    })),
  ];

  // ─── Répartition charges ─────────────────────────────────────────────────
  const chargeTypes = ['gestion', 'taxe', 'assurance', 'copro', 'entretien'];
  const chargeBreakdown = chargeTypes.map(type => ({
    type,
    label: type === 'gestion' ? 'Gestion' : type === 'taxe' ? 'Taxes' : type === 'assurance' ? 'Assurance' : type === 'copro' ? 'Copropriété' : 'Entretien',
    amount: propertyCharges
      .filter(c => c.type === type)
      .reduce((s, c) => s + (c.frequency === 'monthly' ? c.amount * 12 : c.amount), 0),
    color: ['#3d7fff', '#f5c842', '#a78bfa', '#2dd4a0', '#fb923c'][chargeTypes.indexOf(type)],
  })).filter(c => c.amount > 0);

  // ─── Plus-values par bien ─────────────────────────────────────────────────
  const plusValueChart = properties.map(p => ({
    name: p.city,
    achat: p.purchasePrice / 1000000,
    plusvalue: (p.currentValue - p.purchasePrice) / 1000000,
    color: p.color,
  }));

  return (
    <div className="page">
      <Topbar title="Finances Immobilier" subtitle="Revenus, charges, rendements et fiscalité" />
      <div className="page-content">

        {/* ── KPIs ── */}
        <div className="immo-kpis stagger">
          {[
            { icon: DollarSign,   label: 'Revenus ce mois',    value: `${lastMonthRevenue.toLocaleString('fr-FR')} ¥`,      color: '#2dd4a0', sub: `ARR ~${(lastMonthRevenue * 12 / 1000000).toFixed(1)}M ¥` },
            { icon: TrendingDown, label: 'Charges mensuelles', value: `${(totalAnnualCharges / 12).toLocaleString('fr-FR', { maximumFractionDigits: 0 })} ¥`, color: '#ff4d6a', sub: `${(totalAnnualCharges / 1000000).toFixed(1)}M ¥/an` },
            { icon: CheckCircle2, label: 'Revenu net (7 mois)',value: `${(netAnnualRevenue / 1000000).toFixed(2)}M ¥`,       color: '#3d7fff', sub: 'Après charges & travaux' },
            { icon: Percent,      label: 'Rendement brut moy.',value: `${grossYieldPortfolio}%`,                             color: '#a78bfa', sub: 'Sur patrimoine total' },
            { icon: TrendingUp,   label: 'Plus-value latente', value: `+${(totalPlusValue / 1000000).toFixed(1)}M ¥`,        color: '#f5c842', sub: `+${((totalPlusValue / totalPurchase) * 100).toFixed(1)}%` },
            { icon: FileText,     label: 'Impôt estimé',       value: `${(fiscalData.taxDue / 1000000).toFixed(2)}M ¥`,     color: '#ff4d6a', sub: `Taux ${fiscalData.taxRate}% (non-résident)` },
          ].map(({ icon: Icon, label, value, color, sub }) => (
            <div key={label} className="immo-kpi">
              <div className="immo-kpi-icon" style={{ background: color + '18', color }}><Icon size={15} strokeWidth={1.8} /></div>
              <div>
                <p className="immo-kpi-val mono">{value}</p>
                <p className="immo-kpi-label">{label}</p>
                <p className="immo-kpi-sub">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Revenus vs Charges ── */}
        <div className="immo-card">
          <div className="immo-card-header">
            <div>
              <h3 className="immo-card-title">Revenus vs Charges — + Prévisions</h3>
              <p className="immo-card-sub">Historique 7 mois + 3 mois de prévisions</p>
            </div>
            <div className="immo-legend">
              {[['Revenus','#2dd4a0'],['Charges','#ff4d6a'],['Net','#3d7fff']].map(([n,c]) => (
                <span key={n}><span className="immo-dot" style={{ background: c }} />{n}</span>
              ))}
              <span style={{ color: 'var(--text-muted)', fontSize: 11, marginLeft: 8 }}>--- Prévisions</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart data={fullData} margin={{ top: 5, right: 10, bottom: 0, left: -10 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2dd4a0" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#2dd4a0" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3d7fff" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="#3d7fff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#1e2740" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#4a5470', fontSize: 11, fontFamily: 'Syne' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#4a5470', fontSize: 10, fontFamily: 'Syne' }} axisLine={false} tickLine={false} tickFormatter={v => `${v/1000}k`} />
              <Tooltip content={<Tip />} />
              <Area type="monotone" dataKey="Revenus" stroke="#2dd4a0" strokeWidth={2.5} fill="url(#revGrad)" dot={false} />
              <Area type="monotone" dataKey="Net"     stroke="#3d7fff" strokeWidth={2}   fill="url(#netGrad)"  dot={false} strokeDasharray={(d) => d.type === 'forecast' ? '6 3' : undefined} />
              <Line  type="monotone" dataKey="Charges" stroke="#ff4d6a" strokeWidth={1.5} strokeDasharray="4 3" dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* ── Rendement & plus-value par bien ── */}
        <div className="immo-charts-row">
          <div className="immo-card wide">
            <div className="immo-card-header">
              <h3 className="immo-card-title">Rendement par bien</h3>
              <p className="immo-card-sub">Brut vs Net</p>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart
                data={propertyPnL.filter(p => Number(p.grossYield) > 0)}
                margin={{ top: 5, right: 10, bottom: 0, left: -10 }}
              >
                <CartesianGrid stroke="#1e2740" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="city" tick={{ fill: '#4a5470', fontSize: 11, fontFamily: 'Syne' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#4a5470', fontSize: 10, fontFamily: 'Syne' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                <Tooltip formatter={(v) => `${Number(v).toFixed(2)}%`} contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-soft)', borderRadius: 8 }} />
                <Bar dataKey="grossYield" name="Rdt brut" radius={[3,3,0,0]}>
                  {propertyPnL.filter(p => Number(p.grossYield) > 0).map(p => <Cell key={p.id} fill={p.color} opacity={0.5} />)}
                </Bar>
                <Bar dataKey="netYield"   name="Rdt net"  radius={[3,3,0,0]}>
                  {propertyPnL.filter(p => Number(p.grossYield) > 0).map(p => <Cell key={p.id} fill={p.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Répartition charges */}
          <div className="immo-card">
            <div className="immo-card-header">
              <h3 className="immo-card-title">Répartition des charges</h3>
              <p className="immo-card-sub">Annualisées</p>
            </div>
            <div className="immo-charge-list">
              {chargeBreakdown.map(c => (
                <div key={c.type} className="immo-charge-row">
                  <div className="immo-charge-dot" style={{ background: c.color }} />
                  <span className="immo-charge-label">{c.label}</span>
                  <div className="immo-charge-bar-wrap">
                    <div className="immo-charge-bar" style={{ width: `${(c.amount / chargeBreakdown[0].amount) * 100}%`, background: c.color }} />
                  </div>
                  <span className="mono immo-charge-amount">{(c.amount / 1000).toFixed(0)}k ¥</span>
                  <span className="mono immo-charge-pct">{((c.amount / totalAnnualCharges) * 100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Plus-values ── */}
        <div className="immo-card">
          <div className="immo-card-header">
            <h3 className="immo-card-title">Plus-values latentes par bien</h3>
            <p className="immo-card-sub">Prix d'achat vs valeur actuelle (M ¥)</p>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={plusValueChart} margin={{ top: 5, right: 10, bottom: 0, left: -10 }}>
              <CartesianGrid stroke="#1e2740" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#4a5470', fontSize: 11, fontFamily: 'Syne' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#4a5470', fontSize: 10, fontFamily: 'Syne' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}M`} />
              <Tooltip formatter={(v) => `${Number(v).toFixed(1)}M ¥`} contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-soft)', borderRadius: 8 }} />
              <Bar dataKey="achat"     name="Prix achat"  stackId="a" fill="#4a5470" opacity={0.6} />
              <Bar dataKey="plusvalue" name="Plus-value"  stackId="a" radius={[3,3,0,0]}>
                {plusValueChart.map(p => <Cell key={p.name} fill={p.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ── Tableau P&L par bien ── */}
        <div className="immo-card">
          <div className="immo-card-header">
            <h3 className="immo-card-title">P&L par bien — Annuel</h3>
            <p className="immo-card-sub">Revenus, charges et rentabilité</p>
          </div>
          <table className="immo-table">
            <thead>
              <tr>
                <th>Bien</th>
                <th>Revenu brut/an</th>
                <th>Charges/an</th>
                <th>Travaux</th>
                <th>Revenu net</th>
                <th>Rdt brut</th>
                <th>Rdt net</th>
                <th>Plus-value</th>
              </tr>
            </thead>
            <tbody>
              {propertyPnL.map(p => (
                <tr key={p.id} className="immo-table-row">
                  <td>
                    <div className="immo-table-name-cell">
                      <div className="immo-table-dot" style={{ background: p.color }} />
                      <span>{p.name}</span>
                    </div>
                  </td>
                  <td className="mono" style={{ color: 'var(--green)' }}>+{p.annualRev.toLocaleString('fr-FR')} ¥</td>
                  <td className="mono" style={{ color: 'var(--red)' }}>-{p.annualCh.toLocaleString('fr-FR')} ¥</td>
                  <td className="mono" style={{ color: p.repairCosts > 0 ? 'var(--red)' : 'var(--text-muted)' }}>
                    {p.repairCosts > 0 ? `-${p.repairCosts.toLocaleString('fr-FR')} ¥` : '—'}
                  </td>
                  <td className="mono" style={{ fontWeight: 700, color: p.netRev >= 0 ? 'var(--green)' : 'var(--red)' }}>
                    {p.netRev >= 0 ? '+' : ''}{p.netRev.toLocaleString('fr-FR')} ¥
                  </td>
                  <td className="mono">{p.grossYield}%</td>
                  <td className="mono" style={{ color: Number(p.netYield) >= 3 ? 'var(--green)' : 'var(--yellow)' }}>{p.netYield}%</td>
                  <td className="mono" style={{ color: 'var(--green)' }}>+{p.plusPct}%</td>
                </tr>
              ))}
              {/* Totaux */}
              <tr className="immo-table-total">
                <td><strong>Total</strong></td>
                <td className="mono" style={{ color: 'var(--green)', fontWeight: 700 }}>+{propertyPnL.reduce((s, p) => s + p.annualRev, 0).toLocaleString('fr-FR')} ¥</td>
                <td className="mono" style={{ color: 'var(--red)', fontWeight: 700 }}>-{propertyPnL.reduce((s, p) => s + p.annualCh, 0).toLocaleString('fr-FR')} ¥</td>
                <td className="mono" style={{ color: 'var(--red)', fontWeight: 700 }}>-{totalRepairCosts.toLocaleString('fr-FR')} ¥</td>
                <td className="mono" style={{ fontWeight: 700, color: 'var(--green)' }}>+{propertyPnL.reduce((s, p) => s + p.netRev, 0).toLocaleString('fr-FR')} ¥</td>
                <td className="mono" style={{ fontWeight: 700 }}>{grossYieldPortfolio}%</td>
                <td className="mono" style={{ fontWeight: 700, color: 'var(--green)' }}>
                  {((propertyPnL.reduce((s, p) => s + p.netRev, 0) / totalPatrimony) * 100).toFixed(2)}%
                </td>
                <td className="mono" style={{ color: 'var(--green)', fontWeight: 700 }}>
                  +{((totalPlusValue / totalPurchase) * 100).toFixed(1)}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ── Synthèse fiscale Japon ── */}
        <div className="immo-fiscal-section">
          <div className="immo-section-header">
            <div>
              <h3 className="immo-section-title">Synthèse Fiscale Japon {fiscalData.year}</h3>
              <p className="immo-section-sub">Convention FR-JP · Statut non-résident fiscal japonais</p>
            </div>
            <div className="immo-fiscal-badge">
              <Calendar size={13} />
              <span>Prochaine déclaration : <strong className="mono">{fiscalData.nextDeclaration}</strong></span>
            </div>
          </div>

          <div className="immo-fiscal-grid">
            {/* Revenus */}
            <div className="immo-card">
              <div className="immo-card-header"><h3 className="immo-card-title">Revenus fonciers bruts</h3></div>
              <p className="immo-fiscal-big mono">{fiscalData.grossIncome.toLocaleString('fr-FR')} ¥</p>
              <p className="immo-fiscal-sub">Ensemble des loyers perçus — exercice {fiscalData.year}</p>
            </div>

            {/* Charges déductibles */}
            <div className="immo-card">
              <div className="immo-card-header"><h3 className="immo-card-title">Charges déductibles</h3></div>
              <div className="immo-info-rows">
                {[
                  ['Frais de gestion',   fiscalData.deductibleCharges.management],
                  ['Taxes foncières',    fiscalData.deductibleCharges.tax],
                  ['Assurances',         fiscalData.deductibleCharges.insurance],
                  ['Travaux déductibles',fiscalData.deductibleCharges.repairs],
                  ['Amortissement',      fiscalData.deductibleCharges.depreciation],
                  ['Divers',             fiscalData.deductibleCharges.other],
                ].map(([k, v]) => (
                  <div key={k} className="immo-info-row">
                    <span>{k}</span>
                    <span className="mono immo-info-val" style={{ color: 'var(--red)' }}>-{v.toLocaleString('fr-FR')} ¥</span>
                  </div>
                ))}
                <div className="immo-info-row" style={{ fontWeight: 700, borderTop: '2px solid var(--border-soft)', paddingTop: 10, marginTop: 4 }}>
                  <span>Total déductible</span>
                  <span className="mono" style={{ color: 'var(--red)', fontWeight: 700 }}>
                    -{Object.values(fiscalData.deductibleCharges).reduce((s, v) => s + v, 0).toLocaleString('fr-FR')} ¥
                  </span>
                </div>
              </div>
            </div>

            {/* Impôt */}
            <div className="immo-card">
              <div className="immo-card-header"><h3 className="immo-card-title">Calcul d'impôt</h3></div>
              <div className="immo-info-rows">
                {[
                  ['Revenu foncier net imposable', fiscalData.netTaxableIncome, '#text-primary'],
                  ['Taux IR (non-résident JP)',    `${fiscalData.taxRate}%`,     'var(--text-secondary)'],
                  ['Impôt estimé',                 fiscalData.taxDue,            'var(--red)'],
                  ['Retenue à la source',          fiscalData.withholdingTax,    'var(--yellow)'],
                  ['Reste à payer',                fiscalData.taxDue - fiscalData.withholdingTax, 'var(--red)'],
                ].map(([k, v, color]) => (
                  <div key={k} className="immo-info-row">
                    <span>{k}</span>
                    <span className="mono immo-info-val" style={{ color, fontWeight: typeof v === 'number' ? 600 : 400 }}>
                      {typeof v === 'number' ? `${v.toLocaleString('fr-FR')} ¥` : v}
                    </span>
                  </div>
                ))}
              </div>
              <div className="immo-fiscal-note">
                <AlertTriangle size={12} />
                Convention fiscale {fiscalData.taxTreaty} — prévoir déclaration Noto en France (revenus étrangers).
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}