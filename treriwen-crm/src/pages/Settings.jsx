import React, { useState } from 'react';
import {
  User, Bell, Shield, Palette, Building2,
  Globe, Save, ChevronRight
} from 'lucide-react';
import Topbar from '../components/layout/Topbar';
import './Settings.css';

const sections = [
  { id: 'profile', icon: User, label: 'Profil' },
  { id: 'company', icon: Building2, label: 'Entreprise' },
  { id: 'notifications', icon: Bell, label: 'Notifications' },
  { id: 'security', icon: Shield, label: 'Sécurité' },
  { id: 'appearance', icon: Palette, label: 'Apparence' },
  { id: 'integrations', icon: Globe, label: 'Intégrations' },
];

function Toggle({ checked, onChange }) {
  return (
    <button
      className={`toggle ${checked ? 'on' : ''}`}
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
    >
      <span className="toggle-thumb" />
    </button>
  );
}

export default function Settings() {
  const [activeSection, setActiveSection] = useState('profile');
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@novacrm.fr',
    phone: '+33 6 12 34 56 78',
    role: 'Admin',
  });

  const [company, setCompany] = useState({
    name: 'Nova SAS',
    siret: '123 456 789 00012',
    address: '12 Rue de la Paix, 75001 Paris',
    website: 'https://nova.fr',
    currency: 'EUR',
  });

  const [notifs, setNotifs] = useState({
    newDeal: true,
    dealWon: true,
    taskDue: true,
    newClient: false,
    weeklyReport: true,
    emailDigest: false,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="page">
      <Topbar title="Paramètres" subtitle="Gérez votre compte et vos préférences" />

      <div className="page-content">
        <div className="settings-layout">
          {/* Sidebar Nav */}
          <nav className="settings-nav">
            {sections.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                className={`settings-nav-item ${activeSection === id ? 'active' : ''}`}
                onClick={() => setActiveSection(id)}
              >
                <Icon size={15} strokeWidth={1.8} />
                <span>{label}</span>
                <ChevronRight size={12} className="settings-nav-arrow" />
              </button>
            ))}
          </nav>

          {/* Content */}
          <div className="settings-content fade-in" key={activeSection}>

            {/* Profile */}
            {activeSection === 'profile' && (
              <div>
                <div className="settings-section-header">
                  <h3>Profil utilisateur</h3>
                  <p>Modifiez vos informations personnelles.</p>
                </div>

                <div className="settings-avatar-row">
                  <div className="settings-avatar">JD</div>
                  <div>
                    <p className="settings-avatar-name">{profile.firstName} {profile.lastName}</p>
                    <p className="settings-avatar-role">{profile.role}</p>
                    <button className="settings-link-btn">Changer la photo</button>
                  </div>
                </div>

                <div className="settings-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Prénom</label>
                      <input
                        value={profile.firstName}
                        onChange={e => setProfile({ ...profile, firstName: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Nom</label>
                      <input
                        value={profile.lastName}
                        onChange={e => setProfile({ ...profile, lastName: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={e => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Téléphone</label>
                    <input
                      value={profile.phone}
                      onChange={e => setProfile({ ...profile, phone: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Company */}
            {activeSection === 'company' && (
              <div>
                <div className="settings-section-header">
                  <h3>Informations entreprise</h3>
                  <p>Ces informations apparaîtront sur vos documents commerciaux.</p>
                </div>
                <div className="settings-form">
                  <div className="form-group">
                    <label>Nom de l'entreprise</label>
                    <input
                      value={company.name}
                      onChange={e => setCompany({ ...company, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>SIRET</label>
                    <input
                      value={company.siret}
                      onChange={e => setCompany({ ...company, siret: e.target.value })}
                      className="mono"
                    />
                  </div>
                  <div className="form-group">
                    <label>Adresse</label>
                    <input
                      value={company.address}
                      onChange={e => setCompany({ ...company, address: e.target.value })}
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Site web</label>
                      <input
                        value={company.website}
                        onChange={e => setCompany({ ...company, website: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Devise</label>
                      <select
                        value={company.currency}
                        onChange={e => setCompany({ ...company, currency: e.target.value })}
                      >
                        <option value="EUR">EUR — Euro</option>
                        <option value="USD">USD — Dollar</option>
                        <option value="GBP">GBP — Livre Sterling</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeSection === 'notifications' && (
              <div>
                <div className="settings-section-header">
                  <h3>Notifications</h3>
                  <p>Choisissez les événements pour lesquels vous souhaitez être notifié.</p>
                </div>
                <div className="settings-toggles">
                  {[
                    { key: 'newDeal', label: 'Nouveau deal créé', desc: 'Quand un deal est ajouté au pipeline' },
                    { key: 'dealWon', label: 'Deal gagné', desc: 'Quand un deal passe en statut "Gagné"' },
                    { key: 'taskDue', label: 'Tâche en échéance', desc: 'Rappel 24h avant la date limite' },
                    { key: 'newClient', label: 'Nouveau client', desc: 'Quand un client est ajouté' },
                    { key: 'weeklyReport', label: 'Rapport hebdomadaire', desc: 'Résumé de performance chaque lundi' },
                    { key: 'emailDigest', label: 'Digest email quotidien', desc: 'Récapitulatif de vos activités du jour' },
                  ].map(({ key, label, desc }) => (
                    <div key={key} className="toggle-row">
                      <div className="toggle-info">
                        <p className="toggle-label">{label}</p>
                        <p className="toggle-desc">{desc}</p>
                      </div>
                      <Toggle
                        checked={notifs[key]}
                        onChange={val => setNotifs({ ...notifs, [key]: val })}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security */}
            {activeSection === 'security' && (
              <div>
                <div className="settings-section-header">
                  <h3>Sécurité</h3>
                  <p>Gérez votre mot de passe et la sécurité du compte.</p>
                </div>
                <div className="settings-form">
                  <div className="form-group">
                    <label>Mot de passe actuel</label>
                    <input type="password" placeholder="••••••••" />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Nouveau mot de passe</label>
                      <input type="password" placeholder="••••••••" />
                    </div>
                    <div className="form-group">
                      <label>Confirmer</label>
                      <input type="password" placeholder="••••••••" />
                    </div>
                  </div>
                </div>

                <div className="settings-danger-zone">
                  <h4>Zone dangereuse</h4>
                  <div className="danger-item">
                    <div>
                      <p className="danger-title">Supprimer le compte</p>
                      <p className="danger-desc">Cette action est irréversible. Toutes vos données seront supprimées.</p>
                    </div>
                    <button className="danger-btn">Supprimer</button>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance */}
            {activeSection === 'appearance' && (
              <div>
                <div className="settings-section-header">
                  <h3>Apparence</h3>
                  <p>Personnalisez l'interface à votre goût.</p>
                </div>
                <div className="appearance-options">
                  <p className="form-label-standalone">Thème</p>
                  <div className="theme-options">
                    <div className="theme-option active">
                      <div className="theme-preview dark" />
                      <span>Sombre</span>
                    </div>
                    <div className="theme-option">
                      <div className="theme-preview light" />
                      <span>Clair</span>
                    </div>
                    <div className="theme-option">
                      <div className="theme-preview system" />
                      <span>Système</span>
                    </div>
                  </div>

                  <p className="form-label-standalone" style={{ marginTop: 24 }}>Couleur d'accent</p>
                  <div className="accent-options">
                    {['#3d7fff', '#2dd4a0', '#a78bfa', '#f5c842', '#ff4d6a', '#fb923c'].map(color => (
                      <button
                        key={color}
                        className={`accent-dot ${color === '#3d7fff' ? 'selected' : ''}`}
                        style={{ background: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Integrations */}
            {activeSection === 'integrations' && (
              <div>
                <div className="settings-section-header">
                  <h3>Intégrations</h3>
                  <p>Connectez NovaCRM avec vos outils préférés.</p>
                </div>
                <div className="integrations-list">
                  {[
                    { name: 'Gmail', desc: 'Synchronisez vos emails', connected: true, color: '#ea4335' },
                    { name: 'Slack', desc: 'Recevez des notifications', connected: false, color: '#4a154b' },
                    { name: 'Notion', desc: 'Liez vos notes et docs', connected: false, color: '#fff' },
                    { name: 'Stripe', desc: 'Suivi des paiements', connected: true, color: '#6772e5' },
                    { name: 'Calendly', desc: 'Planification de réunions', connected: false, color: '#006bff' },
                    { name: 'HubSpot', desc: 'Synchronisation marketing', connected: false, color: '#ff7a59' },
                  ].map(({ name, desc, connected, color }) => (
                    <div key={name} className="integration-item">
                      <div className="integration-logo" style={{ background: color + '22', color }}>
                        {name[0]}
                      </div>
                      <div className="integration-info">
                        <p className="integration-name">{name}</p>
                        <p className="integration-desc">{desc}</p>
                      </div>
                      <button className={`integration-btn ${connected ? 'connected' : ''}`}>
                        {connected ? 'Connecté' : 'Connecter'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Save Button */}
            {['profile', 'company', 'security'].includes(activeSection) && (
              <div className="settings-save-row">
                <button className={`settings-save-btn ${saved ? 'saved' : ''}`} onClick={handleSave}>
                  <Save size={14} />
                  {saved ? 'Sauvegardé ✓' : 'Sauvegarder les modifications'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
