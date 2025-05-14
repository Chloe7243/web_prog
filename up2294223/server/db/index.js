import sqlite3 from "sqlite3";
import { resolve } from "path";

const dbPath = resolve(import.meta.dirname, "data.db");

function onConnect(err) {
  if (err) {
    return;
  }
}

const sql = sqlite3.verbose();
const db = new sql.Database(
  dbPath,
  [sql.OPEN_READWRITE, sql.OPEN_CREATE],
  onConnect
);

function initDb() {
  const createTables = `
  CREATE TABLE IF NOT EXISTS races (
    race_id INTEGER PRIMARY KEY AUTOINCREMENT,
    organizer_id INTEGER NOT NULL,
    race_name TEXT NOT NULL,
    status TEXT CHECK (status IN ('ongoing', 'ended')) DEFAULT 'ongoing',
    race_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS race_runners (
    race_id INTEGER NOT NULL,
    runner_id TEXT NOT NULL,
    PRIMARY KEY (race_id, runner_id),
    FOREIGN KEY (race_id) REFERENCES races (race_id) ON DELETE CASCADE
  );
  
 CREATE TABLE IF NOT EXISTS race_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  race_id INTEGER NOT NULL,
  timekeeper_id TEXT NOT NULL,
  position INTEGER NOT NULL,
  time TEXT NOT NULL,
  FOREIGN KEY (race_id) REFERENCES races (race_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS final_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  race_id INTEGER NOT NULL,
  runner_id TEXT NOT NULL,
  position INTEGER NOT NULL,
  time TEXT NOT NULL,
  FOREIGN KEY (race_id) REFERENCES races (race_id) ON DELETE CASCADE
);`;

  db.exec(createTables, (err) => {});

  return db;
}

export default initDb;
