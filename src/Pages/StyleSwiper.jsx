// src/Pages/StyleSwiper.jsx
import React, { useState, useCallback } from "react";
import Layout from "../Layout";
import { Heart, X, Sparkles, RefreshCw } from "lucide-react";

const CLOTHES = [
  {
    id: 1,
    title: "Replica sneakers",
    brand: "Maison Margiela",
    image:
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=900&h=1200&fit=crop",
  },
  {
    id: 2,
    title: "Grey fleece hoodie",
    brand: "Champion Reverse Weave",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&h=1200&fit=crop",
  },
  {
    id: 3,
    title: "Slim oxford shirt",
    brand: "Ralph Lauren",
    image:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=900&h=1200&fit=crop",
  },
  {
    id: 4,
    title: "Black leather jacket",
    brand: "AllSaints",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&h=1200&fit=crop",
  },
  {
    id: 5,
    title: "Tailored wool coat",
    brand: "COS",
    image:
      "https://images.unsplash.com/photo-1542293787938-4d273c360af7?w=900&h=1200&fit=crop",
  },
  {
    id: 6,
    title: "Linen resort shirt",
    brand: "Orlebar Brown",
    image:
      "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=900&h=1200&fit=crop",
  },
  {
    id: 7,
    title: "Tonal tech parka",
    brand: "Acronym",
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&h=1200&fit=crop",
  },
  {
    id: 8,
    title: "Silk slip dress",
    brand: "Reformation",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&h=1200&fit=crop",
  },
  {
    id: 9,
    title: "Oversized trench",
    brand: "Burberry",
    image:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900&h=1200&fit=crop",
  },
];

const SWIPE_THRESHOLD = 80;

export default function StyleSwiper() {
  const [index, setIndex] = useState(0);
  const [likedIds, setLikedIds] = useState([]);
  const [dragStartX, setDragStartX] = useState(null);
  const [dragX, setDragX] = useState(0);
  const [leavingDirection, setLeavingDirection] = useState(null);
  const [history, setHistory] = useState([]); // {id, liked}

  const currentItem = CLOTHES[index];
  const isDragging = dragStartX !== null;
  const showFinished = index >= CLOTHES.length;

  const resetDeck = useCallback(() => {
    setIndex(0);
    setLikedIds([]);
    setDragX(0);
    setDragStartX(null);
    setLeavingDirection(null);
    setHistory([]);
  }, []);

  const goToNextCard = useCallback(
    (direction) => {
      if (!currentItem || leavingDirection) return;
      const liked = direction === "right";

      setHistory((prev) => [...prev, { id: currentItem.id, liked }]);

      if (liked) {
        setLikedIds((prev) =>
          prev.includes(currentItem.id) ? prev : [...prev, currentItem.id]
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
    [currentItem, leavingDirection]
  );

  const handleDragStart = useCallback(
    (clientX) => {
      if (!currentItem || leavingDirection) return;
      setDragStartX(clientX);
    },
    [currentItem, leavingDirection]
  );

  const handleDragMove = useCallback(
    (clientX) => {
      if (dragStartX === null || !currentItem || leavingDirection) return;
      setDragX(clientX - dragStartX);
    },
    [dragStartX, currentItem, leavingDirection]
  );

  const handleRelease = useCallback(() => {
    if (dragStartX === null || !currentItem || leavingDirection) return;

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
  }, [dragStartX, dragX, currentItem, leavingDirection, goToNextCard]);

  const handleUndo = () => {
    if (history.length === 0 || leavingDirection || index === 0) return;

    const last = history[history.length - 1];

    setHistory((prev) => prev.slice(0, -1));
    setIndex((prev) => Math.max(prev - 1, 0));
    setDragX(0);
    setDragStartX(null);
    setLeavingDirection(null);

    if (last.liked) {
      setLikedIds((prev) => prev.filter((id) => id !== last.id));
    }
  };

  const translateX =
    leavingDirection === "right"
      ? 650
      : leavingDirection === "left"
      ? -650
      : dragX;

  const rotation =
    leavingDirection === "right"
      ? 10
      : leavingDirection === "left"
      ? -10
      : dragX * 0.03;

  const rightOpacity =
    leavingDirection === "right"
      ? 1
      : dragX > 0
      ? Math.min(dragX / SWIPE_THRESHOLD, 1)
      : 0;

  const leftOpacity =
    leavingDirection === "left"
      ? 1
      : dragX < 0
      ? Math.min(Math.abs(dragX) / SWIPE_THRESHOLD, 1)
      : 0;

  const canUndo = history.length > 0 && !leavingDirection && index > 0;

  return (
    <Layout currentPageName="StyleSwiper">
      <div className="max-w-5xl mx-auto w-full px-4 py-6 md:py-7">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-pink-300">
              <Sparkles className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase tracking-wide">
                Style Swiper
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              Swipe pieces you love
            </h1>
            <p className="text-sm text-neutral-400 sm:text-base">
              Drag left to pass, right to keep. Buttons below if you prefer.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-3 py-1 text-xs font-semibold text-pink-100 sm:text-sm">
            <Heart className="h-4 w-4" />
            <span>{likedIds.length} saved</span>
          </div>
        </div>

        {/* Card area */}
        <div className="mt-5 md:mt-6 flex flex-col items-center gap-4">
          {showFinished ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-pink-500/20 bg-neutral-900/80 px-6 py-10 text-center shadow-2xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-500/20 text-pink-200">
                <Sparkles className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white sm:text-2xl">
                  You&apos;ve swiped through all pieces
                </h2>
                <p className="mt-2 text-sm text-neutral-400 sm:text-base">
                  {likedIds.length === 0
                    ? "No keepers this round — want another go?"
                    : `You kept ${likedIds.length} piece${
                        likedIds.length === 1 ? "" : "s"
                      }. Restart to swipe again.`}
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
            currentItem && (
              <>
                {/* CARD */}
                <div className="relative w-full max-w-md aspect-[3/4] select-none">
                  <div
                    className={`relative h-full w-full overflow-hidden rounded-[32px] bg-neutral-900 shadow-xl ${
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
                    {/* Full-bleed image */}
                    <img
                      src={currentItem.image}
                      alt={currentItem.title}
                      className="h-full w-full object-cover"
                      draggable={false}
                    />

                    {/* Progress pill */}
                    <div className="pointer-events-none absolute top-4 inset-x-0 flex justify-center">
                      <div className="flex items-center gap-2 rounded-full bg-neutral-950/80 px-3 py-1 text-xs font-semibold text-pink-100">
                        <Sparkles className="h-4 w-4" />
                        <span>
                          {index + 1} / {CLOTHES.length}
                        </span>
                      </div>
                    </div>

                    {/* Tinder-style overlays */}
                    <div className="pointer-events-none absolute inset-0">
                      <div
                        className="absolute top-6 left-6 flex items-center gap-2 rounded-2xl border-2 border-emerald-400/80 bg-emerald-500/10 px-4 py-2 text-sm font-bold tracking-widest text-emerald-300 rotate-[-10deg]"
                        style={{ opacity: rightOpacity }}
                      >
                        <Heart className="h-4 w-4" />
                        KEEP
                      </div>
                      <div
                        className="absolute top-6 right-6 flex items-center gap-2 rounded-2xl border-2 border-red-400/80 bg-red-500/10 px-4 py-2 text-sm font-bold tracking-widest text-red-300 rotate-[10deg]"
                        style={{ opacity: leftOpacity }}
                      >
                        <X className="h-4 w-4" />
                        PASS
                      </div>
                    </div>
                  </div>
                </div>

                {/* Text under card */}
                <div className="text-center space-y-1">
                  <h3 className="text-xl font-semibold text-white sm:text-2xl">
                    {currentItem.title}
                  </h3>
                  <p className="text-sm text-neutral-400">
                    {currentItem.brand}
                  </p>
                  <p className="text-xs text-neutral-500">
                    Swipe right to keep, left to pass.
                  </p>
                </div>
              </>
            )
          )}
        </div>

        {/* Controls */}
        <div className="mt-5 md:mt-6 flex items-center justify-between gap-3 max-w-md mx-auto">
          <button
            onClick={() => goToNextCard("left")}
            disabled={showFinished || leavingDirection !== null}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50 md:h-12 md:w-12"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            onClick={handleUndo}
            disabled={!canUndo}
            className="flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-900/80 px-4 py-2 text-xs text-neutral-200 transition hover:border-neutral-600 disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm"
          >
            <RefreshCw className="h-4 w-4" />
            Undo last swipe
          </button>

          <button
            onClick={() => goToNextCard("right")}
            disabled={showFinished || leavingDirection !== null}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-pink-500/40 bg-pink-500/10 text-pink-200 transition hover:bg-pink-500/20 disabled:cursor-not-allowed disabled:opacity-50 md:h-12 md:w-12"
          >
            <Heart className="h-5 w-5" />
          </button>
        </div>
      </div>
    </Layout>
  );
}
