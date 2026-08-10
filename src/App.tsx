import { useEffect, useMemo, useState } from "react";
import { photos, type Photo } from "./photo";

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selected, setSelected] = useState<Photo | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [rgb, setRgb] = useState(0);

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
      setRgb((value) => (value + 0.15) % 360);
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);
  }, []);

  const activePhoto = photos[activeIndex];

  const orderedPhotos = useMemo(() => {
    return [
      photos[activeIndex],
      ...photos.filter((_, i) => i !== activeIndex),
    ];
  }, [activeIndex]);

  const color1 = `hsl(${rgb}, 100%, 65%)`;
  const color2 = `hsl(${(rgb + 100) % 360}, 100%, 65%)`;

  /* =========================
     RANDOM
  ========================= */

  const randomPhoto = () => {
    let next = Math.floor(Math.random() * photos.length);

    while (next === activeIndex && photos.length > 1) {
      next = Math.floor(Math.random() * photos.length);
    }

    setActiveIndex(next);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050507] text-white">

      {/* =========================
          SOFT RGB BACKGROUND
      ========================= */}

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">

        <div
          className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full blur-[150px] opacity-[0.10] transition-colors duration-1000"
          style={{ background: color1 }}
        />

        <div
          className="absolute -right-40 top-[45%] h-[500px] w-[500px] rounded-full blur-[150px] opacity-[0.08]"
          style={{ background: color2 }}
        />

        <div
          className="absolute bottom-[-250px] left-[25%] h-[500px] w-[500px] rounded-full blur-[150px] opacity-[0.06]"
          style={{ background: color1 }}
        />

      </div>

      {/* =========================
          WELCOME
      ========================= */}

      {showWelcome && (
        <div className="fixed inset-0 z-[999] grid place-items-center bg-[#050507]">

          <div
            className="absolute h-80 w-80 rounded-full blur-[120px] opacity-10"
            style={{ background: color1 }}
          />

          <div className="relative text-center">

            <p className="text-[10px] uppercase tracking-[0.7em] text-white/30">
              2026 / Indonesia
            </p>

            <h1
              className="mt-7 text-6xl font-black leading-[0.8] tracking-[-0.09em] sm:text-8xl"
              style={{
                textShadow: `0 0 35px ${color1}30`,
              }}
            >
              Info
              <br />
              Malam.
            </h1>

            <div
              className="mx-auto mt-9 h-px w-20"
              style={{
                background: `linear-gradient(90deg, ${color1}, ${color2})`,
              }}
            />

            <p className="mt-6 text-[10px] uppercase tracking-[0.5em] text-white/30">
              Memories after dark
            </p>

          </div>
        </div>
      )}

      {/* =========================
          NAVBAR
      ========================= */}

      <nav className="fixed left-0 right-0 top-0 z-50 px-4 py-4 sm:px-8">

        <div
          className="mx-auto flex max-w-7xl items-center justify-between rounded-full border bg-black/50 px-5 py-3 backdrop-blur-xl"
          style={{
            borderColor: `${color1}25`,
          }}
        >

          <a
            href="#home"
            className="text-xs font-black uppercase tracking-[0.3em]"
          >
            Info Malam
          </a>

          <div className="flex items-center gap-5 text-[10px] font-bold uppercase tracking-[0.2em]">

            <a
              href="#gallery"
              className="text-white/40 transition hover:text-white"
            >
              Gallery
            </a>

            <span
              className="rounded-full border px-3 py-1 text-white/50"
              style={{
                borderColor: `${color1}30`,
              }}
            >
              {photos.length}
            </span>

          </div>

        </div>
      </nav>

      {/* =========================
          HERO
      ========================= */}

      <section
        id="home"
        className="relative z-10 flex min-h-screen items-end overflow-hidden px-5 pb-16 pt-32 sm:px-8 lg:px-14 lg:pb-20"
      >

        <img
          src={activePhoto.url}
          alt={activePhoto.public_id}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/50" />

        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: `linear-gradient(
              135deg,
              ${color1},
              transparent 40%,
              ${color2}
            )`,
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-black/30 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-7xl">

          <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.5em] text-white/40">
            2026 / Indonesia
          </p>

          <h1
            className="text-[19vw] font-black leading-[0.76] tracking-[-0.09em] sm:text-[13vw] lg:text-[10rem]"
            style={{
              textShadow: `0 0 50px ${color1}20`,
            }}
          >
            Malam
            <br />

            <span
              style={{
                background: `linear-gradient(90deg, white, ${color1}, white)`,
                WebkitBackgroundClip: "text",
                color: "transparent",
                backgroundSize: "200% 100%",
              }}
            >
              Bersama.
            </span>
          </h1>

          <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">

            <p className="max-w-xl text-base leading-7 text-white/50 sm:text-lg">
              Kumpulan momen, teman, dan cerita yang tersimpan
              dalam satu arsip malam.
            </p>

            <button
              onClick={randomPhoto}
              className="w-fit rounded-full px-7 py-4 text-xs font-black uppercase tracking-[0.22em] text-black transition hover:-translate-y-1 hover:scale-105"
              style={{
                background: `linear-gradient(90deg, ${color1}, ${color2})`,
                boxShadow: `0 0 30px ${color1}25`,
              }}
            >
              Foto Acak ↗
            </button>

          </div>

        </div>
      </section>

      {/* =========================
          INFO CARDS
      ========================= */}

      <section className="relative z-10 px-5 py-20 sm:px-8 lg:px-14">

        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">

          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-7 backdrop-blur-xl">
            <p className="text-[10px] uppercase tracking-[0.4em] text-white/25">
              Archive
            </p>

            <p className="mt-4 text-5xl font-black">
              {photos.length}
            </p>

            <p className="mt-1 text-sm text-white/30">
              captured moments
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-7 backdrop-blur-xl">
            <p className="text-[10px] uppercase tracking-[0.4em] text-white/25">
              Collection
            </p>

            <p className="mt-4 text-3xl font-black">
              Teman
            </p>

            <p className="mt-1 text-sm text-white/30">
              memories together
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-7 backdrop-blur-xl">
            <p className="text-[10px] uppercase tracking-[0.4em] text-white/25">
              Status
            </p>

            <p className="mt-4 text-3xl font-black">
              Online
            </p>

            <p className="mt-1 text-sm text-white/30">
              Cloudinary archive
            </p>
          </div>

        </div>
      </section>

      {/* =========================
          GALLERY
      ========================= */}

      <section
        id="gallery"
        className="relative z-10 px-5 py-20 sm:px-8 lg:px-14 lg:py-32"
      >

        <div className="mx-auto max-w-7xl">

          <div className="mb-12 flex items-end justify-between">

            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/25">
                02 — Gallery
              </p>

              <h2 className="mt-4 text-5xl font-black tracking-[-0.06em] sm:text-7xl">
                Semua
                <br />

                <span
                  style={{
                    color: color1,
                    textShadow: `0 0 25px ${color1}25`,
                  }}
                >
                  cerita.
                </span>
              </h2>

            </div>

            <button
              onClick={randomPhoto}
              className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 transition hover:border-white/30 hover:text-white"
            >
              Random
            </button>

          </div>

          {/* =========================
              PHOTO GRID WITH SPACING
          ========================= */}

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:gap-6">

            {orderedPhotos.map((photo, index) => {

              const originalIndex = photos.findIndex(
                (item) => item.public_id === photo.public_id
              );

              const big = index === 0;

              return (
                <button
                  key={photo.public_id}
                  onClick={() => {
                    setActiveIndex(originalIndex);
                    setSelected(photo);
                  }}
                  className={`
                    group relative overflow-hidden rounded-2xl
                    border border-white/[0.08]
                    bg-white/[0.03]
                    text-left
                    transition-all duration-500
                    hover:-translate-y-1
                    hover:border-white/20
                    ${big ? "col-span-2 row-span-2" : ""}
                  `}
                >

                  <div className="aspect-[4/5] overflow-hidden">

                    <img
                      src={photo.url}
                      alt={`Foto ${index + 1}`}
                      loading={index < 5 ? "eager" : "lazy"}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />

                  </div>

                  {/* DARK GRADIENT */}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60" />

                  {/* SOFT RGB EDGE */}

                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100"
                    style={{
                      boxShadow: `
                        inset 0 0 35px ${color1}25,
                        inset 0 0 70px ${color2}12
                      `,
                    }}
                  />

                  {/* NUMBER */}

                  <div className="absolute bottom-4 left-4">

                    <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/50">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                  </div>

                </button>
              );
            })}

          </div>

        </div>
      </section>

      {/* =========================
          FEATURED
      ========================= */}

      <section className="relative z-10 border-t border-white/10 px-5 py-24 sm:px-8 lg:px-14 lg:py-32">

        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.35fr_1fr] lg:items-center">

          <div>

            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/25">
              03 — Featured
            </p>

            <h2 className="mt-5 text-5xl font-black tracking-[-0.06em] sm:text-7xl">
              Moment
              <br />

              <span
                style={{
                  color: color2,
                  textShadow: `0 0 25px ${color2}25`,
                }}
              >
                #{String(activeIndex + 1).padStart(2, "0")}
              </span>
            </h2>

            <p className="mt-5 max-w-sm text-sm leading-7 text-white/35">
              Foto yang sedang kamu lihat dari koleksi malam ini.
            </p>

            <button
              onClick={() => setSelected(activePhoto)}
              className="mt-7 rounded-full px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-black transition hover:scale-105"
              style={{
                background: `linear-gradient(90deg, ${color1}, ${color2})`,
              }}
            >
              Buka fullscreen
            </button>

          </div>

          <button
            onClick={() => setSelected(activePhoto)}
            className="group overflow-hidden rounded-3xl border border-white/10"
          >

            <img
              src={activePhoto.url}
              alt="Featured"
              className="max-h-[75vh] w-full object-cover transition duration-700 group-hover:scale-[1.03]"
            />

          </button>

        </div>
      </section>

      {/* =========================
          FOOTER
      ========================= */}

      <footer className="relative z-10 border-t border-white/10 px-5 py-12 sm:px-8 lg:px-14">

        <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-lg font-black">
            Info Malam.
          </p>

          <p className="text-[10px] uppercase tracking-[0.3em] text-white/20">
            Made from memories — 2026
          </p>

        </div>
      </footer>

      {/* =========================
          LIGHTBOX
      ========================= */}

      {selected && (

        <div
          className="fixed inset-0 z-[999] grid place-items-center bg-black/95 p-4 backdrop-blur-2xl"
          onClick={() => setSelected(null)}
        >

          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              background: `radial-gradient(
                circle at center,
                ${color1},
                transparent 60%
              )`,
            }}
          />

          <button
            onClick={() => setSelected(null)}
            className="absolute right-5 top-5 z-20 rounded-full border border-white/10 bg-black/50 px-5 py-3 text-xs font-bold uppercase tracking-widest text-white/70 backdrop-blur-xl"
          >
            Tutup ×
          </button>

          <img
            src={selected.url}
            alt="Fullscreen"
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 max-h-[90vh] max-w-full rounded-2xl border border-white/10 object-contain"
            style={{
              boxShadow: `0 0 80px ${color1}15`,
            }}
          />

        </div>
      )}

    </main>
  );
}
