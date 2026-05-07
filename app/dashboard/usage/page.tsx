'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';

interface UsageData {
  plan: string;
  tokensLimit: number;
  tokensUsed: number;
  tokensRemaining: number;
  today: {
    tokens: number;
    messages: number;
  };
  thisMonth: {
    tokens: number;
    messages: number;
  };
  byAgent: Array<{
    agentId: string;
    agentName: string;
    tokensUsed: number;
    messageCount: number;
  }>;
  daily: Array<{
    date: string;
    tokensUsed: number;
    messageCount: number;
  }>;
}

export default function UsagePage() {
  const { token } = useAuth();
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchUsage = async () => {
      try {
        const res = await fetch('/api/usage', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setUsage(data.usage);
        }
      } catch (error) {
        console.error('Failed to fetch usage:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsage();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading usage data...</p>
        </div>
      </div>
    );
  }

  if (!usage) {
    return <div className="text-center text-gray-400">Failed to load usage data</div>;
  }

  const tokensUsedPercent = (usage.tokensUsed / usage.tokensLimit) * 100;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Usage Statistics</h1>
        <p className="text-gray-400">Monitor your token and message usage</p>
      </div>

      {/* Token Usage Overview */}
      <div className="border border-gray-800 rounded p-6 bg-gray-900 mb-6">
        <h2 className="text-xl font-bold mb-4">Token Usage</h2>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Total Usage</span>
            <span className="font-semibold">
              {usage.tokensUsed.toLocaleString()} / {usage.tokensLimit.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                tokensUsedPercent > 90 ? 'bg-red-500' : tokensUsedPercent > 70 ? 'bg-yellow-500' : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(tokensUsedPercent, 100)}%` }}
            ></div>
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {tokensUsedPercent.toFixed(1)}% used • {usage.tokensRemaining.toLocaleString()} remaining
          </div>
        </div>

        {tokensUsedPercent > 90 && (
          <div className="bg-red-900/20 border border-red-600 rounded p-3 text-red-400 text-sm">
            ⚠️ You're running low on tokens. Consider upgrading your plan to avoid service interruption.
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="border border-gray-800 rounded p-6 bg-gray-900">
          <h3 className="text-lg font-semibold mb-4">Today</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Tokens</span>
              <span className="font-semibold">{usage.today.tokens.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Messages</span>
              <span className="font-semibold">{usage.today.messages.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="border border-gray-800 rounded p-6 bg-gray-900">
          <h3 className="text-lg font-semibold mb-4">This Month</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Tokens</span>
              <span className="font-semibold">{usage.thisMonth.tokens.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Messages</span>
              <span className="font-semibold">{usage.thisMonth.messages.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Usage by Agent */}
      {usage.byAgent.length > 0 && (
        <div className="border border-gray-800 rounded p-6 bg-gray-900 mb-6">
          <h2 className="text-xl font-bold mb-4">Usage by Agent</h2>
          <div className="space-y-4">
            {usage.byAgent.map((agent) => {
              const agentPercent = (agent.tokensUsed / usage.tokensUsed) * 100;
              return (
                <div key={agent.agentId}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">{agent.agentName}</span>
                    <span className="text-sm text-gray-400">
                      {agent.tokensUsed.toLocaleString()} tokens • {agent.messageCount} messages
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${agentPercent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Daily Usage (Last 7 Days) */}
      {usage.daily.length > 0 && (
        <div className="border border-gray-800 rounded p-6 bg-gray-900">
          <h2 className="text-xl font-bold mb-4">Daily Usage (Last 7 Days)</h2>
          <div className="space-y-3">
            {usage.daily.map((day) => (
              <div key={day.date} className="flex justify-between items-center py-2 border-b border-gray-800 last:border-0">
                <span className="text-gray-400">
                  {new Date(day.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
                <div className="text-right">
                  <div className="font-semibold">{day.tokensUsed.toLocaleString()} tokens</div>
                  <div className="text-sm text-gray-400">{day.messageCount} messages</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {usage.byAgent.length === 0 && usage.daily.length === 0 && (
        <div className="border border-gray-800 rounded p-12 bg-gray-900 text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold mb-2">No usage data yet</h3>
          <p className="text-gray-400">Start using your agents to see usage statistics here</p>
        </div>
      )}
    </div>
  );
}
