import { useEffect, useMemo, useState } from "react";

type Photo = {
  id: string;
  url: string;
  width: number;
  height: number;
  createdAt: string;
};

export default function App() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        const response = await fetch("/api/photos");
        const data = await response.json();

        if (data.success) {
          setPhotos(data.photos);
        }
      } catch (error) {
        console.error("Gagal mengambil foto:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPhotos();

    const timer = window.setTimeout(() => {
      setShowWelcome(false);
    }, 2200);

    return () => window.clearTimeout(timer);
  }, []);

  const activePhoto = photos[activeIndex];

  const randomPhoto = () => {
    if (photos.length < 2) return;

    let next = Math.floor(Math.random() * photos.length);

    while (next === activeIndex) {
      next = Math.floor(Math.random() * photos.length);
    }

    setActiveIndex(next);
  };

  const orderedPhotos = useMemo(() => {
    if (!photos.length) return [];

    return [
      photos[activeIndex],
      ...photos.filter((_, index) => index !== activeIndex),
    ];
  }, [photos, activeIndex]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#070707] text-white grid place-items-center">
        <div className="text-center">
          <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-2 border-white/20 border-t-white" />

          <p className="text-xs uppercase tracking-[0.4em] text-white/50">
            Memuat malam...
          </p>
        </div>
      </main>
    );
  }

  if (!photos.length) {
    return (
      <main className="min-h-screen bg-[#070707] text-white grid place-items-center px-6">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-white/40">
            Info Malam
          </p>

          <h1 className="mt-4 text-4xl font-black">
            Belum ada foto
          </h1>

          <p className="mt-4 text-white/50">
            Upload foto ke folder Cloudinary "teman".
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
          <div className="welcome-animation text-center px-6">

            <p className="text-xs font-bold uppercase tracking-[0.5em] text-white/40">
              2026 / Indonesia
            </p>

            <h1 className="mt-6 text-6xl font-black tracking-[-0.07em] sm:text-8xl">
              Info
              <br />
              Malam.
            </h1>

            <div className="mx-auto mt-8 h-px w-24 bg-white/30" />

            <p className="mt-6 text-sm uppercase tracking-[0.3em] text-white/40">
              Sebuah arsip kecil
            </p>

          </div>
        </section>
      )}

      {/* NAVBAR */}

      <nav className="fixed left-0 right-0 top-0 z-40 px-5 py-5 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/10 bg-black/30 px-5 py-3 backdrop-blur-xl">

          <a
            href="#top"
            className="text-sm font-black uppercase tracking-[0.3em]"
          >
            Info Malam
          </a>

          <div className="flex items-center gap-5 text-xs font-bold uppercase tracking-[0.2em] text-white/50">
            <a
              href="#galeri"
              className="transition hover:text-white"
            >
              Galeri
            </a>

            <span className="hidden sm:block">
              {photos.length} Foto
            </span>
          </div>

        </div>
      </nav>

      {/* HERO */}

      <section
        id="top"
        className="relative flex min-h-screen items-end overflow-hidden px-5 pb-14 pt-32 sm:px-8 lg:px-14 lg:pb-20"
      >

        {/* Background */}

        <img
          src={activePhoto.url}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-70 transition duration-1000"
        />

        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-black/30 to-black/20" />

        {/* Grain */}

        <div className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

        {/* Hero content */}

        <div className="relative z-10 mx-auto w-full max-w-7xl">

          <p className="mb-5 text-xs font-bold uppercase tracking-[0.5em] text-white/50">
            2026 / Indonesia
          </p>

          <h1 className="max-w-5xl text-[18vw] font-black leading-[0.75] tracking-[-0.09em] sm:text-[13vw] lg:text-[10rem]">
            Malam
            <br />
            Bersama.
          </h1>

          <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">

            <p className="max-w-xl text-base leading-7 text-white/65 sm:text-lg">
              Satu malam, banyak cerita, dan momen yang akhirnya
              tersimpan dalam satu foto.
            </p>

            <div className="flex gap-3">

              <button
                onClick={randomPhoto}
                className="rounded-full bg-white px-6 py-4 text-xs font-black uppercase tracking-[0.2em] text-black transition hover:scale-105 hover:bg-white/90"
              >
                Foto acak
              </button>

              <a
                href="#galeri"
                className="rounded-full border border-white/25 bg-black/20 px-6 py-4 text-xs font-black uppercase tracking-[0.2em] backdrop-blur-md transition hover:bg-white hover:text-black"
              >
                Lihat foto
              </a>

            </div>

          </div>

        </div>

      </section>

      {/* INTRO */}

      <section className="px-5 py-24 sm:px-8 lg:px-14 lg:py-32">

        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.4em] text-white/35">
                01 — The Archive
              </p>

              <h2 className="mt-5 text-5xl font-black tracking-[-0.06em] sm:text-7xl">
                Cerita
                <br />
                dalam foto.
              </h2>

            </div>

            <p className="max-w-md text-sm leading-7 text-white/45">
              Kumpulan momen yang nggak perlu dijelaskan terlalu banyak.
              Cukup lihat fotonya dan biarkan malam bercerita.
            </p>

          </div>

        </div>

      </section>

      {/* GALLERY */}

      <section
        id="galeri"
        className="px-5 pb-24 sm:px-8 lg:px-14 lg:pb-40"
      >

        <div className="mx-auto max-w-7xl">

          <div className="mb-8 flex items-end justify-between">

            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/30">
                Gallery
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-tight">
                {photos.length} moments
              </h2>
            </div>

            <button
              onClick={randomPhoto}
              className="rounded-full border border-white/15 px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white/60 transition hover:border-white hover:text-white"
            >
              Random
            </button>

          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">

            {orderedPhotos.map((photo, index) => {

              const originalIndex = photos.findIndex(
                (item) => item.id === photo.id
              );

              const isActive = originalIndex === activeIndex;

              return (
                <button
                  key={photo.id}
                  onClick={() => {
                    setActiveIndex(originalIndex);
                    setSelectedPhoto(photo);
                  }}
                  className={`
                    group relative overflow-hidden rounded-xl bg-white/5 text-left
                    ${index === 0 ? "col-span-2 row-span-2" : ""}
                  `}
                >

                  <img
                    src={photo.url}
                    alt={`Foto ${index + 1}`}
                    loading={index < 4 ? "eager" : "lazy"}
                    className="
                      h-full min-h-48 w-full object-cover
                      transition duration-700
                      group-hover:scale-105
                    "
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />

                  <div className="absolute bottom-4 left-4 right-4 opacity-0 transition group-hover:opacity-100">

                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">
                      {isActive ? "Now viewing" : "View photo"}
                    </p>

                  </div>

                </button>
              );
            })}

          </div>

        </div>

      </section>

      {/* ACTIVE PHOTO */}

      <section className="border-t border-white/10 px-5 py-24 sm:px-8 lg:px-14">

        <div className="mx-auto max-w-7xl">

          <div className="grid gap-10 lg:grid-cols-[0.35fr_1fr] lg:items-center">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.4em] text-white/30">
                Now showing
              </p>

              <h2 className="mt-5 text-4xl font-black tracking-[-0.05em] sm:text-6xl">
                Moment
                <br />
                #{String(activeIndex + 1).padStart(2, "0")}
              </h2>

              <p className="mt-5 max-w-sm text-sm leading-7 text-white/45">
                Salah satu momen yang tersimpan di dalam arsip
                malam ini.
              </p>

              <button
                onClick={() => setSelectedPhoto(activePhoto)}
                className="mt-7 rounded-full bg-white px-6 py-4 text-xs font-black uppercase tracking-[0.2em] text-black transition hover:scale-105"
              >
                Buka foto
              </button>

            </div>

            <div
              className="group relative cursor-pointer overflow-hidden rounded-2xl"
              onClick={() => setSelectedPhoto(activePhoto)}
            >

              <img
                src={activePhoto.url}
                alt="Foto aktif"
                className="max-h-[75vh] w-full object-cover transition duration-700 group-hover:scale-[1.02]"
              />

              <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />

            </div>

          </div>

        </div>

      </section>

      {/* FOOTER */}

      <footer className="border-t border-white/10 px-5 py-12 sm:px-8 lg:px-14">

        <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <h3 className="text-xl font-black tracking-[-0.03em]">
            Info Malam.
          </h3>

          <p className="text-xs uppercase tracking-[0.25em] text-white/30">
            Made with memories — 2026
          </p>

        </div>

      </footer>

      {/* LIGHTBOX */}

      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[200] grid place-items-center bg-black/90 p-5 backdrop-blur-xl"
          onClick={() => setSelectedPhoto(null)}
        >

          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute right-5 top-5 z-10 rounded-full border border-white/20 bg-black/40 px-5 py-3 text-xs font-bold uppercase tracking-[0.2em]"
          >
            Tutup
          </button>

          <img
            src={selectedPhoto.url}
            alt="Foto diperbesar"
            onClick={(event) => event.stopPropagation()}
            className="max-h-[90vh] max-w-full rounded-xl object-contain shadow-2xl"
          />

        </div>
      )}

    </main>
  );
}
