export const OPENCLAW_ENDPOINTS = {
  status: '/status',
  agents: '/agents',
  spawn: '/agents/spawn',
  terminate: '/agents/terminate',
  files: '/workspace/files',
  execute: '/execute',
} as const;

export const OPENCLAW_CONFIG = {
  gatewayUrl: process.env.OPENCLAW_GATEWAY_URL || 'http://localhost:8080',
  timeout: parseInt(process.env.OPENCLAW_TIMEOUT || '30000', 10),
  retries: 3,
  retryDelay: 1000,
} as const;