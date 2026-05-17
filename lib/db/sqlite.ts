import Database from 'better-sqlite3';
import path from 'path';
import { existsSync, mkdirSync } from 'fs';

const DB_PATH = process.env.SQLITE_PATH || path.join(process.cwd(), 'data', 'jobapp.db');

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!db) {
    const dir = path.dirname(DB_PATH);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initSchema(db);
  }
  return db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY,
      company_name TEXT NOT NULL,
      position TEXT,
      platform TEXT,
      custom_platform TEXT,
      job_url TEXT NOT NULL,
      date_applied TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      reason TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_applications_date ON applications(date_applied);
    CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
  `);
}

// Close the database connection (useful for testing or graceful shutdown)
export function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}

export interface ApplicationRow {
  id: number;
  company_name: string;
  position: string | null;
  platform: string | null;
  custom_platform: string | null;
  job_url: string;
  date_applied: string;
  status: string;
  reason: string | null;
  created_at: string;
  updated_at: string;
}

function rowToApp(row: ApplicationRow) {
  return {
    id: row.id,
    companyName: row.company_name,
    position: row.position || undefined,
    platform: (row.platform || undefined) as any,
    customPlatform: row.custom_platform || undefined,
    jobUrl: row.job_url,
    dateApplied: row.date_applied,
    status: row.status as any,
    reason: row.reason || undefined,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function appToRow(app: any) {
  return {
    company_name: app.companyName,
    position: app.position || null,
    platform: app.platform || null,
    custom_platform: app.customPlatform || null,
    job_url: app.jobUrl,
    date_applied: app.dateApplied,
    status: app.status,
    reason: app.reason || null,
    created_at: app.created_at || new Date().toISOString(),
    updated_at: app.updated_at || new Date().toISOString(),
  };
}

export function getAllApplications() {
  const d = getDb();
  const rows = d.prepare('SELECT * FROM applications ORDER BY date_applied DESC').all() as ApplicationRow[];
  return rows.map(rowToApp);
}

export function getApplicationById(id: number) {
  const d = getDb();
  const row = d.prepare('SELECT * FROM applications WHERE id = ?').get(id) as ApplicationRow | undefined;
  return row ? rowToApp(row) : undefined;
}

export function createApplication(app: any) {
  const d = getDb();
  const row = appToRow(app);
  const stmt = d.prepare(`
    INSERT INTO applications (company_name, position, platform, custom_platform, job_url, date_applied, status, reason, created_at, updated_at)
    VALUES (@company_name, @position, @platform, @custom_platform, @job_url, @date_applied, @status, @reason, @created_at, @updated_at)
  `);
  const result = stmt.run(row);
  return getApplicationById(Number(result.lastInsertRowid));
}

export function updateApplication(id: number, updates: any) {
  const d = getDb();
  const existing = getApplicationById(id);
  if (!existing) throw new Error('Application not found');

  const merged = { ...existing, ...updates, id, updated_at: new Date().toISOString() };
  const row = appToRow(merged);

  d.prepare(`
    UPDATE applications SET
      company_name = @company_name,
      position = @position,
      platform = @platform,
      custom_platform = @custom_platform,
      job_url = @job_url,
      date_applied = @date_applied,
      status = @status,
      reason = @reason,
      updated_at = @updated_at
    WHERE id = ?
  `).run(row, id);

  return getApplicationById(id);
}

export function deleteApplication(id: number) {
  const d = getDb();
  d.prepare('DELETE FROM applications WHERE id = ?').run(id);
}

export function bulkUpdateStatus(ids: number[], status: string) {
  const d = getDb();
  const now = new Date().toISOString();
  const stmt = d.prepare('UPDATE applications SET status = ?, updated_at = ? WHERE id = ?');
  const tx = d.transaction(() => {
    for (const id of ids) {
      stmt.run(status, now, id);
    }
  });
  tx();
}

export function bulkDelete(ids: number[]) {
  const d = getDb();
  const stmt = d.prepare('DELETE FROM applications WHERE id = ?');
  const tx = d.transaction(() => {
    for (const id of ids) {
      stmt.run(id);
    }
  });
  tx();
}

export function saveAllApplications(apps: any[]) {
  const d = getDb();
  const tx = d.transaction(() => {
    d.prepare('DELETE FROM applications').run();
    const stmt = d.prepare(`
      INSERT INTO applications (id, company_name, position, platform, custom_platform, job_url, date_applied, status, reason, created_at, updated_at)
      VALUES (@id, @company_name, @position, @platform, @custom_platform, @job_url, @date_applied, @status, @reason, @created_at, @updated_at)
    `);
    for (const app of apps) {
      stmt.run({
        id: app.id,
        ...appToRow(app),
      });
    }
  });
  tx();
}
