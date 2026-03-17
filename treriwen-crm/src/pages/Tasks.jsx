import React, { useState } from 'react';
import {
  CheckCircle2, Circle, Clock, Mail, Phone,
  Calendar, FileText, Eye, Plus, Filter
} from 'lucide-react';
import Topbar from '../components/layout/Topbar';
import Badge from '../components/ui/Badge';
import { tasks } from '../data/mockData';
import './Tasks.css';

const typeIcons = {
  email: Mail,
  call: Phone,
  meeting: Calendar,
  document: FileText,
  review: Eye,
};

const typeColors = {
  email: '#3d7fff',
  call: '#2dd4a0',
  meeting: '#a78bfa',
  document: '#f5c842',
  review: '#fb923c',
};

function TaskRow({ task, onToggle }) {
  const Icon = typeIcons[task.type] || FileText;
  const iconColor = typeColors[task.type] || 'var(--text-muted)';
  const isDone = task.status === 'done';

  const today = new Date().toISOString().slice(0, 10);
  const isOverdue = !isDone && task.dueDate < today;

  return (
    <div className={`task-row ${isDone ? 'done' : ''} ${isOverdue ? 'overdue' : ''}`}>
      <button
        className={`task-toggle ${isDone ? 'checked' : ''}`}
        onClick={() => onToggle(task.id)}
      >
        {isDone
          ? <CheckCircle2 size={18} strokeWidth={2} />
          : <Circle size={18} strokeWidth={1.5} />
        }
      </button>

      <div
        className="task-type-icon"
        style={{ background: iconColor + '18', color: iconColor }}
      >
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

export default function Tasks() {
  const [taskList, setTaskList] = useState(tasks);
  const [filter, setFilter] = useState('all');

  const toggle = (id) => {
    setTaskList(prev => prev.map(t =>
      t.id === id
        ? { ...t, status: t.status === 'done' ? 'todo' : 'done' }
        : t
    ));
  };

  const filtered = taskList.filter(t => {
    if (filter === 'all') return true;
    if (filter === 'todo') return t.status !== 'done';
    if (filter === 'done') return t.status === 'done';
    if (filter === 'high') return t.priority === 'high';
    return true;
  });

  const todayTasks = filtered.filter(t => t.dueDate === new Date().toISOString().slice(0, 10));
  const upcomingTasks = filtered.filter(t => t.dueDate > new Date().toISOString().slice(0, 10) && t.status !== 'done');
  const doneTasks = filtered.filter(t => t.status === 'done');
  const overdueTasks = filtered.filter(t => t.dueDate < new Date().toISOString().slice(0, 10) && t.status !== 'done');

  const completionRate = Math.round(
    (taskList.filter(t => t.status === 'done').length / taskList.length) * 100
  );

  return (
    <div className="page">
      <Topbar
        title="Tâches"
        subtitle={`${taskList.filter(t => t.status !== 'done').length} tâches en attente`}
      />

      <div className="page-content">
        {/* Progress Header */}
        <div className="tasks-overview stagger">
          <div className="tasks-progress-card">
            <div className="tasks-progress-info">
              <p className="tasks-progress-label">Progression du jour</p>
              <p className="tasks-progress-value">{completionRate}%</p>
            </div>
            <div className="tasks-progress-bar">
              <div
                className="tasks-progress-fill"
                style={{ width: `${completionRate}%` }}
              />
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

        {/* Filter Bar */}
        <div className="controls-bar">
          <div className="filter-tabs">
            {[
              { id: 'all', label: 'Toutes' },
              { id: 'todo', label: 'À faire' },
              { id: 'high', label: 'Urgentes' },
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

          <button className="icon-btn" style={{ marginLeft: 'auto' }}>
            <Plus size={14} /> Nouvelle tâche
          </button>
        </div>

        {/* Task Sections */}
        <div className="tasks-sections">
          {overdueTasks.length > 0 && (
            <div className="task-section">
              <div className="task-section-header overdue">
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
    </div>
  );
}
