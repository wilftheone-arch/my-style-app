// src/Layout.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  Home as HomeIcon,
  Camera,
  Heart,
  Sparkles,
  ShoppingBag,
  User,
} from "lucide-react";
import { createPageUrl } from "./utils";

export default function Layout({ children, currentPageName }) {
  const navigation = [
    { name: "Home", icon: HomeIcon, path: "Home" },
    { name: "Scan", icon: Camera, path: "Scan" },
    { name: "Wardrobe", icon: Camera, path: "Wardrobe" },
    { name: "Style Swiper", icon: Heart, path: "StyleSwiper" },
    { name: "Outfits", icon: Sparkles, path: "Outfits" },
    { name: "Shopping", icon: ShoppingBag, path: "Shopping" },
    { name: "Profile", icon: User, path: "Profile" },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50">
      {/* Top nav bar */}
      <header className="sticky top-0 z-40 border-b border-pink-500/20 bg-neutral-950/95 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-pink-300">
              <Sparkles className="h-5 w-5 text-neutral-950" />
            </div>
            <div className="leading-tight">
              <div className="text-lg font-bold tracking-tight">StyleAI</div>
              <div className="text-xs text-neutral-400">
                Smart wardrobe assistant
              </div>
            </div>
          </div>

          {/* Links – horizontal, scrollable on small screens */}
          <div className="ml-4 flex flex-1 justify-end">
            <div className="flex gap-1 overflow-x-auto rounded-full bg-neutral-900/80 px-2 py-1 text-sm">
              {navigation.map((item) => {
                const isActive = currentPageName === item.path;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    to={createPageUrl(item.path)}
                    className={`flex items-center gap-1 rounded-full px-3 py-1.5 transition-all ${
                      isActive
                        ? "bg-pink-500 text-neutral-950 shadow-[0_0_20px_rgba(236,72,153,0.5)]"
                        : "text-neutral-300 hover:bg-neutral-800 hover:text-pink-300"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      </header>

      {/* Main content – centred */}
      <main className="mx-auto max-w-6xl px-4 py-10">
        {children}
      </main>
    </div>
  );
}
