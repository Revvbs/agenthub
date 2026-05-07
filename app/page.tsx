import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const planDetails = {
    starter: {
      name: "Starter",
      price: "Rp 100K",
      tokens: "500K tokens/bulan",
      setup: "Setup: Rp 500K",
      features: [
        "✓ 1 WhatsApp CS Bot",
        "✓ Unlimited FAQ responses",
        "✓ Lead collection & storage",
        "✓ Basic analytics (daily summary)",
        "✓ Email support",
        "✓ 24/7 bot availability",
        "✓ Auto-response templates"
      ],
      description: "Perfect untuk UMKM kecil yang butuh customer service automation. Bot akan handle FAQ dan collect leads otomatis."
    },
    pro: {
      name: "Pro",
      price: "Rp 500K",
      tokens: "5M tokens/bulan",
      setup: "Setup: Rp 1M",
      features: [
        "✓ 1 WhatsApp CS Bot",
        "✓ 1 Sales Data Helper",
        "✓ Unlimited FAQ responses",
        "✓ Lead collection & storage",
        "✓ Sales tracking & reporting",
        "✓ Inventory management",
        "✓ Advanced analytics dashboard",
        "✓ Custom training data",
        "✓ Priority email & chat support",
        "✓ 24/7 bot availability",
        "✓ Auto-response templates"
      ],
      description: "Untuk UMKM yang berkembang. Kelola customer service + sales data dalam satu platform. Bot bisa track order, inventory, dan customer info."
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <nav className="border-b border-gray-200 px-6 py-4 sticky top-0 bg-white/95 backdrop-blur">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">
            <span className="text-blue-600">&lt;</span>
            AgentHub
            <span className="text-blue-600">/&gt;</span>
          </div>
          <div className="flex gap-8">
            <a href="#features" className="hover:text-blue-600 transition">Features</a>
            <a href="#pricing" className="hover:text-blue-600 transition">Pricing</a>
            <a href="#contact" className="hover:text-blue-600 transition">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-6 text-gray-900">
            AI Agents untuk Bisnis Anda
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Otomatisasi customer service, kelola penjualan, dan tingkatkan efisiensi bisnis dengan AI Agent yang mudah digunakan.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition">
              Mulai Gratis
            </Link>
            <button className="border-2 border-gray-300 hover:border-gray-400 text-gray-900 px-8 py-3 rounded-lg font-semibold transition">
              Demo
            </button>
          </div>
        </div>

        {/* Code snippet visual */}
        <div className="mt-20 bg-gray-50 border border-gray-200 rounded-lg p-8 font-mono text-sm max-w-2xl mx-auto">
          <div className="text-gray-500">// agenthub.config.ts</div>
          <div className="text-blue-600 mt-2">const agent = {'{'}
            <div className="ml-4 text-gray-700">type: <span className="text-orange-600">"whatsapp-cs"</span>,</div>
            <div className="ml-4 text-gray-700">name: <span className="text-orange-600">"Customer Service Bot"</span>,</div>
            <div className="ml-4 text-gray-700">model: <span className="text-orange-600">"mimo-v2.5"</span>,</div>
          {'}'}</div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 border-t border-gray-200">
        <h2 className="text-4xl font-bold mb-12 text-center">Fitur Utama</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "WhatsApp CS Bot",
              desc: "Otomatis jawab FAQ, kumpulkan leads, dan kelola customer inquiry 24/7",
              icon: "💬",
              details: ["Auto-reply FAQ", "Lead collection", "Customer tracking", "24/7 availability"]
            },
            {
              title: "Sales Data Helper",
              desc: "Kelola data penjualan, inventory, dan customer info dengan mudah",
              icon: "📊",
              details: ["Order tracking", "Inventory management", "Customer database", "Sales reporting"]
            },
            {
              title: "Analytics Dashboard",
              desc: "Monitor performa agent, response time, dan customer satisfaction",
              icon: "📈",
              details: ["Real-time stats", "Performance metrics", "Customer insights", "Export reports"]
            }
          ].map((feature, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-8 hover:shadow-lg hover:border-blue-300 transition">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600 mb-4">{feature.desc}</p>
              <ul className="space-y-2 text-sm text-gray-600">
                {feature.details.map((detail, j) => (
                  <li key={j} className="flex items-center gap-2">
                    <span className="text-blue-600">•</span> {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-20 border-t border-gray-200">
        <h2 className="text-4xl font-bold mb-12 text-center">Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
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
            <div key={i} className={`border-2 rounded-lg p-8 transition cursor-pointer ${plan.highlight ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
              onClick={() => setSelectedPlan(plan.name)}>
              <h3 className="text-2xl font-bold mb-2 text-gray-900">{plan.name}</h3>
              <div className="text-3xl font-bold mb-2 text-blue-600">{plan.price}<span className="text-lg text-gray-600">/bulan</span></div>
              <p className="text-gray-600 mb-6">{plan.tokens}</p>
              <p className="text-sm text-gray-500 mb-6">{plan.setup}</p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-gray-700">
                    <span className="text-blue-600 font-bold">✓</span> {f}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3 rounded-lg font-semibold transition ${plan.highlight ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border-2 border-gray-300 text-gray-900 hover:border-gray-400'}`}>
                Pilih Plan
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Plan Details Modal */}
      {selectedPlan && (
        <section className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{planDetails[selectedPlan as keyof typeof planDetails].name} Plan</h2>
                <p className="text-gray-600 mt-2">{planDetails[selectedPlan as keyof typeof planDetails].description}</p>
              </div>
              <button onClick={() => setSelectedPlan(null)} className="text-2xl text-gray-400 hover:text-gray-600">×</button>
            </div>

            <div className="mb-8 p-6 bg-blue-50 rounded-lg">
              <div className="text-4xl font-bold text-blue-600 mb-2">{planDetails[selectedPlan as keyof typeof planDetails].price}</div>
              <div className="text-gray-600">{planDetails[selectedPlan as keyof typeof planDetails].tokens}</div>
              <div className="text-sm text-gray-500 mt-2">{planDetails[selectedPlan as keyof typeof planDetails].setup}</div>
            </div>

            <h3 className="text-xl font-bold mb-4 text-gray-900">Apa yang Anda Dapatkan:</h3>
            <ul className="space-y-3 mb-8">
              {planDetails[selectedPlan as keyof typeof planDetails].features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-700">
                  <span className="text-blue-600 font-bold text-lg">✓</span>
                  <span>{feature.replace('✓ ', '')}</span>
                </li>
              ))}
            </ul>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition">
              Mulai Sekarang
            </button>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-gray-200 text-center">
        <h2 className="text-4xl font-bold mb-6">Siap memulai?</h2>
        <p className="text-xl text-gray-600 mb-8">Buat akun gratis dan setup agent pertama Anda dalam 5 menit.</p>
        <Link href="/dashboard" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition">
          Mulai Sekarang
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 px-6 py-8 text-center text-gray-600 bg-gray-50">
        <p>© 2026 AgentHub. Built with AI for UMKM.</p>
      </footer>
    </div>
  );
}
