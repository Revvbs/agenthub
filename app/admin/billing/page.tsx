'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { DollarSign, CreditCard, CheckCircle, XCircle, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

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

  const summaryCards = [
    {
      label: 'Total Revenue',
      value: `Rp ${summary.totalPaid.toLocaleString()}`,
      sub: `${summary.paidCount} paid invoices`,
      icon: DollarSign,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      valueColor: 'text-emerald-600',
    },
    {
      label: 'Pending',
      value: `Rp ${summary.totalPending.toLocaleString()}`,
      sub: `${summary.pendingCount} pending invoices`,
      icon: Clock,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      valueColor: 'text-amber-600',
    },
    {
      label: 'Failed',
      value: `${summary.failedCount}`,
      sub: 'failed payments',
      icon: XCircle,
      iconBg: 'bg-red-50',
      iconColor: 'text-red-500',
      valueColor: 'text-red-600',
    },
  ];

  const statusOptions = [
    { value: '', label: 'All' },
    { value: 'paid', label: 'Paid' },
    { value: 'pending', label: 'Pending' },
    { value: 'failed', label: 'Failed' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Billing</h1>
        <p className="text-slate-500 mt-1">Payment history and revenue tracking</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white border border-slate-200 shadow-sm rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${card.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${card.iconColor}`} />
                </div>
              </div>
              <div className="text-sm text-slate-500 mb-1">{card.label}</div>
              <div className={`text-2xl font-bold ${card.valueColor}`}>{card.value}</div>
              <div className="text-xs text-slate-400 mt-1">{card.sub}</div>
            </div>
          );
        })}
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
              <th className="px-6 py-3.5 font-medium">User</th>
              <th className="px-6 py-3.5 font-medium">Plan</th>
              <th className="px-6 py-3.5 font-medium text-right">Amount</th>
              <th className="px-6 py-3.5 font-medium">Status</th>
              <th className="px-6 py-3.5 font-medium">Method</th>
              <th className="px-6 py-3.5 font-medium">Transaction ID</th>
              <th className="px-6 py-3.5 font-medium text-right">Date</th>
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
            ) : billing.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-16 text-slate-500">
                  <CreditCard className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  No billing records
                </td>
              </tr>
            ) : (
              billing.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50 transition-colors duration-150">
                  <td className="px-6 py-3.5">
                    <Link
                      href={`/admin/users/${b.user_id}`}
                      className="text-violet-600 hover:text-violet-700 font-medium transition-colors"
                    >
                      {b.user_email}
                    </Link>
                  </td>
                  <td className="px-6 py-3.5 capitalize text-slate-900 font-medium">{b.plan}</td>
                  <td className="px-6 py-3.5 text-right font-semibold text-slate-900">
                    Rp {parseFloat(String(b.amount)).toLocaleString()}
                  </td>
                  <td className="px-6 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      b.status === 'paid' ? 'bg-emerald-50 text-emerald-700' :
                      b.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                      'bg-red-50 text-red-700'
                    }`}>
                      {b.status === 'paid' && <CheckCircle className="w-3 h-3" />}
                      {b.status === 'failed' && <XCircle className="w-3 h-3" />}
                      {b.status === 'pending' && <Clock className="w-3 h-3" />}
                      {b.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-slate-500">{b.payment_method || '-'}</td>
                  <td className="px-6 py-3.5 text-slate-500 text-xs font-mono">{b.transaction_id || '-'}</td>
                  <td className="px-6 py-3.5 text-right text-slate-500">{new Date(b.created_at).toLocaleDateString()}</td>
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
