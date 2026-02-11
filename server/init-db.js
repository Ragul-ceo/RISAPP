const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

const initializeDatabase = async () => {
  try {
    console.log('Creating database tables...');

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'employee',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created');

    // Create attendance table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS attendance (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        check_in_time TIMESTAMP,
        check_in_lat DECIMAL(10, 8),
        check_in_long DECIMAL(11, 8),
        check_out_time TIMESTAMP,
        check_out_lat DECIMAL(10, 8),
        check_out_long DECIMAL(11, 8),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Attendance table created');

    // Create index on user_id and check_in_time
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_attendance_user_id ON attendance(user_id)
    `);
    
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_attendance_check_in_time ON attendance(check_in_time)
    `);
    console.log('✅ Indexes created');

    // Insert default HR user if not exists
    await pool.query(`
      INSERT INTO users (name, email, password, role)
      VALUES ('HR Admin', 'hr@raminfosys.com', '$2a$10$YourHashedPasswordHere', 'hr')
      ON CONFLICT (email) DO NOTHING
    `);
    console.log('✅ Default users setup complete');

    console.log('\n✅ Database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    process.exit(1);
  }
};

initializeDatabase();
