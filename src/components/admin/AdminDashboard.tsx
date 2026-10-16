import React, { useState } from 'react';
import {
  ShoppingBag,
  Package,
  Settings,
  Shield,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import { AdminOrdersTab } from './AdminOrdersTab.js';
import { AdminProductsTab } from './AdminProductsTab.js';
import { AdminSettingsTab } from './AdminSettingsTab.js';
import { AdminProfileTab } from './AdminProfileTab.js';
import { AdminMediaTab } from './AdminMediaTab.js';

interface AdminDashboardProps {
  user: { id: string; username: string };
  onLogout: () => void;
  onBackToSite: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout, onBackToSite }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'media' | 'settings' | 'security'>('orders');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    localStorage.removeItem('admin_session_user');
    onLogout();
  };

  const navItems = [
    { id: 'orders', label: 'অর্ডারসমূহ', icon: ShoppingBag },
    { id: 'products', label: 'পণ্যসমূহ', icon: Package },
    { id: 'media', label: 'মিডিয়া / ছবি আপলোড', icon: ImageIcon },
    { id: 'settings', label: 'ওয়েবসাইট সেটিংস', icon: Settings },
    { id: 'security', label: 'সিকিউরিটি / পাসওয়ার্ড', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-[#03130c] text-stone-100 flex flex-col">
      
      {/* Top Navbar */}
      <header className="relative z-30 bg-[#062319] border-b border-amber-500/20 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-300 hover:text-white rounded-lg hover:bg-emerald-900/50"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center font-serif-luxury font-bold text-amber-300 text-sm">
                PR
              </div>
              <span className="font-serif-luxury font-bold text-base sm:text-lg text-amber-300">
                এডমিন প্যানেল
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs text-stone-300 bg-black/40 px-3 py-1.5 rounded-lg border border-emerald-900/50">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>এডমিন: <strong className="text-amber-300">{user.username}</strong></span>
            </div>

            <button
              onClick={onBackToSite}
              className="flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 py-1.5 px-3 rounded-lg border border-amber-500/30 hover:bg-emerald-900/40 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ল্যান্ডিং পেজ</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 py-1.5 px-3 rounded-lg bg-red-950/40 border border-red-800/40 hover:bg-red-900/40 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>লগআউট</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Body with Sidebar + Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row">
        
        {/* Sidebar for Desktop / Dropdown for Mobile */}
        <aside
          className={`${
            mobileMenuOpen ? 'block' : 'hidden'
          } md:block w-full md:w-64 bg-[#051c14] border-r border-emerald-900/40 p-4 shrink-0`}
        >
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/10'
                      : 'text-stone-300 hover:text-white hover:bg-emerald-900/40'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {activeTab === 'orders' && <AdminOrdersTab />}
          {activeTab === 'products' && <AdminProductsTab />}
          {activeTab === 'media' && <AdminMediaTab />}
          {activeTab === 'settings' && <AdminSettingsTab />}
          {activeTab === 'security' && <AdminProfileTab />}
        </main>

      </div>

    </div>
  );
};
