import { api } from "./api";

function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error("Razorpay script load failed"));
    document.body.appendChild(script);
  });
}

export async function startRazorpayPayment({ user, refreshUser, setLoading, setMessage }) {
  setLoading(true);
  setMessage("");

  try {
    await loadRazorpayScript();
    const data = await api("/api/payments/create-order", { method: "POST" });

    const razorpay = new window.Razorpay({
      key: data.key,
      amount: data.amount,
      currency: data.currency,
      name: "ZProject Reader",
      description: `Pro monthly plan - Rs ${data.amountInInr || 149}`,
      order_id: data.order.id,
      theme: { color: "#fb7185" },
      prefill: {
        name: user?.name || "",
        email: user?.email || "",
        contact: user?.phone || "",
      },
      handler: async (response) => {
        const verify = await api("/api/payments/verify", {
          method: "POST",
          body: JSON.stringify(response),
        });
        setMessage(verify.message);
        await refreshUser?.();
      },
    });

    razorpay.open();
  } catch (error) {
    setMessage(error.message);
  } finally {
    setLoading(false);
  }
}
