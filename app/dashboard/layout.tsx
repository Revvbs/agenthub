'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ProtectedRoute } from '@/lib/protected-route';
import { useAuth } from '@/lib/auth-context';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    { href: '/dashboard', label: '📊 Dashboard', icon: '📊' },
    { href: '/dashboard/agents', label: '🤖 My Agents', icon: '🤖' },
    { href: '/dashboard/usage', label: '⚡ Usage', icon: '⚡' },
    { href: '/dashboard/settings', label: '⚙️ Settings', icon: '⚙️' },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white text-gray-900">
        {/* Sidebar */}
        <div className="fixed left-0 top-0 w-64 h-screen border-r border-gray-200 bg-white p-6 flex flex-col">
          <div className="text-2xl font-bold mb-8">
            <Link href="/">
              <span className="text-blue-600">&lt;</span>
              AgentHub
              <span className="text-blue-600">/&gt;</span>
            </Link>
          </div>
          
          {/* User info */}
          <div className="mb-6 p-3 bg-gray-50 rounded border border-gray-200">
            <div className="text-sm text-gray-500">Logged in as</div>
            <div className="font-semibold truncate">{user?.email}</div>
            <div className="text-xs text-blue-600 mt-1 uppercase">{user?.plan} Plan</div>
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
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 border-t border-gray-200">
            <button
              onClick={logout}
              className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold transition"
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
