'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Activity, MessageSquare, Zap, Calendar, Bot } from 'lucide-react';

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
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-200 border-t-indigo-600 mx-auto mb-4"></div>
          <p className="text-sm text-slate-500 font-medium" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Loading usage data...</p>
        </div>
      </div>
    );
  }

  if (!usage) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Activity className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500 font-medium" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Failed to load usage data</p>
        </div>
      </div>
    );
  }

  const tokensUsedPercent = (usage.tokensUsed / usage.tokensLimit) * 100;

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Usage Statistics</h1>
        <p className="text-sm text-slate-500 mt-1">Monitor your token and message usage across all agents</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
              <Zap className="w-4.5 h-4.5 text-indigo-600" />
            </div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Tokens Today</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{usage.today.tokens.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
              <MessageSquare className="w-4.5 h-4.5 text-indigo-600" />
            </div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Messages Today</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{usage.today.messages.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
              <Calendar className="w-4.5 h-4.5 text-indigo-600" />
            </div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Monthly Tokens</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{usage.thisMonth.tokens.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
              <Activity className="w-4.5 h-4.5 text-indigo-600" />
            </div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Monthly Messages</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{usage.thisMonth.messages.toLocaleString()}</p>
        </div>
      </div>

      {/* Token Usage Progress */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm mb-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
            <Zap className="w-4.5 h-4.5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900">Token Usage</h2>
            <p className="text-xs text-slate-500">Monthly allowance progress</p>
          </div>
        </div>

        <div className="mb-3">
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-sm text-slate-600">Total Usage</span>
            <span className="text-sm font-semibold text-slate-900">
              {usage.tokensUsed.toLocaleString()} / {usage.tokensLimit.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                tokensUsedPercent > 90 ? 'bg-red-500' : tokensUsedPercent > 70 ? 'bg-amber-500' : 'bg-indigo-600'
              }`}
              style={{ width: `${Math.min(tokensUsedPercent, 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-xs text-slate-400">{tokensUsedPercent.toFixed(1)}% used</span>
            <span className="text-xs text-slate-400">{usage.tokensRemaining.toLocaleString()} remaining</span>
          </div>
        </div>

        {tokensUsedPercent > 90 && (
          <div className="bg-red-50 border border-red-100 rounded-lg p-3 mt-4 flex items-start gap-2.5">
            <Activity className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-700">You are running low on tokens. Consider upgrading your plan to avoid service interruption.</p>
          </div>
        )}
      </div>

      {/* Usage by Agent */}
      {usage.byAgent.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm mb-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
              <Bot className="w-4.5 h-4.5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Usage by Agent</h2>
              <p className="text-xs text-slate-500">Token distribution across agents</p>
            </div>
          </div>

          <div className="space-y-5">
            {usage.byAgent.map((agent) => {
              const agentPercent = (agent.tokensUsed / usage.tokensUsed) * 100;
              return (
                <div key={agent.agentId}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-indigo-50 flex items-center justify-center">
                        <Bot className="w-3.5 h-3.5 text-indigo-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-900">{agent.agentName}</span>
                    </div>
                    <span className="text-xs text-slate-500">
                      {agent.tokensUsed.toLocaleString()} tokens &middot; {agent.messageCount} messages
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${agentPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Daily Usage (Last 7 Days) */}
      {usage.daily.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm mb-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
              <Calendar className="w-4.5 h-4.5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Daily Usage</h2>
              <p className="text-xs text-slate-500">Last 7 days activity</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {usage.daily.map((day) => (
              <div key={day.date} className="flex justify-between items-center py-3 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <span className="text-sm text-slate-600">
                    {new Date(day.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-slate-900">{day.tokensUsed.toLocaleString()} tokens</div>
                  <div className="text-xs text-slate-500">{day.messageCount} messages</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {usage.byAgent.length === 0 && usage.daily.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200/80 p-12 shadow-sm text-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
            <Activity className="w-7 h-7 text-indigo-400" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 mb-1.5">No usage data yet</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">Start using your agents to see usage statistics here</p>
        </div>
      )}
    </div>
  );
}
