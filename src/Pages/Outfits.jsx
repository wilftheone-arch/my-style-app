import React from "react";
import Layout from "../Layout";

export default function Outfits() {
  return (
    <Layout currentPageName="Outfits">
      <section className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Outfit Ideas</h1>
        <p className="text-neutral-400 mb-6">
          Generated looks using the pieces in your wardrobe (mock data for now).
        </p>

        <div className="space-y-4">
          <div className="rounded-xl border border-neutral-700 bg-neutral-900/40 p-4">
            <h2 className="font-semibold mb-2">Casual café run</h2>
            <p className="text-sm text-neutral-400">
              White tee + blue jeans + white trainers + navy tote.
            </p>
          </div>
          <div className="rounded-xl border border-neutral-700 bg-neutral-900/40 p-4">
            <h2 className="font-semibold mb-2">Library study day</h2>
            <p className="text-sm text-neutral-400">
              Black leggings + oversized hoodie + chunky scarf.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
