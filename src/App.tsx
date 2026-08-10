import { useEffect, useMemo, useState } from "react";

type Photo = {
  public_id: string;
  format: string;
  version: number;
  width?: number;
  height?: number;
};

const CLOUD_NAME = "dxkbvpaa1";
const TAG = "teman";

const getPhotoUrl = (photo: Photo) =>
  `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto/${photo.public_id}.${photo.format}`;

export default function App() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [selected, setSelected] = useState<Photo | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `https://res.cloudinary.com/${CLOUD_NAME}/image/list/${TAG}.json?t=${Date.now()}`
        );

        if (!response.ok) {
          throw new Error("Gagal mengambil daftar foto.");
        }

        const data = await response.json();

        setPhotos(data.resources || []);
      } catch (err) {
        console.error(err);
        setError(
          "Foto belum bisa dimuat. Pastikan Resource List Cloudinary sudah aktif."
        );
      } finally {
        setLoading(false);
      }
    };

    loadPhotos();

    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const activePhoto = photos[activeIndex];

  const orderedPhotos = useMemo(() => {
    if (!photos.length) return [];

    return [
      photos[activeIndex],
      ...photos.filter((_, i) => i !== activeIndex),
    ];
  }, [photos, activeIndex]);

  const randomPhoto = () => {
    if (photos.length < 2) return;

    let next = Math.floor(Math.random() * photos.length);

    while (next === activeIndex) {
      next = Math.floor(Math.random() * photos.length);
    }

    setActiveIndex(next);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#070707] text-white grid place-items-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-white/20 border-t-white" />

          <p className="mt-6 text-xs uppercase tracking-[0.4em] text-white/40">
            Memuat foto...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#070707] text-white grid place-items-center px-6">
        <div className="max-w-md text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-white/30">
            Info Malam
          </p>

          <h1 className="mt-5 text-4xl font-black">
            Foto belum muncul
          </h1>

          <p className="mt-4 text-sm leading-7 text-white/45">
            {error}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mt-7 rounded-full bg-white px-6 py-3 text-xs font-black uppercase tracking-[0.2em] text-black"
          >
            Coba lagi
          </button>
        </div>
      </main>
    );
  }

  if (!photos.length) {
    return (
      <main className="min-h-screen bg-[#070707] text-white grid place-items-center">
        <div className="text-center">
          <h1 className="text-4xl font-black">Belum ada foto</h1>

          <p className="mt-4 text-white/40">
            Pastikan foto sudah memiliki tag "teman".
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#070707] text-white">

      {/* WELCOME */}

      {showWelcome && (
        <section className="fixed inset-0 z-[100] grid place-items-center bg-[#070707]">
          <div className="px-6 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.5em] text-white/35">
              2026 / Indonesia
            </p>

            <h1 className="mt-6 text-6xl font-black leading-[0.8] tracking-[-0.08em] sm:text-8xl">
              Info
              <br />
              Malam.
            </h1>

            <div className="mx-auto mt-8 h-px w-20 bg-white/30" />

            <p className="mt-5 text-xs uppercase tracking-[0.35em] text-white/30">
              Memories after dark
            </p>
          </div>
        </section>
      )}

      {/* NAVBAR */}

      <nav className="fixed left-0 right-0 top-0 z-40 px-4 py-4 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/10 bg-black/40 px-5 py-3 backdrop-blur-xl">

          <a
            href="#home"
            className="text-xs font-black uppercase tracking-[0.3em]"
          >
            Info Malam
          </a>

          <div className="flex items-center gap-5 text-[10px] font-bold uppercase tracking-[0.25em] text-white/45">
            <a href="#gallery">Gallery</a>
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
          src={getPhotoUrl(activePhoto)}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-all duration-1000"
        />

        <div className="absolute inset-0 bg-black/35" />

        <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-black/25 to-black/10" />

        <div className="relative z-10 mx-auto w-full max-w-7xl">

          <p className="mb-5 text-xs font-bold uppercase tracking-[0.5em] text-white/50">
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
              className="w-fit rounded-full bg-white px-7 py-4 text-xs font-black uppercase tracking-[0.22em] text-black transition hover:-translate-y-1 hover:bg-white/85"
            >
              Foto Acak ↗
            </button>

          </div>

        </div>
      </section>

      {/* INTRO */}

      <section className="border-y border-white/10 px-5 py-20 sm:px-8 lg:px-14 lg:py-28">

        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30">
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
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30">
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
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30">
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
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30">
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
              className="rounded-full border border-white/15 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 transition hover:border-white hover:text-white"
            >
              Random
            </button>

          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">

            {orderedPhotos.map((photo, index) => {

              const originalIndex = photos.findIndex(
                (item) => item.public_id === photo.public_id
              );

              const isActive = originalIndex === activeIndex;

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
                    src={getPhotoUrl(photo)}
                    alt={`Foto ${index + 1}`}
                    loading={index < 5 ? "eager" : "lazy"}
                    className="h-full min-h-48 w-full object-cover transition duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />

                  <div className="absolute bottom-4 left-4 opacity-0 transition group-hover:opacity-100">

                    <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/70">
                      {isActive ? "Now viewing" : "Open photo"}
                    </p>

                  </div>

                </button>
              );
            })}

          </div>

        </div>

      </section>

      {/* FEATURED */}

      <section className="border-t border-white/10 px-5 py-24 sm:px-8 lg:px-14 lg:py-36">

        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.35fr_1fr] lg:items-center">

          <div>

            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30">
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
              className="mt-7 rounded-full bg-white px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-black"
            >
              Buka fullscreen
            </button>

          </div>

          <button
            onClick={() => setSelected(activePhoto)}
            className="group relative overflow-hidden rounded-2xl"
          >

            <img
              src={getPhotoUrl(activePhoto)}
              alt="Featured"
              className="max-h-[75vh] w-full object-cover transition duration-700 group-hover:scale-[1.02]"
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
          className="fixed inset-0 z-[200] grid place-items-center bg-black/95 p-4 backdrop-blur-xl"
          onClick={() => setSelected(null)}
        >

          <button
            onClick={() => setSelected(null)}
            className="absolute right-5 top-5 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-xs font-bold uppercase tracking-widest backdrop-blur-md"
          >
            Tutup ×
          </button>

          <img
            src={getPhotoUrl(selected)}
            alt="Fullscreen"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] max-w-full rounded-xl object-contain"
          />

        </div>
      )}

    </main>
  );
}
