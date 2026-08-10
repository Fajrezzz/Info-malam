import { useEffect, useMemo, useState } from "react";
import { photos, type Photo } from "./photo";

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selected, setSelected] = useState<Photo | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  const activePhoto = photos[activeIndex];

  const orderedPhotos = useMemo(() => {
    return [
      photos[activeIndex],
      ...photos.filter((_, i) => i !== activeIndex),
    ];
  }, [activeIndex]);

  const randomPhoto = () => {
    let next = Math.floor(Math.random() * photos.length);

    while (next === activeIndex && photos.length > 1) {
      next = Math.floor(Math.random() * photos.length);
    }

    setActiveIndex(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050505] text-white">

      {/* WELCOME */}
      {showWelcome && (
        <div className="fixed inset-0 z-[999] grid place-items-center bg-[#050505]">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-[0.6em] text-white/30">
              2026 / Indonesia
            </p>

            <h1 className="mt-6 text-6xl font-black leading-[0.8] tracking-[-0.08em] sm:text-8xl">
              Info
              <br />
              Malam.
            </h1>

            <div className="mx-auto mt-8 h-px w-20 bg-white/30" />

            <p className="mt-5 text-[10px] uppercase tracking-[0.4em] text-white/30">
              Memories after dark
            </p>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav className="fixed left-0 right-0 top-0 z-50 px-4 py-4 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/10 bg-black/50 px-5 py-3 backdrop-blur-xl">

          <a
            href="#home"
            className="text-xs font-black uppercase tracking-[0.3em]"
          >
            Info Malam
          </a>

          <div className="flex items-center gap-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
            <a href="#gallery" className="hover:text-white">
              Gallery
            </a>

            <span>{photos.length} Photos</span>
          </div>

        </div>
      </nav>

      {/* HERO */}
      <section
        id="home"
        className="relative flex min-h-screen items-end overflow-hidden px-5 pb-14 pt-32 sm:px-8 lg:px-14 lg:pb-20"
      >

        <img
          src={activePhoto.url}
          alt={activePhoto.public_id}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/45" />

        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/30 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-7xl">

          <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.5em] text-white/50">
            2026 / Indonesia
          </p>

          <h1 className="text-[19vw] font-black leading-[0.76] tracking-[-0.09em] sm:text-[13vw] lg:text-[10rem]">
            Malam
            <br />
            Bersama.
          </h1>

          <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">

            <p className="max-w-xl text-base leading-7 text-white/60 sm:text-lg">
              Kumpulan momen, teman, dan cerita yang tersimpan
              dalam satu arsip malam.
            </p>

            <button
              onClick={randomPhoto}
              className="w-fit rounded-full bg-white px-7 py-4 text-xs font-black uppercase tracking-[0.22em] text-black transition hover:scale-105"
            >
              Foto Acak ↗
            </button>

          </div>

        </div>
      </section>

      {/* INFO */}
      <section className="border-y border-white/10 px-5 py-20 sm:px-8 lg:px-14">

        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">

          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-white/30">
              Archive
            </p>

            <p className="mt-4 text-5xl font-black">
              {photos.length}
            </p>

            <p className="mt-1 text-sm text-white/35">
              captured moments
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-white/30">
              Collection
            </p>

            <p className="mt-4 text-3xl font-black">
              Teman
            </p>

            <p className="mt-1 text-sm text-white/35">
              memories together
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-white/30">
              Status
            </p>

            <p className="mt-4 text-3xl font-black">
              Online
            </p>

            <p className="mt-1 text-sm text-white/35">
              Cloudinary archive
            </p>
          </div>

        </div>

      </section>

      {/* GALLERY */}
      <section
        id="gallery"
        className="px-5 py-20 sm:px-8 lg:px-14 lg:py-32"
      >

        <div className="mx-auto max-w-7xl">

          <div className="mb-10 flex items-end justify-between">

            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-white/30">
                02 — Gallery
              </p>

              <h2 className="mt-4 text-5xl font-black tracking-[-0.06em] sm:text-7xl">
                Semua
                <br />
                cerita.
              </h2>
            </div>

            <button
              onClick={randomPhoto}
              className="rounded-full border border-white/15 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 hover:border-white hover:text-white"
            >
              Random
            </button>

          </div>

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
                    group relative overflow-hidden rounded-xl bg-white/5
                    ${index === 0 ? "col-span-2 row-span-2" : ""}
                  `}
                >

                  <img
                    src={photo.url}
                    alt={`Foto ${index + 1}`}
                    loading={index < 5 ? "eager" : "lazy"}
                    className="h-full min-h-48 w-full object-cover transition duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />

                  <div className="absolute bottom-4 left-4 opacity-0 transition group-hover:opacity-100">

                    <p className="text-[9px] font-bold uppercase tracking-[0.3em]">
                      Open photo
                    </p>

                  </div>

                </button>
              );
            })}

          </div>
        </div>

      </section>

      {/* FEATURED */}
      <section className="border-t border-white/10 px-5 py-24 sm:px-8 lg:px-14">

        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.35fr_1fr] lg:items-center">

          <div>

            <p className="text-[10px] uppercase tracking-[0.4em] text-white/30">
              03 — Featured
            </p>

            <h2 className="mt-5 text-5xl font-black tracking-[-0.06em] sm:text-7xl">
              Moment
              <br />
              #{String(activeIndex + 1).padStart(2, "0")}
            </h2>

            <p className="mt-5 max-w-sm text-sm leading-7 text-white/40">
              Foto yang sedang kamu lihat dari koleksi malam ini.
            </p>

            <button
              onClick={() => setSelected(activePhoto)}
              className="mt-7 rounded-full bg-white px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-black hover:scale-105"
            >
              Buka fullscreen
            </button>

          </div>

          <button
            onClick={() => setSelected(activePhoto)}
            className="overflow-hidden rounded-2xl"
          >

            <img
              src={activePhoto.url}
              alt="Featured"
              className="max-h-[75vh] w-full object-cover"
            />

          </button>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 px-5 py-12 sm:px-8 lg:px-14">

        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-lg font-black">
            Info Malam.
          </p>

          <p className="text-[10px] uppercase tracking-[0.3em] text-white/25">
            Made from memories — 2026
          </p>

        </div>

      </footer>

      {/* LIGHTBOX */}
      {selected && (
        <div
          className="fixed inset-0 z-[999] grid place-items-center bg-black/95 p-4"
          onClick={() => setSelected(null)}
        >

          <button
            onClick={() => setSelected(null)}
            className="absolute right-5 top-5 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-xs font-bold uppercase tracking-widest"
          >
            Tutup ×
          </button>

          <img
            src={selected.url}
            alt="Fullscreen"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] max-w-full rounded-xl object-contain"
          />

        </div>
      )}

    </main>
  );
}
