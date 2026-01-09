-- Buildex Database Schema

-- Create Builders table
CREATE TABLE builders (
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

-- Create Properties table
CREATE TABLE properties (
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

-- Create Property Amenities table (for the amenities list)
CREATE TABLE property_amenities (
    id SERIAL PRIMARY KEY,
    property_id BIGINT NOT NULL,
    amenity VARCHAR(100) NOT NULL,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- Create Property Images table (for the imageUrls list)
CREATE TABLE property_images (
    id SERIAL PRIMARY KEY,
    property_id BIGINT NOT NULL,
    image_url TEXT NOT NULL,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- Create Enquiries table
CREATE TABLE enquiries (
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

-- Create Rent Requests table
CREATE TABLE rent_requests (
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

-- Insert sample data for testing
INSERT INTO builders (company_name, owner_name, email, phone, address, gst_number, verification_status) VALUES
('ABC Construction', 'John Doe', 'john@abcconstruction.com', '9876543210', '123 Main Street, Mumbai', '12ABCDE1234F1Z5', 'VERIFIED'),
('XYZ Builders', 'Jane Smith', 'jane@xyzbuilders.com', '9123456789', '456 Park Avenue, Delhi', '12XYZAB5678G2Z6', 'PENDING');

-- Insert sample properties
INSERT INTO properties (title, description, property_type, purpose, rent_amount, area_sqft, city, area, google_map_link, construction_status, availability_status, builder_id) VALUES
('Luxury 3BHK Apartment', 'Beautiful 3BHK apartment with modern amenities', 'RESIDENTIAL', 'RENT', 25000.00, 1500, 'Mumbai', 'Bandra', 'https://maps.google.com/...', 'READY', 'AVAILABLE', 1),
('Commercial Office Space', 'Spacious office space in prime location', 'COMMERCIAL', 'RENT', 50000.00, 2000, 'Delhi', 'Connaught Place', 'https://maps.google.com/...', 'READY', 'AVAILABLE', 2),
('Premium Villa', 'Luxury villa with garden and parking', 'RESIDENTIAL', 'BUY', 15000000.00, 3000, 'Bangalore', 'Whitefield', 'https://maps.google.com/...', 'READY', 'AVAILABLE', 1);

-- Insert sample amenities
INSERT INTO property_amenities (property_id, amenity) VALUES
(1, 'Swimming Pool'),
(1, 'Gym'),
(1, 'Parking'),
(1, 'Security'),
(2, 'Lift'),
(2, 'Parking'),
(3, 'Garden'),
(3, 'Parking'),
(3, 'Security'),
(3, 'Swimming Pool');

-- Insert sample images
INSERT INTO property_images (property_id, image_url) VALUES
(1, '/images/property1-1.jpg'),
(1, '/images/property1-2.jpg'),
(1, '/images/property1-3.jpg'),
(2, '/images/property2-1.jpg'),
(2, '/images/property2-2.jpg'),
(3, '/images/property3-1.jpg'),
(3, '/images/property3-2.jpg'),
(3, '/images/property3-3.jpg'),
(3, '/images/property3-4.jpg');

-- Insert sample enquiries
INSERT INTO enquiries (property_id, name, phone, email, message, enquiry_type) VALUES
(1, 'Raj Patel', '9988776655', 'raj@email.com', 'Interested in this property', 'RENT'),
(2, 'Sunita Sharma', '9911223344', 'sunita@email.com', 'Want to know more about office space', 'RENT');

-- Insert sample rent requests
INSERT INTO rent_requests (property_id, applicant_name, phone, email, monthly_rent, deposit, status) VALUES
(1, 'Raj Patel', '9988776655', 'raj@email.com', 25000.00, 75000.00, 'PENDING'),
(2, 'Sunita Sharma', '9911223344', 'sunita@email.com', 50000.00, 100000.00, 'PENDING');