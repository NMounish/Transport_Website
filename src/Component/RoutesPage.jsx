import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FaBus } from "react-icons/fa";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

const stripePromise = loadStripe("pk_test_51R3t6BG02mzQQsFNUlcOcPmDctFLr75xiRr6Ak9MvMiOc90RxYj1IT36QJ4hmYuHZrgdUrBJSSSoOz23Gz9q0YmB00iYUPgdNr");

const RoutesPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const fromCity = queryParams.get("from");
  const toCity = queryParams.get("to");

  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    const availableRoutes = [
      { id: 1, name: "Express Route 1", price: "₹500", duration: "5 hrs", priceId: "price_1R4Ph4G02mzQQsFNzc0Jf7qV" },
      { id: 2, name: "Luxury Bus", price: "₹700", duration: "4.5 hrs", priceId: "price_1R4PheG02mzQQsFNtY1cOgbE" },
      { id: 3, name: "Budget Ride", price: "₹350", duration: "6 hrs", priceId: "price_1R4Pi4G02mzQQsFNiFrEEjMX" },
    ];
    setRoutes(availableRoutes);
  }, [fromCity, toCity]);

  const handleBookNow = async (priceId) => {
    try {
      const userId = JSON.parse(localStorage.getItem("user")).id; // Get user ID from localStorage
  
      const response = await fetch("http://localhost:8081/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, userId }), // Include userId
        credentials: "include", // Include credentials
      });
  
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  
      const session = await response.json();
      if (!session.id) throw new Error("Stripe session ID not received.");
  
      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId: session.id });
    } catch (error) {
      console.error("Error creating Checkout Session:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Routes from {fromCity} to {toCity}
      </h2>
      <div className="flex flex-col gap-4">
        {routes.map((route) => (
          <div key={route.id} className="p-4 border rounded-lg shadow-md bg-white flex flex-col items-center relative">
            <div className="absolute top-[-12px] px-4 py-1 bg-blue-500 text-white font-bold text-sm rounded-full">REGAL ROAMERS</div>
            <div className="flex items-center w-full">
              <FaBus className="text-blue-500 text-4xl mr-4" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{route.name}</h3>
                <p className="text-gray-600">Price: {route.price}</p>
                <p className="text-gray-600">Duration: {route.duration}</p>
              </div>
              <button onClick={() => handleBookNow(route.priceId)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">Book Now</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoutesPage;