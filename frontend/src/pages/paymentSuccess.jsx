import React, { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

const PaymentSuccess = () => {
  const location = useLocation();

  useEffect(() => {
    const confirmPayment = async () => {
      const query = new URLSearchParams(location.search);
      const appointmentId = query.get("appointmentId");
      const token = localStorage.getItem("userToken");


      if (!appointmentId || !token) {
        toast.error("Missing data to confirm payment.");
        return;
      }

      try {
        const res = await axios.post(
          "https://medical-be-u2v7.onrender.com/api/payments/mock-success",
          { appointmentId },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        toast.success("✅ Payment confirmed!");
        console.log(" Payment response:", res.data);
      } catch (err) {
        console.error(" Payment error:", err.response?.data || err);
        toast.error("❌ Failed to confirm payment.");
      }
    };

    confirmPayment();
  }, [location]);

  return (
    <div className="max-w-lg mx-auto mt-20 text-center">
      <h2 className="text-2xl font-bold text-green-600 mb-4">Payment Successful!</h2>
      <p className="text-zinc-600">Your appointment has been confirmed and marked as paid.</p>
    </div>
  );
};

export default PaymentSuccess;
