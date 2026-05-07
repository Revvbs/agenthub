# AgentHub 🤖

AI Agent platform untuk UMKM. Otomatisasi customer service, kelola penjualan, dan tingkatkan efisiensi bisnis.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm atau yarn

### Installation

```bash
# Clone repo
git clone https://github.com/yourusername/agenthub.git
cd agenthub

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local dengan credentials lo

# Setup database
psql -U postgres -d agenthub -f database/schema.sql

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
agenthub/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication
│   │   └── agents/       # Agent management
│   ├── dashboard/        # Dashboard pages
│   └── page.tsx          # Landing page
├── database/
│   └── schema.sql        # PostgreSQL schema
├── lib/                  # Utilities & helpers
├── public/               # Static files
└── package.json
```

## 🎯 Features (MVP)

- ✅ Landing page dengan pricing
- ✅ User authentication
- ✅ Dashboard
- 🔄 Agent management (WIP)
- 🔄 WhatsApp CS bot integration (WIP)
- 🔄 Sales data helper (WIP)
- 🔄 Usage tracking & billing (WIP)

## 💰 Pricing

| Plan | Monthly | Setup | Tokens |
|------|---------|-------|--------|
| Starter | Rp 100K | Rp 500K | 500K/bulan |
| Pro | Rp 500K | Rp 1M | 5M/bulan |

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express (coming soon)
- **Database:** PostgreSQL
- **LLM:** DeepSeek V4 Flash, MiMo V2.5
- **Hosting:** Vercel (frontend), Railway (backend)

## 📝 Development Roadmap

- [ ] Day 1-2: Landing page + Dashboard UI ✅
- [ ] Day 3-4: Backend API + Database
- [ ] Day 5-6: Agent templates (WA CS + Sales)
- [ ] Day 7: Testing & Deploy

## 🔐 Security

- JWT authentication
- Password hashing (bcrypt)
- API key rotation
- Rate limiting (coming soon)

## 📞 Support

Email: support@agenthub.local

---

Built with ❤️ for UMKM
