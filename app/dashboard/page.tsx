export default function Dashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Welcome back, User</h1>
        <p className="text-gray-400">Manage your AI agents and monitor performance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Active Agents", value: "2", icon: "🤖" },
          { label: "Messages Today", value: "1,234", icon: "💬" },
          { label: "Tokens Used", value: "45.2K", icon: "⚡" },
          { label: "Plan", value: "Pro", icon: "📊" }
        ].map((stat, i) => (
          <div key={i} className="border border-gray-800 rounded p-6 bg-gray-900">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-gray-400 text-sm">{stat.label}</div>
            <div className="text-2xl font-bold">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Active Agents */}
      <div className="border border-gray-800 rounded p-6 bg-gray-900">
        <h2 className="text-2xl font-bold mb-4">Your Agents</h2>
        <div className="space-y-4">
          {[
            { name: "Customer Service Bot", type: "WhatsApp CS", status: "Active", messages: "234" },
            { name: "Sales Helper", type: "Sales Data", status: "Active", messages: "89" }
          ].map((agent, i) => (
            <div key={i} className="border border-gray-700 rounded p-4 flex justify-between items-center hover:border-blue-500 transition cursor-pointer">
              <div>
                <h3 className="font-bold">{agent.name}</h3>
                <p className="text-sm text-gray-400">{agent.type}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 justify-end mb-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-sm">{agent.status}</span>
                </div>
                <p className="text-sm text-gray-400">{agent.messages} messages</p>
              </div>
            </div>
          ))}
        </div>
        <button className="mt-6 w-full border border-blue-500 text-blue-400 hover:bg-blue-500/10 px-4 py-2 rounded font-semibold transition">
          + Create New Agent
        </button>
      </div>
    </div>
  );
}
