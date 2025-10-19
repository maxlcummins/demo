"use client"

import axios from "axios"
import { useState } from "react"
import toast from "react-hot-toast"

const ButtonCheckout = () => {

    const handleSubscribe = async () => {
        if (isLoading) return;
        
        setLoading(true);
    
    try {
        const response = await axios.post("/api/billing/create-checkout", {
            success_url: window.location.href + "/success",
            cancel_url: window.location.href,
 
        });

        const checkoutUrl = response.data.url;

        window.location.href = checkoutUrl;

        console.log(checkoutUrl)

    } catch (error){
        const errorMessage =
        error?.response?.data?.error ||
        error.message ||
        "Something went wrong";
    }

    }

    const [isLoading, setLoading] = useState(false)

    return (
        <button className="btn btn-primary" onClick={() => handleSubscribe()}>
            {
                isLoading && (
                    <span className="loading loading-spinner loading-xs"></span>
                )
            }
        Subscribe
        </button>
    )
}

export default ButtonCheckout