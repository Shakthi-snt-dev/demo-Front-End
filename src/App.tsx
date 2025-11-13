import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { POSCheckout } from './components/POSCheckout';
import { Inventory } from './components/Inventory';
import { Customers } from './components/Customers';
import { Reports } from './components/Reports';
import { Settings } from './components/Settings';
import { Tickets } from './components/Tickets';
import { Employees } from './components/Employees';
import { Subscription } from './components/Subscription';
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import { Integrations } from './components/Integrations';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <div className="flex-1 overflow-auto">
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'pos' && <POSCheckout />}
        {currentPage === 'inventory' && <Inventory />}
        {currentPage === 'customers' && <Customers />}
        {currentPage === 'tickets' && <Tickets />}
        {currentPage === 'employees' && <Employees />}
        {currentPage === 'reports' && <Reports />}
        {currentPage === 'integrations' && <Integrations />}
        {currentPage === 'subscription' && <Subscription />}
        {currentPage === 'settings' && <Settings />}
      </div>
    </div>
  );
}
