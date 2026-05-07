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
        <h1 className="text-4xl font-bold mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account and subscription</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-800">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === 'profile'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab('plan')}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === 'plan'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Plan & Billing
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="border border-gray-800 rounded p-6 bg-gray-900 max-w-2xl">
          <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>

          {profileError && (
            <div className="bg-red-900/20 border border-red-600 rounded p-3 mb-4 text-red-400 text-sm">
              {profileError}
            </div>
          )}

          {profileSuccess && (
            <div className="bg-green-900/20 border border-green-600 rounded p-3 mb-4 text-green-400 text-sm">
              {profileSuccess}
            </div>
          )}

          <form onSubmit={handleProfileUpdate}>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">New Password (optional)</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank to keep current password"
                className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>

            {password && (
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={profileLoading}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded font-semibold transition disabled:opacity-50"
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
            <h2 className="text-2xl font-bold mb-2">Current Plan</h2>
            <p className="text-gray-400">
              You are currently on the <span className="text-blue-400 font-semibold capitalize">{user?.plan}</span> plan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`border rounded-lg p-6 ${
                  plan.current
                    ? 'border-blue-500 bg-blue-900/10'
                    : 'border-gray-800 bg-gray-900'
                }`}
              >
                {plan.current && (
                  <div className="inline-block bg-blue-600 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                    Current Plan
                  </div>
                )}
                
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-400">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {!plan.current && (
                  <button className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold transition">
                    Upgrade to {plan.name}
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 border border-gray-800 rounded p-6 bg-gray-900">
            <h3 className="text-xl font-bold mb-4">Payment Method</h3>
            <p className="text-gray-400 mb-4">
              Payment integration coming soon. Contact support to upgrade your plan.
            </p>
            <button className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded font-semibold transition">
              Contact Support
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
