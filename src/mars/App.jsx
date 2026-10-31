/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useMarsStore } from './store/useMarsStore.js';
import { TopNav } from './components/navigation/TopNav.jsx';
import { HomePage } from './pages/Home/HomePage.jsx';
import { ExplorerPage } from './pages/Explorer/ExplorerPage.jsx';
import { SurfacePage } from './pages/Explorer/SurfacePage.jsx';
import { AtmospherePage } from './pages/Atmosphere/AtmospherePage.jsx';
import { EnvironmentPage } from './pages/Environment/EnvironmentPage.jsx';
import { DashboardPage } from './pages/Dashboard/DashboardPage.jsx';
import { ComparisonPage } from './pages/Dashboard/ComparisonPage.jsx';
import MarsDriftContainer from './drift/MarsDriftContainer.jsx';

export default function App({ onReturnToDashboard }) {
  const { activePage, setActivePage } = useMarsStore();

  const renderActivePage = () => {
    switch (activePage) {
      case 'simulation':
        return (
          <MarsDriftContainer
            onReturnToDashboard={onReturnToDashboard}
            onSwitchToResearch={() => setActivePage('overview')}
          />
        );
      case 'overview':
        return <HomePage />;
      case 'explorer':
        return <ExplorerPage />;
      case 'surface':
        return <SurfacePage />;
      case 'atmosphere':
        return <AtmospherePage />;
      case 'environment':
        return <EnvironmentPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'comparison':
        return <ComparisonPage />;
      default:
        return (
          <MarsDriftContainer
            onReturnToDashboard={onReturnToDashboard}
            onSwitchToResearch={() => setActivePage('overview')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#04060A] text-slate-100 flex flex-col font-sans selection:bg-amber-600/30 selection:text-amber-200">
      <TopNav onReturnToDashboard={onReturnToDashboard} />
      <div className="flex-1 flex flex-col">
        {renderActivePage()}
      </div>
    </div>
  );
}
