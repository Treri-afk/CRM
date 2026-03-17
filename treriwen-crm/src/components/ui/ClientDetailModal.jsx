import React, { useState } from 'react';
import {
  X, Mail, Phone, Globe, MapPin, Building2,
  TrendingUp, FileText, Receipt, CheckSquare,
  DollarSign, Calendar, Clock, RefreshCw,
  ArrowUpRight, MoreHorizontal, Plus, Star,
  AlertTriangle, CheckCircle2, Activity
} from 'lucide-react';
import Badge from './Badge';
import { deals, tasks } from '../../data/mockData';
import { devis as devisData } from '../../data/mockDataExtra';
import { factures as facturesData } from '../../data/mockDataExtra';
import { abonnements } from '../../data/mockDataSubs';
import './ClientDetailModal.css';

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
function SectionTitle({ icon: Icon, label, count }) {
  return (
    <div className="cdm-section-title">
      <Icon size={14} strokeWidth={1.8} />
      <span>{label}</span>
      {count !== undefined && <span className="cdm-section-count">{count}</span>}
    </div>
  );
}

function EmptyLine({ label }) {
  return <p className="cdm-empty">{label}</p>;
}

/* ─── Modal ───────────────────────────────────────────────────────────────── */
export default function ClientDetailModal({ client, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!client) return null;

  /* ── Données liées au client ── */
  const clientDeals   = deals.filter(d => d.clientId === client.id);
  const clientTasks   = tasks.filter(t => t.clientId === client.id);
  const clientDevis   = devisData?.filter(d => d.clientId === client.id) || [];
  const clientFactures = facturesData?.filter(f => f.clientId === client.id) || [];
  const clientSubs    = abonnements.filter(s => s.clientId === client.id);

  /* ── Calculs ── */
  const totalDealValue   = clientDeals.reduce((s, d) => s + d.value, 0);
  const wonDeals         = clientDeals.filter(d => d.stage === 'won');
  const openDeals        = clientDeals.filter(d => !['won', 'lost'].includes(d.stage));
  const wonValue         = wonDeals.reduce((s, d) => s + d.value, 0);
  const avgDealValue     = clientDeals.length > 0 ? Math.round(totalDealValue / clientDeals.length) : 0;
  const winRate          = clientDeals.length > 0 ? Math.round((wonDeals.length / clientDeals.length) * 100) : 0;
  const totalFacture     = clientFactures.reduce((s, f) => s + f.items.reduce((ss, i) => ss + i.qty * i.price, 0) * 1.2, 0);
  const totalPaid        = clientFactures.filter(f => f.status === 'paid').reduce((s, f) => s + f.items.reduce((ss, i) => ss + i.qty * i.price, 0) * 1.2, 0);
  const totalUnpaid      = totalFacture - totalPaid;
  const clientMrr        = clientSubs.filter(s => s.status !== 'cancelled').reduce((s, a) => s + a.monthlyCost, 0);
  const pendingTasks     = clientTasks.filter(t => t.status !== 'done');
  const today            = new Date().toISOString().slice(0, 10);
  const overdueTasks     = clientTasks.filter(t => t.dueDate < today && t.status !== 'done');

  const tabs = [
    { id: 'overview',    label: 'Vue d\'ensemble' },
    { id: 'deals',       label: `Deals (${clientDeals.length})` },
    { id: 'documents',   label: `Documents (${clientDevis.length + clientFactures.length})` },
    { id: 'tasks',       label: `Tâches (${clientTasks.length})` },
    { id: 'abonnements', label: `Abonnements (${clientSubs.length})` },
  ];

  const onBackdrop = (e) => { if (e.target === e.currentTarget) onClose(); };

  return (
    <div className="modal-backdrop" onClick={onBackdrop}>
      <div className="cdm-modal fade-in">

        {/* ── Header ── */}
        <div className="cdm-header" style={{ borderBottomColor: client.color + '44' }}>
          <div className="cdm-header-left">
            <div className="cdm-avatar" style={{ background: client.color + '20', color: client.color }}>
              {client.avatar}
            </div>
            <div>
              <div className="cdm-name-row">
                <h2 className="cdm-name">{client.name}</h2>
                <Badge type={client.status} />
                {clientMrr > 0 && (
                  <span className="cdm-mrr-tag">
                    <RefreshCw size={10} /> {clientMrr.toLocaleString('fr-FR')} €/mois
                  </span>
                )}
              </div>
              <div className="cdm-meta-row">
                <span><Building2 size={11} /> {client.industry}</span>
                {client.phone && <span><Phone size={11} /> {client.phone}</span>}
                {client.email && <a href={`mailto:${client.email}`} className="cdm-meta-link"><Mail size={11} /> {client.email}</a>}
                {client.website && <a href={client.website} target="_blank" rel="noopener noreferrer" className="cdm-meta-link"><Globe size={11} /> Site web</a>}
              </div>
            </div>
          </div>
          <div className="cdm-header-actions">
            <a href={`mailto:${client.email}`} className="cdm-action-btn">
              <Mail size={14} /> Email
            </a>
            <button className="cdm-close" onClick={onClose}><X size={16} /></button>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="cdm-tabs">
          {tabs.map(t => (
            <button
              key={t.id}
              className={`cdm-tab ${activeTab === t.id ? 'active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Body ── */}
        <div className="cdm-body">

          {/* ════ VUE D'ENSEMBLE ════ */}
          {activeTab === 'overview' && (
            <div className="cdm-overview">

              {/* KPIs */}
              <div className="cdm-kpis">
                {[
                  { label: 'CA total',         value: `${(totalDealValue / 1000).toFixed(0)}k €`, color: '#3d7fff',  sub: `${wonDeals.length} deals gagnés` },
                  { label: 'Facturé TTC',      value: `${totalFacture.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €`, color: '#2dd4a0', sub: totalUnpaid > 0 ? `${totalUnpaid.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} € impayé` : 'Tout payé' },
                  { label: 'MRR',              value: clientMrr > 0 ? `${clientMrr.toLocaleString('fr-FR')} €` : '—', color: '#a78bfa', sub: clientMrr > 0 ? `ARR ${(clientMrr * 12 / 1000).toFixed(0)}k €` : 'Pas d\'abonnement' },
                  { label: 'Taux de closing',  value: `${winRate}%`,   color: '#f5c842', sub: `${clientDeals.length} deals total` },
                ].map(({ label, value, color, sub }) => (
                  <div key={label} className="cdm-kpi">
                    <p className="cdm-kpi-val mono" style={{ color }}>{value}</p>
                    <p className="cdm-kpi-label">{label}</p>
                    <p className="cdm-kpi-sub">{sub}</p>
                  </div>
                ))}
              </div>

              {/* Alertes */}
              {(overdueTasks.length > 0 || totalUnpaid > 0 || clientSubs.some(s => s.status === 'at_risk')) && (
                <div className="cdm-alerts">
                  {overdueTasks.length > 0 && (
                    <div className="cdm-alert warn">
                      <Clock size={13} />
                      <span>{overdueTasks.length} tâche{overdueTasks.length > 1 ? 's' : ''} en retard</span>
                    </div>
                  )}
                  {totalUnpaid > 0 && (
                    <div className="cdm-alert danger">
                      <AlertTriangle size={13} />
                      <span>{totalUnpaid.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} € de factures impayées</span>
                    </div>
                  )}
                  {clientSubs.some(s => s.status === 'at_risk') && (
                    <div className="cdm-alert warn">
                      <AlertTriangle size={13} />
                      <span>Abonnement à risque détecté</span>
                    </div>
                  )}
                </div>
              )}

              <div className="cdm-overview-cols">
                {/* Infos */}
                <div className="cdm-info-block">
                  <SectionTitle icon={Building2} label="Informations" />
                  <div className="cdm-info-rows">
                    <div className="cdm-info-row"><span>Contact</span><span className="cdm-info-val">{client.contact}</span></div>
                    <div className="cdm-info-row"><span>Secteur</span><span className="cdm-info-val">{client.industry}</span></div>
                    <div className="cdm-info-row"><span>Statut</span><Badge type={client.status} /></div>
                    <div className="cdm-info-row"><span>Dernier contact</span><span className="cdm-info-val mono">{client.lastContact}</span></div>
                    {client.address && <div className="cdm-info-row"><span>Adresse</span><span className="cdm-info-val">{client.address}</span></div>}
                    {client.website && <div className="cdm-info-row"><span>Site web</span><a href={client.website} className="cdm-info-link">{client.website}</a></div>}
                  </div>
                </div>

                {/* Deals rapides */}
                <div className="cdm-info-block">
                  <SectionTitle icon={TrendingUp} label="Deals actifs" count={openDeals.length} />
                  {openDeals.length === 0
                    ? <EmptyLine label="Aucun deal en cours" />
                    : openDeals.slice(0, 3).map(d => (
                      <div key={d.id} className="cdm-mini-deal">
                        <div className="cdm-mini-deal-bar" style={{ background: d.probability >= 70 ? 'var(--green)' : d.probability >= 40 ? 'var(--yellow)' : 'var(--accent)' }} />
                        <div className="cdm-mini-deal-info">
                          <p className="cdm-mini-deal-title">{d.title}</p>
                          <p className="cdm-mini-deal-meta">{d.closeDate}</p>
                        </div>
                        <span className="cdm-mini-deal-value mono">{d.value.toLocaleString('fr-FR')} €</span>
                        <span className="cdm-mini-deal-prob" style={{ color: d.probability >= 70 ? 'var(--green)' : 'var(--yellow)' }}>{d.probability}%</span>
                      </div>
                    ))
                  }
                  {openDeals.length > 3 && <p className="cdm-see-more" onClick={() => setActiveTab('deals')}>+{openDeals.length - 3} autres deals →</p>}
                </div>

                {/* Tâches à venir */}
                <div className="cdm-info-block">
                  <SectionTitle icon={CheckSquare} label="Tâches" count={pendingTasks.length} />
                  {pendingTasks.length === 0
                    ? <EmptyLine label="Aucune tâche en attente" />
                    : pendingTasks.slice(0, 3).map(t => (
                      <div key={t.id} className="cdm-mini-task">
                        <div className={`cdm-mini-task-dot ${t.dueDate < today ? 'overdue' : ''}`} />
                        <div className="cdm-mini-task-info">
                          <p className="cdm-mini-task-title">{t.title}</p>
                          <p className="cdm-mini-task-meta mono">{t.dueDate}</p>
                        </div>
                        <Badge type={t.priority} />
                      </div>
                    ))
                  }
                  {pendingTasks.length > 3 && <p className="cdm-see-more" onClick={() => setActiveTab('tasks')}>+{pendingTasks.length - 3} autres →</p>}
                </div>
              </div>

              {/* Timeline activité */}
              <div className="cdm-timeline">
                <SectionTitle icon={Activity} label="Activité récente" />
                <div className="cdm-timeline-list">
                  {[
                    ...clientDeals.slice(0, 2).map(d => ({ date: d.created, text: `Deal créé — ${d.title}`, type: 'deal', color: 'var(--accent)' })),
                    ...clientTasks.filter(t => t.status === 'done').slice(0, 2).map(t => ({ date: t.dueDate, text: `Tâche complétée — ${t.title}`, type: 'task', color: 'var(--green)' })),
                    ...clientFactures.slice(0, 1).map(f => ({ date: f.date, text: `Facture émise — ${f.id}`, type: 'invoice', color: 'var(--yellow)' })),
                  ]
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .slice(0, 6)
                    .map((item, i) => (
                      <div key={i} className="cdm-timeline-item">
                        <div className="cdm-timeline-dot" style={{ background: item.color }} />
                        <div className="cdm-timeline-content">
                          <p className="cdm-timeline-text">{item.text}</p>
                          <p className="cdm-timeline-date mono">{item.date}</p>
                        </div>
                      </div>
                    ))
                  }
                  {clientDeals.length === 0 && clientTasks.length === 0 && (
                    <EmptyLine label="Aucune activité enregistrée" />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ════ DEALS ════ */}
          {activeTab === 'deals' && (
            <div className="cdm-tab-content">
              <div className="cdm-tab-header">
                <div className="cdm-tab-stats">
                  <span className="cdm-tab-stat"><span className="mono" style={{ color: 'var(--green)' }}>{wonValue.toLocaleString('fr-FR')} €</span> gagnés</span>
                  <span className="cdm-tab-stat"><span className="mono">{avgDealValue.toLocaleString('fr-FR')} €</span> deal moyen</span>
                  <span className="cdm-tab-stat"><span className="mono" style={{ color: 'var(--yellow)' }}>{winRate}%</span> win rate</span>
                </div>
                <button className="cdm-add-btn"><Plus size={13} /> Nouveau deal</button>
              </div>
              {clientDeals.length === 0
                ? <EmptyLine label="Aucun deal pour ce client" />
                : clientDeals.map(d => (
                  <div key={d.id} className="cdm-deal-row">
                    <div className="cdm-deal-stage-bar" style={{ background: d.stage === 'won' ? 'var(--green)' : d.stage === 'lost' ? 'var(--red)' : 'var(--accent)' }} />
                    <div className="cdm-deal-info">
                      <p className="cdm-deal-title">{d.title}</p>
                      <p className="cdm-deal-meta">Clôture : <span className="mono">{d.closeDate}</span></p>
                    </div>
                    <div className="cdm-deal-right">
                      <p className="cdm-deal-value mono">{d.value.toLocaleString('fr-FR')} €</p>
                      <Badge type={d.stage} />
                    </div>
                    <div className="cdm-deal-proba">
                      <div className="cdm-deal-proba-bar">
                        <div style={{ width: `${d.probability}%`, height: '100%', background: d.probability >= 70 ? 'var(--green)' : d.probability >= 40 ? 'var(--yellow)' : 'var(--accent)', borderRadius: 2 }} />
                      </div>
                      <span className="mono" style={{ fontSize: 10, color: 'var(--text-muted)' }}>{d.probability}%</span>
                    </div>
                  </div>
                ))
              }
            </div>
          )}

          {/* ════ DOCUMENTS ════ */}
          {activeTab === 'documents' && (
            <div className="cdm-tab-content">
              {/* Devis */}
              <div className="cdm-doc-section">
                <div className="cdm-tab-header">
                  <SectionTitle icon={FileText} label="Devis" count={clientDevis.length} />
                  <button className="cdm-add-btn"><Plus size={13} /> Nouveau devis</button>
                </div>
                {clientDevis.length === 0
                  ? <EmptyLine label="Aucun devis pour ce client" />
                  : clientDevis.map(d => {
                    const ttc = d.items.reduce((s, i) => s + i.qty * i.price, 0) * (1 + d.taxRate / 100);
                    return (
                      <div key={d.id} className="cdm-doc-row">
                        <div className="cdm-doc-icon devis"><FileText size={13} /></div>
                        <div className="cdm-doc-info">
                          <p className="cdm-doc-id mono">{d.id}</p>
                          <p className="cdm-doc-date">{d.date}</p>
                        </div>
                        <span className="cdm-doc-amount mono">{ttc.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €</span>
                        <span className={`cdm-doc-status ${d.status}`}>
                          {d.status === 'draft' ? 'Brouillon' : d.status === 'sent' ? 'Envoyé' : d.status === 'accepted' ? 'Accepté' : 'Refusé'}
                        </span>
                        <button className="cdm-doc-open"><ArrowUpRight size={12} /></button>
                      </div>
                    );
                  })
                }
              </div>

              {/* Factures */}
              <div className="cdm-doc-section" style={{ marginTop: 20 }}>
                <div className="cdm-tab-header">
                  <SectionTitle icon={Receipt} label="Factures" count={clientFactures.length} />
                  <button className="cdm-add-btn"><Plus size={13} /> Nouvelle facture</button>
                </div>
                {clientFactures.length === 0
                  ? <EmptyLine label="Aucune facture pour ce client" />
                  : clientFactures.map(f => {
                    const ttc = f.items.reduce((s, i) => s + i.qty * i.price, 0) * (1 + f.taxRate / 100);
                    return (
                      <div key={f.id} className="cdm-doc-row">
                        <div className="cdm-doc-icon facture"><Receipt size={13} /></div>
                        <div className="cdm-doc-info">
                          <p className="cdm-doc-id mono">{f.id}</p>
                          <p className="cdm-doc-date">Échéance : <span className="mono">{f.dueDate}</span></p>
                        </div>
                        <span className="cdm-doc-amount mono">{ttc.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €</span>
                        <span className={`cdm-doc-status ${f.status}`}>
                          {f.status === 'paid' ? 'Payée' : f.status === 'sent' ? 'Envoyée' : f.status === 'overdue' ? 'En retard' : 'Brouillon'}
                        </span>
                        <button className="cdm-doc-open"><ArrowUpRight size={12} /></button>
                      </div>
                    );
                  })
                }
              </div>

              {/* Résumé financier */}
              {(clientDevis.length > 0 || clientFactures.length > 0) && (
                <div className="cdm-finance-summary">
                  <div className="cdm-finance-row">
                    <span>Total facturé TTC</span>
                    <span className="mono">{totalFacture.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €</span>
                  </div>
                  <div className="cdm-finance-row">
                    <span>Encaissé</span>
                    <span className="mono" style={{ color: 'var(--green)' }}>{totalPaid.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €</span>
                  </div>
                  <div className="cdm-finance-row total">
                    <span>Reste à encaisser</span>
                    <span className="mono" style={{ color: totalUnpaid > 0 ? 'var(--red)' : 'var(--green)' }}>
                      {totalUnpaid.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ════ TÂCHES ════ */}
          {activeTab === 'tasks' && (
            <div className="cdm-tab-content">
              <div className="cdm-tab-header">
                <div className="cdm-tab-stats">
                  <span className="cdm-tab-stat"><span className="mono">{pendingTasks.length}</span> en attente</span>
                  <span className="cdm-tab-stat" style={{ color: overdueTasks.length > 0 ? 'var(--red)' : 'var(--text-muted)' }}>
                    <span className="mono">{overdueTasks.length}</span> en retard
                  </span>
                </div>
                <button className="cdm-add-btn"><Plus size={13} /> Nouvelle tâche</button>
              </div>
              {clientTasks.length === 0
                ? <EmptyLine label="Aucune tâche pour ce client" />
                : clientTasks.map(t => {
                  const isOverdue = t.dueDate < today && t.status !== 'done';
                  return (
                    <div key={t.id} className={`cdm-task-row ${t.status === 'done' ? 'done' : ''} ${isOverdue ? 'overdue' : ''}`}>
                      {t.status === 'done'
                        ? <CheckCircle2 size={16} color="var(--green)" strokeWidth={2} />
                        : <div className={`cdm-task-check ${isOverdue ? 'overdue' : ''}`} />
                      }
                      <div className="cdm-task-info">
                        <p className="cdm-task-title">{t.title}</p>
                        <p className="cdm-task-meta mono">{t.dueDate}</p>
                      </div>
                      <Badge type={t.priority} />
                      <Badge type={t.status} />
                    </div>
                  );
                })
              }
            </div>
          )}

          {/* ════ ABONNEMENTS ════ */}
          {activeTab === 'abonnements' && (
            <div className="cdm-tab-content">
              {clientMrr > 0 && (
                <div className="cdm-sub-kpis">
                  <div className="cdm-sub-kpi">
                    <p className="cdm-sub-kpi-val mono" style={{ color: 'var(--green)' }}>{clientMrr.toLocaleString('fr-FR')} €</p>
                    <p className="cdm-sub-kpi-label">MRR</p>
                  </div>
                  <div className="cdm-sub-kpi">
                    <p className="cdm-sub-kpi-val mono">{(clientMrr * 12).toLocaleString('fr-FR')} €</p>
                    <p className="cdm-sub-kpi-label">ARR</p>
                  </div>
                  <div className="cdm-sub-kpi">
                    <p className="cdm-sub-kpi-val mono">{clientSubs.filter(s => s.status !== 'cancelled').length}</p>
                    <p className="cdm-sub-kpi-label">Actifs</p>
                  </div>
                </div>
              )}

              {clientSubs.length === 0
                ? <EmptyLine label="Aucun abonnement pour ce client" />
                : clientSubs.map(s => {
                  const statusColor = s.status === 'active' ? 'var(--green)' : s.status === 'at_risk' ? 'var(--yellow)' : s.status === 'cancelled' ? 'var(--red)' : 'var(--text-muted)';
                  const statusLabel = s.status === 'active' ? 'Actif' : s.status === 'at_risk' ? 'À risque' : s.status === 'cancelled' ? 'Résilié' : 'Pause';
                  return (
                    <div key={s.id} className="cdm-sub-row">
                      <div className="cdm-sub-accent" style={{ background: s.color }} />
                      <div className="cdm-sub-info">
                        <p className="cdm-sub-plan">{s.plan}</p>
                        <p className="cdm-sub-desc">{s.description}</p>
                        {s.renewalDate && <p className="cdm-sub-renew mono">Renouvellement : {s.renewalDate}</p>}
                      </div>
                      <div className="cdm-sub-right">
                        <p className="cdm-sub-mrr mono">{s.monthlyCost.toLocaleString('fr-FR')} €<span>/mois</span></p>
                        <span className="cdm-sub-status" style={{ color: statusColor, background: statusColor + '18' }}>{statusLabel}</span>
                      </div>
                    </div>
                  );
                })
              }
            </div>
          )}

        </div>

        {/* ── Footer ── */}
        <div className="cdm-footer">
          <div className="cdm-footer-info">
            <span className="cdm-footer-id mono">ID #{client.id}</span>
            <span>Dernier contact : <span className="mono">{client.lastContact}</span></span>
          </div>
          <button className="cdm-footer-close" onClick={onClose}>Fermer</button>
        </div>

      </div>
    </div>
  );
}