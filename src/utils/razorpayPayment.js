export const openRazorpay = async ({ amount, bookingId }) => {
  try {
    // 1️⃣ Create Razorpay order
    const res = await fetch("http://localhost:5000/api/payments/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, bookingId }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error("Create order failed: " + err);
    }

    const order = await res.json();
    console.log("✅ Order created:", order);

    // Get user info for prefill
    const user = JSON.parse(localStorage.getItem("user")) || {};
    
    // Ensure phone is a valid 10-digit number
    let phone = user.phone || "9999999999";
    phone = String(phone).replace(/\D/g, "").slice(-10) || "9999999999";

    // 2️⃣ Open Razorpay popup with minimal options
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      order_id: order.id,
      name: "PetSitter",
      description: "Pet Sitting Service Payment",
      
      // ✅ PREFILL
      prefill: {
        name: user.name || "Pet Owner",
        email: user.email || "customer@petsitter.com",
        contact: phone,
      },

      // ✅ SUCCESS HANDLER
      handler: async function (response) {
        try {
          console.log("✅ Payment successful! Response:", response);

          const verifyRes = await fetch("http://localhost:5000/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              bookingId,
              amount,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyRes.json();
          console.log("Verification response:", verifyData);

          if (!verifyRes.ok || !verifyData.success) {
            throw new Error(verifyData.message || "Payment verification failed");
          }

          console.log("✅ Payment verified successfully");
          alert("Payment Successful! 🎉 Your booking has been confirmed.");
          setTimeout(() => window.location.reload(), 1000);
        } catch (error) {
          console.error("❌ Verification error:", error);
          alert("Payment completed but verification failed. Please contact support.\nError: " + error.message);
        }
      },
    };

    // Validate Razorpay key
    if (!options.key) {
      throw new Error("Razorpay key not configured. Check your .env file.");
    }

    console.log("🚀 Opening Razorpay with key:", options.key);

    // Ensure Razorpay script is loaded
    if (!window.Razorpay) {
      throw new Error("Razorpay script not loaded. Please refresh the page.");
    }

    // Create and open Razorpay instance
    const rzp = new window.Razorpay(options);

    // Add error event handler
    rzp.on("payment.failed", function (response) {
      console.error("❌ Payment failed:", response);
      const errorDesc = response.error?.description || "Unknown error occurred";
      alert("Payment failed!\nError: " + errorDesc);
    });

    // Open the payment modal
    rzp.open();
    
  } catch (error) {
    console.error("❌ Razorpay error:", error);
    alert("Payment error: " + error.message);
  }
};