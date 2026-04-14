/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any */
const initSqlJs = require("sql.js/dist/sql-asm.js");
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const DB_PATH = join(process.cwd(), "signups.db");

let db: any = null;
let initPromise: Promise<void> | null = null;

async function getDb() {
  if (db) return db;
  if (!initPromise) {
    initPromise = (async () => {
      const SQL = await initSqlJs();
      if (existsSync(DB_PATH)) {
        const buffer = readFileSync(DB_PATH);
        db = new SQL.Database(buffer);
      } else {
        db = new SQL.Database();
      }
      db.run(`
        CREATE TABLE IF NOT EXISTS signups (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          shift_id TEXT NOT NULL,
          date TEXT NOT NULL,
          created_at TEXT NOT NULL DEFAULT (datetime('now'))
        )
      `);
      db.run(`
        CREATE TABLE IF NOT EXISTS weekly_signups (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          shift_id TEXT NOT NULL,
          week_start TEXT NOT NULL,
          created_at TEXT NOT NULL DEFAULT (datetime('now'))
        )
      `);
      save();
    })();
  }
  await initPromise;
  return db;
}

function save() {
  if (!db) return;
  const data = db.export();
  writeFileSync(DB_PATH, Buffer.from(data));
}

export async function getSignups(weekStart: string, weekEnd: string) {
  const db = await getDb();
  const stmt = db.prepare(
    "SELECT * FROM signups WHERE date >= ? AND date < ? ORDER BY date, shift_id"
  );
  stmt.bind([weekStart, weekEnd]);
  const results: Record<string, unknown>[] = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}

export async function createSignup(id: string, name: string, shift_id: string, date: string) {
  const db = await getDb();

  // Check if this person already signed up for this shift on this date
  const dup = db.prepare(
    "SELECT id FROM signups WHERE LOWER(name) = LOWER(?) AND shift_id = ? AND date = ? LIMIT 1"
  );
  dup.bind([name, shift_id, date]);
  const hasDup = dup.step();
  dup.free();

  if (hasDup) {
    throw new Error("DUPLICATE");
  }

  db.run(
    "INSERT INTO signups (id, name, shift_id, date) VALUES (?, ?, ?, ?)",
    [id, name, shift_id, date]
  );
  save();

  const stmt = db.prepare("SELECT * FROM signups WHERE id = ?");
  stmt.bind([id]);
  stmt.step();
  const result = stmt.getAsObject();
  stmt.free();
  return result;
}

export async function deleteSignup(id: string) {
  const db = await getDb();
  db.run("DELETE FROM signups WHERE id = ?", [id]);
  save();
}

// --- Weekly signups ---

export async function getWeeklySignups(weekStart: string) {
  const db = await getDb();
  const stmt = db.prepare(
    "SELECT * FROM weekly_signups WHERE week_start = ? ORDER BY shift_id"
  );
  stmt.bind([weekStart]);
  const results: Record<string, unknown>[] = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}

export async function createWeeklySignup(id: string, name: string, shift_id: string, week_start: string) {
  const db = await getDb();

  const dup = db.prepare(
    "SELECT id FROM weekly_signups WHERE LOWER(name) = LOWER(?) AND shift_id = ? AND week_start = ? LIMIT 1"
  );
  dup.bind([name, shift_id, week_start]);
  const hasDup = dup.step();
  dup.free();

  if (hasDup) {
    throw new Error("DUPLICATE");
  }

  db.run(
    "INSERT INTO weekly_signups (id, name, shift_id, week_start) VALUES (?, ?, ?, ?)",
    [id, name, shift_id, week_start]
  );
  save();

  const stmt = db.prepare("SELECT * FROM weekly_signups WHERE id = ?");
  stmt.bind([id]);
  stmt.step();
  const result = stmt.getAsObject();
  stmt.free();
  return result;
}

export async function deleteWeeklySignup(id: string) {
  const db = await getDb();
  db.run("DELETE FROM weekly_signups WHERE id = ?", [id]);
  save();
}

export async function updateSignup(id: string, fields: { name?: string; shift_id?: string; date?: string }) {
  const db = await getDb();

  if (fields.name && fields.shift_id && fields.date) {
    const dup = db.prepare(
      "SELECT id FROM signups WHERE id != ? AND LOWER(name) = LOWER(?) AND shift_id = ? AND date = ? LIMIT 1"
    );
    dup.bind([id, fields.name, fields.shift_id, fields.date]);
    const hasDup = dup.step();
    dup.free();

    if (hasDup) {
      throw new Error("DUPLICATE");
    }
  }

  const sets: string[] = [];
  const values: string[] = [];

  if (fields.name !== undefined) { sets.push("name = ?"); values.push(fields.name); }
  if (fields.shift_id !== undefined) { sets.push("shift_id = ?"); values.push(fields.shift_id); }
  if (fields.date !== undefined) { sets.push("date = ?"); values.push(fields.date); }

  if (sets.length === 0) return;

  values.push(id);
  db.run(`UPDATE signups SET ${sets.join(", ")} WHERE id = ?`, values);
  save();
}
