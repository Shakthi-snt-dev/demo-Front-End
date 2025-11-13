import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  BarChart3, 
  Settings as SettingsIcon,
  Store,
  LogOut,
  Menu,
  X,
  FileText,
  UserCircle,
  Crown,
  Plug
} from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'pos', label: 'POS Checkout', icon: ShoppingCart },
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'tickets', label: 'Tickets', icon: FileText },
  { id: 'employees', label: 'Employees', icon: UserCircle },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'integrations', label: 'Integrations', icon: Plug },
  { id: 'subscription', label: 'Subscription', icon: Crown },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
];

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-blue-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <Store className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-white">RepairPOS</h2>
            <p className="text-blue-200">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setIsMobileOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-blue-700 text-white shadow-lg'
                  : 'text-blue-100 hover:bg-blue-700/50 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-blue-700">
        <Button
          variant="ghost"
          className="w-full justify-start text-blue-100 hover:bg-blue-700/50 hover:text-white"
          onClick={() => window.location.reload()}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-lg shadow-lg"
      >
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-blue-600 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
