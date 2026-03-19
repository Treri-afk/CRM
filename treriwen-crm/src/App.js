import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Deals from './pages/Deals';
import Tasks from './pages/Tasks';
import Devis from './pages/Devis';
import Factures from './pages/Factures';
import Abonnements from './pages/Abonnements';
import Agenda from './pages/Agenda';
import Analytics from './pages/Analytics';
import Equipe from './pages/Equipe';
import Settings from './pages/Settings';
import ContentDashboard from './pages/ContentDashboard';
import ContentVideos from './pages/ContentVideos';
import ContentEquipment from './pages/ContentEquipment';
import ContentPartnerships from './pages/ContentPartnerships';
import SocialDashboard from './pages/SocialDashboard';
import SocialNetworkPage from './pages/SocialNetworkPage';
import ImmoDashboard from './pages/ImmoDashboard';
import ImmoProperties from './pages/ImmoProperties';
import ImmoPropertyDetail from './pages/ImmoPropertyDetail';
import ImmoRepairs from './pages/ImmoRepairs';
import ImmoFinances from './pages/ImmoFinances';
import ImmoTenants from './pages/ImmoTenants';
import ImmoDocuments from './pages/ImmoDocuments';
import Patrimoine from './pages/Patrimoine';
import Sante from './pages/Sante';
import Budget from './pages/Budget';
import OKR from './pages/OKR';
import LifeOS from './pages/LifeOS';
import Habitudes from './pages/Habitudes';
import KnowledgeBase from './pages/KnowledgeBase';
import Notifications from './pages/Notifications';
import EurJpy from './pages/EurJpy';
import JapanCalendar from './pages/JapanCalendar';
import JapaneseLearning from './pages/JapaneseLearning';
import './styles/globals.css';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/"             element={<Dashboard />} />
          <Route path="/clients"      element={<Clients />} />
          <Route path="/deals"        element={<Deals />} />
          <Route path="/tasks"        element={<Tasks />} />
          <Route path="/devis"        element={<Devis />} />
          <Route path="/factures"     element={<Factures />} />
          <Route path="/abonnements"  element={<Abonnements />} />
          <Route path="/agenda"       element={<Agenda />} />
          <Route path="/analytics"    element={<Analytics />} />
          <Route path="/equipe"       element={<Equipe />} />
          <Route path="/settings"     element={<Settings />} />
          <Route path="/content"                  element={<ContentDashboard />} />
          <Route path="/content/videos"           element={<ContentVideos />} />
          <Route path="/content/equipment"        element={<ContentEquipment />} />
          <Route path="/content/partnerships"     element={<ContentPartnerships />} />
          <Route path="/social"              element={<SocialDashboard />} />
          <Route path="/social/:network"     element={<SocialNetworkPage />} />
          <Route path="/immo"                element={<ImmoDashboard />} />
          <Route path="/immo/biens"          element={<ImmoProperties />} />
          <Route path="/immo/travaux"        element={<ImmoRepairs />} />
          <Route path="/immo/finances"       element={<ImmoFinances />} />
          <Route path="/immo/locataires"     element={<ImmoTenants />} />
          <Route path="/immo/documents"      element={<ImmoDocuments />} />
          <Route path="/immo/:id"            element={<ImmoPropertyDetail />} />
          <Route path="/patrimoine"          element={<Patrimoine />} />
          <Route path="/sante"               element={<Sante />} />
          <Route path="/budget"              element={<Budget />} />
          <Route path="/okr"                 element={<OKR />} />
          <Route path="/life-os"             element={<LifeOS />} />
          <Route path="/habitudes"           element={<Habitudes />} />
          <Route path="/knowledge"           element={<KnowledgeBase />} />
          <Route path="/notifications"       element={<Notifications />} />
          <Route path="/japan/eurjpy"        element={<EurJpy />} />
          <Route path="/japan/calendrier"    element={<JapanCalendar />} />
          <Route path="/japan/japonais"      element={<JapaneseLearning />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}