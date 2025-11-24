// src/Pages/Shopping.jsx
import React, { useState } from "react";
import Layout from "../Layout";
import { ShoppingBag, Filter, Search, ExternalLink, Heart } from "lucide-react";

// Fake recommended items
const shopItems = [
  {
    id: 1,
    name: "Air Oxford Shirt - White",
    brand: "Everlane",
    price: 68,
    image:
      "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=400&h=400&fit=crop",
    match: 98,
    style: "Minimalist",
    occasion: "Work",
    brandUrl:
      "https://www.everlane.com/products/mens-air-oxford-shirt-white",
  },
  {
    id: 2,
    name: "501 Original Fit Jeans - Dark Wash",
    brand: "Levi's",
    price: 98,
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop",
    match: 95,
    style: "Casual",
    occasion: "Everyday",
    brandUrl:
      "https://www.levi.com/US/en_US/clothing/men/jeans/501-original-fit-mens-jeans/p/005013262",
  },
  {
    id: 3,
    name: "Cavalier Chelsea Boot - Black",
    brand: "Thursday Boot Co.",
    price: 199,
    image:
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400&h=400&fit=crop",
    match: 92,
    style: "Classic",
    occasion: "All",
    brandUrl:
      "https://thursdayboots.com/products/mens-cavalier-chelsea-boot-black",
  },
  {
    id: 4,
    name: "Cashmere Crew Neck Sweater - Navy",
    brand: "Uniqlo",
    price: 89,
    image:
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=400&fit=crop",
    match: 94,
    style: "Casual",
    occasion: "Weekend",
    brandUrl:
      "https://www.uniqlo.com/us/en/products/E450543-000/00?colorDisplayCode=69&sizeDisplayCode=004",
  },
  {
    id: 5,
    name: "Napoli Navy Suit",
    brand: "Suitsupply",
    price: 399,
    image:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop",
    match: 91,
    style: "Formal",
    occasion: "Work",
    brandUrl:
      "https://suitsupply.com/en-us/men/suits/navy-napoli-suit/P6301I.html",
  },
  {
    id: 6,
    name: "Petites Juliette Dress - Natural",
    brand: "Reformation",
    price: 148,
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop",
    match: 96,
    style: "Bohemian",
    occasion: "Summer",
    brandUrl: "https://www.thereformation.com/products/petites-juliette-dress",
  },
];

export default function Shopping() {
  const [showFilters, setShowFilters] = useState(true);
  const [budget, setBudget] = useState(500);
  const [search, setSearch] = useState("");

  const filteredItems = shopItems.filter(
    (item) =>
      item.price <= budget &&
      item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout currentPageName="Shopping">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">
              Smart shopping
            </h1>
            <p className="text-sm text-neutral-600">
              Suggestions that match your wardrobe, style and budget.
            </p>
          </div>
        </div>

        {/* Search + filter toggle */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for items…"
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 bg-white"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters((s) => !s)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-neutral-300 text-sm font-medium bg-white hover:bg-neutral-50"
          >
            <Filter className="w-4 h-4" />
            {showFilters ? "Hide filters" : "Show filters"}
          </button>
        </div>

        <div className="flex gap-8">
          {/* Filters sidebar */}
          {showFilters && (
            <aside className="w-72 space-y-6">
              <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm">
                <p className="text-sm font-semibold mb-3">Budget</p>
                <input
                  type="range"
                  min={50}
                  max={1000}
                  step={10}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full"
                />
                <p className="mt-2 text-xs text-neutral-600">
                  Max: <span className="font-semibold">${budget}</span>
                </p>
              </div>

              <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm space-y-4">
                <div>
                  <p className="text-sm font-semibold mb-1">Occasion</p>
                  <select className="w-full text-sm border border-neutral-300 rounded-lg px-2 py-2 bg-white">
                    <option>All occasions</option>
                    <option>Work</option>
                    <option>Casual</option>
                    <option>Formal</option>
                    <option>Athletic</option>
                  </select>
                </div>

                <div>
                  <p className="text-sm font-semibold mb-1">Style</p>
                  <select className="w-full text-sm border border-neutral-300 rounded-lg px-2 py-2 bg-white">
                    <option>All styles</option>
                    <option>Minimalist</option>
                    <option>Casual</option>
                    <option>Formal</option>
                    <option>Bohemian</option>
                    <option>Edgy</option>
                  </select>
                </div>
              </div>
            </aside>
          )}

          {/* Products grid */}
          <section className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-neutral-500">
                {filteredItems.length} items match your filters
              </p>
              <select className="text-xs border border-neutral-300 rounded-lg px-2 py-1 bg-white">
                <option>Best match</option>
                <option>Price: low to high</option>
                <option>Price: high to low</option>
                <option>Newest</option>
              </select>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item, index) => (
                <article
                  key={item.id}
                  className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="relative aspect-square bg-neutral-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      className="absolute top-3 right-3 inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/80 backdrop-blur text-neutral-700 hover:bg-white"
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-neutral-900 text-white text-xs font-medium">
                      {item.match}% match
                    </div>
                  </div>

                  <div className="p-4">
                    <p className="text-xs text-neutral-500 mb-1">
                      {item.brand}
                    </p>
                    <h3 className="text-sm font-semibold mb-2 line-clamp-2">
                      {item.name}
                    </h3>
                    <div className="flex gap-2 mb-3">
                      <span className="text-[11px] px-2 py-1 rounded-full bg-neutral-100 text-neutral-700">
                        {item.style}
                      </span>
                      <span className="text-[11px] px-2 py-1 rounded-full bg-neutral-50 text-neutral-500">
                        {item.occasion}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold">${item.price}</span>
                      <a
                        href={item.brandUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800"
                      >
                        Shop now
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
