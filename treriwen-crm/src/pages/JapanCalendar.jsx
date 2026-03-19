import React, { useState } from 'react';
import {
  Calendar, MapPin, ChevronLeft, ChevronRight,
  Home, Plus, X
} from 'lucide-react';
import Topbar from '../components/layout/Topbar';
import { japanEvents, japanSeasons } from '../data/mockDataJapan';
import './Japan.css';

const typeConfig = {
  fete:    { label: 'Fête nationale',  color: '#ff4d6a', bg: 'rgba(255,77,106,0.12)'  },
  culture: { label: 'Culture',         color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
  saison:  { label: 'Saison',          color: '#2dd4a0', bg: 'rgba(45,212,160,0.12)'  },
  immo:    { label: 'Immo / Business', color: '#f5c842', bg: 'rgba(245,200,66,0.12)'  },
  rappel:  { label: 'Rappel perso',    color: '#3d7fff', bg: 'rgba(61,127,255,0.12)'  },
};

const MONTHS = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];

function daysUntil(dateStr) {
  return Math.ceil((new Date(dateStr) - new Date()) / 86400000);
}

// ─── Modal Ajouter Événement ──────────────────────────────────────────────────
function AddEventModal({ onClose, onAdd, defaultDate }) {
  const [form, setForm] = useState({
    title:      '',
    date:       defaultDate || new Date().toISOString().slice(0, 10),
    endDate:    '',
    type:       'rappel',
    region:     'National',
    icon:       '📅',
    description:'',
    immoImpact: '',
    priority:   'medium',
  });
  const s = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const icons = ['📅','🏠','💰','✈️','🎌','🌸','🍁','❄️','⛩️','🎆','📋','💸','🔑','🏗️','🎊','🎉','⚠️','🔔'];
  const regions = ['National','Tokyo','Kyoto','Osaka','Sapporo','Fukuoka','Admin','Finance','Immo'];

  const handleAdd = () => {
    if (!form.title || !form.date) return;
    onAdd({
      ...form,
      id: Date.now(),
      endDate: form.endDate || null,
      immoImpact: form.immoImpact || null,
    });
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">➕ Ajouter un événement</h3>
          <button className="modal-close" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="modal-body">
          <div className="add-form">

            {/* Titre */}
            <label>Titre *</label>
            <input className="japan-input flex" placeholder="Ex : Salon immobilier Osaka" value={form.title} onChange={e => s('title', e.target.value)} />

            {/* Dates */}
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <label>Date de début *</label>
                <input className="japan-input flex" type="date" value={form.date} onChange={e => s('date', e.target.value)} />
              </div>
              <div style={{ flex: 1 }}>
                <label>Date de fin (optionnel)</label>
                <input className="japan-input flex" type="date" value={form.endDate} onChange={e => s('endDate', e.target.value)} />
              </div>
            </div>

            {/* Type + Région */}
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <label>Type</label>
                <select className="perso-select" style={{ width: '100%', height: 36 }} value={form.type} onChange={e => s('type', e.target.value)}>
                  {Object.entries(typeConfig).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label>Région</label>
                <select className="perso-select" style={{ width: '100%', height: 36 }} value={form.region} onChange={e => s('region', e.target.value)}>
                  {regions.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>

            {/* Priorité */}
            <label>Priorité</label>
            <div className="filter-tabs">
              {[['low','🟢 Basse'],['medium','🟡 Moyenne'],['high','🔴 Haute']].map(([val, lbl]) => (
                <button key={val} className={`filter-tab ${form.priority === val ? 'active' : ''}`} onClick={() => s('priority', val)}>
                  {lbl}
                </button>
              ))}
            </div>

            {/* Icône */}
            <label>Icône</label>
            <div className="jcm-icon-grid">
              {icons.map(ic => (
                <button
                  key={ic}
                  className={`jcm-icon-btn ${form.icon === ic ? 'active' : ''}`}
                  onClick={() => s('icon', ic)}
                >
                  {ic}
                </button>
              ))}
            </div>

            {/* Description */}
            <label>Description</label>
            <textarea
              className="japan-input flex"
              style={{ height: 72, resize: 'vertical', padding: '10px 12px', lineHeight: 1.5 }}
              placeholder="Description de l'événement..."
              value={form.description}
              onChange={e => s('description', e.target.value)}
            />

            {/* Impact immo */}
            <label>Impact immobilier (optionnel)</label>
            <input className="japan-input flex" placeholder="Ex : Agences fermées, prévoir virement avant..." value={form.immoImpact} onChange={e => s('immoImpact', e.target.value)} />

            <button
              className="perso-add-btn"
              style={{ marginTop: 8, height: 40, fontSize: 13 }}
              onClick={handleAdd}
            >
              <Plus size={14} /> Ajouter l'événement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function JapanCalendar() {
  const [viewMonth,  setViewMonth]  = useState(2);
  const [viewYear,   setViewYear]   = useState(2026);
  const [selected,   setSelected]   = useState(null);
  const [filter,     setFilter]     = useState('all');
  const [events,     setEvents]     = useState(japanEvents);
  const [showModal,  setShowModal]  = useState(false);
  const [defaultDate, setDefaultDate] = useState('');

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const daysInMonth    = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7;
  const monthStr       = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}`;

  const urgentEvents = events.filter(e => {
    const d = daysUntil(e.date);
    return d >= 0 && d <= 30 && e.priority === 'high';
  });

  const upcomingEvents = events
    .filter(e => filter === 'all' || e.type === filter)
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const addEvent = (evt) => setEvents(prev => [...prev, evt]);

  // Ouvrir modal avec date pré-remplie au clic sur un jour vide
  const handleDayClick = (dateStr, dayEvents) => {
    if (dayEvents.length > 0) {
      setSelected(dayEvents[0]);
    } else {
      setDefaultDate(dateStr);
      setShowModal(true);
    }
  };

  return (
    <div className="page">
      <Topbar
        title="Calendrier Japon"
        subtitle={`${events.length} événements · ${urgentEvents.length} urgents dans les 30 jours`}
      />
      <div className="page-content">

        {/* Modal */}
        {showModal && (
          <AddEventModal
            defaultDate={defaultDate}
            onClose={() => setShowModal(false)}
            onAdd={addEvent}
          />
        )}

        {/* Alertes urgentes */}
        {urgentEvents.length > 0 && (
          <div className="japan-cal-alerts">
            {urgentEvents.map(e => {
              const d = daysUntil(e.date);
              return (
                <div key={e.id} className="japan-cal-alert-row" onClick={() => setSelected(e)}>
                  <span className="jca-emoji">{e.icon}</span>
                  <div className="jca-info">
                    <p className="jca-title">{e.title}</p>
                    {e.immoImpact && <p className="jca-impact"><Home size={10} /> {e.immoImpact}</p>}
                  </div>
                  <span className="jca-days" style={{ color: d <= 7 ? 'var(--red)' : 'var(--yellow)' }}>
                    {d === 0 ? 'Aujourd\'hui !' : `J-${d}`}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        <div className="japan-cal-layout">

          {/* ── Calendrier visuel ── */}
          <div className="japan-cal-main">
            <div className="japan-cal-nav">
              <button className="japan-nav-btn" onClick={prevMonth}><ChevronLeft size={16} /></button>
              <h3 className="japan-cal-month-title">{MONTHS[viewMonth]} {viewYear}</h3>
              <button className="japan-nav-btn" onClick={nextMonth}><ChevronRight size={16} /></button>
              <button
                className="perso-add-btn"
                style={{ marginLeft: 'auto', height: 32, fontSize: 12 }}
                onClick={() => { setDefaultDate(monthStr + '-01'); setShowModal(true); }}
              >
                <Plus size={13} /> Ajouter
              </button>
            </div>

            <div className="japan-cal-grid">
              {['L','M','M','J','V','S','D'].map((d, i) => (
                <div key={i} className={`japan-cal-dow ${i >= 5 ? 'weekend' : ''}`}>{d}</div>
              ))}
              {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="japan-cal-day empty" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day     = i + 1;
                const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const dayEvts = events.filter(e => e.date === dateStr);
                const isToday = dateStr === new Date().toISOString().slice(0, 10);
                const dow     = (firstDayOfWeek + i) % 7;
                return (
                  <div
                    key={day}
                    className={`japan-cal-day ${isToday ? 'today' : ''} ${dow >= 5 ? 'weekend' : ''} ${dayEvts.length > 0 ? 'has-events' : 'clickable-day'}`}
                    onClick={() => handleDayClick(dateStr, dayEvts)}
                    title={dayEvts.length === 0 ? 'Cliquer pour ajouter un événement' : undefined}
                  >
                    <span className="jcd-num">{day}</span>
                    <div className="jcd-events">
                      {dayEvts.slice(0, 2).map(e => (
                        <div key={e.id} className="jcd-event-dot" style={{ background: typeConfig[e.type]?.color || '#8892aa' }} title={e.title} />
                      ))}
                      {dayEvts.length > 2 && <span className="jcd-more">+{dayEvts.length - 2}</span>}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="japan-cal-legend">
              {Object.entries(typeConfig).map(([type, cfg]) => (
                <div key={type} className="jcl-item">
                  <div className="jcl-dot" style={{ background: cfg.color }} />
                  <span>{cfg.label}</span>
                </div>
              ))}
              <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)' }}>
                💡 Cliquer sur un jour vide pour ajouter
              </span>
            </div>
          </div>

          {/* ── Panneau latéral ── */}
          <div className="japan-cal-sidebar">
            {selected ? (
              <div className="japan-event-detail fade-in">
                <button className="japan-close-btn" onClick={() => setSelected(null)}>✕</button>
                <div className="jed-header" style={{ borderBottomColor: typeConfig[selected.type]?.color + '44' }}>
                  <span className="jed-emoji">{selected.icon}</span>
                  <div>
                    <span className="jed-type-badge" style={{ color: typeConfig[selected.type]?.color, background: typeConfig[selected.type]?.bg }}>
                      {typeConfig[selected.type]?.label}
                    </span>
                    <p className="jed-title">{selected.title}</p>
                    <div className="jed-meta">
                      <span className="mono">{selected.date}</span>
                      {selected.endDate && <><span>→</span><span className="mono">{selected.endDate}</span></>}
                      {selected.region !== 'National' && <span><MapPin size={10} /> {selected.region}</span>}
                    </div>
                  </div>
                </div>
                {selected.description && <p className="jed-description">{selected.description}</p>}
                {selected.immoImpact && (
                  <div className="jed-impact">
                    <Home size={12} />
                    <div>
                      <p className="jed-impact-label">Impact immobilier</p>
                      <p className="jed-impact-text">{selected.immoImpact}</p>
                    </div>
                  </div>
                )}
                <div className="jed-countdown">
                  {(() => {
                    const d = daysUntil(selected.date);
                    return d < 0
                      ? <span style={{ color: 'var(--text-muted)' }}>Il y a {Math.abs(d)} jours</span>
                      : d === 0
                        ? <span style={{ color: 'var(--yellow)', fontWeight: 700 }}>🎌 Aujourd'hui !</span>
                        : <span style={{ color: d <= 30 ? 'var(--yellow)' : 'var(--text-muted)' }}>Dans {d} jours</span>;
                  })()}
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Filtrer</span>
                  <button
                    className="perso-add-btn"
                    style={{ height: 28, fontSize: 11 }}
                    onClick={() => { setDefaultDate(''); setShowModal(true); }}
                  >
                    <Plus size={12} /> Nouvel événement
                  </button>
                </div>
                <div className="filter-tabs" style={{ flexWrap: 'wrap' }}>
                  <button className={`filter-tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>Tous</button>
                  {Object.entries(typeConfig).map(([type, cfg]) => (
                    <button key={type} className={`filter-tab ${filter === type ? 'active' : ''}`} onClick={() => setFilter(type)}>
                      {cfg.label}
                    </button>
                  ))}
                </div>

                <div className="japan-upcoming-list">
                  <p className="japan-upcoming-title">À venir ({upcomingEvents.length})</p>
                  {upcomingEvents.slice(0, 8).map(e => {
                    const d  = daysUntil(e.date);
                    const tc = typeConfig[e.type] || typeConfig.culture;
                    return (
                      <div key={e.id} className="japan-upcoming-row" onClick={() => setSelected(e)}>
                        <span className="jur-emoji">{e.icon}</span>
                        <div className="jur-info">
                          <p className="jur-title">{e.title}</p>
                          <p className="jur-date mono">{e.date}{e.region !== 'National' ? ` · ${e.region}` : ''}</p>
                        </div>
                        <span className="jur-days mono" style={{ color: d <= 7 ? 'var(--red)' : d <= 30 ? 'var(--yellow)' : 'var(--text-muted)' }}>
                          {d === 0 ? 'Auj.' : d < 0 ? `+${Math.abs(d)}j` : `J-${d}`}
                        </span>
                        <div className="jur-type-dot" style={{ background: tc.color }} />
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Saisons */}
        <div className="perso-card">
          <div className="perso-card-header"><h3 className="perso-card-title">Saisons & meilleures périodes par région</h3></div>
          <div className="japan-seasons-grid">
            {japanSeasons.map(s => (
              <div key={s.region} className="japan-season-card">
                <p className="jsc-region"><MapPin size={11} /> {s.region}</p>
                <div className="jsc-seasons">
                  <div className="jsc-season" style={{ background: 'rgba(255,182,193,0.2)' }}>🌸 {s.spring}</div>
                  <div className="jsc-season" style={{ background: 'rgba(255,165,0,0.15)'  }}>☀️ {s.summer}</div>
                  <div className="jsc-season" style={{ background: 'rgba(210,105,30,0.2)'  }}>🍁 {s.autumn}</div>
                  <div className="jsc-season" style={{ background: 'rgba(135,206,235,0.15)'}}>❄️ {s.winter}</div>
                </div>
                <p className="jsc-best">⭐ {s.bestVisit}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}