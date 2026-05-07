'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { Bot, MessageSquare, Zap, Crown, ArrowRight, Plus } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  type: string;
  status: string;
  tokensUsed: number;
  messagesToday: number;
}

interface UsageStats {
  tokensLimit: number;
  tokensUsed: number;
  tokensRemaining: number;
  today: {
    tokens: number;
    messages: number;
  };
}

export default function Dashboard() {
  const { user, token } = useAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [usage, setUsage] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const agentsRes = await fetch('/api/agents', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (agentsRes.ok) {
          const agentsData = await agentsRes.json();
          setAgents(agentsData.agents);
        }

        const usageRes = await fetch('/api/usage', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (usageRes.ok) {
          const usageData = await usageRes.json();
          setUsage(usageData.usage);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-200 border-t-indigo-600 mx-auto mb-4"></div>
          <p className="text-sm text-slate-500" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const activeAgents = agents.filter(a => a.status === 'active').length;
  const tokensUsedPercent = usage ? (usage.tokensUsed / usage.tokensLimit) * 100 : 0;

  const stats = [
    {
      label: 'Active Agents',
      value: `${activeAgents} / ${agents.length}`,
      icon: Bot,
      iconBg: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
    },
    {
      label: 'Messages Today',
      value: usage?.today.messages.toLocaleString() || '0',
      icon: MessageSquare,
      iconBg: 'bg-sky-50',
      iconColor: 'text-sky-600',
    },
    {
      label: 'Tokens Used',
      value: usage ? `${(usage.tokensUsed / 1000).toFixed(1)}K` : '0K',
      sub: `${tokensUsedPercent.toFixed(1)}% of limit`,
      icon: Zap,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
    {
      label: 'Plan',
      value: user?.plan ? user.plan.charAt(0).toUpperCase() + user.plan.slice(1) : 'Free',
      icon: Crown,
      iconBg: 'bg-violet-50',
      iconColor: 'text-violet-600',
      href: '/dashboard/settings',
      linkText: 'Upgrade',
    },
  ];

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Welcome back, {user?.email?.split('@')[0]}
        </h1>
        <p className="text-sm text-slate-500 mt-1">Manage your AI agents and monitor performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg ${stat.iconBg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
              {stat.href && (
                <Link
                  href={stat.href}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
                >
                  {stat.linkText}
                  <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
            {stat.sub && <p className="text-xs text-slate-400 mt-1">{stat.sub}</p>}
          </div>
        ))}
      </div>

      {/* Token Usage Bar */}
      {usage && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-8">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold text-slate-900">Token Usage</h3>
            <span className="text-xs text-slate-400 font-medium">
              {usage.tokensUsed.toLocaleString()} / {usage.tokensLimit.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                tokensUsedPercent > 90
                  ? 'bg-red-500'
                  : tokensUsedPercent > 70
                    ? 'bg-amber-500'
                    : 'bg-indigo-600'
              }`}
              style={{ width: `${Math.min(tokensUsedPercent, 100)}%` }}
            />
          </div>
          {tokensUsedPercent > 90 && (
            <p className="text-xs text-red-600 mt-3 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" />
              Token limit almost reached. Consider upgrading your plan.
            </p>
          )}
        </div>
      )}

      {/* Agents Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-bold text-slate-900">Your Agents</h2>
          <Link
            href="/dashboard/agents"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {agents.length === 0 ? (
          <div className="text-center py-14">
            <div className="w-14 h-14 rounded-xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
              <Bot className="w-7 h-7 text-indigo-600" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-1">No agents yet</h3>
            <p className="text-sm text-slate-500 mb-6">Create your first AI agent to get started</p>
            <Link
              href="/dashboard/agents"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Create Agent
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {agents.slice(0, 3).map((agent) => (
              <Link
                key={agent.id}
                href={`/dashboard/agents/${agent.id}`}
                className="flex items-center justify-between p-4 rounded-lg border border-slate-150 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                    <Bot className="w-5 h-5 text-slate-500 group-hover:text-indigo-600 transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{agent.name}</h3>
                    <p className="text-xs text-slate-400">{agent.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="flex items-center gap-1.5 justify-end mb-0.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          agent.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'
                        }`}
                      />
                      <span className="text-xs font-medium text-slate-600 capitalize">{agent.status}</span>
                    </div>
                    <p className="text-xs text-slate-400">{agent.messagesToday} messages today</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
