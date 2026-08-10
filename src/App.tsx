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
     RGB ANIMATION
  ========================= */

  useEffect(() => {
    let animationFrame: number;

    const animate = () => {
      setRgb((value) => (value + 0.35) % 360);
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const activePhoto = photos[activeIndex];

  const orderedPhotos = useMemo(() => {
    return [
      photos[activeIndex],
      ...photos.filter((_, i) => i !== activeIndex),
    ];
  }, [activeIndex]);

  /* =========================
     RGB COLORS
  ========================= */

  const rgbColor = `hsl(${rgb}, 100%, 60%)`;
  const rgbColor2 = `hsl(${(rgb + 120) % 360}, 100%, 60%)`;
  const rgbColor3 = `hsl(${(rgb + 240) % 360}, 100%, 60%)`;

  /* =========================
     RANDOM PHOTO
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
    <main className="min-h-screen overflow-x-hidden bg-[#030305] text-white">

      {/* =========================
          RGB AMBIENT BACKGROUND
      ========================= */}

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">

        <div
          className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full blur-[130px] opacity-20 transition-all duration-1000"
          style={{ background: rgbColor }}
        />

        <div
          className="absolute -right-32 top-[30%] h-[500px] w-[500px] rounded-full blur-[130px] opacity-15 transition-all duration-1000"
          style={{ background: rgbColor2 }}
        />

        <div
          className="absolute bottom-[-150px] left-[30%] h-[500px] w-[500px] rounded-full blur-[130px] opacity-15 transition-all duration-1000"
          style={{ background: rgbColor3 }}
        />

      </div>

      {/* =========================
          WELCOME
      ========================= */}

      {showWelcome && (
        <section className="fixed inset-0 z-[999] grid place-items-center bg-[#030305]">

          <div
            className="absolute h-80 w-80 rounded-full blur-[100px] opacity-20"
            style={{ background: rgbColor }}
          />

          <div className="relative text-center">

            <p className="text-[10px] uppercase tracking-[0.7em] text-white/30">
              2026 / Indonesia
            </p>

            <h1
              className="mt-7 text-6xl font-black leading-[0.78] tracking-[-0.09em] sm:text-8xl"
              style={{
                textShadow: `
                  0 0 20px ${rgbColor},
                  0 0 50px ${rgbColor2}
                `,
              }}
            >
              Info
              <br />
              Malam.
            </h1>

            <div
              className="mx-auto mt-9 h-[2px] w-24"
              style={{
                background: `linear-gradient(90deg, ${rgbColor}, ${rgbColor2}, ${rgbColor3})`,
                boxShadow: `0 0 20px ${rgbColor}`,
              }}
            />

            <p className="mt-6 text-[10px] uppercase tracking-[0.5em] text-white/30">
              Memories after dark
            </p>

          </div>
        </section>
      )}

      {/* =========================
          NAVBAR
      ========================= */}

      <nav className="fixed left-0 right-0 top-0 z-50 px-4 py-4 sm:px-8">

        <div
          className="mx-auto flex max-w-7xl items-center justify-between rounded-full border bg-black/40 px-5 py-3 backdrop-blur-2xl"
          style={{
            borderColor: `${rgbColor}30`,
            boxShadow: `0 0 30px ${rgbColor}10`,
          }}
        >

          <a
            href="#home"
            className="text-xs font-black uppercase tracking-[0.3em]"
            style={{
              textShadow: `0 0 15px ${rgbColor}`,
            }}
          >
            Info Malam
          </a>

          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em]">

            <a
              href="#gallery"
              className="text-white/50 transition hover:text-white"
            >
              Gallery
            </a>

            <span
              className="rounded-full border px-3 py-1 text-white/60"
              style={{
                borderColor: `${rgbColor}40`,
                boxShadow: `0 0 15px ${rgbColor}10`,
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
        className="relative z-10 flex min-h-screen items-end overflow-hidden px-5 pb-14 pt-32 sm:px-8 lg:px-14 lg:pb-20"
      >

        <img
          src={activePhoto.url}
          alt={activePhoto.public_id}
          className="absolute inset-0 h-full w-full object-cover transition duration-1000"
        />

        {/* PHOTO OVERLAY */}

        <div className="absolute inset-0 bg-black/50" />

        <div
          className="absolute inset-0 opacity-30 mix-blend-screen"
          style={{
            background: `linear-gradient(
              120deg,
              ${rgbColor}25,
              transparent 35%,
              ${rgbColor2}20,
              transparent 70%,
              ${rgbColor3}20
            )`,
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-black/30 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-7xl">

          <div className="mb-6 flex items-center gap-3">

            <span
              className="h-2 w-2 animate-pulse rounded-full"
              style={{
                background: rgbColor,
                boxShadow: `0 0 15px ${rgbColor}`,
              }}
            />

            <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/50">
              2026 / Indonesia
            </p>

          </div>

          <h1
            className="text-[19vw] font-black leading-[0.76] tracking-[-0.09em] sm:text-[13vw] lg:text-[10rem]"
            style={{
              textShadow: `
                0 0 30px ${rgbColor}20,
                0 0 80px ${rgbColor2}10
              `,
            }}
          >
            Malam
            <br />

            <span
              style={{
                background: `linear-gradient(
                  90deg,
                  white,
                  ${rgbColor},
                  ${rgbColor2},
                  white
                )`,
                backgroundSize: "300% 100%",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Bersama.
            </span>

          </h1>

          <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">

            <p className="max-w-xl text-base leading-7 text-white/60 sm:text-lg">
              Kumpulan momen, teman, dan cerita yang tersimpan
              dalam satu arsip malam.
            </p>

            <button
              onClick={randomPhoto}
              className="group relative w-fit overflow-hidden rounded-full px-7 py-4 text-xs font-black uppercase tracking-[0.22em] text-black transition hover:scale-105"
              style={{
                background: `linear-gradient(
                  90deg,
                  ${rgbColor},
                  ${rgbColor2},
                  ${rgbColor3}
                )`,
                boxShadow: `0 0 35px ${rgbColor}40`,
              }}
            >
              Foto Acak ↗
            </button>

          </div>

        </div>
      </section>

      {/* =========================
          INFO
      ========================= */}

      <section className="relative z-10 border-y border-white/10 px-5 py-20 sm:px-8 lg:px-14">

        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">

          {[
            ["Archive", photos.length, "captured moments"],
            ["Collection", "Teman", "memories together"],
            ["Status", "Online", "Cloudinary archive"],
          ].map(([title, value, desc], index) => (

            <div
              key={String(title)}
              className="rounded-2xl border border-white/10 bg-white/[0.025] p-7 backdrop-blur-xl transition duration-500 hover:-translate-y-2"
              style={{
                boxShadow:
                  index === 0
                    ? `0 0 35px ${rgbColor}08`
                    : "none",
              }}
            >

              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30">
                {title}
              </p>

              <p
                className="mt-4 text-4xl font-black"
                style={{
                  textShadow:
                    index === 0
                      ? `0 0 20px ${rgbColor}50`
                      : "none",
                }}
              >
                {value}
              </p>

              <p className="mt-1 text-sm text-white/35">
                {desc}
              </p>

            </div>

          ))}

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

          <div className="mb-10 flex items-end justify-between">

            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30">
                02 — Gallery
              </p>

              <h2 className="mt-4 text-5xl font-black tracking-[-0.06em] sm:text-7xl">
                Semua
                <br />

                <span
                  style={{
                    color: rgbColor,
                    textShadow: `0 0 25px ${rgbColor}50`,
                  }}
                >
                  cerita.
                </span>

              </h2>

            </div>

            <button
              onClick={randomPhoto}
              className="rounded-full border px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 transition hover:text-white"
              style={{
                borderColor: `${rgbColor}40`,
              }}
            >
              Random
            </button>

          </div>

          {/* PHOTO GRID */}

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">

            {orderedPhotos.map((photo, index) => {

              const originalIndex = photos.findIndex(
                (item) => item.public_id === photo.public_id
              );

              return (

                <button
                  key={photo.public_id}
                  onClick={() => {
                    setActiveIndex(originalIndex);
                    setSelected(photo);
                  }}
                  className={`
                    group relative overflow-hidden rounded-2xl
                    border border-white/10 bg-white/5
                    transition duration-500
                    hover:-translate-y-1
                    ${index === 0 ? "col-span-2 row-span-2" : ""}
                  `}
                  style={{
                    boxShadow: `0 0 0 transparent`,
                  }}
                >

                  <img
                    src={photo.url}
                    alt={`Foto ${index + 1}`}
                    loading={index < 5 ? "eager" : "lazy"}
                    className="h-full min-h-48 w-full object-cover transition duration-700 group-hover:scale-110"
                  />

                  {/* RGB HOVER */}

                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100"
                    style={{
                      boxShadow: `
                        inset 0 0 40px ${rgbColor}50,
                        inset 0 0 80px ${rgbColor2}30
                      `,
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />

                  <div className="absolute bottom-4 left-4 translate-y-3 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">

                    <span
                      className="rounded-full border bg-black/50 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.25em] backdrop-blur-md"
                      style={{
                        borderColor: `${rgbColor}50`,
                      }}
                    >
                      Open photo
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

      <section className="relative z-10 border-t border-white/10 px-5 py-24 sm:px-8 lg:px-14">

        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.35fr_1fr] lg:items-center">

          <div>

            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30">
              03 — Featured
            </p>

            <h2 className="mt-5 text-5xl font-black tracking-[-0.06em] sm:text-7xl">
              Moment
              <br />

              <span
                style={{
                  color: rgbColor2,
                  textShadow: `0 0 25px ${rgbColor2}50`,
                }}
              >
                #{String(activeIndex + 1).padStart(2, "0")}
              </span>
            </h2>

            <p className="mt-5 max-w-sm text-sm leading-7 text-white/40">
              Foto yang sedang kamu lihat dari koleksi malam ini.
            </p>

            <button
              onClick={() => setSelected(activePhoto)}
              className="mt-7 rounded-full px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-black transition hover:scale-105"
              style={{
                background: `linear-gradient(
                  90deg,
                  ${rgbColor},
                  ${rgbColor2}
                )`,
                boxShadow: `0 0 30px ${rgbColor}30`,
              }}
            >
              Buka fullscreen
            </button>

          </div>

          <button
            onClick={() => setSelected(activePhoto)}
            className="group relative overflow-hidden rounded-3xl border border-white/10"
            style={{
              boxShadow: `0 0 70px ${rgbColor}12`,
            }}
          >

            <img
              src={activePhoto.url}
              alt="Featured"
              className="max-h-[75vh] w-full object-cover transition duration-700 group-hover:scale-[1.03]"
            />

            <div
              className="pointer-events-none absolute inset-0 opacity-30 mix-blend-screen"
              style={{
                background: `linear-gradient(
                  135deg,
                  ${rgbColor}20,
                  transparent 40%,
                  ${rgbColor2}20
                )`,
              }}
            />

          </button>

        </div>
      </section>

      {/* =========================
          FOOTER
      ========================= */}

      <footer className="relative z-10 border-t border-white/10 px-5 py-12 sm:px-8 lg:px-14">

        <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <p
            className="text-lg font-black"
            style={{
              textShadow: `0 0 20px ${rgbColor}40`,
            }}
          >
            Info Malam.
          </p>

          <div className="flex items-center gap-3">

            <span
              className="h-2 w-2 animate-pulse rounded-full"
              style={{
                background: rgbColor,
                boxShadow: `0 0 15px ${rgbColor}`,
              }}
            />

            <p className="text-[10px] uppercase tracking-[0.3em] text-white/25">
              Made from memories — 2026
            </p>

          </div>

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
            className="absolute inset-0 opacity-10"
            style={{
              background: `radial-gradient(
                circle at center,
                ${rgbColor},
                transparent 60%
              )`,
            }}
          />

          <button
            onClick={() => setSelected(null)}
            className="absolute right-5 top-5 z-10 rounded-full border bg-black/50 px-5 py-3 text-xs font-bold uppercase tracking-widest backdrop-blur-xl"
            style={{
              borderColor: `${rgbColor}50`,
            }}
          >
            Tutup ×
          </button>

          <img
            src={selected.url}
            alt="Fullscreen"
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 max-h-[90vh] max-w-full rounded-2xl border border-white/10 object-contain"
            style={{
              boxShadow: `
                0 0 40px ${rgbColor}20,
                0 0 100px ${rgbColor2}10
              `,
            }}
          />

        </div>
      )}

    </main>
  );
}
