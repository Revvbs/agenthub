'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminUserDetail() {
  const { token } = useAuth();
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editPlan, setEditPlan] = useState('');
  const [editTokensLimit, setEditTokensLimit] = useState(0);
  const [editStatus, setEditStatus] = useState('');

  useEffect(() => {
    if (!token || !userId) return;
    fetch(`/api/admin/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setEditPlan(d.user.plan);
        setEditTokensLimit(d.user.tokens_limit);
        setEditStatus(d.user.status);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token, userId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: editPlan,
          tokens_limit: editTokensLimit,
          status: editStatus,
        }),
      });
      if (res.ok) {
        setData((prev: any) => ({
          ...prev,
          user: { ...prev.user, plan: editPlan, tokens_limit: editTokensLimit, status: editStatus },
        }));
        alert('User updated successfully');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!data || data.error) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">❌</div>
        <h1 className="text-2xl font-bold mb-2">User not found</h1>
        <Link href="/admin/users" className="text-purple-400 hover:underline">← Back to users</Link>
      </div>
    );
  }

  const { user, agents, usage, billing } = data;
  const tokensPercent = user.tokens_limit > 0 ? (user.tokens_used / user.tokens_limit) * 100 : 0;

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/users" className="text-purple-400 hover:underline text-sm">← Back to users</Link>
        <h1 className="text-4xl font-bold mt-2">{user.email}</h1>
        <div className="flex gap-2 mt-2">
          <span className={`px-2 py-1 rounded text-xs ${
            user.role === 'admin' ? 'bg-purple-900 text-purple-300' : 'bg-gray-800 text-gray-300'
          }`}>{user.role}</span>
          <span className={`px-2 py-1 rounded text-xs ${
            user.status === 'active' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
          }`}>{user.status}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Edit User */}
        <div className="lg:col-span-1">
          <div className="border border-gray-800 rounded p-6 bg-gray-900">
            <h2 className="text-xl font-bold mb-4">✏️ Edit User</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Plan</label>
                <select
                  value={editPlan}
                  onChange={(e) => setEditPlan(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                >
                  <option value="starter">Starter</option>
                  <option value="pro">Pro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Tokens Limit</label>
                <input
                  type="number"
                  value={editTokensLimit}
                  onChange={(e) => setEditTokensLimit(Number(e.target.value))}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="banned">Banned</option>
                </select>
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded font-semibold transition disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* Usage Summary */}
          <div className="border border-gray-800 rounded p-6 bg-gray-900 mt-6">
            <h2 className="text-xl font-bold mb-4">📊 Usage Summary</h2>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Tokens</span>
                  <span>{parseInt(String(user.tokens_used)).toLocaleString()} / {parseInt(String(user.tokens_limit)).toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${tokensPercent > 90 ? 'bg-red-500' : tokensPercent > 70 ? 'bg-yellow-500' : 'bg-purple-500'}`}
                    style={{ width: `${Math.min(tokensPercent, 100)}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Messages</span>
                <span>{usage.totalMessages.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Joined</span>
                <span>{new Date(user.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Agents + Billing */}
        <div className="lg:col-span-2 space-y-6">
          {/* Agents */}
          <div className="border border-gray-800 rounded p-6 bg-gray-900">
            <h2 className="text-xl font-bold mb-4">🤖 Agents ({agents.length})</h2>
            {agents.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No agents</p>
            ) : (
              <div className="space-y-3">
                {agents.map((a: any) => (
                  <div key={a.id} className="flex justify-between items-center p-3 bg-gray-800 rounded">
                    <div>
                      <div className="font-semibold">{a.name}</div>
                      <div className="text-sm text-gray-400">{a.type}</div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      a.status === 'active' ? 'bg-green-900 text-green-300' :
                      a.status === 'pending' ? 'bg-yellow-900 text-yellow-300' :
                      'bg-gray-700 text-gray-400'
                    }`}>{a.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Billing History */}
          <div className="border border-gray-800 rounded p-6 bg-gray-900">
            <h2 className="text-xl font-bold mb-4">💰 Billing History</h2>
            {billing.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No billing history</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-800">
                    <th className="text-left py-2">Plan</th>
                    <th className="text-right py-2">Amount</th>
                    <th className="text-left py-2">Status</th>
                    <th className="text-right py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {billing.map((b: any) => (
                    <tr key={b.id} className="border-b border-gray-800">
                      <td className="py-2 capitalize">{b.plan}</td>
                      <td className="text-right py-2">Rp {parseFloat(b.amount).toLocaleString()}</td>
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          b.status === 'paid' ? 'bg-green-900 text-green-300' :
                          b.status === 'pending' ? 'bg-yellow-900 text-yellow-300' :
                          'bg-red-900 text-red-300'
                        }`}>{b.status}</span>
                      </td>
                      <td className="text-right py-2 text-gray-500">{new Date(b.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
