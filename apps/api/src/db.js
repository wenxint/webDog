import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import { seedDatabase, SEED_VERSION } from './seed.js';

const currentDir = path.dirname(fileURLToPath(import.meta.url));

/** 数据目录与数据库文件（apps/api/data/pet.db） */
export const DATA_DIR = path.resolve(currentDir, '..', 'data');
export const DB_FILE = path.join(DATA_DIR, 'pet.db');

// 首次启动时数据目录可能还不存在
fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new DatabaseSync(DB_FILE);

// WAL 模式让读写更顺畅；本地单机 MVP 足够用
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

function createSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS meta (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS categories (
      id         INTEGER PRIMARY KEY,
      name       TEXT NOT NULL,
      slug       TEXT NOT NULL UNIQUE,
      icon       TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS posts (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      title         TEXT NOT NULL,
      content       TEXT NOT NULL,
      cover         TEXT NOT NULL DEFAULT '',
      category      TEXT NOT NULL,
      author_name   TEXT NOT NULL,
      author_avatar TEXT NOT NULL DEFAULT '',
      likes         INTEGER NOT NULL DEFAULT 0,
      tags          TEXT NOT NULL DEFAULT '[]',
      created_at    TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_posts_category ON posts (category);
    CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts (created_at DESC);

    CREATE TABLE IF NOT EXISTS comments (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id     INTEGER NOT NULL,
      author_name TEXT NOT NULL,
      content     TEXT NOT NULL,
      created_at  TEXT NOT NULL,
      FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments (post_id);

    CREATE TABLE IF NOT EXISTS articles (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      title      TEXT NOT NULL,
      summary    TEXT NOT NULL,
      content    TEXT NOT NULL,
      cover      TEXT NOT NULL DEFAULT '',
      category   TEXT NOT NULL,
      read_count INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_articles_category ON articles (category);
  `);
}

createSchema();

/** 首次启动写入种子数据；已有数据时不会重复插入（由 meta.seed_version 控制） */
const seedResult = seedDatabase(db);
export const seedVersion = SEED_VERSION;

/** 当前数据量，用于启动日志与健康检查 */
export function getStats() {
  const one = (sql) => db.prepare(sql).get().n;
  return {
    categories: one('SELECT COUNT(*) AS n FROM categories'),
    posts: one('SELECT COUNT(*) AS n FROM posts'),
    comments: one('SELECT COUNT(*) AS n FROM comments'),
    articles: one('SELECT COUNT(*) AS n FROM articles'),
  };
}

export { seedResult };
export default db;
