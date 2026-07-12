"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

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
  submitDonation: (donation: Omit<Donation, "id" | "status" | "submittedAt">) => Promise<void>;
  updateDonationStatus: (id: string, status: Donation["status"]) => Promise<void>;
  addPart: (part: Omit<PCPart, "id">) => Promise<void>;
  updatePart: (id: string, updates: Partial<PCPart>) => Promise<void>;
  deletePart: (id: string) => Promise<void>;
  placeOrder: (customer: { name: string; email: string; address: string }) => Promise<boolean>;
  isUsingCloudDb: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Initial Seed Data (Fallbacks for Local Storage)
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

// Mapping helper functions
const mapDbToPart = (db: any): PCPart => ({
  id: db.id,
  name: db.name,
  category: db.category,
  specs: db.specs || {},
  condition: db.condition,
  price: Number(db.price),
  donorName: db.donor_name,
  charityId: db.charity_id,
  status: db.status,
  imageUrl: db.image_url || "",
});

const mapPartToDb = (part: Omit<PCPart, "id"> | PCPart) => ({
  name: part.name,
  category: part.category,
  specs: part.specs,
  condition: part.condition,
  price: part.price,
  donor_name: part.donorName,
  charity_id: part.charityId,
  status: part.status,
  image_url: part.imageUrl,
});

const mapDbToDonation = (db: any): Donation => ({
  id: db.id,
  companyName: db.company_name,
  contactEmail: db.contact_email,
  partsDescription: db.parts_description,
  quantity: db.quantity,
  conditionEstimate: db.condition_estimate,
  status: db.status,
  submittedAt: db.submitted_at,
});

const mapDonationToDb = (don: Omit<Donation, "id" | "status" | "submittedAt"> | Donation) => ({
  company_name: don.companyName,
  contact_email: don.contactEmail,
  parts_description: don.partsDescription,
  quantity: don.quantity,
  condition_estimate: don.conditionEstimate,
  status: "status" in don ? don.status : "pending",
});

const mapDbToCharity = (db: any): Charity => ({
  id: db.id,
  name: db.name,
  description: db.description || "",
  totalFundsRaised: Number(db.total_funds_raised || 0),
});

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [inventory, setInventory] = useState<PCPart[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [charities, setCharities] = useState<Charity[]>([]);
  const [cart, setCart] = useState<string[]>([]);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  
  const [isUsingCloudDb, setIsUsingCloudDb] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Sync theme and cart which are always local features
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem("pcrecycle_theme") as "dark" | "light" | null;
      if (storedTheme) {
        setTheme(storedTheme);
        document.documentElement.className = storedTheme === "light" ? "light-theme" : "";
      }

      const storedCart = localStorage.getItem("pcrecycle_cart");
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    } catch (e) {
      console.error("Local storage load error:", e);
    }
  }, []);

  // Save Cart to local storage
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("pcrecycle_cart", JSON.stringify(cart));
  }, [cart, isLoaded]);

  // Main Load Effect (Local Storage OR Supabase Hybrid)
  useEffect(() => {
    const loadDatabase = async () => {
      const useCloud = isSupabaseConfigured();
      setIsUsingCloudDb(useCloud);

      if (useCloud) {
        try {
          console.log("PCCycle: Supabase is configured. Fetching database from cloud...");
          
          // 1. Fetch Charities
          const { data: dbCharities, error: charError } = await supabase
            .from("charities")
            .select("*");
          if (charError) throw charError;

          // 2. Fetch Inventory
          const { data: dbInventory, error: invError } = await supabase
            .from("inventory")
            .select("*");
          if (invError) throw invError;

          // 3. Fetch Donations
          const { data: dbDonations, error: donError } = await supabase
            .from("donations")
            .select("*");
          if (donError) throw donError;

          // 4. Fetch Orders and Links
          const { data: dbOrders, error: ordError } = await supabase
            .from("orders")
            .select("*");
          if (ordError) throw ordError;

          const { data: dbLinks, error: linkError } = await supabase
            .from("order_items")
            .select("*");
          if (linkError) throw linkError;

          // Map items
          const mappedInventory = dbInventory.map(mapDbToPart);
          const mappedCharities = dbCharities.map(mapDbToCharity);
          const mappedDonations = dbDonations.map(mapDbToDonation);

          const mappedOrders = dbOrders.map((ord: any) => {
            const orderLinks = dbLinks.filter((lnk: any) => lnk.order_id === ord.id);
            const partIds = orderLinks.map((lnk: any) => lnk.part_id);
            const orderItems = mappedInventory.filter((item) => partIds.includes(item.id));
            
            return {
              id: ord.id,
              customerName: ord.customer_name,
              customerEmail: ord.customer_email,
              shippingAddress: ord.shipping_address,
              totalPrice: Number(ord.total_price),
              orderDate: ord.order_date,
              items: orderItems,
            };
          });

          setCharities(mappedCharities);
          setInventory(mappedInventory);
          setDonations(mappedDonations);
          setOrders(mappedOrders);
        } catch (e) {
          console.error("Supabase load failed. Falling back to localStorage.", e);
          setIsUsingCloudDb(false);
          loadLocalStorageData();
        }
      } else {
        console.log("PCCycle: Supabase not configured. Using local storage mock database.");
        loadLocalStorageData();
      }
      setIsLoaded(true);
    };

    const loadLocalStorageData = () => {
      try {
        const storedInventory = localStorage.getItem("pcrecycle_inventory");
        const storedDonations = localStorage.getItem("pcrecycle_donations");
        const storedOrders = localStorage.getItem("pcrecycle_orders");
        const storedCharities = localStorage.getItem("pcrecycle_charities");

        setInventory(storedInventory ? JSON.parse(storedInventory) : defaultInventory);
        setDonations(storedDonations ? JSON.parse(storedDonations) : []);
        setOrders(storedOrders ? JSON.parse(storedOrders) : []);
        setCharities(storedCharities ? JSON.parse(storedCharities) : defaultCharities);
      } catch (e) {
        console.error("Error loading localStorage:", e);
      }
    };

    loadDatabase();
  }, []);

  // Save changes to local storage ONLY if running in local fallback mode
  useEffect(() => {
    if (!isLoaded || isUsingCloudDb) return;
    localStorage.setItem("pcrecycle_inventory", JSON.stringify(inventory));
  }, [inventory, isLoaded, isUsingCloudDb]);

  useEffect(() => {
    if (!isLoaded || isUsingCloudDb) return;
    localStorage.setItem("pcrecycle_donations", JSON.stringify(donations));
  }, [donations, isLoaded, isUsingCloudDb]);

  useEffect(() => {
    if (!isLoaded || isUsingCloudDb) return;
    localStorage.setItem("pcrecycle_orders", JSON.stringify(orders));
  }, [orders, isLoaded, isUsingCloudDb]);

  useEffect(() => {
    if (!isLoaded || isUsingCloudDb) return;
    localStorage.setItem("pcrecycle_charities", JSON.stringify(charities));
  }, [charities, isLoaded, isUsingCloudDb]);

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

  // Asynchronous Operations mapping to DB or state
  const submitDonation = async (donation: Omit<Donation, "id" | "status" | "submittedAt">) => {
    const id = `don-${Date.now()}`;
    const date = new Date().toISOString();

    const newDonation: Donation = {
      ...donation,
      id,
      status: "pending",
      submittedAt: date,
    };

    if (isUsingCloudDb) {
      const dbRow = {
        id,
        ...mapDonationToDb(donation),
        submitted_at: date,
      };
      const { error } = await supabase.from("donations").insert(dbRow);
      if (error) {
        console.error("Supabase insert donation failed:", error);
        alert("Database connection error. Donation was not logged.");
        return;
      }
    }

    setDonations((prev) => [newDonation, ...prev]);
  };

  const updateDonationStatus = async (id: string, status: Donation["status"]) => {
    if (isUsingCloudDb) {
      const { error } = await supabase
        .from("donations")
        .update({ status })
        .eq("id", id);
      if (error) {
        console.error("Supabase update donation status failed:", error);
        return;
      }
    }

    setDonations((prev) =>
      prev.map((don) => (don.id === id ? { ...don, status } : don))
    );
  };

  const addPart = async (part: Omit<PCPart, "id">) => {
    const id = `part-${Date.now()}`;
    const newPart: PCPart = {
      ...part,
      id,
    };

    if (isUsingCloudDb) {
      const dbRow = {
        id,
        ...mapPartToDb(part),
      };
      const { error } = await supabase.from("inventory").insert(dbRow);
      if (error) {
        console.error("Supabase insert catalog part failed:", error);
        return;
      }
    }

    setInventory((prev) => [newPart, ...prev]);
  };

  const updatePart = async (id: string, updates: Partial<PCPart>) => {
    if (isUsingCloudDb) {
      const dbRow: any = {};
      if (updates.name !== undefined) dbRow.name = updates.name;
      if (updates.category !== undefined) dbRow.category = updates.category;
      if (updates.specs !== undefined) dbRow.specs = updates.specs;
      if (updates.condition !== undefined) dbRow.condition = updates.condition;
      if (updates.price !== undefined) dbRow.price = updates.price;
      if (updates.donorName !== undefined) dbRow.donor_name = updates.donorName;
      if (updates.charityId !== undefined) dbRow.charity_id = updates.charityId;
      if (updates.status !== undefined) dbRow.status = updates.status;
      if (updates.imageUrl !== undefined) dbRow.image_url = updates.imageUrl;

      const { error } = await supabase
        .from("inventory")
        .update(dbRow)
        .eq("id", id);
      if (error) {
        console.error("Supabase update part failed:", error);
        return;
      }
    }

    setInventory((prev) =>
      prev.map((part) => (part.id === id ? { ...part, ...updates } : part))
    );
  };

  const deletePart = async (id: string) => {
    if (isUsingCloudDb) {
      const { error } = await supabase.from("inventory").delete().eq("id", id);
      if (error) {
        console.error("Supabase delete part failed:", error);
        return;
      }
    }

    setInventory((prev) => prev.filter((part) => part.id !== id));
    removeFromCart(id);
  };

  const placeOrder = async (customer: { name: string; email: string; address: string }) => {
    if (cart.length === 0) return false;

    // Filter active items
    const cartItems = inventory.filter((part) => cart.includes(part.id) && part.status === "available");
    if (cartItems.length === 0) return false;

    const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);
    const orderId = `ord-${Date.now()}`;
    const date = new Date().toISOString();

    const newOrder: Order = {
      id: orderId,
      customerName: customer.name,
      customerEmail: customer.email,
      shippingAddress: customer.address,
      items: cartItems,
      totalPrice,
      orderDate: date,
    };

    if (isUsingCloudDb) {
      try {
        // 1. Insert order
        const { error: ordError } = await supabase.from("orders").insert({
          id: orderId,
          customer_name: customer.name,
          customer_email: customer.email,
          shipping_address: customer.address,
          total_price: totalPrice,
          order_date: date,
        });
        if (ordError) throw ordError;

        // 2. Insert order items link
        const linkRows = cartItems.map((item) => ({
          order_id: orderId,
          part_id: item.id,
        }));
        const { error: linkError } = await supabase.from("order_items").insert(linkRows);
        if (linkError) throw linkError;

        // 3. Mark items as sold in DB
        const itemIds = cartItems.map((item) => item.id);
        const { error: invError } = await supabase
          .from("inventory")
          .update({ status: "sold" })
          .in("id", itemIds);
        if (invError) throw invError;

        // 4. Update charities raised totals in DB
        for (const item of cartItems) {
          const charity = charities.find((c) => c.id === item.charityId);
          if (charity) {
            const nextFunds = charity.totalFundsRaised + item.price;
            const { error: charErr } = await supabase
              .from("charities")
              .update({ total_funds_raised: nextFunds })
              .eq("id", item.charityId);
            if (charErr) throw charErr;
          }
        }
      } catch (e) {
        console.error("Supabase order transaction failed:", e);
        alert("Transaction failed on cloud database. Order was aborted.");
        return false;
      }
    }

    // Update state locally (works for both cloud db and localStorage)
    const itemIds = cartItems.map((item) => item.id);
    setInventory((prev) =>
      prev.map((part) => (itemIds.includes(part.id) ? { ...part, status: "sold" } : part))
    );

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
        isUsingCloudDb,
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
