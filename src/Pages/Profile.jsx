import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../Layout";
import { createPageUrl } from "../utils";

const WARDROBE_KEY = "styleai_wardrobe";
const LEGACY_WARDROBE_KEY = "styleAI-wardrobe";
const PROFILE_KEY = "styleai_profile";
const LIKED_KEY = "styleAI-liked-clothes";

const slotMatchers = {
  top: [
    "top",
    "shirt",
    "tee",
    "t-shirt",
    "polo",
    "hoodie",
    "sweater",
    "knit",
    "sweatshirt",
    "blouse",
  ],
  bottom: ["jeans", "trouser", "pants", "shorts", "skirt"],
  shoes: ["sneaker", "boot", "loafer", "shoe", "trainer"],
  outerwear: ["coat", "parka", "jacket", "trench", "blazer"],
  dress: ["dress"],
  accessory: [
    "bag",
    "belt",
    "scarf",
    "hat",
    "cap",
    "beanie",
    "jewellery",
    "watch",
    "sunglasses",
  ],
};

const inferSlot = (item) => {
  const base = (item?.category || "").toLowerCase();
  const title = (item?.title || "").toLowerCase();
  const haystack = `${base} ${title}`;

  if (slotMatchers.dress.some((word) => haystack.includes(word))) return "dress";
  if (slotMatchers.outerwear.some((word) => haystack.includes(word))) return "outerwear";
  if (slotMatchers.top.some((word) => haystack.includes(word))) return "top";
  if (slotMatchers.bottom.some((word) => haystack.includes(word))) return "bottom";
  if (slotMatchers.shoes.some((word) => haystack.includes(word))) return "shoes";
  if (slotMatchers.accessory.some((word) => haystack.includes(word))) return "accessory";
  return "other";
};

const bucketItems = (items) =>
  items.reduce(
    (acc, item) => {
      const slot = inferSlot(item);
      if (acc[slot]) {
        acc[slot].push(item);
      } else {
        acc.other.push(item);
      }
      return acc;
    },
    {
      top: [],
      bottom: [],
      shoes: [],
      outerwear: [],
      dress: [],
      accessory: [],
      other: [],
    }
  );

const categoryLabel = {
  top: "Tops",
  bottom: "Bottoms",
  shoes: "Shoes",
  outerwear: "Outerwear",
  accessory: "Accessories",
  dress: "Dresses",
};

const styleTags = ["Minimalist", "Streetwear", "Smart casual", "Formal", "Sporty"];

const defaultProfile = {
  gender: "",
  height: "",
  topSize: "",
  bottomSize: "",
  shoeSize: "",
  stylePrefs: [],
};

export default function Profile() {
  const [wardrobe, setWardrobe] = useState([]);
  const [liked, setLiked] = useState([]);
  const [profile, setProfile] = useState(defaultProfile);
  const [saveMessage, setSaveMessage] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const wardrobeRaw =
        window.localStorage.getItem(WARDROBE_KEY) ||
        window.localStorage.getItem(LEGACY_WARDROBE_KEY);
      const likedRaw = window.localStorage.getItem(LIKED_KEY);
      const profileRaw = window.localStorage.getItem(PROFILE_KEY);
      const parsedWardrobe = wardrobeRaw ? JSON.parse(wardrobeRaw) : [];
      const parsedLiked = likedRaw ? JSON.parse(likedRaw) : [];
      const parsedProfile = profileRaw ? JSON.parse(profileRaw) : defaultProfile;
      setWardrobe(
        Array.isArray(parsedWardrobe)
          ? parsedWardrobe.map((item) => ({
              ...item,
              title: item.title || item.name,
              image: item.image || item.imageUrl,
            }))
          : []
      );
      setLiked(Array.isArray(parsedLiked) ? parsedLiked : []);
      setProfile({ ...defaultProfile, ...(parsedProfile || {}) });
    } catch (err) {
      setWardrobe([]);
      setLiked([]);
      setProfile(defaultProfile);
    }
  }, []);

  const ownedBuckets = useMemo(() => bucketItems(wardrobe), [wardrobe]);
  const likedBuckets = useMemo(() => bucketItems(liked), [liked]);

  const ownedCounts = useMemo(
    () =>
      Object.fromEntries(
        Object.keys(ownedBuckets).map((k) => [k, ownedBuckets[k].length])
      ),
    [ownedBuckets]
  );
  const totalOwned = wardrobe.length;
  const totalLiked = liked.length;
  const wardrobeEmpty = totalOwned === 0;

  const suggestions = useMemo(() => {
    const list = [];

    Object.keys(categoryLabel).forEach((cat) => {
      const count = ownedCounts[cat] || 0;
      if (count === 0) {
        list.push({
          text: `You have no ${categoryLabel[cat].toLowerCase()} yet.`,
        });
      }
    });

    if (ownedCounts.top > 10 && ownedCounts.shoes <= 2) {
      list.push({
        text: "Lots of tops but very few shoes. Try balancing footwear options.",
      });
    }

    Object.keys(categoryLabel).forEach((cat) => {
      const owned = ownedCounts[cat] || 0;
      const likedCount = likedBuckets[cat]?.length || 0;
      if (likedCount >= 2 && owned <= 1) {
        list.push({
          text: `You seem to like ${categoryLabel[cat].toLowerCase()} but only own ${owned || 0}.`,
        });
      }
    });

    return list;
  }, [ownedCounts, likedBuckets]);

  const handleReset = () => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(WARDROBE_KEY);
      window.localStorage.removeItem(LEGACY_WARDROBE_KEY);
      window.localStorage.removeItem(LIKED_KEY);
      window.localStorage.removeItem(PROFILE_KEY);
    } catch (err) {
      // ignore
    }
    setWardrobe([]);
    setLiked([]);
    setProfile(defaultProfile);
    setResetMessage("Profile reset. Scan or add pieces to see stats here.");
  };

  const handleProfileChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const toggleStylePref = (value) => {
    setProfile((prev) => {
      const exists = prev.stylePrefs.includes(value);
      return {
        ...prev,
        stylePrefs: exists
          ? prev.stylePrefs.filter((v) => v !== value)
          : [...prev.stylePrefs, value],
      };
    });
  };

  const handleSaveProfile = () => {
    if (typeof window === "undefined") return;
    const { gender, height } = profile;
    if (!gender || !height) {
      setSaveMessage("Please add at least gender and height so we can tailor looks.");
      return;
    }
    try {
      window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
      setSaveMessage("Profile saved. Your outfits will reflect this.");
    } catch (err) {
      setSaveMessage("Could not save profile right now.");
    }
  };

  const ownedCollage = wardrobe.slice(0, 6);
  const likedThumbs = liked.slice(0, 4);

  return (
    <Layout currentPageName="Profile">
      <div className="w-full bg-neutral-950 text-neutral-100 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold sm:text-4xl">Your style profile</h1>
              <p className="text-neutral-400">
                Based on your scanned wardrobe and the pieces you like.
              </p>
            </div>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-300 transition hover:border-pink-500"
            >
              Reset data
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr]">
            <div className="rounded-3xl bg-neutral-900/80 border border-pink-500/20 p-5 sm:p-7 shadow-2xl space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Your fit data</h2>
                  <p className="text-sm text-neutral-400">
                    Set basics so StyleAI can tailor outfits and shopping tips.
                  </p>
                </div>
                {saveMessage && (
                  <span className="text-xs text-pink-200">{saveMessage}</span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="space-y-2 text-sm">
                  <span className="text-neutral-300">Gender / category</span>
                  <select
                    value={profile.gender}
                    onChange={(e) => handleProfileChange("gender", e.target.value)}
                    className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3 py-2 text-neutral-100 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/40"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="unisex">Unisex / mixed</option>
                    <option value="unspecified">Prefer not to say</option>
                  </select>
                </label>

                <label className="space-y-2 text-sm">
                  <span className="text-neutral-300">Height (cm)</span>
                  <input
                    type="number"
                    value={profile.height}
                    onChange={(e) => handleProfileChange("height", e.target.value)}
                    placeholder="e.g. 180"
                    className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3 py-2 text-neutral-100 placeholder:text-neutral-500 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/40"
                  />
                </label>

                <label className="space-y-2 text-sm">
                  <span className="text-neutral-300">Top size</span>
                  <select
                    value={profile.topSize}
                    onChange={(e) => handleProfileChange("topSize", e.target.value)}
                    className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3 py-2 text-neutral-100 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/40"
                  >
                    <option value="">Select</option>
                    <option value="xs">XS</option>
                    <option value="s">S</option>
                    <option value="m">M</option>
                    <option value="l">L</option>
                    <option value="xl">XL</option>
                  </select>
                </label>

                <label className="space-y-2 text-sm">
                  <span className="text-neutral-300">Bottom size</span>
                  <input
                    type="text"
                    value={profile.bottomSize}
                    onChange={(e) => handleProfileChange("bottomSize", e.target.value)}
                    placeholder="e.g. 30 / M"
                    className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3 py-2 text-neutral-100 placeholder:text-neutral-500 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/40"
                  />
                </label>

                <label className="space-y-2 text-sm">
                  <span className="text-neutral-300">Shoe size (optional)</span>
                  <input
                    type="text"
                    value={profile.shoeSize}
                    onChange={(e) => handleProfileChange("shoeSize", e.target.value)}
                    placeholder="e.g. 42 EU / 9 US"
                    className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3 py-2 text-neutral-100 placeholder:text-neutral-500 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/40"
                  />
                </label>
              </div>

              <div className="space-y-3">
                <span className="text-sm text-neutral-300">Style preferences</span>
                <div className="flex flex-wrap gap-2">
                  {styleTags.map((tag) => {
                    const active = profile.stylePrefs.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleStylePref(tag)}
                        className={`rounded-full px-3 py-1 text-sm border ${
                          active
                            ? "border-pink-500 bg-pink-500/20 text-pink-100"
                            : "border-neutral-700 text-neutral-300 hover:border-pink-500"
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <button
                  onClick={handleSaveProfile}
                  className="inline-flex items-center justify-center rounded-xl border border-pink-500/40 bg-pink-500/20 px-4 py-2 text-sm font-semibold text-pink-100 hover:bg-pink-500/30"
                >
                  Save profile
                </button>
                <p className="text-xs text-neutral-500">
                  We store this locally as <code>styleai_profile</code>.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {wardrobeEmpty ? (
                <div className="rounded-3xl border border-pink-500/20 bg-neutral-900/70 p-8 shadow-2xl text-center space-y-3">
                  <p className="text-lg font-semibold text-neutral-200">
                    {resetMessage || "No wardrobe items yet."}
                  </p>
                  <p className="text-neutral-400">
                    Scan or add pieces to see stats here.
                  </p>
                  <Link
                    to={createPageUrl("Scan")}
                    className="inline-flex items-center justify-center rounded-full border border-pink-500/40 bg-pink-500/10 px-4 py-2 text-sm font-semibold text-pink-100 hover:bg-pink-500/20"
                  >
                    Go to Scan
                  </Link>
                </div>
              ) : (
                <div className="rounded-3xl bg-neutral-900/80 border border-pink-500/20 p-5 shadow-2xl space-y-4">
                  <h2 className="text-sm uppercase tracking-[0.2em] text-neutral-400">
                    Wardrobe stats
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-2xl bg-neutral-900 border border-pink-500/20 p-4 text-center">
                      <div className="text-sm text-neutral-400">Owned</div>
                      <div className="text-3xl font-bold text-pink-100">
                        {totalOwned}
                      </div>
                    </div>
                    <div className="rounded-2xl bg-neutral-900 border border-pink-500/20 p-4 text-center">
                      <div className="text-sm text-neutral-400">Liked (inspo)</div>
                      <div className="text-3xl font-bold text-pink-100">
                        {totalLiked}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {Object.keys(categoryLabel).map((cat) => (
                      <div
                        key={cat}
                        className="flex items-center justify-between rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-2"
                      >
                        <span className="text-neutral-300">{categoryLabel[cat]}</span>
                        <span className="text-pink-300 font-semibold">
                          {ownedCounts[cat] || 0}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-3xl bg-neutral-900/80 border border-pink-500/20 p-5 shadow-2xl space-y-4">
                <h2 className="text-sm uppercase tracking-[0.2em] text-neutral-400">
                  Visual collage
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  {ownedCollage.map((item) => (
                    <div
                      key={item.id}
                      className="group relative aspect-square rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-neutral-950/70 flex items-center justify-center text-[11px] text-neutral-200 px-2 text-center">
                        <div>
                          <div className="font-semibold">{item.brand}</div>
                          <div className="text-neutral-300">{item.title}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {ownedCollage.length === 0 && (
                    <p className="text-sm text-neutral-500 col-span-3">
                      Add items to see a collage here.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-[0.2em] text-neutral-400">
                      Inspiration
                    </span>
                    <span className="rounded-full border border-pink-500/30 bg-pink-500/10 px-2 py-0.5 text-[11px] font-semibold text-pink-100">
                      {likedThumbs.length} / {totalLiked}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    {likedThumbs.map((item) => (
                      <div
                        key={item.id}
                        className="h-14 w-14 rounded-lg overflow-hidden border border-pink-500/30 bg-neutral-900"
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-400">
                            No image
                          </div>
                        )}
                      </div>
                    ))}
                    {likedThumbs.length === 0 && (
                      <p className="text-sm text-neutral-500">No inspiration pieces yet.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-neutral-900/80 border border-pink-500/20 p-5 shadow-2xl space-y-4">
                <h2 className="text-sm uppercase tracking-[0.2em] text-neutral-400">
                  Gaps & suggestions
                </h2>
                {suggestions.length === 0 ? (
                  <p className="text-sm text-neutral-400">
                    Looking balanced so far. Keep exploring new styles!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {suggestions.map((s, idx) => (
                      <div
                        key={`${s.text}-${idx}`}
                        className="flex items-center justify-between gap-3 rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-2"
                      >
                        <span className="text-sm text-neutral-200">{s.text}</span>
                        <Link
                          to={createPageUrl("StyleSwiper")}
                          className="shrink-0 rounded-full border border-pink-500/40 bg-pink-500/10 px-3 py-1 text-xs font-semibold text-pink-100 hover:bg-pink-500/20"
                        >
                          Browse ideas
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
