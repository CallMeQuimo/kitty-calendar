import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

let db = null;

export const initDatabase = async () => {
  if (Platform.OS === 'web') {
    console.warn('⚠️ La base de datos no funciona en Web.');
    return;
  }

  try {
    db = await SQLite.openDatabaseAsync('kitty.db');

    await db.execAsync(`
      PRAGMA journal_mode = WAL;

      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY NOT NULL,
        value TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS diary_entries (
        entry_id INTEGER PRIMARY KEY NOT NULL,
        date TEXT UNIQUE NOT NULL,
        mood INTEGER NOT NULL,
        notes TEXT
      );

      CREATE TABLE IF NOT EXISTS tags (
        tag_id INTEGER PRIMARY KEY NOT NULL,
        name TEXT UNIQUE NOT NULL
      );

      CREATE TABLE IF NOT EXISTS diary_entry_tags (
        entry_id INTEGER NOT NULL,
        tag_id INTEGER NOT NULL,
        PRIMARY KEY (entry_id, tag_id),
        FOREIGN KEY (entry_id) REFERENCES diary_entries(entry_id),
        FOREIGN KEY (tag_id) REFERENCES tags(tag_id)
      );

      CREATE TABLE IF NOT EXISTS blocks (
        block_id INTEGER PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        type TEXT NOT NULL,
        estimated_time INTEGER DEFAULT 0, 
        parent_roulette_id INTEGER,
        FOREIGN KEY (parent_roulette_id) REFERENCES blocks(block_id)
      );

      CREATE TABLE IF NOT EXISTS subtasks (
        subtask_id INTEGER PRIMARY KEY NOT NULL,
        block_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        FOREIGN KEY (block_id) REFERENCES blocks(block_id)
      );

      CREATE TABLE IF NOT EXISTS holidays (
        holiday_id INTEGER PRIMARY KEY NOT NULL,
        date TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        type TEXT 
      );

      CREATE TABLE IF NOT EXISTS calendar_events (
        event_id INTEGER PRIMARY KEY NOT NULL,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        start_datetime TEXT NOT NULL,
        end_datetime TEXT,
        reminder INTEGER DEFAULT 0,
        assigned_block_id INTEGER,
        FOREIGN KEY (assigned_block_id) REFERENCES blocks(block_id)
      );

      CREATE TABLE IF NOT EXISTS block_executions (
        execution_id INTEGER PRIMARY KEY NOT NULL,
        block_id INTEGER NOT NULL,
        start_time TEXT NOT NULL,
        end_time TEXT,
        status TEXT NOT NULL,
        origin_event_id INTEGER,
        FOREIGN KEY (block_id) REFERENCES blocks(block_id),
        FOREIGN KEY (origin_event_id) REFERENCES calendar_events(event_id)
      );

      CREATE TABLE IF NOT EXISTS execution_subtask_status (
        execution_id INTEGER NOT NULL,
        subtask_id INTEGER NOT NULL,
        is_completed INTEGER DEFAULT 0,
        PRIMARY KEY (execution_id, subtask_id),
        FOREIGN KEY (execution_id) REFERENCES block_executions(execution_id),
        FOREIGN KEY (subtask_id) REFERENCES subtasks(subtask_id)
      );
    `);

    console.log('Base de datos inicializada y verificada.');

  } catch (error) {
    console.error('Error al inicializar la BD:', error);
    throw error;
  }
};

export const executeSql = async (sql, params = []) => {
  if (Platform.OS === 'web' || !db) return { rows: [], lastInsertRowId: null };
  const statement = sql.trim();
  if (statement.toUpperCase().startsWith('SELECT')) {
    const rows = await db.getAllAsync(sql, params);
    return { rows: rows };
  } else {
    const result = await db.runAsync(sql, params);
    return result;
  }
};
