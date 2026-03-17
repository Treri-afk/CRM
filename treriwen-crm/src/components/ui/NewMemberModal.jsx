import React, { useState, useEffect } from 'react';
import {
  X, Check, Plus, User, Mail, Phone,
  MapPin, Building2, Briefcase, AlignLeft, ChevronDown, ChevronUp
} from 'lucide-react';
import './NewMemberModal.css';

const COLORS = ['#3d7fff', '#a78bfa', '#2dd4a0', '#f5c842', '#fb923c', '#ff4d6a'];

const DEPARTMENTS = ['Commercial', 'Tech', 'Marketing', 'Opérations', 'Finance', 'RH', 'Direction', 'Autre'];

const ROLES_BY_DEPT = {
  Commercial:  ['Account Manager', 'Business Developer', 'Directeur Commercial', 'Sales Rep'],
  Tech:        ['Développeur Full-Stack', 'Développeur Front-End', 'Développeur Back-End', 'Lead Tech', 'DevOps'],
  Marketing:   ['Marketing Manager', 'Content Manager', 'Growth Hacker', 'Community Manager'],
  Opérations:  ['Chef de Projet', 'Product Manager', 'Operations Manager', 'Coordinateur'],
  Finance:     ['Comptable', 'DAF', 'Contrôleur de Gestion', 'Analyste Financier'],
  RH:          ['Responsable RH', 'Chargé de Recrutement', 'HRBP'],
  Direction:   ['CEO', 'COO', 'CTO', 'CMO', 'CFO'],
  Autre:       ['Consultant', 'Freelance', 'Stagiaire', 'Autre'],
};

const LOCATIONS = ['Paris', 'Lyon', 'Bordeaux', 'Marseille', 'Toulouse', 'Remote', 'Autre'];

export default function NewMemberModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    name:       '',
    role:       '',
    department: 'Commercial',
    email:      '',
    phone:      '',
    location:   'Paris',
    status:     'active',
    color:      '#3d7fff',
    joinDate:   new Date().toISOString().slice(0, 10),
    notes:      '',
  });
  const [saved,        setSaved]        = useState(false);
  const [errors,       setErrors]       = useState({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  const set = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: null }));
  };

  // Reset role when department changes
  useEffect(() => {
    setForm(f => ({ ...f, role: '' }));
  }, [form.department]);

  // Auto-generate avatar from name
  const avatar = form.name
    ? form.name.trim().split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  const validate = () => {
    const e = {};
    if (!form.name.trim())   e.name  = 'Le nom est requis';
    if (!form.role.trim())   e.role  = 'Le rôle est requis';
    if (!form.email.trim())  e.email = "L'email est requis";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email invalide';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    onSave({
      id:         Date.now(),
      name:       form.name,
      role:       form.role,
      department: form.department,
      email:      form.email,
      phone:      form.phone,
      location:   form.location,
      avatar,
      color:      form.color,
      status:     form.status,
      deals:      0,
      revenue:    0,
      tasks:      0,
      joinDate:   form.joinDate,
      notes:      form.notes,
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

  const roles = ROLES_BY_DEPT[form.department] || [];
  const statusColor = form.status === 'active' ? 'var(--green)' : form.status === 'vacation' ? 'var(--yellow)' : 'var(--text-muted)';

  return (
    <div className="modal-backdrop" onClick={onBackdrop}>
      <div className="nmm-modal fade-in">

        {/* ── Header ── */}
        <div className="nmm-header">
          <div className="nmm-header-left">
            {/* Avatar preview */}
            <div className="nmm-avatar-preview" style={{ background: form.color + '22', color: form.color }}>
              {avatar}
              <span className="nmm-status-dot" style={{ background: statusColor }} />
            </div>
            <div>
              <h2 className="nmm-title">Nouveau membre</h2>
              <p className="nmm-sub">Ajoutez un collaborateur à l'équipe</p>
            </div>
          </div>
          <button className="nmm-close" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="nmm-body">

          {/* ── Couleur ── */}
          <div className="nmm-color-row">
            <span className="nmm-label">Couleur</span>
            <div className="nmm-colors">
              {COLORS.map(c => (
                <button
                  key={c}
                  className={`nmm-color-dot ${form.color === c ? 'selected' : ''}`}
                  style={{ background: c, boxShadow: form.color === c ? `0 0 0 3px ${c}44` : 'none' }}
                  onClick={() => set('color', c)}
                />
              ))}
            </div>
          </div>

          {/* ── Identité ── */}
          <div className="nmm-section-label">Identité</div>

          <div className="nmm-field full">
            <label><User size={11} /> Nom complet *</label>
            <input
              placeholder="Ex: Marie Leclerc"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              className={errors.name ? 'error' : ''}
              autoFocus
            />
            {errors.name && <span className="nmm-error">{errors.name}</span>}
          </div>

          {/* ── Département + Rôle ── */}
          <div className="nmm-section-label">Poste</div>

          <div className="nmm-field full">
            <label><Building2 size={11} /> Département</label>
            <div className="nmm-dept-grid">
              {DEPARTMENTS.map(dept => (
                <button
                  key={dept}
                  className={`nmm-dept-btn ${form.department === dept ? 'active' : ''}`}
                  style={form.department === dept ? { borderColor: form.color + '88', background: form.color + '14', color: form.color } : {}}
                  onClick={() => set('department', dept)}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          <div className="nmm-grid-2">
            <div className="nmm-field">
              <label><Briefcase size={11} /> Rôle *</label>
              <select
                value={form.role}
                onChange={e => set('role', e.target.value)}
                className={errors.role ? 'error' : ''}
              >
                <option value="">Sélectionner un rôle</option>
                {roles.map(r => <option key={r} value={r}>{r}</option>)}
                <option value="__custom">Saisir manuellement…</option>
              </select>
              {errors.role && <span className="nmm-error">{errors.role}</span>}
            </div>

            {/* Si custom, afficher un champ texte */}
            {form.role === '__custom' && (
              <div className="nmm-field">
                <label>Rôle personnalisé</label>
                <input
                  placeholder="Ex: Lead Designer"
                  onChange={e => set('role', e.target.value)}
                  autoFocus
                />
              </div>
            )}

            <div className="nmm-field">
              <label>Statut</label>
              <select value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="active">Actif</option>
                <option value="vacation">En congé</option>
                <option value="inactive">Inactif</option>
              </select>
            </div>
          </div>

          {/* ── Contact ── */}
          <div className="nmm-section-label">Contact</div>

          <div className="nmm-grid-2">
            <div className="nmm-field">
              <label><Mail size={11} /> Email *</label>
              <div className="nmm-input-icon">
                <Mail size={12} />
                <input
                  type="email"
                  placeholder="prenom.nom@entreprise.fr"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  className={errors.email ? 'error' : ''}
                />
              </div>
              {errors.email && <span className="nmm-error">{errors.email}</span>}
            </div>

            <div className="nmm-field">
              <label><Phone size={11} /> Téléphone</label>
              <div className="nmm-input-icon">
                <Phone size={12} />
                <input
                  placeholder="+33 6 …"
                  value={form.phone}
                  onChange={e => set('phone', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="nmm-grid-2">
            <div className="nmm-field">
              <label><MapPin size={11} /> Localisation</label>
              <select value={form.location} onChange={e => set('location', e.target.value)}>
                {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            <div className="nmm-field">
              <label>Date d'arrivée</label>
              <input
                type="date"
                value={form.joinDate}
                onChange={e => set('joinDate', e.target.value)}
              />
            </div>
          </div>

          {/* ── Options avancées ── */}
          <button className="nmm-advanced-toggle" onClick={() => setShowAdvanced(v => !v)}>
            {showAdvanced ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            Notes internes
          </button>

          {showAdvanced && (
            <div className="nmm-advanced fade-in">
              <div className="nmm-field full">
                <label><AlignLeft size={11} /> Notes</label>
                <textarea
                  rows={3}
                  placeholder="Contexte, compétences particulières, informations RH…"
                  value={form.notes}
                  onChange={e => set('notes', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* ── Aperçu carte ── */}
          {form.name && form.role && (
            <div className="nmm-preview-wrap">
              <p className="nmm-preview-label">Aperçu de la carte</p>
              <div className="nmm-preview-card">
                <div className="nmm-preview-top">
                  <div className="nmm-preview-avatar" style={{ background: form.color + '22', color: form.color }}>
                    {avatar}
                    <span className="nmm-preview-dot" style={{ background: statusColor }} />
                  </div>
                </div>
                <div className="nmm-preview-info">
                  <p className="nmm-preview-name">{form.name}</p>
                  <p className="nmm-preview-role">{form.role !== '__custom' ? form.role : '—'}</p>
                  <p className="nmm-preview-dept">{form.department}</p>
                </div>
                <div className="nmm-preview-footer">
                  {form.location && (
                    <span className="nmm-preview-loc">
                      <MapPin size={10} /> {form.location}
                    </span>
                  )}
                  <span className="nmm-preview-status" style={{ color: statusColor }}>
                    ● {form.status === 'active' ? 'Actif' : form.status === 'vacation' ? 'Congé' : 'Inactif'}
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* ── Footer ── */}
        <div className="nmm-footer">
          <button className="nmm-cancel" onClick={onClose}>Annuler</button>
          <button
            className={`nmm-save ${saved ? 'saved' : ''}`}
            onClick={handleSave}
            style={!saved ? { background: form.color, boxShadow: `0 0 20px ${form.color}55` } : {}}
          >
            {saved
              ? <><Check size={14} strokeWidth={2.5} /> Membre ajouté !</>
              : <><Plus size={14} /> Ajouter le membre</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}