'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

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
        // Fetch agents
        const agentsRes = await fetch('/api/agents', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (agentsRes.ok) {
          const agentsData = await agentsRes.json();
          setAgents(agentsData.agents);
        }

        // Fetch usage
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const activeAgents = agents.filter(a => a.status === 'active').length;
  const tokensUsedPercent = usage ? (usage.tokensUsed / usage.tokensLimit) * 100 : 0;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.email?.split('@')[0]}</h1>
        <p className="text-gray-400">Manage your AI agents and monitor performance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="border border-gray-800 rounded p-6 bg-gray-900">
          <div className="text-3xl mb-2">🤖</div>
          <div className="text-gray-400 text-sm">Active Agents</div>
          <div className="text-2xl font-bold">{activeAgents} / {agents.length}</div>
        </div>

        <div className="border border-gray-800 rounded p-6 bg-gray-900">
          <div className="text-3xl mb-2">💬</div>
          <div className="text-gray-400 text-sm">Messages Today</div>
          <div className="text-2xl font-bold">{usage?.today.messages.toLocaleString() || 0}</div>
        </div>

        <div className="border border-gray-800 rounded p-6 bg-gray-900">
          <div className="text-3xl mb-2">⚡</div>
          <div className="text-gray-400 text-sm">Tokens Used</div>
          <div className="text-2xl font-bold">
            {usage ? `${(usage.tokensUsed / 1000).toFixed(1)}K` : '0K'}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {tokensUsedPercent.toFixed(1)}% of limit
          </div>
        </div>

        <div className="border border-gray-800 rounded p-6 bg-gray-900">
          <div className="text-3xl mb-2">📊</div>
          <div className="text-gray-400 text-sm">Plan</div>
          <div className="text-2xl font-bold capitalize">{user?.plan}</div>
          <Link href="/dashboard/settings" className="text-xs text-blue-400 hover:underline mt-1 inline-block">
            Upgrade →
          </Link>
        </div>
      </div>

      {/* Token Usage Bar */}
      {usage && (
        <div className="border border-gray-800 rounded p-6 bg-gray-900 mb-8">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Token Usage</h3>
            <span className="text-sm text-gray-400">
              {usage.tokensUsed.toLocaleString()} / {usage.tokensLimit.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                tokensUsedPercent > 90 ? 'bg-red-500' : tokensUsedPercent > 70 ? 'bg-yellow-500' : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(tokensUsedPercent, 100)}%` }}
            ></div>
          </div>
          {tokensUsedPercent > 90 && (
            <p className="text-sm text-red-400 mt-2">⚠️ Token limit almost reached. Consider upgrading your plan.</p>
          )}
        </div>
      )}

      {/* Active Agents */}
      <div className="border border-gray-800 rounded p-6 bg-gray-900">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Your Agents</h2>
          <Link
            href="/dashboard/agents"
            className="text-sm text-blue-400 hover:underline"
          >
            View all →
          </Link>
        </div>

        {agents.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold mb-2">No agents yet</h3>
            <p className="text-gray-400 mb-6">Create your first AI agent to get started</p>
            <Link
              href="/dashboard/agents"
              className="inline-block bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded font-semibold transition"
            >
              + Create Agent
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {agents.slice(0, 3).map((agent) => (
              <Link
                key={agent.id}
                href={`/dashboard/agents/${agent.id}`}
                className="block border border-gray-700 rounded p-4 hover:border-blue-500 transition"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">{agent.name}</h3>
                    <p className="text-sm text-gray-400">{agent.type}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end mb-1">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          agent.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                        }`}
                      ></span>
                      <span className="text-sm capitalize">{agent.status}</span>
                    </div>
                    <p className="text-sm text-gray-400">{agent.messagesToday} messages today</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
