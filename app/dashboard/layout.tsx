'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ProtectedRoute } from '@/lib/protected-route';
import { useAuth } from '@/lib/auth-context';
import {
  LayoutDashboard,
  Bot,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/agents', label: 'My Agents', icon: Bot },
  { href: '/dashboard/usage', label: 'Usage', icon: BarChart3 },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif" }}>
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 w-64 h-screen border-r border-slate-200 bg-white flex flex-col z-30">
          {/* Logo */}
          <div className="px-6 pt-6 pb-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900 tracking-tight">
                AgentHub
              </span>
            </Link>
          </div>

          {/* User info */}
          <div className="mx-4 mb-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">
              Signed in as
            </div>
            <div className="text-sm font-semibold text-slate-800 truncate">
              {user?.email}
            </div>
            <div className="mt-1.5">
              <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 capitalize">
                {user?.plan} Plan
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${
                    isActive ? 'text-indigo-600' : 'text-slate-400'
                  }`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Bottom actions */}
          <div className="px-3 pb-6 space-y-1">
            <button
              onClick={logout}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              Sign out
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="ml-64 min-h-screen">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
