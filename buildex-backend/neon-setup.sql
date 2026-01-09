-- NeonDB Setup Script for Buildex Application

-- This script creates all necessary tables for the Buildex application
-- Execute this in your NeonDB console to set up the database

-- Note: In PostgreSQL, SERIAL automatically creates sequences for auto-incrementing IDs
-- The tables will be created with proper relationships and constraints

-- 1. Create Builders table
CREATE TABLE IF NOT EXISTS builders (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT,
    gst_number VARCHAR(50),
    verification_status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Properties table
CREATE TABLE IF NOT EXISTS properties (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    property_type VARCHAR(20),
    purpose VARCHAR(10),
    price DECIMAL(15, 2),
    rent_amount DECIMAL(15, 2),
    deposit_amount DECIMAL(15, 2),
    area_sqft INTEGER,
    possession_year INTEGER,
    construction_status VARCHAR(30),
    availability_status VARCHAR(20) DEFAULT 'AVAILABLE',
    city VARCHAR(100) NOT NULL,
    area VARCHAR(100) NOT NULL,
    google_map_link TEXT,
    brochure_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    builder_id BIGINT NOT NULL,
    FOREIGN KEY (builder_id) REFERENCES builders(id) ON DELETE CASCADE
);

-- 3. Create Property Amenities table (for the amenities list)
CREATE TABLE IF NOT EXISTS property_amenities (
    id SERIAL PRIMARY KEY,
    property_id BIGINT NOT NULL,
    amenity VARCHAR(100) NOT NULL,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- 4. Create Property Images table (for the imageUrls list)
CREATE TABLE IF NOT EXISTS property_images (
    id SERIAL PRIMARY KEY,
    property_id BIGINT NOT NULL,
    image_url TEXT NOT NULL,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- 5. Create Enquiries table
CREATE TABLE IF NOT EXISTS enquiries (
    id SERIAL PRIMARY KEY,
    property_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT,
    enquiry_type VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- 6. Create Rent Requests table
CREATE TABLE IF NOT EXISTS rent_requests (
    id SERIAL PRIMARY KEY,
    property_id BIGINT NOT NULL,
    applicant_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    monthly_rent DECIMAL(15, 2),
    deposit DECIMAL(15, 2),
    status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_properties_builder_id ON properties(builder_id);
CREATE INDEX IF NOT EXISTS idx_properties_purpose ON properties(purpose);
CREATE INDEX IF NOT EXISTS idx_properties_property_type ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_area ON properties(area);
CREATE INDEX IF NOT EXISTS idx_properties_availability_status ON properties(availability_status);
CREATE INDEX IF NOT EXISTS idx_enquiries_property_id ON enquiries(property_id);
CREATE INDEX IF NOT EXISTS idx_rent_requests_property_id ON rent_requests(property_id);
