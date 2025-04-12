import React, { useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import FinishRide from '../components/FinishRide'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import LiveTracking from '../components/LiveTracking'
import axios from "axios";
const CaptainRiding = () => {

    const [finishRidePanel, setFinishRidePanel] = useState(false)
    const finishRidePanelRef = useRef(null)
    const location = useLocation()
    const rideData = location.state?.ride


    const openMaps = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-coordinates`, {
                params: { address: rideData.pickup },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            const { ltd, lng } = response.data;

            // Open Google Maps with these coordinates
            const googleMapsUrl = `https://www.google.com/maps?q=${ltd},${lng}`;
            window.open(googleMapsUrl, '_blank');
        } catch (error) {
            console.error('Error fetching coordinates:', error);
            alert('Unable to fetch pickup location.');
        }
    };




    useGSAP(function () {
        if (finishRidePanel) {
            gsap.to(finishRidePanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(finishRidePanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [finishRidePanel])


    return (
        <div className='h-screen relative flex flex-col justify-end'>



            <div className='fixed p-6 top-0 flex items-center justify-between w-screen'>
                <Link to='/captain-home' className=' h-10 w-10 bg-white flex items-center justify-center rounded-full'>
                    <i className="text-lg font-medium ri-logout-box-r-line"></i>
                </Link>
            </div>
            {/* <div className="absolute top-24 right-6 z-50">
                <button
                    className="bg-white border border-gray-300 text-sm font-medium px-4 py-2 rounded-full shadow-md hover:bg-gray-100 transition"
                    onClick={openMaps}
                >
                    Open Pickup in Maps
                </button>
            </div> */}


            <div className='h-1/5 p-6 flex items-center justify-between relative bg-yellow-400 pt-10'
                onClick={() => {
                    setFinishRidePanel(true)
                }}
            >  
                <h5 className='p-1 text-center w-[90%] absolute top-0' onClick={() => {

                }}><i className="text-3xl text-gray-800 ri-arrow-up-wide-line"></i></h5>

                <h4 className='text-xl font-semibold'>{rideData?.captainDistance.distance}</h4>
                <div className='flex flex-col jutify-end gap-1'>
                <button className=' bg-green-600 text-white font-semibold p-3 px-10 rounded-lg'>Complete Ride</button>
                <button
                className="bg-white border border-gray-300 text-sm font-medium px-4 py-2 rounded-lg shadow-md hover:bg-gray-100 transition"
                onClick={openMaps}
            >
                    Open Pickup in Maps
                </button>
                </div>
               
            </div>
            <div ref={finishRidePanelRef} className='fixed w-full z-[500] bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <FinishRide
                    ride={rideData}
                    setFinishRidePanel={setFinishRidePanel} />
            </div>

            <div className='h-screen  w-screen '>
                <LiveTracking />
            </div>

        </div>
    )
}

export default CaptainRiding