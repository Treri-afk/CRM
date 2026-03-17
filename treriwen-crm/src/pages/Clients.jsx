import React, { useState } from 'react';
import {
  Search, Filter, Plus, Mail, Phone,
  MoreHorizontal, ArrowUpDown, Building2, ExternalLink
} from 'lucide-react';
import Topbar from '../components/layout/Topbar';
import Badge from '../components/ui/Badge';
import { clients } from '../data/mockData';
import './Clients.css';

export default function Clients() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortField, setSortField] = useState('name');
  const [activeClient, setActiveClient] = useState(null);

  const filtered = clients
    .filter(c => filterStatus === 'all' || c.status === filterStatus)
    .filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.contact.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
    );

  const selected = activeClient ? clients.find(c => c.id === activeClient) : null;

  return (
    <div className="page">
      <Topbar
        title="Clients"
        subtitle={`${clients.length} entreprises enregistrées`}
      />

      <div className="page-content">
        {/* Controls */}
        <div className="controls-bar">
          <div className="search-field">
            <Search size={14} />
            <input
              placeholder="Rechercher un client..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-tabs">
            {['all', 'active', 'prospect', 'inactive'].map(s => (
              <button
                key={s}
                className={`filter-tab ${filterStatus === s ? 'active' : ''}`}
                onClick={() => setFilterStatus(s)}
              >
                {s === 'all' ? 'Tous' : s === 'active' ? 'Actifs' : s === 'prospect' ? 'Prospects' : 'Inactifs'}
              </button>
            ))}
          </div>

          <button className="icon-btn">
            <Filter size={14} /> Filtres
          </button>
        </div>

        <div className={`clients-layout ${selected ? 'with-detail' : ''}`}>
          {/* Table */}
          <div className="clients-table-card">
            <table className="clients-table">
              <thead>
                <tr>
                  <th>
                    <button className="th-sort" onClick={() => setSortField('name')}>
                      Entreprise <ArrowUpDown size={11} />
                    </button>
                  </th>
                  <th>Contact</th>
                  <th>Statut</th>
                  <th>Secteur</th>
                  <th>
                    <button className="th-sort">
                      Valeur <ArrowUpDown size={11} />
                    </button>
                  </th>
                  <th>Dernier contact</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filtered.map(client => (
                  <tr
                    key={client.id}
                    className={activeClient === client.id ? 'selected' : ''}
                    onClick={() => setActiveClient(activeClient === client.id ? null : client.id)}
                  >
                    <td>
                      <div className="client-name-cell">
                        <div
                          className="client-avatar"
                          style={{ background: client.color + '22', color: client.color }}
                        >
                          {client.avatar}
                        </div>
                        <div>
                          <p className="client-name">{client.name}</p>
                          <p className="client-email">{client.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="client-contact">{client.contact}</td>
                    <td><Badge type={client.status} /></td>
                    <td>
                      <span className="client-industry">
                        <Building2 size={11} />
                        {client.industry}
                      </span>
                    </td>
                    <td className="mono client-value">
                      {client.value.toLocaleString('fr-FR')} €
                    </td>
                    <td className="client-date">{client.lastContact}</td>
                    <td>
                      <button className="row-action" onClick={e => e.stopPropagation()}>
                        <MoreHorizontal size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="empty-state">
                <p>Aucun client trouvé</p>
              </div>
            )}
          </div>

          {/* Client Detail Panel */}
          {selected && (
            <div className="client-detail fade-in">
              <div className="detail-header">
                <div
                  className="detail-avatar"
                  style={{ background: selected.color + '22', color: selected.color }}
                >
                  {selected.avatar}
                </div>
                <div className="detail-title">
                  <h3>{selected.name}</h3>
                  <p>{selected.industry}</p>
                </div>
                <button className="detail-external">
                  <ExternalLink size={13} />
                </button>
              </div>

              <Badge type={selected.status} />

              <div className="detail-section">
                <p className="detail-section-label">Contact principal</p>
                <p className="detail-contact-name">{selected.contact}</p>
                <div className="detail-contact-links">
                  <a href={`mailto:${selected.email}`} className="contact-link">
                    <Mail size={12} /> {selected.email}
                  </a>
                  <a href={`tel:${selected.phone}`} className="contact-link">
                    <Phone size={12} /> {selected.phone}
                  </a>
                </div>
              </div>

              <div className="detail-metrics">
                <div className="metric">
                  <p className="metric-label">Valeur totale</p>
                  <p className="metric-value mono">
                    {selected.value.toLocaleString('fr-FR')} €
                  </p>
                </div>
                <div className="metric">
                  <p className="metric-label">Deals</p>
                  <p className="metric-value">{selected.deals}</p>
                </div>
              </div>

              <div className="detail-section">
                <p className="detail-section-label">Dernier contact</p>
                <p className="detail-value">{selected.lastContact}</p>
              </div>

              <div className="detail-actions">
                <button className="detail-btn primary">
                  <Mail size={13} /> Envoyer un email
                </button>
                <button className="detail-btn secondary">
                  <Plus size={13} /> Nouveau deal
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
