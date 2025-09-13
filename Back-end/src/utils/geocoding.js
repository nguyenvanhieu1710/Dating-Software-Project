// Geocoding utility for converting location text to PostGIS geography format
const locationCoordinates = {
    // Major US cities with their coordinates (longitude, latitude)
    'new york': [-74.0060, 40.7128],
    'new york, ny': [-74.0060, 40.7128],
    'nyc': [-74.0060, 40.7128],
    'los angeles': [-118.2437, 34.0522],
    'los angeles, ca': [-118.2437, 34.0522],
    'la': [-118.2437, 34.0522],
    'chicago': [-87.6298, 41.8781],
    'chicago, il': [-87.6298, 41.8781],
    'houston': [-95.3698, 29.7604],
    'houston, tx': [-95.3698, 29.7604],
    'phoenix': [-112.0740, 33.4484],
    'phoenix, az': [-112.0740, 33.4484],
    'philadelphia': [-75.1652, 39.9526],
    'philadelphia, pa': [-75.1652, 39.9526],
    'san antonio': [-98.4936, 29.4241],
    'san antonio, tx': [-98.4936, 29.4241],
    'san diego': [-117.1611, 32.7157],
    'san diego, ca': [-117.1611, 32.7157],
    'dallas': [-96.7970, 32.7767],
    'dallas, tx': [-96.7970, 32.7767],
    'san jose': [-121.8863, 37.3382],
    'san jose, ca': [-121.8863, 37.3382],
    'austin': [-97.7431, 30.2672],
    'austin, tx': [-97.7431, 30.2672],
    'jacksonville': [-81.6557, 30.3322],
    'jacksonville, fl': [-81.6557, 30.3322],
    'san francisco': [-122.4194, 37.7749],
    'san francisco, ca': [-122.4194, 37.7749],
    'columbus': [-82.9988, 39.9612],
    'columbus, oh': [-82.9988, 39.9612],
    'charlotte': [-80.8431, 35.2271],
    'charlotte, nc': [-80.8431, 35.2271],
    'detroit': [-83.0458, 42.3314],
    'detroit, mi': [-83.0458, 42.3314],
    'el paso': [-106.4850, 31.7619],
    'el paso, tx': [-106.4850, 31.7619],
    'seattle': [-122.3321, 47.6062],
    'seattle, wa': [-122.3321, 47.6062],
    'denver': [-104.9903, 39.7392],
    'denver, co': [-104.9903, 39.7392],
    'washington': [-77.0369, 38.9072],
    'washington, dc': [-77.0369, 38.9072],
    'dc': [-77.0369, 38.9072],
    'boston': [-71.0589, 42.3601],
    'boston, ma': [-71.0589, 42.3601],
    'nashville': [-86.7816, 36.1627],
    'nashville, tn': [-86.7816, 36.1627],
    'baltimore': [-76.6122, 39.2904],
    'baltimore, md': [-76.6122, 39.2904],
    'oklahoma city': [-97.5164, 35.4676],
    'oklahoma city, ok': [-97.5164, 35.4676],
    'portland': [-122.6765, 45.5152],
    'portland, or': [-122.6765, 45.5152],
    'las vegas': [-115.1398, 36.1699],
    'las vegas, nv': [-115.1398, 36.1699],
    'memphis': [-90.0489, 35.1495],
    'memphis, tn': [-90.0489, 35.1495],
    'louisville': [-85.7585, 38.2527],
    'louisville, ky': [-85.7585, 38.2527],
    'milwaukee': [-87.9065, 43.0389],
    'milwaukee, wi': [-87.9065, 43.0389],
    'albuquerque': [-106.6504, 35.0844],
    'albuquerque, nm': [-106.6504, 35.0844],
    'tucson': [-110.9747, 32.2226],
    'tucson, az': [-110.9747, 32.2226],
    'fresno': [-119.7726, 36.7378],
    'fresno, ca': [-119.7726, 36.7378],
    'kansas city': [-94.5786, 39.0997],
    'kansas city, mo': [-94.5786, 39.0997],
    'mesa': [-111.8315, 33.4152],
    'mesa, az': [-111.8315, 33.4152],
    'atlanta': [-84.3880, 33.7490],
    'atlanta, ga': [-84.3880, 33.7490],
    'omaha': [-95.9375, 41.2565],
    'omaha, ne': [-95.9375, 41.2565],
    'miami': [-80.1918, 25.7617],
    'miami, fl': [-80.1918, 25.7617],
    // Default to New York City if location not found
    'default': [-74.0060, 40.7128]
};

/**
 * Convert location text to PostGIS geography format
 * @param {string} locationText - Location text (e.g., "New York, NY")
 * @returns {string} PostGIS geography format (e.g., "SRID=4326;POINT(-74.0060 40.7128)")
 */
function locationToPostGIS(locationText) {
    if (!locationText || locationText.trim() === '') {
        // Return null for empty location
        return null;
    }

    // Check if input is already in coordinate format (lat,lng or lng,lat)
    const coordinatePattern = /^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/;
    const coordinateMatch = locationText.match(coordinatePattern);
    
    if (coordinateMatch) {
        const lng = parseFloat(coordinateMatch[1]);
        const lat = parseFloat(coordinateMatch[2]);
        
        // Validate coordinate ranges
        if (lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90) {
            return `SRID=4326;POINT(${lng} ${lat})`;
        }
    }

    // Try to find location in our predefined list
    const normalizedLocation = locationText.toLowerCase().trim();
    const coordinates = locationCoordinates[normalizedLocation];
    
    if (coordinates) {
        const [lng, lat] = coordinates;
        return `SRID=4326;POINT(${lng} ${lat})`;
    }

    // If not found, try to match partial location names
    for (const [key, coords] of Object.entries(locationCoordinates)) {
        if (key !== 'default' && normalizedLocation.includes(key.split(',')[0])) {
            const [lng, lat] = coords;
            return `SRID=4326;POINT(${lng} ${lat})`;
        }
    }

    // Fallback to default location (New York City)
    const [defaultLng, defaultLat] = locationCoordinates.default;
    console.warn(`Location "${locationText}" not found. Using default coordinates.`);
    return `SRID=4326;POINT(${defaultLng} ${defaultLat})`;
}

/**
 * Parse coordinate input in various formats
 * @param {string} input - Coordinate input string
 * @returns {Object|null} Object with lng and lat properties or null if invalid
 */
function parseCoordinates(input) {
    if (!input) return null;

    // Try different coordinate formats
    const patterns = [
        // Format: "lng, lat" or "lat, lng"
        /^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/,
        // Format: "lng lat" (space separated)
        /^(-?\d+\.?\d*)\s+(-?\d+\.?\d*)$/,
        // Format: decimal degrees
        /^(-?\d+\.?\d*)$/
    ];

    for (const pattern of patterns) {
        const match = input.match(pattern);
        if (match) {
            const num1 = parseFloat(match[1]);
            const num2 = match[2] ? parseFloat(match[2]) : null;
            
            // Determine which is lng and which is lat
            let lng, lat;
            
            if (num2 === null) {
                // Single number, assume it's latitude (less common)
                lat = num1;
                lng = 0; // Default longitude
            } else {
                // Two numbers - try to determine which is which
                if (Math.abs(num1) <= 90 && Math.abs(num2) > 90) {
                    // num1 looks like latitude, num2 looks like longitude
                    lat = num1;
                    lng = num2;
                } else if (Math.abs(num2) <= 90 && Math.abs(num1) > 90) {
                    // num2 looks like latitude, num1 looks like longitude
                    lat = num2;
                    lng = num1;
                } else {
                    // Can't determine, assume lng, lat order
                    lng = num1;
                    lat = num2;
                }
            }
            
            // Validate ranges
            if (lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90) {
                return { lng, lat };
            }
        }
    }

    return null;
}

module.exports = {
    locationToPostGIS,
    parseCoordinates,
    locationCoordinates
};
