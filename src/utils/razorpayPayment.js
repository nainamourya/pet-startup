export const openRazorpay = async ({ amount, bookingId }) => {
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

  // 2️⃣ Open Razorpay popup
  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: order.amount,
    currency: "INR",
    order_id: order.id,
    name: "PetSitter",
    description: "Booking Payment",

    // ✅ THIS IS THE HANDLER YOU ASKED ABOUT
    handler: async function (response) {
      await fetch("http://localhost:5000/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          amount, // 👈 REQUIRED FOR SITTER EARNINGS
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        }),
      });

      alert("Payment Successful 🎉");
      window.location.reload();
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};
