'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

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

      // Reset form and close modal
      setFormData({ name: '', type: 'whatsapp-cs', whatsappNumber: '' });
      setShowCreateModal(false);
      
      // Refresh agents list
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading agents...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">My Agents</h1>
          <p className="text-gray-400">
            {agents.length} / {agentLimit} agents used
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          disabled={!canCreateMore}
          className={`px-6 py-3 rounded font-semibold transition ${
            canCreateMore
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-700 cursor-not-allowed'
          }`}
        >
          + Create Agent
        </button>
      </div>

      {!canCreateMore && (
        <div className="bg-yellow-900/20 border border-yellow-600 rounded p-4 mb-6">
          <p className="text-yellow-400">
            ⚠️ Agent limit reached. <Link href="/dashboard/settings" className="underline">Upgrade to Pro</Link> to create more agents.
          </p>
        </div>
      )}

      {agents.length === 0 ? (
        <div className="border border-gray-800 rounded p-12 bg-gray-900 text-center">
          <div className="text-6xl mb-4">🤖</div>
          <h3 className="text-xl font-semibold mb-2">No agents yet</h3>
          <p className="text-gray-400 mb-6">Create your first AI agent to get started</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded font-semibold transition"
          >
            + Create Agent
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {agents.map((agent) => (
            <Link
              key={agent.id}
              href={`/dashboard/agents/${agent.id}`}
              className="border border-gray-800 rounded p-6 bg-gray-900 hover:border-blue-500 transition"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-1">{agent.name}</h3>
                  <p className="text-sm text-gray-400">{agent.type}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      agent.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                    }`}
                  ></span>
                  <span className="text-sm capitalize">{agent.status}</span>
                </div>
              </div>

              {agent.whatsappNumber && (
                <div className="text-sm text-gray-400 mb-4">
                  📱 {agent.whatsappNumber}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-800">
                <div>
                  <div className="text-xs text-gray-500">Messages Today</div>
                  <div className="text-lg font-semibold">{agent.messagesToday}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Tokens Used</div>
                  <div className="text-lg font-semibold">{(agent.tokensUsed / 1000).toFixed(1)}K</div>
                </div>
              </div>

              <div className="text-xs text-gray-500 mt-4">
                Created {new Date(agent.createdAt).toLocaleDateString()}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Create New Agent</h2>

            {error && (
              <div className="bg-red-900/20 border border-red-600 rounded p-3 mb-4 text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleCreate}>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Agent Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Customer Service Bot"
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Agent Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                >
                  <option value="whatsapp-cs">WhatsApp Customer Service</option>
                  <option value="sales-data" disabled={user?.plan === 'starter'}>
                    Sales Data Analysis {user?.plan === 'starter' && '(Pro only)'}
                  </option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">WhatsApp Number (Optional)</label>
                <input
                  type="text"
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  placeholder="+6281234567890"
                  className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setError('');
                  }}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold transition disabled:opacity-50"
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
