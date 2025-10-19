"use client"

import axios from "axios"
import { useState } from "react"
import toast from "react-hot-toast"

const ButtonPortal = () => {

    const handleBilling = async () => {
        if (isLoading) return;
        
        setLoading(true);
    
    try {
        const response = await axios.post("/api/billing/create-portal", {
            returnUrl: window.location.href,
 
        });

        const portalUrl = response.data.url;

        window.location.href = portalUrl;

        console.log(portalUrl)

    } catch (error){
        const errorMessage =
        error?.response?.data?.error ||
        error.message ||
        "Something went wrong";
    }

    }

    const [isLoading, setLoading] = useState(false)

    return (
        <button className="btn btn-primary" onClick={() => handleBilling()}>
            {
                isLoading && (
                    <span className="loading loading-spinner loading-xs"></span>
                )
            }
        Billing
        </button>
    )
}

export default ButtonPortal