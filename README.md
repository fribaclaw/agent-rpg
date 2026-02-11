# Agent RPG v2 🎮

A professional 3D RPG dashboard for configuring and managing OpenClaw agents with immersive gameplay elements.

## 🏗️ Monorepo Structure

This project uses Turborepo for efficient monorepo management with TypeScript and PNPM workspaces.

```
agent-rpg/
├── apps/
│   ├── web/          # Next.js frontend dashboard
│   └── api/          # Hono.js backend API
├── packages/
│   ├── ui/           # Shared React component library
│   ├── config/       # Shared configuration utilities
│   └── types/        # TypeScript type definitions & Zod schemas
└── tools/            # Development tools and scripts
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PNPM 8+
- OpenClaw Gateway running

### Installation

```bash
# Install dependencies
pnpm install

# Start development servers
pnpm dev
```

This will start:
- **Web dashboard**: http://localhost:3000
- **API server**: http://localhost:3001
- **WebSocket server**: http://localhost:3002

## 📦 Package Overview

### Apps

#### `@agent-rpg/web`
Next.js 14 frontend with:
- 3D immersive RPG interface using Three.js
- Real-time agent management
- WebSocket integration for live updates
- Tailwind CSS + Radix UI components

#### `@agent-rpg/api`
Hono.js backend with:
- RESTful API for agent CRUD operations
- WebSocket server for real-time updates
- SQLite database with Drizzle ORM
- OpenClaw Gateway integration

### Packages

#### `@agent-rpg/types`
TypeScript definitions with Zod validation:
- Agent configuration schemas
- API request/response types
- WebSocket message types
- OpenClaw integration types

#### `@agent-rpg/ui`
Shared React component library:
- Radix UI primitives
- Custom RPG-themed components
- Tailwind CSS styling
- TypeScript + Rollup build

#### `@agent-rpg/config`
Shared configuration utilities:
- Database configuration
- OpenClaw Gateway settings
- WebSocket configuration
- Environment-specific settings

## 🛠️ Development

### Available Scripts

```bash
# Development
pnpm dev          # Start all dev servers
pnpm dev --filter=web   # Start only web app
pnpm dev --filter=api   # Start only API

# Building
pnpm build        # Build all packages
pnpm type-check   # Type check all packages
pnpm lint         # Lint all packages

# Database
pnpm db:generate  # Generate database migrations
pnpm db:migrate   # Run database migrations
pnpm db:studio    # Open database GUI
```

### Adding Dependencies

```bash
# Add to specific package
pnpm add <package> --filter=@agent-rpg/web
pnpm add -D <package> --filter=@agent-rpg/api

# Add to workspace root
pnpm add -w <package>
```

## 🎮 Features

### 3D RPG Interface
- Immersive 3D environment for agent management
- Character representation of agents
- Interactive world elements
- Smooth animations and transitions

### Real-time Agent Management
- Create, configure, and deploy agents
- Live status monitoring
- Interactive agent profiles
- Performance analytics

### OpenClaw Integration
- Direct gateway communication
- Agent deployment and termination
- Workspace file management
- Command execution interface

### Professional Dashboard
- Clean, modern UI design
- Responsive layout
- Dark/light theme support
- Accessibility compliant

## 🔧 Configuration

### Environment Variables

Create `.env.local` files in each app:

#### `apps/web/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3002
```

#### `apps/api/.env.local`
```env
PORT=3001
WS_PORT=3002
DB_PATH=./data/agent-rpg.db
OPENCLAW_GATEWAY_URL=http://localhost:8080
NODE_ENV=development
```

## 🏭 Production

### Building for Production

```bash
pnpm build
```

### Deployment

The monorepo is designed for flexible deployment:
- **Web**: Deploy to Vercel, Netlify, or any static host
- **API**: Deploy to any Node.js hosting service
- **Database**: SQLite file can be hosted anywhere

## 🤝 Contributing

1. Create a feature branch from `v2-foundation`
2. Make your changes in the appropriate package
3. Ensure tests pass: `pnpm test`
4. Update documentation as needed
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

- **Issues**: Create GitHub issues for bugs and feature requests
- **Discussions**: Use GitHub Discussions for questions
- **Documentation**: Check the `/docs` folder for detailed guides

---

**Happy agent managing! 🎮🤖**