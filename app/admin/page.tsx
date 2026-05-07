'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { Users, Bot, MessageSquare, DollarSign, TrendingUp, ExternalLink } from 'lucide-react';

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Users',
      value: stats?.users.total || 0,
      sub: `+${stats?.users.newThisWeek || 0} this week`,
      subColor: 'text-emerald-600',
      icon: Users,
      href: '/admin/users',
    },
    {
      label: 'Total Agents',
      value: stats?.agents.total || 0,
      sub: `${stats?.agents.active || 0} active`,
      subColor: 'text-emerald-600',
      icon: Bot,
      href: '/admin/agents',
    },
    {
      label: 'Total Messages',
      value: (stats?.usage.totalMessages || 0).toLocaleString(),
      sub: `${((stats?.usage.totalTokens || 0) / 1000).toFixed(0)}K tokens`,
      subColor: 'text-slate-500',
      icon: MessageSquare,
      href: null,
    },
    {
      label: 'Revenue',
      value: `Rp ${(stats?.billing.totalRevenue || 0).toLocaleString()}`,
      sub: `${stats?.billing.paidCount || 0} payments`,
      subColor: 'text-slate-500',
      icon: DollarSign,
      href: '/admin/billing',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-500 mt-1">System overview and management</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          const content = (
            <>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-violet-600" />
                </div>
                {card.href && (
                  <ExternalLink className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                )}
              </div>
              <div className="text-sm text-slate-500 mb-1">{card.label}</div>
              <div className="text-2xl font-bold text-slate-900">{card.value}</div>
              <div className={`text-xs mt-1 ${card.subColor}`}>{card.sub}</div>
            </>
          );

          return card.href ? (
            <Link
              key={card.label}
              href={card.href}
              className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 transition-all duration-200 hover:border-violet-300 hover:shadow-md group"
            >
              {content}
            </Link>
          ) : (
            <div
              key={card.label}
              className="bg-white border border-slate-200 shadow-sm rounded-xl p-6"
            >
              {content}
            </div>
          );
        })}
      </div>

      {/* Users by Plan */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 mb-8">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp className="w-5 h-5 text-violet-600" />
          <h2 className="text-lg font-bold text-slate-900">Users by Plan</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats?.usersByPlan.map((item) => (
            <div key={item.plan} className="text-center p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="text-2xl font-bold text-slate-900">{item.count}</div>
              <div className="text-sm text-slate-500 capitalize mt-0.5">{item.plan}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Users */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-violet-600" />
            <h2 className="text-lg font-bold text-slate-900">Recent Users</h2>
          </div>
          <Link href="/admin/users" className="text-sm text-violet-600 hover:text-violet-700 font-medium transition-colors">
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-200">
                <th className="pb-3 font-medium">Email</th>
                <th className="pb-3 font-medium">Plan</th>
                <th className="pb-3 font-medium text-right">Tokens</th>
                <th className="pb-3 font-medium text-right">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors duration-150">
                  <td className="py-3">
                    <Link href={`/admin/users/${u.id}`} className="text-violet-600 hover:text-violet-700 font-medium transition-colors">
                      {u.email}
                    </Link>
                  </td>
                  <td className="py-3">
                    <span className="rounded-full px-2.5 py-0.5 text-xs font-medium bg-slate-100 text-slate-700 capitalize">
                      {u.plan}
                    </span>
                  </td>
                  <td className="py-3 text-right text-slate-900">{parseInt(u.tokens_used).toLocaleString()}</td>
                  <td className="py-3 text-right text-slate-500">{new Date(u.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Agents */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-violet-600" />
            <h2 className="text-lg font-bold text-slate-900">Recent Agents</h2>
          </div>
          <Link href="/admin/agents" className="text-sm text-violet-600 hover:text-violet-700 font-medium transition-colors">
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-200">
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">User</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium text-right">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentAgents.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50 transition-colors duration-150">
                  <td className="py-3 font-semibold text-slate-900">{a.name}</td>
                  <td className="py-3 text-slate-500">{a.type}</td>
                  <td className="py-3 text-slate-500">{a.user_email}</td>
                  <td className="py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      a.status === 'active' ? 'bg-emerald-50 text-emerald-700' :
                      a.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="py-3 text-right text-slate-500">{new Date(a.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
