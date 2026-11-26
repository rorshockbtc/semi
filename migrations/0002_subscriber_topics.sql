CREATE TABLE IF NOT EXISTS subscriber_topics (
  email TEXT NOT NULL,
  topic TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (email, topic)
);
