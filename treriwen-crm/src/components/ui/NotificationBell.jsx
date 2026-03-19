import React, { useState } from 'react';
import { Bell, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { notifications } from '../../data/mockDataLifeOS';

const moduleConfig = {
  crm:            { label: 'CRM',            emoji: '💼' },
  immobilier:     { label: 'Immobilier',     emoji: '🏠' },
  budget:         { label: 'Budget',         emoji: '💳' },
  investissements:{ label: 'Invest.',        emoji: '💰' },
  okr:            { label: 'OKR',            emoji: '🎯' },
  santé:          { label: 'Santé',          emoji: '🏋️' },
  contenu:        { label: 'Contenu',        emoji: '🎬' },
  habitudes:      { label: 'Habitudes',      emoji: '🌱' },
};

export default function NotificationBell() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const unread  = notifications.filter(n => !n.read);
  const urgent  = unread.filter(n => n.priority === 'high');

  return (
    <div className="notif-bell-wrap">
      <button className="notif-bell-btn" onClick={() => setOpen(o => !o)}>
        <Bell size={18} strokeWidth={1.8} />
        {unread.length > 0 && (
          <span className="notif-bell-count">{unread.length}</span>
        )}
      </button>

      {open && (
        <>
          <div className="notif-bell-backdrop" onClick={() => setOpen(false)} />
          <div className="notif-bell-panel fade-in">
            <div className="nbp-header">
              <span className="nbp-title">Notifications</span>
              <span className="nbp-unread">{unread.length} non lues</span>
            </div>

            {urgent.length > 0 && (
              <div className="nbp-urgent-section">
                <p className="nbp-section-label">🔴 Urgentes</p>
                {urgent.slice(0, 3).map(n => {
                  const mc = moduleConfig[n.module] || { emoji: '📌' };
                  return (
                    <div key={n.id} className="nbp-item urgent"
                      onClick={() => { setOpen(false); navigate(n.link); }}>
                      <span>{mc.emoji}</span>
                      <div className="nbp-item-content">
                        <p className="nbp-item-title">{n.title}</p>
                        <p className="nbp-item-body">{n.body.slice(0, 60)}…</p>
                      </div>
                      <ArrowUpRight size={12} color="var(--text-muted)" />
                    </div>
                  );
                })}
              </div>
            )}

            <div className="nbp-recent-section">
              <p className="nbp-section-label">Récentes</p>
              {unread.filter(n => n.priority !== 'high').slice(0, 4).map(n => {
                const mc = moduleConfig[n.module] || { emoji: '📌' };
                return (
                  <div key={n.id} className="nbp-item"
                    onClick={() => { setOpen(false); navigate(n.link); }}>
                    <span>{mc.emoji}</span>
                    <div className="nbp-item-content">
                      <p className="nbp-item-title">{n.title}</p>
                      <p className="nbp-item-body">{n.body.slice(0, 55)}…</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <button className="nbp-see-all"
              onClick={() => { setOpen(false); navigate('/notifications'); }}>
              Voir toutes les notifications <ArrowUpRight size={12} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}