"use client";

import React from "react";
import { Cpu, Heart, CheckCircle2, AlertCircle } from "lucide-react";
import { useStore } from "@/context/StoreContext";

interface FooterProps {
  setActiveView: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveView }) => {
  const { inventory, orders } = useStore();

  const totalPartsRecycled = inventory.length + 124; // Seed offset
  const landfillDivertedLbs = totalPartsRecycled * 4.5; // Average computer part weight offset
  const ordersCompleted = orders.length + 42; // Seed offset

  return (
    <footer className="w-full border-t border-border bg-muted/30 py-8 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Dynamic Ecological Stats Ticker */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 border-b border-border/50 pb-8 mb-8 text-center sm:text-left">
          <div className="flex items-center space-x-3 justify-center sm:justify-start">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold tracking-tight text-foreground">{totalPartsRecycled}</p>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Components Recycled</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 justify-center sm:justify-start">
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
              <Cpu className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold tracking-tight text-foreground">{landfillDivertedLbs.toFixed(0)} lbs</p>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">E-waste Diverted From Landfills</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 justify-center sm:justify-start">
            <div className="rounded-lg bg-rose-500/10 p-2 text-rose-400">
              <Heart className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold tracking-tight text-foreground">{ordersCompleted}</p>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Hardware Sales Completed</p>
            </div>
          </div>
        </div>

        {/* Footer Links & Brand */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Cpu className="h-6 w-6 text-primary" />
            <span className="font-bold text-foreground">PC<span className="text-primary font-extrabold">Cycle</span></span>
            <span className="text-sm">| Eco-Friendly Personal Hub</span>
          </div>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <button onClick={() => setActiveView("home")} className="hover:text-primary transition-colors">Shop</button>
            <button onClick={() => setActiveView("corporate")} className="hover:text-primary transition-colors">Corporate</button>
            <button onClick={() => setActiveView("admin")} className="hover:text-primary transition-colors">Admin Console</button>
            <button onClick={() => setActiveView("contact")} className="hover:text-primary transition-colors">Contact</button>
            <button onClick={() => setActiveView("terms")} className="hover:text-primary transition-colors">Terms of Service</button>
            <button onClick={() => setActiveView("privacy")} className="hover:text-primary transition-colors">Privacy Policy</button>
          </div>
        </div>

        {/* Bottom credits */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-4 border-t border-border/30 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} PCCycle. All rights reserved. Designed for local trust and static publishing.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="h-3 w-3 text-rose-500 fill-rose-500" /> for the environment.
          </p>
        </div>
      </div>
    </footer>
  );
};
