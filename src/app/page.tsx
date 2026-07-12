"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartSidebar } from "@/components/CartSidebar";

// Page Views
import { HomeView } from "@/components/views/HomeView";
import { ItemDetailView } from "@/components/views/ItemDetailView";
import { CheckoutView } from "@/components/views/CheckoutView";
import { ContactView } from "@/components/views/ContactView";
import { CorporateView } from "@/components/views/CorporateView";
import { AdminView } from "@/components/views/AdminView";
import { LegalView } from "@/components/views/LegalView";

export default function Home() {
  const [activeView, setActiveView] = useState<string>("home");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  // Router dispatcher
  const renderView = () => {
    switch (activeView) {
      case "home":
        return <HomeView setSelectedItemId={setSelectedItemId} setActiveView={setActiveView} />;
      case "item":
        return selectedItemId ? (
          <ItemDetailView
            itemId={selectedItemId}
            setActiveView={setActiveView}
            setSelectedItemId={setSelectedItemId}
          />
        ) : (
          <HomeView setSelectedItemId={setSelectedItemId} setActiveView={setActiveView} />
        );
      case "checkout":
        return <CheckoutView setActiveView={setActiveView} />;
      case "contact":
        return <ContactView />;
      case "corporate":
        return <CorporateView />;
      case "admin":
        return <AdminView />;
      case "terms":
        return <LegalView type="terms" setActiveView={setActiveView} />;
      case "privacy":
        return <LegalView type="privacy" setActiveView={setActiveView} />;
      default:
        return <HomeView setSelectedItemId={setSelectedItemId} setActiveView={setActiveView} />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Navigation Header */}
      <Header activeView={activeView} setActiveView={setActiveView} setCartOpen={setCartOpen} />

      {/* Cart Drawer */}
      <CartSidebar cartOpen={cartOpen} setCartOpen={setCartOpen} setActiveView={setActiveView} />

      {/* Main Viewport Container */}
      <main className="flex-1 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {renderView()}
      </main>

      {/* Footer Area */}
      <Footer setActiveView={setActiveView} />
    </div>
  );
}
