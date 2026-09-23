"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";

export default function CheckoutForm({
  initialName,
  initialPhone,
  initialAddress,
}: {
  initialName: string;
  initialPhone: string;
  initialAddress: string;
}) {
  const { items, clearCart } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [payment, setPayment] = useState("");
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [address, setAddress] = useState(initialAddress);
  const [loading, setLoading] = useState(false);
  const [safepayError, setSafepayError] = useState(
    searchParams.get("safepayError") ||
      (searchParams.get("safepayCancelled") ? "Payment was cancelled." : "")
  );
  const [redirectingToSafepay, setRedirectingToSafepay] = useState(false);

  const totalPrice = items.reduce((sum, item) => {
    const priceNum = Number(item.price.replace(/,/g, ""));
    return sum + priceNum * item.quantity;
  }, 0);

  const cartPayload = () => ({
    items: items.map((item) => ({ slug: item.slug, quantity: item.quantity })),
  });

  const handlePlaceOrder = async () => {
    // Basic validation
    if (!name || !phone || !address) {
      alert("Please fill in your name, phone and address.");
      return;
    }
    if (!payment) {
      alert("Please choose a payment method.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          phone: phone,
          address: address,
          items: items,
          paymentMethod: payment,
        }),
      });

      const data = await res.json();

      if (data.success) {
        clearCart();
        router.push(`/order-confirmed?orderNumber=${encodeURIComponent(data.orderNumber)}`);
      } else {
        alert(
          typeof data.error === "string" && data.error
            ? data.error
            : "Something went wrong. Please try again."
        );
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      alert("Could not place order. Please check your connection.");
      setLoading(false);
    }
  };

  const handlePayWithSafepay = async () => {
    if (!name || !phone || !address) {
      alert("Please fill in your name, phone and address.");
      return;
    }

    setSafepayError("");
    setRedirectingToSafepay(true);
    try {
      const res = await fetch("/api/payments/safepay/create-tracker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          phone,
          address,
          ...cartPayload(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        // Full-page navigation — Safepay's hosted checkout is not embedded.
        // The customer is redirected back to /checkout (cancelled/error) or
        // /order-confirmed (success) by app/api/payments/safepay/return/route.ts.
        window.location.href = data.checkoutUrl;
      } else {
        setSafepayError(
          typeof data.error === "string" && data.error
            ? data.error
            : "Could not start online payment. Please try again."
        );
        setRedirectingToSafepay(false);
      }
    } catch (error) {
      console.error(error);
      setSafepayError("Could not start online payment. Please check your connection.");
      setRedirectingToSafepay(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">

      <section className="px-6 pt-16 pb-24 max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1D1D1F] mb-8">
          Check<span className="text-[#B8933E]">out</span>
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-6">Your cart is empty.</p>
            <Link
              href="/products"
              className="inline-block bg-[#1D1D1F] text-white text-sm px-6 py-3 rounded-full cursor-pointer transition-all duration-300 hover:bg-[#B8933E]"
            >
              Shop the collection
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Left: delivery + payment */}
            <div className="md:col-span-2 space-y-8">
              {/* Delivery details */}
              <div>
                <h2 className="text-sm text-[#1D1D1F] font-medium mb-4">Delivery Details</h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1D1D1F] placeholder:text-gray-400 focus:outline-none focus:border-[#B8933E]"
                  />
                  <input
                    type="tel"
                    placeholder="WhatsApp number — +92 3XX XXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1D1D1F] placeholder:text-gray-400 focus:outline-none focus:border-[#B8933E]"
                  />
                  <textarea
                    rows={3}
                    placeholder="Full delivery address — house, street, area, city"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1D1D1F] placeholder:text-gray-400 focus:outline-none focus:border-[#B8933E] resize-none"
                  />
                </div>
              </div>

              {/* Payment method */}
              <div>
                <h2 className="text-sm text-[#1D1D1F] font-medium mb-4">Payment Method</h2>
                <div className="space-y-3">
                  {/* Advance Transfer */}
                  <label className="flex items-start gap-3 border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-[#B8933E] transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="advance"
                      checked={payment === "advance"}
                      onChange={(e) => setPayment(e.target.value)}
                      className="mt-1 accent-[#B8933E]"
                    />
                    <div>
                      <p className="text-sm text-[#1D1D1F]">Advance Bank Transfer</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Pay before dispatch via JazzCash, Easypaisa or bank transfer. Safest option — no cash at your door.
                      </p>
                    </div>
                  </label>

                  {/* Pay on Delivery via Transfer */}
                  <label className="flex items-start gap-3 border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-[#B8933E] transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="transfer-on-delivery"
                      checked={payment === "transfer-on-delivery"}
                      onChange={(e) => setPayment(e.target.value)}
                      className="mt-1 accent-[#B8933E]"
                    />
                    <div>
                      <p className="text-sm text-[#1D1D1F]">Pay on Delivery — Online Transfer</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Transfer to our account when the rider arrives, and show them the payment screenshot.
                      </p>
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label className="flex items-start gap-3 border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-[#B8933E] transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={payment === "cod"}
                      onChange={(e) => setPayment(e.target.value)}
                      className="mt-1 accent-[#B8933E]"
                    />
                    <div>
                      <p className="text-sm text-[#1D1D1F]">Cash on Delivery</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Pay the rider in cash. Please keep exact change ready.
                      </p>
                    </div>
                  </label>

                  {/* Pay Online via Safepay */}
                  <label className="flex items-start gap-3 border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-[#B8933E] transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="safepay"
                      checked={payment === "safepay"}
                      onChange={(e) => {
                        setPayment(e.target.value);
                        setSafepayError("");
                      }}
                      className="mt-1 accent-[#B8933E]"
                    />
                    <div>
                      <p className="text-sm text-[#1D1D1F]">Pay Online (Card/Wallet)</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Pay securely now via card or wallet through Safepay.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Safepay checkout — shows only once this method is selected */}
                {payment === "safepay" && (
                  <div className="mt-4 border border-[#B8933E]/30 rounded-xl p-4 bg-[#FBF8F2] space-y-3">
                    {safepayError && <p className="text-xs text-red-500">{safepayError}</p>}
                    <button
                      onClick={handlePayWithSafepay}
                      disabled={redirectingToSafepay || loading}
                      className="w-full bg-[#1D1D1F] text-white text-sm py-3 rounded-full cursor-pointer transition-all duration-300 hover:bg-[#B8933E] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {redirectingToSafepay ? "Redirecting to Safepay..." : "Continue to Safepay"}
                    </button>
                  </div>
                )}

                {/* Account details + upload — shows for both transfer options */}
                {(payment === "advance" || payment === "transfer-on-delivery") && (
                  <div className="mt-4 border border-[#B8933E]/30 rounded-xl p-4 bg-[#FBF8F2] space-y-4">
                    <div>
                      <p className="text-sm text-[#1D1D1F] font-medium mb-2">Transfer to:</p>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>JazzCash / Easypaisa: <span className="text-[#1D1D1F]">03XX-XXXXXXX</span></p>
                        <p>Bank: <span className="text-[#1D1D1F]">XXXX Bank — 0000 0000 0000</span></p>
                        <p>Account title: <span className="text-[#1D1D1F]">Lux Resin Impression</span></p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-[#1D1D1F] mb-2">
                        {payment === "advance"
                          ? "Upload payment screenshot"
                          : "Upload screenshot on delivery"}
                      </p>
                      <div className="border border-dashed border-gray-300 rounded-xl px-4 py-6 text-center cursor-pointer hover:border-[#B8933E] transition-colors bg-white">
                        <p className="text-sm text-gray-400">Drop screenshot here</p>
                        <p className="text-xs text-gray-400 mt-1">or browse — JPG or PNG</p>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        {payment === "advance"
                          ? "Transfer now and upload your screenshot. We'll confirm your payment, then dispatch your order."
                          : "When the rider arrives, transfer to the account above, show them the screenshot, and upload it here too."}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Place order — Safepay has its own button above instead */}
              {payment !== "safepay" && (
                <div className="space-y-3 pt-2">
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="w-full bg-[#1D1D1F] text-white text-sm py-3 rounded-full cursor-pointer transition-all duration-300 hover:bg-[#B8933E] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Placing your order..." : "Place Order"}
                  </button>
                  <p className="text-xs text-gray-400 text-center">
                    By placing your order, you agree to confirm payment as described above.
                  </p>
                </div>
              )}
            </div>

            {/* Right: order summary */}
            <div className="border border-gray-100 rounded-2xl p-6 h-fit">
              <h2 className="text-sm text-[#1D1D1F] font-medium mb-4">Order Summary</h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.slug} className="flex justify-between text-sm text-gray-500">
                    <span className="min-w-0 truncate pr-2">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="shrink-0">
                      PKR {(Number(item.price.replace(/,/g, "")) * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-base text-[#1D1D1F] font-medium border-t border-gray-100 pt-4 mt-4">
                <span>Total</span>
                <span>PKR {totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
