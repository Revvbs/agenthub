'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ProtectedRoute } from '@/lib/protected-route';
import { useAuth } from '@/lib/auth-context';
import { useEffect, useState } from 'react';
import { LayoutDashboard, Users, Bot, CreditCard, LogOut, ArrowLeft, Shield } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch('/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsAdmin(res.ok);
      } catch {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, []);

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/agents', label: 'Agents', icon: Bot },
    { href: '/admin/billing', label: 'Billing', icon: CreditCard },
  ];

  if (isAdmin === false) {
    return (
      <div
        className="min-h-screen bg-[#F8FAFC] flex items-center justify-center"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <div className="text-center bg-white border border-slate-200 shadow-sm rounded-xl p-10 max-w-md">
          <div className="w-14 h-14 rounded-xl bg-red-50 flex items-center justify-center mx-auto mb-5">
            <Shield className="w-7 h-7 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2 text-slate-900">Access Denied</h1>
          <p className="text-slate-500 mb-6">You do not have admin privileges.</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (isAdmin === null) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div
        className="min-h-screen bg-[#F8FAFC] text-slate-900"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 w-64 h-screen border-r border-slate-200 bg-white flex flex-col shadow-sm">
          {/* Brand */}
          <div className="p-6 pb-4">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
                <Shield className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900">Admin</span>
            </Link>
          </div>

          {/* Admin Info */}
          <div className="mx-4 mb-6 p-3 bg-violet-50 rounded-xl border border-violet-100">
            <div className="text-xs text-violet-600 font-medium uppercase tracking-wider mb-1">Administrator</div>
            <div className="text-sm font-semibold text-slate-900 truncate">{user?.email}</div>
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
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-violet-50 text-violet-700 font-medium'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-slate-200 space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              User Dashboard
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="ml-64 p-8">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
