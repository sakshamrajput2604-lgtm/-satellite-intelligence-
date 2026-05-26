import Database from 'better-sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';
import fs from 'fs';

// Initialize the database in the root of the project
const dbPath = path.join(process.cwd(), 'users.db');

// We use a singleton pattern for the db connection
let db: Database.Database;

try {
  // If db doesn't exist, this will create it
  db = new Database(dbPath);

  // Initialize the schema
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      clearance_level INTEGER NOT NULL DEFAULT 1,
      role TEXT NOT NULL DEFAULT 'USER'
    );
    
    CREATE TABLE IF NOT EXISTS settings (
      user_id INTEGER PRIMARY KEY,
      collision_threshold REAL NOT NULL DEFAULT 2.5,
      lookahead_hours INTEGER NOT NULL DEFAULT 72,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
    
    CREATE TABLE IF NOT EXISTS alerts (
      id TEXT PRIMARY KEY,
      primaryObject TEXT NOT NULL,
      primaryNorad TEXT NOT NULL,
      secondaryObject TEXT NOT NULL,
      secondaryNorad TEXT NOT NULL,
      missDistance INTEGER NOT NULL,
      timeToImpact INTEGER NOT NULL,
      probability REAL NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed the admin user if they don't exist
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  const adminExists = stmt.get('admin@aerospace.gov') as any;

  if (!adminExists) {
    console.log('Seeding initial admin user...');
    // In production, salt rounds should be 10 or 12
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync('secureorbit2026', salt);

    const insert = db.prepare('INSERT INTO users (email, password, clearance_level, role) VALUES (?, ?, ?, ?)');
    const info = insert.run('admin@aerospace.gov', hashedPassword, 5, 'COMMANDER');
    
    const insertSettings = db.prepare('INSERT INTO settings (user_id) VALUES (?)');
    insertSettings.run(info.lastInsertRowid);
    
    console.log('Admin user and settings created successfully.');
  } else {
    // Make sure existing admin has settings
    const stmtSettings = db.prepare('SELECT * FROM settings WHERE user_id = ?');
    if (!stmtSettings.get(adminExists.id)) {
       db.prepare('INSERT INTO settings (user_id) VALUES (?)').run(adminExists.id);
    }
  }
} catch (err) {
  console.error("Failed to initialize database:", err);
}

export default db!;
