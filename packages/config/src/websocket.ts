export const WEBSOCKET_CONFIG = {
  port: parseInt(process.env.WS_PORT || '3002', 10),
  heartbeat: {
    interval: 30000, // 30 seconds
    timeout: 60000, // 1 minute
  },
  maxConnections: 100,
  cors: {
    origin: process.env.NODE_ENV === 'production' ? 'https://agent-rpg.com' : '*',
    credentials: true,
  },
} as const;

export const WS_EVENTS = {
  CONNECT: 'connection',
  DISCONNECT: 'disconnect',
  AGENT_UPDATED: 'agent_updated',
  CONFIG_UPDATED: 'config_updated',
  GATEWAY_STATUS: 'gateway_status',
  ERROR: 'error',
  HEARTBEAT: 'heartbeat',
} as const;