import React, { useState, useEffect } from 'react';
import {
  TrendingUp, Calendar, User, MoreHorizontal, Plus,
  X, Check, DollarSign, Target, AlignLeft, Building2
} from 'lucide-react';
import Topbar from '../components/layout/Topbar';
import Badge from '../components/ui/Badge';
import { deals as initialDeals, stages, clients } from '../data/mockData';
import './Deals.css';

/* ─── Probabilités par défaut selon le stade ────────────────────────────────── */
const stageProbabilities = {
  qualification: 20,
  proposal:      45,
  negotiation:   70,
  won:           100,
  lost:          0,
};

/* ─── Modal Nouveau Deal ────────────────────────────────────────────────────── */
function NewDealModal({ onClose, onSave, defaultStage }) {
  const [form, setForm] = useState({
    title:       '',
    clientId:    '',
    client:      '',
    value:       '',
    stage:       defaultStage || 'qualification',
    probability: stageProbabilities[defaultStage || 'qualification'],
    closeDate:   '',
    owner:       'Vous',
    description: '',
  });
  const [saved, setSaved]   = useState(false);
  const [errors, setErrors] = useState({});

  // Sync probabilité quand le stade change
  useEffect(() => {
    setForm(f => ({ ...f, probability: stageProbabilities[f.stage] }));
  }, [form.stage]);

  const set = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: null }));
  };

  const setClient = (id) => {
    const c = clients.find(c => c.id === Number(id));
    setForm(f => ({ ...f, clientId: id, client: c?.name || '' }));
    if (errors.client) setErrors(e => ({ ...e, client: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim())   e.title  = 'Le titre est requis';
    if (!form.client.trim())  e.client = 'Le client est requis';
    if (!form.value || isNaN(Number(form.value)) || Number(form.value) <= 0)
      e.value = 'Montant invalide';
    if (!form.closeDate)      e.closeDate = 'La date de clôture est requise';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    onSave({
      id:          Date.now(),
      title:       form.title,
      client:      form.client,
      clientId:    Number(form.clientId),
      value:       Number(form.value),
      stage:       form.stage,
      probability: Number(form.probability),
      closeDate:   form.closeDate,
      owner:       form.owner,
      created:     new Date().toISOString().slice(0, 10),
    });
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 900);
  };

  const onBackdrop = (e) => { if (e.target === e.currentTarget) onClose(); };

  // Escape key
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, [onClose]);

  const selectedStage = stages.find(s => s.id === form.stage);
  const probColor = form.probability >= 70 ? 'var(--green)' : form.probability >= 40 ? 'var(--yellow)' : 'var(--accent)';

  return (
    <div className="modal-backdrop" onClick={onBackdrop}>
      <div className="new-deal-modal fade-in">

        {/* Header */}
        <div className="ndm-header" style={{ borderBottomColor: selectedStage?.color + '44' }}>
          <div className="ndm-header-left">
            <div className="ndm-stage-icon" style={{ background: selectedStage?.color + '20', color: selectedStage?.color }}>
              <TrendingUp size={16} strokeWidth={1.8} />
            </div>
            <div>
              <h2 className="ndm-title">Nouveau deal</h2>
              <p className="ndm-sub">Ajoutez une opportunité commerciale au pipeline</p>
            </div>
          </div>
          <button className="ndm-close" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="ndm-body">

          {/* Titre */}
          <div className="ndm-field full">
            <label>Titre du deal *</label>
            <input
              placeholder="Ex: Refonte SI — Module CRM"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              className={errors.title ? 'error' : ''}
              autoFocus
            />
            {errors.title && <span className="ndm-error">{errors.title}</span>}
          </div>

          {/* Client */}
          <div className="ndm-field full">
            <label><Building2 size={11} /> Client *</label>
            <select
              value={form.clientId}
              onChange={e => setClient(e.target.value)}
              className={errors.client ? 'error' : ''}
            >
              <option value="">Sélectionner un client</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {errors.client && <span className="ndm-error">{errors.client}</span>}
          </div>

          {/* Valeur + Stade */}
          <div className="ndm-grid-2">
            <div className="ndm-field">
              <label><DollarSign size={11} /> Valeur estimée (€) *</label>
              <div className="ndm-input-icon">
                <span className="ndm-currency">€</span>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={form.value}
                  onChange={e => set('value', e.target.value)}
                  className={errors.value ? 'error' : ''}
                />
              </div>
              {errors.value && <span className="ndm-error">{errors.value}</span>}
            </div>

            <div className="ndm-field">
              <label><Target size={11} /> Stade du pipeline</label>
              <select value={form.stage} onChange={e => set('stage', e.target.value)}>
                {stages.map(s => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Probabilité slider */}
          <div className="ndm-field full">
            <div className="ndm-proba-header">
              <label>Probabilité de closing</label>
              <span className="ndm-proba-val mono" style={{ color: probColor }}>
                {form.probability}%
              </span>
            </div>
            <div className="ndm-slider-wrap">
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={form.probability}
                onChange={e => set('probability', Number(e.target.value))}
                className="ndm-slider"
                style={{ '--fill': probColor }}
              />
              <div className="ndm-slider-labels">
                <span>0%</span>
                <span style={{ color: 'var(--yellow)' }}>50%</span>
                <span style={{ color: 'var(--green)' }}>100%</span>
              </div>
            </div>
          </div>

          {/* Date + Owner */}
          <div className="ndm-grid-2">
            <div className="ndm-field">
              <label><Calendar size={11} /> Date de clôture *</label>
              <input
                type="date"
                value={form.closeDate}
                onChange={e => set('closeDate', e.target.value)}
                className={errors.closeDate ? 'error' : ''}
              />
              {errors.closeDate && <span className="ndm-error">{errors.closeDate}</span>}
            </div>

            <div className="ndm-field">
              <label><User size={11} /> Responsable</label>
              <input
                value={form.owner}
                onChange={e => set('owner', e.target.value)}
                placeholder="Vous"
              />
            </div>
          </div>

          {/* Description */}
          <div className="ndm-field full">
            <label><AlignLeft size={11} /> Description (optionnel)</label>
            <textarea
              rows={3}
              placeholder="Contexte du deal, besoins identifiés, prochaines étapes..."
              value={form.description}
              onChange={e => set('description', e.target.value)}
            />
          </div>

          {/* Aperçu */}
          {form.title && form.client && form.value && (
            <div className="ndm-preview">
              <p className="ndm-preview-label">Aperçu de la carte Kanban</p>
              <div className="ndm-preview-card" style={{ borderLeftColor: selectedStage?.color }}>
                <p className="ndm-preview-title">{form.title}</p>
                <p className="ndm-preview-client">{form.client}</p>
                <div className="ndm-preview-row">
                  <span className="mono ndm-preview-value">
                    {Number(form.value).toLocaleString('fr-FR')} €
                  </span>
                  <div className="ndm-preview-proba">
                    <div className="ndm-preview-bar">
                      <div style={{ width: `${form.probability}%`, background: probColor, height: '100%', borderRadius: 2 }} />
                    </div>
                    <span className="mono" style={{ color: probColor, fontSize: 10 }}>{form.probability}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="ndm-footer">
          <button className="ndm-cancel" onClick={onClose}>Annuler</button>
          <button
            className={`ndm-save ${saved ? 'saved' : ''}`}
            onClick={handleSave}
            style={!saved ? { background: selectedStage?.color, boxShadow: `0 0 20px ${selectedStage?.color}55` } : {}}
          >
            {saved
              ? <><Check size={14} strokeWidth={2.5} /> Deal créé !</>
              : <><Plus size={14} /> Créer le deal</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Deal Card ─────────────────────────────────────────────────────────────── */
function DealCard({ deal, onAddClick }) {
  const probability = deal.probability;
  const progressColor =
    probability >= 80 ? 'var(--green)' :
    probability >= 50 ? 'var(--yellow)' :
    probability > 0   ? 'var(--accent)' : 'var(--red)';

  return (
    <div className="deal-card fade-in">
      <div className="deal-card-header">
        <p className="deal-card-title">{deal.title}</p>
        <button className="deal-card-menu"><MoreHorizontal size={13} /></button>
      </div>
      <p className="deal-card-client">{deal.client}</p>
      <div className="deal-card-value mono">{deal.value.toLocaleString('fr-FR')} €</div>
      <div className="deal-card-progress">
        <div className="deal-progress-track">
          <div className="deal-progress-fill" style={{ width: `${probability}%`, background: progressColor }} />
        </div>
        <span className="deal-progress-pct mono">{probability}%</span>
      </div>
      <div className="deal-card-footer">
        <span className="deal-card-meta"><Calendar size={10} />{deal.closeDate}</span>
        <span className="deal-card-meta"><User size={10} />{deal.owner}</span>
      </div>
    </div>
  );
}

/* ─── Page Deals ────────────────────────────────────────────────────────────── */
export default function Deals() {
  const [dealList, setDealList] = useState(initialDeals);
  const [view, setView]         = useState('kanban');
  const [showModal, setShowModal] = useState(false);
  const [defaultStage, setDefaultStage] = useState('qualification');

  const openModal = (stage = 'qualification') => {
    setDefaultStage(stage);
    setShowModal(true);
  };

  const handleSave = (newDeal) => {
    setDealList(prev => [...prev, newDeal]);
  };

  const totalPipeline = dealList
    .filter(d => !['won', 'lost'].includes(d.stage))
    .reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="page">
      <Topbar
        title="Pipeline"
        subtitle={`${dealList.length} deals · ${totalPipeline.toLocaleString('fr-FR')} € en jeu`}
      />

      <div className="page-content">

        {/* Summary Bar */}
        <div className="pipeline-summary stagger">
          {stages.map(stage => {
            const stageDeals = dealList.filter(d => d.stage === stage.id);
            const stageValue = stageDeals.reduce((s, d) => s + d.value, 0);
            return (
              <div key={stage.id} className="pipeline-summary-item">
                <div className="pipeline-summary-dot" style={{ background: stage.color }} />
                <div>
                  <p className="pipeline-summary-label">{stage.label}</p>
                  <p className="pipeline-summary-value mono">
                    {stageValue > 0 ? `${stageValue.toLocaleString('fr-FR')} €` : '—'}
                    <span className="pipeline-summary-count">
                      {stageDeals.length > 0 && ` · ${stageDeals.length}`}
                    </span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* View Toggle + Bouton nouveau deal */}
        <div className="view-controls">
          <div className="view-tabs">
            <button className={`view-tab ${view === 'kanban' ? 'active' : ''}`} onClick={() => setView('kanban')}>Kanban</button>
            <button className={`view-tab ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>Liste</button>
          </div>
          <button className="new-deal-btn" onClick={() => openModal()}>
            <Plus size={14} strokeWidth={2.5} /> Nouveau deal
          </button>
        </div>

        {/* Kanban Board */}
        {view === 'kanban' && (
          <div className="kanban-board">
            {stages.map(stage => {
              const stageDeals = dealList.filter(d => d.stage === stage.id);
              return (
                <div key={stage.id} className="kanban-column">
                  <div className="kanban-col-header">
                    <div className="kanban-col-title">
                      <div className="kanban-stage-dot" style={{ background: stage.color }} />
                      <span>{stage.label}</span>
                    </div>
                    <span className="kanban-col-count">{stageDeals.length}</span>
                  </div>
                  <div className="kanban-cards">
                    {stageDeals.map(deal => (
                      <DealCard key={deal.id} deal={deal} />
                    ))}
                    <button className="kanban-add-btn" onClick={() => openModal(stage.id)}>
                      <Plus size={13} /> Ajouter un deal
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* List View */}
        {view === 'list' && (
          <div className="deals-table-card">
            <table className="deals-table">
              <thead>
                <tr>
                  <th>Deal</th>
                  <th>Client</th>
                  <th>Valeur</th>
                  <th>Statut</th>
                  <th>Probabilité</th>
                  <th>Clôture</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {dealList.map(deal => (
                  <tr key={deal.id}>
                    <td><p className="deals-table-title">{deal.title}</p></td>
                    <td className="deals-table-client">{deal.client}</td>
                    <td className="mono deals-table-value">{deal.value.toLocaleString('fr-FR')} €</td>
                    <td><Badge type={deal.stage} /></td>
                    <td>
                      <div className="table-proba">
                        <div className="proba-bar-sm">
                          <div className="proba-fill-sm" style={{ width: `${deal.probability}%`, background: deal.probability >= 80 ? 'var(--green)' : deal.probability >= 50 ? 'var(--yellow)' : 'var(--accent)' }} />
                        </div>
                        <span className="mono">{deal.probability}%</span>
                      </div>
                    </td>
                    <td className="mono deals-date">{deal.closeDate}</td>
                    <td><button className="row-action"><MoreHorizontal size={14} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <NewDealModal
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          defaultStage={defaultStage}
        />
      )}
    </div>
  );
}