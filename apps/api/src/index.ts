import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { DEFAULT_API_PORT } from '@agent-rpg/config';
import { setupRoutes } from './routes';
import { initDatabase } from './db';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger());
app.use('*', prettyJSON());

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Setup routes
setupRoutes(app);

// Initialize database
await initDatabase();

const port = parseInt(process.env.PORT || DEFAULT_API_PORT.toString(), 10);

console.log(`🚀 Agent RPG API starting on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});