import React from "react";
import Layout from "../Layout";

export default function Wardrobe() {
  // Later we’ll plug in the real wardrobe component here
  return (
    <Layout currentPageName="Wardrobe">
      <section className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Your Wardrobe</h1>
        <p className="text-neutral-400 mb-6">
          This is where your scanned and added pieces will live. For now, it’s a
          simple placeholder.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {["White tee", "Blue jeans", "Black blazer", "Grey hoodie"].map(
            (item) => (
              <div
                key={item}
                className="rounded-xl border border-neutral-700 bg-neutral-900/40 p-4"
              >
                <div className="h-28 rounded-lg bg-neutral-800 mb-3" />
                <p className="font-medium">{item}</p>
                <p className="text-xs text-neutral-400">
                  Example item – will be replaced by real scans.
                </p>
              </div>
            )
          )}
        </div>
      </section>
    </Layout>
  );
}
