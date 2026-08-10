import { useEffect, useMemo, useRef, useState } from "react";
import { photos, type Photo } from "./photo";

const CATEGORIES = ["WATCH", "EXPERIENCE", "RANDOM", "GAMES", "ABOUT", "PRIVATE", "LOVE"];

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
  const [filter, setFilter] = useState<string>("ALL");
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let frame: number;
    const animate = () => {
      setRgb((value) => (value + 0.2) % 360);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  const color1 = `hsl(${rgb}, 100%, 60%)`;
  const color2 = `hsl(${(rgb + 120) % 360}, 100%, 60%)`;

  useEffect(() => {
    if (!autoplay) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % photosWithCategory.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [autoplay]);

  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) {
      setActiveIndex((prev) => (prev + 1) % photosWithCategory.length);
    } else if (diff < -50) {
      setActiveIndex((prev) => (prev - 1 + photosWithCategory.length) % photosWithCategory.length);
    }
  };

  const randomPhoto = () => {
    let next = Math.floor(Math.random() * photosWithCategory.length);
    while (next === activeIndex && photosWithCategory.length > 1) {
      next = Math.floor(Math.random() * photosWithCategory.length);
    }
    setActiveIndex(next);
  };

  const handleImageLoad = (id: string) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  const filteredPhotos = useMemo(() => {
    if (filter === "ALL") return photosWithCategory;
    return photosWithCategory.filter((photo) => photo.category === filter);
  }, [filter]);

  const activePhoto = photosWithCategory[activeIndex];

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      {/* Background RGB */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full blur-[150px] opacity-[0.10]" style={{ background: color1 }} />
        <div className="absolute bottom-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full blur-[150px] opacity-[0.10]" style={{ background: color2 }} />
      </div>

      {/* Welcome */}
      {showWelcome && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-[#0a0a0f]">
          <div className="relative text-center">
            <p className="text-[10px] uppercase tracking-[0.5em] text-white/30">2026 / Indonesia</p>
            <h1 className="mt-6 text-7xl font-black tracking-[-0.05em]" style={{ color: color1 }}>Info Malam.</h1>
            <div className="mx-auto mt-4 h-[2px] w-20 rounded-full" style={{ background: `linear-gradient(90deg, ${color1}, ${color2})` }} />
            <p className="mt-4 text-[10px] uppercase tracking-[0.4em] text-white/20">Memories after dark</p>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-5 py-5">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <span className="text-sm font-black tracking-[-0.02em]" style={{ color: color1 }}>✦ INFOMALAM</span>
          <div className="flex items-center gap-5 text-[10px] font-medium uppercase tracking-[0.15em]">
            <a href="#gallery" className="text-white/40 hover:text-white transition">Gallery</a>
            <span className="text-white/20">{filteredPhotos.length}</span>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section id="home" className="relative z-10 min-h-screen flex items-end px-6 pb-16 pt-28" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <div className="absolute inset-0 -z-10">
          <img src={activePhoto.url} alt={activePhoto.public_id} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/30 to-transparent" />
        </div>
        <div className="mx-auto w-full max-w-7xl">
          <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-white/40">2026 / Indonesia</p>
          <h1 className="mt-3 text-[15vw] font-black leading-[0.85] tracking-[-0.06em]">
            Malam<br />
            <span style={{ background: `linear-gradient(90deg, ${color1}, ${color2})`, WebkitBackgroundClip: "text", color: "transparent" }}>Bersama.</span>
          </h1>
          <p className="mt-4 max-w-md text-sm text-white/30">Kumpulan momen, teman, dan cerita yang tersimpan dalam satu arsip malam.</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button onClick={randomPhoto} className="px-8 py-4 rounded-full text-sm font-bold uppercase tracking-[0.1em] text-black transition hover:scale-105 active:scale-95" style={{ background: `linear-gradient(135deg, ${color1}, ${color2})`, boxShadow: `0 0 30px ${color1}30` }}>Foto Acak →</button>
            <button onClick={() => setAutoplay((p) => !p)} className="px-6 py-4 rounded-full border border-white/10 text-white/40 text-sm font-medium hover:border-white/30 transition">{autoplay ? "⏸" : "▶"}</button>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="relative z-10 px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/20">02 / Gallery</p>
              <h2 className="text-4xl font-black tracking-[-0.04em] mt-1">Semua <span style={{ color: color1 }}>cerita.</span></h2>
            </div>
            <button onClick={randomPhoto} className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/30 hover:text-white transition">Random ↻</button>
          </div>

          {/* Filter */}
          <div className="flex flex-wrap gap-2 mb-10 overflow-x-auto pb-2 scrollbar-hide">
            <button onClick={() => setFilter("ALL")} className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.1em] transition ${filter === "ALL" ? "text-black" : "text-white/30 hover:text-white/70"}`} style={filter === "ALL" ? { background: `linear-gradient(135deg, ${color1}, ${color2})` } : { background: "transparent" }}>All</button>
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setFilter(cat)} className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.1em] transition ${filter === cat ? "text-black" : "text-white/30 hover:text-white/70"}`} style={filter === cat ? { background: `linear-gradient(135deg, ${color1}, ${color2})` } : { background: "transparent" }}>{cat}</button>
            ))}
          </div>

          {/* Grid dengan GAP BESAR dan BORDER RGB */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
            {filteredPhotos.map((photo, index) => {
              const isLoaded = loadedImages[photo.public_id];
              const borderColor = index % 2 === 0 ? color1 : color2;
              return (
                <div
                  key={photo.public_id}
                  onClick={() => { const originalIndex = photosWithCategory.findIndex((p) => p.public_id === photo.public_id); setActiveIndex(originalIndex); setSelected(photo); }}
                  className="group relative overflow-hidden rounded-2xl cursor-pointer transition duration-300 hover:scale-[1.02] active:scale-[0.97]"
                  style={{
                    border: `2px solid ${borderColor}60`,
                    boxShadow: `0 0 25px ${borderColor}20, inset 0 0 25px ${borderColor}10`,
                  }}
                >
                  <div className="aspect-[3/4] bg-white/5">
                    {!isLoaded && <div className="absolute inset-0 animate-pulse bg-white/5" />}
                    <img src={photo.url} alt={photo.public_id} loading={index < 6 ? "eager" : "lazy"} onLoad={() => handleImageLoad(photo.public_id)} className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${isLoaded ? "opacity-100" : "opacity-0"}`} />
                  </div>
                  {/* Label kategori */}
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider text-white/70">{photo.category}</div>
                  {/* Nomor urut */}
                  <div className="absolute bottom-3 left-3 text-[9px] font-bold tracking-[0.2em] text-white/30">#{String(index + 1).padStart(2, "0")}</div>
                  {/* Overlay gradien saat hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />
                </div>
              );
            })}
          </div>
          {filteredPhotos.length === 0 && <p className="text-center text-white/20 py-12 text-sm">Tidak ada foto di kategori ini.</p>}
        </div>
      </section>

      {/* Featured */}
      <section className="relative z-10 px-6 py-16 border-t border-white/5">
        <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/20">03 / Featured</p>
            <h2 className="text-4xl font-black tracking-[-0.04em] mt-1">Moment <span style={{ color: color2 }}>#{String(activeIndex + 1).padStart(2, "0")}</span></h2>
            <p className="mt-3 text-sm text-white/30">Foto yang sedang kamu lihat dari koleksi malam ini.</p>
            <button onClick={() => setSelected(activePhoto)} className="mt-6 px-8 py-4 rounded-full text-sm font-bold uppercase tracking-[0.1em] text-black transition hover:scale-105 active:scale-95" style={{ background: `linear-gradient(135deg, ${color1}, ${color2})`, boxShadow: `0 0 30px ${color1}20` }}>Lihat Fullscreen →</button>
          </div>
          <div onClick={() => setSelected(activePhoto)} className="cursor-pointer overflow-hidden rounded-2xl transition hover:scale-[1.02] active:scale-[0.97]">
            <img src={activePhoto.url} alt="Featured" className="w-full max-h-[60vh] object-cover" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-10 border-t border-white/5">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-lg font-black tracking-[-0.02em]" style={{ color: color1 }}>✦ INFOMALAM</span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/10">Made from memories — 2026</span>
        </div>
      </footer>

      {/* FAB Random */}
      <button onClick={randomPhoto} className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-2xl transition active:scale-90 hover:scale-105" style={{ background: `linear-gradient(135deg, ${color1}, ${color2})`, boxShadow: `0 0 40px ${color1}30` }}>🎲</button>

      {/* Lightbox */}
      {selected && (
        <div className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6" onClick={() => setSelected(null)}>
          <button onClick={() => setSelected(null)} className="absolute top-5 right-5 z-20 text-white/30 text-sm font-medium hover:text-white transition">✕ Tutup</button>
          <img src={selected.url} alt="Fullscreen" onClick={(e) => e.stopPropagation()} className="relative max-h-[90vh] max-w-full rounded-2xl object-contain shadow-2xl" style={{ boxShadow: `0 0 80px ${color1}20` }} />
        </div>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </main>
  );
}
