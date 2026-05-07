import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">
            <span className="text-blue-500">&lt;</span>
            AgentHub
            <span className="text-blue-500">/&gt;</span>
          </div>
          <div className="flex gap-8">
            <a href="#features" className="hover:text-blue-400">Features</a>
            <a href="#pricing" className="hover:text-blue-400">Pricing</a>
            <a href="#contact" className="hover:text-blue-400">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-6">
            AI Agents untuk Bisnis Anda
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Otomatisasi customer service, kelola penjualan, dan tingkatkan efisiensi bisnis dengan AI Agent yang mudah digunakan.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded font-semibold">
              Mulai Gratis
            </Link>
            <button className="border border-gray-600 hover:border-gray-400 px-8 py-3 rounded font-semibold">
              Demo
            </button>
          </div>
        </div>

        {/* Code snippet visual */}
        <div className="mt-16 bg-gray-900 border border-gray-800 rounded p-6 font-mono text-sm">
          <div className="text-gray-500">// agenthub.config.ts</div>
          <div className="text-green-400">const agent = {'{'}
            <div className="ml-4">type: <span className="text-yellow-400">"whatsapp-cs"</span>,</div>
            <div className="ml-4">name: <span className="text-yellow-400">"Customer Service Bot"</span>,</div>
            <div className="ml-4">model: <span className="text-yellow-400">"mimo-v2.5"</span>,</div>
          {'}'}</div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 border-t border-gray-800">
        <h2 className="text-4xl font-bold mb-12">Fitur Utama</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "WhatsApp CS Bot",
              desc: "Otomatis jawab FAQ, kumpulkan leads, dan kelola customer inquiry 24/7"
            },
            {
              title: "Sales Data Helper",
              desc: "Kelola data penjualan, inventory, dan customer info dengan mudah"
            },
            {
              title: "Analytics Dashboard",
              desc: "Monitor performa agent, response time, dan customer satisfaction"
            }
          ].map((feature, i) => (
            <div key={i} className="border border-gray-800 rounded p-6 hover:border-blue-500 transition">
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-20 border-t border-gray-800">
        <h2 className="text-4xl font-bold mb-12">Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              name: "Starter",
              price: "Rp 100K",
              tokens: "500K tokens/bulan",
              setup: "Setup: Rp 500K",
              features: ["WhatsApp CS Bot", "Basic Analytics", "Email Support"]
            },
            {
              name: "Pro",
              price: "Rp 500K",
              tokens: "5M tokens/bulan",
              setup: "Setup: Rp 1M",
              features: ["WhatsApp CS Bot", "Sales Data Helper", "Advanced Analytics", "Priority Support"],
              highlight: true
            }
          ].map((plan, i) => (
            <div key={i} className={`border rounded p-8 ${plan.highlight ? 'border-blue-500 bg-blue-500/10' : 'border-gray-800'}`}>
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="text-3xl font-bold mb-2">{plan.price}<span className="text-lg text-gray-400">/bulan</span></div>
              <p className="text-gray-400 mb-6">{plan.tokens}</p>
              <p className="text-sm text-gray-500 mb-6">{plan.setup}</p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2">
                    <span className="text-blue-400">✓</span> {f}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-2 rounded font-semibold ${plan.highlight ? 'bg-blue-600 hover:bg-blue-700' : 'border border-gray-600 hover:border-gray-400'}`}>
                Pilih Plan
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 py-8 text-center text-gray-500">
        <p>© 2026 AgentHub. Built with AI for UMKM.</p>
      </footer>
    </div>
  );
}
