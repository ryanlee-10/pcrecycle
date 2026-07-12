"use client";

import React, { useState } from "react";
import { useStore, PCPart } from "@/context/StoreContext";
import { Search, Heart, Cpu, ShieldCheck, ArrowRight, Star } from "lucide-react";

interface HomeViewProps {
  setSelectedItemId: (id: string | null) => void;
  setActiveView: (view: string) => void;
}

const categories = ["All", "CPU", "GPU", "RAM", "Motherboard", "Storage", "PSU", "Case", "Other"] as const;

export const HomeView: React.FC<HomeViewProps> = ({ setSelectedItemId, setActiveView }) => {
  const { inventory, addToCart, cart, charities } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Filter available items
  const availableItems = inventory.filter((item) => item.status === "available");

  const filteredItems = availableItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      Object.values(item.specs).some((spec) => spec.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const featuredItems = availableItems.slice(0, 3);

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-secondary/10 px-6 py-16 text-center sm:px-12 sm:py-20 border border-border/40 glass">
        {/* Glow decoration */}
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-emerald-500/20 blur-3xl" />

        <div className="relative mx-auto max-w-2xl space-y-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Star className="h-3 w-3 fill-primary text-primary" />
            100% Static & Eco-Friendly Hosting
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground">
            Recycle. Rebuild. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">
              Fund Change.
            </span>
          </h1>
          <p className="mx-auto max-w-lg text-sm sm:text-base text-muted-foreground">
            Give computer parts a second life. Donate your old PC hardware or purchase refurbished components. 
            All proceeds go directly to global digital literacy and aid initiatives.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <button
              onClick={() => {
                const shopSection = document.getElementById("shop-marketplace");
                if (shopSection) shopSection.scrollIntoView({ behavior: "smooth" });
              }}
              className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg hover:bg-primary/95 transition-all glow-primary"
            >
              Browse Catalog
            </button>
            <button
              onClick={() => setActiveView("corporate")}
              className="flex items-center gap-1 rounded-md border border-border hover:border-primary/50 bg-secondary/40 hover:bg-secondary/70 px-5 py-3 text-sm font-semibold text-foreground transition-all"
            >
              <span>Donate Hardware</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. Charity Impact Section */}
      <section className="space-y-6">
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Our Charity Partners</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Where your money goes: we trace and fund the following non-profits.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {charities.map((charity) => (
            <div
              key={charity.id}
              className="rounded-xl border border-border/50 bg-card p-6 flex flex-col justify-between transition-all hover:scale-[1.01] hover:border-primary/30"
            >
              <div>
                <h3 className="text-base font-bold text-foreground flex items-center gap-1.5">
                  <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
                  {charity.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{charity.description}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-border/40 flex justify-between items-center">
                <span className="text-xs text-muted-foreground font-medium uppercase">Funds Received</span>
                <span className="text-base font-extrabold text-primary">${charity.totalFundsRaised}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Shop / Marketplace Section */}
      <section id="shop-marketplace" className="space-y-8 pt-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Refurbished Parts</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Tested, certified, and ready for deployment. Includes a mock 6-month warranty.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search components or specs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-border bg-input py-2 pl-9 pr-4 text-sm text-foreground outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-1.5 border-b border-border/40 pb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-1 text-xs font-semibold tracking-wide transition-all ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground glow-primary"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        {filteredItems.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border py-16 text-center">
            <Cpu className="mx-auto h-12 w-12 text-muted-foreground/30 animate-pulse" />
            <p className="text-sm font-semibold text-muted-foreground mt-4">No matching components found</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Try resetting your search or category filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => {
              const inCart = cart.includes(item.id);
              const charityName = charities.find((c) => c.id === item.charityId)?.name || "Charity";
              return (
                <div
                  key={item.id}
                  className="group flex flex-col justify-between overflow-hidden rounded-xl border border-border/50 bg-card transition-all hover:scale-[1.02] hover:border-primary/30 glow-primary-hover"
                >
                  {/* Card Image */}
                  <div
                    onClick={() => {
                      setSelectedItemId(item.id);
                      setActiveView("item");
                    }}
                    className="relative aspect-video w-full overflow-hidden bg-secondary/40 cursor-pointer"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                    <div className="absolute top-3 left-3 rounded bg-background/80 px-2 py-0.5 text-[10px] font-semibold text-primary backdrop-blur-sm border border-primary/20">
                      {item.condition}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{item.category}</span>
                        <span className="flex items-center gap-0.5 text-rose-400 font-medium">
                          <Heart className="h-3 w-3 fill-rose-400" />
                          {charityName.split(" ")[0]}
                        </span>
                      </div>
                      <h3
                        onClick={() => {
                          setSelectedItemId(item.id);
                          setActiveView("item");
                        }}
                        className="text-base font-bold text-foreground mt-2 cursor-pointer hover:text-primary transition-colors line-clamp-1"
                      >
                        {item.name}
                      </h3>
                      {/* Specs snippet */}
                      <div className="mt-3 flex flex-wrap gap-1">
                        {Object.entries(item.specs).slice(0, 3).map(([key, val]) => (
                          <span
                            key={key}
                            className="inline-block rounded bg-secondary/40 px-2 py-0.5 text-[10px] text-muted-foreground"
                          >
                            {key}: {val}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-border/40 flex items-center justify-between">
                      <span className="text-lg font-extrabold text-foreground">${item.price}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedItemId(item.id);
                            setActiveView("item");
                          }}
                          className="rounded bg-secondary text-foreground hover:bg-secondary/80 text-xs font-semibold px-3 py-2 transition-colors"
                        >
                          Specs
                        </button>
                        <button
                          onClick={() => addToCart(item.id)}
                          disabled={inCart}
                          className={`rounded px-3 py-2 text-xs font-semibold transition-all ${
                            inCart
                              ? "bg-secondary text-muted-foreground cursor-default"
                              : "bg-primary text-primary-foreground hover:bg-primary/90 glow-primary"
                          }`}
                        >
                          {inCart ? "In Cart" : "Add to Cart"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
