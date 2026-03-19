import React, { useState } from 'react';
import {
  Users, Key, Mail, Phone, AlertTriangle,
  CheckCircle2, Clock, Calendar, Plus,
  TrendingUp, ArrowUpRight, RefreshCw
} from 'lucide-react';
import Topbar from '../components/layout/Topbar';
import { tenants, properties } from '../data/mockDataImmo';
import './Immo.css';

function daysUntil(dateStr) {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr) - new Date()) / 86400000);
}

function occupancyRate(tenant) {
  if (!tenant.leaseStart || !tenant.leaseEnd) return null;
  const total   = new Date(tenant.leaseEnd) - new Date(tenant.leaseStart);
  const elapsed = new Date() - new Date(tenant.leaseStart);
  return Math.min(100, Math.round((elapsed / total) * 100));
}

export default function ImmoTenants() {
  const [selected, setSelected] = useState(null);
  const today = new Date().toISOString().slice(0, 10);

  // KPIs
  const activeTenants  = tenants.filter(t => t.status === 'active');
  const totalMRR       = tenants.reduce((s, t) => s + t.monthlyRent, 0);
  const totalDeposits  = tenants.reduce((s, t) => s + t.deposit + t.keyMoney, 0);
  const latePayments   = tenants.flatMap(t => t.paymentHistory.filter(p => p.status === 'late'));
  const expiringLeases = tenants.filter(t => {
    const d = daysUntil(t.leaseEnd);
    return d !== null && d <= 90 && d > 0;
  });

  const sel = selected ? tenants.find(t => t.id === selected) : null;
  const selProp = sel ? properties.find(p => p.id === sel.propertyId) : null;

  return (
    <div className="page">
      <Topbar title="Locataires & Baux" subtitle={`${activeTenants.length} baux actifs · ${totalMRR.toLocaleString('fr-FR')} ¥/mois`} />
      <div className="page-content">

        {/* ── KPIs ── */}
        <div className="immo-kpis stagger">
          {[
            { icon: Users,        label: 'Locataires actifs',  value: activeTenants.length,                                 color: '#3d7fff', sub: `Sur ${properties.length} biens` },
            { icon: TrendingUp,   label: 'Revenus locatifs',   value: `${totalMRR.toLocaleString('fr-FR')} ¥/mois`,          color: '#2dd4a0', sub: `${(totalMRR * 12 / 1000000).toFixed(1)}M ¥/an` },
            { icon: Key,          label: 'Cautions + Key money',value: `${(totalDeposits / 1000000).toFixed(1)}M ¥`,         color: '#a78bfa', sub: 'Fonds déposés' },
            { icon: AlertTriangle,label: 'Paiements en retard', value: latePayments.length,                                  color: latePayments.length > 0 ? 'var(--red)' : 'var(--green)', sub: latePayments.length > 0 ? 'Sur l\'historique' : 'Aucun retard' },
            { icon: RefreshCw,    label: 'Baux à renouveler',  value: expiringLeases.length,                                 color: expiringLeases.length > 0 ? 'var(--yellow)' : 'var(--green)', sub: 'Dans les 90 jours' },
            { icon: Calendar,     label: 'Durée moy. bail',    value: '18 mois',                                             color: '#8892aa', sub: 'Tous locataires' },
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

        {/* ── Alertes baux expirants ── */}
        {expiringLeases.length > 0 && (
          <div className="immo-maint-banner" style={{ borderColor: 'rgba(245,200,66,0.35)', background: 'rgba(245,200,66,0.06)' }}>
            <div className="immo-maint-banner-title" style={{ color: 'var(--yellow)' }}>
              <Calendar size={14} /> <strong>{expiringLeases.length} bail{expiringLeases.length > 1 ? 's' : ''}</strong> à renouveler dans les 90 jours
            </div>
            <div className="immo-maint-items">
              {expiringLeases.map(t => {
                const prop = properties.find(p => p.id === t.propertyId);
                const d = daysUntil(t.leaseEnd);
                return (
                  <div key={t.id} className="immo-maint-item">
                    <span style={{ fontSize: 18 }}>🔑</span>
                    <div>
                      <p className="immo-maint-title">{t.name}</p>
                      <p className="immo-maint-prop">{prop?.name}</p>
                    </div>
                    <span className="mono immo-maint-date" style={{ color: d <= 30 ? 'var(--red)' : 'var(--yellow)' }}>
                      Expire {t.leaseEnd} (J-{d})
                    </span>
                    <span className="mono">{t.monthlyRent.toLocaleString('fr-FR')} ¥/mois</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Layout locataires ── */}
        <div className={`immo-tenant-layout ${sel ? 'with-detail' : ''}`}>

          {/* Liste locataires */}
          <div className="immo-tenant-list">
            {tenants.map(t => {
              const prop     = properties.find(p => p.id === t.propertyId);
              const daysEnd  = daysUntil(t.leaseEnd);
              const occ      = occupancyRate(t);
              const paid     = t.paymentHistory.filter(p => p.status === 'paid').length;
              const late     = t.paymentHistory.filter(p => p.status === 'late').length;
              const score    = Math.round((paid / t.paymentHistory.length) * 100);
              const isExpi   = daysEnd !== null && daysEnd <= 90;

              return (
                <div
                  key={t.id}
                  className={`immo-tenant-card ${selected === t.id ? 'selected' : ''}`}
                  onClick={() => setSelected(selected === t.id ? null : t.id)}
                  style={{ borderLeftColor: prop?.color || 'var(--border-dim)' }}
                >
                  {/* Header */}
                  <div className="itc-header">
                    <div className="itc-avatar" style={{ background: (prop?.color || '#3d7fff') + '22', color: prop?.color || '#3d7fff' }}>
                      {t.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="itc-info">
                      <p className="itc-name">{t.name}</p>
                      <p className="itc-prop" style={{ color: prop?.color }}>{prop?.name}</p>
                      <p className="itc-nationality">{t.nationality}</p>
                    </div>
                    <div className="itc-right">
                      <p className="mono itc-rent">{t.monthlyRent.toLocaleString('fr-FR')} ¥</p>
                      <p className="itc-rent-label">/ mois</p>
                      {isExpi && (
                        <span className="itc-expiry-badge">⚠ J-{daysEnd}</span>
                      )}
                    </div>
                  </div>

                  {/* Bail */}
                  <div className="itc-lease">
                    <div className="itc-lease-dates">
                      <Calendar size={11} />
                      <span className="mono">{t.leaseStart}</span>
                      {t.leaseEnd && <><span>→</span><span className="mono">{t.leaseEnd}</span></>}
                      {!t.leaseEnd && <span style={{ color: 'var(--accent-bright)' }}>Sans terme (Airbnb)</span>}
                    </div>
                    {occ !== null && (
                      <div className="itc-bail-progress">
                        <div className="itc-bail-bar">
                          <div className="itc-bail-fill" style={{ width: `${occ}%`, background: prop?.color || 'var(--accent)' }} />
                        </div>
                        <span className="mono">{occ}%</span>
                      </div>
                    )}
                  </div>

                  {/* Score paiement */}
                  <div className="itc-payment-score">
                    <div className="itc-score-bar">
                      <div className="itc-score-fill" style={{ width: `${score}%`, background: score >= 90 ? 'var(--green)' : score >= 70 ? 'var(--yellow)' : 'var(--red)' }} />
                    </div>
                    <span className="mono" style={{ color: score >= 90 ? 'var(--green)' : score >= 70 ? 'var(--yellow)' : 'var(--red)' }}>
                      {score}% à temps
                    </span>
                    {late > 0 && <span className="itc-late-badge">{late} retard{late > 1 ? 's' : ''}</span>}
                  </div>
                </div>
              );
            })}

            <button className="immo-add-btn" style={{ marginTop: 8 }}>
              <Plus size={14} /> Ajouter un locataire
            </button>
          </div>

          {/* Détail locataire */}
          {sel && selProp && (
            <div className="immo-tenant-detail fade-in">
              {/* Header */}
              <div className="itd-header" style={{ borderColor: selProp.color + '55' }}>
                <div className="itd-avatar" style={{ background: selProp.color + '22', color: selProp.color }}>
                  {sel.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="itd-name">{sel.name}</p>
                  <p className="itd-prop" style={{ color: selProp.color }}>{selProp.name}</p>
                  <p className="itd-nationality">{sel.nationality}</p>
                </div>
              </div>

              {/* Contacts */}
              <div className="itd-contacts">
                {sel.email && <a href={`mailto:${sel.email}`} className="immo-contact-link"><Mail size={13} /> {sel.email}</a>}
                {sel.phone && <a href={`tel:${sel.phone}`} className="immo-contact-link"><Phone size={13} /> {sel.phone}</a>}
              </div>

              {/* Bail */}
              <div className="itd-section-title">Bail & Financier</div>
              <div className="immo-info-rows">
                {[
                  ['Début',        sel.leaseStart],
                  ['Fin',          sel.leaseEnd || 'Sans terme'],
                  ['Loyer',        `${sel.monthlyRent.toLocaleString('fr-FR')} ¥/mois`],
                  ['Caution',      `${sel.deposit.toLocaleString('fr-FR')} ¥`],
                  ['Key money',    `${sel.keyMoney.toLocaleString('fr-FR')} ¥`],
                  ['Paiement le',  sel.paymentDay ? `Le ${sel.paymentDay} du mois` : 'Variable'],
                ].map(([k, v]) => (
                  <div key={k} className="immo-info-row">
                    <span>{k}</span>
                    <span className="immo-info-val mono">{v}</span>
                  </div>
                ))}
              </div>

              {/* Historique paiements */}
              <div className="itd-section-title">Historique paiements</div>
              <div className="immo-payments-list">
                {sel.paymentHistory.map((p, i) => (
                  <div key={i} className="immo-payment-row">
                    <span className="mono immo-payment-month">{p.month}</span>
                    <span className="mono">{p.amount.toLocaleString('fr-FR')} ¥</span>
                    <span className="mono immo-payment-date">{p.date}</span>
                    <span className="immo-payment-badge" style={{
                      color: p.status === 'paid' ? 'var(--green)' : 'var(--red)',
                      background: p.status === 'paid' ? 'var(--green-dim)' : 'var(--red-dim)',
                    }}>
                      {p.status === 'paid' ? '✓ Payé' : '⚠ Retard'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Notes */}
              {sel.notes && (
                <div className="immo-tenant-notes" style={{ marginTop: 12 }}>
                  {sel.notes}
                </div>
              )}

              <button className="immo-close-detail-btn" onClick={() => setSelected(null)}>Fermer</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}