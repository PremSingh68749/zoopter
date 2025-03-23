import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import axios from 'axios';
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel';
import VehiclePanel from '../components/VehiclePanel';
import ConfirmRide from '../components/ConfirmRide';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';
import { SocketContext } from '../context/SocketContext';
import { useContext } from 'react';
import { UserDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import LiveTracking from '../components/LiveTracking';

const Home = () => {
    const [pickup, setPickup] = useState('')
    const [destination, setDestination] = useState('')
    const [panelOpen, setPanelOpen] = useState(false)
    const vehiclePanelRef = useRef(null)
    const confirmRidePanelRef = useRef(null)
    const vehicleFoundRef = useRef(null)
    const waitingForDriverRef = useRef(null)
    const panelRef = useRef(null)
    const panelCloseRef = useRef(null)
    const [vehiclePanel, setVehiclePanel] = useState(false)
    const [confirmRidePanel, setConfirmRidePanel] = useState(false)
    const [vehicleFound, setVehicleFound] = useState(false)
    const [waitingForDriver, setWaitingForDriver] = useState(false)
    const [pickupSuggestions, setPickupSuggestions] = useState([])
    const [destinationSuggestions, setDestinationSuggestions] = useState([])
    const [activeField, setActiveField] = useState(null)
    const [fare, setFare] = useState({})
    const [vehicleType, setVehicleType] = useState(null)
    const [ride, setRide] = useState(null)

    const navigate = useNavigate()

    const { socket } = useContext(SocketContext)
    const { user } = useContext(UserDataContext)

    // test socket
    useEffect(() => {
        socket.emit("join", { userType: "user", userId: user._id });

        const handleRideConfirmed = (ride) => {
            setVehicleFound(false);
            setWaitingForDriver(true);
            setRide(ride);
        };

        const handleRideStarted = (ride) => {
            setWaitingForDriver(false);
            navigate('/riding', { state: { ride } });
        };

        socket.on('ride-confirmed', handleRideConfirmed);
        socket.on('ride-started', handleRideStarted);

        return () => {
            socket.off('ride-confirmed', handleRideConfirmed);
            socket.off('ride-started', handleRideStarted);
        };
    }, [user, navigate]);


    // useEffect(() => {
    //     socket.emit("join", { userType: "user", userId: user._id })
    // }, [ user ])

    // socket.on('ride-confirmed', ride => {


    //     setVehicleFound(false)
    //     setWaitingForDriver(true)
    //     setRide(ride)
    // })

    // socket.on('ride-started', ride => {
    //     console.log("ride")
    //     setWaitingForDriver(false)
    //     navigate('/riding', { state: { ride } }) // Updated navigate to include ride data
    // })


    const handlePickupChange = async (e) => {
        setPickup(e.target.value)
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                params: { input: e.target.value },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }

            })
            setPickupSuggestions(response.data)
        } catch {
            // handle error
        }
    }

    const handleDestinationChange = async (e) => {
        setDestination(e.target.value)
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                params: { input: e.target.value },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setDestinationSuggestions(response.data)
        } catch {
            // handle error
        }
    }

    const submitHandler = (e) => {
        e.preventDefault()
    }

    // test animation 
    useEffect(() => {
        const tl = gsap.timeline({ defaults: { duration: 0.5, ease: "power2.out" } });

        if (panelRef.current) {
            tl.to(panelRef.current, { height: panelOpen ? "70%" : "0%", padding: panelOpen ? 24 : 0 });
            gsap.to(panelCloseRef.current, { opacity: panelOpen ? 1 : 0 });
        }

        if (vehiclePanelRef.current) {
            gsap.to(vehiclePanelRef.current, { y: vehiclePanel ? "0%" : "100%" });
        }

        if (confirmRidePanelRef.current) {
            gsap.to(confirmRidePanelRef.current, { y: confirmRidePanel ? "0%" : "100%" });
        }

        if (vehicleFoundRef.current) {
            gsap.to(vehicleFoundRef.current, { y: vehicleFound ? "0%" : "100%" });
        }

        if (waitingForDriverRef.current) {
            gsap.to(waitingForDriverRef.current, { y: waitingForDriver ? "0%" : "100%" });
        }

    }, [panelOpen, vehiclePanel, confirmRidePanel, vehicleFound, waitingForDriver]);

    const imgurl = {
        "car": "https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg",
        "moto": "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png",
        "auto": "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png",
    }
    // useGSAP(function () {
    //     if (panelOpen) {
    //         gsap.to(panelRef.current, {
    //             height: '70%',
    //             padding: 24
    //             // opacity:1
    //         })
    //         gsap.to(panelCloseRef.current, {
    //             opacity: 1
    //         })
    //     } else {
    //         gsap.to(panelRef.current, {
    //             height: '0%',
    //             padding: 0
    //             // opacity:0
    //         })
    //         gsap.to(panelCloseRef.current, {
    //             opacity: 0
    //         })
    //     }
    // }, [ panelOpen ])


    // useGSAP(function () {
    //     if (vehiclePanel) {
    //         gsap.to(vehiclePanelRef.current, {
    //             transform: 'translateY(0)'
    //         })
    //     } else {
    //         gsap.to(vehiclePanelRef.current, {
    //             transform: 'translateY(100%)'
    //         })
    //     }
    // }, [ vehiclePanel ])

    // useGSAP(function () {
    //     if (confirmRidePanel) {
    //         gsap.to(confirmRidePanelRef.current, {
    //             transform: 'translateY(0)'
    //         })
    //     } else {
    //         gsap.to(confirmRidePanelRef.current, {
    //             transform: 'translateY(100%)'
    //         })
    //     }
    // }, [ confirmRidePanel ])

    // useGSAP(function () {
    //     if (vehicleFound) {
    //         gsap.to(vehicleFoundRef.current, {
    //             transform: 'translateY(0)'
    //         })
    //     } else {
    //         gsap.to(vehicleFoundRef.current, {
    //             transform: 'translateY(100%)'
    //         })
    //     }
    // }, [ vehicleFound ])

    // useGSAP(function () {
    //     if (waitingForDriver) {
    //         gsap.to(waitingForDriverRef.current, {
    //             transform: 'translateY(0)'
    //         })
    //     } else {
    //         gsap.to(waitingForDriverRef.current, {
    //             transform: 'translateY(100%)'
    //         })
    //     }
    // }, [ waitingForDriver ])


    async function findTrip() {
        setVehiclePanel(true)
        setPanelOpen(false)

        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
            params: { pickup, destination },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })


        setFare(response.data)


    }

    async function createRide() {
        const response = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/rides/create`,
            {
                pickup,
                destination,
                vehicleType
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }
        );


    }

    return (
        <div className='h-screen relative overflow-hidden'>


            <div className="h-screen w-screen">
                <header className='fixed p-2 top-0 flex items-center justify-between w-[50px] z-10'>
                    <Link to='/user/logout' className='h-10 w-[100%] bg-white flex items-center justify-center rounded-full z-10'>
                        <i className="text-lg font-medium ri-logout-box-r-line"></i>
                    </Link>
                </header>

                {/* image for temporary use  */}
                <LiveTracking />
            </div>
            <div className=' flex flex-col justify-end h-screen absolute top-0 w-full '>
                <div className='h-[30%] p-6 bg-white relative'>
                    <h5 ref={panelCloseRef} onClick={() => {
                        setPanelOpen(false)
                    }} className='absolute opacity-0 right-6 top-6 text-2xl'>
                        <i className="ri-arrow-down-wide-line"></i>
                    </h5>
                    <h4 className='text-2xl font-semibold mt-6'>Find a trip</h4>
                    <form className='relative py-3' onSubmit={(e) => {
                        submitHandler(e)
                    }}>
                        <div className="line absolute h-16 w-1 top-[50%] -translate-y-1/2 left-5 bg-gray-700 rounded-full"></div>
                        <input
                            onClick={() => {
                                setPanelOpen(true)
                                setActiveField('pickup')
                            }}
                            value={pickup}
                            onChange={handlePickupChange}
                            className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full'
                            type="text"
                            placeholder='Add a pick-up location'
                        />
                        <input
                            onClick={() => {
                                setPanelOpen(true)
                                setActiveField('destination')
                            }}
                            value={destination}
                            onChange={handleDestinationChange}
                            className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full  mt-3'
                            type="text"
                            placeholder='Enter your destination' />
                    </form>
                    <button
                        onClick={findTrip}
                        className='bg-black text-white px-4 py-2 rounded-lg mt-4 w-full'>
                        Find Trip
                    </button>
                </div>
                <div ref={panelRef} className='bg-white h-0'>
                    <LocationSearchPanel
                        suggestions={activeField === 'pickup' ? pickupSuggestions : destinationSuggestions}
                        setPanelOpen={setPanelOpen}
                        setVehiclePanel={setVehiclePanel}
                        setPickup={setPickup}
                        setDestination={setDestination}
                        activeField={activeField}
                    />
                </div>
            </div>
            <div ref={vehiclePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <VehiclePanel
                    selectVehicle={setVehicleType}
                    fare={fare} setConfirmRidePanel={setConfirmRidePanel} setVehiclePanel={setVehiclePanel} />
            </div>
            <div ref={confirmRidePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'>
                <ConfirmRide
                    createRide={createRide}
                    pickup={pickup}
                    destination={destination}
                    fare={fare}
                    vehicleType={vehicleType}
                    imgurl={imgurl}
                    setConfirmRidePanel={setConfirmRidePanel} setVehicleFound={setVehicleFound} />
            </div>
            <div ref={vehicleFoundRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'>
                <LookingForDriver
                    createRide={createRide}
                    pickup={pickup}
                    destination={destination}
                    fare={fare}
                    imgurl={imgurl}
                    vehicleType={vehicleType}
                    setVehicleFound={setVehicleFound} />
            </div>
            <div ref={waitingForDriverRef} className='fixed w-full  z-10 bottom-0  bg-white px-3 py-6 pt-12'>
                <WaitingForDriver
                    ride={ride}
                    imgurl={imgurl}
                    vehicleType={vehicleType}
                    setVehicleFound={setVehicleFound}
                    setWaitingForDriver={setWaitingForDriver}
                    waitingForDriver={waitingForDriver} />
            </div>
        </div>
    )
}

export default Home