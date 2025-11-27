// src/Pages/Outfits.jsx
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Layout from "../Layout";
import useWeather from "../hooks/useWeather";
import { shouldShowForProfile } from "../utils";

const WARDROBE_KEY = "styleai_wardrobe";
const LEGACY_WARDROBE_KEY = "styleAI-wardrobe";
const PROFILE_KEY = "styleAI-profile";
const LEGACY_PROFILE_KEY = "styleai_profile";
const DEFAULT_PROFILE = { genderPreference: "unspecified", location: "" };

const HARD_CODED_WARDROBE = [
  {
    id: "w-1",
    title: "Slim Oxford Shirt",
    brand: "Ralph Lauren",
    image:
      "https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-305179_alternate10?$rl_4x5_pdp$",
    category: "shirt",
    owned: true,
    audience: "male",
  },
  {
    id: "w-2",
    title: "501 Original Jeans",
    brand: "Levi's",
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop",
    category: "jeans",
    owned: true,
    audience: "unisex",
  },
  {
    id: "w-3",
    title: "Tailored Wool Coat",
    brand: "COS",
    image:
      "https://media.cos.com/assets/001/bd/50/bd501a8ec8ba88a0a4e359d93c76de2abe893045_xxl-1.jpg?imwidth=1260",
    category: "coat",
    owned: true,
    audience: "unisex",
  },
  {
    id: "w-4",
    title: "Replica Sneakers",
    brand: "Maison Margiela",
    image:
      "https://www.maisonmargiela.com/dw/image/v2/AAPK_PRD/on/demandware.static/-/Sites-margiela-master-catalog/default/dw00402936/images/large/S57WS0236_P1895_T6065_F.jpg?sw=1024&q=80",
    category: "sneakers",
    owned: true,
    audience: "unisex",
  },
  {
    id: "w-5",
    title: "Grey Zip Hoodie",
    brand: "GAP",
    image: "https://www.gapcanada.ca/webcontent/0056/550/357/cn56550357.jpg",
    category: "hoodie",
    owned: true,
    audience: "unisex",
  },
  {
    id: "w-6",
    title: "Black Leather Jacket",
    brand: "Saint Laurent",
    image:
      "https://saint-laurent.dam.kering.com/m/70a73b88f516dd0b/Medium2-778485YCNF21000_A.jpg?v=5",
    category: "jacket",
    owned: true,
    audience: "unisex",
  },
  {
    id: "w-7",
    title: "Linen Resort Shirt",
    brand: "H&M",
    image:
      "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQfkIC4RQHBJnWZpITnTC7UVSQkD-5t8YAKFNw6Cq3YVmcSI865TU47AGhn-E1DWWJzF7LKnAT-xfvqCrv71eLVoJX8zu1qZfpBUpTsIK3JVTcGzKp0dwouRA",
    category: "shirt",
    owned: true,
    audience: "unisex",
  },
  {
    id: "w-8",
    title: "Oversized Trench",
    brand: "Burberry",
    image:
      "https://assets.burberry.com/is/image/Burberryltd/EC5C7407-7705-4CD9-B59E-1AAB2C33E8E3?wid=200",
    category: "trench",
    owned: true,
    audience: "unisex",
  },
  {
    id: "w-9",
    title: "Everyday Tote Bag",
    brand: "Cuyana",
    image:
      "https://images.unsplash.com/photo-1542293772-53b4c68da5c7?w=400&h=400&fit=crop",
    category: "bag",
    owned: true,
    audience: "unisex",
  },
];

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

  if (slotMatchers.dress.some((word) => haystack.includes(word))) {
    return "dress";
  }
  if (slotMatchers.outerwear.some((word) => haystack.includes(word))) {
    return "outerwear";
  }
  if (slotMatchers.top.some((word) => haystack.includes(word))) {
    return "top";
  }
  if (slotMatchers.bottom.some((word) => haystack.includes(word))) {
    return "bottom";
  }
  if (slotMatchers.shoes.some((word) => haystack.includes(word))) {
    return "shoes";
  }
  if (slotMatchers.accessory.some((word) => haystack.includes(word))) {
    return "accessory";
  }
  return "other";
};

const randomFrom = (arr) => {
  if (!arr?.length) return null;
  return arr[Math.floor(Math.random() * arr.length)];
};

const labelOutfit = (pieces) => {
  const hasOuter = pieces.some((p) => inferSlot(p) === "outerwear");
  const hasDress = pieces.some((p) => inferSlot(p) === "dress");
  const hasShoes = pieces.some((p) => inferSlot(p) === "shoes");
  const hasTop = pieces.some((p) => inferSlot(p) === "top");
  const hasBottom = pieces.some((p) => inferSlot(p) === "bottom");
  const hasAccessory = pieces.some((p) => inferSlot(p) === "accessory");
  const count = pieces.length;

  const pickName = (options, fallback) => randomFrom(options) || fallback;

  if (count === 2) {
    return pickName(
      ["Minimal combo", "Simple two-piece fit", "Quick daily pair", "Light mix"],
      "Simple two-piece fit"
    );
  }

  if (hasOuter && hasShoes && (hasTop || hasBottom || hasDress)) {
    if (count >= 4 && hasAccessory) {
      return pickName(
        [
          "Fully styled layered look",
          "Complete going-out outfit",
          "Head-to-toe layered fit",
          "Accessories-on layered combo",
        ],
        "Complete layered look"
      );
    }
    return pickName(
      [
        "City layers fit",
        "Smart layered outfit",
        "Cold-weather daily fit",
        "Evening layered look",
        "Street layer stack",
      ],
      "Layered look"
    );
  }

  if (hasOuter && !hasShoes) {
    return pickName(
      ["Light layering", "Transitional layers", "Throw-on jacket fit", "Casual top layer"],
      "Light layering"
    );
  }

  if (hasDress && hasShoes) {
    return pickName(
      [
        "Dress night out",
        "Simple dress look",
        "Effortless dress outfit",
        "Weekend dress combo",
      ],
      "Dress look"
    );
  }

  if (hasTop && hasBottom && hasShoes && !hasOuter) {
    return pickName(
      [
        "Smart casual outfit",
        "Everyday jeans fit",
        "Basic daily combo",
        "Relaxed casual look",
      ],
      "Smart casual outfit"
    );
  }

  return pickName(
    ["Simple outfit", "Everyday combo", "Easy grab-and-go"],
    "Everyday outfit"
  );
};

const scoreOutfitForWeather = (outfit, weatherTag) => {
  const hasOuter = outfit.pieces.some((p) => inferSlot(p) === "outerwear");
  const hasDress = outfit.pieces.some((p) => inferSlot(p) === "dress");
  const hasShortsOrSkirt = outfit.pieces.some((p) =>
    (p.category || "").toLowerCase().includes("short") ||
    (p.category || "").toLowerCase().includes("skirt")
  );

  switch (weatherTag) {
    case "cold":
    case "snow":
      return hasOuter ? 2 : 0;
    case "cool":
      return hasOuter ? 1 : 0;
    case "hot":
      return hasDress || hasShortsOrSkirt ? 2 : 0;
    case "warm":
      return hasDress || hasShortsOrSkirt ? 1 : 0;
    case "rain":
      return hasOuter ? 1 : 0;
    default:
      return 0;
  }
};

export default function Outfits() {
  const [wardrobe, setWardrobe] = useState([]);
  const [outfits, setOutfits] = useState([]);
  const [activeDetailsId, setActiveDetailsId] = useState(null);
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const { weatherTag } = useWeather(profile.location);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const wardrobeRaw =
        window.localStorage.getItem(WARDROBE_KEY) ||
        window.localStorage.getItem(LEGACY_WARDROBE_KEY);
      const profileRaw =
        window.localStorage.getItem(PROFILE_KEY) ||
        window.localStorage.getItem(LEGACY_PROFILE_KEY);
      const parsedWardrobe = wardrobeRaw ? JSON.parse(wardrobeRaw) : [];
      const parsedProfile = profileRaw ? JSON.parse(profileRaw) : DEFAULT_PROFILE;
      const useWardrobe =
        Array.isArray(parsedWardrobe) && parsedWardrobe.length
          ? parsedWardrobe
          : HARD_CODED_WARDROBE;
      const withNormalizedFields = useWardrobe.map((item) => ({
        ...item,
        title: item.title || item.name,
        image: item.image || item.imageUrl,
        audience: item.audience || "unisex",
      }));
      const filtered = withNormalizedFields.filter((item) =>
        shouldShowForProfile(item, parsedProfile)
      );
      setWardrobe(filtered);
      setProfile({ ...DEFAULT_PROFILE, ...(parsedProfile || {}) });
    } catch (err) {
      setWardrobe(HARD_CODED_WARDROBE.map((item) => ({ ...item, audience: item.audience || "unisex" })));
      setProfile(DEFAULT_PROFILE);
    }
  }, []);

  const buckets = useMemo(() => {
    const grouped = {
      top: [],
      bottom: [],
      shoes: [],
      outerwear: [],
      dress: [],
      accessory: [],
      other: [],
    };
    wardrobe.forEach((item) => {
      const slot = inferSlot(item);
      if (grouped[slot]) {
        grouped[slot].push(item);
      } else {
        grouped.other.push(item);
      }
    });
    return grouped;
  }, [wardrobe]);

  const enrichOutfitsWithAI = useCallback(async (baseOutfits) => {
    try {
      const response = await fetch("/api/outfit-labels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ outfits: baseOutfits }),
      });

      if (!response.ok) {
        return baseOutfits;
      }

      const data = await response.json();
      const labels = Array.isArray(data?.labels) ? data.labels : [];
      const labelsById = labels.reduce((acc, label) => {
        if (label?.id) {
          acc[label.id] = label;
        }
        return acc;
      }, {});

      return baseOutfits.map((outfit) => {
        const label = labelsById[outfit.id];
        if (!label) return outfit;
        return { ...outfit, aiName: label.name, aiVibe: label.vibe };
      });
    } catch (err) {
      return baseOutfits;
    }
  }, []);

  const generateOutfits = useCallback(async () => {
    const combos = [];
    const used = new Set();
    const availableCount = wardrobe.length;

    if (availableCount === 0) {
      setOutfits([]);
      setActiveDetailsId(null);
      return;
    }

    const target = Math.min(6, Math.max(3, Math.min(availableCount, 6)));

    let guard = 0;
    while (combos.length < target && guard < 120) {
      guard += 1;

      const pieces = [];
      const pickedIds = new Set();

      const roll = Math.random();
      const canUseDress = buckets.dress.length > 0;
      const useDress =
        canUseDress &&
        (roll < 0.3 || !buckets.top.length || !buckets.bottom.length);

      if (useDress) {
        const dress = randomFrom(buckets.dress);
        if (dress) {
          pieces.push(dress);
          pickedIds.add(dress.id);
        }
      } else {
        const startFromBottom = Math.random() < 0.3 && buckets.bottom.length;

        if (startFromBottom) {
          const bottom = randomFrom(buckets.bottom);
          if (bottom) {
            pieces.push(bottom);
            pickedIds.add(bottom.id);
          }
          const top =
            randomFrom(buckets.top) ||
            randomFrom([...buckets.other, ...buckets.outerwear]);
          if (top && !pickedIds.has(top.id)) {
            pieces.push(top);
            pickedIds.add(top.id);
          }
        } else {
          const top =
            randomFrom(buckets.top) ||
            randomFrom([...buckets.other, ...buckets.outerwear]);
          if (top) {
            pieces.push(top);
            pickedIds.add(top.id);
          }
          if (buckets.bottom.length) {
            const bottom = randomFrom(buckets.bottom);
            if (bottom && !pickedIds.has(bottom.id)) {
              pieces.push(bottom);
              pickedIds.add(bottom.id);
            }
          }
        }
      }

      if (buckets.shoes.length) {
        const shoes = randomFrom(buckets.shoes);
        if (shoes && !pickedIds.has(shoes.id)) {
          pieces.push(shoes);
          pickedIds.add(shoes.id);
        }
      }

      if (
        buckets.outerwear.length &&
        !pieces.some((p) => inferSlot(p) === "outerwear") &&
        Math.random() < 0.7
      ) {
        const outer = randomFrom(buckets.outerwear);
        if (outer && !pickedIds.has(outer.id)) {
          pieces.push(outer);
          pickedIds.add(outer.id);
        }
      }

      const maxAccessories = Math.min(
        2,
        buckets.accessory.length,
        pieces.length >= 3 ? 2 : 1
      );
      const accessoriesToAdd = Math.min(
        maxAccessories,
        Math.random() < 0.5 ? 1 : maxAccessories
      );

      for (let i = 0; i < accessoriesToAdd; i += 1) {
        const availableAccessories = buckets.accessory.filter(
          (acc) => !pickedIds.has(acc.id)
        );
        if (!availableAccessories.length) break;
        const accessory = randomFrom(availableAccessories);
        if (accessory) {
          pieces.push(accessory);
          pickedIds.add(accessory.id);
        }
      }

      if (pieces.length < 2) {
        const fallbackPool = [
          ...buckets.top,
          ...buckets.bottom,
          ...buckets.shoes,
          ...buckets.outerwear,
          ...buckets.accessory,
          ...buckets.other,
        ].filter((item) => !pickedIds.has(item.id));

        while (pieces.length < 2 && fallbackPool.length) {
          const pick = randomFrom(fallbackPool);
          if (pick && !pickedIds.has(pick.id)) {
            pieces.push(pick);
            pickedIds.add(pick.id);
          }
        }
      }

      if (pieces.length < 2) continue;

      const signature = pieces
        .map((p) => p.id)
        .sort((a, b) => String(a).localeCompare(String(b)))
        .join("-");

      if (used.has(signature)) continue;

      used.add(signature);
      combos.push({
        id: `outfit-${signature}-${combos.length}`,
        name: labelOutfit(pieces),
        pieces,
      });
    }

    const sorted = combos.sort(
      (a, b) => scoreOutfitForWeather(b, weatherTag) - scoreOutfitForWeather(a, weatherTag)
    );
    const enriched = await enrichOutfitsWithAI(sorted);
    setOutfits(enriched);
    setActiveDetailsId(null);
  }, [buckets, wardrobe.length, weatherTag, enrichOutfitsWithAI]);

  useEffect(() => {
    generateOutfits();
  }, [generateOutfits]);

  const handleCopy = async (outfit) => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    const text = `Outfit: ${outfit.pieces
      .map((p) => `${p.brand || "Your wardrobe"} ${p.title || p.name}`.trim())
      .join(", ")}`;
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      // ignore
    }
  };

  const ownedCount = wardrobe.length;
  const showEmpty = ownedCount === 0;

  return (
    <Layout currentPageName="Outfits">
      <div className="w-full bg-neutral-950 text-neutral-100 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold sm:text-4xl">
                Outfits from your wardrobe
              </h1>
              <p className="text-neutral-400">
                We build looks using the items you&apos;ve scanned into StyleAI.
              </p>
              {profile.location && weatherTag !== "neutral" && (
                <p className="text-sm text-pink-200">
                  Weather signal: {weatherTag} where you are – suggesting outfits to match.
                </p>
              )}
            </div>
            {!showEmpty && (
              <button
                onClick={generateOutfits}
                className="inline-flex items-center gap-2 rounded-full border border-pink-500/40 bg-pink-500/10 px-4 py-2 text-sm font-semibold text-pink-100 shadow-pink-500/20 shadow-lg transition hover:bg-pink-500/20"
              >
                Generate again
              </button>
            )}
          </div>

          {showEmpty ? (
            <div className="rounded-3xl border border-pink-500/20 bg-neutral-900/70 p-10 shadow-2xl text-center space-y-3">
              <p className="text-lg font-semibold text-neutral-200">
                No wardrobe items yet. Scan or add pieces to start generating
                outfits.
              </p>
              <p className="text-neutral-400">
                You can still explore vibes in Style Swiper.
              </p>
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="text-sm text-neutral-400">
                  Using {ownedCount} piece
                  {ownedCount !== 1 ? "s" : ""} from your wardrobe
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {outfits.map((outfit) => {
                  const totalPieces = outfit.pieces.length;
                  const detailsOpen = activeDetailsId === outfit.id;
                  return (
                    <div
                      key={outfit.id}
                      className="group rounded-3xl bg-neutral-950 border border-pink-500/20 shadow-2xl overflow-hidden flex flex-col"
                      onClick={() =>
                        setActiveDetailsId((prev) =>
                          prev === outfit.id ? null : outfit.id
                        )
                      }
                    >
                      <div className="relative">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-5 bg-neutral-900/60">
                          {outfit.pieces.map((piece) => (
                            <div
                              key={piece.id}
                              className="aspect-4/5 rounded-2xl overflow-hidden bg-neutral-900 border border-pink-500/20 shadow-lg shadow-pink-500/10"
                            >
                              {piece.image ? (
                                <img
                                  src={piece.image}
                                  alt={piece.title || piece.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-neutral-400">
                                  No image
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        <div
                          className={`pointer-events-none absolute inset-0 flex flex-col justify-end bg-linear-to-t from-neutral-950/90 via-neutral-950/50 to-transparent px-5 pb-4 transition-all duration-300 ${
                            detailsOpen
                              ? "opacity-100 translate-y-0"
                              : "opacity-0 translate-y-6 group-hover:translate-y-0 group-hover:opacity-100"
                          }`}
                        >
                          <div className="rounded-2xl border border-pink-500/30 bg-neutral-900/90 backdrop-blur px-3 py-2 space-y-1">
                            <div className="text-xs uppercase tracking-[0.2em] text-pink-200/80">
                              Pieces
                            </div>
                            <ul className="text-sm text-neutral-200 space-y-1 max-h-32 overflow-auto">
                              {outfit.pieces.map((piece) => (
                                <li
                                  key={`${outfit.id}-${piece.id}`}
                                  className="flex justify-between gap-2"
                                >
                                  <span className="text-neutral-300">
                                    {piece.brand || "Brand"}
                                  </span>
                                  <span className="text-neutral-400 text-right">
                                    {piece.title || piece.name}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="p-5 space-y-3 flex-1 flex flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <h3 className="text-xl font-semibold">
                              {outfit.aiName || outfit.name}
                            </h3>
                            <p className="text-sm text-neutral-300">
                              {outfit.aiVibe || "AI vibe description will appear here once generated."}
                            </p>
                            <p className="text-sm text-neutral-400">
                              {totalPieces} piece
                              {totalPieces !== 1 ? "s" : ""} from your
                              wardrobe
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveDetailsId((prev) =>
                                prev === outfit.id ? null : outfit.id
                              );
                            }}
                            className="shrink-0 rounded-full border border-pink-500/40 bg-pink-500/10 px-3 py-1 text-xs font-semibold text-pink-100 hover:bg-pink-500/20"
                          >
                            {detailsOpen ? "Hide details" : "Show details"}
                          </button>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(outfit);
                          }}
                          className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-pink-500/50 bg-pink-500/15 px-4 py-3 text-sm font-semibold text-pink-100 transition hover:bg-pink-500/25"
                        >
                          Copy outfit
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {outfits.length === 0 && (
                <div className="rounded-3xl border border-pink-500/20 bg-neutral-900/70 p-8 shadow-2xl text-center">
                  <p className="text-neutral-300 font-semibold">
                    Not enough variety to build outfits yet. Add more wardrobe
                    items.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
