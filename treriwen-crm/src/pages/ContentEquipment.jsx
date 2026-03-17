import React, { useState } from 'react';
import {
  Camera, Mic, Cpu, Zap, Package, MoreHorizontal,
  Plus, TrendingDown, DollarSign, Activity, CheckCircle
} from 'lucide-react';
import Topbar from '../components/layout/Topbar';
import { equipment, videos } from '../data/mockDataContent';
import './Content.css';

const categoryIcons = {
  'Drone':          Camera,
  'Caméra':         Camera,
  'Caméra compacte': Camera,
  'Action Cam':     Activity,
  'Audio':          Mic,
  'Éclairage':      Zap,
  'Montage':        Cpu,
  'Accessoire':     Package,
};

const categoryColors = {
  'Drone':          '#3d7fff',
  'Caméra':         '#ff4d6a',
  'Caméra compacte': '#2dd4a0',
  'Action Cam':     '#fb923c',
  'Audio':          '#f5c842',
  'Éclairage':      '#a78bfa',
  'Montage':        '#8892aa',
  'Accessoire':     '#4a5470',
};

function EquipCard({ item }) {
  const Icon = categoryIcons[item.category] || Package;
  const depreciation = Math.round(((item.purchasePrice - item.currentValue) / item.purchasePrice) * 100);
  const videoCount = videos.filter(v => v.equipmentUsed.includes(item.id)).length;
  const revenueContrib = videos
    .filter(v => v.equipmentUsed.includes(item.id))
    .reduce((s, v) => s + v.adsenseRevenue + v.affiliationRevenue + v.partnershipRevenue, 0);
  const roi = revenueContrib > 0 ? ((revenueContrib / item.purchasePrice) * 100).toFixed(0) : 0;

  return (
    <div className={`equip-card ${item.status === 'inactive' ? 'inactive' : ''}`}>
      <div className="equip-card-header">
        <div className="equip-icon" style={{ background: item.color + '18', color: item.color }}>
          <Icon size={18} strokeWidth={1.6} />
        </div>
        <div className="equip-status-dot" style={{ background: item.status === 'active' ? 'var(--green)' : 'var(--text-muted)' }} />
        <button className="equip-menu"><MoreHorizontal size={14} /></button>
      </div>

      <div className="equip-card-body">
        <p className="equip-name">{item.name}</p>
        <p className="equip-brand-cat">{item.brand} · <span className="equip-cat-tag" style={{ color: item.color }}>{item.category}</span></p>
      </div>

      <div className="equip-metrics">
        <div className="equip-metric">
          <p className="equip-metric-val mono">{item.purchasePrice.toLocaleString('fr-FR')} €</p>
          <p className="equip-metric-lbl">Achat</p>
        </div>
        <div className="equip-metric">
          <p className="equip-metric-val mono" style={{ color: depreciation > 40 ? 'var(--red)' : 'var(--yellow)' }}>
            {item.currentValue.toLocaleString('fr-FR')} €
          </p>
          <p className="equip-metric-lbl">Valeur actuelle</p>
        </div>
        <div className="equip-metric">
          <p className="equip-metric-val mono" style={{ color: Number(roi) >= 100 ? 'var(--green)' : 'var(--text-secondary)' }}>
            {roi}%
          </p>
          <p className="equip-metric-lbl">ROI contenu</p>
        </div>
      </div>

      <div className="equip-depreciation">
        <div className="equip-dep-bar">
          <div
            className="equip-dep-fill"
            style={{
              width: `${100 - depreciation}%`,
              background: depreciation > 40 ? 'var(--red)' : depreciation > 20 ? 'var(--yellow)' : 'var(--green)'
            }}
          />
        </div>
        <span className="equip-dep-label">-{depreciation}% dépréciation</span>
      </div>

      <div className="equip-card-footer">
        <span className="equip-usage"><Activity size={10} /> {item.usageCount} vidéos</span>
        <span className="equip-since">Depuis {item.purchaseDate.slice(0, 7)}</span>
      </div>

      {item.notes && <p className="equip-notes">{item.notes}</p>}
    </div>
  );
}

export default function ContentEquipment() {
  const [filter, setFilter] = useState('Tous');
  const categories = ['Tous', ...new Set(equipment.map(e => e.category))];

  const totalInvested  = equipment.reduce((s, e) => s + e.purchasePrice, 0);
  const totalValue     = equipment.reduce((s, e) => s + e.currentValue, 0);
  const totalLost      = totalInvested - totalValue;
  const activeCount    = equipment.filter(e => e.status === 'active').length;

  // ROI global du parc matériel
  const totalContentRevenue = videos.reduce((s, v) => s + v.adsenseRevenue + v.affiliationRevenue + v.partnershipRevenue, 0);
  const globalRoi = ((totalContentRevenue / totalInvested) * 100).toFixed(0);

  const filtered = equipment.filter(e => filter === 'Tous' || e.category === filter);

  return (
    <div className="page">
      <Topbar title="Matériel" subtitle={`${equipment.length} équipements · ${totalInvested.toLocaleString('fr-FR')} € investis`} />
      <div className="page-content">

        {/* Summary */}
        <div className="equip-summary stagger">
          <div className="equip-kpi">
            <DollarSign size={15} color="var(--accent)" />
            <div>
              <p className="equip-kpi-val mono">{totalInvested.toLocaleString('fr-FR')} €</p>
              <p className="equip-kpi-lbl">Total investi</p>
            </div>
          </div>
          <div className="equip-kpi">
            <TrendingDown size={15} color="var(--yellow)" />
            <div>
              <p className="equip-kpi-val mono" style={{ color: 'var(--yellow)' }}>{totalValue.toLocaleString('fr-FR')} €</p>
              <p className="equip-kpi-lbl">Valeur actuelle</p>
            </div>
          </div>
          <div className="equip-kpi">
            <TrendingDown size={15} color="var(--red)" />
            <div>
              <p className="equip-kpi-val mono" style={{ color: 'var(--red)' }}>-{totalLost.toLocaleString('fr-FR')} €</p>
              <p className="equip-kpi-lbl">Dépréciation totale</p>
            </div>
          </div>
          <div className="equip-kpi">
            <CheckCircle size={15} color="var(--green)" />
            <div>
              <p className="equip-kpi-val mono">{activeCount}</p>
              <p className="equip-kpi-lbl">Équipements actifs</p>
            </div>
          </div>
          <div className="equip-kpi">
            <Activity size={15} color="var(--purple)" />
            <div>
              <p className="equip-kpi-val mono" style={{ color: Number(globalRoi) >= 100 ? 'var(--green)' : 'var(--yellow)' }}>
                {globalRoi}%
              </p>
              <p className="equip-kpi-lbl">ROI global parc</p>
            </div>
          </div>
          <button className="equip-add-btn">
            <Plus size={14} /> Ajouter un équipement
          </button>
        </div>

        {/* Category filter */}
        <div className="controls-bar">
          <div className="filter-tabs">
            {categories.map(c => (
              <button key={c} className={`filter-tab ${filter === c ? 'active' : ''}`} onClick={() => setFilter(c)}>{c}</button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="equip-grid">
          {filtered.map(item => (
            <EquipCard key={item.id} item={item} />
          ))}
        </div>

        {/* Tableau récap investissements */}
        <div className="content-card">
          <div className="content-card-header">
            <h3 className="content-card-title">Tableau des investissements</h3>
            <p className="content-card-sub">Récapitulatif dépréciation et ROI par équipement</p>
          </div>
          <table className="content-table">
            <thead>
              <tr>
                <th>Équipement</th>
                <th>Catégorie</th>
                <th>Date achat</th>
                <th>Prix achat</th>
                <th>Valeur actuelle</th>
                <th>Dépréciation</th>
                <th>Vidéos</th>
                <th>ROI contenu</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {equipment.map(item => {
                const dep = Math.round(((item.purchasePrice - item.currentValue) / item.purchasePrice) * 100);
                const vCount = videos.filter(v => v.equipmentUsed.includes(item.id)).length;
                const rev = videos.filter(v => v.equipmentUsed.includes(item.id)).reduce((s, v) => s + v.adsenseRevenue + v.affiliationRevenue + v.partnershipRevenue, 0);
                const roi = ((rev / item.purchasePrice) * 100).toFixed(0);
                return (
                  <tr key={item.id} className={item.status === 'inactive' ? 'row-inactive' : ''}>
                    <td>
                      <div className="equip-name-cell">
                        <div className="equip-dot-sm" style={{ background: item.color }} />
                        <span className="equip-table-name">{item.name}</span>
                      </div>
                    </td>
                    <td><span className="equip-cat-badge" style={{ color: item.color, background: item.color + '18' }}>{item.category}</span></td>
                    <td className="mono table-muted">{item.purchaseDate}</td>
                    <td className="mono">{item.purchasePrice.toLocaleString('fr-FR')} €</td>
                    <td className="mono">{item.currentValue.toLocaleString('fr-FR')} €</td>
                    <td>
                      <span className="mono" style={{ color: dep > 40 ? 'var(--red)' : dep > 20 ? 'var(--yellow)' : 'var(--green)' }}>
                        -{dep}%
                      </span>
                    </td>
                    <td className="mono table-center">{vCount}</td>
                    <td className="mono" style={{ color: Number(roi) >= 100 ? 'var(--green)' : 'var(--text-secondary)', fontWeight: 600 }}>{roi}%</td>
                    <td>
                      <span className={`equip-status-pill ${item.status}`}>
                        {item.status === 'active' ? 'Actif' : 'Inactif'}
                      </span>
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