"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";

export const ContactView: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Log the message into local storage contact box for the Admin to read
    try {
      const stored = localStorage.getItem("pcrecycle_messages");
      const messages = stored ? JSON.parse(stored) : [];
      const newMsg = {
        id: `msg-${Date.now()}`,
        ...formData,
        date: new Date().toISOString(),
        read: false,
      };
      localStorage.setItem("pcrecycle_messages", JSON.stringify([newMsg, ...messages]));
    } catch (err) {
      console.error("Failed to save contact message:", err);
    }

    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="text-center sm:text-left">
        <h1 className="text-3xl font-extrabold text-foreground">Contact Us</h1>
        <p className="text-sm text-muted-foreground mt-1">Have questions about donation logistics, hardware certification, or custom requests?</p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
        {/* Left Column: Form */}
        <div className="md:col-span-7 rounded-xl border border-border/50 bg-card p-6">
          {submitted ? (
            <div className="flex flex-col items-center justify-center text-center py-12 space-y-4">
              <div className="rounded-full bg-primary/10 p-3 text-primary">
                <CheckCircle2 className="h-10 w-10 animate-bounce" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Message Sent!</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-[280px] mx-auto">
                  Thank you for reaching out. Your message has been saved in the offline local database for Admin review.
                </p>
              </div>
              <button
                onClick={() => setSubmitted(false)}
                className="rounded-md bg-secondary text-foreground hover:bg-secondary/80 px-4 py-2 text-xs font-semibold transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Your Name</label>
                  <input
                    required
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full rounded border border-border bg-input px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Email Address</label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full rounded border border-border bg-input px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Subject</label>
                <input
                  required
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full rounded border border-border bg-input px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Message</label>
                <textarea
                  required
                  rows={5}
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full rounded border border-border bg-input px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50 resize-none"
                />
              </div>

              <button
                type="submit"
                className="flex items-center justify-center gap-1.5 rounded-md bg-primary py-2.5 px-4 text-xs font-semibold text-primary-foreground hover:bg-primary/95 transition-all glow-primary"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Contact Details */}
        <div className="md:col-span-5 space-y-6">
          <div className="rounded-xl border border-border/50 bg-card p-6 space-y-6">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Contact Information</h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-foreground">Email Us</p>
                  <p className="text-xs text-muted-foreground mt-0.5">recycle@pccycle.org</p>
                  <p className="text-[10px] text-muted-foreground/75">Monitored during standard business hours</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-foreground">Call Us</p>
                  <p className="text-xs text-muted-foreground mt-0.5">+1 (800) 555-PART</p>
                  <p className="text-[10px] text-muted-foreground/75">Toll-free donation hotline</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-foreground">Refurbishing Center</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    GreenTech Industrial Park, Suite 404<br />
                    Seattle, WA 98108
                  </p>
                  <p className="text-[10px] text-muted-foreground/75">Drop-offs by pre-scheduled appointment only</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border/50 bg-secondary/10 p-5 text-xs text-muted-foreground leading-relaxed">
            <strong>Donation Logistics Note:</strong> Large pallet-sized donations from enterprise networks or corporate datacenter decommissions can be collected directly by our freight transport partners. Please submit a request via the <strong>Corporate Portal</strong>.
          </div>
        </div>
      </div>
    </div>
  );
};
