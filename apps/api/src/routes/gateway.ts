import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { OpenClawCommandSchema } from '@agent-rpg/types';

export const gatewayRoutes = new Hono()
  .get('/status', async (c) => {
    // TODO: Check OpenClaw Gateway status
    return c.json({ 
      status: 'offline',
      lastCheck: new Date().toISOString(),
    });
  })
  .post('/execute', zValidator('json', OpenClawCommandSchema), async (c) => {
    // TODO: Execute OpenClaw command
    const command = c.req.valid('json');
    return c.json({ 
      success: false, 
      error: 'Gateway not connected',
    });
  });