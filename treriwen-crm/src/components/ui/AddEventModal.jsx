import React, { useState, useEffect, useRef } from 'react';
import {
  X, Calendar, Clock, MapPin, Users, Video,
  Phone, FileText, AlignLeft, ChevronDown, Check
} from 'lucide-react';
import { clients } from '../../data/mockData';
import { teamMembers } from '../../data/mockDataExtra';
import './AddEventModal.css';

const eventTypes = [
  { id: 'meeting',     label: 'Réunion',       icon: Users,    color: '#a78bfa' },
  { id: 'call',        label: 'Appel',          icon: Phone,    color: '#2dd4a0' },
  { id: 'demo',        label: 'Démo',           icon: Video,    color: '#3d7fff' },
  { id: 'internal',   label: 'Interne',        icon: FileText, color: '#f5c842' },
  { id: 'training',   label: 'Formation',      icon: FileText, color: '#fb923c' },
  { id: 'negotiation',label: 'Négociation',    icon: Users,    color: '#ff4d6a' },
];

const durations = [
  { value: 15,  label: '15 min' },
  { value: 30,  label: '30 min' },
  { value: 45,  label: '45 min' },
  { value: 60,  label: '1h' },
  { value: 90,  label: '1h30' },
  { value: 120, label: '2h' },
];

export default function AddEventModal({ isOpen, onClose, onSave, defaultDate }) {
  const modalRef = useRef(null);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    title: '',
    type: 'meeting',
    date: defaultDate || new Date().toISOString().slice(0, 10),
    time: '09:00',
    duration: 60,
    client: '',
    location: '',
    attendees: [],
    notes: '',
    color: '#a78bfa',
  });

  // Sync color with type
  useEffect(() => {
    const t = eventTypes.find(e => e.id === form.type);
    if (t) setForm(f => ({ ...f, color: t.color }));
  }, [form.type]);

  // Update date when defaultDate changes
  useEffect(() => {
    if (defaultDate) setForm(f => ({ ...f, date: defaultDate }));
  }, [defaultDate]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  // Close on backdrop click
  const onBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const toggleAttendee = (name) => {
    setForm(f => ({
      ...f,
      attendees: f.attendees.includes(name)
        ? f.attendees.filter(a => a !== name)
        : [...f.attendees, name],
    }));
  };

  const handleSave = () => {
    if (!form.title.trim()) return;
    const newEvent = {
      id: Date.now(),
      ...form,
    };
    onSave?.(newEvent);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
      setForm({
        title: '',
        type: 'meeting',
        date: defaultDate || new Date().toISOString().slice(0, 10),
        time: '09:00',
        duration: 60,
        client: '',
        location: '',
        attendees: [],
        notes: '',
        color: '#a78bfa',
      });
    }, 900);
  };

  if (!isOpen) return null;

  const selectedType = eventTypes.find(e => e.id === form.type);

  return (
    <div className="modal-backdrop" onClick={onBackdrop}>
      <div className="add-event-modal fade-in" ref={modalRef}>

        {/* Header */}
        <div className="modal-header" style={{ borderBottomColor: form.color + '44' }}>
          <div className="modal-header-left">
            <div
              className="modal-type-dot"
              style={{ background: form.color, boxShadow: `0 0 12px ${form.color}66` }}
            />
            <h2 className="modal-title">Nouvel événement</h2>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          {/* Title */}
          <div className="modal-field">
            <input
              className="modal-title-input"
              placeholder="Titre de l'événement..."
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              autoFocus
            />
          </div>

          {/* Type selector */}
          <div className="modal-field">
            <label className="modal-label">Type</label>
            <div className="event-type-grid">
              {eventTypes.map(type => {
                const Icon = type.icon;
                const active = form.type === type.id;
                return (
                  <button
                    key={type.id}
                    className={`event-type-btn ${active ? 'active' : ''}`}
                    style={active ? {
                      background: type.color + '18',
                      borderColor: type.color + '66',
                      color: type.color,
                    } : {}}
                    onClick={() => setForm({ ...form, type: type.id })}
                  >
                    <Icon size={13} strokeWidth={1.8} />
                    {type.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date + Time */}
          <div className="modal-row">
            <div className="modal-field">
              <label className="modal-label">
                <Calendar size={12} /> Date
              </label>
              <input
                type="date"
                className="modal-input"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
              />
            </div>
            <div className="modal-field">
              <label className="modal-label">
                <Clock size={12} /> Heure
              </label>
              <input
                type="time"
                className="modal-input"
                value={form.time}
                onChange={e => setForm({ ...form, time: e.target.value })}
              />
            </div>
            <div className="modal-field">
              <label className="modal-label">Durée</label>
              <select
                className="modal-input"
                value={form.duration}
                onChange={e => setForm({ ...form, duration: Number(e.target.value) })}
              >
                {durations.map(d => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Client */}
          <div className="modal-field">
            <label className="modal-label">
              <Users size={12} /> Client (optionnel)
            </label>
            <select
              className="modal-input"
              value={form.client}
              onChange={e => setForm({ ...form, client: e.target.value })}
            >
              <option value="">Aucun client associé</option>
              {clients.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div className="modal-field">
            <label className="modal-label">
              <MapPin size={12} /> Lieu / Lien
            </label>
            <input
              className="modal-input"
              placeholder="ex: Google Meet, Bureaux client, Salle A..."
              value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })}
            />
          </div>

          {/* Attendees */}
          <div className="modal-field">
            <label className="modal-label">
              <Users size={12} /> Participants
            </label>
            <div className="attendees-grid">
              {teamMembers.map(m => {
                const selected = form.attendees.includes(m.name);
                return (
                  <button
                    key={m.id}
                    className={`attendee-btn ${selected ? 'selected' : ''}`}
                    style={selected ? { borderColor: m.color + '66', background: m.color + '14' } : {}}
                    onClick={() => toggleAttendee(m.name)}
                  >
                    <span
                      className="attendee-avatar"
                      style={{ background: m.color + '22', color: m.color }}
                    >
                      {m.avatar}
                    </span>
                    <span className="attendee-name">{m.name.split(' ')[0]}</span>
                    {selected && (
                      <span className="attendee-check" style={{ color: m.color }}>
                        <Check size={10} strokeWidth={3} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div className="modal-field">
            <label className="modal-label">
              <AlignLeft size={12} /> Notes
            </label>
            <textarea
              className="modal-textarea"
              rows={3}
              placeholder="Ordre du jour, informations complémentaires..."
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="modal-cancel" onClick={onClose}>Annuler</button>
          <button
            className={`modal-save ${saved ? 'saved' : ''} ${!form.title.trim() ? 'disabled' : ''}`}
            onClick={handleSave}
            disabled={!form.title.trim()}
            style={!saved ? { background: form.color, boxShadow: `0 0 20px ${form.color}44` } : {}}
          >
            {saved ? (
              <><Check size={14} strokeWidth={2.5} /> Créé !</>
            ) : (
              <>Créer l'événement</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}