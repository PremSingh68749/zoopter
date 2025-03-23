import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserLogout = () => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
   
    useEffect(() => {
        const logoutUser = async () => {
            const token = localStorage.getItem("token");

            console.log("Token before logout:", token); // Debugging

            if (!token) {
                console.log("No token found, redirecting...");
                setLoading(false);
                navigate("/login");
                return;
            }

            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/users/logout`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                if (response.status === 200) {
                    console.log("Logout successful", response.data);
                    localStorage.removeItem("token");
                }
            } catch (error) {
                console.error("Logout error:", error);
            } finally {
                setLoading(false);
                navigate("/login"); // Ensure navigation happens only after API response
            }
        };

        logoutUser();
    }, [navigate]); // Keeping navigate in dependencies to avoid unnecessary re-renders

    return loading ? <div>Logging out...</div> : null;
};

export default UserLogout;
