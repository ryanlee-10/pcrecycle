"use client";

import React from "react";
import { useStore } from "@/context/StoreContext";
import { X, Trash2, ArrowRight, ShoppingCart } from "lucide-react";

interface CartSidebarProps {
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  setActiveView: (view: string) => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({ cartOpen, setCartOpen, setActiveView }) => {
  const { cart, inventory, removeFromCart } = useStore();

  if (!cartOpen) return null;

  // Get active items in cart
  const cartItems = inventory.filter((item) => cart.includes(item.id) && item.status === "available");
  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={() => setCartOpen(false)}
      />

      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md transform bg-card text-card-foreground shadow-2xl transition-all duration-300 border-l border-border">
          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-6 sm:px-6">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">Your Recycling Cart</h2>
              </div>
              <button
                type="button"
                className="rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary p-1.5 transition-colors"
                onClick={() => setCartOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
              {cartItems.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <ShoppingCart className="h-16 w-16 text-muted-foreground/30 mb-4 animate-bounce" />
                  <p className="text-base font-semibold text-muted-foreground">Your cart is empty</p>
                  <p className="text-sm text-muted-foreground/75 mt-1 max-w-[240px]">
                    Browse recycled parts and add them to your order to raise money for charity!
                  </p>
                  <button
                    onClick={() => {
                      setCartOpen(false);
                      setActiveView("home");
                    }}
                    className="mt-6 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <ul role="list" className="space-y-4">
                  {cartItems.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between gap-4 rounded-lg bg-secondary/30 p-3 border border-border/50"
                    >
                      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-secondary/80">
                        {/* Custom SVG mockup for parts */}
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            // Fallback if Unsplash fails to load offline
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      </div>

                      <div className="flex flex-1 flex-col">
                        <div>
                          <h4 className="text-sm font-medium text-foreground line-clamp-1">{item.name}</h4>
                          <p className="text-xs text-muted-foreground">{item.category} • {item.condition}</p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end justify-between gap-2">
                        <p className="text-sm font-bold text-primary">${item.price}</p>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-muted-foreground hover:text-rose-400 p-1 rounded hover:bg-secondary transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer Summary */}
            {cartItems.length > 0 && (
              <div className="border-t border-border px-4 py-6 sm:px-6 bg-secondary/10">
                <div className="flex justify-between text-base font-semibold text-foreground">
                  <p>Proceeds to Charity</p>
                  <p className="text-primary font-bold">${subtotal}</p>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  100% of purchase profits are distributed to designated charities.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => {
                      setCartOpen(false);
                      setActiveView("checkout");
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-lg hover:bg-primary/95 transition-all glow-primary"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
