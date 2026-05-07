# AgentHub Backend API

Backend API untuk AgentHub - Platform SaaS untuk deploy AI agents ke UMKM.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL
- **Auth**: JWT (jsonwebtoken)
- **Password**: bcryptjs
- **Deployment**: Vercel (frontend) + Railway (database)

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Database

Buat PostgreSQL database di Railway (atau local):

```bash
# Copy .env.example ke .env
cp .env.example .env

# Edit .env dan isi DATABASE_URL
# Format: postgresql://user:password@host:5432/dbname
```

### 3. Run Database Schema

```bash
# Connect ke database dan run schema
psql $DATABASE_URL < database/schema.sql
```

### 4. Generate JWT Secret

```bash
# Generate random secret
openssl rand -base64 32

# Paste ke .env sebagai JWT_SECRET
```

### 5. Run Development Server

```bash
npm run dev
```

Server akan jalan di `http://localhost:3000`

## API Endpoints

### Authentication

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "plan": "starter" // optional, default: starter
}

Response:
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "plan": "starter",
    "tokensLimit": 500000,
    "tokensUsed": 0,
    "createdAt": "2026-05-07T04:00:00.000Z"
  }
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "plan": "starter",
    "tokensLimit": 500000,
    "tokensUsed": 12500
  }
}
```

### User Profile

#### Get User
```
GET /api/user
Authorization: Bearer <token>

Response:
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "plan": "starter",
    "tokensLimit": 500000,
    "tokensUsed": 12500,
    "agentCount": 1,
    "createdAt": "2026-05-07T04:00:00.000Z",
    "updatedAt": "2026-05-07T04:00:00.000Z"
  }
}
```

#### Update User
```
PATCH /api/user
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "newemail@example.com", // optional
  "password": "newpassword123", // optional
  "plan": "pro" // optional
}

Response:
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "newemail@example.com",
    "plan": "pro",
    "tokensLimit": 5000000,
    "tokensUsed": 12500,
    "updatedAt": "2026-05-07T04:30:00.000Z"
  }
}
```

### Agents

#### List Agents
```
GET /api/agents
Authorization: Bearer <token>

Response:
{
  "success": true,
  "agents": [
    {
      "id": "uuid",
      "name": "Customer Service Bot",
      "type": "whatsapp-cs",
      "status": "active",
      "config": {},
      "whatsappNumber": "+6281234567890",
      "createdAt": "2026-05-01T00:00:00.000Z",
      "updatedAt": "2026-05-01T00:00:00.000Z",
      "tokensUsed": 12500,
      "messagesToday": 234
    }
  ]
}
```

#### Create Agent
```
POST /api/agents
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Customer Service Bot",
  "type": "whatsapp-cs",
  "config": {
    "greeting": "Halo! Ada yang bisa saya bantu?",
    "model": "gpt-4"
  },
  "whatsappNumber": "+6281234567890" // optional
}

Response:
{
  "success": true,
  "agent": {
    "id": "uuid",
    "name": "Customer Service Bot",
    "type": "whatsapp-cs",
    "status": "pending",
    "config": {...},
    "whatsappNumber": "+6281234567890",
    "apiKey": "ak_xxxxxxxxxxxxxxxx",
    "createdAt": "2026-05-07T04:30:00.000Z"
  }
}
```

#### Get Agent
```
GET /api/agents/:id
Authorization: Bearer <token>

Response:
{
  "success": true,
  "agent": {
    "id": "uuid",
    "name": "Customer Service Bot",
    "type": "whatsapp-cs",
    "status": "active",
    "config": {...},
    "whatsappNumber": "+6281234567890",
    "apiKey": "ak_xxxxxxxxxxxxxxxx",
    "createdAt": "2026-05-01T00:00:00.000Z",
    "updatedAt": "2026-05-01T00:00:00.000Z",
    "totalTokens": 125000,
    "totalMessages": 5432
  }
}
```

#### Update Agent
```
PATCH /api/agents/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Name", // optional
  "status": "inactive", // optional: pending, active, inactive
  "config": {...}, // optional
  "whatsappNumber": "+6281234567890" // optional
}

Response:
{
  "success": true,
  "agent": {
    "id": "uuid",
    "name": "New Name",
    "type": "whatsapp-cs",
    "status": "inactive",
    "config": {...},
    "whatsappNumber": "+6281234567890",
    "updatedAt": "2026-05-07T04:35:00.000Z"
  }
}
```

#### Delete Agent
```
DELETE /api/agents/:id
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Agent deleted successfully"
}
```

### Usage Tracking

#### Get Usage Stats
```
GET /api/usage
Authorization: Bearer <token>

Response:
{
  "success": true,
  "usage": {
    "plan": "starter",
    "tokensLimit": 500000,
    "tokensUsed": 125000,
    "tokensRemaining": 375000,
    "today": {
      "tokens": 12500,
      "messages": 234
    },
    "thisMonth": {
      "tokens": 125000,
      "messages": 5432
    },
    "byAgent": [
      {
        "agentId": "uuid",
        "agentName": "Customer Service Bot",
        "tokensUsed": 125000,
        "messageCount": 5432
      }
    ],
    "daily": [
      {
        "date": "2026-05-07",
        "tokensUsed": 12500,
        "messageCount": 234
      }
    ]
  }
}
```

#### Log Usage (Called by Agents)
```
POST /api/usage
Authorization: Bearer <token>
Content-Type: application/json

{
  "agentId": "uuid",
  "tokensUsed": 150,
  "messageCount": 1 // optional, default: 1
}

Response:
{
  "success": true,
  "message": "Usage logged successfully",
  "tokensRemaining": 374850
}
```

## Error Responses

Semua error mengikuti format:

```json
{
  "error": "Error message here"
}
```

HTTP Status Codes:
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (limit exceeded)
- `404` - Not Found
- `500` - Internal Server Error

## Plans & Limits

### Starter (Rp 100K/mo)
- 1 agent
- 500K tokens/bulan
- WhatsApp CS support

### Pro (Rp 500K/mo)
- 10 agents
- 5M tokens/bulan
- WhatsApp CS + Sales Data Analysis
- Priority support

## Deployment

### Vercel (Frontend + API)

```bash
# Push ke GitHub
git add .
git commit -m "Backend API complete"
git push

# Deploy otomatis via Vercel
# Set environment variables di Vercel dashboard:
# - DATABASE_URL
# - JWT_SECRET
# - NODE_ENV=production
```

### Railway (Database)

1. Buat project baru di Railway
2. Add PostgreSQL service
3. Copy DATABASE_URL
4. Run schema: `psql $DATABASE_URL < database/schema.sql`

## Development Notes

- JWT token expires dalam 7 hari
- Password minimum 8 karakter
- Token usage tracked per message
- Agent API keys format: `ak_<uuid>`
- Semua timestamps dalam UTC

## Next Steps

- [ ] Payment integration (Midtrans/Xendit)
- [ ] WhatsApp integration
- [ ] Admin dashboard
- [ ] Email notifications
- [ ] Rate limiting
- [ ] API documentation (Swagger)
