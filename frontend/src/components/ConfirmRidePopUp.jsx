import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ConfirmRidePopUp = ({ ride, setConfirmRidePopupPanel, setRidePopupPanel }) => {
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/rides/start-ride`,
                {
                    params: { rideId: ride._id, otp },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (response.status === 200) {
                setConfirmRidePopupPanel(false);
                setRidePopupPanel(false);
                navigate("/captain-riding", { state: { ride } });
            }
        } catch (error) {
            console.error("Error confirming ride:", error);
        }
    };

    return (
        <div className="relative p-4 bg-white rounded-lg shadow-md w-full max-w-md mx-auto">
            {/* Close Button */}
            <button
                onClick={() => setRidePopupPanel(false)}
                className="absolute top-2 right-3 text-3xl text-gray-400 hover:text-gray-600"
            >
                <i className="ri-arrow-down-wide-line"></i>
            </button>

            <h3 className="text-2xl font-semibold text-center mb-4">Confirm this ride to Start</h3>

            {/* User Info */}
            <div className="flex items-center justify-between p-3 border-2 border-yellow-400 rounded-lg mb-4">
                <div className="flex items-center gap-3">
                    <img
                        className="h-12 w-12 rounded-full object-cover"
                        src="https://www.clevelanddentalhc.com/wp-content/uploads/2018/03/sample-avatar.jpg"
                        alt="User"
                    />
                    <h2 className="text-lg font-medium capitalize">{ride?.user.fullname.firstname}</h2>
                </div>
                <h5 className="text-lg font-semibold">{ride?.captainDistance.distance}</h5>
            </div>

            {/* Ride Details */}
            <div className="space-y-4">
                <div className="p-3 border-b flex items-center gap-4">
                    <i className="ri-map-pin-user-fill text-lg"></i>
                    <div>
                        <h3 className="text-lg font-medium">Pickup</h3>
                        <p className="text-sm text-gray-600">{ride?.pickup}</p>
                    </div>
                </div>

                <div className="p-3 border-b flex items-center gap-4">
                    <i className="ri-map-pin-2-fill text-lg"></i>
                    <div>
                        <h3 className="text-lg font-medium">Destination</h3>
                        <p className="text-sm text-gray-600">{ride?.destination}</p>
                    </div>
                </div>

                <div className="p-3 flex items-center gap-4">
                    <i className="ri-currency-line text-lg"></i>
                    <div>
                        <h3 className="text-lg font-medium">₹{ride?.fare}</h3>
                        <p className="text-sm text-gray-600">Cash Payment</p>
                    </div>
                </div>
            </div>

            {/* OTP Input and Buttons */}
            <form onSubmit={submitHandler} className="space-y-4 mt-6">
                <input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    type="text"
                    className="w-full px-6 py-3 text-lg bg-gray-200 rounded-lg font-mono"
                    placeholder="Enter OTP"
                />

                <div className="flex flex-col gap-3 mt-4">
                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg text-lg"
                    >
                        Confirm
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setConfirmRidePopupPanel(false);
                            setRidePopupPanel(false);
                        }}
                        className="w-full bg-red-600 text-white font-semibold py-3 rounded-lg text-lg"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ConfirmRidePopUp;
