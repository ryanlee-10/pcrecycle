"use client";

import React from "react";
import { ArrowLeft, ShieldCheck, Scale, ScrollText } from "lucide-react";

interface LegalViewProps {
  type: "terms" | "privacy";
  setActiveView: (view: string) => void;
}

export const LegalView: React.FC<LegalViewProps> = ({ type, setActiveView }) => {
  return (
    <div className="space-y-8 pb-16">
      {/* Back Button */}
      <button
        onClick={() => setActiveView("home")}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Shop</span>
      </button>

      {/* Main Content Card */}
      <div className="rounded-xl border border-border/50 bg-card p-6 sm:p-10 space-y-6 max-w-3xl mx-auto">
        {type === "terms" ? (
          <>
            <div className="flex items-center gap-2.5 border-b border-border/50 pb-4 text-primary">
              <Scale className="h-7 w-7 text-primary" />
              <h1 className="text-2xl font-extrabold text-foreground">Terms and Conditions</h1>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              <p className="text-foreground font-semibold">Last Updated: July 12, 2026</p>
              
              <h3 className="text-base font-bold text-foreground mt-4">1. Project Intent & Sandbox Scope</h3>
              <p>
                PCCycle is a static simulation application designed for personal tracking and demonstrating e-waste recycling logistics. No commercial trade, financial transactions, or legal operations occur on this platform.
              </p>

              <h3 className="text-base font-bold text-foreground mt-4">2. Donation Submission Policy</h3>
              <p>
                Corporate hardware donation lists submitted via this site represent simulated data logs. Submitting list data does not constitute a legally binding hardware transfer or pick-up agreement unless separately coordinated by corporate IT representatives.
              </p>

              <h3 className="text-base font-bold text-foreground mt-4">3. Refurbishment Warranty Disclaimer</h3>
              <p>
                All components listed on this website are simulated catalogs. If this template is customized for live deployment, all second-hand components are provided "as-is" without any express or implied warranty, including warranties of merchantability or fitness for a particular purpose.
              </p>

              <h3 className="text-base font-bold text-foreground mt-4">4. Limitation of Liability</h3>
              <p>
                PCCycle is not responsible for any software issues, data loss, hardware damage, or system downtime resulting from utilizing code, frameworks, or instructions derived from this repository.
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2.5 border-b border-border/50 pb-4 text-primary">
              <ShieldCheck className="h-7 w-7 text-primary" />
              <h1 className="text-2xl font-extrabold text-foreground">Privacy Policy</h1>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              <p className="text-foreground font-semibold">Last Updated: July 12, 2026</p>

              <h3 className="text-base font-bold text-foreground mt-4">1. Local Storage Privacy Architecture</h3>
              <p>
                PCCycle respects your complete privacy. Because this application operates entirely statically on GitHub Pages, <strong>no personal data, order details, hardware lists, or email addresses are ever transmitted to any external backend server or database.</strong>
              </p>
              <p>
                All information entered into checkout forms, contact forms, or donation widgets is cached entirely inside your browser's local sandbox environment (`localStorage`).
              </p>

              <h3 className="text-base font-bold text-foreground mt-4">2. Cookies & Tracker Disclosures</h3>
              <p>
                This web application does not run Google Analytics, Facebook Pixels, marketing cookies, or tracking headers. Your traffic history remains isolated.
              </p>

              <h3 className="text-base font-bold text-foreground mt-4">3. External Links Disclaimer</h3>
              <p>
                Our site may contain links to charity websites or social channels. Clicking these links shifts your privacy terms to their respective site policies. We encourage reviewing those policies independently.
              </p>

              <h3 className="text-base font-bold text-foreground mt-4">4. Privacy Policy Modifications</h3>
              <p>
                We reserve the right to modify this statement. Since data is strictly stored in local storage, any updates are limited to text revisions visible here.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
