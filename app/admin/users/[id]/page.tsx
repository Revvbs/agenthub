'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Bot, CreditCard, Save, ArrowLeft, Activity, Calendar, AlertCircle } from 'lucide-react';

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
  const [saveMessage, setSaveMessage] = useState('');

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
    setSaveMessage('');
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
        setSaveMessage('User updated successfully');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        setSaveMessage('Failed to update user');
      }
    } catch (err) {
      console.error(err);
      setSaveMessage('Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  if (!data || data.error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-14 h-14 rounded-xl bg-red-50 flex items-center justify-center mb-5">
          <AlertCircle className="w-7 h-7 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold mb-2 text-slate-900">User not found</h1>
        <Link href="/admin/users" className="text-violet-600 hover:text-violet-700 font-medium text-sm mt-2 transition-colors">
          Back to users
        </Link>
      </div>
    );
  }

  const { user, agents, usage, billing } = data;
  const tokensPercent = user.tokens_limit > 0 ? (user.tokens_used / user.tokens_limit) * 100 : 0;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin/users" className="inline-flex items-center gap-1.5 text-sm text-violet-600 hover:text-violet-700 font-medium mb-3 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to users
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">{user.email}</h1>
        <div className="flex gap-2 mt-2">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
            user.role === 'admin' ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-600'
          }`}>
            {user.role}
          </span>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
            user.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
          }`}>
            {user.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Edit User Card */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <User className="w-5 h-5 text-violet-600" />
              <h2 className="text-lg font-bold text-slate-900">Edit User</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">Plan</label>
                <select
                  value={editPlan}
                  onChange={(e) => setEditPlan(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 focus:outline-none transition-all duration-200"
                >
                  <option value="starter">Starter</option>
                  <option value="pro">Pro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">Tokens Limit</label>
                <input
                  type="number"
                  value={editTokensLimit}
                  onChange={(e) => setEditTokensLimit(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 focus:outline-none transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 focus:outline-none transition-all duration-200"
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="banned">Banned</option>
                </select>
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              {saveMessage && (
                <p className={`text-xs text-center font-medium ${saveMessage.includes('success') ? 'text-emerald-600' : 'text-red-600'}`}>
                  {saveMessage}
                </p>
              )}
            </div>
          </div>

          {/* Usage Summary Card */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Activity className="w-5 h-5 text-violet-600" />
              <h2 className="text-lg font-bold text-slate-900">Usage Summary</h2>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-slate-500">Tokens</span>
                  <span className="text-slate-900 font-medium">
                    {parseInt(String(user.tokens_used)).toLocaleString()} / {parseInt(String(user.tokens_limit)).toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      tokensPercent > 90 ? 'bg-red-500' :
                      tokensPercent > 70 ? 'bg-amber-500' :
                      'bg-violet-500'
                    }`}
                    style={{ width: `${Math.min(tokensPercent, 100)}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex justify-between py-2 border-t border-slate-100">
                <span className="text-sm text-slate-500">Total Messages</span>
                <span className="text-sm text-slate-900 font-medium">{usage.totalMessages.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-t border-slate-100">
                <span className="text-sm text-slate-500">Joined</span>
                <span className="text-sm text-slate-900 font-medium">{new Date(user.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Agents Card */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Bot className="w-5 h-5 text-violet-600" />
              <h2 className="text-lg font-bold text-slate-900">Agents ({agents.length})</h2>
            </div>
            {agents.length === 0 ? (
              <div className="text-center py-10">
                <Bot className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="text-sm text-slate-500">No agents found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {agents.map((a: any) => (
                  <div key={a.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <div className="font-semibold text-sm text-slate-900">{a.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{a.type}</div>
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      a.status === 'active' ? 'bg-emerald-50 text-emerald-700' :
                      a.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {a.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Billing History Card */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <CreditCard className="w-5 h-5 text-violet-600" />
              <h2 className="text-lg font-bold text-slate-900">Billing History</h2>
            </div>
            {billing.length === 0 ? (
              <div className="text-center py-10">
                <CreditCard className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="text-sm text-slate-500">No billing history</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-500 border-b border-slate-200">
                      <th className="pb-3 font-medium">Plan</th>
                      <th className="pb-3 font-medium text-right">Amount</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {billing.map((b: any) => (
                      <tr key={b.id} className="hover:bg-slate-50 transition-colors duration-150">
                        <td className="py-3 capitalize text-slate-900 font-medium">{b.plan}</td>
                        <td className="py-3 text-right text-slate-900">Rp {parseFloat(b.amount).toLocaleString()}</td>
                        <td className="py-3">
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            b.status === 'paid' ? 'bg-emerald-50 text-emerald-700' :
                            b.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                            'bg-red-50 text-red-700'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="py-3 text-right text-slate-500">{new Date(b.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
