import { Hono } from 'hono';
import { agentRoutes } from './agents';
import { configRoutes } from './config';
import { gatewayRoutes } from './gateway';

export function setupRoutes(app: Hono) {
  // Mount routes
  app.route('/api/agents', agentRoutes);
  app.route('/api/config', configRoutes);
  app.route('/api/gateway', gatewayRoutes);

  // Catch-all for API routes
  app.all('/api/*', (c) => {
    return c.json({ error: 'Not found' }, 404);
  });
}