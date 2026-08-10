import { useEffect, useState } from "react";

type Photo = {
  title: string;
  place: string;
  date: string;
  description: string;
  url: string;
};

const photos: Photo[] = [
  {
    title: "Malam Bersama",
    place: "Indonesia",
    date: "2026",
    description:
      "Satu malam, banyak cerita, dan momen yang akhirnya tersimpan dalam satu foto.",
    url: "/photos/teman-1.jpg",
  },
  {
    title: "Random Moment",
    place: "Indonesia",
    date: "2026",
    description:
      "Momen random yang justru menjadi salah satu kenangan terbaik.",
    url: "/photos/teman-2.jpg",
  },
  {
    title: "Late Night",
    place: "Indonesia",
    date: "2026",
    description:
      "Tidak ada rencana khusus. Hanya malam dan orang-orang yang tepat.",
    url: "/photos/teman-3.jpg",
  },
  {
    title: "Good People",
    place: "Indonesia",
    date: "2026",
    description:
      "Karena tempat bukan yang paling penting. Orang-orangnya yang membuat cerita.",
    url: "/photos/teman-4.jpg",
  },
  {
    title: "One Night",
    place: "Indonesia",
    date: "2026",
    description:
      "Satu frame yang menyimpan lebih banyak cerita daripada yang terlihat.",
    url: "/photos/teman-5.jpg",
  },
  {
    title: "Until Next Time",
    place: "Indonesia",
    date: "2026",
    description:
      "Malam selesai, tapi ceritanya tetap tersimpan.",
    url: "/photos/teman-6.jpg",
  },
];

export default function App() {
  const [active, setActive] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const [lightbox, setLightbox] = useState(false);

  const current = photos[active];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  const randomPhoto = () => {
    if (photos.length <= 1) return;

    let next = active;

    while (next === active) {
      next = Math.floor(Math.random() * photos.length);
    }

    setActive(next);
  };

  const nextPhoto = () => {
    setActive((prev) => (prev + 1) % photos.length);
  };

  const previousPhoto = () => {
    setActive((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#080808] text-white">

      {/* ================= WELCOME ================= */}

      {showWelcome && (
        <div className="welcome-screen fixed inset-0 z-[100] flex items-center justify-center bg-[#080808]">
          <div className="text-center px-6">

            <div className="mb-8 flex justify-center">
              <div className="logo-mark">
                <span>IM</span>
              </div>
            </div>

            <p className="text-[10px] uppercase tracking-[0.5em] text-white/40">
              A visual story
            </p>

            <h1 className="mt-4 text-5xl font-black tracking-[-0.07em] sm:text-7xl">
              Info<span className="text-white/30">Malam</span>
            </h1>

            <div className="mx-auto mt-8 h-[1px] w-16 bg-white/30" />

            <p className="mt-5 text-xs uppercase tracking-[0.35em] text-white/40">
              Memories after dark
            </p>

          </div>
        </div>
      )}

      {/* ================= HERO ================= */}

      <section className="hero-section relative flex min-h-[100svh] items-end overflow-hidden">

        {/* Background */}

        <img
          src={current.url}
          alt={current.title}
          className="hero-image absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/25" />

        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-black/30 to-black/10" />

        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

        {/* Grain */}

        <div className="grain absolute inset-0 pointer-events-none" />

        {/* ================= NAVBAR ================= */}

        <nav className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-5 py-6 sm:px-8 lg:px-12">

          <a
            href="#home"
            className="flex items-center gap-3"
          >
            <div className="small-logo">
              IM
            </div>

            <div>
              <p className="text-xs font-black tracking-[0.25em]">
                INFO MALAM
              </p>

              <p className="text-[8px] uppercase tracking-[0.3em] text-white/40">
                Visual archive
              </p>
            </div>
          </a>

          <a
            href="#gallery"
            className="nav-link"
          >
            Gallery
          </a>

        </nav>

        {/* ================= HERO CONTENT ================= */}

        <div
          id="home"
          className="relative z-10 w-full px-5 pb-10 sm:px-8 sm:pb-14 lg:px-12 lg:pb-16"
        >

          <div className="max-w-5xl">

            <div className="mb-5 flex items-center gap-3">
              <span className="h-[1px] w-8 bg-white/60" />

              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/60">
                {current.date} / {current.place}
              </p>
            </div>

            <h1
              key={current.title}
              className="hero-title max-w-4xl text-[clamp(4rem,15vw,10rem)] font-black leading-[0.78] tracking-[-0.09em]"
            >
              {current.title}
            </h1>

            <p className="mt-7 max-w-xl text-sm leading-7 text-white/65 sm:text-base">
              {current.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">

              <button
                onClick={randomPhoto}
                className="primary-button"
              >
                <span>↻</span>
                Random Foto
              </button>

              <button
                onClick={() => setLightbox(true)}
                className="glass-button"
              >
                Lihat Foto
              </button>

            </div>

          </div>

          {/* Hero counter */}

          <div className="mt-12 flex items-end justify-between">

            <div className="flex items-center gap-4">

              <span className="text-xs font-bold text-white">
                {String(active + 1).padStart(2, "0")}
              </span>

              <div className="h-[1px] w-16 bg-white/30">
                <div
                  className="h-full bg-white transition-all duration-500"
                  style={{
                    width: `${((active + 1) / photos.length) * 100}%`,
                  }}
                />
              </div>

              <span className="text-xs text-white/35">
                {String(photos.length).padStart(2, "0")}
              </span>

            </div>

            <a
              href="#gallery"
              className="hidden text-[9px] uppercase tracking-[0.4em] text-white/40 sm:block"
            >
              Scroll to explore ↓
            </a>

          </div>

        </div>

      </section>

      {/* ================= INTRO ================= */}

      <section className="px-5 py-24 sm:px-8 lg:px-12 lg:py-36">

        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">

          <div>

            <p className="section-label">
              01 — About
            </p>

            <h2 className="mt-5 max-w-md text-4xl font-black leading-[0.95] tracking-[-0.06em] sm:text-6xl">
              Some nights deserve to be remembered.
            </h2>

          </div>

          <div className="max-w-2xl lg:pt-8">

            <p className="text-lg leading-8 text-white/55 sm:text-xl">
              Info Malam adalah kumpulan kecil dari momen-momen random
              yang terjadi setelah matahari terbenam.
            </p>

            <p className="mt-6 text-sm leading-7 text-white/35">
              Tidak harus sempurna. Tidak harus direncanakan.
              Kadang foto terbaik justru datang dari momen yang tidak
              pernah direncanakan sebelumnya.
            </p>

          </div>

        </div>

      </section>

      {/* ================= GALLERY ================= */}

      <section
        id="gallery"
        className="px-5 pb-24 sm:px-8 lg:px-12 lg:pb-36"
      >

        <div className="mb-10 flex items-end justify-between">

          <div>

            <p className="section-label">
              02 — The Archive
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-[-0.06em] sm:text-6xl">
              Our Night
            </h2>

          </div>

          <p className="hidden text-xs text-white/30 sm:block">
            {photos.length} moments
          </p>

        </div>

        {/* Featured photo */}

        <button
          onClick={() => setLightbox(true)}
          className="featured-photo group relative block h-[65svh] w-full overflow-hidden text-left sm:h-[75vh]"
        >

          <img
            src={current.url}
            alt={current.title}
            className="h-full w-full object-cover transition duration-1000 group-hover:scale-[1.03]"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10" />

          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">

            <div className="flex items-end justify-between gap-6">

              <div>

                <p className="text-[10px] uppercase tracking-[0.35em] text-white/50">
                  Featured moment
                </p>

                <h3 className="mt-3 text-3xl font-black tracking-[-0.05em] sm:text-5xl">
                  {current.title}
                </h3>

              </div>

              <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/30 text-xl transition group-hover:bg-white group-hover:text-black sm:flex">
                ↗
              </div>

            </div>

          </div>

        </button>

        {/* Thumbnails */}

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">

          {photos.map((photo, index) => (

            <button
              key={photo.url}
              onClick={() => setActive(index)}
              className={`thumbnail group relative aspect-[4/5] overflow-hidden ${
                index === active ? "active-thumbnail" : ""
              }`}
            >

              <img
                src={photo.url}
                alt={photo.title}
                loading="lazy"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-black/20 transition group-hover:bg-black/0" />

              <div className="absolute bottom-3 left-3">

                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/70">
                  {String(index + 1).padStart(2, "0")}
                </p>

              </div>

            </button>

          ))}

        </div>

      </section>

      {/* ================= RANDOM SECTION ================= */}

      <section className="random-section relative overflow-hidden px-5 py-28 sm:px-8 lg:px-12 lg:py-40">

        <div className="absolute inset-0 opacity-20">

          <img
            src={current.url}
            alt=""
            className="h-full w-full object-cover blur-3xl"
          />

        </div>

        <div className="relative mx-auto max-w-4xl text-center">

          <p className="section-label">
            03 — Random Memory
          </p>

          <h2 className="mt-6 text-5xl font-black leading-[0.9] tracking-[-0.07em] sm:text-7xl">
            Let the night
            <br />
            choose.
          </h2>

          <p className="mx-auto mt-7 max-w-md text-sm leading-7 text-white/45">
            Tidak tahu mau melihat foto yang mana?
            Biarkan Info Malam memilih satu secara random.
          </p>

          <button
            onClick={randomPhoto}
            className="random-button mt-9"
          >
            <span className="text-xl">✦</span>
            Surprise Me
          </button>

        </div>

      </section>

      {/* ================= FOOTER ================= */}

      <footer className="border-t border-white/10 px-5 py-10 sm:px-8 lg:px-12">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <p className="text-sm font-black tracking-[0.25em]">
              INFO MALAM
            </p>

            <p className="mt-2 text-[10px] uppercase tracking-[0.25em] text-white/30">
              Memories after dark
            </p>

          </div>

          <p className="text-xs text-white/25">
            © 2026 Info Malam
          </p>

        </div>

      </footer>

      {/* ================= LIGHTBOX ================= */}

      {lightbox && (

        <div
          className="lightbox fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-4 sm:p-8"
          onClick={() => setLightbox(false)}
        >

          <button
            onClick={() => setLightbox(false)}
            className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-xl text-white transition hover:bg-white hover:text-black"
          >
            ×
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              previousPhoto();
            }}
            className="absolute left-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 text-xl sm:flex"
          >
            ←
          </button>

          <div
            className="lightbox-content relative max-h-[90vh] max-w-6xl"
            onClick={(e) => e.stopPropagation()}
          >

            <img
              src={current.url}
              alt={current.title}
              className="max-h-[80vh] max-w-full object-contain"
            />

            <div className="mt-4 flex items-center justify-between">

              <div>

                <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                  {current.place} · {current.date}
                </p>

                <h3 className="mt-2 text-xl font-bold">
                  {current.title}
                </h3>

              </div>

              <p className="text-xs text-white/30">
                {String(active + 1).padStart(2, "0")} /{" "}
                {String(photos.length).padStart(2, "0")}
              </p>

            </div>

          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextPhoto();
            }}
            className="absolute right-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 text-xl sm:flex"
          >
            →
          </button>

        </div>

      )}

    </main>
  );
}
