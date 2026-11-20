CREATE TABLE IF NOT EXISTS subscribers (
  email TEXT PRIMARY KEY,
  unsubscribe_token TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
