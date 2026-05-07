import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 w-64 h-screen border-r border-gray-800 bg-gray-950 p-6">
        <div className="text-2xl font-bold mb-8">
          <span className="text-blue-500">&lt;</span>
          AgentHub
          <span className="text-blue-500">/&gt;</span>
        </div>
        
        <nav className="space-y-4">
          <Link href="/dashboard" className="block px-4 py-2 rounded hover:bg-gray-800 transition">
            📊 Dashboard
          </Link>
          <Link href="/dashboard/agents" className="block px-4 py-2 rounded hover:bg-gray-800 transition">
            🤖 My Agents
          </Link>
          <Link href="/dashboard/settings" className="block px-4 py-2 rounded hover:bg-gray-800 transition">
            ⚙️ Settings
          </Link>
          <Link href="/dashboard/billing" className="block px-4 py-2 rounded hover:bg-gray-800 transition">
            💳 Billing
          </Link>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <button className="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-semibold transition">
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-64 p-8">
        {children}
      </div>
    </div>
  );
}
