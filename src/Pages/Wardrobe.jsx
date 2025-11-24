// src/Pages/Wardrobe.jsx
import React from "react";
import Layout from "../Layout";
import { Tag, Filter, Shirt, PlusCircle } from "lucide-react";
import { Button } from "../Components/ui/button";

// Fake wardrobe data for now – later this can come from Scan / a backend
const wardrobeItems = [
  {
    id: 1,
    name: "Oversized beige sweater",
    category: "Top",
    color: "Beige",
    season: "Autumn / Winter",
    tags: ["casual", "cozy", "minimal"],
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&h=600&fit=crop",
  },
  {
    id: 2,
    name: "Straight-leg blue jeans",
    category: "Bottom",
    color: "Blue",
    season: "All year",
    tags: ["everyday", "denim"],
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=600&fit=crop",
  },
  {
    id: 3,
    name: "Black leather Chelsea boots",
    category: "Shoes",
    color: "Black",
    season: "Autumn / Winter",
    tags: ["classic", "night-out"],
    image:
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&h=600&fit=crop",
  },
  {
    id: 4,
    name: "White cropped t-shirt",
    category: "Top",
    color: "White",
    season: "Spring / Summer",
    tags: ["basic", "layering"],
    image:
      "https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=600&h=600&fit=crop",
  },
];

export default function Wardrobe() {
  return (
    <Layout currentPageName="Wardrobe">
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <header className="flex flex-col gap-4 mb-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-50">
              Your wardrobe
            </h1>
            <p className="mt-2 text-sm text-neutral-400">
              View everything you own in one place. Later, this will be filled
              automatically from your scans.
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="border-pink-500/40 text-pink-300">
              <Filter className="w-4 h-4 mr-2" />
              Filters (coming soon)
            </Button>
            <Button className="bg-pink-500 hover:bg-pink-400 text-neutral-950">
              <PlusCircle className="w-4 h-4 mr-2" />
              Add item manually
            </Button>
          </div>
        </header>

        {/* Quick stats */}
        <section className="grid gap-4 mb-8 sm:grid-cols-3">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 px-4 py-3">
            <p className="text-xs text-neutral-400">Total items</p>
            <p className="mt-1 text-2xl font-semibold text-neutral-50">
              {wardrobeItems.length}
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 px-4 py-3">
            <p className="text-xs text-neutral-400">Most common category</p>
            <p className="mt-1 text-sm text-neutral-50">Tops</p>
          </div>
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 px-4 py-3">
            <p className="text-xs text-neutral-400">Ready for outfits</p>
            <p className="mt-1 text-sm text-neutral-50">
              Mix &amp; match in the Outfits tab
            </p>
          </div>
        </section>

        {/* Wardrobe grid */}
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {wardrobeItems.map((item) => (
            <article
              key={item.id}
              className="group overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/70 shadow-md shadow-black/40"
            >
              <div className="relative aspect-square overflow-hidden bg-neutral-900">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute left-3 top-3 inline-flex items-center rounded-full bg-black/70 px-2 py-1 text-xs text-neutral-100">
                  <Shirt className="mr-1 h-3 w-3" />
                  {item.category}
                </div>
              </div>

              <div className="space-y-2 px-4 py-4">
                <h2 className="text-sm font-semibold text-neutral-50 line-clamp-2">
                  {item.name}
                </h2>
                <p className="text-xs text-neutral-400">
                  {item.color} • {item.season}
                </p>

                <div className="mt-2 flex flex-wrap gap-1">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-pink-500/10 px-2 py-0.5 text-[11px] text-pink-200"
                    >
                      <Tag className="mr-1 h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 w-full border-neutral-700 text-xs text-neutral-200 hover:border-pink-500 hover:bg-pink-500/10"
                  onClick={() => alert("Later this will send the item to the outfit builder.")}
                >
                  Use in outfit (placeholder)
                </Button>
              </div>
            </article>
          ))}
        </section>
      </div>
    </Layout>
  );
}
