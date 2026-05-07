'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

interface BillingItem {
  id: string;
  plan: string;
  amount: number;
  status: string;
  payment_method: string;
  transaction_id: string;
  user_email: string;
  user_id: string;
  created_at: string;
  paid_at: string;
}

export default function AdminBilling() {
  const { token } = useAuth();
  const [billing, setBilling] = useState<BillingItem[]>([]);
  const [summary, setSummary] = useState({ totalPaid: 0, totalPending: 0, paidCount: 0, pendingCount: 0, failedCount: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (statusFilter) params.set('status', statusFilter);

    fetch(`/api/admin/billing?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setBilling(data.billing);
        setSummary(data.summary);
        setPagination(data.pagination);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token, page, statusFilter]);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-gray-900">Billing</h1>
          <p className="text-gray-500">Payment history and revenue tracking</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="border border-gray-200 rounded p-6 bg-white shadow-sm">
          <div className="text-gray-500 text-sm">Total Revenue</div>
          <div className="text-2xl font-bold text-green-600">Rp {summary.totalPaid.toLocaleString()}</div>
          <div className="text-xs text-gray-500 mt-1">{summary.paidCount} paid invoices</div>
        </div>
        <div className="border border-gray-200 rounded p-6 bg-white shadow-sm">
          <div className="text-gray-500 text-sm">Pending</div>
          <div className="text-2xl font-bold text-yellow-600">Rp {summary.totalPending.toLocaleString()}</div>
          <div className="text-xs text-gray-500 mt-1">{summary.pendingCount} pending invoices</div>
        </div>
        <div className="border border-gray-200 rounded p-6 bg-white shadow-sm">
          <div className="text-gray-500 text-sm">Failed</div>
          <div className="text-2xl font-bold text-red-600">{summary.failedCount}</div>
          <div className="text-xs text-gray-500 mt-1">failed payments</div>
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 mb-6">
        {['', 'paid', 'pending', 'failed'].map((s) => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-4 py-2 rounded text-sm transition ${
              statusFilter === s
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded bg-white overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 border-b border-gray-200 bg-gray-50">
              <th className="text-left px-4 py-3">User</th>
              <th className="text-left px-4 py-3">Plan</th>
              <th className="text-right px-4 py-3">Amount</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Method</th>
              <th className="text-left px-4 py-3">Transaction ID</th>
              <th className="text-right px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-12 text-gray-500">Loading...</td></tr>
            ) : billing.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12 text-gray-500">No billing records</td></tr>
            ) : (
              billing.map((b) => (
                <tr key={b.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    <Link href={`/admin/users/${b.user_id}`} className="text-blue-600 hover:underline">
                      {b.user_email}
                    </Link>
                  </td>
                  <td className="px-4 py-3 capitalize text-gray-900">{b.plan}</td>
                  <td className="text-right px-4 py-3 font-semibold text-gray-900">Rp {parseFloat(String(b.amount)).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      b.status === 'paid' ? 'bg-green-100 text-green-700' :
                      b.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>{b.status}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{b.payment_method || '-'}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs font-mono">{b.transaction_id || '-'}</td>
                  <td className="text-right px-4 py-3 text-gray-500">{new Date(b.created_at).toLocaleDateString()}</td>
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
            className="px-4 py-2 bg-gray-100 rounded disabled:opacity-50 hover:bg-gray-200 transition text-gray-900"
          >← Prev</button>
          <span className="px-4 py-2 text-gray-500">Page {page} of {pagination.totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
            disabled={page === pagination.totalPages}
            className="px-4 py-2 bg-gray-100 rounded disabled:opacity-50 hover:bg-gray-200 transition text-gray-900"
          >Next →</button>
        </div>
      )}
    </div>
  );
}
