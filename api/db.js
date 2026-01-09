import { neon, neonConfig } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

// Configure Neon to allow browser usage without warnings (for prototyping)
neonConfig.fetchConnectionCache = true;
// Suppress warning in dev/test for browser usage
try {
  neonConfig.disableWarningInBrowsers = true;
} catch (e) {
  // Ignore if property doesn't exist in this version
}

// Initialize NeonDB connection
let sql;
try {
  const databaseUrl = import.meta.env?.VITE_DATABASE_URL || process.env?.VITE_DATABASE_URL;

  if (databaseUrl) {
    const cleanUrl = databaseUrl.replace(/^['"]|['"]$/g, '');
    sql = neon(cleanUrl);
    console.log('Database connected to NeonDB successfully');
  } else {
    throw new Error('VITE_DATABASE_URL not found in environment variables');
  }
} catch (error) {
  console.error('Failed to initialize database connection:', error);
  throw error;
}

export default sql;

// Initialize database tables
export async function initializeDatabase() {
  try {
    // Check if tables already exist by querying users table
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      )
    `;

    if (tableCheck[0]?.exists) {
      console.log('Database tables already exist');
      return true;
    }

    // If tables don't exist, create them
    // Users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(100),
        phone VARCHAR(15),
        role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'builder', 'admin')),
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'pending_verification', 'banned')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Properties table
    await sql`
      CREATE TABLE IF NOT EXISTS properties (
        id SERIAL PRIMARY KEY,
        builder_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(200) NOT NULL,
        type VARCHAR(50) NOT NULL,
        purpose VARCHAR(20) NOT NULL CHECK (purpose IN ('Buy', 'Rent')),
        price VARCHAR(50),
        rent VARCHAR(50),
        area VARCHAR(50),
        city VARCHAR(100),
        locality VARCHAR(100),
        possession VARCHAR(50),
        construction_status VARCHAR(50),
        amenities TEXT[],
        images TEXT[],
        brochure_url TEXT,
        google_map_link TEXT,
        virtual_tour_link TEXT,
        availability VARCHAR(20) DEFAULT 'available' CHECK (availability IN ('available', 'booked', 'sold')),
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'blocked')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Enquiries table
    await sql`
      CREATE TABLE IF NOT EXISTS enquiries (
        id SERIAL PRIMARY KEY,
        property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        builder_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        full_name VARCHAR(100),
        email VARCHAR(100),
        phone VARCHAR(15),
        message TEXT,
        enquiry_type VARCHAR(20) DEFAULT 'buy' CHECK (enquiry_type IN ('buy', 'rent')),
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Rent requests table
    await sql`
      CREATE TABLE IF NOT EXISTS rent_requests (
        id SERIAL PRIMARY KEY,
        property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        builder_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        move_in_date DATE,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'active', 'completed')),
        rent_amount VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Complaints table
    await sql`
      CREATE TABLE IF NOT EXISTS complaints (
        id SERIAL PRIMARY KEY,
        property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        issue TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Wishlist table
    await sql`
      CREATE TABLE IF NOT EXISTS wishlist (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, property_id)
      )
    `;

    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Helper function to hash passwords
export async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// Helper function to compare passwords
export async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}