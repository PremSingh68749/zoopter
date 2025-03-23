const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const mapService = require('../services/maps.service');
const { sendMessageToSocketId } = require('../socket');
const rideModel = require('../models/ride.model');


// module.exports.createRide = async (req, res) => {
//     let rideusertemp;
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { userId, pickup, destination, vehicleType } = req.body;

//     try {
//         console.log(req.user)
//         const ride = await rideService.createRide({ user: req.user._id, pickup, destination, vehicleType });
//         res.status(201).json(ride);

//         const pickupCoordinates = await mapService.getAddressCoordinate(pickup);



//         const captainsInRadius = await mapService.getCaptainsInTheRadius(pickupCoordinates.ltd, pickupCoordinates.lng, 2);

//         ride.otp = ""

//         const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user');


//         rideusertemp = rideWithUser
//         captainsInRadius.map(captain => {

//             // console.log("cordinates", captain.location, pickupCoordinates)

//             const distancedata = mapService.haversineformula(captain.location, pickupCoordinates)
//             rideusertemp.distancedata = distancedata;
//             console.log("distance",  rideusertemp.distancedata)

//             sendMessageToSocketId(captain.socketId, {
//                 event: 'new-ride',
//                 data: rideusertemp

//             })

//         })

//     } catch (err) {

//         console.log(err);
//         return res.status(500).json({ message: err.message });
//     }

// };

module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination, vehicleType } = req.body;

    try {
    

        // Create ride in database
        const ride = await rideService.createRide({ user: req.user._id, pickup, destination, vehicleType });
        res.status(201).json(ride);

        // Fetch coordinates and captains in parallel
        const pickupCoordinatesPromise = mapService.getAddressCoordinate(pickup);
        const [pickupCoordinates, captainsInRadius] = await Promise.all([
            pickupCoordinatesPromise,
            pickupCoordinatesPromise.then(coords => mapService.getCaptainsInTheRadius(coords.ltd, coords.lng, 2))
        ]);

        ride.otp = "";

        // Fetch ride with populated user
        let rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user');

        // Convert Mongoose object to plain JavaScript object
        rideWithUser = rideWithUser.toObject();

        // Compute distance & duration for each captain
        const distancePromises = captainsInRadius.map(captain =>
            mapService.haversineformula(captain.location, pickupCoordinates)
        );
        const distanceDataArray = await Promise.all(distancePromises);

        // Send ride event with **personalized** distance & duration to each captain
        captainsInRadius.forEach((captain, index) => {
            const { distance, duration } = distanceDataArray[index];

            sendMessageToSocketId(captain.socketId, {
                event: 'new-ride',
                data: {
                    ...rideWithUser,
                    captainDistance: {
                        distance: distance.text,  // Example: "2.5 km"
                        distanceValue: distance.value,  // Example: 2500 (meters)
                        duration: duration.text,  // Example: "5 mins"
                        durationValue: duration.value  // Example: 300 (seconds)
                    }
                }
            });
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
};



module.exports.getFare = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination } = req.query;

    try {
        const fare = await rideService.getFare(pickup, destination);
        return res.status(200).json(fare);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports.confirmRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;
    console.log("riddeid", rideId, "captain", req.captain)

    try {
        const ride = await rideService.confirmRide({ rideId, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-confirmed',
            data: ride
        })

        return res.status(200).json(ride);
    } catch (err) {

        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}

module.exports.startRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, otp } = req.query;

    try {
        const ride = await rideService.startRide({ rideId, otp, captain: req.captain });

        console.log(ride);

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-started',
            data: ride
        })

        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports.endRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.endRide({ rideId, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-ended',
            data: ride
        })



        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    } s
}