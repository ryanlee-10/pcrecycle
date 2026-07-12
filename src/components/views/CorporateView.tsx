"use client";

import React, { useState } from "react";
import { useStore, Donation } from "@/context/StoreContext";
import { ShieldCheck, Heart, Trash2, ArrowUpRight, Cpu, Building2, Send } from "lucide-react";

export const CorporateView: React.FC = () => {
  const { donations, submitDonation, inventory, orders } = useStore();

  // Form state
  const [formData, setFormData] = useState({
    companyName: "",
    contactEmail: "",
    partsDescription: "",
    quantity: 1,
    conditionEstimate: "Good - Removed from working systems.",
  });

  const [companySearch, setCompanySearch] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? parseInt(value) || 1 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitDonation(formData);
    setSubmitted(true);
    setFormData({
      companyName: formData.companyName, // Keep company name for fast subsequent entries
      contactEmail: formData.contactEmail,
      partsDescription: "",
      quantity: 1,
      conditionEstimate: "Good - Removed from working systems.",
    });
  };

  // Corporate Impact Metrics Generator based on inventory and orders
  // Let's filter inventory parts that match the donorName (matches companySearch)
  const matchingDonor = companySearch.trim().toLowerCase();
  
  // Find past donations for search query
  const corporateDonations = donations.filter((don) =>
    matchingDonor ? don.companyName.toLowerCase().includes(matchingDonor) : false
  );

  // Find listed items in inventory
  const matchingInventory = inventory.filter((item) =>
    matchingDonor ? item.donorName.toLowerCase().includes(matchingDonor) : false
  );

  // Calculate environmental stats for searched corporate donor
  const itemsDonatedCount = matchingInventory.length + corporateDonations.reduce((sum, d) => sum + (d.status === "approved" ? d.quantity : 0), 0);
  const carbonOffsetKg = itemsDonatedCount * 42.5; // Average kg CO2 offset per component
  const eWasteLbs = itemsDonatedCount * 3.6; // Average lbs offset per component
  
  const soldItems = matchingInventory.filter((item) => item.status === "sold");
  const fundsRaisedForCharity = soldItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <div className="text-center sm:text-left space-y-2">
        <h1 className="text-3xl font-extrabold text-foreground">Corporate Donation Portal</h1>
        <p className="text-sm text-muted-foreground">
          Partner with PCCycle to recycle corporate IT waste, earn certified carbon credits, and fund humanitarian non-profits.
        </p>
      </div>

      {/* Grid: Submit Donation & Search Impact */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left: Donation Form */}
        <div className="lg:col-span-6 rounded-xl border border-border/50 bg-card p-6 space-y-6">
          <div className="flex items-center gap-2 border-b border-border/40 pb-3">
            <Building2 className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Submit Bulk Donation</h2>
          </div>

          {submitted ? (
            <div className="flex flex-col items-center justify-center text-center py-10 space-y-4">
              <div className="rounded-full bg-primary/10 p-3 text-primary">
                <ShieldCheck className="h-10 w-10 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Donation Logged!</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-[280px] mx-auto">
                  Your donation request has been recorded. It is currently under review in the Admin inbox.
                </p>
              </div>
              <button
                onClick={() => setSubmitted(false)}
                className="rounded-md bg-secondary text-foreground hover:bg-secondary/80 px-4 py-2 text-xs font-semibold transition-colors"
              >
                Log Another Donation
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Company Name</label>
                  <input
                    required
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="e.g. Acme Inc"
                    className="w-full rounded border border-border bg-input px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Contact Email</label>
                  <input
                    required
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    placeholder="it@acme.com"
                    className="w-full rounded border border-border bg-input px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Estimated Quantity (Units)</label>
                <input
                  required
                  type="number"
                  name="quantity"
                  min={1}
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="w-full rounded border border-border bg-input px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Description of Hardware</label>
                <textarea
                  required
                  rows={4}
                  name="partsDescription"
                  value={formData.partsDescription}
                  onChange={handleInputChange}
                  placeholder="List parts e.g. 10x Intel i7-9700 CPUs, 8x DDR4 16GB RAM modules..."
                  className="w-full rounded border border-border bg-input px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50 resize-none text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Estimated Condition & Notes</label>
                <select
                  name="conditionEstimate"
                  value={formData.conditionEstimate}
                  onChange={handleInputChange}
                  className="w-full rounded border border-border bg-input px-3 py-2 text-xs text-foreground outline-none focus:border-primary/50"
                >
                  <option value="Excellent - Pulled from active server upgrade room.">Excellent - Like New/Server Grade</option>
                  <option value="Good - Removed from working office PCs during upgrade.">Good - Standard Office Use</option>
                  <option value="Fair - Dusty but tested working.">Fair - Needs Cleaning/Refurbishing</option>
                  <option value="Mixed - Salvage/Scrap/Parts only.">Mixed - Salvage & Scrap Parts</option>
                </select>
              </div>

              <button
                type="submit"
                className="flex items-center justify-center gap-1.5 rounded-md bg-primary py-2.5 px-4 text-xs font-semibold text-primary-foreground hover:bg-primary/95 transition-all glow-primary"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Submit Donation Request</span>
              </button>
            </form>
          )}
        </div>

        {/* Right: Corporate Impact Lookup Dashboard */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-xl border border-border/50 bg-card p-6 space-y-4">
            <h2 className="text-lg font-bold text-foreground">Partner Impact Lookup</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Enter your organization name below to see your customized sustainability footprint and charity contributions.
            </p>

            <div className="flex gap-2">
              <Building2 className="h-5 w-5 text-muted-foreground absolute ml-3 mt-2.5" />
              <input
                type="text"
                placeholder="e.g. Acme Corp or TechCorp LLC"
                value={companySearch}
                onChange={(e) => setCompanySearch(e.target.value)}
                className="w-full rounded border border-border bg-input py-2 pl-10 pr-4 text-xs text-foreground outline-none focus:border-primary/50"
              />
            </div>

            {companySearch.trim() === "" ? (
              <div className="rounded-lg bg-secondary/15 p-6 text-center text-xs text-muted-foreground border border-border/40">
                Type your company name to generate your environmental dashboard.<br />
                Try searching <strong>TechCorp LLC</strong> or <strong>Initech</strong>.
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded bg-secondary/20 p-3 border border-border/50 text-center">
                    <p className="text-lg font-bold text-foreground">{itemsDonatedCount}</p>
                    <p className="text-[9px] uppercase font-bold text-muted-foreground mt-0.5">Parts Recycled</p>
                  </div>
                  <div className="rounded bg-secondary/20 p-3 border border-border/50 text-center">
                    <p className="text-lg font-bold text-emerald-400">{carbonOffsetKg.toFixed(0)} kg</p>
                    <p className="text-[9px] uppercase font-bold text-muted-foreground mt-0.5">CO2 Offset</p>
                  </div>
                  <div className="rounded bg-secondary/20 p-3 border border-border/50 text-center">
                    <p className="text-lg font-bold text-primary">${fundsRaisedForCharity}</p>
                    <p className="text-[9px] uppercase font-bold text-muted-foreground mt-0.5">Raised for Charity</p>
                  </div>
                </div>

                <div className="rounded-lg bg-emerald-500/10 p-3.5 border border-emerald-500/20 text-[11px] text-emerald-300/90 leading-relaxed">
                  🌍 Your donations saved approximately <strong>{eWasteLbs.toFixed(1)} lbs</strong> of metals, glass, and toxic silicon from entering local landfills.
                </div>

                {/* Donation Status table */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Submitted Logs ({corporateDonations.length})</h4>
                  {corporateDonations.length === 0 ? (
                    <p className="text-[11px] text-muted-foreground/60 italic">No raw donation submissions found matching this query. Check inventory parts above.</p>
                  ) : (
                    <div className="overflow-x-auto rounded-lg border border-border text-xs">
                      <table className="min-w-full divide-y divide-border">
                        <thead className="bg-secondary/40">
                          <tr>
                            <th className="px-4 py-2 text-left font-bold text-muted-foreground">Description</th>
                            <th className="px-4 py-2 text-center font-bold text-muted-foreground">Qty</th>
                            <th className="px-4 py-2 text-right font-bold text-muted-foreground">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border bg-card">
                          {corporateDonations.map((don) => (
                            <tr key={don.id} className="hover:bg-secondary/10 transition-colors">
                              <td className="px-4 py-2 font-medium text-foreground line-clamp-1">{don.partsDescription}</td>
                              <td className="px-4 py-2 text-center text-muted-foreground">{don.quantity}</td>
                              <td className="px-4 py-2 text-right">
                                <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                                  don.status === "approved" || don.status === "listed"
                                    ? "bg-emerald-500/10 text-primary"
                                    : don.status === "pending"
                                    ? "bg-amber-500/10 text-amber-400"
                                    : "bg-rose-500/10 text-rose-400"
                                }`}>
                                  {don.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
