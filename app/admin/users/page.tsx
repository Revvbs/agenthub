'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { Search, Filter, ChevronLeft, ChevronRight, Mail, Users, ExternalLink } from 'lucide-react';

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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Users</h1>
          <p className="text-slate-500 mt-1">Manage all platform users</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Users className="w-4 h-4" />
          <span className="font-medium text-slate-700">{pagination.total}</span> total users
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 focus:outline-none transition-all duration-200"
          />
        </form>
        <div className="relative">
          <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select
            value={planFilter}
            onChange={(e) => { setPlanFilter(e.target.value); setPage(1); }}
            className="bg-white border border-slate-200 rounded-xl pl-10 pr-8 py-2.5 text-sm text-slate-900 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 focus:outline-none appearance-none transition-all duration-200"
          >
            <option value="">All Plans</option>
            <option value="starter">Starter</option>
            <option value="pro">Pro</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-200 bg-slate-50/50">
              <th className="px-6 py-3.5 font-medium">Email</th>
              <th className="px-6 py-3.5 font-medium">Plan</th>
              <th className="px-6 py-3.5 font-medium">Status</th>
              <th className="px-6 py-3.5 font-medium text-right">Agents</th>
              <th className="px-6 py-3.5 font-medium text-right">Tokens Used</th>
              <th className="px-6 py-3.5 font-medium text-right">Joined</th>
              <th className="px-6 py-3.5 font-medium text-center">Action</th>
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
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-16 text-slate-500">
                  <Mail className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  No users found
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors duration-150">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900">{u.email}</span>
                      {u.role === 'admin' && (
                        <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold bg-violet-100 text-violet-700 uppercase tracking-wider">
                          Admin
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      u.plan === 'pro' ? 'bg-violet-50 text-violet-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {u.plan}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      u.status === 'active' ? 'bg-emerald-50 text-emerald-700' :
                      u.status === 'suspended' ? 'bg-amber-50 text-amber-700' :
                      'bg-red-50 text-red-700'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right text-slate-900">{u.agent_count}</td>
                  <td className="px-6 py-3.5 text-right">
                    <div className="text-slate-900">{parseInt(String(u.tokens_used)).toLocaleString()}</div>
                    <div className="text-xs text-slate-400">/ {parseInt(String(u.tokens_limit)).toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-3.5 text-right text-slate-500">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-3.5 text-center">
                    <Link
                      href={`/admin/users/${u.id}`}
                      className="inline-flex items-center gap-1.5 text-violet-600 hover:text-violet-700 text-xs font-medium transition-colors"
                    >
                      Details
                      <ExternalLink className="w-3 h-3" />
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
