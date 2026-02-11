# Agent RPG API 🚀

Backend API server for Agent RPG v2 - provides type-safe API endpoints and real-time updates for the 3D RPG dashboard.

## Features

- **Express.js + TypeScript** - Fast, type-safe backend
- **tRPC** - End-to-end type safety with the frontend
- **WebSocket support** - Real-time updates for config changes
- **OpenClaw Gateway integration** - Direct communication with OpenClaw on port 18789
- **SQLite + Prisma** - Local caching layer for performance
- **Zod validation** - Runtime type checking and validation
- **Production ready** - Proper error handling, logging, and graceful shutdown

## API Endpoints

### REST API (for compatibility)

```
GET    /api/agents           # List all agents
GET    /api/agents/:id       # Get agent details
PUT    /api/agents/:id       # Update agent config
GET    /api/config/:file     # Get workspace file (SOUL.md, etc)
PUT    /api/config/:file     # Update workspace file
GET    /api/status          # OpenClaw gateway status
WS     /api/ws              # Real-time WebSocket updates
```

### tRPC API (recommended)

```
/api/trpc/agents.list        # List all agents
/api/trpc/agents.get         # Get agent details
/api/trpc/agents.update      # Update agent config
/api/trpc/config.get         # Get workspace file
/api/trpc/config.update      # Update workspace file
/api/trpc/status             # Gateway status
```

## Quick Start

```bash
# Install dependencies
npm install

# Setup database
npm run db:generate
npm run db:migrate

# Start development server
npm run dev

# Or build and run production
npm run build
npm start
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Key variables:
- `PORT` - API server port (default: 3001)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:5173)
- `OPENCLAW_GATEWAY_URL` - OpenClaw gateway URL (default: http://localhost:18789)

## Database

Uses SQLite with Prisma for local caching:

```bash
# Generate Prisma client
npm run db:generate

# Push schema changes
npm run db:migrate

# Open Prisma Studio
npm run db:studio
```

## WebSocket Events

The WebSocket connection at `/api/ws` sends these message types:

```typescript
// Agent configuration updated
{
  type: 'agent_updated',
  data: AgentConfig
}

// Workspace file updated
{
  type: 'config_updated', 
  data: { filename: string, content: string }
}

// Gateway status changed
{
  type: 'gateway_status',
  data: GatewayStatus
}

// Error occurred
{
  type: 'error',
  data: { message: string, code?: string }
}
```

## OpenClaw Integration

The API integrates with OpenClaw Gateway on port 18789:

- **Agent management** - CRUD operations sync with OpenClaw
- **Workspace files** - Read/write SOUL.md, MEMORY.md, etc.
- **Real-time sync** - Changes propagate via WebSocket
- **Offline mode** - Gracefully handles gateway unavailability

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │◄──►│   API Server     │◄──►│ OpenClaw Gateway│
│   (React)       │    │  (Express+tRPC)  │    │   (port 18789)  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │   SQLite DB      │
                       │   (Prisma)       │
                       └──────────────────┘
```

## Development

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run type-check` - Type check without building
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Apply database schema changes
- `npm run db:studio` - Open Prisma Studio GUI

## Type Safety

The API provides end-to-end type safety with:

- **Shared types** - `@agent-rpg/types` package
- **tRPC** - Type-safe RPC calls
- **Zod schemas** - Runtime validation
- **Prisma** - Type-safe database queries

Import types in frontend:

```typescript
import type { AppRouter } from '@agent-rpg/api/dist/trpc/router';
import { AgentConfig, WSMessage } from '@agent-rpg/types';
```