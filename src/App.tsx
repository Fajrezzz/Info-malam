import { useEffect, useMemo, useRef, useState } from "react";
import { photos, type Photo } from "./photo";

const CATEGORIES = [
  "WATCH",
  "EXPERIENCE",
  "RANDOM",
  "GAMES",
  "ABOUT",
  "PRIVATE",
  "LOVE",
];

const photosWithCategory = photos.map((photo, index) => ({
  ...photo,
  category: CATEGORIES[index % CATEGORIES.length],
}));

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selected, setSelected] = useState<Photo | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [rgb, setRgb] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  /* =========================
     WELCOME
  ========================= */

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  /* =========================
     SOFT RGB
  ========================= */

  useEffect(() => {
    let frame: number;

    const animate = () => {
      setRgb((v) => (v + 0.12) % 360);
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);
  }, []);

  const color1 = `hsl(${rgb}, 100%, 65%)`;
  const color2 = `hsl(${(rgb + 100) % 360}, 100%, 65%)`;

  /* =========================
     AUTOPLAY
  ========================= */

  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {
      setActiveIndex(
        (prev) => (prev + 1) % photosWithCategory.length
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [autoplay]);

  /* =========================
     SWIPE MOBILE
  ========================= */

  const touchStartX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff =
      touchStartX.current - e.changedTouches[0].clientX;

    if (diff > 50) {
      setActiveIndex(
        (prev) => (prev + 1) % photosWithCategory.length
      );
    }

    if (diff < -50) {
      setActiveIndex(
        (prev) =>
          (prev - 1 + photosWithCategory.length) %
          photosWithCategory.length
      );
    }
  };

  /* =========================
     RANDOM
  ========================= */

  const randomPhoto = () => {
    let next = Math.floor(
      Math.random() * photosWithCategory.length
    );

    while (
      next === activeIndex &&
      photosWithCategory.length > 1
    ) {
      next = Math.floor(
        Math.random() * photosWithCategory.length
      );
    }

    setActiveIndex(next);
  };

  /* =========================
     IMAGE LOADING
  ========================= */

  const handleImageLoad = (id: string) => {
    setLoadedImages((prev) => ({
      ...prev,
      [id]: true,
    }));
  };

  /* =========================
     FILTER
  ========================= */

  const filteredPhotos = useMemo(() => {
    if (filter === "ALL") {
      return photosWithCategory;
    }

    return photosWithCategory.filter(
      (photo) => photo.category === filter
    );
  }, [filter]);

  const activePhoto = photosWithCategory[activeIndex];

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#08080b] text-white">

      {/* ==================================================
          VERY SOFT RGB AMBIENT
      ================================================== */}

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">

        <div
          className="absolute -left-40 -top-40 h-[450px] w-[450px] rounded-full blur-[160px] opacity-[0.055]"
          style={{ background: color1 }}
        />

        <div
          className="absolute -bottom-40 -right-40 h-[450px] w-[450px] rounded-full blur-[160px] opacity-[0.045]"
          style={{ background: color2 }}
        />

      </div>

      {/* ==================================================
          WELCOME
      ================================================== */}

      {showWelcome && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-[#08080b]">

          <div className="text-center">

            <p className="text-[9px] uppercase tracking-[0.6em] text-white/25">
              2026 / Indonesia
            </p>

            <h1
              className="mt-6 text-6xl font-black tracking-[-0.07em] sm:text-8xl"
              style={{
                textShadow: `0 0 35px ${color1}25`,
              }}
            >
              Info
              <br />
              Malam.
            </h1>

            <div
              className="mx-auto mt-7 h-[1px] w-20"
              style={{
                background: `linear-gradient(
                  90deg,
                  transparent,
                  ${color1},
                  ${color2},
                  transparent
                )`,
              }}
            />

            <p className="mt-5 text-[9px] uppercase tracking-[0.5em] text-white/20">
              Memories after dark
            </p>

          </div>
        </div>
      )}

      {/* ==================================================
          NAVBAR
      ================================================== */}

      <nav className="fixed left-0 right-0 top-0 z-50 px-4 py-4 sm:px-7">

        <div className="mx-auto flex max-w-7xl items-center justify-between">

          <a
            href="#home"
            className="text-xs font-black tracking-[0.25em]"
          >
            <span
              style={{
                color: color1,
                textShadow: `0 0 15px ${color1}30`,
              }}
            >
              ✦
            </span>{" "}
            INFOMALAM
          </a>

          <div className="flex items-center gap-5 text-[9px] uppercase tracking-[0.25em]">

            <a
              href="#gallery"
              className="text-white/35 transition hover:text-white"
            >
              Gallery
            </a>

            <span className="text-white/20">
              {filteredPhotos.length}
            </span>

          </div>

        </div>
      </nav>

      {/* ==================================================
          HERO
      ================================================== */}

      <section
        id="home"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative z-10 flex min-h-screen items-end overflow-hidden px-5 pb-16 pt-28 sm:px-8 lg:px-14"
      >

        <div className="absolute inset-0 -z-10">

          <img
            src={activePhoto.url}
            alt={activePhoto.public_id}
            className="h-full w-full object-cover transition-opacity duration-700"
          />

          <div className="absolute inset-0 bg-black/35" />

          <div className="absolute inset-0 bg-gradient-to-t from-[#08080b] via-black/10 to-black/20" />

        </div>

        <div className="mx-auto w-full max-w-7xl">

          <p className="text-[9px] uppercase tracking-[0.5em] text-white/35">
            2026 / Indonesia
          </p>

          <h1 className="mt-4 text-[17vw] font-black leading-[0.78] tracking-[-0.08em] sm:text-[13vw] lg:text-[10rem]">

            Malam
            <br />

            <span
              style={{
                background: `linear-gradient(
                  90deg,
                  white 0%,
                  ${color1} 45%,
                  ${color2} 75%,
                  white 100%
                )`,
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Bersama.
            </span>

          </h1>

          <p className="mt-6 max-w-md text-sm leading-6 text-white/35">
            Kumpulan momen, teman, dan cerita dalam satu arsip malam.
          </p>

          <div className="mt-8 flex items-center gap-3">

            <button
              onClick={randomPhoto}
              className="rounded-full px-7 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-black transition hover:scale-105"
              style={{
                background: `linear-gradient(
                  135deg,
                  ${color1},
                  ${color2}
                )`,
                boxShadow: `0 0 30px ${color1}20`,
              }}
            >
              Foto Acak →
            </button>

            <button
              onClick={() => setAutoplay((p) => !p)}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/30 text-white/50 backdrop-blur-md transition hover:border-white/25 hover:text-white"
            >
              {autoplay ? "Ⅱ" : "▶"}
            </button>

          </div>

        </div>
      </section>

      {/* ==================================================
          GALLERY
      ================================================== */}

      <section
        id="gallery"
        className="relative z-10 px-5 py-24 sm:px-8 lg:px-14 lg:py-32"
      >

        <div className="mx-auto max-w-7xl">

          {/* HEADER */}

          <div className="mb-12 flex items-end justify-between">

            <div>

              <p className="text-[9px] uppercase tracking-[0.5em] text-white/20">
                02 / Gallery
              </p>

              <h2 className="mt-3 text-5xl font-black tracking-[-0.06em] sm:text-7xl">

                Semua{" "}

                <span
                  style={{
                    color: color1,
                    textShadow: `0 0 20px ${color1}20`,
                  }}
                >
                  cerita.
                </span>

              </h2>

            </div>

            <button
              onClick={randomPhoto}
              className="text-[9px] uppercase tracking-[0.3em] text-white/30 transition hover:text-white"
            >
              Random ↻
            </button>

          </div>

          {/* ==================================================
              FILTER
          ================================================== */}

          <div className="mb-12 flex gap-2 overflow-x-auto pb-2">

            <button
              onClick={() => setFilter("ALL")}
              className={`shrink-0 rounded-full px-5 py-2.5 text-[9px] font-bold uppercase tracking-[0.15em] transition ${
                filter === "ALL"
                  ? "text-black"
                  : "border border-white/10 bg-white/[0.02] text-white/30 hover:text-white"
              }`}
              style={
                filter === "ALL"
                  ? {
                      background: `linear-gradient(
                        135deg,
                        ${color1},
                        ${color2}
                      )`,
                    }
                  : undefined
              }
            >
              All
            </button>

            {CATEGORIES.map((category) => (

              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`shrink-0 rounded-full px-5 py-2.5 text-[9px] font-bold uppercase tracking-[0.15em] transition ${
                  filter === category
                    ? "text-black"
                    : "border border-white/10 bg-white/[0.02] text-white/30 hover:text-white"
                }`}
                style={
                  filter === category
                    ? {
                        background: `linear-gradient(
                          135deg,
                          ${color1},
                          ${color2}
                        )`,
                      }
                    : undefined
                }
              >
                {category}
              </button>

            ))}

          </div>

          {/* ==================================================
              INSTAGRAM STYLE GRID
          ================================================== */}

          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 sm:gap-7 lg:gap-9">

            {filteredPhotos.map((photo, index) => {

              const isLoaded =
                loadedImages[photo.public_id];

              const originalIndex =
                photosWithCategory.findIndex(
                  (p) => p.public_id === photo.public_id
                );

              return (

                <article
                  key={photo.public_id}
                  onClick={() => {
                    setActiveIndex(originalIndex);
                    setSelected(photo);
                  }}
                  className="group cursor-pointer"
                >

                  {/* PHOTO */}

                  <div
                    className="relative overflow-hidden rounded-[18px] bg-[#111116]"
                    style={{
                      boxShadow: `
                        0 8px 30px rgba(0,0,0,0.35)
                      `,
                    }}
                  >

                    {/* RGB LIGHT */}

                    <div
                      className="pointer-events-none absolute -inset-[1px] z-10 rounded-[19px] opacity-0 transition duration-500 group-hover:opacity-100"
                      style={{
                        background: `linear-gradient(
                          135deg,
                          ${color1},
                          transparent 35%,
                          transparent 65%,
                          ${color2}
                        )`,
                      }}
                    />

                    <div className="relative z-20 aspect-[3/4] overflow-hidden rounded-[17px]">

                      {!isLoaded && (
                        <div className="absolute inset-0 animate-pulse bg-white/[0.04]" />
                      )}

                      <img
                        src={photo.url}
                        alt={`Foto ${index + 1}`}
                        loading={index < 6 ? "eager" : "lazy"}
                        onLoad={() =>
                          handleImageLoad(photo.public_id)
                        }
                        className={`h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04] ${
                          isLoaded
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      />

                      {/* HOVER DARK */}

                      <div className="absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/10" />

                      {/* CATEGORY */}

                      <div className="absolute left-3 top-3 rounded-full bg-black/45 px-2.5 py-1.5 text-[7px] font-bold tracking-[0.15em] text-white/70 opacity-0 backdrop-blur-md transition duration-300 group-hover:opacity-100">
                        {photo.category}
                      </div>

                    </div>

                  </div>

                  {/* UNDER PHOTO */}

                  <div className="flex items-center justify-between px-1 pt-3">

                    <span className="text-[8px] uppercase tracking-[0.25em] text-white/20">
                      {photo.category}
                    </span>

                    <span className="text-[8px] text-white/15">
                      #{String(index + 1).padStart(2, "0")}
                    </span>

                  </div>

                </article>

              );
            })}

          </div>

          {filteredPhotos.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-sm text-white/20">
                Tidak ada foto di kategori ini.
              </p>
            </div>
          )}

        </div>
      </section>

      {/* ==================================================
          FLOATING RANDOM
      ================================================== */}

      <button
        onClick={randomPhoto}
        className="fixed bottom-6 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/60 text-lg backdrop-blur-xl transition hover:scale-110"
        style={{
          boxShadow: `0 0 25px ${color1}18`,
        }}
      >
        ↻
      </button>

      {/* ==================================================
          LIGHTBOX
      ================================================== */}

      {selected && (

        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/95 p-5 backdrop-blur-xl"
          onClick={() => setSelected(null)}
        >

          <button
            onClick={() => setSelected(null)}
            className="absolute right-5 top-5 z-20 rounded-full border border-white/10 bg-black/50 px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-white/50 backdrop-blur-xl transition hover:text-white"
          >
            Tutup ×
          </button>

          <img
            src={selected.url}
            alt="Fullscreen"
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] max-w-full rounded-2xl object-contain"
            style={{
              boxShadow: `
                0 0 60px ${color1}12
              `,
            }}
          />

        </div>

      )}

    </main>
  );
}
