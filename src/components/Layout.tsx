import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Ticket, 
  FileUp, 
  BarChart3, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Bell,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { mockNotifications } from '@/lib/mockData';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LayoutProps {
  children: React.ReactNode;
}

const adminNavItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/tickets', label: 'Semua Tiket', icon: Ticket },
  { path: '/reports', label: 'Laporan', icon: BarChart3 },
  { path: '/users', label: 'Pengguna', icon: Users },
  { path: '/settings', label: 'Pengaturan', icon: Settings },
];

const hdNavItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/tickets', label: 'Semua Tiket', icon: Ticket },
  { path: '/import', label: 'Import Tiket', icon: FileUp },
  { path: '/reports', label: 'Laporan', icon: BarChart3 },
  { path: '/users', label: 'Pengguna', icon: Users },
];

const guestNavItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/tickets', label: 'Semua Tiket', icon: Ticket },
  { path: '/reports', label: 'Laporan', icon: BarChart3 },
  { path: '/users', label: 'Pengguna', icon: Users },
];

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = user?.role === 'admin' ? adminNavItems : 
                   user?.role === 'hd' ? hdNavItems :
                   user?.role === 'guest' ? guestNavItems : [];

  const unreadNotifications = mockNotifications.filter(n => !n.isRead && n.userId === user?.id).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50">
      {/* Subtle gradient orbs for visual interest */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Mobile Menu Toggle */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden hover:bg-slate-100"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              <Link to="/dashboard" className="flex items-center gap-3 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative w-10 h-10 bg-gradient-to-br from-primary to-teal-400 rounded-xl flex items-center justify-center shadow-md">
                    <Ticket className="w-5 h-5 text-white" />
                  </div>
                </div>
                <span className="font-bold text-lg hidden sm:block bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">SiTiket</span>
              </Link>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`gap-2 px-4 rounded-xl transition-all duration-200 ${
                        isActive 
                          ? 'bg-primary/10 text-primary hover:bg-primary/15 font-medium' 
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative rounded-xl hover:bg-slate-100">
                    <Bell className="w-5 h-5 text-slate-600" />
                    {unreadNotifications > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gradient-to-r from-red-500 to-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md">
                        {unreadNotifications}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 rounded-xl shadow-xl border-slate-200/50 bg-white/95 backdrop-blur-xl">
                  <DropdownMenuLabel className="font-semibold text-slate-800">Notifikasi</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {mockNotifications.slice(0, 5).map((notif) => (
                    <DropdownMenuItem key={notif.id} className="flex flex-col items-start gap-1 py-3 px-4 cursor-pointer hover:bg-slate-50 rounded-lg mx-1">
                      <span className={`text-sm ${!notif.isRead ? 'font-semibold text-slate-800' : 'text-slate-600'}`}>
                        {notif.title}
                      </span>
                      <span className="text-xs text-slate-500">{notif.message}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2 pl-2 pr-3 rounded-xl hover:bg-slate-100">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-teal-400 rounded-lg flex items-center justify-center text-sm font-semibold text-white shadow-sm">
                      {user?.name.charAt(0)}
                    </div>
                    <span className="hidden sm:block max-w-[100px] truncate font-medium text-slate-700">{user?.name}</span>
                    <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-xl border-slate-200/50 bg-white/95 backdrop-blur-xl">
                  <DropdownMenuLabel className="p-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-800">{user?.name}</span>
                      <span className="text-xs font-normal text-slate-500 capitalize mt-0.5">{user?.role}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={logout} 
                    className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer mx-1 rounded-lg"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Keluar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Nav Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <nav className="fixed left-0 top-16 bottom-0 w-72 bg-white/95 backdrop-blur-xl border-r border-slate-200/50 p-4 animate-slide-in-left shadow-xl">
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link 
                    key={item.path} 
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className={`w-full justify-start gap-3 rounded-xl h-12 ${
                        isActive 
                          ? 'bg-primary/10 text-primary font-medium' 
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
            
            {/* Mobile footer */}
            <div className="absolute bottom-6 left-4 right-4">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs text-slate-500">SiTiket v1.0</span>
              </div>
            </div>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="relative container mx-auto px-4 py-6 md:py-8">
        {children}
      </main>
    </div>
  );
};
