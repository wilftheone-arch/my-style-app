// src/Pages/Wardrobe.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../Layout";
import { Tag, Filter, Shirt, PlusCircle, CheckCircle2, Heart, Trash2 } from "lucide-react";
import { Button } from "../Components/ui/button";

const WARDROBE_KEY = "styleai_wardrobe";
const LEGACY_WARDROBE_KEY = "styleAI-wardrobe";

const demoItems = [
  {
    id: "demo-1",
    name: "Oversized beige sweater",
    title: "Oversized beige sweater",
    brand: "ESSENTIALS",
    category: "top",
    colour: "Beige",
    season: "Autumn / Winter",
    tags: ["casual", "cozy", "minimal"],
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&h=600&fit=crop",
  },
  {
    id: "demo-2",
    name: "Straight-leg blue jeans",
    title: "Straight-leg blue jeans",
    brand: "Levi's",
    category: "bottom",
    colour: "Blue",
    season: "All year",
    tags: ["denim", "everyday"],
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=600&fit=crop",
  },
  {
    id: "demo-3",
    name: "Black leather Chelsea boots",
    title: "Black leather Chelsea boots",
    brand: "COS",
    category: "shoes",
    colour: "Black",
    season: "Autumn / Winter",
    tags: ["classic", "night-out"],
    image:
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&h=600&fit=crop",
  },
  {
    id: "demo-4",
    name: "White cropped t-shirt",
    title: "White cropped t-shirt",
    brand: "Skims",
    category: "top",
    colour: "White",
    season: "Spring / Summer",
    tags: ["basic", "layering"],
    image:
      "https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=600&h=600&fit=crop",
  },
];

const categoryLabels = {
  top: "Tops",
  bottom: "Bottoms",
  shoes: "Shoes",
  outerwear: "Outerwear",
  accessory: "Accessories",
};

const normalizeItems = (list) =>
  list.map((item) => ({
    ...item,
    title: item.title || item.name,
    image: item.image || item.imageUrl,
    isFavorite: Boolean(item.isFavorite),
  }));

export default function Wardrobe() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const persistItems = (nextItems) => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(WARDROBE_KEY, JSON.stringify(nextItems));
    } catch (err) {
      // ignore storage errors
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored =
        window.localStorage.getItem(WARDROBE_KEY) ||
        window.localStorage.getItem(LEGACY_WARDROBE_KEY);
      const parsed = stored ? JSON.parse(stored) : [];
      const next =
        Array.isArray(parsed) && parsed.length ? parsed : demoItems;
      setItems(normalizeItems(next));
      setStatus(
        Array.isArray(parsed) && parsed.length
          ? "Loaded from your saved wardrobe"
          : "Demo wardrobe — scan an item to replace this list"
      );
    } catch (err) {
      const normalized = normalizeItems(demoItems);
      setItems(normalized);
      setStatus("Demo wardrobe — scan an item to replace this list");
    }
  }, []);

  const counts = useMemo(
    () =>
      items.reduce(
        (acc, item) => {
          const key = (item.category || "other").toLowerCase();
          if (acc[key] !== undefined) {
            acc[key] += 1;
          } else {
            acc.other += 1;
          }
          return acc;
        },
        { top: 0, bottom: 0, shoes: 0, outerwear: 0, accessory: 0, other: 0 }
      ),
    [items]
  );

  const mostCommon =
    Object.entries(counts)
      .filter(([key]) => key !== "other")
      .sort((a, b) => b[1] - a[1])[0]?.[0] || "top";

  const wardrobeEmpty = items.length === 0;

  const toggleFavorite = (id) => {
    setItems((prev) => {
      const next = prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      );
      persistItems(next);
      return next;
    });
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm("Remove this item from your wardrobe?");
    if (!confirmed) return;
    setItems((prev) => {
      const next = prev.filter((item) => item.id !== id);
      persistItems(next);
      return next;
    });
  };

  return (
    <Layout currentPageName="Wardrobe">
      <div className="max-w-5xl mx-auto px-4 py-10 text-neutral-50">
        {/* Header */}
        <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-50">
              Your wardrobe
            </h1>
            <p className="mt-2 text-sm text-neutral-400">
              Saved from scans and ready to power outfits.
            </p>
            {status && (
              <p className="mt-1 text-xs text-pink-200">{status}</p>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-pink-500/40 text-pink-300"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters (coming soon)
            </Button>
            <Button
              className="bg-pink-500 text-neutral-950 hover:bg-pink-400"
              onClick={() => navigate("/scan")}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add item manually
            </Button>
          </div>
        </header>

        {/* Quick stats */}
        <section className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-pink-500/20 bg-neutral-900/70 px-4 py-3">
            <p className="text-xs text-neutral-400">Total items</p>
            <p className="mt-1 text-2xl font-semibold text-pink-100">
              {items.length}
            </p>
          </div>
          <div className="rounded-2xl border border-pink-500/20 bg-neutral-900/70 px-4 py-3">
            <p className="text-xs text-neutral-400">Most common</p>
            <p className="mt-1 text-sm text-neutral-50 capitalize">
              {categoryLabels[mostCommon] || "Tops"}
            </p>
          </div>
          <div className="rounded-2xl border border-pink-500/20 bg-neutral-900/70 px-4 py-3">
            <p className="text-xs text-neutral-400">Ready for outfits</p>
            <p className="mt-1 text-sm text-neutral-50">
              Mix &amp; match in the Outfits tab
            </p>
          </div>
        </section>

        {/* Wardrobe grid */}
        {wardrobeEmpty ? (
          <div className="space-y-3 rounded-3xl border border-pink-500/30 bg-neutral-900/70 p-10 text-center shadow-2xl">
            <p className="text-lg font-semibold">No items yet</p>
            <p className="text-neutral-400">
              Scan something to see it appear here and feed the outfit builder.
            </p>
          </div>
        ) : (
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <article
                key={item.id}
                className="group relative overflow-hidden rounded-2xl border border-pink-500/20 bg-neutral-900/80 shadow-lg shadow-pink-500/10"
              >
                {/* FAVOURITE BUTTON */}
                <button
                  type="button"
                  aria-label="Mark as favourite"
                  onClick={() => toggleFavorite(item.id)}
                  className="absolute top-3 left-3 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-pink-500 shadow-lg shadow-pink-500/40 transition hover:bg-pink-400"
                >
                  <Heart
                    className="h-5 w-5"
                    style={{ color: "#020617" }} // near-black icon
                    fill={item.isFavorite ? "#020617" : "none"}
                  />
                </button>

                {/* DELETE BUTTON */}
                <button
                  type="button"
                  aria-label="Delete item"
                  onClick={() => handleDelete(item.id)}
                  className="absolute top-3 right-3 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-red-500 shadow-lg shadow-red-500/40 transition hover:bg-red-400"
                >
                  <Trash2
                    className="h-5 w-5"
                    style={{ color: "#020617" }} // near-black icon
                  />
                </button>

                <div className="relative aspect-square overflow-hidden bg-neutral-900">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title || item.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-neutral-500">
                      No image
                    </div>
                  )}
                  <div className="absolute left-3 bottom-3 inline-flex items-center rounded-full bg-black/70 px-2 py-1 text-xs text-neutral-100 backdrop-blur">
                    <Shirt className="mr-1 h-3 w-3" />
                    {(categoryLabels[item.category] ||
                      item.category ||
                      "Saved"
                    ).toString()}
                  </div>
                  {item.createdAt && (
                    <div className="absolute right-3 bottom-3 inline-flex items-center gap-1 rounded-full bg-pink-500/80 px-2 py-1 text-[11px] font-semibold text-neutral-900">
                      <CheckCircle2 className="h-3 w-3" />
                      Saved
                    </div>
                  )}
                </div>

                <div className="space-y-2 px-4 py-4">
                  <h2 className="line-clamp-2 text-sm font-semibold text-neutral-50">
                    {item.title || item.name}
                  </h2>
                  <p className="text-xs text-neutral-400">
                    {(item.brand && `${item.brand} • `) || ""}
                    {item.colour || "Wardrobe piece"}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-1">
                    {(item.tags || []).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-pink-500/10 px-2 py-0.5 text-[11px] text-pink-200"
                      >
                        <Tag className="mr-1 h-3 w-3" />
                        {tag}
                      </span>
                    ))}
                    {(item.tags || []).length === 0 && (
                      <span className="text-[11px] text-neutral-500">
                        Tagged by StyleAI
                      </span>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 w-full border-pink-500/40 text-xs text-pink-100 hover:border-pink-500 hover:bg-pink-500/10"
                    onClick={() =>
                      alert("This will send the item to the outfit builder.")
                    }
                  >
                    Use in outfit
                  </Button>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </Layout>
  );
}
