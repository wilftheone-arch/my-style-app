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
      "https://www.maisonmargiela.com/dw/image/v2/AAPK_PRD/on/demandware.static/-/Sites-margiela-master-catalog/default/dw00402936/images/large/S57WS0236_P1895_T6065_F.jpg?sw=1024&q=80",
  },
  {
    id: 2,
    title: "Grey fleece hoodie",
    brand: "Champion Reverse Weave",
    image:
      "https://www.gapcanada.ca/webcontent/0056/550/357/cn56550357.jpg",
  },
  {
    id: 3,
    title: "Slim oxford shirt",
    brand: "Ralph Lauren",
    image:
      "https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-305179_alternate10?$rl_4x5_pdp$",
  },
  {
    id: 4,
    title: "Black leather jacket",
    brand: "AllSaints",
    image:
      "https://saint-laurent.dam.kering.com/m/70a73b88f516dd0b/Medium2-778485YCNF21000_A.jpg?v=5",
  },
  {
    id: 5,
    title: "Tailored wool coat",
    brand: "COS",
    image:
      "https://media.cos.com/assets/001/bd/50/bd501a8ec8ba88a0a4e359d93c76de2abe893045_xxl-1.jpg?imwidth=1260",
  },
  {
    id: 6,
    title: "Linen resort shirt",
    brand: "Orlebar Brown",
    image:
      "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQfkIC4RQHBJnWZpITnTC7UVSQkD-5t8YAKFNw6Cq3YVmcSI865TU47AGhn-E1DWWJzF7LKnAT-xfvqCrv71eLVoJX8zu1qZfpBUpTsIK3JVTcGzKp0dwouRA",
  },
  {
    id: 7,
    title: "Tonal tech parka",
    brand: "Acronym",
    image:
      "https://images-dynamic-arcteryx.imgix.net/details/1350x1710/F25-X000009914-Therme-Down-Parka-Carob-Back-View.jpg?auto=format%2Ccompress&q=70&fit=crop&fill=white&dpr=2&ixlib=react-9.10.0&w=927",
  },
  {
    id: 8,
    title: "Silk slip dress",
    brand: "Reformation",
    image:
      "https://media.thereformation.com/image/upload/f_auto,q_auto:eco,dpr_2.0/w_500/PRD-SFCC/1318428/SUGAR/1318428.1.SUGAR",
  },
  {
    id: 9,
    title: "Oversized trench",
    brand: "Burberry",
    image:
      "https://assets.burberry.com/is/image/Burberryltd/EC5C7407-7705-4CD9-B59E-1AAB2C33E8E3?wid=200",
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
                <div className="relative w-full max-w-md aspect-3/4 select-none">
                  <div
                    className={`relative mx-auto h-full flex items-center justify-center ${
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
                    {/* Progress pill */}
                    <div className="pointer-events-none absolute top-4 inset-x-0 flex justify-center">
                      <div className="flex items-center gap-2 rounded-full bg-neutral-950/80 px-3 py-1 text-xs font-semibold text-pink-100">
                        <Sparkles className="h-4 w-4" />
                        <span>
                          {index + 1} / {CLOTHES.length}
                        </span>
                      </div>
                    </div>

                    <div className="w-full max-w-sm aspect-3/4 rounded-3xl bg-neutral-950 shadow-2xl border border-pink-500/20 overflow-hidden">
                      {/* Card content */}
                      <div className="flex h-full flex-col items-center justify-between px-10 py-10">
                        {/* Big image area */}
                        <div className="flex items-center justify-center w-full mb-6 max-h-[70%]">
                          <img
                            src={currentItem.image}
                            alt={currentItem.title}
                            className="h-full w-full object-contain rounded-3xl"
                            draggable={false}
                          />
                        </div>

                        {/* Text area */}
                        <div className="space-y-2 text-center">
                          <h3 className="text-xl font-semibold text-white sm:text-2xl">
                            {currentItem.title}
                          </h3>
                          <p className="text-xs text-neutral-400 sm:text-sm">
                            {currentItem.brand}
                          </p>
                          <p className="mt-2 text-[11px] text-neutral-500 sm:text-xs">
                            Swipe right to keep, left to pass.
                          </p>
                        </div>
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
                        className="absolute top-6 right-6 flex items-center gap-2 rounded-2xl border-2 border-red-400/80 bg-red-500/10 px-4 py-2 text-sm font-bold tracking-widest text-red-300 rotate-10"
                        style={{ opacity: leftOpacity }}
                      >
                        <X className="h-4 w-4" />
                        PASS
                      </div>
                    </div>
                  </div>
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
