import React, { useEffect, useState } from 'react';
import {
  Search, Filter, Plus, Mail, Phone,
  MoreHorizontal, ArrowUpDown, Building2, ExternalLink,
  X, Check, User, Globe, Tag, Expand
} from 'lucide-react';
import Topbar from '../components/layout/Topbar';
import Badge from '../components/ui/Badge';
import ClientDetailModal from '../components/ui/ClientDetailModal';
import { getAllCustomers } from '../api/customers'
//import { clients } from '../data/mockData';
import './Clients.css';
import { getStatusCustomers } from '../api/status';

const INDUSTRIES = ['SaaS', 'Marketing', 'Manufacturing', 'Consulting', 'Finance', 'Design', 'Tech', 'E-commerce', 'Santé', 'Éducation', 'Immobilier', 'Autre'];
const COLORS = ['#3d7fff', '#a78bfa', '#2dd4a0', '#f5c842', '#fb923c', '#ff4d6a'];

function NewClientModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    name: '', contact: '', email: '', phone: '',
    industry: 'SaaS', status: 'prospect',
    address: '', website: '', notes: '',
    color: '#3d7fff',
  });
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = 'Le nom est requis';
    if (!form.contact.trim()) e.contact = 'Le contact est requis';
    if (!form.email.trim())   e.email   = 'L\'email est requis';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email invalide';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    const initials = form.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    onSave({
      id: Date.now(),
      ...form,
      avatar: initials,
      value: 0,
      deals: 0,
      lastContact: new Date().toISOString().slice(0, 10),
    });
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 900);
  };

  // Close on backdrop
  const onBackdrop = (e) => { if (e.target === e.currentTarget) onClose(); };

  return (
    <div className="modal-backdrop" onClick={onBackdrop}>
      <div className="new-client-modal fade-in">

        {/* Header */}
        <div className="ncm-header">
          <div className="ncm-header-left">
            <div className="ncm-avatar-preview" style={{ background: form.color + '22', color: form.color }}>
              {form.name ? form.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : <User size={16} />}
            </div>
            <div>
              <h2 className="ncm-title">Nouveau client</h2>
              <p className="ncm-sub">Renseignez les informations de l'entreprise</p>
            </div>
          </div>
          <button className="ncm-close" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="ncm-body">
          {/* Couleur */}
          <div className="ncm-color-row">
            <span className="ncm-label">Couleur</span>
            <div className="ncm-colors">
              {COLORS.map(c => (
                <button
                  key={c}
                  className={`ncm-color-dot ${form.color === c ? 'selected' : ''}`}
                  style={{ background: c }}
                  onClick={() => set('color', c)}
                />
              ))}
            </div>
          </div>

          {/* Section : Entreprise */}
          <div className="ncm-section-title">Entreprise</div>
          <div className="ncm-grid-2">
            <div className="ncm-field full">
              <label>Nom de l'entreprise *</label>
              <input
                placeholder="Ex: Nexus Technologies"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                className={errors.name ? 'error' : ''}
                autoFocus
              />
              {errors.name && <span className="ncm-error">{errors.name}</span>}
            </div>
            <div className="ncm-field">
              <label>Secteur</label>
              <select value={form.industry} onChange={e => set('industry', e.target.value)}>
                {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div className="ncm-field">
              <label>Statut</label>
              <select value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="prospect">Prospect</option>
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
              </select>
            </div>
            <div className="ncm-field">
              <label>Site web</label>
              <div className="ncm-input-icon">
                <Globe size={13} />
                <input placeholder="https://..." value={form.website} onChange={e => set('website', e.target.value)} />
              </div>
            </div>
            <div className="ncm-field full">
              <label>Adresse</label>
              <input placeholder="12 Rue de la Paix, 75001 Paris" value={form.address} onChange={e => set('address', e.target.value)} />
            </div>
          </div>

          {/* Section : Contact */}
          <div className="ncm-section-title">Contact principal</div>
          <div className="ncm-grid-2">
            <div className="ncm-field full">
              <label>Nom du contact *</label>
              <input
                placeholder="Ex: Sarah Chen"
                value={form.contact}
                onChange={e => set('contact', e.target.value)}
                className={errors.contact ? 'error' : ''}
              />
              {errors.contact && <span className="ncm-error">{errors.contact}</span>}
            </div>
            <div className="ncm-field">
              <label>Email *</label>
              <div className="ncm-input-icon">
                <Mail size={13} />
                <input
                  type="email"
                  placeholder="email@entreprise.fr"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  className={errors.email ? 'error' : ''}
                />
              </div>
              {errors.email && <span className="ncm-error">{errors.email}</span>}
            </div>
            <div className="ncm-field">
              <label>Téléphone</label>
              <div className="ncm-input-icon">
                <Phone size={13} />
                <input placeholder="+33 6 12 34 56 78" value={form.phone} onChange={e => set('phone', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="ncm-section-title">Notes</div>
          <div className="ncm-field">
            <textarea
              rows={3}
              placeholder="Informations complémentaires, contexte, origine du contact..."
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="ncm-footer">
          <button className="ncm-cancel" onClick={onClose}>Annuler</button>
          <button
            className={`ncm-save ${saved ? 'saved' : ''}`}
            onClick={handleSave}
            style={!saved ? { background: form.color, boxShadow: `0 0 20px ${form.color}44` } : {}}
          >
            {saved
              ? <><Check size={14} strokeWidth={2.5} /> Client créé !</>
              : <><Plus size={14} /> Créer le client</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Clients() {
  const [clientList, setClientList] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState({ id: 0, name: 'all' });
  const [activeClient, setActiveClient] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [detailClient, setDetailClient] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const customers = await getAllCustomers(); // ta fonction async
        const status = await getStatusCustomers();
        setStatusList([{ id: 0, name: 'all' }, ...status]);
        setClientList(customers);
      } catch (err) {
        console.error('Erreur lors du chargement des clients', err);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);
 
  const filtered = clientList.filter(c => filterStatus.name === 'all' || c.status === filterStatus.name)
    //.filter(c =>
    //  c.name.toLowerCase().includes(search.toLowerCase()) ||
    //  c.contact.toLowerCase().includes(search.toLowerCase()) ||
    //  c.email.toLowerCase().includes(search.toLowerCase())
    //);
  const selected = activeClient ? clientList.find(c => c.id === activeClient) : null;
  const handleSave = (newClient) => {
    setClientList(prev => [...prev, newClient]);
  };

  return (
    <div className="page">
      <Topbar title="Clients" subtitle={`${clientList.length} entreprises enregistrées`} />

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
            {statusList.map(s => (
              <button
                key={s}
                className={`filter-tab ${filterStatus?.id === s.id ? 'active' : ''}`}
                onClick={() => setFilterStatus(s)}
              >
                {s["name"]}
              </button>
            ))}
          </div>

          <button className="icon-btn">
            <Filter size={14} /> Filtres
          </button>

          {/* Bouton nouveau client */}
          <button className="new-client-btn" onClick={() => setShowModal(true)}>
            <Plus size={14} strokeWidth={2.5} />
            Nouveau client
          </button>
        </div>

        <div className={`clients-layout ${selected ? 'with-detail' : ''}`}>
          <div className="clients-table-card">
            <table className="clients-table">
              <thead>
                <tr>
                  <th><button className="th-sort">Entreprise <ArrowUpDown size={11} /></button></th>
                  <th>Contact</th>
                  <th>Statut</th>
                  <th>Secteur</th>
                  <th><button className="th-sort">Valeur <ArrowUpDown size={11} /></button></th>
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
                        <div className="client-avatar" style={{ background: client.color + '22', color: client.color }}>
                          {/*client.avatar*/}
                        </div>
                        <div>
                          <p className="client-name">{client.customer_name}</p>
                          <p className="client-email">{client.contact_mail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="client-contact">{client.contact_name}</td>
                    <td><Badge type={client.status} /></td>
                    <td>
                      <span className="client-industry">
                        <Building2 size={11} /> {client.industry}
                      </span>
                    </td>
                  <td className="mono client-value">
                    {(client.deals || [])
                      .reduce((sum, deal) => sum + Number(deal.amount || 0), 0)
                      .toLocaleString('fr-FR')} €
                  </td>
                    <td className="client-date">{new Date(client.lastContactDate).toLocaleDateString('fr-FR')}</td>
                    <td>
                      <div className="row-actions-group" onClick={e => e.stopPropagation()}>
                        <button
                          className="row-action expand-btn"
                          title="Voir le profil complet"
                          onClick={() => setDetailClient(client)}
                        >
                          <Expand size={13} />
                        </button>
                        <button className="row-action">
                          <MoreHorizontal size={14} />
                        </button>
                      </div>
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

          {selected && (
            <div className="client-detail fade-in">
              <div className="detail-header">
                <div className="detail-avatar" style={{ background: selected.color + '22', color: selected.color }}>
                  {/*selected.avatar*/}
                </div>
                <div className="detail-title">
                  <h3>{selected.customer_name}</h3>
                  <p>{selected.industry}</p>
                </div>
                <button className="detail-external"><ExternalLink size={13} /></button>
              </div>

              <Badge type={selected.status} />

              <div className="detail-section">
                <p className="detail-section-label">Contact principal</p>
                <p className="detail-contact-name">{selected.contact_name}</p>
                <div className="detail-contact-links">
                  <a href={`mailto:${selected.contact_email}`} className="contact-link"><Mail size={12} /> {selected.contact_email}</a>
                  <a href={`tel:${selected.contact_phone}`} className="contact-link"><Phone size={12} /> {selected.contact_phone}</a>
                </div>
              </div>

              <div className="detail-metrics">
                <div className="metric">
                  <p className="metric-label">Valeur totale</p>
                  <p className="metric-value mono">{(selected.deals || [])
                      .reduce((sum, deal) => sum + Number(deal.amount || 0), 0)
                      .toLocaleString('fr-FR')} €</p>
                </div>
                <div className="metric">
                  <p className="metric-label">Deals</p>
                  <p className="metric-value">{selected.deals.length}</p>
                </div>
              </div>

              <div className="detail-section">
                <p className="detail-section-label">Dernier contact</p>
                <p className="detail-value">{new Date(selected.lastContactDate).toLocaleDateString('fr-FR')}</p>
              </div>

              <div className="detail-actions">
                <button className="detail-btn primary"><Mail size={13} /> Envoyer un email</button>
                <button
                  className="detail-btn secondary"
                  onClick={() => setDetailClient(selected)}
                >
                  <Expand size={13} /> Profil complet
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <NewClientModal
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}

      {detailClient && (
        <ClientDetailModal
          client={detailClient}
          onClose={() => setDetailClient(null)}
        />
      )}
    </div>
  );
}