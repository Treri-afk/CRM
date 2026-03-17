import React, { useState, useEffect } from 'react';
import {
  X, Check, Plus, RefreshCw, DollarSign,
  Calendar, AlignLeft, Tag, User, FileText,
  TrendingUp, ChevronDown, ChevronUp
} from 'lucide-react';
import { clients } from '../../data/mockData';
import { devis as devisData } from '../../data/mockDataExtra';
import './NewSubscriptionModal.css';

const COLORS = ['#3d7fff', '#a78bfa', '#2dd4a0', '#f5c842', '#fb923c', '#ff4d6a'];

const freqOptions = [
  { id: 'monthly',   label: 'Mensuel',      sub: 'Facturé chaque mois',     icon: '📅' },
  { id: 'quarterly', label: 'Trimestriel',   sub: 'Facturé tous les 3 mois', icon: '🗓️' },
  { id: 'annual',    label: 'Annuel',        sub: 'Facturé une fois/an',     icon: '📆' },
];

export default function NewSubscriptionModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    plan:        '',
    description: '',
    clientId:    '',
    client:      '',
    contact:     '',
    email:       '',
    monthlyCost: '',
    frequency:   'monthly',
    status:      'active',
    startDate:   new Date().toISOString().slice(0, 10),
    renewalDate: '',
    devisRef:    '',
    color:       '#3d7fff',
    notes:       '',
  });
  const [saved,         setSaved]         = useState(false);
  const [errors,        setErrors]        = useState({});
  const [showAdvanced,  setShowAdvanced]  = useState(false);

  const set = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: null }));
  };

  // Quand on choisit un client, on pré-remplit contact + email
  const setClient = (id) => {
    const c = clients.find(c => c.id === Number(id));
    setForm(f => ({
      ...f,
      clientId: id,
      client:   c?.name    || '',
      contact:  c?.contact || '',
      email:    c?.email   || '',
    }));
    if (errors.client) setErrors(e => ({ ...e, client: null }));
  };

  // Auto-calcul date de renouvellement selon la fréquence et la date de début
  useEffect(() => {
    if (!form.startDate) return;
    const d = new Date(form.startDate);
    if (form.frequency === 'monthly')   d.setMonth(d.getMonth() + 1);
    if (form.frequency === 'quarterly') d.setMonth(d.getMonth() + 3);
    if (form.frequency === 'annual')    d.setFullYear(d.getFullYear() + 1);
    setForm(f => ({ ...f, renewalDate: d.toISOString().slice(0, 10) }));
  }, [form.startDate, form.frequency]);

  // Calculs prévisionnels
  const monthlyCost = Number(form.monthlyCost) || 0;
  const arr = monthlyCost * 12;
  const freqMultiplier = form.frequency === 'monthly' ? 1 : form.frequency === 'quarterly' ? 3 : 12;
  const invoiceAmount  = monthlyCost * freqMultiplier;

  const validate = () => {
    const e = {};
    if (!form.plan.trim())         e.plan        = 'Le nom du plan est requis';
    if (!form.client.trim())       e.client      = 'Le client est requis';
    if (!monthlyCost || monthlyCost <= 0) e.monthlyCost = 'Le montant est requis';
    if (!form.startDate)           e.startDate   = 'La date de début est requise';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }

    const initials = form.client.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

    onSave({
      id:             `SUB-${Date.now()}`,
      client:         form.client,
      clientId:       form.clientId ? Number(form.clientId) : null,
      contact:        form.contact,
      email:          form.email,
      plan:           form.plan,
      description:    form.description,
      monthlyCost:    monthlyCost,
      frequency:      form.frequency,
      status:         form.status,
      startDate:      form.startDate,
      renewalDate:    form.renewalDate || null,
      endDate:        null,
      devisRef:       form.devisRef || null,
      paymentHistory: [],
      color:          form.color,
      notes:          form.notes,
    });

    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 900);
  };

  const onBackdrop = (e) => { if (e.target === e.currentTarget) onClose(); };

  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onBackdrop}>
      <div className="nsm-modal fade-in">

        {/* ── Header ── */}
        <div className="nsm-header" style={{ borderBottomColor: form.color + '55' }}>
          <div className="nsm-header-left">
            <div className="nsm-icon" style={{ background: form.color + '20', color: form.color }}>
              <RefreshCw size={17} strokeWidth={1.8} />
            </div>
            <div>
              <h2 className="nsm-title">Nouvel abonnement</h2>
              <p className="nsm-sub">Créez un revenu récurrent lié à un client</p>
            </div>
          </div>
          <button className="nsm-close" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="nsm-body">

          {/* ── Couleur ── */}
          <div className="nsm-color-row">
            <span className="nsm-label">Couleur</span>
            <div className="nsm-colors">
              {COLORS.map(c => (
                <button
                  key={c}
                  className={`nsm-color-dot ${form.color === c ? 'selected' : ''}`}
                  style={{ background: c, boxShadow: form.color === c ? `0 0 0 3px ${c}44` : 'none' }}
                  onClick={() => set('color', c)}
                />
              ))}
            </div>
          </div>

          {/* ── Plan + Description ── */}
          <div className="nsm-section-label">Plan</div>

          <div className="nsm-field full">
            <label><Tag size={11} /> Nom du plan *</label>
            <input
              placeholder="Ex: CRM Pro, Hébergement Cloud, Maintenance Web…"
              value={form.plan}
              onChange={e => set('plan', e.target.value)}
              className={errors.plan ? 'error' : ''}
              autoFocus
            />
            {errors.plan && <span className="nsm-error">{errors.plan}</span>}
          </div>

          <div className="nsm-field full">
            <label><AlignLeft size={11} /> Description</label>
            <input
              placeholder="Ex: Licence mensuelle + support prioritaire"
              value={form.description}
              onChange={e => set('description', e.target.value)}
            />
          </div>

          {/* ── Client ── */}
          <div className="nsm-section-label">Client</div>

          <div className="nsm-field full">
            <label><User size={11} /> Client *</label>
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
            {errors.client && <span className="nsm-error">{errors.client}</span>}
          </div>

          {/* ── Facturation ── */}
          <div className="nsm-section-label">Facturation</div>

          {/* Fréquence */}
          <div className="nsm-field full">
            <label><RefreshCw size={11} /> Fréquence de facturation</label>
            <div className="nsm-freq-grid">
              {freqOptions.map(f => (
                <button
                  key={f.id}
                  className={`nsm-freq-btn ${form.frequency === f.id ? 'active' : ''}`}
                  style={form.frequency === f.id ? { borderColor: form.color + '88', background: form.color + '14', color: form.color } : {}}
                  onClick={() => set('frequency', f.id)}
                >
                  <span className="nsm-freq-icon">{f.icon}</span>
                  <span className="nsm-freq-label">{f.label}</span>
                  <span className="nsm-freq-sub">{f.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Montant */}
          <div className="nsm-grid-2">
            <div className="nsm-field">
              <label><DollarSign size={11} /> Montant mensuel (€) *</label>
              <div className="nsm-input-icon">
                <span className="nsm-currency">€</span>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={form.monthlyCost}
                  onChange={e => set('monthlyCost', e.target.value)}
                  className={errors.monthlyCost ? 'error' : ''}
                />
              </div>
              {errors.monthlyCost && <span className="nsm-error">{errors.monthlyCost}</span>}
            </div>

            <div className="nsm-field">
              <label>Statut initial</label>
              <select value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="active">Actif</option>
                <option value="paused">En pause</option>
              </select>
            </div>
          </div>

          {/* Aperçu MRR/ARR */}
          {monthlyCost > 0 && (
            <div className="nsm-preview-mrr">
              <div className="nsm-mrr-item">
                <p className="nsm-mrr-val mono" style={{ color: form.color }}>
                  {monthlyCost.toLocaleString('fr-FR')} €
                </p>
                <p className="nsm-mrr-label">MRR</p>
              </div>
              <div className="nsm-mrr-divider" />
              <div className="nsm-mrr-item">
                <p className="nsm-mrr-val mono">{(arr / 1000).toFixed(1)}k €</p>
                <p className="nsm-mrr-label">ARR</p>
              </div>
              <div className="nsm-mrr-divider" />
              <div className="nsm-mrr-item">
                <p className="nsm-mrr-val mono">{invoiceAmount.toLocaleString('fr-FR')} €</p>
                <p className="nsm-mrr-label">
                  Facture {form.frequency === 'monthly' ? 'mensuelle' : form.frequency === 'quarterly' ? 'trim.' : 'annuelle'}
                </p>
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="nsm-grid-2">
            <div className="nsm-field">
              <label><Calendar size={11} /> Date de début *</label>
              <input
                type="date"
                value={form.startDate}
                onChange={e => set('startDate', e.target.value)}
                className={errors.startDate ? 'error' : ''}
              />
              {errors.startDate && <span className="nsm-error">{errors.startDate}</span>}
            </div>
            <div className="nsm-field">
              <label><Calendar size={11} /> Prochain renouvellement</label>
              <input
                type="date"
                value={form.renewalDate}
                onChange={e => set('renewalDate', e.target.value)}
              />
            </div>
          </div>

          {/* Options avancées */}
          <button
            className="nsm-advanced-toggle"
            onClick={() => setShowAdvanced(v => !v)}
          >
            {showAdvanced ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            Options avancées
          </button>

          {showAdvanced && (
            <div className="nsm-advanced fade-in">
              <div className="nsm-field full">
                <label><FileText size={11} /> Référence devis lié</label>
                <select
                  value={form.devisRef}
                  onChange={e => set('devisRef', e.target.value)}
                >
                  <option value="">Aucun devis lié</option>
                  {devisData
                    .filter(d => !form.clientId || d.clientId === Number(form.clientId))
                    .map(d => (
                      <option key={d.id} value={d.id}>{d.id} — {d.client}</option>
                    ))
                  }
                </select>
              </div>

              <div className="nsm-field full">
                <label><AlignLeft size={11} /> Notes internes</label>
                <textarea
                  rows={3}
                  placeholder="Conditions particulières, engagement minimum, modalités de résiliation…"
                  value={form.notes}
                  onChange={e => set('notes', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Aperçu carte */}
          {form.plan && form.client && monthlyCost > 0 && (
            <div className="nsm-preview-card-wrap">
              <p className="nsm-preview-label">Aperçu de la carte</p>
              <div className="nsm-preview-card">
                <div className="nsm-preview-accent" style={{ background: form.color }} />
                <div className="nsm-preview-body">
                  <div className="nsm-preview-top">
                    <div>
                      <div className="nsm-preview-avatar" style={{ background: form.color + '22', color: form.color }}>
                        {form.client.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?'}
                      </div>
                    </div>
                    <span className="nsm-preview-status" style={{ color: 'var(--green)', background: 'var(--green-dim)' }}>
                      ✓ Actif
                    </span>
                  </div>
                  <p className="nsm-preview-client">{form.client}</p>
                  <p className="nsm-preview-plan">{form.plan}</p>
                  <div className="nsm-preview-metrics">
                    <div>
                      <p className="nsm-preview-mrr-val mono" style={{ color: form.color }}>
                        {monthlyCost.toLocaleString('fr-FR')} €
                      </p>
                      <p className="nsm-preview-mrr-lbl">MRR</p>
                    </div>
                    <div>
                      <p className="nsm-preview-mrr-val mono">{(arr / 1000).toFixed(1)}k €</p>
                      <p className="nsm-preview-mrr-lbl">ARR</p>
                    </div>
                  </div>
                  <div className="nsm-preview-footer">
                    <span className="nsm-preview-freq">
                      <RefreshCw size={9} />
                      {freqOptions.find(f => f.id === form.frequency)?.label}
                    </span>
                    {form.renewalDate && (
                      <span className="nsm-preview-renew">
                        <Calendar size={9} /> {form.renewalDate}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* ── Footer ── */}
        <div className="nsm-footer">
          <button className="nsm-cancel" onClick={onClose}>Annuler</button>
          <button
            className={`nsm-save ${saved ? 'saved' : ''}`}
            onClick={handleSave}
            style={!saved ? { background: form.color, boxShadow: `0 0 20px ${form.color}55` } : {}}
          >
            {saved
              ? <><Check size={14} strokeWidth={2.5} /> Abonnement créé !</>
              : <><Plus size={14} /> Créer l'abonnement</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}