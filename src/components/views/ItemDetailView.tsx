"use client";

import React from "react";
import { useStore } from "@/context/StoreContext";
import { ArrowLeft, ShoppingCart, Heart, ShieldCheck, Cpu, RefreshCw } from "lucide-react";

interface ItemDetailViewProps {
  itemId: string;
  setActiveView: (view: string) => void;
  setSelectedItemId: (id: string | null) => void;
}

export const ItemDetailView: React.FC<ItemDetailViewProps> = ({ itemId, setActiveView, setSelectedItemId }) => {
  const { inventory, addToCart, cart, charities } = useStore();

  const item = inventory.find((part) => part.id === itemId);

  if (!item) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg font-bold text-rose-500">Component not found</p>
        <button
          onClick={() => setActiveView("home")}
          className="mt-4 inline-flex items-center gap-1 text-primary hover:underline font-semibold"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Shop
        </button>
      </div>
    );
  }

  const inCart = cart.includes(item.id);
  const charity = charities.find((c) => c.id === item.charityId);

  // Approximate environmental metrics
  const weightOffset = 3.8; // lbs
  const carbonOffset = 45; // kg CO2 equivalent for manufacturing a new component

  return (
    <div className="space-y-8 pb-16">
      {/* Back Button */}
      <button
        onClick={() => {
          setSelectedItemId(null);
          setActiveView("home");
        }}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Marketplace</span>
      </button>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
        {/* Left Column: Image Card */}
        <div className="md:col-span-5 space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-xl border border-border/50 bg-secondary/30">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
            <div className="absolute top-4 left-4 rounded bg-background/90 px-3 py-1 text-xs font-semibold text-primary border border-primary/20 backdrop-blur-md">
              Condition: {item.condition}
            </div>
          </div>

          {/* Environmental Callout Box */}
          <div className="rounded-xl bg-emerald-500/10 p-5 border border-emerald-500/20 text-emerald-400">
            <h3 className="font-bold flex items-center gap-1.5 text-sm sm:text-base">
              <Cpu className="h-5 w-5" />
              Environmental Impact
            </h3>
            <p className="text-xs text-emerald-300/85 mt-2 leading-relaxed">
              By purchasing this refurbished <strong>{item.category}</strong>, you prevent approximately <strong>{weightOffset} lbs</strong> of toxic e-waste from entering landfills and offset <strong>{carbonOffset} kg of CO2</strong> associated with manufacturing new hardware.
            </p>
          </div>
        </div>

        {/* Right Column: Spec Sheet & Purchase Portal */}
        <div className="md:col-span-7 space-y-6">
          <div>
            <span className="text-xs font-semibold tracking-widest text-primary uppercase">{item.category}</span>
            <h1 className="text-2xl font-extrabold text-foreground mt-1 sm:text-3xl">{item.name}</h1>
            <p className="text-xs text-muted-foreground mt-2">Originally donated by: <strong className="text-foreground">{item.donorName}</strong></p>
          </div>

          {/* Price & Action */}
          <div className="rounded-xl border border-border/50 bg-secondary/15 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Charitable Purchase Price</p>
              <p className="text-3xl font-black text-foreground mt-1">${item.price}</p>
            </div>

            <button
              onClick={() => addToCart(item.id)}
              disabled={inCart}
              className={`flex items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-sm font-bold w-full sm:w-auto transition-all ${
                inCart
                  ? "bg-secondary text-muted-foreground cursor-default"
                  : "bg-primary text-primary-foreground hover:bg-primary/95 shadow-lg glow-primary"
              }`}
            >
              <ShoppingCart className="h-4 w-4" />
              <span>{inCart ? "Already in Cart" : "Add to Cart"}</span>
            </button>
          </div>

          {/* Charity Profile */}
          {charity && (
            <div className="rounded-xl border border-border/50 p-5 space-y-3 bg-card">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Beneficiary Charity</h3>
              <div>
                <h4 className="text-base font-bold text-foreground flex items-center gap-1.5">
                  <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
                  {charity.name}
                </h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{charity.description}</p>
              </div>
            </div>
          )}

          {/* Technical Specifications */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Component Specifications</h3>
            <div className="overflow-hidden rounded-lg border border-border bg-card">
              <table className="min-w-full divide-y divide-border">
                <tbody className="divide-y divide-border">
                  {Object.entries(item.specs).map(([key, val]) => (
                    <tr key={key} className="hover:bg-secondary/10 transition-colors">
                      <td className="px-6 py-3.5 text-xs font-semibold text-muted-foreground bg-secondary/10 w-1/3">{key}</td>
                      <td className="px-6 py-3.5 text-xs font-medium text-foreground">{val}</td>
                    </tr>
                  ))}
                  <tr className="hover:bg-secondary/10 transition-colors">
                    <td className="px-6 py-3.5 text-xs font-semibold text-muted-foreground bg-secondary/10">Diagnostic Status</td>
                    <td className="px-6 py-3.5 text-xs font-medium text-primary flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-primary" />
                      Bench-tested & Certified working
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
