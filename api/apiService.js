import sql from './db.js';

// Helper to normalize image data
const normalizeImages = (images) => {
    if (!images) return [];
    if (Array.isArray(images)) return images;

    if (typeof images === 'string') {
        // Check for Postgres array format {img1,img2}
        if (images.startsWith('{') && images.endsWith('}')) {
            // Remove braces
            const content = images.substring(1, images.length - 1);
            if (!content) return [];

            // Complex parsing to handle quotes and possible commas in data
            const result = [];
            let current = '';
            let inQuotes = false;

            for (let i = 0; i < content.length; i++) {
                const char = content[i];
                if (char === '"') {
                    // Check if escaped quote (not standard Postgres text[] but good to be safe)
                    // Postgres typically escapes double quotes by doubling them in CSV output, but strict array output might vary.
                    // We'll toggle flag.
                    inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                    result.push(current);
                    current = '';
                } else {
                    current += char;
                }
            }
            result.push(current);

            // Clean up quotes
            return result.map(s => {
                s = s.trim();
                // If it was quoted, remove quotes and unescape double-quotes
                if (s.startsWith('"') && s.endsWith('"')) {
                    return s.substring(1, s.length - 1).replace(/""/g, '"');
                }
                return s;
            });
        }

        // Fallback for old CSV format matches: url1,url2 (no braces)
        // But be careful not to split Data URLs incorrectly if they don't have braces
        // Data URL format: data:image/png;base64,...
        // If the string starts with 'data:', treat as single image if no clear separator?
        // But old code forced comma sep.
        if (images.includes(',')) {
            // If it contains "data:", splitting by comma is risky unless we know it's CSV of URLs.
            // If it's a single long base64 string, it likely has a comma in the header.
            if (images.trim().startsWith('data:')) {
                // Check if it looks like multiple base64 strings?
                // "data:...,data:..."
                if (images.indexOf('data:', 5) > -1) {
                    // Multiple data urls joined by comma?
                    // Attempt to split only on ",data:"
                    return images.split(/,(?=data:)/).map(i => i.trim());
                }
                return [images]; // Single data URL
            }
            return images.split(',').map(i => i.trim());
        }
        return [images];
    }
    return [];
};

// ============== PROPERTY OPERATIONS ==============

// Get all properties (with optional filters)
export async function getProperties(filters = {}) {
    try {
        let query = sql`
      SELECT p.*, u.full_name as builder_name, u.email as builder_email
      FROM properties p
      LEFT JOIN users u ON p.builder_id = u.id
      WHERE p.status = 'approved'
    `;

        const results = await query;

        // Apply filters in JS (since template literals don't support dynamic WHERE)
        let filtered = results;

        if (filters.type) {
            filtered = filtered.filter(p => p.type === filters.type);
        }
        if (filters.purpose) {
            filtered = filtered.filter(p => p.purpose === filters.purpose);
        }
        if (filters.city) {
            filtered = filtered.filter(p => p.city === filters.city);
        }
        if (filters.locality) {
            filtered = filtered.filter(p => p.locality === filters.locality);
        }

        // Normalize images
        const processed = filtered.map(p => ({
            ...p,
            images: normalizeImages(p.images)
        }));

        return { success: true, data: processed };
    } catch (error) {
        console.error('Error fetching properties:', error);
        return { success: false, error: error.message };
    }
}

// Get properties by builder
export async function getPropertiesByBuilder(builderId) {
    try {
        const results = await sql`
      SELECT * FROM properties 
      WHERE builder_id = ${builderId}
      ORDER BY created_at DESC
    `;

        const processed = results.map(p => ({
            ...p,
            images: normalizeImages(p.images)
        }));

        return { success: true, data: processed };
    } catch (error) {
        console.error('Error fetching builder properties:', error);
        return { success: false, error: error.message };
    }
}

// Create a new property
export async function createProperty(propertyData) {
    try {
        const {
            builderId, name, type, purpose, price, rent, area,
            city, locality, possession, constructionStatus, description,
            bedrooms, bathrooms, amenities, images, availability,
            brochureUrl, googleMapLink, virtualTourLink
        } = propertyData;

        const result = await sql`
      INSERT INTO properties (
        builder_id, name, type, purpose, price, rent, area,
        city, locality, possession, construction_status, description,
        bedrooms, bathrooms, amenities, images, availability, status,
        brochure_url, google_map_link, virtual_tour_link
      )
      VALUES (
        ${builderId}, ${name}, ${type}, ${purpose}, ${price || null}, ${rent || null},
        ${area || null}, ${city || null}, ${locality || null}, ${possession || null}, 
        ${constructionStatus || null}, ${description || null},
        ${bedrooms || null}, ${bathrooms || null},
        ${amenities ? amenities.split(',').map(a => a.trim()) : []},
        ${Array.isArray(images) ? images : (images ? (images.startsWith('data:') ? [images] : images.split(',').map(i => i.trim())) : [])},
        ${availability || 'available'},
        'pending',
        ${brochureUrl || null}, ${googleMapLink || null}, ${virtualTourLink || null}
      )
      RETURNING *
    `;
        return { success: true, data: result[0] };
    } catch (error) {
        console.error('Error creating property:', error);
        return { success: false, error: error.message };
    }
}

// Update property
export async function updateProperty(propertyId, updates) {
    try {
        const result = await sql`
      UPDATE properties
      SET 
        name = COALESCE(${updates.name || null}, name),
        type = COALESCE(${updates.type || null}, type),
        purpose = COALESCE(${updates.purpose || null}, purpose),
        price = COALESCE(${updates.price || null}, price),
        rent = COALESCE(${updates.rent || null}, rent),
        area = COALESCE(${updates.area || null}, area),
        city = COALESCE(${updates.city || null}, city),
        locality = COALESCE(${updates.locality || null}, locality),
        possession = COALESCE(${updates.possession || null}, possession),
        construction_status = COALESCE(${updates.constructionStatus || null}, construction_status),
        description = COALESCE(${updates.description || null}, description),
        bedrooms = COALESCE(${updates.bedrooms || null}, bedrooms),
        bathrooms = COALESCE(${updates.bathrooms || null}, bathrooms),
        availability = COALESCE(${updates.availability || null}, availability),
        amenities = COALESCE(${updates.amenities ? updates.amenities.split(',').map(a => a.trim()) : null}, amenities),
        images = COALESCE(${updates.images ? (Array.isArray(updates.images) ? updates.images : (updates.images.startsWith('data:') ? [updates.images] : updates.images.split(',').map(i => i.trim()))) : null}, images),
        brochure_url = COALESCE(${updates.brochureUrl || null}, brochure_url),
        google_map_link = COALESCE(${updates.googleMapLink || null}, google_map_link),
        virtual_tour_link = COALESCE(${updates.virtualTourLink || null}, virtual_tour_link),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${propertyId}
      RETURNING *
    `;
        return { success: true, data: result[0] };
    } catch (error) {
        console.error('Error updating property:', error);
        return { success: false, error: error.message };
    }
}

// Delete property
export async function deleteProperty(propertyId) {
    try {
        await sql`DELETE FROM properties WHERE id = ${propertyId}`;
        return { success: true };
    } catch (error) {
        console.error('Error deleting property:', error);
        return { success: false, error: error.message };
    }
}

// ============== ENQUIRY OPERATIONS ==============

// Get enquiries for a user
export async function getUserEnquiries(userId) {
    try {
        const results = await sql`
      SELECT e.*, p.name as property_name, p.city, p.locality
      FROM enquiries e
      JOIN properties p ON e.property_id = p.id
      WHERE e.user_id = ${userId}
      ORDER BY e.created_at DESC
    `;
        return { success: true, data: results };
    } catch (error) {
        console.error('Error fetching user enquiries:', error);
        return { success: false, error: error.message };
    }
}

// Get enquiries for a builder
export async function getBuilderEnquiries(builderId) {
    try {
        const results = await sql`
      SELECT e.*, p.name as property_name, u.full_name as customer_name, u.email as customer_email
      FROM enquiries e
      JOIN properties p ON e.property_id = p.id
      LEFT JOIN users u ON e.user_id = u.id
      WHERE e.builder_id = ${builderId}
      ORDER BY e.created_at DESC
    `;
        return { success: true, data: results };
    } catch (error) {
        console.error('Error fetching builder enquiries:', error);
        return { success: false, error: error.message };
    }
}

// Create enquiry
export async function createEnquiry(enquiryData) {
    try {
        const { propertyId, userId, builderId, fullName, email, phone, message, enquiryType } = enquiryData;

        const result = await sql`
      INSERT INTO enquiries (property_id, user_id, builder_id, full_name, email, phone, message, enquiry_type)
      VALUES (${propertyId}, ${userId || null}, ${builderId}, ${fullName}, ${email}, ${phone}, ${message}, ${enquiryType || 'buy'})
      RETURNING *
    `;
        return { success: true, data: result[0] };
    } catch (error) {
        console.error('Error creating enquiry:', error);
        return { success: false, error: error.message };
    }
}

// Update enquiry status
export async function updateEnquiryStatus(enquiryId, status) {
    try {
        const result = await sql`
      UPDATE enquiries
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${enquiryId}
      RETURNING *
    `;
        return { success: true, data: result[0] };
    } catch (error) {
        console.error('Error updating enquiry:', error);
        return { success: false, error: error.message };
    }
}

// Create a new rent request
export async function createRentRequest(requestData) {
    try {
        const { propertyId, userId, builderId, moveInDate, message } = requestData;
        // Connect intent: we should probably store the message too if we had a column, but for now just create the request
        const result = await sql`
      INSERT INTO rent_requests (property_id, user_id, builder_id, move_in_date, status)
      VALUES (${propertyId}, ${userId || null}, ${builderId}, ${moveInDate}, 'pending')
      RETURNING *
    `;
        return { success: true, data: result[0] };
    } catch (error) {
        console.error('Error creating rent request:', error);
        return { success: false, error: error.message };
    }
}

// ============== RENT REQUEST OPERATIONS ==============

export async function getRentRequestsByBuilder(builderId) {
    try {
        const results = await sql`
      SELECT r.*, p.name as property_name, u.full_name as customer_name
      FROM rent_requests r
      JOIN properties p ON r.property_id = p.id
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.builder_id = ${builderId}
      ORDER BY r.created_at DESC
    `;
        return { success: true, data: results };
    } catch (error) {
        console.error('Error fetching rent requests:', error);
        return { success: false, error: error.message };
    }
}

export async function updateRentRequestStatus(requestId, status) {
    try {
        const result = await sql`
      UPDATE rent_requests
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${requestId}
      RETURNING *
    `;
        return { success: true, data: result[0] };
    } catch (error) {
        console.error('Error updating rent request:', error);
        return { success: false, error: error.message };
    }
}

// ============== ADMIN OPERATIONS ==============

// Get all builders (for admin)
export async function getAllBuilders() {
    try {
        const results = await sql`
      SELECT u.*, 
        (SELECT COUNT(*) FROM properties WHERE builder_id = u.id) as property_count
      FROM users u
      WHERE u.role = 'builder'
      ORDER BY u.created_at DESC
    `;
        return { success: true, data: results };
    } catch (error) {
        console.error('Error fetching builders:', error);
        return { success: false, error: error.message };
    }
}

// Update builder status
export async function updateBuilderStatus(builderId, status) {
    try {
        const result = await sql`
      UPDATE users
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${builderId} AND role = 'builder'
      RETURNING id, username, email, full_name, status
    `;
        return { success: true, data: result[0] };
    } catch (error) {
        console.error('Error updating builder status:', error);
        return { success: false, error: error.message };
    }
}

// Get all properties (for admin)
export async function getAllProperties() {
    try {
        const results = await sql`
      SELECT p.*, u.full_name as builder_name
      FROM properties p
      LEFT JOIN users u ON p.builder_id = u.id
      ORDER BY p.created_at DESC
    `;
        const processed = results.map(p => ({
            ...p,
            images: normalizeImages(p.images)
        }));
        return { success: true, data: processed };
    } catch (error) {
        console.error('Error fetching all properties:', error);
        return { success: false, error: error.message };
    }
}

// Update property status (admin)
export async function updatePropertyStatus(propertyId, status) {
    try {
        const result = await sql`
      UPDATE properties
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${propertyId}
      RETURNING *
    `;
        return { success: true, data: result[0] };
    } catch (error) {
        console.error('Error updating property status:', error);
        return { success: false, error: error.message };
    }
}

// Get all complaints
export async function getAllComplaints() {
    try {
        const results = await sql`
      SELECT c.*, p.name as property_name, u.full_name as complainant_name
      FROM complaints c
      LEFT JOIN properties p ON c.property_id = p.id
      LEFT JOIN users u ON c.user_id = u.id
      ORDER BY c.created_at DESC
    `;
        return { success: true, data: results };
    } catch (error) {
        console.error('Error fetching complaints:', error);
        return { success: false, error: error.message };
    }
}

// Update complaint status
export async function updateComplaintStatus(complaintId, status) {
    try {
        const result = await sql`
      UPDATE complaints
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${complaintId}
      RETURNING *
    `;
        return { success: true, data: result[0] };
    } catch (error) {
        console.error('Error updating complaint:', error);
        return { success: false, error: error.message };
    }
}

// ============== WISHLIST OPERATIONS ==============

export async function getUserWishlist(userId) {
    try {
        const results = await sql`
      SELECT p.* FROM wishlist w
      JOIN properties p ON w.property_id = p.id
      WHERE w.user_id = ${userId}
      ORDER BY w.created_at DESC
    `;
        const processed = results.map(p => ({
            ...p,
            images: normalizeImages(p.images)
        }));
        return { success: true, data: processed };
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        return { success: false, error: error.message };
    }
}

export async function addToWishlist(userId, propertyId) {
    try {
        const result = await sql`
      INSERT INTO wishlist (user_id, property_id)
      VALUES (${userId}, ${propertyId})
      ON CONFLICT (user_id, property_id) DO NOTHING
      RETURNING *
    `;
        return { success: true, data: result[0] };
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        return { success: false, error: error.message };
    }
}

export async function removeFromWishlist(userId, propertyId) {
    try {
        await sql`
      DELETE FROM wishlist
      WHERE user_id = ${userId} AND property_id = ${propertyId}
    `;
        return { success: true };
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        return { success: false, error: error.message };
    }
}

// ============== USER RENT HISTORY ==============

export async function getUserRentHistory(userId) {
    try {
        const results = await sql`
      SELECT r.*, p.name as property_name
      FROM rent_requests r
      JOIN properties p ON r.property_id = p.id
      WHERE r.user_id = ${userId}
      ORDER BY r.created_at DESC
    `;
        return { success: true, data: results };
    } catch (error) {
        console.error('Error fetching rent history:', error);
        return { success: false, error: error.message };
    }
}
