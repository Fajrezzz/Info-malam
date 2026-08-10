import { useEffect, useMemo, useState } from "react";

type Photo = {
  title: string;
  place: string;
  photographer: string;
  url: string;
  alt: string;
};

const photos: Photo[] = [
  {
    title: "Lampu Pasar Kota",
    place: "Jalan malam yang ramai",
    photographer: "Tony Wu",
    url: "https://images.pexels.com/photos/10543750/pexels-photo-10543750.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1100&w=1800",
    alt: "Stan pasar yang diterangi di malam hari dengan papan warna-warni.",
  },
  {
    title: "Optik Tengah Malam",
    place: "Jakarta, Indonesia",
    photographer: "AHMAD GHANI",
    url: "https://images.pexels.com/photos/36773971/pexels-photo-36773971.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1100&w=1800",
    alt: "Motor terparkir di depan toko optik pada malam hari.",
  },
  {
    title: "Restoran Neon",
    place: "Sudut jalan yang terang",
    photographer: "Diana Reyes",
    url: "https://images.pexels.com/photos/35258438/pexels-photo-35258438.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1100&w=1800",
    alt: "Restoran terang dengan lampu neon dan pejalan kaki di malam hari.",
  },
  {
    title: "Becak dan Cerita",
    place: "Serang, Indonesia",
    photographer: "febri visual",
    url: "https://images.pexels.com/photos/17103370/pexels-photo-17103370.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1100&w=1800",
    alt: "Seorang pria bersantai di becak di jalan ramai.",
  },
  {
    title: "Hujan Neon",
    place: "Jalan kota basah",
    photographer: "maxed. RAW",
    url: "https://images.pexels.com/photos/28383007/pexels-photo-28383007.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1100&w=1800",
    alt: "Jalan berlampu neon dengan orang-orang memakai payung saat hujan.",
  },
  {
    title: "Sate Malam",
    place: "Jakarta, Indonesia",
    photographer: "nourrie zein",
    url: "https://images.pexels.com/photos/36856159/pexels-photo-36856159.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1100&w=1800",
    alt: "Pedagang kaki lima memanggang sate di Jakarta pada malam hari.",
  },
];

const getRandomIndex = (current?: number) => {
  if (photos.length < 2) return 0;

  let next = Math.floor(Math.random() * photos.length);
  while (next === current) {
    next = Math.floor(Math.random() * photos.length);
  }

  return next;
};

export default function App() {
  const [activeIndex, setActiveIndex] = useState(() => getRandomIndex());
  const [showWelcome, setShowWelcome] = useState(true);
  const activePhoto = photos[activeIndex];

  const orderedPhotos = useMemo(
    () => [activePhoto, ...photos.filter((_, index) => index !== activeIndex)],
    [activeIndex, activePhoto],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => setShowWelcome(false), 2600);
    return () => window.clearTimeout(timer);
  }, []);

  const randomizePhoto = () => {
    setActiveIndex((current) => getRandomIndex(current));
  };

  return (
    <main className="min-h-screen bg-[#08090f] text-white">
      {showWelcome && (
        <section className="welcome-panel fixed inset-0 z-50 grid place-items-center bg-[#08090f] px-6 text-center">
          <div className="welcome-content max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.42em] text-amber-200/80">
              Selamat datang di
            </p>
            <h1 className="mt-5 text-5xl font-black tracking-tight text-white sm:text-7xl md:text-8xl">
              Info Malam
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/70 sm:text-lg">
              Kumpulan foto random bernuansa malam, dari jalan basah sampai lampu kota.
            </p>
            <button
              className="mt-8 rounded-full border border-white/25 px-6 py-3 text-sm font-bold uppercase tracking-[0.25em] text-white transition hover:border-amber-200 hover:bg-amber-200 hover:text-[#08090f]"
              onClick={() => setShowWelcome(false)}
            >
              Masuk
            </button>
          </div>
        </section>
      )}

      <section className="relative isolate flex min-h-screen items-end overflow-hidden px-5 pb-12 pt-24 sm:px-8 lg:px-14 lg:pb-16">
        <img
          key={activePhoto.url}
          className="hero-photo absolute inset-0 -z-20 h-full w-full object-cover"
          src={activePhoto.url}
          alt={activePhoto.alt}
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(8,9,15,0.15),rgba(8,9,15,0.7)_58%,#08090f_100%)]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(251,191,36,0.28),transparent_28%),radial-gradient(circle_at_80%_30%,rgba(59,130,246,0.28),transparent_30%)] mix-blend-screen" />

        <nav className="absolute left-5 right-5 top-5 z-10 flex items-center justify-between text-sm sm:left-8 sm:right-8 lg:left-14 lg:right-14">
          <a className="font-black uppercase tracking-[0.32em] text-white" href="#top" aria-label="Info Malam">
            Info Malam
          </a>
          <a className="font-semibold text-white/75 transition hover:text-white" href="#foto-random">
            Foto random
          </a>
        </nav>

        <div id="top" className="hero-copy max-w-5xl">
          <p className="text-sm font-bold uppercase tracking-[0.4em] text-amber-200/90">
            Selamat datang di
          </p>
          <h1 className="mt-4 text-6xl font-black leading-[0.85] tracking-[-0.08em] text-white sm:text-8xl lg:text-[10rem]">
            Info Malam
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-white/78 sm:text-xl">
            Website sederhana untuk melihat foto random bertema malam. Tekan tombol acak untuk mengganti suasana yang muncul.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <button
              className="rounded-full bg-amber-200 px-7 py-4 text-sm font-black uppercase tracking-[0.22em] text-[#08090f] transition hover:-translate-y-0.5 hover:bg-white focus:outline-none focus:ring-4 focus:ring-amber-200/30"
              onClick={randomizePhoto}
            >
              Acak foto
            </button>
            <a
              className="rounded-full border border-white/25 px-7 py-4 text-center text-sm font-black uppercase tracking-[0.22em] text-white transition hover:-translate-y-0.5 hover:border-white hover:bg-white/10"
              href="#foto-random"
            >
              Lihat galeri
            </a>
          </div>
        </div>
      </section>

      <section id="foto-random" className="px-5 py-20 sm:px-8 lg:px-14 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <div className="sticky top-8">
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-amber-200/80">Foto aktif</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-6xl">
              {activePhoto.title}
            </h2>
            <p className="mt-5 max-w-md text-lg leading-8 text-white/64">
              {activePhoto.place}. Foto oleh {activePhoto.photographer}. Pilih gambar lain atau biarkan tombol acak memilihkan untukmu.
            </p>
            <button
              className="mt-8 rounded-full bg-white px-7 py-4 text-sm font-black uppercase tracking-[0.22em] text-[#08090f] transition hover:-translate-y-0.5 hover:bg-amber-200 focus:outline-none focus:ring-4 focus:ring-white/20"
              onClick={randomizePhoto}
            >
              Random lagi
            </button>
          </div>

          <div className="gallery-grid grid gap-4 sm:grid-cols-2">
            {orderedPhotos.map((photo, index) => {
              const originalIndex = photos.findIndex((item) => item.url === photo.url);
              const isActive = originalIndex === activeIndex;

              return (
                <button
                  className={`group image-choice relative min-h-72 overflow-hidden text-left outline-none ${
                    index === 0 ? "sm:col-span-2 sm:min-h-[28rem]" : ""
                  }`}
                  key={photo.url}
                  onClick={() => setActiveIndex(originalIndex)}
                  style={{ animationDelay: `${index * 80}ms` }}
                  aria-label={`Pilih foto ${photo.title}`}
                >
                  <img
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    src={photo.url}
                    alt={photo.alt}
                    loading={index < 2 ? "eager" : "lazy"}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/12 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
                    <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-200/90">
                      {isActive ? "Sedang tampil" : "Klik untuk tampilkan"}
                    </p>
                    <h3 className="mt-2 text-2xl font-black text-white">{photo.title}</h3>
                    <p className="mt-1 text-sm text-white/68">{photo.place}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
