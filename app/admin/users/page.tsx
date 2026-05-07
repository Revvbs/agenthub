'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  role: string;
  plan: string;
  tokens_limit: number;
  tokens_used: number;
  status: string;
  agent_count: number;
  created_at: string;
}

export default function AdminUsers() {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });

  const fetchUsers = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (search) params.set('search', search);
      if (planFilter) params.set('plan', planFilter);

      const res = await fetch(`/api/admin/users?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [token, page, planFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Users</h1>
          <p className="text-gray-400">Manage all platform users</p>
        </div>
        <div className="text-sm text-gray-400">
          {pagination.total} total users
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <form onSubmit={handleSearch} className="flex-1">
          <input
            type="text"
            placeholder="Search by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
          />
        </form>
        <select
          value={planFilter}
          onChange={(e) => { setPlanFilter(e.target.value); setPage(1); }}
          className="bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
        >
          <option value="">All Plans</option>
          <option value="starter">Starter</option>
          <option value="pro">Pro</option>
        </select>
      </div>

      {/* Table */}
      <div className="border border-gray-800 rounded bg-gray-900 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 border-b border-gray-800 bg-gray-950">
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-left px-4 py-3">Plan</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-right px-4 py-3">Agents</th>
              <th className="text-right px-4 py-3">Tokens Used</th>
              <th className="text-right px-4 py-3">Joined</th>
              <th className="text-center px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-gray-500">Loading...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-gray-500">No users found</td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="border-b border-gray-800 hover:bg-gray-800 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {u.role === 'admin' && <span className="text-purple-400">🔑</span>}
                      <span className="font-medium">{u.email}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 capitalize">
                    <span className={`px-2 py-1 rounded text-xs ${
                      u.plan === 'pro' ? 'bg-blue-900 text-blue-300' : 'bg-gray-800 text-gray-300'
                    }`}>{u.plan}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      u.status === 'active' ? 'bg-green-900 text-green-300' :
                      u.status === 'suspended' ? 'bg-yellow-900 text-yellow-300' :
                      'bg-red-900 text-red-300'
                    }`}>{u.status}</span>
                  </td>
                  <td className="text-right px-4 py-3">{u.agent_count}</td>
                  <td className="text-right px-4 py-3">
                    <div>{parseInt(String(u.tokens_used)).toLocaleString()}</div>
                    <div className="text-xs text-gray-500">/ {parseInt(String(u.tokens_limit)).toLocaleString()}</div>
                  </td>
                  <td className="text-right px-4 py-3 text-gray-500">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="text-center px-4 py-3">
                    <Link
                      href={`/admin/users/${u.id}`}
                      className="text-purple-400 hover:underline text-xs"
                    >
                      Details →
                    </Link>
                  </td>
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
          >
            ← Prev
          </button>
          <span className="px-4 py-2 text-gray-400">
            Page {page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
            disabled={page === pagination.totalPages}
            className="px-4 py-2 bg-gray-800 rounded disabled:opacity-50 hover:bg-gray-700 transition"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
