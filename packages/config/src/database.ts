export const DATABASE_CONFIG = {
  path: process.env.DB_PATH || './data/agent-rpg.db',
  migrations: './migrations',
  backup: {
    enabled: true,
    interval: 24 * 60 * 60 * 1000, // 24 hours
    maxBackups: 7,
  },
} as const;

export const SCHEMA_VERSION = '1.0.0';