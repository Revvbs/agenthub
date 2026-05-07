'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ProtectedRoute } from '@/lib/protected-route';
import { useAuth } from '@/lib/auth-context';
import { useEffect, useState } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    // Check admin access
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
    { href: '/admin', label: '📊 Dashboard', icon: '📊' },
    { href: '/admin/users', label: '👥 Users', icon: '👥' },
    { href: '/admin/agents', label: '🤖 Agents', icon: '🤖' },
    { href: '/admin/billing', label: '💰 Billing', icon: '💰' },
  ];

  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-gray-400 mb-6">You don\'t have admin privileges.</p>
          <Link
            href="/dashboard"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded font-semibold transition"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (isAdmin === null) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white">
        {/* Sidebar */}
        <div className="fixed left-0 top-0 w-64 h-screen border-r border-gray-800 bg-gray-950 p-6 flex flex-col">
          <div className="text-2xl font-bold mb-8">
            <Link href="/">
              <span className="text-purple-500">⚡</span>
              <span className="text-purple-400"> Admin</span>
            </Link>
          </div>

          {/* Admin info */}
          <div className="mb-6 p-3 bg-gray-900 rounded border border-purple-800">
            <div className="text-sm text-gray-400">Admin Panel</div>
            <div className="font-semibold truncate">{user?.email}</div>
            <div className="text-xs text-purple-400 mt-1 uppercase">🔑 Administrator</div>
          </div>

          <nav className="space-y-2 flex-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-2 rounded transition ${
                    isActive
                      ? 'bg-purple-600 text-white'
                      : 'hover:bg-gray-800 text-gray-300'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 border-t border-gray-800 space-y-2">
            <Link
              href="/dashboard"
              className="block w-full text-center bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded transition text-sm"
            >
              ← User Dashboard
            </Link>
            <button
              onClick={logout}
              className="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-semibold transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="ml-64 p-8">
          {children}
        </div>
      </div>
    </ProtectedRoute>
  );
}
