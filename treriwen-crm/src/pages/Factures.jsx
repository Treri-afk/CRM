import React, { useState } from 'react';
import {
  Plus, Trash2, Eye, Download, Send, Copy,
  ArrowLeft, Check, AlertCircle, CheckCircle2, Clock
} from 'lucide-react';
import Topbar from '../components/layout/Topbar';
import { factures as facturesData } from '../data/mockDataExtra';
import { clients } from '../data/mockData';
import './Documents.css';

const statusConfig = {
  draft: { label: 'Brouillon', cls: 'muted' },
  sent: { label: 'Envoyée', cls: 'blue' },
  paid: { label: 'Payée', cls: 'green' },
  overdue: { label: 'En retard', cls: 'red' },
  cancelled: { label: 'Annulée', cls: 'muted' },
};

function FactureEditor({ doc, onBack, isNew }) {
  const [form, setForm] = useState(doc || {
    id: `FAC-2026-00${facturesData.length + 1}`,
    client: '',
    contact: '',
    email: '',
    address: '',
    date: new Date().toISOString().slice(0, 10),
    dueDate: '',
    status: 'draft',
    devisRef: '',
    items: [{ id: 1, description: '', qty: 1, unit: 'forfait', price: 0 }],
    taxRate: 20,
    notes: '',
    paidAt: null,
  });
  const [saved, setSaved] = useState(false);

  const updateItem = (id, field, value) => {
    setForm(f => ({
      ...f,
      items: f.items.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const addItem = () => {
    setForm(f => ({
      ...f,
      items: [...f.items, { id: Date.now(), description: '', qty: 1, unit: 'forfait', price: 0 }]
    }));
  };

  const removeItem = (id) => {
    setForm(f => ({ ...f, items: f.items.filter(i => i.id !== id) }));
  };

  const subtotal = form.items.reduce((s, i) => s + (Number(i.qty) * Number(i.price)), 0);
  const tax = subtotal * (form.taxRate / 100);
  const total = subtotal + tax;

  return (
    <div className="doc-editor-layout">
      <div className="doc-editor-panel">
        <div className="doc-editor-header">
          <button className="back-btn" onClick={onBack}>
            <ArrowLeft size={14} /> Retour
          </button>
          <div className="doc-editor-actions">
            {form.status !== 'paid' && (
              <button
                className="doc-action-btn success"
                onClick={() => setForm({ ...form, status: 'paid', paidAt: new Date().toISOString().slice(0, 10) })}
              >
                <CheckCircle2 size={13} /> Marquer payée
              </button>
            )}
            <button className={`doc-save-btn ${saved ? 'saved' : ''}`} onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}>
              {saved ? <><Check size={13} /> Sauvegardé</> : 'Sauvegarder'}
            </button>
            <button className="doc-action-btn primary">
              <Send size={13} /> Envoyer
            </button>
          </div>
        </div>

        {form.status === 'overdue' && (
          <div className="doc-alert overdue">
            <AlertCircle size={14} />
            <span>Cette facture est en retard de paiement. Échéance dépassée le {form.dueDate}.</span>
          </div>
        )}

        {form.status === 'paid' && (
          <div className="doc-alert paid">
            <CheckCircle2 size={14} />
            <span>Facture payée le {form.paidAt}.</span>
          </div>
        )}

        <div className="doc-form">
          <div className="doc-form-section">
            <h4 className="doc-form-title">Informations générales</h4>
            <div className="doc-form-grid">
              <div className="form-group">
                <label>Numéro</label>
                <input className="mono" value={form.id} onChange={e => setForm({ ...form, id: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Statut</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  <option value="draft">Brouillon</option>
                  <option value="sent">Envoyée</option>
                  <option value="paid">Payée</option>
                  <option value="overdue">En retard</option>
                  <option value="cancelled">Annulée</option>
                </select>
              </div>
              <div className="form-group">
                <label>Date d'émission</label>
                <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Date d'échéance</label>
                <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Référence devis</label>
                <input className="mono" value={form.devisRef || ''} onChange={e => setForm({ ...form, devisRef: e.target.value })} placeholder="DEV-2026-..." />
              </div>
            </div>
          </div>

          <div className="doc-form-section">
            <h4 className="doc-form-title">Client</h4>
            <div className="doc-form-grid">
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Entreprise</label>
                <select value={form.client} onChange={e => setForm({ ...form, client: e.target.value })}>
                  <option value="">Sélectionner un client</option>
                  {clients.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Contact</label>
                <input value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Adresse</label>
                <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
              </div>
            </div>
          </div>

          <div className="doc-form-section">
            <h4 className="doc-form-title">Prestations facturées</h4>
            <div className="doc-items-table">
              <div className="doc-items-header">
                <span style={{ flex: 3 }}>Description</span>
                <span style={{ flex: 1 }}>Qté</span>
                <span style={{ flex: 1 }}>Unité</span>
                <span style={{ flex: 1 }}>P.U. HT</span>
                <span style={{ flex: 1, textAlign: 'right' }}>Total HT</span>
                <span style={{ width: 32 }} />
              </div>
              {form.items.map((item) => (
                <div key={item.id} className="doc-item-row">
                  <input style={{ flex: 3 }} className="doc-item-input" placeholder="Description" value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)} />
                  <input style={{ flex: 1 }} className="doc-item-input mono" type="number" value={item.qty} onChange={e => updateItem(item.id, 'qty', e.target.value)} />
                  <select style={{ flex: 1 }} className="doc-item-input" value={item.unit} onChange={e => updateItem(item.id, 'unit', e.target.value)}>
                    <option value="forfait">forfait</option>
                    <option value="jours">jours</option>
                    <option value="heures">heures</option>
                    <option value="sessions">sessions</option>
                    <option value="mois">mois</option>
                    <option value="unité">unité</option>
                  </select>
                  <input style={{ flex: 1 }} className="doc-item-input mono" type="number" value={item.price} onChange={e => updateItem(item.id, 'price', e.target.value)} />
                  <span style={{ flex: 1, textAlign: 'right' }} className="doc-item-total mono">
                    {(item.qty * item.price).toLocaleString('fr-FR')} €
                  </span>
                  <button className="doc-item-remove" onClick={() => removeItem(item.id)}><Trash2 size={12} /></button>
                </div>
              ))}
              <button className="doc-add-line" onClick={addItem}><Plus size={13} /> Ajouter une ligne</button>
            </div>

            <div className="doc-totals">
              <div className="doc-total-row"><span>Sous-total HT</span><span className="mono">{subtotal.toLocaleString('fr-FR')} €</span></div>
              <div className="doc-total-row"><span>TVA ({form.taxRate}%)</span><span className="mono">{tax.toLocaleString('fr-FR')} €</span></div>
              <div className="doc-total-row total"><span>Total TTC</span><span className="mono">{total.toLocaleString('fr-FR')} €</span></div>
            </div>
          </div>

          <div className="doc-form-section">
            <h4 className="doc-form-title">Notes & conditions de paiement</h4>
            <textarea className="doc-notes" rows={3} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Mode de paiement, IBAN, pénalités de retard..." />
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="doc-preview-panel">
        <div className="doc-preview-toolbar">
          <span className="doc-preview-label">Aperçu</span>
          <button className="doc-preview-action"><Download size={13} /> Exporter PDF</button>
        </div>
        <div className="doc-preview-scroll">
          <div className="doc-pdf-page">
            <div className="pdf-header">
              <div className="pdf-company">
                <div className="pdf-logo">N</div>
                <div>
                  <p className="pdf-company-name">Nova SAS</p>
                  <p className="pdf-company-info">12 Rue de la Paix, 75001 Paris</p>
                  <p className="pdf-company-info">contact@nova.fr · SIRET: 123 456 789 00012</p>
                </div>
              </div>
              <div className="pdf-doc-info">
                <p className="pdf-doc-type">FACTURE</p>
                <p className="pdf-doc-num mono">{form.id}</p>
                <p className="pdf-doc-date">Émise le {form.date}</p>
                {form.dueDate && <p className="pdf-doc-date">Échéance : {form.dueDate}</p>}
                {form.devisRef && <p className="pdf-doc-date mono">Réf. {form.devisRef}</p>}
              </div>
            </div>
            <div className="pdf-client-block">
              <p className="pdf-section-label">Facturer à</p>
              <p className="pdf-client-name">{form.client || '— Entreprise —'}</p>
              <p className="pdf-client-detail">{form.contact}</p>
              <p className="pdf-client-detail">{form.email}</p>
              <p className="pdf-client-detail">{form.address}</p>
            </div>
            <table className="pdf-table">
              <thead>
                <tr>
                  <th style={{ flex: 3 }}>Description</th>
                  <th>Qté</th>
                  <th>Unité</th>
                  <th>P.U. HT</th>
                  <th style={{ textAlign: 'right' }}>Total HT</th>
                </tr>
              </thead>
              <tbody>
                {form.items.map(item => (
                  <tr key={item.id}>
                    <td style={{ flex: 3 }}>{item.description || '—'}</td>
                    <td>{item.qty}</td>
                    <td>{item.unit}</td>
                    <td className="mono">{Number(item.price).toLocaleString('fr-FR')} €</td>
                    <td className="mono" style={{ textAlign: 'right' }}>{(item.qty * item.price).toLocaleString('fr-FR')} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pdf-totals">
              <div className="pdf-total-row"><span>Sous-total HT</span><span className="mono">{subtotal.toLocaleString('fr-FR')} €</span></div>
              <div className="pdf-total-row"><span>TVA {form.taxRate}%</span><span className="mono">{tax.toLocaleString('fr-FR')} €</span></div>
              <div className="pdf-total-row final"><span>Total TTC</span><span className="mono">{total.toLocaleString('fr-FR')} €</span></div>
            </div>
            {form.notes && (
              <div className="pdf-notes">
                <p className="pdf-notes-title">Conditions de paiement</p>
                <p className="pdf-notes-text">{form.notes}</p>
              </div>
            )}
            <div className="pdf-footer">
              <p>Nova SAS — SAS au capital de 10 000 € — TVA Intracommunautaire: FR12 123456789</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Factures() {
  const [selected, setSelected] = useState(null);
  const [isNew, setIsNew] = useState(false);

  if (selected || isNew) {
    return (
      <div className="page">
        <Topbar title={isNew ? 'Nouvelle facture' : `Facture ${selected?.id}`} subtitle={selected?.client || ''} />
        <div className="page-content" style={{ padding: 0 }}>
          <FactureEditor doc={selected} isNew={isNew} onBack={() => { setSelected(null); setIsNew(false); }} />
        </div>
      </div>
    );
  }

  const totalPaid = facturesData.filter(f => f.status === 'paid').reduce((s, f) => {
    return s + f.items.reduce((ss, i) => ss + i.qty * i.price, 0) * 1.2;
  }, 0);
  const totalPending = facturesData.filter(f => f.status === 'sent').reduce((s, f) => {
    return s + f.items.reduce((ss, i) => ss + i.qty * i.price, 0) * 1.2;
  }, 0);
  const totalOverdue = facturesData.filter(f => f.status === 'overdue').reduce((s, f) => {
    return s + f.items.reduce((ss, i) => ss + i.qty * i.price, 0) * 1.2;
  }, 0);

  return (
    <div className="page">
      <Topbar title="Factures" subtitle={`${facturesData.length} factures`} />
      <div className="page-content">
        <div className="docs-summary stagger">
          <div className="doc-stat">
            <p className="doc-stat-value mono" style={{ color: 'var(--green)' }}>{totalPaid.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €</p>
            <p className="doc-stat-label">Encaissé</p>
          </div>
          <div className="doc-stat">
            <p className="doc-stat-value mono" style={{ color: 'var(--accent-bright)' }}>{totalPending.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €</p>
            <p className="doc-stat-label">En attente</p>
          </div>
          <div className="doc-stat">
            <p className="doc-stat-value mono" style={{ color: 'var(--red)' }}>{totalOverdue.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €</p>
            <p className="doc-stat-label">En retard</p>
          </div>
          <div className="doc-stat">
            <p className="doc-stat-value mono">{facturesData.filter(f => f.status === 'paid').length}/{facturesData.length}</p>
            <p className="doc-stat-label">Taux de recouvrement</p>
          </div>
          <button className="doc-new-btn" onClick={() => setIsNew(true)}>
            <Plus size={14} /> Nouvelle facture
          </button>
        </div>

        <div className="docs-table-card">
          <table className="docs-table">
            <thead>
              <tr>
                <th>Numéro</th>
                <th>Client</th>
                <th>Émission</th>
                <th>Échéance</th>
                <th>Montant TTC</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {facturesData.map(f => {
                const sub = f.items.reduce((s, i) => s + i.qty * i.price, 0);
                const ttc = sub * (1 + f.taxRate / 100);
                return (
                  <tr key={f.id} onClick={() => setSelected(f)} style={{ cursor: 'pointer' }}>
                    <td className="mono doc-id">{f.id}</td>
                    <td>
                      <p className="doc-client-name">{f.client}</p>
                      <p className="doc-contact">{f.contact}</p>
                    </td>
                    <td className="mono doc-date">{f.date}</td>
                    <td className="mono doc-date" style={f.status === 'overdue' ? { color: 'var(--red)' } : {}}>
                      {f.dueDate}
                    </td>
                    <td className="mono doc-amount">{ttc.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €</td>
                    <td>
                      <span className={`status-pill ${f.status}`}>{statusConfig[f.status]?.label}</span>
                    </td>
                    <td>
                      <div className="doc-row-actions" onClick={e => e.stopPropagation()}>
                        <button title="Aperçu"><Eye size={13} /></button>
                        <button title="Dupliquer"><Copy size={13} /></button>
                        <button title="Envoyer"><Send size={13} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
