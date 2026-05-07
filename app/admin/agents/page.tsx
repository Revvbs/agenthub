'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { Bot, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  type: string;
  status: string;
  user_email: string;
  user_id: string;
  total_tokens: number;
  total_messages: number;
  created_at: string;
}

export default function AdminAgents() {
  const { token } = useAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (statusFilter) params.set('status', statusFilter);

    fetch(`/api/admin/agents?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setAgents(data.agents);
        setPagination(data.pagination);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token, page, statusFilter]);

  const statusOptions = [
    { value: '', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'inactive', label: 'Inactive' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Agents</h1>
          <p className="text-slate-500 mt-1">Monitor all deployed agents</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Bot className="w-4 h-4" />
          <span className="font-medium text-slate-700">{pagination.total}</span> total agents
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 mb-6">
        {statusOptions.map((s) => (
          <button
            key={s.value}
            onClick={() => { setStatusFilter(s.value); setPage(1); }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              statusFilter === s.value
                ? 'bg-violet-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-200 bg-slate-50/50">
              <th className="px-6 py-3.5 font-medium">Agent Name</th>
              <th className="px-6 py-3.5 font-medium">Type</th>
              <th className="px-6 py-3.5 font-medium">User</th>
              <th className="px-6 py-3.5 font-medium">Status</th>
              <th className="px-6 py-3.5 font-medium text-right">Messages</th>
              <th className="px-6 py-3.5 font-medium text-right">Tokens</th>
              <th className="px-6 py-3.5 font-medium text-right">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-16 text-slate-500">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-violet-600"></div>
                    Loading...
                  </div>
                </td>
              </tr>
            ) : agents.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-16 text-slate-500">
                  <Bot className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  No agents found
                </td>
              </tr>
            ) : (
              agents.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50 transition-colors duration-150">
                  <td className="px-6 py-3.5 font-semibold text-slate-900">{a.name}</td>
                  <td className="px-6 py-3.5 text-slate-500">{a.type}</td>
                  <td className="px-6 py-3.5">
                    <Link
                      href={`/admin/users/${a.user_id}`}
                      className="inline-flex items-center gap-1 text-violet-600 hover:text-violet-700 font-medium transition-colors"
                    >
                      {a.user_email}
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      a.status === 'active' ? 'bg-emerald-50 text-emerald-700' :
                      a.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right text-slate-900">{a.total_messages.toLocaleString()}</td>
                  <td className="px-6 py-3.5 text-right text-slate-900">{a.total_tokens.toLocaleString()}</td>
                  <td className="px-6 py-3.5 text-right text-slate-500">{new Date(a.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-all duration-200"
          >
            <ChevronLeft className="w-4 h-4" />
            Prev
          </button>
          <span className="text-sm text-slate-500">
            Page <span className="font-medium text-slate-700">{page}</span> of {pagination.totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
            disabled={page === pagination.totalPages}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-all duration-200"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
