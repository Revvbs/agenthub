'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Bot,
  MessageSquare,
  BarChart3,
  Shield,
  Zap,
  Check,
  ChevronDown,
  ArrowRight,
  Star,
  Phone,
  Settings,
  Database,
  TrendingUp,
  Clock,
  Mail,
  Users,
  FileText,
  Headphones,
  X,
  Sparkles,
  CircleDot,
} from 'lucide-react';

export default function Home() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const planDetails = {
    starter: {
      name: "Starter",
      price: "Rp 100K",
      tokens: "500K tokens/bulan",
      setup: "Setup: Rp 500K",
      description: "Perfect untuk UMKM kecil yang butuh customer service automation. Bot akan handle FAQ dan collect leads otomatis.",
      features: [
        "1 WhatsApp CS Bot",
        "Unlimited FAQ responses",
        "Lead collection & storage",
        "Basic analytics (daily summary)",
        "Email support",
        "24/7 bot availability",
        "Auto-response templates",
        "Customer database"
      ],
      whatYouGet: [
        "Bot siap pakai dalam 5 menit",
        "Terhubung langsung ke WhatsApp bisnis Anda",
        "Otomatis jawab pertanyaan pelanggan",
        "Kumpulkan data leads secara otomatis",
        "Lihat statistik harian (berapa chat, leads, dll)",
        "Support via email jika ada masalah"
      ],
      useCases: [
        "Toko online yang butuh CS 24/7",
        "Salon/klinik yang sering dapat pertanyaan sama",
        "Reseller yang ingin collect leads otomatis",
        "UMKM yang baru mulai online"
      ]
    },
    pro: {
      name: "Pro",
      price: "Rp 500K",
      tokens: "5M tokens/bulan",
      setup: "Setup: Rp 1M",
      description: "Untuk UMKM yang berkembang. Kelola customer service + sales data dalam satu platform. Bot bisa track order, inventory, dan customer info.",
      features: [
        "1 WhatsApp CS Bot",
        "1 Sales Data Helper",
        "Unlimited FAQ responses",
        "Lead collection & storage",
        "Sales tracking & reporting",
        "Inventory management",
        "Advanced analytics dashboard",
        "Custom training data",
        "Priority email & chat support",
        "24/7 bot availability",
        "Auto-response templates",
        "Customer database",
        "Order tracking",
        "Multi-user access"
      ],
      whatYouGet: [
        "2 Bot siap pakai (CS + Sales Helper)",
        "Bot CS handle customer service 24/7",
        "Bot Sales Helper track order & inventory",
        "Dashboard lengkap lihat semua data penjualan",
        "Laporan harian/mingguan otomatis",
        "Kelola customer database terpusat",
        "Support prioritas via chat & email",
        "Bisa customize bot sesuai bisnis Anda"
      ],
      useCases: [
        "E-commerce dengan banyak order",
        "Reseller dengan inventory kompleks",
        "Distributor yang track banyak produk",
        "UMKM yang sudah berkembang & butuh sistem",
        "Bisnis dengan multiple cabang"
      ]
    }
  };

  const features = [
    {
      title: "WhatsApp CS Bot",
      desc: "Otomatis jawab FAQ, kumpulkan leads, dan kelola customer inquiry 24/7",
      icon: MessageSquare,
      details: ["Auto-reply FAQ", "Lead collection", "Customer tracking", "24/7 availability", "Response time < 1 detik"]
    },
    {
      title: "Sales Data Helper",
      desc: "Kelola data penjualan, inventory, dan customer info dengan mudah",
      icon: BarChart3,
      details: ["Order tracking", "Inventory management", "Customer database", "Sales reporting", "Multi-user access"]
    },
    {
      title: "Analytics Dashboard",
      desc: "Monitor performa agent, response time, dan customer satisfaction",
      icon: TrendingUp,
      details: ["Real-time stats", "Performance metrics", "Customer insights", "Export reports", "Daily summary"]
    }
  ];

  const faqs = [
    {
      q: "Berapa lama setup bot?",
      a: "Hanya 5 menit! Kami handle semuanya. Anda tinggal approve dan bot langsung live di WhatsApp."
    },
    {
      q: "Apakah perlu coding?",
      a: "Tidak sama sekali. Semua sudah otomatis. Anda hanya perlu memberikan FAQ atau data penjualan."
    },
    {
      q: "Bagaimana jika ada masalah?",
      a: "Starter plan dapat email support. Pro plan dapat priority chat & email support. Kami siap membantu 24/7."
    },
    {
      q: "Bisa upgrade/downgrade kapan saja?",
      a: "Ya, bisa kapan saja. Tidak ada kontrak jangka panjang. Bayar bulanan sesuai kebutuhan."
    },
    {
      q: "Apakah data aman?",
      a: "Sangat aman. Data Anda tersimpan di server terenkripsi. Kami tidak pernah share data ke pihak ketiga."
    }
  ];

  const steps = [
    { step: "1", title: "Pilih Plan", desc: "Pilih Starter atau Pro sesuai kebutuhan", icon: FileText },
    { step: "2", title: "Setup Bot", desc: "Kami setup bot Anda dalam 5 menit", icon: Settings },
    { step: "3", title: "Connect WhatsApp", desc: "Bot langsung terhubung ke WhatsApp bisnis", icon: Phone },
    { step: "4", title: "Mulai Otomasi", desc: "Bot siap handle customer 24/7", icon: Zap },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">AgentHub</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-all duration-200">Features</a>
            <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-all duration-200">Pricing</a>
            <a href="#faq" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-all duration-200">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-all duration-200 px-4 py-2">
              Login
            </Link>
            <Link href="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all duration-200">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-20">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            AI-powered untuk UMKM Indonesia
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
            AI Agents untuk Bisnis Anda
          </h1>
          <p className="text-lg text-slate-600 mb-3 max-w-2xl mx-auto leading-relaxed">
            Otomatisasi customer service, kelola penjualan, dan tingkatkan efisiensi bisnis dengan AI Agent yang mudah digunakan.
          </p>
          <p className="text-base text-slate-500 mb-10 max-w-xl mx-auto">
            Tidak perlu coding. Setup dalam 5 menit. Mulai dari Rp 100K/bulan.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/dashboard" className="bg-indigo-600 hover:bg-indigo-700 text-white px-7 py-3 rounded-lg font-semibold transition-all duration-200 inline-flex items-center gap-2">
              Mulai Gratis
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button className="border border-slate-300 hover:border-slate-400 bg-white text-slate-700 px-7 py-3 rounded-lg font-semibold transition-all duration-200">
              Lihat Demo
            </button>
          </div>
        </div>

        {/* Code snippet visual */}
        <div className="mt-16 bg-slate-900 rounded-xl p-8 font-mono text-sm max-w-2xl mx-auto shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-emerald-400" />
            <span className="text-slate-500 text-xs ml-2">agenthub.config.ts</span>
          </div>
          <div className="text-slate-400">{'// Setup your AI agent'}</div>
          <div className="text-indigo-400 mt-2">{'const agent = {'}</div>
          <div className="ml-4 text-slate-300">type: <span className="text-amber-400">"whatsapp-cs"</span>,</div>
          <div className="ml-4 text-slate-300">name: <span className="text-amber-400">"Customer Service Bot"</span>,</div>
          <div className="ml-4 text-slate-300">model: <span className="text-amber-400">"mimo-v2.5"</span>,</div>
          <div className="text-indigo-400">{'}'}</div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">Cara Kerja AgentHub</h2>
          <p className="text-slate-500 text-center mb-12 max-w-lg mx-auto">Mulai dari nol sampai bot live di WhatsApp dalam hitungan menit</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">Step {item.step}</div>
                <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Fitur Utama</h2>
          <p className="text-slate-500 max-w-lg mx-auto">Semua yang Anda butuhkan untuk mengotomasi bisnis dengan AI</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div key={i} className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 hover:shadow-md transition-all duration-200">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-slate-600 text-sm mb-5">{feature.desc}</p>
              <ul className="space-y-2.5">
                {feature.details.map((detail, j) => (
                  <li key={j} className="flex items-center gap-2.5 text-sm text-slate-600">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Pricing</h2>
            <p className="text-slate-500">Pilih plan yang sesuai dengan kebutuhan bisnis Anda</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {[
              { name: "Starter", highlight: false },
              { name: "Pro", highlight: true }
            ].map((plan, i) => {
              const details = planDetails[plan.name.toLowerCase() as keyof typeof planDetails];
              return (
                <div key={i}
                  className={`bg-white border rounded-xl p-6 transition-all duration-200 cursor-pointer ${
                    plan.highlight
                      ? 'border-indigo-600 shadow-md ring-1 ring-indigo-600'
                      : 'border-slate-200 shadow-sm hover:border-slate-300'
                  }`}
                  onClick={() => setSelectedPlan(plan.name)}>
                  {plan.highlight && (
                    <div className="inline-flex items-center gap-1 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                      <Star className="w-3 h-3" />
                      RECOMMENDED
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{details.name}</h3>
                  <div className="mb-1">
                    <span className="text-3xl font-bold text-slate-900">{details.price}</span>
                    <span className="text-slate-500 text-sm">/bulan</span>
                  </div>
                  <p className="text-sm text-slate-500 mb-1">{details.tokens}</p>
                  <p className="text-xs text-slate-400 mb-6">{details.setup}</p>
                  <div className="border-t border-slate-100 pt-5 mb-6">
                    <ul className="space-y-3">
                      {details.features.slice(0, 5).map((f, j) => (
                        <li key={j} className="flex items-center gap-2.5 text-sm text-slate-600">
                          <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                      <li className="text-slate-400 text-xs pl-6">+ {details.features.length - 5} fitur lainnya</li>
                    </ul>
                  </div>
                  <button className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
                    plan.highlight
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'border border-slate-300 text-slate-700 hover:border-slate-400 bg-white'
                  }`}>
                    Lihat Detail
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Plan Details Modal */}
      {selectedPlan && (() => {
        const details = planDetails[selectedPlan.toLowerCase() as keyof typeof planDetails];
        return (
          <section className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-xl max-w-3xl w-full my-8 shadow-xl">
              <div className="p-6 border-b border-slate-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{details.name} Plan</h2>
                    <p className="text-slate-600 text-sm mt-1">{details.description}</p>
                  </div>
                  <button onClick={() => setSelectedPlan(null)} className="p-2 hover:bg-slate-100 rounded-lg transition-all duration-200">
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-6 p-5 bg-indigo-50 rounded-xl border border-indigo-100">
                  <div className="text-3xl font-bold text-slate-900">{details.price}<span className="text-base text-slate-500 font-normal">/bulan</span></div>
                  <div className="text-sm text-slate-600 mt-1">{details.tokens}</div>
                  <div className="text-xs text-slate-400 mt-1">{details.setup}</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Fitur Lengkap</h3>
                    <ul className="space-y-2.5">
                      {details.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                          <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Apa yang Anda Dapatkan</h3>
                    <ul className="space-y-3">
                      {details.whatYouGet.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                          <ArrowRight className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-5 bg-slate-50 rounded-xl mb-6">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Cocok untuk</h3>
                  <ul className="space-y-2">
                    {details.useCases.map((useCase, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-sm text-slate-600">
                        <CircleDot className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                        {useCase}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href="/register" className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold text-sm text-center transition-all duration-200 mb-3">
                  Mulai Sekarang
                </Link>
                <button onClick={() => setSelectedPlan(null)} className="w-full border border-slate-300 text-slate-700 py-3 rounded-lg font-semibold text-sm transition-all duration-200 hover:bg-slate-50">
                  Tutup
                </button>
              </div>
            </div>
          </section>
        );
      })()}

      {/* FAQ */}
      <section id="faq" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">FAQ</h2>
          <p className="text-slate-500">Pertanyaan yang sering ditanyakan</p>
        </div>
        <div className="max-w-2xl mx-auto space-y-3">
          {faqs.map((item, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-all duration-200"
              >
                <h3 className="font-semibold text-slate-900 text-sm pr-4">{item.q}</h3>
                <ChevronDown className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === i && (
                <div className="px-5 pb-5 pt-0">
                  <p className="text-sm text-slate-600 leading-relaxed">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Siap memulai?</h2>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">Buat akun gratis dan setup agent pertama Anda dalam 5 menit.</p>
          <Link href="/dashboard" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-7 py-3 rounded-lg font-semibold transition-all duration-200">
            Mulai Sekarang
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#F8FAFC] border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-slate-900">AgentHub</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <a href="#features" className="hover:text-slate-700 transition-all duration-200">Features</a>
              <a href="#pricing" className="hover:text-slate-700 transition-all duration-200">Pricing</a>
              <a href="#faq" className="hover:text-slate-700 transition-all duration-200">FAQ</a>
              <Link href="/login" className="hover:text-slate-700 transition-all duration-200">Login</Link>
            </div>
            <p className="text-xs text-slate-400">© 2026 AgentHub. Built with AI for UMKM.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
