import React, { useState, useEffect } from 'react';
import {
  Plus, Trash2, Eye, Download, Send, Copy,
  ArrowLeft, Check, RefreshCw, ToggleLeft, ToggleRight
} from 'lucide-react';
import Topbar from '../components/layout/Topbar';
import { clients } from '../data/mockData';
import { devis as devisExtra } from '../data/mockDataExtra';
import './Documents.css';
import { getAllDevis, getDevisStatus } from '../api/devis';

const allDevis = devisExtra;

const statusConfig = {
  draft:    { label: 'Brouillon', cls: 'muted' },
  sent:     { label: 'Envoyé',    cls: 'blue'  },
  accepted: { label: 'Accepté',   cls: 'green' },
  refused:  { label: 'Refusé',    cls: 'red'   },
};

function RecurringToggle({ checked, onChange }) {
  return (
    <button
      className={`recurring-toggle ${checked ? 'on' : ''}`}
      onClick={() => onChange(!checked)}
      title={checked ? 'Mode abonnement actif' : 'Activer le mode abonnement'}
    >
      {checked ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
      <span>{checked ? 'Abonnement récurrent' : 'Ponctuel'}</span>
      {checked && <RefreshCw size={11} className="recurring-spin" />}
    </button>
  );
}

function DevisEditor({ doc, onBack }) {
    const [devisList, setDevisList] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const fetchClients = async () => {
        try {
          setLoading(true);
          const devis = await getAllDevis(); // ta fonction async
          const status = await getDevisStatus();
          setDevisList(devis);
          setStatusList(status);
       
        } catch (err) {
          console.error('Erreur lors du chargement des clients', err);
        } finally {
          setLoading(false);
        }
      };
      fetchClients();
    }, []);
  const [form, setForm] = useState(doc || {
    id: `DEV-2026-00${devisList.length + 1}`,
    client: '',
    contact: '',
    email: '',
    address: '',
    date: new Date().toISOString().slice(0, 10),
    validUntil: '',
    status: 'draft',
    isRecurring: false,
    recurringFrequency: 'monthly',
    recurringDuration: 12,
    items: [{ id: 1, description: '', qty: 1, unit: 'forfait', price: 0, isRecurring: false, frequency: 'monthly' }],
    taxRate: 20,
    notes: '',
  });
  const [saved, setSaved] = useState(false);

  const updateItem = (id, field, value) => {
    setForm(f => ({ ...f, items: f.items.map(i => i.id === id ? { ...i, [field]: value } : i) }));
  };

  const addItem = (recurring = false) => {
    setForm(f => ({
      ...f,
      items: [...f.items, {
        id: Date.now(), description: '', qty: 1,
        unit: recurring ? 'mois' : 'forfait', price: 0,
        isRecurring: recurring, frequency: 'monthly',
      }]
    }));
  };

  const removeItem = (id) => setForm(f => ({ ...f, items: f.items.filter(i => i.id !== id) }));

  const onetimeItems  = form.lignes.filter(i => !i.isRecurring);
  const recurringItems = form.lignes.filter(i => i.isRecurring);
  const onetimeSubtotal = onetimeItems.reduce((s, i) => s + Number(i.quantite) * Number(i.prix_unitaire_ht), 0);
  const mrrAmount = recurringItems.reduce((s, i) => s + Number(i.quantite) * Number(i.prix_unitaire_ht), 0);
  const arrAmount = mrrAmount * 12;
  const allSubtotal = onetimeSubtotal + mrrAmount;
  const tax = allSubtotal * (20 / 100);
  const total = allSubtotal + tax;
  const hasRecurring = recurringItems.length > 0 || form.isRecurring;
  console.log(form);
  return (
    <div className="doc-editor-layout">
      {/* ── LEFT: FORM ── */}
      <div className="doc-editor-panel">
        <div className="doc-editor-header">
          <button className="back-btn" onClick={onBack}><ArrowLeft size={14} /> Retour</button>
          <div className="doc-editor-actions">
            <RecurringToggle checked={form.isRecurring} onChange={val => setForm({ ...form, isRecurring: val })} />
            <button className={`doc-save-btn ${saved ? 'saved' : ''}`} onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}>
              {saved ? <><Check size={13} /> Sauvegardé</> : 'Sauvegarder'}
            </button>
            <button className="doc-action-btn primary"><Send size={13} /> Envoyer</button>
          </div>
        </div>

        {hasRecurring && (
          <div className="recurring-banner">
            <RefreshCw size={13} />
            <span>Ce devis inclut des <strong>prestations récurrentes</strong> — MRR potentiel :</span>
            <span className="recurring-mrr mono">{mrrAmount.toLocaleString('fr-FR')} € /mois</span>
            <span className="recurring-arr">· ARR {arrAmount.toLocaleString('fr-FR')} €</span>
          </div>
        )}

        <div className="doc-form">
          {/* Infos générales */}
          <div className="doc-form-section">
            <h4 className="doc-form-title">Informations générales</h4>
            <div className="doc-form-grid">
              <div className="form-group">
                <label>Numéro</label>
                <input className="mono" value={form.reference} onChange={e => setForm({ ...form, id: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Statut</label>
                <select value={form.status_name} onChange={e => setForm({ ...form, status: e.target.value })}>
                  <option value="draft">Brouillon</option>
                  <option value="sent">Envoyé</option>
                  <option value="accepted">Accepté</option>
                  <option value="refused">Refusé</option>
                </select>
              </div>
              <div className="form-group">
                <label>Date</label>
                <input type="date" value={new Date(form.date_devis).toLocaleDateString('en-CA')} onChange={e => setForm({ ...form, date: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Valide jusqu'au</label>
                
                <input type="date" value={new Date(form.date_validite).toLocaleDateString('en-CA')} onChange={e => setForm({ ...form, validUntil: e.target.value })} />
              </div>
              {form.isRecurring && <>
                <div className="form-group">
                  <label>Fréquence</label>
                  <select value={form.recurringFrequency} onChange={e => setForm({ ...form, recurringFrequency: e.target.value })}>
                    <option value="monthly">Mensuelle</option>
                    <option value="quarterly">Trimestrielle</option>
                    <option value="annual">Annuelle</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Durée engagement (mois)</label>
                  <input type="number" className="mono" min="1" value={form.recurringDuration} onChange={e => setForm({ ...form, recurringDuration: e.target.value })} />
                </div>
              </>}
            </div>
          </div>

          {/* Client */}
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
                <input value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} placeholder="Nom du contact" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@client.fr" />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Adresse</label>
                <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Adresse complète" />
              </div>
            </div>
          </div>

          {/* Lignes ponctuelles */}
          <div className="doc-form-section">
            <h4 className="doc-form-title">Prestations ponctuelles</h4>
            <div className="doc-items-table">
              <div className="doc-items-header">
                <span style={{ flex: 3 }}>Description</span>
                <span style={{ flex: 1 }}>Qté</span>
                <span style={{ flex: 1 }}>Unité</span>
                <span style={{ flex: 1 }}>P.U. HT</span>
                <span style={{ flex: 1, textAlign: 'right' }}>Total HT</span>
                <span style={{ width: 32 }} />
              </div>
              {onetimeItems.map(item => (
                <div key={item.id} className="doc-item-row">
                  <input style={{ flex: 3 }} className="doc-item-input" placeholder="Description" value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)} />
                  <input style={{ flex: 1 }} className="doc-item-input mono" type="number" min="0" value={parseInt(item.quantite)} onChange={e => updateItem(item.id, 'qty', e.target.value)} />
                  <select style={{ flex: 1 }} className="doc-item-input" value={item.unite_name} onChange={e => updateItem(item.id, 'unit', e.target.value)}>
                    <option value="forfait">forfait</option>
                    <option value="jours">jours</option>
                    <option value="heures">heures</option>
                    <option value="sessions">sessions</option>
                    <option value="unité">unité</option>
                  </select>
                  <input style={{ flex: 1 }} className="doc-item-input mono" type="number" min="0" value={parseInt(item.prix_unitaire_ht)} onChange={e => updateItem(item.id, 'price', e.target.value)} />
                  <span style={{ flex: 1, textAlign: 'right' }} className="doc-item-total mono">{item.quantite * item.prix_unitaire_ht} €</span>
                  <button className="doc-item-remove" onClick={() => removeItem(item.id)}><Trash2 size={12} /></button>
                </div>
              ))}
              <button className="doc-add-line" onClick={() => addItem(false)}><Plus size={13} /> Ajouter une ligne ponctuelle</button>
            </div>
          </div>

          {/* Lignes récurrentes */}
          <div className="doc-form-section recurring-section">
            <h4 className="doc-form-title recurring-title">
              <RefreshCw size={12} /> Prestations récurrentes <span className="recurring-badge">Abonnement</span>
            </h4>
            {recurringItems.length === 0 && (
              <p className="recurring-empty-hint">Ajoutez des lignes récurrentes pour proposer un abonnement mensuel, trimestriel ou annuel.</p>
            )}
            {recurringItems.length > 0 && (
              <div className="doc-items-table">
                <div className="doc-items-header">
                  <span style={{ flex: 3 }}>Description</span>
                  <span style={{ flex: 1 }}>Qté</span>
                  <span style={{ flex: 1 }}>Fréquence</span>
                  <span style={{ flex: 1 }}>Prix HT</span>
                  <span style={{ flex: 1, textAlign: 'right' }}>/ mois</span>
                  <span style={{ width: 32 }} />
                </div>
                {recurringItems.map(item => (
                  <div key={item.id} className="doc-item-row recurring-row">
                    <input style={{ flex: 3 }} className="doc-item-input" placeholder="Ex: Licence CRM, Hébergement..." value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)} />
                    <input style={{ flex: 1 }} className="doc-item-input mono" type="number" min="0" value={item.qty} onChange={e => updateItem(item.id, 'qty', e.target.value)} />
                    <select style={{ flex: 1 }} className="doc-item-input" value={item.frequency} onChange={e => updateItem(item.id, 'frequency', e.target.value)}>
                      <option value="monthly">Mensuel</option>
                      <option value="quarterly">Trim.</option>
                      <option value="annual">Annuel</option>
                    </select>
                    <input style={{ flex: 1 }} className="doc-item-input mono" type="number" min="0" value={item.price} onChange={e => updateItem(item.id, 'price', e.target.value)} />
                    <span style={{ flex: 1, textAlign: 'right' }} className="doc-item-total mono recurring-amount">{(item.qty * item.price).toLocaleString('fr-FR')} €</span>
                    <button className="doc-item-remove" onClick={() => removeItem(item.id)}><Trash2 size={12} /></button>
                  </div>
                ))}
              </div>
            )}
            <button className="doc-add-line recurring-add" onClick={() => addItem(true)}><RefreshCw size={13} /> Ajouter une ligne récurrente</button>
            {recurringItems.length > 0 && (
              <div className="recurring-summary">
                <div className="recurring-summary-item">
                  <span>MRR (revenu mensuel récurrent)</span>
                  <span className="mono">{mrrAmount.toLocaleString('fr-FR')} €</span>
                </div>
                <div className="recurring-summary-item">
                  <span>ARR (revenu annuel récurrent)</span>
                  <span className="mono">{arrAmount.toLocaleString('fr-FR')} €</span>
                </div>
              </div>
            )}
          </div>

          {/* Totaux */}
          <div className="doc-form-section">
            <h4 className="doc-form-title">Récapitulatif</h4>
            <div className="doc-totals">
              {onetimeSubtotal > 0 && <div className="doc-total-row"><span>Sous-total ponctuel HT</span><span className="mono">{onetimeSubtotal.toLocaleString('fr-FR')} €</span></div>}
              {mrrAmount > 0 && <div className="doc-total-row"><span>Sous-total récurrent HT <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(1 période)</span></span><span className="mono">{mrrAmount.toLocaleString('fr-FR')} €</span></div>}
              <div className="doc-total-row"><span>TVA ({form.taxRate}%)</span><span className="mono">{tax.toLocaleString('fr-FR')} €</span></div>
              <div className="doc-total-row total"><span>Total TTC</span><span className="mono">{total.toLocaleString('fr-FR')} €</span></div>
            </div>
          </div>

          {/* Notes */}
          <div className="doc-form-section">
            <h4 className="doc-form-title">Notes & conditions</h4>
            <textarea className="doc-notes" rows={3} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Conditions, engagement minimum, modalités de résiliation..." />
          </div>
        </div>
      </div>

      {/* ── RIGHT: PREVIEW ── */}
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
                <p className="pdf-doc-type">DEVIS{hasRecurring ? ' RÉCURRENT' : ''}</p>
                <p className="pdf-doc-num mono">{form.id}</p>
                <p className="pdf-doc-date">Émis le {form.date}</p>
                {form.validUntil && <p className="pdf-doc-date">Valide jusqu'au {form.validUntil}</p>}
                {form.isRecurring && <p className="pdf-doc-date" style={{ color: '#3d7fff', fontWeight: 600 }}>Engagement : {form.recurringDuration} mois</p>}
              </div>
            </div>

            <div className="pdf-client-block">
              <p className="pdf-section-label">Destinataire</p>
              <p className="pdf-client-name">{form.client || '— Entreprise —'}</p>
              <p className="pdf-client-detail">{form.contact}</p>
              <p className="pdf-client-detail">{form.email}</p>
              <p className="pdf-client-detail">{form.address}</p>
            </div>

            {onetimeItems.length > 0 && <>
              <p className="pdf-section-sub">Prestations ponctuelles</p>
              <table className="pdf-table">
                <thead><tr><th style={{ flex: 3 }}>Description</th><th>Qté</th><th>Unité</th><th>P.U. HT</th><th style={{ textAlign: 'right' }}>Total HT</th></tr></thead>
                <tbody>
                  {onetimeItems.map(item => (
      
                    <tr key={item.id}>
                      <td style={{ flex: 3 }}>{item.description || '—'}</td>
                      <td>{parseInt(item.quantite)}</td><td>{item.unite_name}</td>
                      <td className="mono">{item.prix_unitaire_ht} €</td>
                      <td className="mono" style={{ textAlign: 'right' }}>{(item.quantite * item.prix_unitaire_ht).toLocaleString('fr-FR')}€</td>
                    </tr>
                    
                  ))}
                </tbody>
              </table>
            </>}

            {recurringItems.length > 0 && <>
              <p className="pdf-section-sub recurring">↻ Prestations récurrentes (abonnement)</p>
              <table className="pdf-table">
                <thead><tr><th style={{ flex: 3 }}>Description</th><th>Qté</th><th>Fréquence</th><th>Prix HT</th><th style={{ textAlign: 'right' }}>/ mois</th></tr></thead>
                <tbody>
                  {recurringItems.map(item => (
                    <tr key={item.id} style={{ background: '#f0f6ff' }}>
                      <td style={{ flex: 3 }}>{item.description || '—'}</td>
                      <td>{item.qty}</td>
                      <td>{item.frequency === 'monthly' ? 'Mensuel' : item.frequency === 'quarterly' ? 'Trim.' : 'Annuel'}</td>
                      <td className="mono">{Number(item.price).toLocaleString('fr-FR')} €</td>
                      <td className="mono" style={{ textAlign: 'right', color: '#3d7fff', fontWeight: 700 }}>{(item.qty * item.price).toLocaleString('fr-FR')} €</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ background: '#eff6ff', borderRadius: 6, padding: '10px 14px', marginBottom: 14, display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: '#3d7fff', fontWeight: 700 }}>MRR : {mrrAmount.toLocaleString('fr-FR')} € / mois</span>
                <span style={{ fontSize: 12, color: '#6b7280' }}>ARR : {arrAmount.toLocaleString('fr-FR')} €</span>
              </div>
            </>}

            <div className="pdf-totals">
              {onetimeSubtotal > 0 && <div className="pdf-total-row"><span>Ponctuel HT</span><span className="mono">{onetimeSubtotal.toLocaleString('fr-FR')} €</span></div>}
              {mrrAmount > 0 && <div className="pdf-total-row"><span>Récurrent HT (1 période)</span><span className="mono">{mrrAmount.toLocaleString('fr-FR')} €</span></div>}
              <div className="pdf-total-row"><span>TVA {form.taxRate}%</span><span className="mono">{tax.toLocaleString('fr-FR')} €</span></div>
              <div className="pdf-total-row final"><span>Total TTC</span><span className="mono">{total.toLocaleString('fr-FR')} €</span></div>
            </div>

            {form.notes && <div className="pdf-notes"><p className="pdf-notes-title">Notes</p><p className="pdf-notes-text">{form.notes}</p></div>}
            <div className="pdf-footer"><p>Nova SAS — SAS au capital de 10 000 € — TVA Intracommunautaire: FR12 123456789</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Devis() {
  const [selected, setSelected] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [devisList, setDevisList] = useState([]);
  const [statusList, setStatusList] = useState([]);

  useEffect(() => {
      const fetchClients = async () => {
        try {
          setLoading(true);
          const devis = await getAllDevis(); // ta fonction async
          const status = await getDevisStatus();
          setDevisList(devis);
          setStatusList(status);
           
        } catch (err) {
          console.error('Erreur lors du chargement des clients', err);
        } finally {
          setLoading(false);
        }
      };
      fetchClients();
   
    }, []);
  if (selected || isNew) {
    return (
      <div className="page">
        <Topbar title={isNew ? 'Nouveau devis' : `Devis ${selected?.id}`} subtitle={selected?.client || ''} />
        <div className="page-content" style={{ padding: 0 }}>
          <DevisEditor doc={selected} onBack={() => { setSelected(null); setIsNew(false); }} />
        </div>
      </div>
    );
  }

  //const totalDevis = devisList.reduce((s, d) => s + d.items.reduce((ss, i) => ss + i.qty * i.price, 0) * 1.2, 0);
const totalDevis = devisList.reduce((s, d) => s + Number(d.total_ttc), 0)
  return (
    <div className="page">
      <Topbar title="Devis" subtitle={`${devisList.length} devis · ${totalDevis.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} € TTC`} />
      <div className="page-content">
        <div className="docs-summary stagger">
          {[
            { label: 'Total devis', value: totalDevis, format: 'currency' },
            { label: 'Brouillons', value: devisList.filter(d => d.status_name === 'draft').length, color: '#8892aa' },
            { label: 'Envoyés',    value: devisList.filter(d => d.status_name === 'sent').length,  color: '#3d7fff' },
            { label: 'Acceptés',   value: devisList.filter(d => d.status_name === 'accepted').length, color: '#2dd4a0' },
          ].map(({ label, value, format, color }) => (
            <div key={label} className="doc-stat">
              <p className="doc-stat-value mono" style={color ? { color } : {}}>
                {format === 'currency' ? `${value.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €` : value}
              </p>
              <p className="doc-stat-label">{label}</p>
            </div>
          ))}
          <button className="doc-new-btn" onClick={() => setIsNew(true)}><Plus size={14} /> Nouveau devis</button>
        </div>

        <div className="docs-table-card">
          <table className="docs-table">
            <thead>
              <tr>
                <th>Numéro</th><th>Client</th><th>Date</th><th>Validité</th><th>Montant TTC</th><th>Statut</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {devisList.map(d => {
                const ttc = d.total_ttc
                return (
                  <tr key={d.id} onClick={() => setSelected(d)} style={{ cursor: 'pointer' }}>
                    <td className="mono doc-id">{d.reference}</td>
                    <td><p className="doc-client-name">{d.client}</p><p className="doc-contact">{d.contact}</p></td>
                    <td className="mono doc-date">{new Date(d.date_devis).toLocaleDateString('fr-FR')}</td>
                    <td className="mono doc-date">{new Date(d.date_validite).toLocaleDateString('fr-FR')}</td>
                    <td className="mono doc-amount">{ttc.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €</td>
                    <td><span className={`status-pill ${d.status_name}`}>{statusConfig[d.status_name]?.label}</span></td>
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