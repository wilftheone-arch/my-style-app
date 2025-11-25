// src/Pages/Shopping.jsx
import React, { useState, useMemo, useEffect } from "react";
import Layout from "../Layout";
import { Button } from "../Components/ui/button";
import { Input } from "../Components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../Components/ui/select";
import { Slider } from "../Components/ui/slider";
import { Label } from "../Components/ui/label";
import {
  ShoppingBag,
  Filter,
  Search,
  ExternalLink,
} from "lucide-react";

const shopItems = [
  {
    id: 1,
    name: "Air Oxford Shirt - White",
    brand: "Everlane",
    price: 68,
    image:
      "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=400&h=400&fit=crop",
    match: 98,
    style: "minimalist",
    occasion: "work",
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
    style: "casual",
    occasion: "everyday",
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
    style: "classic",
    occasion: "all",
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
    style: "casual",
    occasion: "weekend",
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
    style: "formal",
    occasion: "work",
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
    style: "bohemian",
    occasion: "summer",
    brandUrl:
      "https://www.thereformation.com/products/petites-juliette-dress",
  },
];

export default function Shopping() {
  const [showFilters, setShowFilters] = useState(true);
  const [budget, setBudget] = useState([500]);
  const [search, setSearch] = useState("");
  const [occasion, setOccasion] = useState("all");
  const [style, setStyle] = useState("all");
  const [sortBy, setSortBy] = useState("match");
  const [likedBrands, setLikedBrands] = useState([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem("styleAI-liked-clothes");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;
      const brands = parsed
        .map((item) => item?.brand)
        .filter(Boolean);
      setLikedBrands(Array.from(new Set(brands)));
    } catch (err) {
      setLikedBrands([]);
    }
  }, []);

  const likedBrandSet = useMemo(() => new Set(likedBrands), [likedBrands]);

  const filteredItems = useMemo(() => {
    let items = shopItems.filter((item) => item.price <= budget[0]);

    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.brand.toLowerCase().includes(q)
      );
    }

    if (occasion !== "all") {
      items = items.filter((item) => item.occasion === occasion);
    }

    if (style !== "all") {
      items = items.filter((item) => item.style === style);
    }

    switch (sortBy) {
      case "price-low":
        items = [...items].sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        items = [...items].sort((a, b) => b.price - a.price);
        break;
      case "newest":
        // fake “newest”: just reverse
        items = [...items].reverse();
        break;
      default:
        // best match
        items = [...items].sort((a, b) => b.match - a.match);
    }

    return items.map((item) => ({
      ...item,
      isRecommended: likedBrandSet.has(item.brand),
    }));
  }, [budget, search, occasion, style, sortBy, likedBrandSet]);

  const recommendedCount = useMemo(
    () => filteredItems.filter((item) => item.isRecommended).length,
    [filteredItems]
  );

  const handleOpenBrand = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Layout currentPageName="Shopping">
      <div className="w-full space-y-10 bg-neutral-950 text-neutral-100 min-h-screen py-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-100 shadow-pink-500/20 shadow-lg">
            <ShoppingBag className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">
              Shopping
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold">
            Browse curated pieces that match your style
          </h1>
          <p className="text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto">
            Dial in your budget and vibe, then jump straight to the pieces
            that fit.
          </p>
        </div>

        {/* Search + filter toggle */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <Input
              placeholder="Search for items or brands..."
              className="pl-11 pr-4 py-3 rounded-full bg-neutral-900 border border-neutral-700 text-sm placeholder:text-neutral-500 focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:border-pink-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 sm:flex-none rounded-full border border-pink-500/40 bg-pink-500/10 text-pink-100 hover:bg-pink-500/20"
              onClick={() => setShowFilters((v) => !v)}
            >
              <Filter className="w-4 h-4 mr-2" />
              {showFilters ? "Hide filters" : "Show filters"}
            </Button>
          </div>
        </div>

        <div
          className={`grid gap-6 lg:gap-10 items-start ${
            showFilters ? "lg:grid-cols-[320px_1fr]" : "lg:grid-cols-1"
          }`}
        >
          {/* Filters */}
          {showFilters && (
            <div className="space-y-6">
              <div className="rounded-3xl border border-pink-500/15 bg-neutral-900/80 shadow-2xl p-6 space-y-6">
                {/* Budget */}
                <div className="space-y-4">
                  <Label className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                    Budget
                  </Label>
                  <div className="space-y-4">
                    <Slider
                      value={budget}
                      onValueChange={setBudget}
                      max={1000}
                      step={10}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-full py-4 px-1"
                    />
                    <div className="text-sm text-neutral-400">
                      Max: ${budget[0]}
                    </div>
                  </div>
                </div>

                {/* Occasion */}
                <div className="space-y-3">
                  <Label className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                    Occasion
                  </Label>
                  <Select
                    value={occasion}
                    onValueChange={(v) => setOccasion(v)}
                  >
                    <SelectTrigger className="rounded-2xl bg-neutral-900 border border-neutral-700 text-neutral-100 focus:ring-2 focus:ring-pink-500 focus:border-pink-500">
                      <SelectValue placeholder="Select occasion" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-900 border border-neutral-700 text-neutral-100">
                      <SelectItem value="all">All occasions</SelectItem>
                      <SelectItem value="work">Work</SelectItem>
                      <SelectItem value="everyday">Everyday</SelectItem>
                      <SelectItem value="formal">Formal events</SelectItem>
                      <SelectItem value="weekend">Weekend</SelectItem>
                      <SelectItem value="summer">Summer / holiday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Style */}
                <div className="space-y-3">
                  <Label className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                    Style
                  </Label>
                  <Select
                    value={style}
                    onValueChange={(v) => setStyle(v)}
                  >
                    <SelectTrigger className="rounded-2xl bg-neutral-900 border border-neutral-700 text-neutral-100 focus:ring-2 focus:ring-pink-500 focus:border-pink-500">
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-900 border border-neutral-700 text-neutral-100">
                      <SelectItem value="all">All styles</SelectItem>
                      <SelectItem value="minimalist">Minimalist</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="formal">Formal</SelectItem>
                      <SelectItem value="bohemian">Bohemian</SelectItem>
                      <SelectItem value="classic">Classic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full rounded-full bg-pink-500 text-neutral-950 font-semibold hover:bg-pink-400">
                  Apply filters
                </Button>
              </div>
            </div>
          )}

          {/* Products grid */}
          <div className="flex-1 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <p className="text-sm text-neutral-400">
                {recommendedCount > 0
                  ? `${recommendedCount} item${
                      recommendedCount !== 1 ? "s" : ""
                    } match your swipes`
                  : "Browse curated pieces based on your budget and filters"}
              </p>
              <Select
                value={sortBy}
                onValueChange={(v) => setSortBy(v)}
              >
                <SelectTrigger className="w-full sm:w-48 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-100 focus:ring-2 focus:ring-pink-500 focus:border-pink-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-neutral-900 border border-neutral-700 text-neutral-100">
                  <SelectItem value="match">Best match</SelectItem>
                  <SelectItem value="price-low">
                    Price: low to high
                  </SelectItem>
                  <SelectItem value="price-high">
                    Price: high to low
                  </SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-3xl bg-neutral-900 border shadow-2xl overflow-hidden group transition-all duration-200 hover:-translate-y-1 hover:shadow-pink-500/30 ${
                    item.isRecommended
                      ? "border-pink-500/60 hover:border-pink-500/80"
                      : "border-pink-500/15 hover:border-pink-500/40"
                  }`}
                >
                  <div className="relative aspect-4/5 bg-neutral-800 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    {item.isRecommended && (
                      <div className="absolute top-3 left-3 rounded-full bg-pink-500/25 text-[11px] text-pink-100 px-2.5 py-0.5 font-semibold">
                        From your swipes
                      </div>
                    )}
                    <div className="absolute top-3 right-3 rounded-full bg-pink-500/20 text-[11px] text-pink-100 px-2 py-0.5 font-semibold">
                      {item.match}% match
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="text-xs text-neutral-400 uppercase tracking-wide">
                      {item.brand}
                    </div>
                    <h3 className="text-base text-white font-semibold leading-tight line-clamp-2">
                      {item.name}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-neutral-800 text-neutral-300 px-2 py-0.5 text-[11px] capitalize">
                        {item.style}
                      </span>
                      <span className="rounded-full bg-neutral-800 text-neutral-300 px-2 py-0.5 text-[11px] capitalize">
                        {item.occasion}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-pink-400">
                        ${item.price}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      className="w-full rounded-xl border border-pink-500/40 bg-pink-500/10 text-xs sm:text-sm text-pink-100 hover:bg-pink-500/20 flex items-center justify-center gap-2"
                      onClick={() => handleOpenBrand(item.brandUrl)}
                    >
                      Shop now
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {filteredItems.length === 0 && (
                <div className="col-span-full text-sm text-neutral-500 text-center py-12">
                  No items match these filters yet. Try increasing your budget
                  or clearing filters.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
