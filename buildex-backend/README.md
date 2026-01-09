# Buildex Backend - Verified New Schemes & Smart Rental Management Platform

## Overview
This is a Spring Boot backend for the Buildex real estate platform, focusing on builder and property management features. The backend is designed to work seamlessly with the React frontend.

**IMPORTANT**: This backend focuses exclusively on Builder and Property features as per the original requirements:
- ✅ Builder module (registration, management)
- ✅ Property module (listing, management)
- ✅ Property Search & Filter APIs
- ✅ Enquiry module
- ✅ Rent Request module
- ✅ File upload functionality

**NOT included** (as per original requirements):
- ❌ User module
- ❌ Admin module
- ❌ Authentication/JWT
- ❌ Payments
- ❌ Scheduler
- ❌ SMS/Email

## Features Implemented

### 1. Builder Module
- Register builders
- Get builder by ID
- Get all builders
- Update builder details
- Change verification status

### 2. Property Module
- Add properties for builders
- Get all properties
- Get property by ID
- Get properties by builder ID
- Update property details
- Change property availability status
- Delete properties
- Upload property images

### 3. Property Search & Filter APIs
- Filter by purpose (BUY/RENT)
- Filter by property type (RESIDENTIAL/COMMERCIAL)
- Filter by city and area
- Filter by availability status

### 4. Enquiry Module
- Create property enquiries
- Get enquiries by property ID
- Get enquiries by builder ID

### 5. Rent Request Module
- Create rent requests
- Get rent requests by builder ID
- Approve rent requests
- Reject rent requests

### 6. File Upload Module
- Upload property images from device
- Store images on server with unique names
- Return image URLs for frontend use

## Technology Stack
- Java 17+
- Spring Boot 3.2.0
- Spring Web
- Spring Data JPA (Hibernate)
- PostgreSQL
- Lombok
- Jakarta Validation

## Database Schema

The database schema is defined in `schema.sql` file. The main tables are:

- `builders` - Stores builder information
- `properties` - Stores property information linked to builders
- `property_amenities` - Stores amenities for each property
- `property_images` - Stores image URLs for each property
- `enquiries` - Stores property enquiries
- `rent_requests` - Stores rent requests

## API Endpoints

### Builder APIs
- `POST /api/builders` - Register builder
- `GET /api/builders/{id}` - Get builder by ID
- `GET /api/builders` - Get all builders
- `PUT /api/builders/{id}` - Update builder details
- `PATCH /api/builders/{id}/verify` - Change verification status

### Property APIs
- `POST /api/properties/builder/{builderId}` - Create property for builder
- `GET /api/properties` - Get all properties
- `GET /api/properties/{propertyId}` - Get property by ID
- `GET /api/properties/builder/{builderId}` - Get properties by builder ID
- `PUT /api/properties/{propertyId}` - Update property
- `PATCH /api/properties/{propertyId}/availability` - Update availability status
- `DELETE /api/properties/{propertyId}` - Delete property
- `GET /api/properties/search` - Search properties with filters
- `POST /api/properties/upload-images` - Upload property images from device

### File Upload APIs
- `POST /api/properties/upload-images` - Upload multiple images and get URLs

### Enquiry APIs
- `POST /api/enquiries` - Create enquiry
- `GET /api/enquiries/property/{propertyId}` - Get enquiries by property ID
- `GET /api/enquiries/builder/{builderId}` - Get enquiries by builder ID

### Rent Request APIs
- `POST /api/rent-requests` - Create rent request
- `GET /api/rent-requests/builder/{builderId}` - Get rent requests by builder ID
- `PATCH /api/rent-requests/{id}/approve` - Approve rent request
- `PATCH /api/rent-requests/{id}/reject` - Reject rent request

## Database Configuration
The application is configured to work with PostgreSQL (Neon compatible) using the following properties:
- `spring.datasource.url` - Database URL (defaults to jdbc:postgresql://localhost:5432/buildex)
- `spring.datasource.username` - Database username (defaults to postgres)
- `spring.datasource.password` - Database password (defaults to postgres)

## How to Run

### Prerequisites
1. Java 17+
2. Maven 3.6+
3. PostgreSQL database (or NeonDB)

### Steps

1. **Set up the database**
   - Install PostgreSQL locally or use NeonDB
   - Execute the SQL schema from `schema.sql` to create tables
   - Or use Hibernate's `ddl-auto=update` to automatically create tables

2. **Configure database connection**
   - Update the `application.properties` file with your database credentials
   - Or set environment variables: `DATABASE_URL`, `DB_USERNAME`, `DB_PASSWORD`

3. **Build and run the backend**
   ```bash
   cd buildex-backend
   mvn spring-boot:run
   ```
   The backend will start on port 8081

4. **Run the frontend separately**
   ```bash
   cd ..  # Go to the main project directory
   npm install  # Install dependencies if not already installed
   npm run dev  # Start the frontend
   ```
   The frontend will start on port 5173

## Environment Variables
- `DATABASE_URL` - Database connection URL (optional, defaults to local PostgreSQL)
- `DB_USERNAME` - Database username (optional, defaults to postgres)
- `DB_PASSWORD` - Database password (optional, defaults to postgres)

## Entity Relationships
- One Builder can have many Properties
- One Property can have many Enquiries
- One Property can have many Rent Requests
- Properties have separate tables for amenities and images (one-to-many relationships)

## Error Handling
The application includes global exception handling with proper HTTP status codes and error messages.

## Sample Requests

```json
// Register a new builder
POST /api/builders
{
  "companyName": "ABC Construction",
  "ownerName": "John Doe",
  "email": "john@abcconstruction.com",
  "phone": "1234567890",
  "address": "123 Main St, City, State",
  "gstNumber": "12ABCDE1234F1Z5"
}
```

```json
// Add a property for a builder
POST /api/properties/builder/1
{
  "title": "Luxury Apartment",
  "description": "Beautiful 3BHK apartment with modern amenities",
  "propertyType": "RESIDENTIAL",
  "purpose": "RENT",
  "rentAmount": 25000,
  "areaSqft": 1500,
  "amenities": ["Swimming Pool", "Gym", "Parking"],
  "city": "Mumbai",
  "area": "Bandra",
  "availabilityStatus": "AVAILABLE"
}
```

```json
// Submit an enquiry
POST /api/enquiries
{
  "propertyId": 1,
  "name": "Raj Patel",
  "phone": "9988776655",
  "email": "raj@email.com",
  "message": "Interested in this property",
  "enquiryType": "RENT"
}
```

```json
// Upload property images
POST /api/properties/upload-images
Content-Type: multipart/form-data

// Send multiple image files as 'files' parameter
// Response: ["/uploads/uuid1.jpg", "/uploads/uuid2.png", ...]
```

## Integration with Frontend
The backend is designed to work with the React frontend at http://localhost:5173. The frontend makes API calls to the backend at http://localhost:8081. Make sure both applications are running simultaneously for full functionality.

## The "Buildex – Verified New Schemes & Smart Rental Management Platform" Backend is Complete
The backend uses Spring Boot with RESTful APIs and JPA for ORM. The system follows layered architecture and supports builder-centric property management with enquiry and rent request workflows.