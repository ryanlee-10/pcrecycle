"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { ShieldCheck, Heart, ArrowLeft, ShoppingCart, Award, Sparkles } from "lucide-react";

interface CheckoutViewProps {
  setActiveView: (view: string) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({ setActiveView }) => {
  const { cart, inventory, placeOrder, charities } = useStore();

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  });

  const [orderComplete, setOrderComplete] = useState(false);
  const [placedOrderDetails, setPlacedOrderDetails] = useState<{ id: string; total: number; charityFunds: Record<string, number> } | null>(null);

  const cartItems = inventory.filter((item) => cart.includes(item.id) && item.status === "available");
  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) return;

    // Calculate charity allocations for receipt
    const charityAllocations: Record<string, number> = {};
    cartItems.forEach((item) => {
      const name = charities.find((c) => c.id === item.charityId)?.name || "Charity";
      charityAllocations[name] = (charityAllocations[name] || 0) + item.price;
    });

    const success = await placeOrder({
      name: formData.name,
      email: formData.email,
      address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}`,
    });

    if (success) {
      setPlacedOrderDetails({
        id: `ORD-${Date.now().toString().slice(-6)}`,
        total: subtotal,
        charityFunds: charityAllocations,
      });
      setOrderComplete(true);
    }
  };

  // Success view
  if (orderComplete && placedOrderDetails) {
    return (
      <div className="mx-auto max-w-xl text-center py-12 space-y-6">
        <div className="inline-flex rounded-full bg-primary/10 p-4 text-primary animate-bounce">
          <Sparkles className="h-12 w-12" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-foreground">Order Successfully Simulated!</h1>
          <p className="text-sm text-muted-foreground">
            Thank you for checking out. Since this website is for personal tracking, your order was processed locally.
          </p>
        </div>

        {/* Receipt card */}
        <div className="rounded-xl border border-border/60 bg-card p-6 text-left space-y-4">
          <div className="flex justify-between items-center border-b border-border/50 pb-3">
            <span className="text-xs font-semibold text-muted-foreground">Order ID: {placedOrderDetails.id}</span>
            <span className="text-xs rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-primary font-bold">Simulated Paid</span>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Charitable Donations Triggered</h4>
            <ul className="space-y-1.5">
              {Object.entries(placedOrderDetails.charityFunds).map(([charityName, amount]) => (
                <li key={charityName} className="flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
                    {charityName}
                  </span>
                  <span className="font-bold text-primary">${amount}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-border/50 pt-3 flex justify-between items-center text-base font-bold text-foreground">
            <span>Total Logged</span>
            <span>${placedOrderDetails.total}</span>
          </div>
        </div>

        <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-4 flex gap-3 text-left text-emerald-400">
          <Award className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold">E-Waste Impact Logged!</p>
            <p className="text-emerald-300/80 mt-1">
              Your transaction has successfully retired these parts from active inventory. Environmental logs and financial totals have been compiled in your local Admin Dashboard.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveView("home")}
          className="w-full rounded-md bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/95 transition-all glow-primary"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Back Button */}
      <button
        onClick={() => setActiveView("home")}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Shop</span>
      </button>

      <div className="text-center sm:text-left">
        <h1 className="text-3xl font-extrabold text-foreground">Checkout</h1>
        <p className="text-sm text-muted-foreground mt-1">Complete your simulated purchase to distribute funds to charity.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          {/* Shipping info */}
          <div className="space-y-4 rounded-xl border border-border/50 bg-card p-6">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">1. Shipping Information</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Full Name</label>
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full rounded border border-border bg-input px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Email Address</label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full rounded border border-border bg-input px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50"
                />
              </div>

              <div className="sm:col-span-6">
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Street Address</label>
                <input
                  required
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full rounded border border-border bg-input px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-muted-foreground mb-1">City</label>
                <input
                  required
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full rounded border border-border bg-input px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-muted-foreground mb-1">State / Province</label>
                <input
                  required
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full rounded border border-border bg-input px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-muted-foreground mb-1">ZIP / Postal Code</label>
                <input
                  required
                  type="text"
                  name="zip"
                  value={formData.zip}
                  onChange={handleInputChange}
                  className="w-full rounded border border-border bg-input px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50"
                />
              </div>
            </div>
          </div>

          {/* Payment info (Mocked) */}
          <div className="space-y-4 rounded-xl border border-border/50 bg-card p-6">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">2. Payment (Simulated)</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Card Number</label>
                <input
                  required
                  type="text"
                  name="cardNumber"
                  placeholder="4111 2222 3333 4444"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  className="w-full rounded border border-border bg-input px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50"
                />
              </div>

              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Expiry</label>
                <input
                  required
                  type="text"
                  name="cardExpiry"
                  placeholder="MM/YY"
                  value={formData.cardExpiry}
                  onChange={handleInputChange}
                  className="w-full rounded border border-border bg-input px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50"
                />
              </div>

              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-muted-foreground mb-1">CVC</label>
                <input
                  required
                  type="text"
                  name="cardCvc"
                  placeholder="123"
                  value={formData.cardCvc}
                  onChange={handleInputChange}
                  className="w-full rounded border border-border bg-input px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50"
                />
              </div>
            </div>
          </div>

          {/* Sandbox warning */}
          <div className="rounded-lg bg-secondary/30 p-4 border border-border/50 flex gap-3 text-muted-foreground">
            <ShieldCheck className="h-5 w-5 flex-shrink-0 mt-0.5 text-primary" />
            <span className="text-xs leading-relaxed">
              <strong>Simulated Sandbox Environment</strong>: No network requests, API queries, or payment processors are executed. All transactions occur entirely inside this browser tab and persist in local storage.
            </span>
          </div>

          {/* Action button */}
          <button
            type="submit"
            disabled={cartItems.length === 0}
            className={`w-full rounded-md py-3.5 text-sm font-bold transition-all ${
              cartItems.length === 0
                ? "bg-secondary text-muted-foreground cursor-not-allowed"
                : "bg-primary text-primary-foreground hover:bg-primary/95 shadow-lg glow-primary"
            }`}
          >
            Complete Simulated Purchase (${subtotal})
          </button>
        </form>

        {/* Right Column: Cart Summary */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl border border-border/50 bg-card p-6 space-y-4 sticky top-24">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <ShoppingCart className="h-4.5 w-4.5 text-primary" />
              Order Summary
            </h3>

            {cartItems.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">Your cart is empty.</p>
            ) : (
              <>
                <ul className="divide-y divide-border/40 overflow-y-auto max-h-60 pr-1">
                  {cartItems.map((item) => (
                    <li key={item.id} className="flex justify-between py-3 text-xs">
                      <div>
                        <p className="font-semibold text-foreground line-clamp-1">{item.name}</p>
                        <p className="text-muted-foreground mt-0.5">{item.category} • {item.condition}</p>
                      </div>
                      <span className="font-bold text-primary pl-2">${item.price}</span>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-border/40 pt-4 space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Tax (0% Mock)</span>
                    <span>$0</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Shipping (Free Eco-Fulfillment)</span>
                    <span>$0</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-foreground pt-2 border-t border-border/20">
                    <span>Grand Total</span>
                    <span className="text-primary font-black">${subtotal}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
