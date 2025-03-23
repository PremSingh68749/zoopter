import React, { useRef, useState, useEffect, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import CaptainDetails from '../components/CaptainDetails';
import RidePopUp from '../components/RidePopUp';
import ConfirmRidePopUp from '../components/ConfirmRidePopUp';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { SocketContext } from '../context/SocketContext';
import { CaptainDataContext } from '../context/CapatainContext';
import axios from 'axios';

const CaptainHome = () => {
    const [ridePopupPanel, setRidePopupPanel] = useState(false);
    const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
    const [ride, setRide] = useState(null);

    const ridePopupPanelRef = useRef(null);
    const confirmRidePopupPanelRef = useRef(null);

    const { socket } = useContext(SocketContext);
    const { captain } = useContext(CaptainDataContext);

    // Handle location updates
    useEffect(() => {
        const updateLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    socket.emit('update-location-captain', {
                        userId: captain._id,
                        location: {
                            ltd: position.coords.latitude,
                            lng: position.coords.longitude
                        }
                    });
                });
            }
        };

        // Join socket room
        socket.emit('join', {
            userId: captain._id,
            userType: 'captain'
        });

        // Update location immediately and then set interval
        updateLocation();
        const locationInterval = setInterval(updateLocation, 10000);

        // Cleanup interval on unmount
        return () => clearInterval(locationInterval);
    }, [captain._id, socket]);

    // Handle new ride events
    useEffect(() => {
        const handleNewRide = (data) => {
            // console.log("distance", data.captainDistance)
            setRide(data);
            setRidePopupPanel(true);
        };

        socket.on('new-ride', handleNewRide);

        // Cleanup event listener on unmount
        return () => {
            socket.off('new-ride', handleNewRide);
        };
    }, [socket]);

    // Confirm ride handler
    const confirmRide = useCallback(async () => {
        try {
            await axios.post(
                `${import.meta.env.VITE_BASE_URL}/rides/confirm`,
                {
                    rideId: ride._id,
                    captainId: captain._id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            setRidePopupPanel(false);
            setConfirmRidePopupPanel(true);
        } catch (error) {
            console.error('Error confirming ride:', error);
            // Handle error appropriately
        }
    }, [ride, captain._id]);

    // GSAP animations for ride popup panel
    useGSAP(() => {
        if (ridePopupPanelRef.current) {
            gsap.to(ridePopupPanelRef.current, {
                transform: ridePopupPanel ? 'translateY(0)' : 'translateY(100%)'
            });
        }
    }, [ridePopupPanel]);

    // GSAP animations for confirm ride popup panel
    useGSAP(() => {
        if (confirmRidePopupPanelRef.current) {
            gsap.to(confirmRidePopupPanelRef.current, {
                transform: confirmRidePopupPanel ? 'translateY(0)' : 'translateY(100%)'
            });
        }
    }, [confirmRidePopupPanel]);

    return (
        <div className='h-screen'>
            <header className='fixed p-6 top-0 flex items-center justify-between w-screen'>
                <Link to='/captain/logout' className='h-10 w-10 bg-white flex items-center justify-center rounded-full'>
                    <i className="text-lg font-medium ri-logout-box-r-line"></i>
                </Link>
            </header>

            <section className='h-3/5'>
                <img
                    className='h-full w-full object-cover'
                    src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
                    alt="Map visualization"
                />
            </section>

            <section className='h-2/5 p-6'>
                <CaptainDetails />
            </section>

            {/* Ride popup panel */}
            <div
                ref={ridePopupPanelRef}
                className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'
            >
                <RidePopUp
                    ride={ride}
                    setRidePopupPanel={setRidePopupPanel}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                    confirmRide={confirmRide}
                />
            </div>

            {/* Confirm ride popup panel */}
            <div
                ref={confirmRidePopupPanelRef}
                className='fixed w-full h-screen z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'
            >
                <ConfirmRidePopUp
                    ride={ride}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                    setRidePopupPanel={setRidePopupPanel}
                />
            </div>
        </div>
    );
};

export default CaptainHome;