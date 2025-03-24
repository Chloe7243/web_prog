import sqlite3 from "sqlite3";
import { resolve } from "path";

const dbPath = resolve(import.meta.dirname, "data.db");

function onConnect(err) {
  if (err) {
    console.log(err);
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
  race_name TEXT,
  race_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS race_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  race_id INTEGER NOT NULL,
  runner_id INTEGER NOT NULL,
  finish_time TEXT,
  position INTEGER,
  FOREIGN KEY (race_id) REFERENCES races (race_id) ON DELETE CASCADE
);`;

  db.exec(createTables, (err) => {
    console.log({ err });
  });

  return db;
}

export default initDb;
