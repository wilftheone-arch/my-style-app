import React, { useState } from "react";
import Layout from "../Layout";

export default function Profile() {
  const [styleVibe, setStyleVibe] = useState("casual");
  const [colourFocus, setColourFocus] = useState("neutrals");
  const [budget, setBudget] = useState("mid");
  const [newsletter, setNewsletter] = useState(true);

  return (
    <Layout currentPageName="Profile">
      <section className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Your Style Profile</h1>
        <p className="text-neutral-400 mb-8">
          These preferences will guide future outfit ideas and shopping
          suggestions.
        </p>

        <div className="grid gap-8 md:grid-cols-[2fr,1.5fr]">
          {/* Form */}
          <form className="space-y-6">
            {/* Style vibe */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Main style vibe
              </label>
              <select
                className="w-full rounded-lg border border-neutral-700 bg-neutral-900/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={styleVibe}
                onChange={(e) => setStyleVibe(e.target.value)}
              >
                <option value="casual">Casual / everyday</option>
                <option value="minimal">Minimal & clean lines</option>
                <option value="edgy">Edgy / streetwear</option>
                <option value="feminine">Soft & feminine</option>
              </select>
            </div>

            {/* Colours */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Colour focus
              </label>
              <select
                className="w-full rounded-lg border border-neutral-700 bg-neutral-900/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={colourFocus}
                onChange={(e) => setColourFocus(e.target.value)}
              >
                <option value="neutrals">Neutrals (black, white, beige)</option>
                <option value="blues">Blues & cool tones</option>
                <option value="pastels">Pastels (baby blue, pink, lilac)</option>
                <option value="bold">Bold colours</option>
              </select>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Typical budget per item
              </label>
              <div className="grid grid-cols-3 gap-2 text-sm">
                {[
                  { id: "low", label: "$" },
                  { id: "mid", label: "$$" },
                  { id: "high", label: "$$$" },
                ].map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setBudget(option.id)}
                    className={`rounded-lg border px-3 py-2 ${
                      budget === option.id
                        ? "border-indigo-500 bg-indigo-500/20 text-white"
                        : "border-neutral-700 bg-neutral-900/60 text-neutral-300"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="flex items-center gap-2">
              <input
                id="newsletter"
                type="checkbox"
                className="h-4 w-4 rounded border-neutral-700 bg-neutral-900 text-indigo-500 focus:ring-indigo-500"
                checked={newsletter}
                onChange={(e) => setNewsletter(e.target.checked)}
              />
              <label htmlFor="newsletter" className="text-sm text-neutral-300">
                Send me occasional style recaps and outfit prompts.
              </label>
            </div>

            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400 transition"
            >
              Save preferences (local only for now)
            </button>
          </form>

          {/* Live summary */}
          <aside className="rounded-xl border border-neutral-700 bg-neutral-900/40 p-4 text-sm">
            <h2 className="font-semibold mb-3">Preference preview</h2>
            <p className="text-neutral-300 mb-1">
              <span className="text-neutral-500">Style vibe:</span>{" "}
              <strong>{styleVibe}</strong>
            </p>
            <p className="text-neutral-300 mb-1">
              <span className="text-neutral-500">Colours:</span>{" "}
              <strong>{colourFocus}</strong>
            </p>
            <p className="text-neutral-300 mb-3">
              <span className="text-neutral-500">Budget:</span>{" "}
              <strong>{budget}</strong>
            </p>
            <p className="text-neutral-400">
              {newsletter
                ? "We’ll use this profile to tailor future outfit + shopping ideas."
                : "You’ve turned off recaps, but we’ll still use this profile inside the app."}
            </p>
          </aside>
        </div>
      </section>
    </Layout>
  );
}
