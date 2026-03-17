import React, { useState, useEffect } from 'react';
import {
  CheckCircle2, Circle, Clock, Mail, Phone,
  Calendar, FileText, Eye, Plus, X, Check,
  AlignLeft, Tag, User, AlertTriangle, RefreshCw
} from 'lucide-react';
import Topbar from '../components/layout/Topbar';
import Badge from '../components/ui/Badge';
import { tasks, clients, deals } from '../data/mockData';
import './Tasks.css';

/* ─── Config types & priorités ──────────────────────────────────────────────── */
const typeConfig = [
  { id: 'email',    label: 'Email',     icon: Mail,     color: '#3d7fff' },
  { id: 'call',     label: 'Appel',     icon: Phone,    color: '#2dd4a0' },
  { id: 'meeting',  label: 'Réunion',   icon: Calendar, color: '#a78bfa' },
  { id: 'document', label: 'Document',  icon: FileText, color: '#f5c842' },
  { id: 'review',   label: 'Révision',  icon: Eye,      color: '#fb923c' },
];

const priorityConfig = [
  { id: 'low',    label: 'Basse',   color: 'var(--text-muted)' },
  { id: 'medium', label: 'Moyenne', color: 'var(--yellow)' },
  { id: 'high',   label: 'Haute',   color: 'var(--red)' },
];

const typeIcons  = Object.fromEntries(typeConfig.map(t => [t.id, t.icon]));
const typeColors = Object.fromEntries(typeConfig.map(t => [t.id, t.color]));

/* ─── Modal Nouvelle tâche ──────────────────────────────────────────────────── */
function NewTaskModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    title:    '',
    type:     'email',
    priority: 'medium',
    status:   'todo',
    clientId: '',
    client:   '',
    dealId:   '',
    dueDate:  new Date(Date.now() + 86400000).toISOString().slice(0, 10), // demain par défaut
    notes:    '',
  });
  const [saved,  setSaved]  = useState(false);
  const [errors, setErrors] = useState({});

  const set = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: null }));
  };

  const setClient = (id) => {
    const c = clients.find(c => c.id === Number(id));
    setForm(f => ({ ...f, clientId: id, client: c?.name || '', dealId: '' }));
  };

  // Deals filtrés selon le client sélectionné
  const clientDeals = form.clientId
    ? deals.filter(d => d.clientId === Number(form.clientId) && !['won', 'lost'].includes(d.stage))
    : deals.filter(d => !['won', 'lost'].includes(d.stage));

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title   = 'Le titre est requis';
    if (!form.dueDate)      e.dueDate = 'La date est requise';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    onSave({
      id:       Date.now(),
      title:    form.title,
      type:     form.type,
      priority: form.priority,
      status:   form.status,
      client:   form.client || 'Sans client',
      clientId: form.clientId ? Number(form.clientId) : null,
      dealId:   form.dealId   ? Number(form.dealId)   : null,
      dueDate:  form.dueDate,
      notes:    form.notes,
    });
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 900);
  };

  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, [onClose]);

  const onBackdrop = (e) => { if (e.target === e.currentTarget) onClose(); };

  const selectedType     = typeConfig.find(t => t.id === form.type);
  const selectedPriority = priorityConfig.find(p => p.id === form.priority);
  const today = new Date().toISOString().slice(0, 10);
  const isOverdue = form.dueDate && form.dueDate < today;

  return (
    <div className="modal-backdrop" onClick={onBackdrop}>
      <div className="new-task-modal fade-in">

        {/* Header */}
        <div className="ntm-header">
          <div className="ntm-header-left">
            <div className="ntm-icon-preview" style={{ background: selectedType.color + '20', color: selectedType.color }}>
              <selectedType.icon size={16} strokeWidth={1.8} />
            </div>
            <div>
              <h2 className="ntm-title">Nouvelle tâche</h2>
              <p className="ntm-sub">Planifiez une action à réaliser</p>
            </div>
          </div>
          <button className="ntm-close" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="ntm-body">

          {/* Titre */}
          <div className="ntm-field full">
            <label>Titre de la tâche *</label>
            <input
              placeholder="Ex: Préparer la proposition commerciale"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              className={errors.title ? 'error' : ''}
              autoFocus
            />
            {errors.title && <span className="ntm-error">{errors.title}</span>}
          </div>

          {/* Type de tâche */}
          <div className="ntm-field full">
            <label><Tag size={11} /> Type</label>
            <div className="ntm-type-grid">
              {typeConfig.map(t => {
                const Icon = t.icon;
                const active = form.type === t.id;
                return (
                  <button
                    key={t.id}
                    className={`ntm-type-btn ${active ? 'active' : ''}`}
                    style={active ? { background: t.color + '18', borderColor: t.color + '66', color: t.color } : {}}
                    onClick={() => set('type', t.id)}
                  >
                    <Icon size={13} strokeWidth={1.8} />
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Priorité */}
          <div className="ntm-field full">
            <label><AlertTriangle size={11} /> Priorité</label>
            <div className="ntm-priority-row">
              {priorityConfig.map(p => (
                <button
                  key={p.id}
                  className={`ntm-priority-btn ${form.priority === p.id ? 'active' : ''}`}
                  style={form.priority === p.id ? { color: p.color, borderColor: p.color + '66', background: p.color + '14' } : {}}
                  onClick={() => set('priority', p.id)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date + Statut */}
          <div className="ntm-grid-2">
            <div className="ntm-field">
              <label><Clock size={11} /> Date d'échéance *</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={e => set('dueDate', e.target.value)}
                className={errors.dueDate ? 'error' : isOverdue ? 'warn' : ''}
              />
              {errors.dueDate && <span className="ntm-error">{errors.dueDate}</span>}
              {isOverdue && !errors.dueDate && (
                <span className="ntm-warn">⚠ Date dans le passé</span>
              )}
            </div>

            <div className="ntm-field">
              <label><RefreshCw size={11} /> Statut</label>
              <select value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="todo">À faire</option>
                <option value="inprogress">En cours</option>
                <option value="done">Terminé</option>
              </select>
            </div>
          </div>

          {/* Client */}
          <div className="ntm-field full">
            <label><User size={11} /> Client lié (optionnel)</label>
            <select value={form.clientId} onChange={e => setClient(e.target.value)}>
              <option value="">Aucun client associé</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Deal lié */}
          <div className="ntm-field full">
            <label>Deal lié (optionnel)</label>
            <select
              value={form.dealId}
              onChange={e => set('dealId', e.target.value)}
              disabled={clientDeals.length === 0}
            >
              <option value="">Aucun deal associé</option>
              {clientDeals.map(d => (
                <option key={d.id} value={d.id}>{d.title} — {d.value.toLocaleString('fr-FR')} €</option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div className="ntm-field full">
            <label><AlignLeft size={11} /> Notes (optionnel)</label>
            <textarea
              rows={3}
              placeholder="Détails, contexte, liens utiles..."
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
            />
          </div>

          {/* Aperçu */}
          {form.title && (
            <div className="ntm-preview">
              <p className="ntm-preview-label">Aperçu</p>
              <div className="ntm-preview-row">
                {/* Toggle simulé */}
                <Circle size={16} strokeWidth={1.5} color="var(--border-bright)" />
                {/* Icône type */}
                <div className="ntm-preview-type-icon" style={{ background: selectedType.color + '18', color: selectedType.color }}>
                  <selectedType.icon size={11} strokeWidth={1.8} />
                </div>
                {/* Contenu */}
                <div className="ntm-preview-content">
                  <p className="ntm-preview-title">{form.title}</p>
                  {form.client && <p className="ntm-preview-client">{form.client}</p>}
                </div>
                {/* Date */}
                <div className={`ntm-preview-due ${isOverdue ? 'overdue' : ''}`}>
                  <Clock size={10} />
                  {form.dueDate}
                </div>
                {/* Priorité badge */}
                <span className="ntm-preview-priority" style={{ color: selectedPriority.color, background: selectedPriority.color + '18' }}>
                  {selectedPriority.label}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="ntm-footer">
          <button className="ntm-cancel" onClick={onClose}>Annuler</button>
          <button
            className={`ntm-save ${saved ? 'saved' : ''}`}
            onClick={handleSave}
            style={!saved ? { background: selectedType.color, boxShadow: `0 0 20px ${selectedType.color}55` } : {}}
          >
            {saved
              ? <><Check size={14} strokeWidth={2.5} /> Tâche créée !</>
              : <><Plus size={14} /> Créer la tâche</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Task Row ──────────────────────────────────────────────────────────────── */
function TaskRow({ task, onToggle }) {
  const Icon     = typeIcons[task.type]  || FileText;
  const iconColor = typeColors[task.type] || 'var(--text-muted)';
  const isDone   = task.status === 'done';
  const today    = new Date().toISOString().slice(0, 10);
  const isOverdue = !isDone && task.dueDate < today;

  return (
    <div className={`task-row ${isDone ? 'done' : ''} ${isOverdue ? 'overdue' : ''}`}>
      <button className={`task-toggle ${isDone ? 'checked' : ''}`} onClick={() => onToggle(task.id)}>
        {isDone ? <CheckCircle2 size={18} strokeWidth={2} /> : <Circle size={18} strokeWidth={1.5} />}
      </button>
      <div className="task-type-icon" style={{ background: iconColor + '18', color: iconColor }}>
        <Icon size={12} strokeWidth={1.8} />
      </div>
      <div className="task-row-content">
        <p className="task-row-title">{task.title}</p>
        <p className="task-row-meta">{task.client}</p>
      </div>
      <div className="task-row-due">
        <Clock size={11} />
        <span className={isOverdue ? 'overdue-text' : ''}>{task.dueDate}</span>
      </div>
      <Badge type={task.priority} />
      <Badge type={task.status} />
    </div>
  );
}

/* ─── Page Tasks ────────────────────────────────────────────────────────────── */
export default function Tasks() {
  const [taskList,   setTaskList]   = useState(tasks);
  const [filter,     setFilter]     = useState('all');
  const [showModal,  setShowModal]  = useState(false);

  const toggle = (id) => {
    setTaskList(prev => prev.map(t =>
      t.id === id ? { ...t, status: t.status === 'done' ? 'todo' : 'done' } : t
    ));
  };

  const handleSave = (newTask) => {
    setTaskList(prev => [...prev, newTask]);
  };

  const filtered = taskList.filter(t => {
    if (filter === 'all')  return true;
    if (filter === 'todo') return t.status !== 'done';
    if (filter === 'done') return t.status === 'done';
    if (filter === 'high') return t.priority === 'high';
    return true;
  });

  const today          = new Date().toISOString().slice(0, 10);
  const upcomingTasks  = filtered.filter(t => t.dueDate >= today && t.status !== 'done');
  const doneTasks      = filtered.filter(t => t.status === 'done');
  const overdueTasks   = filtered.filter(t => t.dueDate < today && t.status !== 'done');
  const completionRate = taskList.length > 0
    ? Math.round((taskList.filter(t => t.status === 'done').length / taskList.length) * 100)
    : 0;

  return (
    <div className="page">
      <Topbar
        title="Tâches"
        subtitle={`${taskList.filter(t => t.status !== 'done').length} tâches en attente`}
      />

      <div className="page-content">

        {/* Overview */}
        <div className="tasks-overview stagger">
          <div className="tasks-progress-card">
            <div className="tasks-progress-info">
              <p className="tasks-progress-label">Progression du jour</p>
              <p className="tasks-progress-value">{completionRate}%</p>
            </div>
            <div className="tasks-progress-bar">
              <div className="tasks-progress-fill" style={{ width: `${completionRate}%` }} />
            </div>
            <p className="tasks-progress-sub">
              {taskList.filter(t => t.status === 'done').length}/{taskList.length} tâches complétées
            </p>
          </div>
          <div className="tasks-stat-mini">
            <p className="tasks-stat-num">{overdueTasks.length}</p>
            <p className="tasks-stat-lbl">En retard</p>
          </div>
          <div className="tasks-stat-mini">
            <p className="tasks-stat-num">{taskList.filter(t => t.priority === 'high' && t.status !== 'done').length}</p>
            <p className="tasks-stat-lbl">Haute priorité</p>
          </div>
          <div className="tasks-stat-mini">
            <p className="tasks-stat-num">{taskList.filter(t => t.status === 'inprogress').length}</p>
            <p className="tasks-stat-lbl">En cours</p>
          </div>
        </div>

        {/* Filter Bar + Bouton */}
        <div className="controls-bar">
          <div className="filter-tabs">
            {[
              { id: 'all',  label: 'Toutes'    },
              { id: 'todo', label: 'À faire'   },
              { id: 'high', label: 'Urgentes'  },
              { id: 'done', label: 'Terminées' },
            ].map(f => (
              <button
                key={f.id}
                className={`filter-tab ${filter === f.id ? 'active' : ''}`}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <button
            className="new-task-btn"
            onClick={() => setShowModal(true)}
          >
            <Plus size={14} strokeWidth={2.5} /> Nouvelle tâche
          </button>
        </div>

        {/* Sections */}
        <div className="tasks-sections">
          {overdueTasks.length > 0 && (
            <div className="task-section">
              <div className="task-section-header">
                <span className="section-dot" style={{ background: 'var(--red)' }} />
                <h4>En retard <span>({overdueTasks.length})</span></h4>
              </div>
              <div className="task-section-list">
                {overdueTasks.map(t => <TaskRow key={t.id} task={t} onToggle={toggle} />)}
              </div>
            </div>
          )}

          {upcomingTasks.length > 0 && (
            <div className="task-section">
              <div className="task-section-header">
                <span className="section-dot" style={{ background: 'var(--accent)' }} />
                <h4>À venir <span>({upcomingTasks.length})</span></h4>
              </div>
              <div className="task-section-list">
                {upcomingTasks.map(t => <TaskRow key={t.id} task={t} onToggle={toggle} />)}
              </div>
            </div>
          )}

          {doneTasks.length > 0 && (
            <div className="task-section">
              <div className="task-section-header">
                <span className="section-dot" style={{ background: 'var(--green)' }} />
                <h4>Terminées <span>({doneTasks.length})</span></h4>
              </div>
              <div className="task-section-list">
                {doneTasks.map(t => <TaskRow key={t.id} task={t} onToggle={toggle} />)}
              </div>
            </div>
          )}

          {filtered.length === 0 && (
            <div className="empty-state">
              <CheckCircle2 size={32} strokeWidth={1} color="var(--text-muted)" />
              <p>Aucune tâche dans cette catégorie</p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <NewTaskModal
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}