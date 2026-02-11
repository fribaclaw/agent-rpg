import Database from 'better-sqlite3';
import { DATABASE_CONFIG } from '@agent-rpg/config';

let db: Database.Database | null = null;

export async function initDatabase(): Promise<Database.Database> {
  if (db) return db;

  console.log('🗃️  Initializing database...');
  
  // Ensure data directory exists
  const fs = await import('fs/promises');
  const path = await import('path');
  
  const dataDir = path.dirname(DATABASE_CONFIG.path);
  await fs.mkdir(dataDir, { recursive: true });

  // Create database connection
  db = new Database(DATABASE_CONFIG.path);
  db.pragma('journal_mode = WAL');

  // Run migrations
  await runMigrations(db);

  console.log('✅ Database initialized');
  return db;
}

export function getDatabase(): Database.Database {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

async function runMigrations(database: Database.Database): Promise<void> {
  // TODO: Implement proper migration system
  // For now, create basic tables
  
  database.exec(`
    CREATE TABLE IF NOT EXISTS agents (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      soul TEXT NOT NULL,
      tools TEXT DEFAULT '[]',
      channels TEXT DEFAULT '[]',
      memory TEXT DEFAULT '{}',
      status TEXT DEFAULT 'inactive',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS workspace_files (
      filename TEXT PRIMARY KEY,
      content TEXT NOT NULL,
      last_modified DATETIME DEFAULT CURRENT_TIMESTAMP,
      size INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS gateway_status (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      status TEXT NOT NULL,
      version TEXT,
      uptime INTEGER,
      endpoints TEXT DEFAULT '[]',
      last_check DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}