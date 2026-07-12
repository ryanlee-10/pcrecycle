"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Interfaces
export interface PCPart {
  id: string;
  name: string;
  category: "CPU" | "GPU" | "RAM" | "Motherboard" | "Storage" | "PSU" | "Case" | "Other";
  specs: Record<string, string>;
  condition: "New" | "Like New" | "Good" | "Fair" | "Scrap";
  price: number;
  donorName: string;
  charityId: string;
  status: "available" | "sold" | "scrap";
  imageUrl: string;
}

export interface Donation {
  id: string;
  companyName: string;
  contactEmail: string;
  partsDescription: string;
  quantity: number;
  conditionEstimate: string;
  status: "pending" | "approved" | "rejected" | "listed";
  submittedAt: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  items: PCPart[];
  totalPrice: number;
  orderDate: string;
}

export interface Charity {
  id: string;
  name: string;
  description: string;
  totalFundsRaised: number;
}

interface StoreContextType {
  inventory: PCPart[];
  donations: Donation[];
  orders: Order[];
  charities: Charity[];
  cart: string[]; // array of PCPart IDs
  theme: "dark" | "light";
  toggleTheme: () => void;
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  submitDonation: (donation: Omit<Donation, "id" | "status" | "submittedAt">) => void;
  updateDonationStatus: (id: string, status: Donation["status"]) => void;
  addPart: (part: Omit<PCPart, "id">) => void;
  updatePart: (id: string, updates: Partial<PCPart>) => void;
  deletePart: (id: string) => void;
  placeOrder: (customer: { name: string; email: string; address: string }) => boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Initial Seed Data
const defaultCharities: Charity[] = [
  { id: "world-computer-exchange", name: "World Computer Exchange", description: "Provides computers and digital literacy training to youth in developing countries.", totalFundsRaised: 1250 },
  { id: "eff", name: "Electronic Frontier Foundation", description: "Defends digital privacy, free speech, and innovation in the digital age.", totalFundsRaised: 890 },
  { id: "direct-relief", name: "Direct Relief", description: "Provides humanitarian medical aid to people affected by poverty or emergencies.", totalFundsRaised: 1420 },
];

const defaultInventory: PCPart[] = [
  {
    id: "part-1",
    name: "Intel Core i7-10700K CPU",
    category: "CPU",
    specs: { Socket: "LGA1200", Cores: "8", Threads: "16", "Base Clock": "3.8 GHz", Boost: "5.1 GHz" },
    condition: "Good",
    price: 120,
    donorName: "TechCorp LLC",
    charityId: "world-computer-exchange",
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&q=80"
  },
  {
    id: "part-2",
    name: "NVIDIA GeForce RTX 3070 GPU",
    category: "GPU",
    specs: { VRAM: "8GB GDDR6", Interface: "PCIe 4.0 x16", Output: "3x DP, 1x HDMI" },
    condition: "Like New",
    price: 310,
    donorName: "Cyberdyne Systems",
    charityId: "eff",
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&q=80"
  },
  {
    id: "part-3",
    name: "Corsair Vengeance LPX 16GB DDR4 RAM",
    category: "RAM",
    specs: { Capacity: "16GB (2x8GB)", Speed: "3200 MHz", Type: "DDR4", CAS: "16" },
    condition: "New",
    price: 45,
    donorName: "Initech",
    charityId: "direct-relief",
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1562976540-1502c2145186?w=400&q=80"
  },
  {
    id: "part-4",
    name: "ASUS ROG Strix B550-F Gaming Motherboard",
    category: "Motherboard",
    specs: { Socket: "AM4", Chipset: "B550", Form: "ATX", Memory: "4x DDR4" },
    condition: "Good",
    price: 95,
    donorName: "Initech",
    charityId: "direct-relief",
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80"
  },
  {
    id: "part-5",
    name: "EVGA SuperNOVA 750W G3 Power Supply",
    category: "PSU",
    specs: { Power: "750W", Rating: "80+ Gold", Modular: "Fully", Fan: "130mm HDB" },
    condition: "Like New",
    price: 65,
    donorName: "Hooli",
    charityId: "world-computer-exchange",
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&q=80"
  },
  {
    id: "part-6",
    name: "NZXT H510 Flow Mid-Tower Case",
    category: "Case",
    specs: { Form: "ATX Mid-Tower", Weight: "6.6 kg", Radiator: "Up to 280mm" },
    condition: "Fair",
    price: 40,
    donorName: "TechCorp LLC",
    charityId: "eff",
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?w=400&q=80"
  },
  {
    id: "part-7",
    name: "Samsung 970 EVO Plus 1TB NVMe SSD",
    category: "Storage",
    specs: { Capacity: "1TB", Form: "M.2 (2280)", Interface: "PCIe Gen 3x4", Read: "3500 MB/s", Write: "3300 MB/s" },
    condition: "Like New",
    price: 55,
    donorName: "Cyberdyne Systems",
    charityId: "direct-relief",
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80"
  }
];

const defaultDonations: Donation[] = [
  {
    id: "don-1",
    companyName: "Acme Corp",
    contactEmail: "it@acme.com",
    partsDescription: "15x Intel Core i5 CPUs (8th Gen), 10x 8GB DDR4 RAM sticks, 5x 500W Power Supplies",
    quantity: 30,
    conditionEstimate: "Good - Removed from working office PCs during an upgrade.",
    status: "approved",
    submittedAt: "2026-07-10T14:32:00Z"
  },
  {
    id: "don-2",
    companyName: "Globex Industries",
    contactEmail: "hardware@globex.org",
    partsDescription: "4x NVIDIA GTX 1060 GPUs, 2x ATX Cases, 3x Intel Motherboards",
    quantity: 9,
    conditionEstimate: "Fair - Some dust, fans spinning fine, fully tested.",
    status: "pending",
    submittedAt: "2026-07-12T09:15:00Z"
  }
];

const defaultOrders: Order[] = [
  {
    id: "ord-1",
    customerName: "Alice Smith",
    customerEmail: "alice@gmail.com",
    shippingAddress: "123 Main St, Seattle, WA 98101",
    items: [
      {
        id: "part-old-1",
        name: "AMD Ryzen 5 3600 CPU",
        category: "CPU",
        specs: { Socket: "AM4" },
        condition: "Good",
        price: 75,
        donorName: "TechCorp LLC",
        charityId: "world-computer-exchange",
        status: "sold",
        imageUrl: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&q=80"
      }
    ],
    totalPrice: 75,
    orderDate: "2026-07-08T18:24:00Z"
  }
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [inventory, setInventory] = useState<PCPart[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [charities, setCharities] = useState<Charity[]>([]);
  const [cart, setCart] = useState<string[]>([]);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem("pcrecycle_theme") as "dark" | "light" | null;
      if (storedTheme) {
        setTheme(storedTheme);
        document.documentElement.className = storedTheme === "light" ? "light-theme" : "";
      } else {
        document.documentElement.className = "";
      }

      const storedInventory = localStorage.getItem("pcrecycle_inventory");
      const storedDonations = localStorage.getItem("pcrecycle_donations");
      const storedOrders = localStorage.getItem("pcrecycle_orders");
      const storedCharities = localStorage.getItem("pcrecycle_charities");
      const storedCart = localStorage.getItem("pcrecycle_cart");

      setInventory(storedInventory ? JSON.parse(storedInventory) : defaultInventory);
      setDonations(storedDonations ? JSON.parse(storedDonations) : defaultDonations);
      setOrders(storedOrders ? JSON.parse(storedOrders) : defaultOrders);
      setCharities(storedCharities ? JSON.parse(storedCharities) : defaultCharities);
      setCart(storedCart ? JSON.parse(storedCart) : []);
    } catch (e) {
      console.error("Error loading data from localStorage:", e);
      setInventory(defaultInventory);
      setDonations(defaultDonations);
      setOrders(defaultOrders);
      setCharities(defaultCharities);
      setCart([]);
    }
    setIsLoaded(true);
  }, []);

  // Save changes to local storage when state updates
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("pcrecycle_inventory", JSON.stringify(inventory));
  }, [inventory, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("pcrecycle_donations", JSON.stringify(donations));
  }, [donations, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("pcrecycle_orders", JSON.stringify(orders));
  }, [orders, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("pcrecycle_charities", JSON.stringify(charities));
  }, [charities, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("pcrecycle_cart", JSON.stringify(cart));
  }, [cart, isLoaded]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("pcrecycle_theme", nextTheme);
    document.documentElement.className = nextTheme === "light" ? "light-theme" : "";
  };

  const addToCart = (id: string) => {
    if (!cart.includes(id)) {
      setCart((prev) => [...prev, id]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const submitDonation = (donation: Omit<Donation, "id" | "status" | "submittedAt">) => {
    const newDonation: Donation = {
      ...donation,
      id: `don-${Date.now()}`,
      status: "pending",
      submittedAt: new Date().toISOString(),
    };
    setDonations((prev) => [newDonation, ...prev]);
  };

  const updateDonationStatus = (id: string, status: Donation["status"]) => {
    setDonations((prev) =>
      prev.map((don) => (don.id === id ? { ...don, status } : don))
    );
  };

  const addPart = (part: Omit<PCPart, "id">) => {
    const newPart: PCPart = {
      ...part,
      id: `part-${Date.now()}`,
    };
    setInventory((prev) => [newPart, ...prev]);
  };

  const updatePart = (id: string, updates: Partial<PCPart>) => {
    setInventory((prev) =>
      prev.map((part) => (part.id === id ? { ...part, ...updates } : part))
    );
  };

  const deletePart = (id: string) => {
    setInventory((prev) => prev.filter((part) => part.id !== id));
    removeFromCart(id);
  };

  const placeOrder = (customer: { name: string; email: string; address: string }) => {
    if (cart.length === 0) return false;

    // Get actual items in cart
    const cartItems = inventory.filter((part) => cart.includes(part.id) && part.status === "available");
    if (cartItems.length === 0) return false;

    const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

    // Create order
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      customerName: customer.name,
      customerEmail: customer.email,
      shippingAddress: customer.address,
      items: cartItems,
      totalPrice,
      orderDate: new Date().toISOString(),
    };

    // Mark items as sold
    const itemIds = cartItems.map((item) => item.id);
    setInventory((prev) =>
      prev.map((part) => (itemIds.includes(part.id) ? { ...part, status: "sold" } : part))
    );

    // Update charities funds raised based on item allocation
    setCharities((prev) =>
      prev.map((charity) => {
        const matchingItems = cartItems.filter((item) => item.charityId === charity.id);
        if (matchingItems.length === 0) return charity;
        const fundsGenerated = matchingItems.reduce((sum, item) => sum + item.price, 0);
        return {
          ...charity,
          totalFundsRaised: charity.totalFundsRaised + fundsGenerated,
        };
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return true;
  };

  return (
    <StoreContext.Provider
      value={{
        inventory,
        donations,
        orders,
        charities,
        cart,
        theme,
        toggleTheme,
        addToCart,
        removeFromCart,
        clearCart,
        submitDonation,
        updateDonationStatus,
        addPart,
        updatePart,
        deletePart,
        placeOrder,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
