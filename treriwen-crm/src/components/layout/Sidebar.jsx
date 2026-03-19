import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, TrendingUp, CheckSquare,
  Settings, ChevronRight, Zap, LogOut,
  FileText, Receipt, CalendarDays, BarChart3, UserCircle2,
  RefreshCw, Youtube, Video, Camera,
  Instagram, Twitter, Play, Wrench, Home, Building2,
  LineChart, Activity, Wallet, Target,
  Globe, Leaf, BookOpen, Bell,
  TrendingDown, Calendar, BookMarked,
  HeartHandshake
} from 'lucide-react';
import './Sidebar.css';

function TikTokIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

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
  { to: '/content/videos',       icon: Video,     label: 'Vidéos'            },
  { to: '/content/equipment',    icon: Camera,    label: 'Matériel'          },
  { to: '/content/partnerships', icon: HeartHandshake, label: 'Partenariats'      },
];
const socialItems = [
  { to: '/social',                icon: BarChart3,  label: 'Vue globale'    },
  { to: '/social/instagram',      icon: Instagram,  label: 'Instagram'      },
  { to: '/social/tiktok',         icon: TikTokIcon, label: 'TikTok'         },
  { to: '/social/twitter',        icon: Twitter,    label: 'X / Twitter'    },
  { to: '/social/youtube_shorts', icon: Play,       label: 'YouTube Shorts' },
];
const immoItems = [
  { to: '/immo',            icon: Home,      label: 'Tableau de bord' },
  { to: '/immo/biens',      icon: Building2, label: 'Mes biens'       },
  { to: '/immo/locataires', icon: Users,     label: 'Locataires'      },
  { to: '/immo/travaux',    icon: Wrench,    label: 'Travaux'         },
  { to: '/immo/finances',   icon: BarChart3, label: 'Finances'        },
  { to: '/immo/documents',  icon: FileText,  label: 'Documents'       },
];
const japanItems = [
  { to: '/japan/eurjpy',     icon: TrendingDown, label: 'EUR/JPY'          },
  { to: '/japan/calendrier', icon: Calendar,     label: 'Calendrier JP'     },
  { to: '/japan/japonais',   icon: BookMarked,   label: 'Apprendre le JP'  },
];
const persoItems = [
  { to: '/patrimoine', icon: LineChart, label: 'Investissements' },
  { to: '/sante',      icon: Activity,  label: 'Santé & Sport'  },
  { to: '/budget',     icon: Wallet,    label: 'Budget'          },
  { to: '/okr',        icon: Target,    label: 'Objectifs & OKR' },
];
const lifeOSItems = [
  { to: '/life-os',       icon: Globe,    label: 'Life OS'              },
  { to: '/habitudes',     icon: Leaf,     label: 'Habitudes'            },
  { to: '/knowledge',     icon: BookOpen, label: 'Base de connaissances'},
  { to: '/notifications', icon: Bell,     label: 'Notifications'        },
];
const bottomItems = [
  { to: '/settings', icon: Settings, label: 'Paramètres' },
];

function NavSection({ label, items, onNav }) {
  return (
    <nav className="sidebar-nav">
      <p className="nav-section-label">{label}</p>
      {items.map(({ to, icon: Icon, label: itemLabel }) => (
        <NavLink
          key={to}
          to={to}
          end={['/', '/content', '/social', '/immo', '/life-os'].includes(to)}
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          onClick={onNav}
        >
          <Icon size={16} strokeWidth={1.8} />
          <span>{itemLabel}</span>
          <ChevronRight size={12} className="nav-arrow" />
        </NavLink>
      ))}
    </nav>
  );
}

export default function Sidebar({ open, onClose }) {
  const handleNavClick = () => { if (onClose) onClose(); };
  return (
    <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
      <div className="sidebar-logo">
        <div className="logo-icon"><Zap size={16} strokeWidth={2.5} /></div>
        <span className="logo-text">NovaCRM</span>
      </div>

      <div className="sidebar-scroll">
        <NavSection label="Navigation"        items={navItems}     onNav={handleNavClick} />
        <NavSection label="Documents"         items={docItems}     onNav={handleNavClick} />
        <NavSection label="Rapports"          items={reportItems}  onNav={handleNavClick} />
        <div className="sidebar-separator"><span>Création de contenu</span></div>
        <NavSection label="YouTube & Contenu" items={contentItems} onNav={handleNavClick} />
        <div className="sidebar-separator"><span>Réseaux sociaux</span></div>
        <NavSection label="Plateformes"       items={socialItems}  onNav={handleNavClick} />
        <div className="sidebar-separator"><span>Immobilier Japon</span></div>
        <NavSection label="Parc immobilier"   items={immoItems}    onNav={handleNavClick} />
        <div className="sidebar-separator"><span>🇯🇵 Japon</span></div>
        <NavSection label="Outils Japon"      items={japanItems}   onNav={handleNavClick} />
        <div className="sidebar-separator"><span>Vie personnelle</span></div>
        <NavSection label="Perso"             items={persoItems}   onNav={handleNavClick} />
        <div className="sidebar-separator"><span>Life OS</span></div>
        <NavSection label="Système de vie"    items={lifeOSItems}  onNav={handleNavClick} />
        <div className="sidebar-widget">
          <p className="widget-label">Pipeline ce mois</p>
          <p className="widget-value">415 000 €</p>
          <div className="widget-bar"><div className="widget-bar-fill" style={{ width: '68%' }} /></div>
          <p className="widget-sub">68% de l'objectif</p>
        </div>
      </div>

      <nav className="sidebar-nav bottom">
        {bottomItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} onClick={handleNavClick} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Icon size={16} strokeWidth={1.8} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-profile">
        <div className="profile-avatar">JD</div>
        <div className="profile-info">
          <p className="profile-name">Jean Dupont</p>
          <p className="profile-role">Admin</p>
        </div>
        <button className="profile-logout" title="Déconnexion"><LogOut size={14} /></button>
      </div>
    </aside>
  );
}