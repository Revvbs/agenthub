'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { User, CreditCard, Shield, Check } from 'lucide-react';

export default function SettingsPage() {
  const { user, token, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'plan'>('profile');

  // Profile form
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileError('');
    setProfileSuccess('');

    if (password && password !== confirmPassword) {
      setProfileError('Passwords do not match');
      setProfileLoading(false);
      return;
    }

    if (password && password.length < 8) {
      setProfileError('Password must be at least 8 characters');
      setProfileLoading(false);
      return;
    }

    try {
      const body: any = {};
      if (email !== user?.email) body.email = email;
      if (password) body.password = password;

      if (Object.keys(body).length === 0) {
        setProfileError('No changes to save');
        setProfileLoading(false);
        return;
      }

      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update profile');
      }

      setProfileSuccess('Profile updated successfully');
      setPassword('');
      setConfirmPassword('');
      await refreshUser();
    } catch (err: any) {
      setProfileError(err.message);
    } finally {
      setProfileLoading(false);
    }
  };

  const plans = [
    {
      name: 'Starter',
      price: 'Rp 100K',
      period: '/bulan',
      features: [
        '1 AI Agent',
        '500K tokens/bulan',
        'WhatsApp CS support',
        'Email support',
      ],
      current: user?.plan === 'starter',
    },
    {
      name: 'Pro',
      price: 'Rp 500K',
      period: '/bulan',
      features: [
        '10 AI Agents',
        '5M tokens/bulan',
        'WhatsApp CS + Sales Data',
        'Priority support',
        'Custom integrations',
      ],
      current: user?.plan === 'pro',
    },
  ];

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your account and subscription</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-slate-100 rounded-lg p-1 w-fit">
        <button
          onClick={() => setActiveTab('profile')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
            activeTab === 'profile'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <User className="w-4 h-4" />
          Profile
        </button>
        <button
          onClick={() => setActiveTab('plan')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
            activeTab === 'plan'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          Plan & Billing
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl">
          {/* Profile Card */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                <User className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-900">Profile Settings</h2>
                <p className="text-xs text-slate-500">Update your personal information</p>
              </div>
            </div>

            {profileError && (
              <div className="bg-red-50 border border-red-100 rounded-lg p-3 mb-4 text-sm text-red-700">
                {profileError}
              </div>
            )}

            {profileSuccess && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 mb-4 text-sm text-emerald-700">
                {profileSuccess}
              </div>
            )}

            <form onSubmit={handleProfileUpdate}>
              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition"
                />
              </div>

              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">New Password (optional)</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave blank to keep current password"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition"
                />
              </div>

              {password && (
                <div className="mb-6">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={profileLoading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition disabled:opacity-50 shadow-sm"
              >
                {profileLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          {/* Security Card */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                <Shield className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-900">Security</h2>
                <p className="text-xs text-slate-500">Manage your account security settings</p>
              </div>
            </div>

            <div className="flex items-center justify-between py-3 border-t border-slate-100">
              <div>
                <p className="text-sm font-medium text-slate-900">API Key</p>
                <p className="text-xs text-slate-500 mt-0.5">Used for programmatic access to your agents</p>
              </div>
              <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition">
                Regenerate
              </button>
            </div>

            <div className="flex items-center justify-between py-3 border-t border-slate-100">
              <div>
                <p className="text-sm font-medium text-slate-900">Two-Factor Authentication</p>
                <p className="text-xs text-slate-500 mt-0.5">Add an extra layer of security to your account</p>
              </div>
              <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition">
                Enable
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Plan Tab */}
      {activeTab === 'plan' && (
        <div>
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Current Plan</h2>
            <p className="text-sm text-slate-500 mt-1">
              You are currently on the{' '}
              <span className="text-indigo-600 font-semibold capitalize">{user?.plan}</span> plan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl p-6 transition ${
                  plan.current
                    ? 'bg-white border-2 border-indigo-600 shadow-sm ring-4 ring-indigo-600/5'
                    : 'bg-white border border-slate-200/80 shadow-sm'
                }`}
              >
                {plan.current && (
                  <div className="inline-flex items-center gap-1.5 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
                    <Check className="w-3 h-3" />
                    Current Plan
                  </div>
                )}

                <h3 className="text-xl font-bold text-slate-900 mb-1">{plan.name}</h3>
                <div className="mb-5">
                  <span className="text-3xl font-bold text-slate-900">{plan.price}</span>
                  <span className="text-sm text-slate-500">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-indigo-600" />
                      </div>
                      <span className="text-sm text-slate-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                {!plan.current && (
                  <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition shadow-sm">
                    Upgrade to {plan.name}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900">Payment Method</h3>
                <p className="text-xs text-slate-500">Manage your billing information</p>
              </div>
            </div>

            <p className="text-sm text-slate-500 mb-4">
              Payment integration coming soon. Contact support to upgrade your plan.
            </p>
            <button className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-lg text-sm font-semibold transition border border-slate-200">
              Contact Support
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
