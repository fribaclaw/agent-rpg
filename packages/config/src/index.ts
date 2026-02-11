export * from './database';
export * from './openclaw';
export * from './websocket';

// Default configurations
export const DEFAULT_API_PORT = 3001;
export const DEFAULT_WS_PORT = 3002;
export const DEFAULT_DB_PATH = './data/agent-rpg.db';

export const OPENCLAW_CONFIG = {
  gatewayUrl: process.env.OPENCLAW_GATEWAY_URL || 'http://localhost:8080',
  timeout: 30000,
} as const;