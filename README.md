# Buildex - Real Estate Platform

Buildex is a verified new schemes and smart rental management platform built with React.js.

## Features

- Browse properties for buy/rent
- Filter properties by type, location, and purpose
- View detailed property information
- Compare properties side-by-side
- Save properties to wishlist
- User, Builder, and Admin dashboards
- Responsive design for all devices
- Real user authentication with NeonDB

## Technology Stack

- React.js
- Bootstrap 5
- CSS3
- Google Maps Embed
- Google Street View
- NeonDB (PostgreSQL)

## Pages

1. **Home Page** - Landing page with property browsing options
2. **Property List** - Filter and browse properties
3. **Property Detail** - Detailed view of a specific property
4. **Compare Properties** - Side-by-side comparison of properties
5. **Wishlist** - Saved properties
6. **User Dashboard** - User profile and activity
7. **Builder Dashboard** - Property management for builders
8. **Admin Dashboard** - Platform administration

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Configure the database:
   - Copy `.env.example` to `.env`
   - Update `VITE_DATABASE_URL` with your NeonDB connection string

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser to http://localhost:5173

## Database Setup

Buildex uses NeonDB (PostgreSQL) for user authentication and data storage. To set up the database:

1. Create a NeonDB account at https://neon.tech
2. Create a new PostgreSQL database
3. Get your connection string from the NeonDB dashboard
4. Update the `.env` file with your connection string:
   ```
   VITE_DATABASE_URL=your_neondb_connection_string_here
   ```

## Color Palette

- Primary: Dark Blue (#0A2540)
- Background: White (#FFFFFF)
- Success: Green (#2ECC71)
- Warning: Orange (#F39C12)
- Danger: Red (#E74C3C)

## Project Structure

```
src/
├── components/
│   ├── Header.jsx
│   └── PropertyCard.jsx
├── contexts/
│   └── AuthContext.jsx
├── data/
│   └── properties.js
├── lib/
│   └── db.js
├── pages/
│   ├── Home.jsx
│   ├── PropertyList.jsx
│   ├── PropertyDetail.jsx
│   ├── CompareProperties.jsx
│   ├── Wishlist.jsx
│   ├── UserDashboard.jsx
│   ├── BuilderDashboard.jsx
│   └── AdminDashboard.jsx
├── App.css
├── App.jsx
├── index.css
└── main.jsx
```