'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
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
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  const handleLeadSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLeadSubmitted(true);
  };

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
      q: "Apakah data bisnis saya aman?",
      a: "Ya. Data disimpan di server terenkripsi, akses dibatasi per akun, dan tidak dibagikan ke pihak ketiga."
    },
    {
      q: "Apakah ada risiko WhatsApp kena blokir?",
      a: "Risiko diminimalkan dengan template balasan natural, rate limit, dan pola kirim yang tidak spammy."
    },
    {
      q: "Berapa lama setup bot sampai live?",
      a: "Umumnya 5-15 menit setelah data FAQ dan alur dasar Anda siap."
    },
    {
      q: "Kalau ada masalah, support-nya seperti apa?",
      a: "Starter dapat email support. Pro dapat priority chat + email support untuk isu operasional harian."
    },
    {
      q: "Bisa upgrade, downgrade, atau berhenti kapan saja?",
      a: "Bisa. Tanpa kontrak jangka panjang. Anda bisa sesuaikan plan mengikuti kondisi bisnis."
    }
  ];

  const socialProof = [
    { label: "UMKM pilot aktif", value: "120+" },
    { label: "Rata-rata waktu respon", value: "< 5 detik" },
    { label: "Pertanyaan FAQ ter-handle", value: "80%" },
  ];

  const useCases = [
    {
      title: "F&B / Kuliner",
      pain: "Chat menumpuk jam makan, banyak pertanyaan menu sama.",
      outcome: "Bot jawab menu, jam buka, lokasi, dan promo otomatis.",
    },
    {
      title: "Klinik / Beauty",
      pain: "Admin capek jawab pertanyaan treatment dan jadwal berulang.",
      outcome: "Bot filter pertanyaan awal dan kumpulkan lead siap booking.",
    },
    {
      title: "Toko Online / Reseller",
      pain: "Order, stok, dan follow-up customer tersebar di banyak chat.",
      outcome: "Bot bantu tracking order, status stok, dan rekap prospek harian.",
    },
  ];

  const testimonials = [
    {
      quote: "Sebelum pakai AgentHub, admin kami kewalahan tiap malam. Sekarang FAQ auto-kejawab dan tim fokus closing.",
      by: "Owner, Toko Fashion Lokal",
    },
    {
      quote: "Leads dari WhatsApp lebih rapi, tidak ada chat penting yang kelewat. Respon lebih cepat, konversi naik.",
      by: "Manager Operasional, Klinik Kecantikan",
    },
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
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            Dibuat untuk UMKM Indonesia
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
            Balas Chat Pelanggan 24/7
            <span className="block text-indigo-600">Tanpa Tambah Admin</span>
          </h1>
          <p className="text-lg text-slate-600 mb-3 max-w-2xl mx-auto leading-relaxed">
            AgentHub bantu bisnis Anda respon lebih cepat di WhatsApp, kumpulkan lead otomatis, dan rapikan data penjualan harian.
          </p>
          <p className="text-base text-slate-500 mb-10 max-w-xl mx-auto">
            Tanpa coding. Setup 5-15 menit. Mulai dari Rp 100K/bulan.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link href="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white px-7 py-3 rounded-lg font-semibold transition-all duration-200 inline-flex items-center justify-center gap-2">
              Mulai Gratis
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="border border-slate-300 hover:border-slate-400 bg-white text-slate-700 px-7 py-3 rounded-lg font-semibold transition-all duration-200 inline-flex items-center justify-center gap-2">
              Konsultasi 15 Menit
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="mt-14 bg-white border border-slate-200 rounded-2xl p-5 md:p-7 max-w-3xl mx-auto shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Preview Percakapan WhatsApp</div>
          <div className="space-y-3 text-sm">
            <div className="bg-slate-100 text-slate-700 rounded-xl px-4 py-3 max-w-[85%]">Kak, toko buka sampai jam berapa ya?</div>
            <div className="bg-emerald-50 text-emerald-900 rounded-xl px-4 py-3 max-w-[85%] ml-auto border border-emerald-200">Halo Kak, hari ini buka sampai jam 21.00 WIB. Kalau mau, aku bantu cek stok produk yang Kakak cari juga.</div>
            <div className="bg-slate-100 text-slate-700 rounded-xl px-4 py-3 max-w-[85%]">Mau lihat promo ongkir dong.</div>
            <div className="bg-emerald-50 text-emerald-900 rounded-xl px-4 py-3 max-w-[85%] ml-auto border border-emerald-200">Siap. Promo ongkir berlaku untuk order minimal Rp150.000 hari ini. Mau aku kirim produk best seller juga?</div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
          {socialProof.map((item, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl px-4 py-4 text-center">
              <div className="text-2xl font-bold text-slate-900">{item.value}</div>
              <div className="text-xs text-slate-500 mt-1">{item.label}</div>
            </div>
          ))}
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

        <div className="mt-14">
          <h3 className="text-2xl font-bold text-slate-900 text-center mb-3">Cocok untuk Jenis Bisnis Anda</h3>
          <p className="text-slate-500 text-center mb-8">Lihat contoh masalah harian yang bisa langsung diotomasi</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {useCases.map((item, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-5">
                <h4 className="font-bold text-slate-900 mb-3">{item.title}</h4>
                <p className="text-sm text-slate-600 mb-3"><span className="font-semibold text-slate-800">Masalah:</span> {item.pain}</p>
                <p className="text-sm text-slate-600"><span className="font-semibold text-slate-800">Hasil:</span> {item.outcome}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5">
          {testimonials.map((item, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl p-5">
              <p className="text-slate-700 text-sm leading-relaxed">"{item.quote}"</p>
              <p className="text-xs text-slate-500 mt-3">{item.by}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Pricing Transparan</h2>
            <p className="text-slate-500">Biaya bulanan + setup fee jelas dari awal, tanpa biaya tersembunyi</p>
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
                  <p className="text-xs text-slate-400 mb-2">{details.setup}</p>
                  <p className="text-xs text-slate-500 mb-6">Total awal: {details.setup.replace('Setup: ', '')} + {details.price}/bulan</p>
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

      {/* Plan Comparison */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Bandingkan Plan dengan Cepat</h2>
          <p className="text-slate-500">Pilih plan sesuai fase bisnis Anda saat ini</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-200">
            <div className="p-4 text-sm font-semibold text-slate-700">Fitur</div>
            <div className="p-4 text-sm font-semibold text-slate-900 text-center">Starter</div>
            <div className="p-4 text-sm font-semibold text-slate-900 text-center">Pro</div>
          </div>
          {[
            ["Harga bulanan", "Rp 100K", "Rp 500K"],
            ["Setup awal", "Rp 500K", "Rp 1M"],
            ["WhatsApp CS Bot", "1", "1"],
            ["Sales Data Helper", "-", "1"],
            ["Analytics dashboard", "Basic", "Advanced"],
            ["Support", "Email", "Priority chat + email"],
          ].map((row, i) => (
            <div key={i} className="grid grid-cols-3 border-b border-slate-100 last:border-b-0">
              <div className="p-4 text-sm text-slate-700">{row[0]}</div>
              <div className="p-4 text-sm text-slate-900 text-center">{row[1]}</div>
              <div className="p-4 text-sm text-slate-900 text-center">{row[2]}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Case Study */}
      <section className="bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-4">Contoh Hasil Nyata</h2>
          <p className="text-slate-500 text-center mb-10">Simulasi dari use case UMKM yang sering kami temui</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <h3 className="font-bold text-slate-900 mb-4">Toko Online Fashion</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-white rounded-lg p-3 border border-slate-200"><p className="text-slate-500">Sebelum</p><p className="font-semibold text-slate-900">Respon 25-40 menit</p></div>
                <div className="bg-white rounded-lg p-3 border border-slate-200"><p className="text-slate-500">Sesudah</p><p className="font-semibold text-emerald-700">Respon {'< 5 detik'}</p></div>
                <div className="bg-white rounded-lg p-3 border border-slate-200"><p className="text-slate-500">Sebelum</p><p className="font-semibold text-slate-900">Lead tercecer</p></div>
                <div className="bg-white rounded-lg p-3 border border-slate-200"><p className="text-slate-500">Sesudah</p><p className="font-semibold text-emerald-700">Lead tersimpan otomatis</p></div>
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <h3 className="font-bold text-slate-900 mb-4">Klinik Kecantikan</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-white rounded-lg p-3 border border-slate-200"><p className="text-slate-500">Sebelum</p><p className="font-semibold text-slate-900">Admin overload malam</p></div>
                <div className="bg-white rounded-lg p-3 border border-slate-200"><p className="text-slate-500">Sesudah</p><p className="font-semibold text-emerald-700">FAQ auto ter-handle</p></div>
                <div className="bg-white rounded-lg p-3 border border-slate-200"><p className="text-slate-500">Sebelum</p><p className="font-semibold text-slate-900">Follow-up manual</p></div>
                <div className="bg-white rounded-lg p-3 border border-slate-200"><p className="text-slate-500">Sesudah</p><p className="font-semibold text-emerald-700">Rekap harian otomatis</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Objection Handling */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-4">Masih Ragu? Ini Jawaban Cepatnya</h2>
        <p className="text-slate-500 text-center mb-10">Keberatan paling umum sebelum mulai otomasi</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white border border-slate-200 rounded-xl p-5"><h3 className="font-bold text-slate-900 mb-2">Takut chat jadi kaku?</h3><p className="text-sm text-slate-600">Template balasan bisa disesuaikan tone brand Anda, plus human takeover kapan saja.</p></div>
          <div className="bg-white border border-slate-200 rounded-xl p-5"><h3 className="font-bold text-slate-900 mb-2">Takut WhatsApp kena limit?</h3><p className="text-sm text-slate-600">Kami pakai rate limit dan pola kirim aman untuk mengurangi risiko spam behavior.</p></div>
          <div className="bg-white border border-slate-200 rounded-xl p-5"><h3 className="font-bold text-slate-900 mb-2">Takut tim bingung pakainya?</h3><p className="text-sm text-slate-600">Setup singkat + dashboard simple, tim Anda bisa adaptasi cepat tanpa coding.</p></div>
        </div>
      </section>

      {/* Lead Form */}
      <section className="bg-white border-y border-slate-200">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-4">Mau Kami Rekomendasiin Setup Paling Pas?</h2>
          <p className="text-slate-500 text-center mb-8">Isi singkat, tim kami bantu mapping kebutuhan bisnis Anda.</p>
          {leadSubmitted ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 text-sm text-center">Terima kasih. Tim kami akan hubungi Anda segera lewat WhatsApp.</div>
          ) : (
            <form onSubmit={handleLeadSubmit} className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
              <input required type="text" placeholder="Nama bisnis" className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm" />
              <input required type="tel" placeholder="Nomor WhatsApp aktif" className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm" />
              <select required className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm bg-white text-slate-600">
                <option value="">Volume chat per hari</option>
                <option value="<50">{"< 50 chat"}</option>
                <option value="50-200">50 - 200 chat</option>
                <option value=">200">{"> 200 chat"}</option>
              </select>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg text-sm transition-all duration-200">Minta Rekomendasi Setup</button>
            </form>
          )}
        </div>
      </section>

      {/* Plan Details Modal */}
      {selectedPlan && (() => {
        const details = planDetails[selectedPlan.toLowerCase() as keyof typeof planDetails];
        return (
          <section className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-start justify-center p-3 md:p-4 pt-[max(env(safe-area-inset-top),24px)] pb-[max(env(safe-area-inset-bottom),16px)] z-50 overflow-y-auto">
            <div className="bg-white rounded-xl max-w-3xl w-full mt-5 md:mt-8 mb-4 shadow-xl max-h-[calc(100dvh-56px)] overflow-hidden">
              <div className="p-4 md:p-6 border-b border-slate-200 sticky top-0 bg-white z-10">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900 break-words">{details.name} Plan</h2>
                    <p className="text-slate-600 text-sm mt-1 break-words">{details.description}</p>
                  </div>
                  <button onClick={() => setSelectedPlan(null)} className="p-2 hover:bg-slate-100 rounded-lg transition-all duration-200">
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
              </div>

              <div className="p-4 md:p-6 overflow-y-auto max-h-[calc(92vh-92px)]">
                <div className="mb-6 p-4 md:p-5 bg-indigo-50 rounded-xl border border-indigo-100">
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
                          <span className="break-words">{feature}</span>
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
                          <span className="break-words">{item}</span>
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
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Siap Rapikan Operasional Chat Bisnis?</h2>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">Mulai gratis sekarang atau konsultasi 15 menit untuk lihat skenario paling cocok buat bisnis Anda.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-7 py-3 rounded-lg font-semibold transition-all duration-200">
              Mulai Sekarang
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border border-slate-300 hover:border-slate-400 bg-white text-slate-700 px-7 py-3 rounded-lg font-semibold transition-all duration-200">
              Chat Tim Kami
              <MessageSquare className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white/95 backdrop-blur border-t border-slate-200 p-3 pb-[max(env(safe-area-inset-bottom),12px)]">
        <div className="grid grid-cols-2 gap-2">
          <Link href="/register" className="inline-flex items-center justify-center bg-indigo-600 text-white text-sm font-semibold rounded-lg py-2.5">Mulai Gratis</Link>
          <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center border border-slate-300 text-slate-700 text-sm font-semibold rounded-lg py-2.5">Chat WA</a>
        </div>
      </div>

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
