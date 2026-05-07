'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

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

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Agents</h1>
          <p className="text-gray-400">Monitor all deployed agents</p>
        </div>
        <div className="text-sm text-gray-400">{pagination.total} total agents</div>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 mb-6">
        {['', 'active', 'pending', 'inactive'].map((s) => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-4 py-2 rounded text-sm transition ${
              statusFilter === s
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="border border-gray-800 rounded bg-gray-900 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 border-b border-gray-800 bg-gray-950">
              <th className="text-left px-4 py-3">Agent Name</th>
              <th className="text-left px-4 py-3">Type</th>
              <th className="text-left px-4 py-3">User</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-right px-4 py-3">Messages</th>
              <th className="text-right px-4 py-3">Tokens</th>
              <th className="text-right px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-12 text-gray-500">Loading...</td></tr>
            ) : agents.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12 text-gray-500">No agents found</td></tr>
            ) : (
              agents.map((a) => (
                <tr key={a.id} className="border-b border-gray-800 hover:bg-gray-800 transition">
                  <td className="px-4 py-3 font-semibold">{a.name}</td>
                  <td className="px-4 py-3 text-gray-400">{a.type}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/users/${a.user_id}`} className="text-blue-400 hover:underline">
                      {a.user_email}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      a.status === 'active' ? 'bg-green-900 text-green-300' :
                      a.status === 'pending' ? 'bg-yellow-900 text-yellow-300' :
                      'bg-gray-800 text-gray-400'
                    }`}>{a.status}</span>
                  </td>
                  <td className="text-right px-4 py-3">{a.total_messages.toLocaleString()}</td>
                  <td className="text-right px-4 py-3">{a.total_tokens.toLocaleString()}</td>
                  <td className="text-right px-4 py-3 text-gray-500">{new Date(a.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-800 rounded disabled:opacity-50 hover:bg-gray-700 transition"
          >← Prev</button>
          <span className="px-4 py-2 text-gray-400">Page {page} of {pagination.totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
            disabled={page === pagination.totalPages}
            className="px-4 py-2 bg-gray-800 rounded disabled:opacity-50 hover:bg-gray-700 transition"
          >Next →</button>
        </div>
      )}
    </div>
  );
}
