"use client";

import React from "react";
import { useStore } from "@/context/StoreContext";
import { Cpu, ShoppingCart, UserCheck, ShieldAlert, Mail, Moon, Sun } from "lucide-react";

interface HeaderProps {
  activeView: string;
  setActiveView: (view: string) => void;
  setCartOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeView, setActiveView, setCartOpen }) => {
  const { cart, theme, toggleTheme } = useStore();

  const navItems = [
    { id: "home", label: "Shop Parts", icon: Cpu },
    { id: "corporate", label: "Corporate Donation", icon: UserCheck },
    { id: "admin", label: "Admin Console", icon: ShieldAlert },
    { id: "contact", label: "Contact Us", icon: Mail },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border glass glow-primary">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div
          onClick={() => setActiveView("home")}
          className="flex cursor-pointer items-center space-x-2 text-primary hover:opacity-90 transition-opacity"
        >
          <Cpu className="h-8 w-8 animate-float text-primary" />
          <span className="text-xl font-bold tracking-tight text-foreground sm:block">
            PC<span className="text-primary font-extrabold">Cycle</span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex items-center space-x-1.5 rounded-md px-3 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-secondary text-primary glow-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right side controls */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            title="Toggle Theme"
          >
            {theme === "dark" ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-indigo-500" />}
          </button>

          {/* Cart Button */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            title="Open Cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Header */}
      <div className="flex md:hidden justify-around border-t border-border/50 py-2 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex flex-col items-center justify-center rounded-md px-2 py-1 text-[11px] font-medium transition-all ${
                isActive ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4.5 w-4.5 mb-0.5" />
              <span>{item.label.split(" ")[0]}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
