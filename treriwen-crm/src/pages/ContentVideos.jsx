import React, { useState } from 'react';
import {
  Eye, ThumbsUp, MessageSquare, Clock, DollarSign,
  TrendingUp, Filter, Search, ChevronDown, ChevronUp,
  Play, ExternalLink, BarChart2
} from 'lucide-react';
import Topbar from '../components/layout/Topbar';
import { videos, equipment } from '../data/mockDataContent';
import './Content.css';

const categories = ['Tous', ...new Set(videos.map(v => v.category))];

function VideoRow({ video, expanded, onToggle }) {
  const totalRevenue = video.adsenseRevenue + video.affiliationRevenue + video.partnershipRevenue;
  const margin = totalRevenue > 0 ? Math.round(((totalRevenue - video.productionCost) / totalRevenue) * 100) : 100;
  const likeRate = ((video.likes / video.views) * 100).toFixed(2);
  const usedEquipment = equipment.filter(e => video.equipmentUsed.includes(e.id));

  return (
    <>
      <tr className={`video-row ${expanded ? 'expanded' : ''}`} onClick={onToggle}>
        <td>
          <div className="video-thumb-placeholder">
            <Play size={14} />
          </div>
        </td>
        <td>
          <div className="video-info-cell">
            <span className="video-category-tag">{video.category}</span>
            <p className="video-title-main">{video.title}</p>
            <p className="video-meta-line">{video.publishedAt} · {video.duration}</p>
          </div>
        </td>
        <td>
          <p className="mono video-stat-val">{video.views.toLocaleString('fr-FR')}</p>
          <p className="video-stat-sub">vues</p>
        </td>
        <td>
          <p className="mono video-stat-val">{video.likes.toLocaleString('fr-FR')}</p>
          <p className="video-stat-sub">{likeRate}% ratio</p>
        </td>
        <td>
          <div className="retention-cell">
            <div className="retention-bar-wrap">
              <div
                className="retention-bar"
                style={{
                  width: `${video.retentionRate}%`,
                  background: video.retentionRate >= 55 ? 'var(--green)' : video.retentionRate >= 45 ? 'var(--yellow)' : 'var(--red)'
                }}
              />
            </div>
            <span className="mono retention-pct">{video.retentionRate}%</span>
          </div>
        </td>
        <td>
          <p className="mono video-stat-val">{video.ctr}%</p>
          <p className="video-stat-sub">CTR</p>
        </td>
        <td>
          <p className="mono video-rpm">RPM {video.rpm} €</p>
          <p className="video-stat-sub">CPM {video.cpm} €</p>
        </td>
        <td>
          <p className="mono video-revenue-val">{totalRevenue.toLocaleString('fr-FR')} €</p>
          {video.productionCost > 0 && (
            <p className="video-stat-sub" style={{ color: 'var(--red)' }}>-{video.productionCost} € prod.</p>
          )}
        </td>
        <td>
          <button className="video-expand-btn">
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </td>
      </tr>

      {expanded && (
        <tr className="video-detail-row">
          <td colSpan={9}>
            <div className="video-detail-panel fade-in">
              {/* Métriques détaillées */}
              <div className="video-detail-grid">
                <div className="vd-section">
                  <p className="vd-section-title">Métriques</p>
                  <div className="vd-metrics">
                    <div className="vd-metric">
                      <Eye size={12} />
                      <span>Vues</span>
                      <span className="mono">{video.views.toLocaleString('fr-FR')}</span>
                    </div>
                    <div className="vd-metric">
                      <ThumbsUp size={12} />
                      <span>Likes</span>
                      <span className="mono">{video.likes.toLocaleString('fr-FR')}</span>
                    </div>
                    <div className="vd-metric">
                      <MessageSquare size={12} />
                      <span>Commentaires</span>
                      <span className="mono">{video.comments.toLocaleString('fr-FR')}</span>
                    </div>
                    <div className="vd-metric">
                      <Clock size={12} />
                      <span>Temps de visionnage</span>
                      <span className="mono">{video.watchTimeHours.toLocaleString('fr-FR')} h</span>
                    </div>
                    <div className="vd-metric">
                      <BarChart2 size={12} />
                      <span>Rétention</span>
                      <span className="mono" style={{ color: video.retentionRate >= 55 ? 'var(--green)' : video.retentionRate >= 45 ? 'var(--yellow)' : 'var(--red)' }}>
                        {video.retentionRate}%
                      </span>
                    </div>
                    <div className="vd-metric">
                      <TrendingUp size={12} />
                      <span>CTR miniature</span>
                      <span className="mono">{video.ctr}%</span>
                    </div>
                  </div>
                </div>

                <div className="vd-section">
                  <p className="vd-section-title">Revenus</p>
                  <div className="vd-revenues">
                    <div className="vd-rev-row">
                      <span>AdSense</span>
                      <span className="mono" style={{ color: 'var(--accent-bright)' }}>{video.adsenseRevenue} €</span>
                    </div>
                    <div className="vd-rev-row">
                      <span>RPM</span>
                      <span className="mono">{video.rpm} €</span>
                    </div>
                    <div className="vd-rev-row">
                      <span>CPM</span>
                      <span className="mono">{video.cpm} €</span>
                    </div>
                    <div className="vd-rev-row">
                      <span>Affiliation</span>
                      <span className="mono" style={{ color: 'var(--green)' }}>{video.affiliationRevenue} €</span>
                    </div>
                    <div className="vd-rev-row">
                      <span>Partenariat</span>
                      <span className="mono" style={{ color: 'var(--purple)' }}>{video.partnershipRevenue > 0 ? `${video.partnershipRevenue.toLocaleString('fr-FR')} €` : '—'}</span>
                    </div>
                    {video.productionCost > 0 && (
                      <div className="vd-rev-row">
                        <span>Coût de production</span>
                        <span className="mono" style={{ color: 'var(--red)' }}>-{video.productionCost} €</span>
                      </div>
                    )}
                    <div className="vd-rev-row vd-rev-total">
                      <span>Total net</span>
                      <span className="mono">{(totalRevenue - video.productionCost).toLocaleString('fr-FR')} €</span>
                    </div>
                  </div>
                </div>

                <div className="vd-section">
                  <p className="vd-section-title">Matériel utilisé</p>
                  <div className="vd-equipment">
                    {usedEquipment.map(e => (
                      <div key={e.id} className="vd-equip-item">
                        <div className="vd-equip-dot" style={{ background: e.color }} />
                        <div>
                          <p className="vd-equip-name">{e.name}</p>
                          <p className="vd-equip-cat">{e.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="vd-section">
                  <p className="vd-section-title">Tags</p>
                  <div className="vd-tags">
                    {video.tags.map(tag => (
                      <span key={tag} className="vd-tag">#{tag}</span>
                    ))}
                  </div>
                  {video.notes && (
                    <>
                      <p className="vd-section-title" style={{ marginTop: 12 }}>Notes</p>
                      <p className="vd-notes">{video.notes}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function ContentVideos() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Tous');
  const [sort, setSort] = useState('date');
  const [expandedId, setExpandedId] = useState(null);

  const totalViews   = videos.reduce((s, v) => s + v.views, 0);
  const totalRevenue = videos.reduce((s, v) => s + v.adsenseRevenue + v.affiliationRevenue + v.partnershipRevenue, 0);
  const bestVideo    = [...videos].sort((a, b) => b.views - a.views)[0];
  const avgRetention = Math.round(videos.reduce((s, v) => s + v.retentionRate, 0) / videos.length);

  const filtered = videos
    .filter(v => category === 'Tous' || v.category === category)
    .filter(v => v.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'date')      return new Date(b.publishedAt) - new Date(a.publishedAt);
      if (sort === 'views')     return b.views - a.views;
      if (sort === 'revenue')   return (b.adsenseRevenue + b.affiliationRevenue + b.partnershipRevenue) - (a.adsenseRevenue + a.affiliationRevenue + a.partnershipRevenue);
      if (sort === 'retention') return b.retentionRate - a.retentionRate;
      return 0;
    });

  return (
    <div className="page">
      <Topbar title="Catalogue Vidéos" subtitle={`${videos.length} vidéos · ${(totalViews / 1000).toFixed(0)}k vues`} />
      <div className="page-content">

        {/* Summary bar */}
        <div className="videos-summary stagger">
          <div className="vs-stat">
            <p className="vs-val mono">{videos.length}</p>
            <p className="vs-lbl">Vidéos publiées</p>
          </div>
          <div className="vs-stat">
            <p className="vs-val mono">{(totalViews / 1000).toFixed(0)}k</p>
            <p className="vs-lbl">Vues totales</p>
          </div>
          <div className="vs-stat">
            <p className="vs-val mono">{avgRetention}%</p>
            <p className="vs-lbl">Rétention moyenne</p>
          </div>
          <div className="vs-stat">
            <p className="vs-val mono">{totalRevenue.toLocaleString('fr-FR')} €</p>
            <p className="vs-lbl">Revenus totaux</p>
          </div>
          <div className="vs-best">
            <p className="vs-best-label">Meilleure vidéo</p>
            <p className="vs-best-title">{bestVideo.title}</p>
            <p className="vs-best-views mono">{bestVideo.views.toLocaleString('fr-FR')} vues</p>
          </div>
        </div>

        {/* Controls */}
        <div className="controls-bar">
          <div className="search-field">
            <Search size={13} />
            <input placeholder="Rechercher une vidéo..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="filter-tabs">
            {categories.map(c => (
              <button key={c} className={`filter-tab ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>{c}</button>
            ))}
          </div>
          <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)}>
            <option value="date">Plus récentes</option>
            <option value="views">Plus vues</option>
            <option value="revenue">Plus rentables</option>
            <option value="retention">Meilleure rétention</option>
          </select>
        </div>

        {/* Table */}
        <div className="content-table-card">
          <table className="content-table videos-full-table">
            <thead>
              <tr>
                <th style={{ width: 56 }} />
                <th>Vidéo</th>
                <th>Vues</th>
                <th>Likes</th>
                <th>Rétention</th>
                <th>CTR</th>
                <th>RPM / CPM</th>
                <th>Revenus</th>
                <th style={{ width: 40 }} />
              </tr>
            </thead>
            <tbody>
              {filtered.map(v => (
                <VideoRow
                  key={v.id}
                  video={v}
                  expanded={expandedId === v.id}
                  onToggle={() => setExpandedId(expandedId === v.id ? null : v.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}