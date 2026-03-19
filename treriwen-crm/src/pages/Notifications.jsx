import React, { useState } from 'react';
import {
  Bell, CheckCheck, Filter, Trash2, ArrowUpRight,
  AlertTriangle, CheckCircle2, Info, Zap, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../components/layout/Topbar';
import { notifications } from '../data/mockDataLifeOS';
import './LifeOS.css';

const moduleConfig = {
  crm:            { label: 'CRM',           color: '#3d7fff', emoji: '💼' },
  immobilier:     { label: 'Immobilier',    color: '#f5c842', emoji: '🏠' },
  budget:         { label: 'Budget',        color: '#fb923c', emoji: '💳' },
  investissements:{ label: 'Investissements',color:'#2dd4a0', emoji: '💰' },
  okr:            { label: 'OKR',           color: '#3d7fff', emoji: '🎯' },
  santé:          { label: 'Santé',         color: '#a78bfa', emoji: '🏋️' },
  contenu:        { label: 'Contenu',       color: '#ff4d6a', emoji: '🎬' },
  habitudes:      { label: 'Habitudes',     color: '#2dd4a0', emoji: '🌱' },
};

const typeConfig = {
  danger:  { icon: AlertTriangle, color: 'var(--red)',    bg: 'var(--red-dim)' },
  warning: { icon: AlertTriangle, color: 'var(--yellow)', bg: 'var(--yellow-dim)' },
  success: { icon: CheckCircle2,  color: 'var(--green)',  bg: 'var(--green-dim)' },
  info:    { icon: Info,          color: 'var(--accent-bright)', bg: 'var(--accent-dim)' },
};

const priorityConfig = {
  high:   { label: 'Urgent',  color: 'var(--red)',    dot: '🔴' },
  medium: { label: 'Moyen',   color: 'var(--yellow)', dot: '🟡' },
  low:    { label: 'Info',    color: 'var(--green)',  dot: '🟢' },
};

export default function Notifications() {
  const navigate = useNavigate();
  const [notifList, setNotifList]   = useState(notifications);
  const [filter,    setFilter]      = useState('all');
  const [modFilter, setModFilter]   = useState('all');

  const markAllRead = () => setNotifList(prev => prev.map(n => ({ ...n, read: true })));
  const markRead    = (id) => setNotifList(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const deleteNotif = (id) => setNotifList(prev => prev.filter(n => n.id !== id));

  const filtered = notifList
    .filter(n => filter === 'all' || (filter === 'unread' && !n.read) || (filter === 'urgent' && n.priority === 'high'))
    .filter(n => modFilter === 'all' || n.module === modFilter)
    .sort((a, b) => {
      if (!a.read && b.read) return -1;
      if (a.read && !b.read) return 1;
      const pOrder = { high: 0, medium: 1, low: 2 };
      return (pOrder[a.priority] || 1) - (pOrder[b.priority] || 1);
    });

  const unreadCount  = notifList.filter(n => !n.read).length;
  const urgentCount  = notifList.filter(n => !n.read && n.priority === 'high').length;
  const modules      = [...new Set(notifList.map(n => n.module))];

  return (
    <div className="page">
      <Topbar title="Notifications & Alertes" subtitle={`${unreadCount} non lues · ${urgentCount} urgentes`} />
      <div className="page-content">

        {/* KPIs */}
        <div className="notif-kpis stagger">
          {[
            { label: 'Non lues',  value: unreadCount,                                  color: unreadCount > 0 ? 'var(--accent-bright)' : 'var(--green)' },
            { label: 'Urgentes',  value: urgentCount,                                  color: urgentCount > 0 ? 'var(--red)' : 'var(--green)' },
            { label: 'Ce mois',   value: notifList.length,                             color: 'var(--text-secondary)' },
            { label: 'Modules',   value: modules.length,                               color: 'var(--text-secondary)' },
          ].map(({ label, value, color }) => (
            <div key={label} className="notif-kpi">
              <p className="notif-kpi-val mono" style={{ color }}>{value}</p>
              <p className="notif-kpi-label">{label}</p>
            </div>
          ))}
          <button className="notif-action-btn" onClick={markAllRead}>
            <CheckCheck size={14} /> Tout marquer lu
          </button>
        </div>

        {/* Controls */}
        <div className="notif-controls">
          <div className="filter-tabs">
            {[
              { id: 'all',    label: 'Toutes' },
              { id: 'unread', label: `Non lues (${unreadCount})` },
              { id: 'urgent', label: `🔴 Urgentes (${urgentCount})` },
            ].map(f => (
              <button key={f.id} className={`filter-tab ${filter === f.id ? 'active' : ''}`} onClick={() => setFilter(f.id)}>
                {f.label}
              </button>
            ))}
          </div>
          <select className="immo-sort-select" value={modFilter} onChange={e => setModFilter(e.target.value)}>
            <option value="all">Tous les modules</option>
            {modules.map(m => (
              <option key={m} value={m}>{moduleConfig[m]?.emoji} {moduleConfig[m]?.label || m}</option>
            ))}
          </select>
        </div>

        {/* Liste notifications groupées par module */}
        <div className="notif-list">
          {filtered.map(n => {
            const tc  = typeConfig[n.type]   || typeConfig.info;
            const mc  = moduleConfig[n.module] || { label: n.module, color: '#8892aa', emoji: '📌' };
            const pc  = priorityConfig[n.priority] || priorityConfig.low;
            const Icon = tc.icon;

            return (
              <div
                key={n.id}
                className={`notif-item ${n.read ? 'read' : 'unread'} priority-${n.priority}`}
                style={!n.read ? { borderLeftColor: tc.color } : {}}
              >
                {/* Indicateur non lu */}
                {!n.read && <div className="notif-unread-dot" style={{ background: tc.color }} />}

                {/* Icône type */}
                <div className="notif-type-icon" style={{ background: tc.bg, color: tc.color }}>
                  <Icon size={14} strokeWidth={2} />
                </div>

                {/* Module badge */}
                <div className="notif-module-badge" style={{ background: mc.color + '18', color: mc.color }}>
                  {mc.emoji} {mc.label}
                </div>

                {/* Contenu */}
                <div className="notif-content">
                  <div className="notif-header-row">
                    <p className="notif-title" style={{ color: !n.read ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                      {n.title}
                    </p>
                    <span className="notif-priority" style={{ color: pc.color }}>{pc.dot}</span>
                  </div>
                  <p className="notif-body">{n.body}</p>
                  <p className="notif-date mono">{n.date}</p>
                </div>

                {/* Actions */}
                <div className="notif-actions">
                  <button
                    className="notif-btn"
                    onClick={() => { markRead(n.id); navigate(n.link); }}
                    title="Voir"
                  >
                    <ArrowUpRight size={13} />
                  </button>
                  {!n.read && (
                    <button className="notif-btn" onClick={() => markRead(n.id)} title="Marquer lu">
                      <CheckCheck size={13} />
                    </button>
                  )}
                  <button className="notif-btn danger" onClick={() => deleteNotif(n.id)} title="Supprimer">
                    <X size={13} />
                  </button>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="notif-empty">
              <CheckCircle2 size={36} strokeWidth={1} color="var(--green)" />
              <p>Aucune notification dans cette catégorie 🎉</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}