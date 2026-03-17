import React, { useState } from 'react';
import {
  Mail, Phone, MapPin, TrendingUp, CheckSquare,
  MoreHorizontal, Plus, Users, Award, Target
} from 'lucide-react';
import Topbar from '../components/layout/Topbar';
import { teamMembers } from '../data/mockDataExtra';
import './Equipe.css';

const statusConfig = {
  active: { label: 'Actif', color: 'var(--green)' },
  vacation: { label: 'Congé', color: 'var(--yellow)' },
  inactive: { label: 'Inactif', color: 'var(--text-muted)' },
};

const departments = ['Tous', ...new Set(teamMembers.map(m => m.department))];

function MemberCard({ member, onClick, selected }) {
  const status = statusConfig[member.status];
  return (
    <div
      className={`member-card ${selected ? 'selected' : ''}`}
      onClick={() => onClick(member)}
    >
      <div className="member-card-top">
        <div className="member-card-avatar" style={{ background: member.color + '22', color: member.color }}>
          {member.avatar}
          <span className="member-status-dot" style={{ background: status.color }} />
        </div>
        <button className="member-menu" onClick={e => e.stopPropagation()}>
          <MoreHorizontal size={14} />
        </button>
      </div>

      <div className="member-card-info">
        <p className="member-card-name">{member.name}</p>
        <p className="member-card-role">{member.role}</p>
        <p className="member-card-dept">{member.department}</p>
      </div>

      <div className="member-card-stats">
        {member.deals > 0 && (
          <div className="member-stat">
            <TrendingUp size={11} />
            <span>{member.deals} deals</span>
          </div>
        )}
        <div className="member-stat">
          <CheckSquare size={11} />
          <span>{member.tasks} tâches</span>
        </div>
        {member.revenue > 0 && (
          <div className="member-stat revenue">
            <span>{(member.revenue / 1000).toFixed(0)}k €</span>
          </div>
        )}
      </div>

      <div className="member-card-footer">
        <a href={`mailto:${member.email}`} className="member-contact-btn" onClick={e => e.stopPropagation()}>
          <Mail size={12} />
        </a>
        <a href={`tel:${member.phone}`} className="member-contact-btn" onClick={e => e.stopPropagation()}>
          <Phone size={12} />
        </a>
        <span className="member-location">
          <MapPin size={10} /> {member.location}
        </span>
      </div>
    </div>
  );
}

function MemberDetail({ member, onClose }) {
  const status = statusConfig[member.status];

  return (
    <div className="member-detail fade-in">
      <div className="member-detail-header">
        <div className="member-detail-avatar" style={{ background: member.color + '22', color: member.color }}>
          {member.avatar}
        </div>
        <div className="member-detail-title">
          <h3>{member.name}</h3>
          <p>{member.role}</p>
          <span className="member-detail-status" style={{ color: status.color }}>
            ● {status.label}
          </span>
        </div>
      </div>

      <div className="member-detail-metrics">
        <div className="detail-metric">
          <TrendingUp size={13} color="var(--accent)" />
          <div>
            <p className="detail-metric-value">{member.deals}</p>
            <p className="detail-metric-label">Deals actifs</p>
          </div>
        </div>
        <div className="detail-metric">
          <Award size={13} color="var(--green)" />
          <div>
            <p className="detail-metric-value mono">{member.revenue > 0 ? `${(member.revenue / 1000).toFixed(0)}k €` : '—'}</p>
            <p className="detail-metric-label">CA généré</p>
          </div>
        </div>
        <div className="detail-metric">
          <Target size={13} color="var(--yellow)" />
          <div>
            <p className="detail-metric-value">{member.tasks}</p>
            <p className="detail-metric-label">Tâches</p>
          </div>
        </div>
      </div>

      <div className="member-detail-section">
        <p className="detail-section-label">Département</p>
        <p className="detail-value">{member.department}</p>
      </div>

      <div className="member-detail-section">
        <p className="detail-section-label">Contact</p>
        <div className="detail-contact-links">
          <a href={`mailto:${member.email}`} className="contact-link">
            <Mail size={12} /> {member.email}
          </a>
          <a href={`tel:${member.phone}`} className="contact-link">
            <Phone size={12} /> {member.phone}
          </a>
          <p className="contact-link" style={{ color: 'var(--text-secondary)' }}>
            <MapPin size={12} /> {member.location}
          </p>
        </div>
      </div>

      <div className="member-detail-section">
        <p className="detail-section-label">Membre depuis</p>
        <p className="detail-value">{new Date(member.joinDate).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="member-detail-actions">
        <button className="detail-action-btn primary">
          <Mail size={13} /> Envoyer un message
        </button>
        <button className="detail-action-btn secondary" onClick={onClose}>
          Fermer
        </button>
      </div>
    </div>
  );
}

export default function Equipe() {
  const [selectedDept, setSelectedDept] = useState('Tous');
  const [selectedMember, setSelectedMember] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  const filtered = teamMembers.filter(m =>
    selectedDept === 'Tous' || m.department === selectedDept
  );

  const totalRevenue = teamMembers.reduce((s, m) => s + m.revenue, 0);
  const activeCount = teamMembers.filter(m => m.status === 'active').length;

  return (
    <div className="page">
      <Topbar title="Équipe" subtitle={`${teamMembers.length} collaborateurs`} />
      <div className="page-content">

        {/* Summary */}
        <div className="equipe-summary stagger">
          <div className="equipe-kpi">
            <Users size={16} color="var(--accent)" />
            <div>
              <p className="equipe-kpi-value">{teamMembers.length}</p>
              <p className="equipe-kpi-label">Collaborateurs</p>
            </div>
          </div>
          <div className="equipe-kpi">
            <div className="equipe-kpi-dot" style={{ background: 'var(--green)' }} />
            <div>
              <p className="equipe-kpi-value">{activeCount}</p>
              <p className="equipe-kpi-label">Actifs</p>
            </div>
          </div>
          <div className="equipe-kpi">
            <TrendingUp size={16} color="var(--purple)" />
            <div>
              <p className="equipe-kpi-value mono">{(totalRevenue / 1000).toFixed(0)}k €</p>
              <p className="equipe-kpi-label">CA équipe commerciale</p>
            </div>
          </div>
          <div className="equipe-kpi">
            <Award size={16} color="var(--yellow)" />
            <div>
              <p className="equipe-kpi-value">{teamMembers.reduce((s, m) => s + m.deals, 0)}</p>
              <p className="equipe-kpi-label">Deals au total</p>
            </div>
          </div>
          <button className="equipe-invite-btn">
            <Plus size={14} /> Inviter un membre
          </button>
        </div>

        {/* Controls */}
        <div className="equipe-controls">
          <div className="filter-tabs">
            {departments.map(dept => (
              <button
                key={dept}
                className={`filter-tab ${selectedDept === dept ? 'active' : ''}`}
                onClick={() => setSelectedDept(dept)}
              >
                {dept}
              </button>
            ))}
          </div>

          <div className="view-tabs">
            <button className={`view-tab ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>Grille</button>
            <button className={`view-tab ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>Liste</button>
          </div>
        </div>

        {/* Content */}
        <div className={`equipe-layout ${selectedMember ? 'with-detail' : ''}`}>
          {viewMode === 'grid' ? (
            <div className="members-grid">
              {filtered.map(member => (
                <MemberCard
                  key={member.id}
                  member={member}
                  selected={selectedMember?.id === member.id}
                  onClick={m => setSelectedMember(selectedMember?.id === m.id ? null : m)}
                />
              ))}
            </div>
          ) : (
            <div className="members-table-card">
              <table className="members-table">
                <thead>
                  <tr>
                    <th>Collaborateur</th>
                    <th>Rôle</th>
                    <th>Département</th>
                    <th>Localisation</th>
                    <th>CA</th>
                    <th>Statut</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(member => {
                    const status = statusConfig[member.status];
                    return (
                      <tr key={member.id} onClick={() => setSelectedMember(selectedMember?.id === member.id ? null : member)} style={{ cursor: 'pointer' }}>
                        <td>
                          <div className="member-table-cell">
                            <div className="member-table-avatar" style={{ background: member.color + '22', color: member.color }}>
                              {member.avatar}
                            </div>
                            <div>
                              <p className="member-table-name">{member.name}</p>
                              <p className="member-table-email">{member.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="member-table-role">{member.role}</td>
                        <td><span className="member-table-dept">{member.department}</span></td>
                        <td className="member-table-location"><MapPin size={11} /> {member.location}</td>
                        <td className="mono member-table-revenue">{member.revenue > 0 ? `${(member.revenue / 1000).toFixed(0)}k €` : '—'}</td>
                        <td>
                          <span className="member-status-pill" style={{ color: status.color, background: status.color + '18' }}>
                            ● {status.label}
                          </span>
                        </td>
                        <td>
                          <button className="row-action"><MoreHorizontal size={14} /></button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {selectedMember && (
            <MemberDetail
              member={selectedMember}
              onClose={() => setSelectedMember(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
