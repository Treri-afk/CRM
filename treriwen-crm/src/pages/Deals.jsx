import React, { useState } from 'react';
import { TrendingUp, Euro, Calendar, User, MoreHorizontal, Plus } from 'lucide-react';
import Topbar from '../components/layout/Topbar';
import Badge from '../components/ui/Badge';
import { deals, stages } from '../data/mockData';
import './Deals.css';

function DealCard({ deal }) {
  const probability = deal.probability;
  const progressColor =
    probability >= 80 ? 'var(--green)' :
    probability >= 50 ? 'var(--yellow)' :
    probability > 0 ? 'var(--accent)' : 'var(--red)';

  return (
    <div className="deal-card fade-in">
      <div className="deal-card-header">
        <p className="deal-card-title">{deal.title}</p>
        <button className="deal-card-menu">
          <MoreHorizontal size={13} />
        </button>
      </div>

      <p className="deal-card-client">{deal.client}</p>

      <div className="deal-card-value mono">
        {deal.value.toLocaleString('fr-FR')} €
      </div>

      <div className="deal-card-progress">
        <div className="deal-progress-track">
          <div
            className="deal-progress-fill"
            style={{ width: `${probability}%`, background: progressColor }}
          />
        </div>
        <span className="deal-progress-pct mono">{probability}%</span>
      </div>

      <div className="deal-card-footer">
        <span className="deal-card-meta">
          <Calendar size={10} />
          {deal.closeDate}
        </span>
        <span className="deal-card-meta">
          <User size={10} />
          {deal.owner}
        </span>
      </div>
    </div>
  );
}

export default function Deals() {
  const [view, setView] = useState('kanban');

  const totalPipeline = deals
    .filter(d => !['won', 'lost'].includes(d.stage))
    .reduce((sum, d) => sum + d.value, 0);

  const wonRevenue = deals
    .filter(d => d.stage === 'won')
    .reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="page">
      <Topbar
        title="Pipeline"
        subtitle={`${deals.length} deals · ${totalPipeline.toLocaleString('fr-FR')} € en jeu`}
      />

      <div className="page-content">
        {/* Summary Bar */}
        <div className="pipeline-summary stagger">
          {stages.map(stage => {
            const stageDeals = deals.filter(d => d.stage === stage.id);
            const stageValue = stageDeals.reduce((s, d) => s + d.value, 0);
            return (
              <div key={stage.id} className="pipeline-summary-item">
                <div
                  className="pipeline-summary-dot"
                  style={{ background: stage.color }}
                />
                <div>
                  <p className="pipeline-summary-label">{stage.label}</p>
                  <p className="pipeline-summary-value mono">
                    {stageValue > 0 ? `${stageValue.toLocaleString('fr-FR')} €` : '—'}
                    <span className="pipeline-summary-count">
                      {stageDeals.length > 0 && ` · ${stageDeals.length}`}
                    </span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* View Toggle */}
        <div className="view-controls">
          <div className="view-tabs">
            <button
              className={`view-tab ${view === 'kanban' ? 'active' : ''}`}
              onClick={() => setView('kanban')}
            >
              Kanban
            </button>
            <button
              className={`view-tab ${view === 'list' ? 'active' : ''}`}
              onClick={() => setView('list')}
            >
              Liste
            </button>
          </div>
        </div>

        {/* Kanban Board */}
        {view === 'kanban' && (
          <div className="kanban-board">
            {stages.map(stage => {
              const stageDeals = deals.filter(d => d.stage === stage.id);
              return (
                <div key={stage.id} className="kanban-column">
                  <div className="kanban-col-header">
                    <div className="kanban-col-title">
                      <div
                        className="kanban-stage-dot"
                        style={{ background: stage.color }}
                      />
                      <span>{stage.label}</span>
                    </div>
                    <span className="kanban-col-count">{stageDeals.length}</span>
                  </div>

                  <div className="kanban-cards">
                    {stageDeals.map(deal => (
                      <DealCard key={deal.id} deal={deal} />
                    ))}
                    <button className="kanban-add-btn">
                      <Plus size={13} /> Ajouter un deal
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* List View */}
        {view === 'list' && (
          <div className="deals-table-card">
            <table className="deals-table">
              <thead>
                <tr>
                  <th>Deal</th>
                  <th>Client</th>
                  <th>Valeur</th>
                  <th>Statut</th>
                  <th>Probabilité</th>
                  <th>Clôture</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {deals.map(deal => (
                  <tr key={deal.id}>
                    <td>
                      <p className="deals-table-title">{deal.title}</p>
                    </td>
                    <td className="deals-table-client">{deal.client}</td>
                    <td className="mono deals-table-value">
                      {deal.value.toLocaleString('fr-FR')} €
                    </td>
                    <td><Badge type={deal.stage} /></td>
                    <td>
                      <div className="table-proba">
                        <div className="proba-bar-sm">
                          <div
                            className="proba-fill-sm"
                            style={{
                              width: `${deal.probability}%`,
                              background: deal.probability >= 80 ? 'var(--green)' :
                                deal.probability >= 50 ? 'var(--yellow)' : 'var(--accent)'
                            }}
                          />
                        </div>
                        <span className="mono">{deal.probability}%</span>
                      </div>
                    </td>
                    <td className="mono deals-date">{deal.closeDate}</td>
                    <td>
                      <button className="row-action">
                        <MoreHorizontal size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
