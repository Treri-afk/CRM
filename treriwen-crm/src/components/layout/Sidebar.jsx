import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, TrendingUp, CheckSquare,
  Settings, ChevronRight, Zap, LogOut,
  FileText, Receipt, CalendarDays, BarChart3, UserCircle2,
  RefreshCw, Youtube, Video, Camera, HeartHandshake,
  Instagram, Twitter, Music2, Play
} from 'lucide-react';
import './Sidebar.css';

/* ─── Icône custom TikTok (Lucide n'en a pas) ─────────────────────────────── */
function TikTokIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

/* ─── Items nav ───────────────────────────────────────────────────────────── */
const navItems = [
  { to: '/',        icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/clients', icon: Users,           label: 'Clients'   },
  { to: '/deals',   icon: TrendingUp,      label: 'Pipeline'  },
  { to: '/tasks',   icon: CheckSquare,     label: 'Tâches'    },
  { to: '/agenda',  icon: CalendarDays,    label: 'Agenda'    },
];

const docItems = [
  { to: '/devis',       icon: FileText,  label: 'Devis'       },
  { to: '/factures',    icon: Receipt,   label: 'Factures'    },
  { to: '/abonnements', icon: RefreshCw, label: 'Abonnements' },
];

const reportItems = [
  { to: '/analytics', icon: BarChart3,   label: 'Analytics' },
  { to: '/equipe',    icon: UserCircle2, label: 'Équipe'    },
];

const contentItems = [
  { to: '/content',              icon: Youtube,   label: 'Dashboard YouTube' },
  { to: '/content/videos',       icon: Video,     label: 'Vidéos'           },
  { to: '/content/equipment',    icon: Camera,    label: 'Matériel'         },
  { to: '/content/partnerships', icon: HeartHandshake, label: 'Partenariats'     },
];

const socialItems = [
  { to: '/social',                  icon: BarChart3,  label: 'Vue globale'    },
  { to: '/social/instagram',        icon: Instagram,  label: 'Instagram'      },
  { to: '/social/tiktok',           icon: TikTokIcon, label: 'TikTok'         },
  { to: '/social/twitter',          icon: Twitter,    label: 'X / Twitter'    },
  { to: '/social/youtube_shorts',   icon: Play,       label: 'YouTube Shorts' },
];

const bottomItems = [
  { to: '/settings', icon: Settings, label: 'Paramètres' },
];

/* ─── NavSection ──────────────────────────────────────────────────────────── */
function NavSection({ label, items }) {
  return (
    <nav className="sidebar-nav">
      <p className="nav-section-label">{label}</p>
      {items.map(({ to, icon: Icon, label: itemLabel }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/' || to === '/content' || to === '/social'}
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <Icon size={16} strokeWidth={1.8} />
          <span>{itemLabel}</span>
          <ChevronRight size={12} className="nav-arrow" />
        </NavLink>
      ))}
    </nav>
  );
}

/* ─── Sidebar ─────────────────────────────────────────────────────────────── */
export default function Sidebar() {
  return (
    <aside className="sidebar">

      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon"><Zap size={16} strokeWidth={2.5} /></div>
        <span className="logo-text">NovaCRM</span>
      </div>

      <NavSection label="Navigation" items={navItems} />
      <NavSection label="Documents"  items={docItems} />
      <NavSection label="Rapports"   items={reportItems} />

      {/* ── Séparateur Création de contenu ── */}
      <div className="sidebar-separator">
        <span>Création de contenu</span>
      </div>

      <NavSection label="YouTube & Contenu" items={contentItems} />

      {/* ── Séparateur Réseaux sociaux ── */}
      <div className="sidebar-separator">
        <span>Réseaux sociaux</span>
      </div>

      <NavSection label="Plateformes" items={socialItems} />

      {/* Spacer */}
      <div className="sidebar-spacer" />

      {/* Pipeline widget */}
      <div className="sidebar-widget">
        <p className="widget-label">Pipeline ce mois</p>
        <p className="widget-value">415 000 €</p>
        <div className="widget-bar">
          <div className="widget-bar-fill" style={{ width: '68%' }} />
        </div>
        <p className="widget-sub">68% de l'objectif</p>
      </div>

      {/* Bottom nav */}
      <nav className="sidebar-nav bottom">
        {bottomItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Icon size={16} strokeWidth={1.8} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User profile */}
      <div className="sidebar-profile">
        <div className="profile-avatar">JD</div>
        <div className="profile-info">
          <p className="profile-name">Jean Dupont</p>
          <p className="profile-role">Admin</p>
        </div>
        <button className="profile-logout" title="Déconnexion">
          <LogOut size={14} />
        </button>
      </div>

    </aside>
  );
}