// src/Pages/Shopping.jsx
import React, { useState, useMemo } from "react";
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
  Heart,
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

    return items;
  }, [budget, search, occasion, style, sortBy]);

  const handleOpenBrand = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Layout currentPageName="Shopping">
      <div className="w-full space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-primary/10">
            <ShoppingBag className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Smart shopping, no doom-scrolling
            </span>
          </div>
          <h1 className="text-4xl font-bold">Smart Shopping</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse curated pieces that match your style, budget, and existing
            wardrobe.
          </p>
        </div>

        {/* Search + filter toggle */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search for items or brands..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters((v) => !v)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        <div className="flex gap-8">
          {/* Filters */}
          {showFilters && (
            <div className="w-80 space-y-6">
              <div className="bg-card rounded-2xl shadow-sm border border-border p-6 space-y-6">
                {/* Budget */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">
                    Budget
                  </Label>
                  <div className="space-y-4">
                    <Slider
                      value={budget}
                      onValueChange={setBudget}
                      max={1000}
                      step={10}
                      className="w-full"
                    />
                    <div className="text-sm text-muted-foreground">
                      Max: ${budget[0]}
                    </div>
                  </div>
                </div>

                {/* Occasion */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">
                    Occasion
                  </Label>
                  <Select
                    value={occasion}
                    onValueChange={(v) => setOccasion(v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select occasion" />
                    </SelectTrigger>
                    <SelectContent>
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
                <div>
                  <Label className="text-base font-semibold mb-3 block">
                    Style
                  </Label>
                  <Select
                    value={style}
                    onValueChange={(v) => setStyle(v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All styles</SelectItem>
                      <SelectItem value="minimalist">Minimalist</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="formal">Formal</SelectItem>
                      <SelectItem value="bohemian">Bohemian</SelectItem>
                      <SelectItem value="classic">Classic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full">Apply filters</Button>
              </div>
            </div>
          )}

          {/* Products grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-muted-foreground">
                {filteredItems.length} item
                {filteredItems.length !== 1 ? "s" : ""} match your filters
              </p>
              <Select
                value={sortBy}
                onValueChange={(v) => setSortBy(v)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
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

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-card rounded-xl shadow-sm border border-border overflow-hidden hover:shadow-lg transition-all duration-300 group"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="aspect-square bg-muted flex items-center justify-center relative overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Heart className="w-5 h-5" />
                    </Button>
                    <div className="absolute bottom-3 left-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                      {item.match}% match
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="text-sm text-muted-foreground mb-1">
                      {item.brand}
                    </div>
                    <h3 className="font-semibold mb-2 line-clamp-2">
                      {item.name}
                    </h3>
                    <div className="flex gap-2 mb-3">
                      <span className="text-xs bg-secondary px-2 py-1 rounded-full capitalize">
                        {item.style}
                      </span>
                      <span className="text-xs bg-muted px-2 py-1 rounded-full capitalize">
                        {item.occasion}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">
                        ${item.price}
                      </span>
                      <Button
                        size="sm"
                        onClick={() => handleOpenBrand(item.brandUrl)}
                      >
                        Shop now
                        <ExternalLink className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredItems.length === 0 && (
                <div className="col-span-full text-sm text-muted-foreground text-center py-12">
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
