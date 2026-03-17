import React, { useState } from 'react';
import {
  ChevronLeft, ChevronRight, Plus, Clock,
  MapPin, Users, Video, Phone, Calendar
} from 'lucide-react';
import Topbar from '../components/layout/Topbar';
import AddEventModal from '../components/ui/AddEventModal';
import { calendarEvents as initialEvents } from '../data/mockDataExtra';
import './Agenda.css';

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const MONTHS = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];

const typeConfig = {
  meeting: { label: 'Réunion', icon: Users },
  call: { label: 'Appel', icon: Phone },
  demo: { label: 'Démo', icon: Video },
  internal: { label: 'Interne', icon: Calendar },
  training: { label: 'Formation', icon: Calendar },
  negotiation: { label: 'Négociation', icon: Calendar },
};

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Monday = 0
}

export default function Agenda() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(today.toISOString().slice(0, 10));
  const [view, setView] = useState('month');
  const [events, setEvents] = useState(initialEvents);
  const [modalOpen, setModalOpen] = useState(false);

  const handleSaveEvent = (newEvent) => {
    setEvents(prev => [...prev, newEvent]);
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  const getEventsForDate = (dateStr) =>
    events.filter(e => e.date === dateStr);

  const selectedEvents = getEventsForDate(selectedDate);

  // Build calendar grid
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    cells.push({ day: d, dateStr });
  }

  // Week view: get current week
  const getWeekDates = (baseDate) => {
    const d = new Date(baseDate);
    const day = d.getDay() || 7;
    d.setDate(d.getDate() - day + 1);
    return Array.from({ length: 7 }, (_, i) => {
      const nd = new Date(d);
      nd.setDate(d.getDate() + i);
      return nd.toISOString().slice(0, 10);
    });
  };

  const weekDates = getWeekDates(selectedDate);
  const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8h–19h

  return (
    <div className="page">
      <Topbar title="Agenda" subtitle={`${MONTHS[currentMonth]} ${currentYear}`} />
      <div className="page-content">
        <div className="agenda-layout">

          {/* Left: Calendar + Event form */}
          <div className="agenda-sidebar">
            {/* Mini Calendar */}
            <div className="mini-cal-card">
              <div className="mini-cal-header">
                <button className="cal-nav-btn" onClick={prevMonth}><ChevronLeft size={14} /></button>
                <span className="mini-cal-title">{MONTHS[currentMonth]} {currentYear}</span>
                <button className="cal-nav-btn" onClick={nextMonth}><ChevronRight size={14} /></button>
              </div>
              <div className="mini-cal-days-header">
                {DAYS.map(d => <span key={d}>{d}</span>)}
              </div>
              <div className="mini-cal-grid">
                {cells.map((cell, i) => {
                  if (!cell) return <span key={`empty-${i}`} />;
                  const isToday = cell.dateStr === today.toISOString().slice(0, 10);
                  const isSelected = cell.dateStr === selectedDate;
                  const hasEvents = getEventsForDate(cell.dateStr).length > 0;
                  return (
                    <button
                      key={cell.dateStr}
                      className={`mini-cal-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedDate(cell.dateStr)}
                    >
                      {cell.day}
                      {hasEvents && <span className="cal-dot" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Day Events */}
            <div className="day-events-card">
              <div className="day-events-header">
                <p className="day-events-title">
                  {new Date(selectedDate + 'T00:00:00').toLocaleDateString('fr-FR', {
                    weekday: 'long', day: 'numeric', month: 'long'
                  })}
                </p>
                <button className="day-add-btn" onClick={() => setModalOpen(true)}><Plus size={13} /></button>
              </div>

              {selectedEvents.length === 0 ? (
                <div className="day-events-empty">
                  <Calendar size={24} strokeWidth={1} color="var(--text-muted)" />
                  <p>Aucun événement</p>
                </div>
              ) : (
                <div className="day-events-list">
                  {selectedEvents.map(ev => {
                    const Icon = typeConfig[ev.type]?.icon || Calendar;
                    return (
                      <div key={ev.id} className="day-event-item" style={{ borderLeftColor: ev.color }}>
                        <div className="day-event-time mono">{ev.time}</div>
                        <div className="day-event-info">
                          <p className="day-event-title">{ev.title}</p>
                          <div className="day-event-meta">
                            <span><Clock size={10} /> {ev.duration} min</span>
                            {ev.location && <span><MapPin size={10} /> {ev.location}</span>}
                          </div>
                          {ev.client && <p className="day-event-client">{ev.client}</p>}
                        </div>
                        <div className="day-event-type-icon" style={{ background: ev.color + '22', color: ev.color }}>
                          <Icon size={11} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right: Main View */}
          <div className="agenda-main">
            {/* View Toggle */}
            <div className="agenda-controls">
              <div className="view-tabs">
                <button className={`view-tab ${view === 'month' ? 'active' : ''}`} onClick={() => setView('month')}>Mois</button>
                <button className={`view-tab ${view === 'week' ? 'active' : ''}`} onClick={() => setView('week')}>Semaine</button>
              </div>
              <button className="agenda-today-btn" onClick={() => {
                setSelectedDate(today.toISOString().slice(0, 10));
                setCurrentMonth(today.getMonth());
                setCurrentYear(today.getFullYear());
              }}>
                Aujourd'hui
              </button>
            </div>

            {/* Month View */}
            {view === 'month' && (
              <div className="month-view">
                <div className="month-header">
                  {DAYS.map(d => <div key={d} className="month-day-label">{d}</div>)}
                </div>
                <div className="month-grid">
                  {cells.map((cell, i) => {
                    if (!cell) return <div key={`e-${i}`} className="month-cell empty" />;
                    const isToday = cell.dateStr === today.toISOString().slice(0, 10);
                    const isSelected = cell.dateStr === selectedDate;
                    const dayEvents = getEventsForDate(cell.dateStr);
                    return (
                      <div
                        key={cell.dateStr}
                        className={`month-cell ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                        onClick={() => setSelectedDate(cell.dateStr)}
                      >
                        <span className="month-cell-num">{cell.day}</span>
                        <div className="month-cell-events">
                          {dayEvents.slice(0, 2).map(ev => (
                            <div
                              key={ev.id}
                              className="month-event-pill"
                              style={{ background: ev.color + '22', color: ev.color, borderColor: ev.color + '44' }}
                            >
                              {ev.time} {ev.title}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="month-event-more">+{dayEvents.length - 2} autres</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Week View */}
            {view === 'week' && (
              <div className="week-view">
                <div className="week-header">
                  <div className="week-time-gutter" />
                  {weekDates.map(date => {
                    const d = new Date(date + 'T00:00:00');
                    const isToday = date === today.toISOString().slice(0, 10);
                    return (
                      <div
                        key={date}
                        className={`week-day-header ${isToday ? 'today' : ''}`}
                        onClick={() => setSelectedDate(date)}
                      >
                        <span className="week-day-label">{DAYS[d.getDay() === 0 ? 6 : d.getDay() - 1]}</span>
                        <span className={`week-day-num ${isToday ? 'today' : ''}`}>{d.getDate()}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="week-body">
                  {hours.map(hour => (
                    <div key={hour} className="week-row">
                      <div className="week-time mono">{String(hour).padStart(2, '0')}:00</div>
                      {weekDates.map(date => {
                        const evs = getEventsForDate(date).filter(e => {
                          const evHour = parseInt(e.time.split(':')[0]);
                          return evHour === hour;
                        });
                        return (
                          <div key={date} className="week-cell">
                            {evs.map(ev => (
                              <div
                                key={ev.id}
                                className="week-event"
                                style={{
                                  background: ev.color + '18',
                                  borderLeft: `3px solid ${ev.color}`,
                                  color: ev.color,
                                }}
                              >
                                <p className="week-event-title">{ev.title}</p>
                                <p className="week-event-time mono">{ev.time} · {ev.duration}min</p>
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AddEventModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveEvent}
        defaultDate={selectedDate}
      />
    </div>
  );
}