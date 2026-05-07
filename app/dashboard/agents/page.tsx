'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { Plus, Bot, Settings, Trash2, ExternalLink } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  type: string;
  status: string;
  whatsappNumber?: string;
  tokensUsed: number;
  messagesToday: number;
  createdAt: string;
}

export default function AgentsPage() {
  const { user, token } = useAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    type: 'whatsapp-cs',
    whatsappNumber: '',
  });

  useEffect(() => {
    fetchAgents();
  }, [token]);

  const fetchAgents = async () => {
    if (!token) return;

    try {
      const res = await fetch('/api/agents', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setAgents(data.agents);
      }
    } catch (error) {
      console.error('Failed to fetch agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError('');

    try {
      const res = await fetch('/api/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          type: formData.type,
          whatsappNumber: formData.whatsappNumber || undefined,
          config: {},
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create agent');
      }

      setFormData({ name: '', type: 'whatsapp-cs', whatsappNumber: '' });
      setShowCreateModal(false);
      fetchAgents();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const agentLimit = user?.plan === 'pro' ? 10 : 1;
  const canCreateMore = agents.length < agentLimit;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-200 border-t-indigo-600 mx-auto mb-4"></div>
          <p className="text-sm text-slate-500 font-medium" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Loading agents...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Agents</h1>
          <p className="text-sm text-slate-500 mt-1">
            {agents.length} / {agentLimit} agents used
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          disabled={!canCreateMore}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition ${
            canCreateMore
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Plus className="w-4 h-4" />
          Create Agent
        </button>
      </div>

      {/* Limit Warning */}
      {!canCreateMore && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-amber-600 text-xs font-bold">!</span>
          </div>
          <p className="text-sm text-amber-800">
            Agent limit reached.{' '}
            <Link href="/dashboard/settings" className="font-semibold underline underline-offset-2">
              Upgrade to Pro
            </Link>{' '}
            to create more agents.
          </p>
        </div>
      )}

      {/* Empty State */}
      {agents.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200/80 p-12 shadow-sm text-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
            <Bot className="w-7 h-7 text-indigo-400" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 mb-1.5">No agents yet</h3>
          <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">Create your first AI agent to get started with automated conversations</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Create Agent
          </button>
        </div>
      ) : (
        /* Agent Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {agents.map((agent) => (
            <Link
              key={agent.id}
              href={`/dashboard/agents/${agent.id}`}
              className="group bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors">{agent.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{agent.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      agent.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}
                  />
                  <span className="text-xs font-medium text-slate-500 capitalize">{agent.status}</span>
                </div>
              </div>

              {agent.whatsappNumber && (
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-4 pl-0.5">
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                  {agent.whatsappNumber}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div>
                  <div className="text-xs text-slate-400 mb-0.5">Messages Today</div>
                  <div className="text-base font-semibold text-slate-900">{agent.messagesToday}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-0.5">Tokens Used</div>
                  <div className="text-base font-semibold text-slate-900">{(agent.tokensUsed / 1000).toFixed(1)}K</div>
                </div>
              </div>

              <div className="text-xs text-slate-400 mt-3">
                Created {new Date(agent.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200/80">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                <Bot className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Create New Agent</h2>
                <p className="text-xs text-slate-500">Configure your new AI agent</p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-lg p-3 mb-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleCreate}>
              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">Agent Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Customer Service Bot"
                  required
                  className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition"
                />
              </div>

              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">Agent Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition"
                >
                  <option value="whatsapp-cs">WhatsApp Customer Service</option>
                  <option value="sales-data" disabled={user?.plan === 'starter'}>
                    Sales Data Analysis {user?.plan === 'starter' && '(Pro only)'}
                  </option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">WhatsApp Number (Optional)</label>
                <input
                  type="text"
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  placeholder="+628****7890"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setError('');
                  }}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-lg text-sm font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition disabled:opacity-50 shadow-sm"
                >
                  {creating ? 'Creating...' : 'Create Agent'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
