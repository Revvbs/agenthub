'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

interface AdminStats {
  users: { total: number; newThisWeek: number };
  agents: { total: number; active: number };
  usage: { totalTokens: number; totalMessages: number };
  billing: { totalRevenue: number; paidCount: number };
  usersByPlan: Array<{ plan: string; count: number }>;
}

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [recentAgents, setRecentAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch(`/api/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setStats(data.stats);
        setRecentUsers(data.recentUsers || []);
        setRecentAgents(data.recentAgents || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500">System overview and management</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link href="/admin/users" className="border border-gray-200 rounded p-6 bg-white shadow-sm hover:border-purple-500 transition">
          <div className="text-3xl mb-2">👥</div>
          <div className="text-gray-500 text-sm">Total Users</div>
          <div className="text-2xl font-bold text-gray-900">{stats?.users.total || 0}</div>
          <div className="text-xs text-green-600 mt-1">+{stats?.users.newThisWeek || 0} this week</div>
        </Link>

        <Link href="/admin/agents" className="border border-gray-200 rounded p-6 bg-white shadow-sm hover:border-purple-500 transition">
          <div className="text-3xl mb-2">🤖</div>
          <div className="text-gray-500 text-sm">Total Agents</div>
          <div className="text-2xl font-bold text-gray-900">{stats?.agents.total || 0}</div>
          <div className="text-xs text-green-600 mt-1">{stats?.agents.active || 0} active</div>
        </Link>

        <div className="border border-gray-200 rounded p-6 bg-white shadow-sm">
          <div className="text-3xl mb-2">💬</div>
          <div className="text-gray-500 text-sm">Total Messages</div>
          <div className="text-2xl font-bold text-gray-900">{(stats?.usage.totalMessages || 0).toLocaleString()}</div>
          <div className="text-xs text-gray-500 mt-1">{((stats?.usage.totalTokens || 0) / 1000).toFixed(0)}K tokens</div>
        </div>

        <Link href="/admin/billing" className="border border-gray-200 rounded p-6 bg-white shadow-sm hover:border-purple-500 transition">
          <div className="text-3xl mb-2">💰</div>
          <div className="text-gray-500 text-sm">Revenue</div>
          <div className="text-2xl font-bold text-gray-900">Rp {(stats?.billing.totalRevenue || 0).toLocaleString()}</div>
          <div className="text-xs text-gray-500 mt-1">{stats?.billing.paidCount || 0} payments</div>
        </Link>
      </div>

      {/* Users by Plan */}
      <div className="border border-gray-200 rounded p-6 bg-white shadow-sm mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Users by Plan</h2>
        <div className="grid grid-cols-3 gap-4">
          {stats?.usersByPlan.map((item) => (
            <div key={item.plan} className="text-center p-4 bg-gray-100 rounded">
              <div className="text-2xl font-bold text-gray-900">{item.count}</div>
              <div className="text-sm text-gray-500 capitalize">{item.plan}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Users */}
      <div className="border border-gray-200 rounded p-6 bg-white shadow-sm mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Recent Users</h2>
          <Link href="/admin/users" className="text-sm text-purple-600 hover:underline">View all →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b border-gray-200">
                <th className="text-left py-2">Email</th>
                <th className="text-left py-2">Plan</th>
                <th className="text-right py-2">Tokens</th>
                <th className="text-right py-2">Joined</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((u) => (
                <tr key={u.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-2">
                    <Link href={`/admin/users/${u.id}`} className="text-blue-600 hover:underline">{u.email}</Link>
                  </td>
                  <td className="py-2 capitalize">{u.plan}</td>
                  <td className="text-right py-2">{parseInt(u.tokens_used).toLocaleString()}</td>
                  <td className="text-right py-2 text-gray-500">{new Date(u.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Agents */}
      <div className="border border-gray-200 rounded p-6 bg-white shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Recent Agents</h2>
          <Link href="/admin/agents" className="text-sm text-purple-600 hover:underline">View all →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b border-gray-200">
                <th className="text-left py-2">Name</th>
                <th className="text-left py-2">Type</th>
                <th className="text-left py-2">User</th>
                <th className="text-left py-2">Status</th>
                <th className="text-right py-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {recentAgents.map((a) => (
                <tr key={a.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-2 font-semibold text-gray-900">{a.name}</td>
                  <td className="py-2 text-gray-500">{a.type}</td>
                  <td className="py-2 text-gray-500">{a.user_email}</td>
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      a.status === 'active' ? 'bg-green-100 text-green-700' :
                      a.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="text-right py-2 text-gray-500">{new Date(a.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
