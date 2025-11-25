import React, { useState, useCallback } from "react";
import Layout from "../Layout";
import { Heart, X, Sparkles, RefreshCw } from "lucide-react";

const OUTFITS = [
  {
    id: 1,
    title: "Cozy coffee date",
    image:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&h=900&fit=crop",
    pieces: ["Beige oversized knit", "Light-wash jeans", "White trainers"],
    vibe: ["casual", "soft", "neutral"],
  },
  {
    id: 2,
    title: "Night out in the city",
    image:
      "https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=800&h=900&fit=crop",
    pieces: ["Black mini dress", "Strappy heels", "Shoulder bag"],
    vibe: ["party", "bold", "all-black"],
  },
  {
    id: 3,
    title: "Study session fit",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=900&fit=crop",
    pieces: ["Grey hoodie", "Wide-leg joggers", "Chunky sneakers"],
    vibe: ["comfy", "streetwear"],
  },
  {
    id: 4,
    title: "Summer brunch",
    image:
      "https://images.unsplash.com/photo-1529946825183-3367e2130b0c?w=800&h=900&fit=crop",
    pieces: ["Floral midi dress", "Sandals", "Mini tote bag"],
    vibe: ["feminine", "colourful"],
  },
];

const SWIPE_THRESHOLD = 80;

export default function StyleSwiper() {
  const [index, setIndex] = useState(0);
  const [likedIds, setLikedIds] = useState([]);
  const [dragStartX, setDragStartX] = useState(null);
  const [dragX, setDragX] = useState(0);
  const [leavingDirection, setLeavingDirection] = useState(null);

  const currentOutfit = OUTFITS[index];
  const isDragging = dragStartX !== null;

  const resetDeck = useCallback(() => {
    setIndex(0);
    setLikedIds([]);
    setDragX(0);
    setDragStartX(null);
    setLeavingDirection(null);
  }, []);

  const goToNextCard = useCallback(
    (direction) => {
      if (!currentOutfit || leavingDirection) return;
      const liked = direction === "right";

      if (liked) {
        setLikedIds((prev) =>
          prev.includes(currentOutfit.id)
            ? prev
            : [...prev, currentOutfit.id]
        );
      }

      setLeavingDirection(direction);

      setTimeout(() => {
        setIndex((prev) => prev + 1);
        setDragX(0);
        setDragStartX(null);
        setLeavingDirection(null);
      }, 220);
    },
    [currentOutfit, leavingDirection]
  );

  const handleDragStart = useCallback(
    (clientX) => {
      if (!currentOutfit || leavingDirection) return;
      setDragStartX(clientX);
    },
    [currentOutfit, leavingDirection]
  );

  const handleDragMove = useCallback(
    (clientX) => {
      if (dragStartX === null || !currentOutfit || leavingDirection) return;
      setDragX(clientX - dragStartX);
    },
    [dragStartX, currentOutfit, leavingDirection]
  );

  const handleRelease = useCallback(() => {
    if (dragStartX === null || !currentOutfit || leavingDirection) return;

    if (dragX > SWIPE_THRESHOLD) {
      goToNextCard("right");
      return;
    }

    if (dragX < -SWIPE_THRESHOLD) {
      goToNextCard("left");
      return;
    }

    setDragStartX(null);
    setDragX(0);
  }, [dragStartX, dragX, currentOutfit, leavingDirection, goToNextCard]);

  const translateX =
    leavingDirection === "right"
      ? 650
      : leavingDirection === "left"
      ? -650
      : dragX;
  const rotation =
    leavingDirection === "right"
      ? 16
      : leavingDirection === "left"
      ? -16
      : dragX * 0.05;

  const showFinished = index >= OUTFITS.length;

  return (
    <Layout currentPageName="StyleSwiper">
      <div className="max-w-3xl mx-auto w-full px-4 py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-pink-300">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-medium">Style Swiper</span>
            </div>
            <h1 className="mt-1 text-3xl font-bold text-white">
              Swipe looks you love
            </h1>
            <p className="text-neutral-400">
              Drag left to skip, right to save. Buttons below if you prefer.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-3 py-1 text-sm text-pink-100">
            <Heart className="h-4 w-4" />
            <span>{likedIds.length} saved</span>
          </div>
        </div>

        <div className="mt-8">
          {showFinished ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-pink-500/20 bg-neutral-900/80 px-6 py-12 text-center shadow-2xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-500/20 text-pink-200">
                <Sparkles className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-white">
                  You&apos;ve swiped through all outfits
                </h2>
                <p className="mt-2 text-neutral-400">
                  {likedIds.length === 0
                    ? "No saves this time — want to try again?"
                    : `You liked ${likedIds.length} look${
                        likedIds.length === 1 ? "" : "s"
                      }. Refresh to go again.`}
                </p>
              </div>
              <button
                onClick={resetDeck}
                className="inline-flex items-center gap-2 rounded-full bg-pink-500 px-4 py-2 text-sm font-semibold text-neutral-950 shadow-lg shadow-pink-500/30 transition hover:shadow-pink-500/40"
              >
                <RefreshCw className="h-4 w-4" />
                Restart swiping
              </button>
            </div>
          ) : (
            <div className="relative h-[520px] w-full select-none">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-pink-500/10 via-neutral-900 to-neutral-950" />

              <div
                className={`relative h-full w-full overflow-hidden rounded-3xl border border-pink-500/20 bg-neutral-900/80 shadow-2xl ${
                  !isDragging || leavingDirection
                    ? "transition-transform duration-200 ease-out"
                    : ""
                }`}
                style={{
                  transform: `translateX(${translateX}px) rotate(${rotation}deg)`,
                }}
                onMouseDown={(e) => handleDragStart(e.clientX)}
                onMouseMove={(e) => handleDragMove(e.clientX)}
                onMouseUp={handleRelease}
                onMouseLeave={handleRelease}
                onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
                onTouchMove={(e) => {
                  if (e.touches[0]) {
                    handleDragMove(e.touches[0].clientX);
                  }
                }}
                onTouchEnd={handleRelease}
              >
                <div className="absolute inset-0">
                  <img
                    src={currentOutfit.image}
                    alt={currentOutfit.title}
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
                </div>

                <div className="absolute inset-0 flex flex-col justify-between p-5">
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-neutral-200">
                    <div className="flex items-center gap-2 rounded-full bg-neutral-950/60 px-3 py-2 text-pink-100 shadow-inner shadow-pink-500/20">
                      <Sparkles className="h-4 w-4" />
                      <span>
                        {index + 1} / {OUTFITS.length}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-neutral-950/60 px-3 py-2 text-neutral-200">
                      <Heart
                        className={`h-4 w-4 ${
                          likedIds.includes(currentOutfit.id)
                            ? "fill-pink-500 text-pink-500"
                            : ""
                        }`}
                      />
                      <span>
                        {likedIds.includes(currentOutfit.id)
                          ? "Saved"
                          : "New look"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 rounded-2xl bg-neutral-950/70 p-4 backdrop-blur">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-2xl font-semibold text-white">
                        {currentOutfit.title}
                      </h3>
                      <div className="flex flex-wrap items-center justify-end gap-2 text-xs uppercase tracking-wider text-neutral-300">
                        {currentOutfit.vibe.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-neutral-800 px-3 py-1 text-neutral-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 text-sm text-neutral-200">
                      {currentOutfit.pieces.map((piece) => (
                        <span
                          key={piece}
                          className="rounded-full border border-neutral-800 bg-neutral-900/80 px-3 py-1"
                        >
                          {piece}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs text-neutral-400">
                      <span>Swipe right to keep, left to pass</span>
                      <div className="flex items-center gap-1 text-pink-200">
                        <Heart className="h-3 w-3" />
                        <span>Trust your vibe</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            onClick={() => goToNextCard("left")}
            disabled={showFinished || leavingDirection !== null}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-1 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900/80 px-4 py-3 text-sm text-neutral-300">
            Swipe left to skip, right to save
          </div>

          <button
            onClick={() => goToNextCard("right")}
            disabled={showFinished || leavingDirection !== null}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-pink-500/40 bg-pink-500/10 text-pink-200 transition hover:bg-pink-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Heart className="h-5 w-5" />
          </button>
        </div>
      </div>
    </Layout>
  );
}
