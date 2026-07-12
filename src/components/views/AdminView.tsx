"use client";

import React, { useState, useEffect } from "react";
import { useStore, PCPart, Donation } from "@/context/StoreContext";
import { Cpu, ShieldCheck, Trash2, Heart, Inbox, List, BarChart3, Mail, PlusCircle, Check, X, ShieldAlert } from "lucide-react";

export const AdminView: React.FC = () => {
  const {
    inventory,
    donations,
    updateDonationStatus,
    addPart,
    deletePart,
    updatePart,
    charities,
    orders,
  } = useStore();

  // Admin sub-tabs
  const [activeTab, setActiveTab] = useState<"dashboard" | "donations" | "catalog" | "messages">("dashboard");

  // Contact messages loaded from local storage
  const [messages, setMessages] = useState<any[]>([]);

  // Intake State
  const [selectedDonationForIntake, setSelectedDonationForIntake] = useState<Donation | null>(null);
  const [intakeForm, setIntakeForm] = useState({
    name: "",
    category: "CPU" as PCPart["category"],
    price: 50,
    condition: "Good" as PCPart["condition"],
    charityId: "world-computer-exchange",
    imageUrl: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&q=80",
    specsKey1: "",
    specsVal1: "",
    specsKey2: "",
    specsVal2: "",
  });

  // Load offline messages
  useEffect(() => {
    try {
      const stored = localStorage.getItem("pcrecycle_messages");
      if (stored) {
        setMessages(JSON.parse(stored));
      } else {
        // Seed initial message if empty
        const initialMsg = [
          {
            id: "msg-seed-1",
            name: "John Doe",
            email: "john@techsolutions.com",
            subject: "Bulk Motherboards Donation Logistics",
            message: "Hello! We have about 40 working server-grade motherboard components. Can we arrange a drop-off or pickup next week?",
            date: new Date(Date.now() - 3600000 * 24).toISOString(),
            read: false,
          },
        ];
        localStorage.setItem("pcrecycle_messages", JSON.stringify(initialMsg));
        setMessages(initialMsg);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  // Update read status for messages
  const markMessageAsRead = (id: string) => {
    const updated = messages.map((m) => (m.id === id ? { ...m, read: true } : m));
    setMessages(updated);
    localStorage.setItem("pcrecycle_messages", JSON.stringify(updated));
  };

  // Delete message
  const deleteMessage = (id: string) => {
    const updated = messages.filter((m) => m.id !== id);
    setMessages(updated);
    localStorage.setItem("pcrecycle_messages", JSON.stringify(updated));
  };

  // Stats calculators
  const totalSales = orders.reduce((sum, o) => sum + o.totalPrice, 0);
  const totalItemsAvailable = inventory.filter((item) => item.status === "available").length;
  const totalItemsSold = inventory.filter((item) => item.status === "sold").length;
  const pendingDonationsCount = donations.filter((don) => don.status === "pending").length;

  // Handle Intake form submission
  const handleIntakeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDonationForIntake) return;

    // Build specs record
    const specs: Record<string, string> = {};
    if (intakeForm.specsKey1 && intakeForm.specsVal1) specs[intakeForm.specsKey1] = intakeForm.specsVal1;
    if (intakeForm.specsKey2 && intakeForm.specsVal2) specs[intakeForm.specsKey2] = intakeForm.specsVal2;

    addPart({
      name: intakeForm.name,
      category: intakeForm.category,
      specs,
      condition: intakeForm.condition,
      price: intakeForm.price,
      donorName: selectedDonationForIntake.companyName,
      charityId: intakeForm.charityId,
      status: "available",
      imageUrl: intakeForm.imageUrl || "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&q=80",
    });

    // Mark donation status as listed
    updateDonationStatus(selectedDonationForIntake.id, "listed");
    setSelectedDonationForIntake(null);
  };

  // Handle reject donation
  const handleRejectDonation = (id: string) => {
    updateDonationStatus(id, "rejected");
  };

  // Tab button components
  interface TabItem {
    id: "dashboard" | "donations" | "catalog" | "messages";
    label: string;
    icon: React.ComponentType<any>;
    badge?: number;
  }

  const tabs: TabItem[] = [
    { id: "dashboard", label: "Overview", icon: BarChart3 },
    { id: "donations", label: "Donations Inbox", icon: Inbox, badge: pendingDonationsCount },
    { id: "catalog", label: "Item Catalog", icon: List },
    { id: "messages", label: "User Messages", icon: Mail, badge: messages.filter((m) => !m.read).length },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground flex items-center gap-2">
            <ShieldAlert className="h-8 w-8 text-primary animate-pulse" />
            Admin Control Console
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Manage physical hardware catalog, incoming corporate donations, and charity payouts.</p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSelectedDonationForIntake(null);
                }}
                className={`flex items-center space-x-1.5 rounded-md px-3 py-2 text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground glow-primary"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
                {!!tab.badge && (
                  <span className="rounded-full bg-rose-500 text-[10px] px-1.5 py-0.5 text-white font-bold">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB CONTENT: 1. Overview */}
      {activeTab === "dashboard" && (
        <div className="space-y-8">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl border border-border/50 bg-card p-5">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Sales Logged</p>
              <p className="text-2xl font-black text-primary mt-1">${totalSales}</p>
            </div>
            <div className="rounded-xl border border-border/50 bg-card p-5">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Available Catalog</p>
              <p className="text-2xl font-black text-foreground mt-1">{totalItemsAvailable} units</p>
            </div>
            <div className="rounded-xl border border-border/50 bg-card p-5">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Units Recycled</p>
              <p className="text-2xl font-black text-foreground mt-1">{totalItemsSold} sold</p>
            </div>
            <div className="rounded-xl border border-border/50 bg-card p-5 bg-primary/5 border-primary/20">
              <p className="text-[10px] font-bold text-primary uppercase tracking-wider">Charity Payout Rate</p>
              <p className="text-2xl font-black text-primary mt-1">100% Net Profit</p>
            </div>
          </div>

          {/* Graphical Distributions (HTML + CSS) */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Charity Distributions bar charts */}
            <div className="rounded-xl border border-border/50 bg-card p-6 space-y-4">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Heart className="h-4.5 w-4.5 text-rose-500 fill-rose-500" />
                Funds Distribution to Charity
              </h3>
              <div className="space-y-4">
                {charities.map((charity) => {
                  const maxFunding = Math.max(...charities.map((c) => c.totalFundsRaised), 1);
                  const percentWidth = (charity.totalFundsRaised / maxFunding) * 100;
                  return (
                    <div key={charity.id} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-foreground">{charity.name}</span>
                        <span className="text-primary font-bold">${charity.totalFundsRaised}</span>
                      </div>
                      <div className="h-2.5 w-full rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-400"
                          style={{ width: `${percentWidth}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sales ledger summary */}
            <div className="rounded-xl border border-border/50 bg-card p-6 space-y-4">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Recent Orders Log</h3>
              {orders.length === 0 ? (
                <p className="text-xs text-muted-foreground/60 italic py-6 text-center">No transactions completed yet.</p>
              ) : (
                <div className="space-y-3 overflow-y-auto max-h-[160px] pr-1">
                  {orders.map((ord) => (
                    <div key={ord.id} className="flex justify-between items-center text-xs border-b border-border/30 pb-2">
                      <div>
                        <p className="font-bold text-foreground">{ord.customerName}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{new Date(ord.orderDate).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-extrabold text-primary">${ord.totalPrice}</p>
                        <p className="text-[9px] text-muted-foreground uppercase mt-0.5">{ord.items.length} units</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 2. Donations Inbox */}
      {activeTab === "donations" && (
        <div className="space-y-6">
          {/* Intake Process Overlay/Card */}
          {selectedDonationForIntake && (
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-primary/20 pb-3">
                <h3 className="text-base font-bold text-foreground flex items-center gap-1.5">
                  <PlusCircle className="h-5 w-5 text-primary" />
                  Intake Process: {selectedDonationForIntake.companyName}
                </h3>
                <button
                  onClick={() => setSelectedDonationForIntake(null)}
                  className="text-muted-foreground hover:text-foreground rounded p-1 hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleIntakeSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-6 text-xs">
                <div className="sm:col-span-3">
                  <label className="block font-semibold text-muted-foreground mb-1">Component Name</label>
                  <input
                    required
                    type="text"
                    value={intakeForm.name}
                    onChange={(e) => setIntakeForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. AMD Ryzen 9 5900X CPU"
                    className="w-full rounded border border-border bg-input px-3 py-2 text-foreground outline-none focus:border-primary/50"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-muted-foreground mb-1">Category</label>
                  <select
                    value={intakeForm.category}
                    onChange={(e) => setIntakeForm((prev) => ({ ...prev, category: e.target.value as PCPart["category"] }))}
                    className="w-full rounded border border-border bg-input px-3 py-2 text-foreground outline-none focus:border-primary/50"
                  >
                    <option value="CPU">CPU</option>
                    <option value="GPU">GPU</option>
                    <option value="RAM">RAM</option>
                    <option value="Motherboard">Motherboard</option>
                    <option value="Storage">Storage</option>
                    <option value="PSU">PSU</option>
                    <option value="Case">Case</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="sm:col-span-1">
                  <label className="block font-semibold text-muted-foreground mb-1">Price ($)</label>
                  <input
                    required
                    type="number"
                    min={1}
                    value={intakeForm.price}
                    onChange={(e) => setIntakeForm((prev) => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                    className="w-full rounded border border-border bg-input px-3 py-2 text-foreground outline-none focus:border-primary/50"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-muted-foreground mb-1">Condition</label>
                  <select
                    value={intakeForm.condition}
                    onChange={(e) => setIntakeForm((prev) => ({ ...prev, condition: e.target.value as PCPart["condition"] }))}
                    className="w-full rounded border border-border bg-input px-3 py-2 text-foreground outline-none focus:border-primary/50"
                  >
                    <option value="New">New</option>
                    <option value="Like New">Like New</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Scrap">Scrap</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-muted-foreground mb-1">Allocated Charity</label>
                  <select
                    value={intakeForm.charityId}
                    onChange={(e) => setIntakeForm((prev) => ({ ...prev, charityId: e.target.value }))}
                    className="w-full rounded border border-border bg-input px-3 py-2 text-foreground outline-none focus:border-primary/50"
                  >
                    {charities.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-muted-foreground mb-1">Image URL</label>
                  <input
                    type="text"
                    value={intakeForm.imageUrl}
                    onChange={(e) => setIntakeForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
                    className="w-full rounded border border-border bg-input px-3 py-2 text-foreground outline-none focus:border-primary/50"
                  />
                </div>

                {/* Specs input */}
                <div className="sm:col-span-3 grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-muted-foreground mb-1">Spec Key 1</label>
                    <input
                      type="text"
                      placeholder="e.g. Socket"
                      value={intakeForm.specsKey1}
                      onChange={(e) => setIntakeForm((prev) => ({ ...prev, specsKey1: e.target.value }))}
                      className="w-full rounded border border-border bg-input px-3 py-2 text-foreground outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-muted-foreground mb-1">Spec Value 1</label>
                    <input
                      type="text"
                      placeholder="e.g. AM4"
                      value={intakeForm.specsVal1}
                      onChange={(e) => setIntakeForm((prev) => ({ ...prev, specsVal1: e.target.value }))}
                      className="w-full rounded border border-border bg-input px-3 py-2 text-foreground outline-none"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3 grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-muted-foreground mb-1">Spec Key 2</label>
                    <input
                      type="text"
                      placeholder="e.g. Cores"
                      value={intakeForm.specsKey2}
                      onChange={(e) => setIntakeForm((prev) => ({ ...prev, specsKey2: e.target.value }))}
                      className="w-full rounded border border-border bg-input px-3 py-2 text-foreground outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-muted-foreground mb-1">Spec Value 2</label>
                    <input
                      type="text"
                      placeholder="e.g. 12"
                      value={intakeForm.specsVal2}
                      onChange={(e) => setIntakeForm((prev) => ({ ...prev, specsVal2: e.target.value }))}
                      className="w-full rounded border border-border bg-input px-3 py-2 text-foreground outline-none"
                    />
                  </div>
                </div>

                <div className="sm:col-span-6 flex justify-end gap-2 pt-2">
                  <button
                    type="submit"
                    className="rounded bg-primary text-primary-foreground font-bold px-4 py-2 hover:bg-primary/95 transition-all glow-primary"
                  >
                    Register Part & List to Shop
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Donation Queue Table */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-secondary/35 text-xs text-muted-foreground">
                <tr>
                  <th className="px-6 py-3.5 text-left font-bold uppercase tracking-wider">Company</th>
                  <th className="px-6 py-3.5 text-left font-bold uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3.5 text-center font-bold uppercase tracking-wider">Qty</th>
                  <th className="px-6 py-3.5 text-center font-bold uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3.5 text-right font-bold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card text-xs">
                {donations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground/60 italic">
                      No corporate donations submitted.
                    </td>
                  </tr>
                ) : (
                  donations.map((don) => (
                    <tr key={don.id} className="hover:bg-secondary/10 transition-colors">
                      <td className="px-6 py-3.5 font-bold text-foreground">
                        {don.companyName}
                        <p className="text-[10px] font-normal text-muted-foreground mt-0.5">{don.contactEmail}</p>
                      </td>
                      <td className="px-6 py-3.5 font-medium text-muted-foreground/95 max-w-[240px] truncate" title={don.partsDescription}>
                        {don.partsDescription}
                      </td>
                      <td className="px-6 py-3.5 text-center text-foreground font-semibold">{don.quantity}</td>
                      <td className="px-6 py-3.5 text-center">
                        <span className={`inline-block rounded px-2.5 py-0.5 text-[9px] font-extrabold uppercase ${
                          don.status === "approved" || don.status === "listed"
                            ? "bg-emerald-500/10 text-primary"
                            : don.status === "pending"
                            ? "bg-amber-500/10 text-amber-400"
                            : "bg-rose-500/10 text-rose-400"
                        }`}>
                          {don.status}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        {don.status === "pending" ? (
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedDonationForIntake(don);
                                setIntakeForm((prev) => ({
                                  ...prev,
                                  name: don.partsDescription.split(",")[0] || "",
                                  price: 45,
                                }));
                              }}
                              className="rounded bg-primary/10 text-primary hover:bg-primary p-1.5 transition-colors border border-primary/20 hover:text-white"
                              title="Approve & Intake Part"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleRejectDonation(don.id)}
                              className="rounded bg-rose-500/10 text-rose-400 hover:bg-rose-500 p-1.5 transition-colors border border-rose-500/20 hover:text-white"
                              title="Reject Donation"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-muted-foreground/60 italic">Processed</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 3. Item Catalog */}
      {activeTab === "catalog" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-secondary/35 text-xs text-muted-foreground">
                <tr>
                  <th className="px-6 py-3.5 text-left font-bold uppercase tracking-wider">Part Details</th>
                  <th className="px-6 py-3.5 text-left font-bold uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3.5 text-center font-bold uppercase tracking-wider">Donor</th>
                  <th className="px-6 py-3.5 text-center font-bold uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3.5 text-center font-bold uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3.5 text-right font-bold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card text-xs">
                {inventory.map((item) => (
                  <tr key={item.id} className="hover:bg-secondary/10 transition-colors">
                    <td className="px-6 py-3.5 font-bold text-foreground">
                      {item.name}
                      <p className="text-[10px] font-normal text-muted-foreground mt-0.5">{item.condition} condition</p>
                    </td>
                    <td className="px-6 py-3.5 text-muted-foreground font-semibold">{item.category}</td>
                    <td className="px-6 py-3.5 text-center text-muted-foreground">{item.donorName}</td>
                    <td className="px-6 py-3.5 text-center">
                      <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold uppercase ${
                        item.status === "available"
                          ? "bg-emerald-500/10 text-primary"
                          : item.status === "sold"
                          ? "bg-indigo-500/10 text-indigo-400"
                          : "bg-rose-500/10 text-rose-400"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) => updatePart(item.id, { price: parseInt(e.target.value) || 0 })}
                        className="w-16 rounded border border-border bg-input px-2 py-1 text-center font-bold text-primary outline-none focus:border-primary/50"
                      />
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <button
                        onClick={() => deletePart(item.id)}
                        className="text-muted-foreground hover:text-rose-400 p-1.5 rounded hover:bg-secondary transition-colors"
                        title="Delete listing"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 4. User Messages */}
      {activeTab === "messages" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {messages.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border py-12 text-center text-muted-foreground/60 italic text-xs">
                No user messages found.
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`rounded-xl border p-5 space-y-3 transition-all ${
                    msg.read ? "bg-card border-border/40" : "bg-primary/5 border-primary/20 glow-primary"
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-foreground">{msg.name}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{msg.email} • {new Date(msg.date).toLocaleString()}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {!msg.read && (
                        <button
                          onClick={() => markMessageAsRead(msg.id)}
                          className="rounded bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold px-2 py-1 hover:bg-primary hover:text-white transition-all"
                        >
                          Mark Read
                        </button>
                      )}
                      <button
                        onClick={() => deleteMessage(msg.id)}
                        className="text-muted-foreground hover:text-rose-400 p-1 rounded hover:bg-secondary transition-colors"
                        title="Delete log"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-border/30 pt-3">
                    <p className="text-xs font-bold text-foreground">Subject: {msg.subject}</p>
                    <p className="text-xs text-muted-foreground/90 mt-1 leading-relaxed bg-secondary/10 p-3 rounded mt-2 font-medium">
                      {msg.message}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
