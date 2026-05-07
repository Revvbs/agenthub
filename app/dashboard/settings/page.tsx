'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';

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

    // Validation
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
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage your account and subscription</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === 'profile'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab('plan')}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === 'plan'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Plan & Billing
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm max-w-2xl">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Profile Settings</h2>

          {profileError && (
            <div className="bg-red-50 border border-red-300 rounded p-3 mb-4 text-red-600 text-sm">
              {profileError}
            </div>
          )}

          {profileSuccess && (
            <div className="bg-green-50 border border-green-300 rounded p-3 mb-4 text-green-600 text-sm">
              {profileSuccess}
            </div>
          )}

          <form onSubmit={handleProfileUpdate}>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded px-4 py-2 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-gray-700">New Password (optional)</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank to keep current password"
                className="w-full bg-white border border-gray-300 rounded px-4 py-2 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {password && (
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-gray-700">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  className="w-full bg-white border border-gray-300 rounded px-4 py-2 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={profileLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold transition disabled:opacity-50"
            >
              {profileLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      )}

      {/* Plan Tab */}
      {activeTab === 'plan' && (
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2 text-gray-900">Current Plan</h2>
            <p className="text-gray-500">
              You are currently on the <span className="text-blue-600 font-semibold capitalize">{user?.plan}</span> plan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`border rounded-lg p-6 ${
                  plan.current
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white shadow-sm'
                }`}
              >
                {plan.current && (
                  <div className="inline-block bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
                    Current Plan
                  </div>
                )}
                
                <h3 className="text-2xl font-bold mb-2 text-gray-900">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                {!plan.current && (
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition">
                    Upgrade to {plan.name}
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Payment Method</h3>
            <p className="text-gray-500 mb-4">
              Payment integration coming soon. Contact support to upgrade your plan.
            </p>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded font-semibold transition border border-gray-300">
              Contact Support
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
