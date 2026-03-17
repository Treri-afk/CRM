import React, { useState } from 'react';
import {
  Plus, ArrowUpRight, CheckCircle2, Clock, XCircle,
  MessageSquare, DollarSign, TrendingUp, Link2,
  MoreHorizontal, Star, Calendar, AlertCircle
} from 'lucide-react';
import Topbar from '../components/layout/Topbar';
import { partnerships, videos } from '../data/mockDataContent';
import './Content.css';

const statusConfig = {
  completed:   { label: 'Terminé',      color: 'var(--green)',        bg: 'var(--green-dim)',        icon: CheckCircle2 },
  in_progress: { label: 'En cours',     color: 'var(--accent-bright)', bg: 'var(--accent-dim)',       icon: Clock },
  negotiation: { label: 'Négociation',  color: 'var(--yellow)',        bg: 'var(--yellow-dim)',       icon: MessageSquare },
  cancelled:   { label: 'Annulé',       color: 'var(--red)',           bg: 'var(--red-dim)',          icon: XCircle },
};

function PartnerCard({ p, selected, onClick }) {
  const st = statusConfig[p.status];
  const Icon = st.icon;
  const video = videos.find(v => v.id === p.videoId);

  return (
    <div className={`partner-card ${selected ? 'selected' : ''}`} onClick={onClick}>
      <div className="partner-card-top">
        <div className="partner-logo" style={{ background: p.color + '22', color: p.color }}>{p.logo}</div>
        <span className="partner-status-pill-lg" style={{ color: st.color, background: st.bg }}>
          <Icon size={11} strokeWidth={2} /> {st.label}
        </span>
        <button className="equip-menu" onClick={e => e.stopPropagation()}><MoreHorizontal size={14} /></button>
      </div>
      <p className="partner-brand">{p.brand}</p>
      <p className="partner-type">{p.type}</p>
      <p className="partner-deliverable">{p.deliverable}</p>

      <div className="partner-card-metrics">
        <div className="partner-metric">
          <DollarSign size={11} />
          <span className="mono">{p.amount.toLocaleString('fr-FR')} €</span>
        </div>
        {p.startDate && (
          <div className="partner-metric">
            <Calendar size={11} />
            <span>{p.startDate}</span>
          </div>
        )}
      </div>

      {video && (
        <div className="partner-video-ref">
          <Link2 size={10} />
          <span>{video.title.slice(0, 40)}…</span>
        </div>
      )}

      {p.notes && <p className="partner-card-notes">{p.notes}</p>}
    </div>
  );
}

export default function ContentPartnerships() {
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const totalEarned   = partnerships.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0);
  const totalPipeline = partnerships.filter(p => ['in_progress', 'negotiation'].includes(p.status)).reduce((s, p) => s + p.amount, 0);
  const avgDeal       = Math.round(totalEarned / partnerships.filter(p => p.status === 'completed').length);

  // Marques uniques
  const brands = [...new Set(partnerships.map(p => p.brand))];
  const repeatBrands = brands.filter(b => partnerships.filter(p => p.brand === b).length > 1);

  const filtered = partnerships.filter(p => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  const sel = selected ? partnerships.find(p => p.id === selected) : null;

  return (
    <div className="page">
      <Topbar title="Partenariats & Marques" subtitle={`${partnerships.length} collaborations · ${totalEarned.toLocaleString('fr-FR')} € encaissés`} />
      <div className="page-content">

        {/* KPIs */}
        <div className="partner-kpis stagger">
          <div className="partner-kpi">
            <div className="partner-kpi-icon" style={{ background: 'rgba(61,127,255,0.12)', color: 'var(--accent)' }}>
              <DollarSign size={16} strokeWidth={1.8} />
            </div>
            <div>
              <p className="partner-kpi-val mono">{totalEarned.toLocaleString('fr-FR')} €</p>
              <p className="partner-kpi-lbl">Encaissé partenariats</p>
            </div>
          </div>
          <div className="partner-kpi">
            <div className="partner-kpi-icon" style={{ background: 'rgba(167,139,250,0.12)', color: 'var(--purple)' }}>
              <TrendingUp size={16} strokeWidth={1.8} />
            </div>
            <div>
              <p className="partner-kpi-val mono">{totalPipeline.toLocaleString('fr-FR')} €</p>
              <p className="partner-kpi-lbl">En cours / négociation</p>
            </div>
          </div>
          <div className="partner-kpi">
            <div className="partner-kpi-icon" style={{ background: 'rgba(45,212,160,0.12)', color: 'var(--green)' }}>
              <Star size={16} strokeWidth={1.8} />
            </div>
            <div>
              <p className="partner-kpi-val mono">{avgDeal.toLocaleString('fr-FR')} €</p>
              <p className="partner-kpi-lbl">Montant moyen deal</p>
            </div>
          </div>
          <div className="partner-kpi">
            <div className="partner-kpi-icon" style={{ background: 'rgba(245,200,66,0.12)', color: 'var(--yellow)' }}>
              <AlertCircle size={16} strokeWidth={1.8} />
            </div>
            <div>
              <p className="partner-kpi-val mono">{repeatBrands.length}</p>
              <p className="partner-kpi-lbl">Marques récurrentes</p>
              <p className="partner-kpi-sub">{repeatBrands.join(', ')}</p>
            </div>
          </div>
          <button className="sub-new-btn">
            <Plus size={14} /> Nouveau partenariat
          </button>
        </div>

        {/* Controls */}
        <div className="controls-bar">
          <div className="filter-tabs">
            {[
              { id: 'all',         label: 'Tous' },
              { id: 'in_progress', label: 'En cours' },
              { id: 'negotiation', label: 'Négociation' },
              { id: 'completed',   label: 'Terminés' },
            ].map(f => (
              <button key={f.id} className={`filter-tab ${filter === f.id ? 'active' : ''}`} onClick={() => setFilter(f.id)}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid + detail */}
        <div className={`partner-layout ${sel ? 'with-detail' : ''}`}>
          <div className="partner-grid">
            {filtered.map(p => (
              <PartnerCard
                key={p.id}
                p={p}
                selected={selected === p.id}
                onClick={() => setSelected(selected === p.id ? null : p.id)}
              />
            ))}
          </div>

          {/* Detail panel */}
          {sel && (
            <div className="partner-detail fade-in">
              <div className="partner-detail-header">
                <div className="partner-logo-lg" style={{ background: sel.color + '22', color: sel.color }}>{sel.logo}</div>
                <div>
                  <h3 className="partner-detail-brand">{sel.brand}</h3>
                  <p className="partner-detail-type">{sel.type}</p>
                </div>
              </div>

              <div className="partner-detail-amount">
                <span className="partner-detail-amount-val mono">{sel.amount.toLocaleString('fr-FR')} €</span>
                <span className="partner-detail-amount-label">Montant du deal</span>
              </div>

              <div className="partner-detail-rows">
                <div className="partner-detail-row">
                  <span>Statut</span>
                  <span className="partner-status-pill-lg" style={{ color: statusConfig[sel.status].color, background: statusConfig[sel.status].bg }}>
                    {statusConfig[sel.status].label}
                  </span>
                </div>
                <div className="partner-detail-row">
                  <span>Livrable</span>
                  <span className="partner-detail-val">{sel.deliverable}</span>
                </div>
                {sel.startDate && (
                  <div className="partner-detail-row">
                    <span>Début</span>
                    <span className="mono partner-detail-val">{sel.startDate}</span>
                  </div>
                )}
                {sel.endDate && (
                  <div className="partner-detail-row">
                    <span>Fin</span>
                    <span className="mono partner-detail-val">{sel.endDate}</span>
                  </div>
                )}
                <div className="partner-detail-row">
                  <span>Contact</span>
                  <a href={`mailto:${sel.contact}`} className="partner-detail-email">{sel.contact}</a>
                </div>
                <div className="partner-detail-row">
                  <span>Exclusivité</span>
                  <span className="partner-detail-val">{sel.exclusivity ? '⚠️ Oui' : '✓ Non'}</span>
                </div>
                {sel.videoId && (
                  <div className="partner-detail-row">
                    <span>Vidéo liée</span>
                    <span className="partner-detail-video">{videos.find(v => v.id === sel.videoId)?.title}</span>
                  </div>
                )}
              </div>

              {sel.notes && (
                <div className="partner-detail-notes-block">
                  <p className="partner-notes-title">Notes</p>
                  <p className="partner-notes-text">{sel.notes}</p>
                </div>
              )}

              {/* Autres deals avec cette marque */}
              {partnerships.filter(p => p.brand === sel.brand && p.id !== sel.id).length > 0 && (
                <div className="partner-history">
                  <p className="partner-history-title">Autres deals avec {sel.brand}</p>
                  {partnerships.filter(p => p.brand === sel.brand && p.id !== sel.id).map(p => (
                    <div key={p.id} className="partner-history-item">
                      <span className="partner-history-date">{p.startDate || '—'}</span>
                      <span className="partner-history-type">{p.type}</span>
                      <span className="mono">{p.amount.toLocaleString('fr-FR')} €</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="partner-detail-actions">
                <button className="detail-action-btn primary"><MessageSquare size={13} /> Contacter</button>
                <button className="detail-action-btn secondary" onClick={() => setSelected(null)}>Fermer</button>
              </div>
            </div>
          )}
        </div>

        {/* Tableau récap */}
        <div className="content-card">
          <div className="content-card-header">
            <h3 className="content-card-title">Historique des partenariats</h3>
          </div>
          <table className="content-table">
            <thead>
              <tr>
                <th>Marque</th>
                <th>Type</th>
                <th>Vidéo</th>
                <th>Montant</th>
                <th>Période</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {partnerships.map(p => {
                const st = statusConfig[p.status];
                const video = videos.find(v => v.id === p.videoId);
                return (
                  <tr key={p.id}>
                    <td>
                      <div className="partner-table-brand">
                        <div className="partner-dot-sm" style={{ background: p.color }} />
                        <span>{p.brand}</span>
                      </div>
                    </td>
                    <td className="partner-table-type">{p.type}</td>
                    <td className="partner-table-video">{video ? video.title.slice(0, 35) + '…' : p.videoTitle}</td>
                    <td className="mono partner-table-amount">{p.amount.toLocaleString('fr-FR')} €</td>
                    <td className="mono table-muted">
                      {p.startDate ? `${p.startDate} → ${p.endDate || '…'}` : 'À définir'}
                    </td>
                    <td>
                      <span className="partner-status-sm" style={{ color: st.color, background: st.bg }}>
                        {st.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}