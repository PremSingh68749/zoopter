const axios = require('axios');
const captainModel = require('../models/captain.model');

module.exports.getAddressCoordinate = async (address) => {
    // Temporary mock data for testing
    const testCoordinates = {
        "Wappnet Systems Pvt. Ltd., Science City Road, Science City, Panchamrut Bunglows II, Sola, Ahmedabad, Gujarat, India": { lat: 23.0708, lng: 72.5177 },
        "Ld College Of Engineering Boys Hostel Block D, LALBHAI DALPATBHAI COLLEGE OF ENGINEERING, University Area, Ahmedabad, Gujarat, India": { lat: 23.0338, lng: 72.5466 }

    };

    if (testCoordinates[address]) {
        return {
            ltd: testCoordinates[address].lat,
            lng: testCoordinates[address].lng
        };
    } else {
        throw new Error("Address not found in test data");
    }

    /*
    // Original API call (commented out for testing)
    const apiKey = process.env.GOOGLE_MAPS_API;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            const location = response.data.results[0].geometry.location;
            return {
                ltd: location.lat,
                lng: location.lng
            };
        } else {
            throw new Error('Unable to fetch coordinates');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
    */
};

module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    // Temporary mock data for testing
    const testDistances = {
        "Wappnet Systems Pvt. Ltd., Science City Road, Science City, Panchamrut Bunglows II, Sola, Ahmedabad, Gujarat, India":
        {
            "Ld College Of Engineering Boys Hostel Block D, LALBHAI DALPATBHAI COLLEGE OF ENGINEERING, University Area, Ahmedabad, Gujarat, India": {
                distance: { text: "10 km", value: 10000 },
                duration: { text: "25 mins", value: 1500 }
            }
        },
        "Ld College Of Engineering Boys Hostel Block D, LALBHAI DALPATBHAI COLLEGE OF ENGINEERING, University Area, Ahmedabad, Gujarat, India":
        {
            "Wappnet Systems Pvt. Ltd., Science City Road, Science City, Panchamrut Bunglows II, Sola, Ahmedabad, Gujarat, India": {
                distance: { text: "10 km", value: 10000 },
                duration: { text: "25 mins", value: 1500 }
            }
        }
    };

    if (testDistances[origin] && testDistances[origin][destination]) {
        return testDistances[origin][destination];
    } else {
        throw new Error("Route not found in test data");
    }

    /*
    // Original API call (commented out for testing)
    const apiKey = process.env.GOOGLE_MAPS_API;
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {

            if (response.data.rows[0].elements[0].status === 'ZERO_RESULTS') {
                throw new Error('No routes found');
            }

            return response.data.rows[0].elements[0];
        } else {
            throw new Error('Unable to fetch distance and time');
        }

    } catch (err) {
        console.error(err);
        throw err;
    }
    */
};

module.exports.getAutoCompleteSuggestions = async (input) => {
    if (!input) {
        throw new Error('query is required');
    }

    // Temporary data for testing
    const testData = [
        "Wappnet Systems Pvt. Ltd., Science City Road, Science City, Panchamrut Bunglows II, Sola, Ahmedabad, Gujarat, India",
        "Wappner Funeral Directors Mansfield, South Diamond Street, Mansfield, OH, USA",
        "Wappner Funeral Directors Ontario, North Lexington-Springmill Road, Ontario, OH, USA",
        "Wappner Road, Thunder Bay, ON, Canada",
        "Wappner Funeral Directors, Claremont Avenue, Ashland, OH, USA",
        "L.D. College Of Engineering, Circular Road, University Area, Ahmedabad, Gujarat, India",
        "Ld College Of Engineering Boys Hostel Block D, LALBHAI DALPATBHAI COLLEGE OF ENGINEERING, University Area, Ahmedabad, Gujarat, India",
        "L D College Of Engineering Library, University Area, Ahmedabad, Gujarat, India",
        "LD College Canteen, Navrangpura, Ahmedabad, Gujarat, India",
        "LD College Of Engineering, COE Design Tech Lab, Navrangpura, Ahmedabad, Gujarat, India"
    ];

    // Filter test data based on input
    return testData.filter(place => place.toLowerCase().includes(input.toLowerCase()));

    /*
    // Original API call (commented out for testing)
    const apiKey = process.env.GOOGLE_MAPS_API;
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            return response.data.predictions.map(prediction => prediction.description).filter(value => value);
        } else {
            throw new Error('Unable to fetch suggestions');
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
    */
};


module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {

    // radius in km


    const captains = await captainModel.find({
        location: {
            $geoWithin: {
                $centerSphere: [[ltd, lng], radius / 6371]
            }
        }
    });

    return captains;


}

module.exports.haversineformula = (origin, destination, speed = 50) => {

    const toRadians = (degrees) => degrees * (Math.PI / 180);

    const R = 6371; // Earth's radius in km
    const lat1 = toRadians(origin.ltd);
    const lat2 = toRadians(destination.ltd);
    const deltaLat = toRadians(destination.ltd - origin.ltd);
    const deltaLng = toRadians(destination.lng - origin.lng);

    // Haversine formula
    const a = Math.sin(deltaLat / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distanceKm = R * c; // Distance in kilometers
    const distanceMeters = Math.round(distanceKm * 1000); // Convert to meters

    // Estimated time based on speed (km/h)
    const durationHours = distanceKm / speed; // Time in hours
    const durationSeconds = Math.round(durationHours * 3600); // Convert to seconds

    // console.log("formula out", distanceMeters, durationSeconds)

    return {
        distance: { text: `${distanceKm.toFixed(2)} km`, value: distanceMeters },
        duration: { text: `${Math.round(durationSeconds / 60)} mins`, value: durationSeconds }
    };
};



// auto complete samle 

// [
//     "Wappnet Systems Pvt. Ltd., Science City Road, Science City, Panchamrut Bunglows II, Sola, Ahmedabad, Gujarat, India",
//     "Wappner Funeral Directors Mansfield, South Diamond Street, Mansfield, OH, USA",
//     "Wappner Funeral Directors Ontario, North Lexington-Springmill Road, Ontario, OH, USA",
//     "Wappner Road, Thunder Bay, ON, Canada",
//     "Wappner Funeral Directors, Claremont Avenue, Ashland, OH, USA"
// ]

// [
//     "L.D. College Of Engineering, Circular Road, University Area, Ahmedabad, Gujarat, India",
//     "Ld College Of Engineering Boys Hostel Block D, LALBHAI DALPATBHAI COLLEGE OF ENGINEERING, University Area, Ahmedabad, Gujarat, India",
//     "L D College Of Engineering Library, University Area, Ahmedabad, Gujarat, India",
//     "LD College Canteen, Navrangpura, Ahmedabad, Gujarat, India",
//     "LD College Of Engineering, COE Design Tech Lab, Navrangpura, Ahmedabad, Gujarat, India"
// ]