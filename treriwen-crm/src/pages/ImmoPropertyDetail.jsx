import React, { useState } from 'react';
import {
  Home, MapPin, ArrowLeft, Edit2, Wrench, Users,
  FileText, DollarSign, Calendar, Phone, Mail,
  CheckCircle2, Clock, AlertTriangle, Plus,
  Key, Building2, Star, TrendingUp
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import Topbar from '../components/layout/Topbar';
import {
  properties, tenants, repairs,
  rentalRevenue, propertyDocuments
} from '../data/mockDataImmo';
import './Immo.css';

const repairCategoryColors = {
  plomberie:   '#3d7fff', électricité: '#f5c842', toiture:  '#a78bfa',
  peinture:    '#2dd4a0', serrurerie:  '#fb923c', inspection:'#8892aa',
};

const repairStatusCfg = {
  completed:   { label: 'Terminé',   color: 'var(--green)',  icon: CheckCircle2 },
  in_progress: { label: 'En cours',  color: 'var(--yellow)', icon: Clock },
  planned:     { label: 'Planifié',  color: 'var(--accent)', icon: Clock },
};

const docTypeIcons = {
  legal:      { icon: '⚖️', label: 'Légal' },
  lease:      { icon: '📋', label: 'Bail' },
  diagnostic: { icon: '🔍', label: 'Diagnostic' },
  insurance:  { icon: '🛡️', label: 'Assurance' },
};

export default function ImmoPropertyDetail() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const [tab, setTab] = useState('overview');

  const property = properties.find(p => p.id === Number(id));
  if (!property) return <div className="page"><p style={{ padding: 32, color: 'var(--text-muted)' }}>Bien introuvable</p></div>;

  const tenant   = tenants.find(t => t.propertyId === property.id);
  const propRepairs = repairs.filter(r => r.propertyId === property.id);
  const propDocs = propertyDocuments.filter(d => d.propertyId === property.id);
  const statusCfg = {
    rented:  { label: 'Loué',   color: 'var(--green)',  bg: 'var(--green-dim)' },
    vacant:  { label: 'Vacant', color: 'var(--yellow)', bg: 'var(--yellow-dim)' },
  };
  const st = statusCfg[property.status] || statusCfg.vacant;

  const plusValue = property.currentValue - property.purchasePrice;
  const plusPct   = ((plusValue / property.purchasePrice) * 100).toFixed(1);
  const annualRevenue = (tenant?.monthlyRent || 0) * 12;
  const grossYield    = annualRevenue > 0 ? ((annualRevenue / property.currentValue) * 100).toFixed(2) : '—';
  const totalRepairCost = propRepairs.filter(r => r.realCost).reduce((s, r) => s + r.realCost, 0);

  const tabs = [
    { id: 'overview',   label: 'Vue d\'ensemble' },
    { id: 'tenant',     label: `Locataire${tenant ? '' : 's'}` },
    { id: 'repairs',    label: `Travaux (${propRepairs.length})` },
    { id: 'documents',  label: `Documents (${propDocs.length})` },
  ];

  return (
    <div className="page">
      <Topbar
        title={property.name}
        subtitle={`${property.city}, ${property.district} · ${property.surface} m²`}
      />
      <div className="page-content">

        {/* ── Header bien ── */}
        <div className="immo-detail-header" style={{ borderColor: property.color + '55' }}>
          <div className="immo-detail-header-left">
            <div className="immo-detail-icon" style={{ background: property.color + '20', color: property.color }}>
              <Home size={22} strokeWidth={1.6} />
            </div>
            <div>
              <div className="immo-detail-name-row">
                <h2 className="immo-detail-name">{property.name}</h2>
                <span className="immo-status-pill" style={{ color: st.color, background: st.bg }}>{st.label}</span>
              </div>
              <div className="immo-detail-meta">
                <span><MapPin size={11} /> {property.address}</span>
                <span><Building2 size={11} /> {property.type} · {property.rooms} pièces · {property.surface} m²</span>
                <span><Star size={11} /> Construit en {property.yearBuilt}</span>
              </div>
            </div>
          </div>
          <div className="immo-detail-header-kpis">
            <div className="immo-detail-kpi">
              <p className="mono" style={{ color: property.color }}>{(property.currentValue / 1000000).toFixed(1)}M ¥</p>
              <p>Valeur</p>
            </div>
            <div className="immo-detail-kpi">
              <p className="mono" style={{ color: 'var(--green)' }}>+{plusPct}%</p>
              <p>Plus-value</p>
            </div>
            <div className="immo-detail-kpi">
              <p className="mono">{grossYield !== '—' ? `${grossYield}%` : '—'}</p>
              <p>Rendement</p>
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="immo-tabs">
          {tabs.map(t => (
            <button
              key={t.id}
              className={`immo-tab ${tab === t.id ? 'active' : ''}`}
              style={tab === t.id ? { borderBottomColor: property.color } : {}}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ════ VUE D'ENSEMBLE ════ */}
        {tab === 'overview' && (
          <div className="immo-tab-content">
            <div className="immo-overview-grid">
              {/* Infos générales */}
              <div className="immo-card">
                <div className="immo-card-header"><h3 className="immo-card-title">Informations</h3></div>
                <div className="immo-info-rows">
                  {[
                    ['Adresse',   property.address],
                    ['Ville',     `${property.city} (${property.district})`],
                    ['Type',      property.type],
                    ['Surface',   `${property.surface} m²`],
                    ['Pièces',    property.rooms],
                    ['Étage',     property.floor > 0 ? `${property.floor}/${property.totalFloors}` : `Maison (${property.totalFloors} niveaux)`],
                    ['Année',     property.yearBuilt],
                    ['Achat',     `${property.purchasePrice.toLocaleString('fr-FR')} ¥`],
                    ['Date achat',property.purchaseDate],
                    ['Valeur actuelle', `${property.currentValue.toLocaleString('fr-FR')} ¥`],
                  ].map(([k, v]) => (
                    <div key={k} className="immo-info-row">
                      <span>{k}</span>
                      <span className="immo-info-val">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Finances */}
              <div className="immo-card">
                <div className="immo-card-header"><h3 className="immo-card-title">Finances</h3></div>
                <div className="immo-info-rows">
                  {[
                    ['Loyer mensuel',    tenant ? `${tenant.monthlyRent.toLocaleString('fr-FR')} ¥` : '—'],
                    ['Loyer annuel',     annualRevenue > 0 ? `${annualRevenue.toLocaleString('fr-FR')} ¥` : '—'],
                    ['Rendement brut',   grossYield !== '—' ? `${grossYield}%` : '—'],
                    ['Charges gestion',  `${property.managementFeeMonthly.toLocaleString('fr-FR')} ¥/mois`],
                    ['Taxe foncière',    `${property.taxAnnual.toLocaleString('fr-FR')} ¥/an`],
                    ['Travaux totaux',   `${totalRepairCost.toLocaleString('fr-FR')} ¥`],
                    ['Plus-value',       `+${plusValue.toLocaleString('fr-FR')} ¥ (+${plusPct}%)`],
                  ].map(([k, v]) => (
                    <div key={k} className="immo-info-row">
                      <span>{k}</span>
                      <span className="immo-info-val mono">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Équipements */}
              <div className="immo-card">
                <div className="immo-card-header"><h3 className="immo-card-title">Équipements & Notes</h3></div>
                <div className="immo-amenities">
                  {property.amenities.map(a => (
                    <span key={a} className="immo-amenity"><CheckCircle2 size={11} /> {a}</span>
                  ))}
                </div>
                {property.description && (
                  <p className="immo-description">{property.description}</p>
                )}
                {/* Travaux ouverts */}
                {propRepairs.filter(r => r.status !== 'completed').length > 0 && (
                  <>
                    <div className="immo-card-header" style={{ marginTop: 16 }}>
                      <h3 className="immo-card-title">Travaux en cours / planifiés</h3>
                    </div>
                    {propRepairs.filter(r => r.status !== 'completed').map(r => {
                      const sc = repairStatusCfg[r.status];
                      const Icon = sc.icon;
                      return (
                        <div key={r.id} className="immo-repair-row">
                          <div className="immo-repair-dot" style={{ background: repairCategoryColors[r.category] || '#8892aa' }} />
                          <div className="immo-repair-info">
                            <p className="immo-repair-title">{r.title}</p>
                            <p className="immo-repair-prop">{r.plannedDate} · ~{r.estimatedCost.toLocaleString('fr-FR')} ¥</p>
                          </div>
                          <span className="immo-repair-status" style={{ color: sc.color, background: sc.color + '18' }}>
                            <Icon size={10} strokeWidth={2} /> {sc.label}
                          </span>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ════ LOCATAIRE ════ */}
        {tab === 'tenant' && (
          <div className="immo-tab-content">
            {!tenant
              ? (
                <div className="immo-empty">
                  <Key size={32} strokeWidth={1} color="var(--text-muted)" />
                  <p>Aucun locataire actuel</p>
                  <button className="immo-add-btn"><Plus size={13} /> Ajouter un locataire</button>
                </div>
              ) : (
                <>
                  {/* Profil locataire */}
                  <div className="immo-tenant-header">
                    <div className="immo-tenant-avatar">
                      {tenant.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="immo-tenant-name">{tenant.name}</p>
                      <p className="immo-tenant-nationality">{tenant.nationality}</p>
                    </div>
                    <div className="immo-tenant-contacts">
                      {tenant.email && <a href={`mailto:${tenant.email}`} className="immo-contact-link"><Mail size={13} /> {tenant.email}</a>}
                      {tenant.phone && <a href={`tel:${tenant.phone}`} className="immo-contact-link"><Phone size={13} /> {tenant.phone}</a>}
                    </div>
                  </div>

                  <div className="immo-overview-grid">
                    {/* Bail */}
                    <div className="immo-card">
                      <div className="immo-card-header"><h3 className="immo-card-title">Bail</h3></div>
                      <div className="immo-info-rows">
                        {[
                          ['Début du bail', tenant.leaseStart],
                          ['Fin du bail', tenant.leaseEnd || 'Sans terme (Airbnb)'],
                          ['Loyer mensuel', `${tenant.monthlyRent.toLocaleString('fr-FR')} ¥`],
                          ['Dépôt de garantie', `${tenant.deposit.toLocaleString('fr-FR')} ¥`],
                          ['Key money', `${tenant.keyMoney.toLocaleString('fr-FR')} ¥`],
                          ['Jour de paiement', tenant.paymentDay ? `Le ${tenant.paymentDay}` : 'Variable'],
                        ].map(([k, v]) => (
                          <div key={k} className="immo-info-row">
                            <span>{k}</span>
                            <span className="immo-info-val mono">{v}</span>
                          </div>
                        ))}
                      </div>
                      {tenant.notes && <p className="immo-tenant-notes">{tenant.notes}</p>}
                    </div>

                    {/* Historique paiements */}
                    <div className="immo-card">
                      <div className="immo-card-header">
                        <h3 className="immo-card-title">Historique des paiements</h3>
                        <div className="immo-payment-stats">
                          <span className="mono" style={{ color: 'var(--green)' }}>
                            {tenant.paymentHistory.filter(p => p.status === 'paid').length} / {tenant.paymentHistory.length} à temps
                          </span>
                        </div>
                      </div>
                      <div className="immo-payments-list">
                        {tenant.paymentHistory.map((p, i) => (
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
                    </div>
                  </div>
                </>
              )
            }
          </div>
        )}

        {/* ════ TRAVAUX ════ */}
        {tab === 'repairs' && (
          <div className="immo-tab-content">
            <div className="immo-tab-bar">
              <div className="immo-repair-stats">
                <span>{propRepairs.filter(r => r.status === 'completed').length} terminés</span>
                <span style={{ color: 'var(--yellow)' }}>{propRepairs.filter(r => r.status === 'in_progress').length} en cours</span>
                <span style={{ color: 'var(--accent)' }}>{propRepairs.filter(r => r.status === 'planned').length} planifiés</span>
              </div>
              <button className="immo-add-btn-sm"><Plus size={13} /> Nouvelle réparation</button>
            </div>

            {propRepairs.length === 0
              ? <div className="immo-empty"><Wrench size={32} strokeWidth={1} color="var(--text-muted)" /><p>Aucun travaux enregistrés</p></div>
              : propRepairs.map(r => {
                const sc   = repairStatusCfg[r.status];
                const Icon = sc.icon;
                const over  = r.realCost && r.realCost > r.estimatedCost;
                return (
                  <div key={r.id} className="immo-repair-card">
                    <div className="immo-repair-card-header">
                      <div className="immo-repair-cat-tag" style={{ background: (repairCategoryColors[r.category] || '#8892aa') + '20', color: repairCategoryColors[r.category] || '#8892aa' }}>
                        {r.category}
                      </div>
                      <span className="immo-repair-status" style={{ color: sc.color, background: sc.color + '18' }}>
                        <Icon size={11} strokeWidth={2} /> {sc.label}
                      </span>
                      <span className={`immo-repair-priority ${r.priority}`}>
                        {r.priority === 'high' ? '🔴 Urgent' : r.priority === 'medium' ? '🟡 Moyen' : '🟢 Bas'}
                      </span>
                    </div>

                    <p className="immo-repair-card-title">{r.title}</p>
                    <p className="immo-repair-card-desc">{r.description}</p>

                    <div className="immo-repair-card-grid">
                      <div className="immo-repair-card-info">
                        <span className="label">Signalé le</span>
                        <span className="mono">{r.reportedDate}</span>
                      </div>
                      <div className="immo-repair-card-info">
                        <span className="label">Planifié le</span>
                        <span className="mono">{r.plannedDate}</span>
                      </div>
                      {r.completedDate && (
                        <div className="immo-repair-card-info">
                          <span className="label">Terminé le</span>
                          <span className="mono">{r.completedDate}</span>
                        </div>
                      )}
                      <div className="immo-repair-card-info">
                        <span className="label">Prestataire</span>
                        <span>{r.contractor || 'À définir'}</span>
                      </div>
                      <div className="immo-repair-card-info">
                        <span className="label">Coût estimé</span>
                        <span className="mono">{r.estimatedCost.toLocaleString('fr-FR')} ¥</span>
                      </div>
                      <div className="immo-repair-card-info">
                        <span className="label">Coût réel</span>
                        <span className="mono" style={{ color: over ? 'var(--red)' : r.realCost ? 'var(--green)' : 'var(--text-muted)' }}>
                          {r.realCost ? `${r.realCost.toLocaleString('fr-FR')} ¥ ${over ? '(dépassement)' : ''}` : '—'}
                        </span>
                      </div>
                    </div>

                    {r.documents.length > 0 && (
                      <div className="immo-repair-docs">
                        {r.documents.map(doc => (
                          <span key={doc} className="immo-repair-doc"><FileText size={10} /> {doc}</span>
                        ))}
                      </div>
                    )}

                    {r.notes && <p className="immo-repair-notes">{r.notes}</p>}
                  </div>
                );
              })
            }
          </div>
        )}

        {/* ════ DOCUMENTS ════ */}
        {tab === 'documents' && (
          <div className="immo-tab-content">
            <div className="immo-tab-bar">
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{propDocs.length} document{propDocs.length > 1 ? 's' : ''}</span>
              <button className="immo-add-btn-sm"><Plus size={13} /> Ajouter un document</button>
            </div>
            {propDocs.length === 0
              ? <div className="immo-empty"><FileText size={32} strokeWidth={1} color="var(--text-muted)" /><p>Aucun document</p></div>
              : (
                <div className="immo-docs-grid">
                  {propDocs.map(doc => {
                    const dt = docTypeIcons[doc.type] || { icon: '📄', label: doc.type };
                    return (
                      <div key={doc.id} className="immo-doc-card">
                        <div className="immo-doc-icon">{dt.icon}</div>
                        <div className="immo-doc-info">
                          <p className="immo-doc-name">{doc.name}</p>
                          <p className="immo-doc-meta">{dt.label} · {doc.date} · {doc.size}</p>
                        </div>
                        <button className="immo-doc-download">↓</button>
                      </div>
                    );
                  })}
                </div>
              )
            }
          </div>
        )}

      </div>
    </div>
  );
}
