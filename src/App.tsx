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
      setRgb((value) => (value + 0.12) % 360);
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
  const color2 = `hsl(${(rgb + 110) % 360}, 100%, 65%)`;

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050507] text-white">

      {/* =========================
          SOFT RGB BACKGROUND
      ========================= */}

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">

        <div
          className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full blur-[150px] opacity-[0.08]"
          style={{ background: color1 }}
        />

        <div
          className="absolute -right-40 top-[45%] h-[500px] w-[500px] rounded-full blur-[150px] opacity-[0.06]"
          style={{ background: color2 }}
        />

        <div
          className="absolute bottom-[-250px] left-[25%] h-[500px] w-[500px] rounded-full blur-[150px] opacity-[0.05]"
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

            <h1
              className="text-6xl font-black leading-[0.8] tracking-[-0.09em] sm:text-8xl"
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

          </div>
        </div>
      )}

      {/* =========================
          SIMPLE NAVBAR
      ========================= */}

      <nav className="fixed left-0 right-0 top-0 z-50 px-4 py-4 sm:px-8">

        <div
          className="mx-auto flex max-w-7xl items-center justify-center rounded-full border bg-black/40 px-6 py-3 backdrop-blur-xl"
          style={{
            borderColor: `${color1}20`,
          }}
        >

          <p className="text-xs font-black uppercase tracking-[0.35em]">
            Info Malam
          </p>

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
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/50" />

        <div
          className="absolute inset-0 opacity-[0.15]"
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

          <h1
            className="text-[19vw] font-black leading-[0.76] tracking-[-0.09em] sm:text-[13vw] lg:text-[10rem]"
            style={{
              textShadow: `0 0 50px ${color1}15`,
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

          <h2 className="mb-10 text-4xl font-black tracking-[-0.05em] sm:text-6xl">
            Gallery
          </h2>

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
                    transition-all duration-500
                    hover:-translate-y-1
                    hover:border-white/20
                    ${big ? "col-span-2 row-span-2" : ""}
                  `}
                >

                  <div className="aspect-[4/5] overflow-hidden">

                    <img
                      src={photo.url}
                      alt=""
                      loading={index < 5 ? "eager" : "lazy"}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />

                  </div>

                  {/* DARK OVERLAY */}

                  <div className="absolute inset-0 bg-black/10 transition duration-500 group-hover:bg-black/0" />

                  {/* RGB EDGE */}

                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100"
                    style={{
                      boxShadow: `
                        inset 0 0 35px ${color1}30,
                        inset 0 0 70px ${color2}15
                      `,
                    }}
                  />

                </button>
              );
            })}

          </div>

        </div>
      </section>

      {/* =========================
          FEATURED PHOTO
      ========================= */}

      <section className="relative z-10 px-5 pb-24 pt-10 sm:px-8 lg:px-14">

        <div className="mx-auto max-w-7xl">

          <button
            onClick={() => setSelected(activePhoto)}
            className="group relative block w-full overflow-hidden rounded-3xl border border-white/10"
          >

            <img
              src={activePhoto.url}
              alt=""
              className="max-h-[80vh] w-full object-cover transition duration-700 group-hover:scale-[1.02]"
            />

            <div
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{
                background: `linear-gradient(
                  135deg,
                  ${color1},
                  transparent 45%,
                  ${color2}
                )`,
              }}
            />

          </button>

        </div>

      </section>

      {/* =========================
          FOOTER
      ========================= */}

      <footer className="relative z-10 border-t border-white/10 px-5 py-10">

        <p className="text-center text-xs font-black uppercase tracking-[0.35em] text-white/25">
          Info Malam.
        </p>

      </footer>

      {/* =========================
          LIGHTBOX
      ========================= */}

      {selected && (
        <div
          className="fixed inset-0 z-[999] grid place-items-center bg-black/95 p-4 backdrop-blur-2xl"
          onClick={() => setSelected(null)}
        >

          <button
            onClick={() => setSelected(null)}
            className="absolute right-5 top-5 z-20 rounded-full border border-white/10 bg-black/50 px-5 py-3 text-xs font-bold text-white/70 backdrop-blur-xl"
          >
            ×
          </button>

          <img
            src={selected.url}
            alt=""
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
