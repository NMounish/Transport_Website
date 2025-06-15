import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get("session_id");

    if (sessionId) {
      console.log("Payment successful! Session ID:", sessionId);
      setLoading(false);
    } else {
      navigate("/"); // Redirect to home if no session ID (Prevents incorrect navigation)
    }
  }, [location, navigate]);

  if (loading) {
    return <div className="text-center text-xl">Verifying payment...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold text-green-600">Payment Successful!</h1>
      <p className="text-gray-600 mt-4">Thank you for your purchase.</p>
      <button
        onClick={() => navigate("/home")}
        className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Go to Home
      </button>
    </div>
  );
};

export default SuccessPage;
