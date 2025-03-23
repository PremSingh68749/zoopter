import React, { useContext, useEffect, useState } from 'react';
import { CaptainDataContext } from '../context/CapatainContext';
import axios from 'axios';

const CaptainDetails = () => {
    const [stats, setStats] = useState({});
    const { captain } = useContext(CaptainDataContext);

    const rideDate = new Date();
    const monthKey = `${rideDate.getFullYear()}-${String(rideDate.getMonth() + 1).padStart(2, '0')}`; // Format: YYYY-MM

    useEffect(() => {
        const fetchCaptainStats = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (response.status === 200) {
                    console.log("Monthly Stats:", response.data.monthlyStats);
                    setStats(response.data.monthlyStats || {});  // ✅ Fixed State Update
                }
            } catch (error) {
                console.error("Error fetching captain stats:", error);
            }
        };

        fetchCaptainStats();
    }, [captain]); // ✅ Only re-fetch when captain context changes

    const currentMonthStats = stats[monthKey] || { totalEarnings: 0, totalWorkingHours: 0, totalCompletedRides: 0 };

    return (
        <div>
            <div className='flex items-center justify-between'>
                <div className='flex items-center justify-start gap-3'>
                    <img 
                        className='h-10 w-10 rounded-full object-cover' 
                        src="https://www.clevelanddentalhc.com/wp-content/uploads/2018/03/sample-avatar.jpg" 
                        alt="Captain Profile"
                    />
                    <h4 className='text-lg font-medium capitalize'>
                        {captain?.fullname?.firstname} {captain?.fullname?.lastname}
                    </h4>
                </div>
                <div>
                    <h4 className='text-xl font-semibold'>₹{currentMonthStats.totalEarnings}</h4>
                    <p className='text-sm text-gray-600'>Earned</p>
                </div>
            </div>
            <div className='flex p-3 mt-8 bg-gray-100 rounded-xl justify-center gap-5 items-start'>
                <div className='text-center'>
                    <i className="text-3xl mb-2 font-thin ri-timer-2-line"></i>
                    <h5 className='text-lg font-medium'>{currentMonthStats.totalWorkingHours}</h5>
                    <p className='text-sm text-gray-600'>Hours Online</p>
                </div>
                <div className='text-center'>
                    <i className="text-3xl mb-2 font-thin ri-booklet-line"></i>
                    <h5 className='text-lg font-medium'>{currentMonthStats.totalCompletedRides}</h5>
                    <p className='text-sm text-gray-600'>Completed Rides</p>
                </div>
            </div>
        </div>
    );
};

export default CaptainDetails;
