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
          <Route path="/content"              element={<ContentDashboard />} />
          <Route path="/content/videos"       element={<ContentVideos />} />
          <Route path="/content/equipment"    element={<ContentEquipment />} />
          <Route path="/content/partnerships" element={<ContentPartnerships />} />
          <Route path="/social"          element={<SocialDashboard />} />
          <Route path="/social/:network" element={<SocialNetworkPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}