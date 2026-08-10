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
  const color3 = `hsl(${(rgb + 240) % 360}, 100%, 60%)`;

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
    <main className="min-h-screen bg-[#0a0a0f] text-white font-sans overflow-x-hidden">
      {/* ===== BACKGROUND RGB DINAMIS ===== */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-30%] left-[-20%] h-[600px] w-[600px] rounded-full blur-[180px] opacity-[0.15] animate-pulse" style={{ background: color1 }} />
        <div className="absolute bottom-[-30%] right-[-20%] h-[600px] w-[600px] rounded-full blur-[180px] opacity-[0.12] animate-pulse" style={{ background: color2 }} />
        <div className="absolute top-[50%] left-[50%] translate-x-[-50%] h-[400px] w-[400px] rounded-full blur-[180px] opacity-[0.08]" style={{ background: color3 }} />
      </div>

      {/* ===== WELCOME ===== */}
      {showWelcome && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-[#0a0a0f]">
          <div className="absolute h-[500px] w-[500px] rounded-full blur-[150px] opacity-20" style={{ background: `conic-gradient(${color1}, ${color2}, ${color3}, ${color1})` }} />
          <div className="relative text-center">
            <p className="text-[11px] uppercase tracking-[0.5em] text-white/30 font-medium">2026 / Indonesia</p>
            <h1 className="mt-6 text-7xl sm:text-8xl font-black tracking-[-0.05em] leading-[0.9]" style={{ background: `linear-gradient(135deg, ${color1}, ${color2}, ${color3})`, WebkitBackgroundClip: "text", color: "transparent" }}>Info Malam.</h1>
            <div className="mx-auto mt-6 h-[2px] w-24 rounded-full" style={{ background: `linear-gradient(90deg, ${color1}, ${color2}, ${color3})` }} />
            <p className="mt-5 text-[11px] uppercase tracking-[0.4em] text-white/20">Memories after dark</p>
          </div>
        </div>
      )}

      {/* ===== NAVBAR ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-5 py-5">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <a href="#home" className="text-sm font-black tracking-[-0.02em]" style={{ color: color1 }}>✦ INFOMALAM</a>
          <div className="flex items-center gap-6 text-[11px] font-medium uppercase tracking-[0.15em]">
            <a href="#gallery" className="text-white/50 hover:text-white transition">Gallery</a>
            <span className="text-white/30">{filteredPhotos.length}</span>
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section id="home" className="relative z-10 min-h-screen flex items-end px-6 pb-16 pt-28 sm:px-10 lg:px-16" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <div className="absolute inset-0 -z-10">
          <img src={activePhoto.url} alt={activePhoto.public_id} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/40 to-transparent" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${color1}10, transparent 50%, ${color2}10)` }} />
        </div>

        <div className="mx-auto w-full max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-white/40">2026 / Indonesia</p>
            <h1 className="mt-4 text-[15vw] sm:text-[10vw] lg:text-[8vw] font-black leading-[0.85] tracking-[-0.06em]">
              <span className="text-white">Malam</span>
              <br />
              <span style={{ background: `linear-gradient(90deg, ${color1}, ${color2}, ${color3}, ${color1})`, backgroundSize: "300% 100%", WebkitBackgroundClip: "text", color: "transparent", animation: "gradientMove 4s ease-in-out infinite" }}>Bersama.</span>
            </h1>
            <p className="mt-6 max-w-md text-white/40 text-base leading-relaxed">Kumpulan momen, teman, dan cerita yang tersimpan dalam satu arsip malam.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button onClick={randomPhoto} className="px-8 py-4 rounded-full text-sm font-bold uppercase tracking-[0.1em] text-black transition hover:scale-105 active:scale-95" style={{ background: `linear-gradient(135deg, ${color1}, ${color2})`, boxShadow: `0 0 40px ${color1}30` }}>Foto Acak →</button>
              <button onClick={() => setAutoplay((p) => !p)} className="px-6 py-4 rounded-full border border-white/10 text-white/50 text-sm font-medium hover:border-white/30 transition">{autoplay ? "⏸ Pause" : "▶ Play"}</button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="relative z-10 px-6 py-16 sm:px-10 lg:px-16 border-b border-white/5">
        <div className="mx-auto max-w-7xl grid grid-cols-3 gap-4">
          <div className="text-center"><p className="text-3xl font-black" style={{ color: color1 }}>{photosWithCategory.length}</p><p className="text-[10px] uppercase tracking-[0.2em] text-white/20">Moments</p></div>
          <div className="text-center"><p className="text-3xl font-black text-white">✦</p><p className="text-[10px] uppercase tracking-[0.2em] text-white/20">Teman</p></div>
          <div className="text-center"><p className="text-3xl font-black" style={{ color: color2 }}>∞</p><p className="text-[10px] uppercase tracking-[0.2em] text-white/20">Cerita</p></div>
        </div>
      </section>

      {/* ===== GALLERY ===== */}
      <section id="gallery" className="relative z-10 px-6 py-16 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/20">02 / Gallery</p>
              <h2 className="text-4xl sm:text-5xl font-black tracking-[-0.04em] mt-2">Semua <span style={{ color: color1 }}>cerita.</span></h2>
            </div>
            <button onClick={randomPhoto} className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/30 hover:text-white transition">Random ↻</button>
          </div>

          {/* ===== FILTER ===== */}
          <div className="flex flex-wrap gap-2 mb-10 overflow-x-auto pb-2 scrollbar-hide">
            <button onClick={() => setFilter("ALL")} className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.1em] transition ${filter === "ALL" ? "text-black" : "text-white/30 hover:text-white/70"}`} style={filter === "ALL" ? { background: `linear-gradient(135deg, ${color1}, ${color2})` } : { background: "transparent" }}>All</button>
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setFilter(cat)} className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.1em] transition ${filter === cat ? "text-black" : "text-white/30 hover:text-white/70"}`} style={filter === cat ? { background: `linear-gradient(135deg, ${color1}, ${color2})` } : { background: "transparent" }}>{cat}</button>
            ))}
          </div>

          {/* ===== GRID FOTO ===== */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {filteredPhotos.map((photo, index) => {
              const isLoaded = loadedImages[photo.public_id];
              return (
                <div
                  key={photo.public_id}
                  onClick={() => { const originalIndex = photosWithCategory.findIndex((p) => p.public_id === photo.public_id); setActiveIndex(originalIndex); setSelected(photo); }}
                  className="group relative overflow-hidden rounded-2xl cursor-pointer transition duration-500 hover:scale-[1.02] active:scale-[0.97]"
                  style={{
                    boxShadow: `0 8px 30px rgba(0,0,0,0.4)`,
                  }}
                >
                  <div className="aspect-[3/4] bg-white/5">
                    {!isLoaded && <div className="absolute inset-0 animate-pulse bg-white/5" />}
                    <img src={photo.url} alt={photo.public_id} loading={index < 6 ? "eager" : "lazy"} onLoad={() => handleImageLoad(photo.public_id)} className={`h-full w-full object-cover transition duration-700 group-hover:scale-105 ${isLoaded ? "opacity-100" : "opacity-0"}`} />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition duration-500">
                    <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-white/30">{photo.category}</p>
                    <p className="text-sm font-bold">#{String(index + 1).padStart(2, "0")}</p>
                  </div>
                  {/* ===== BORDER RGB ===== */}
                  <div className="absolute inset-0 pointer-events-none rounded-2xl border-2 border-transparent" style={{ boxShadow: `inset 0 0 30px ${color1}15, inset 0 0 60px ${color2}08` }} />
                  <div className="absolute -inset-[2px] pointer-events-none rounded-2xl opacity-0 group-hover:opacity-100 transition duration-700" style={{ background: `conic-gradient(from ${rgb}deg, ${color1}, ${color2}, ${color3}, ${color1})`, WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude", padding: "2px" }} />
                </div>
              );
            })}
          </div>
          {filteredPhotos.length === 0 && <p className="text-center text-white/20 py-12 text-sm">Tidak ada foto di kategori ini.</p>}
        </div>
      </section>

      {/* ===== FEATURED ===== */}
      <section className="relative z-10 px-6 py-16 sm:px-10 lg:px-16 border-t border-white/5">
        <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/20">03 / Featured</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-[-0.04em] mt-2">Moment <span style={{ color: color2 }}>#{String(activeIndex + 1).padStart(2, "0")}</span></h2>
            <p className="mt-4 text-white/30 text-sm leading-relaxed">Foto yang sedang kamu lihat dari koleksi malam ini.</p>
            <button onClick={() => setSelected(activePhoto)} className="mt-6 px-8 py-4 rounded-full text-sm font-bold uppercase tracking-[0.1em] text-black transition hover:scale-105 active:scale-95" style={{ background: `linear-gradient(135deg, ${color1}, ${color2})`, boxShadow: `0 0 40px ${color1}20` }}>Lihat Fullscreen →</button>
          </div>
          <div onClick={() => setSelected(activePhoto)} className="cursor-pointer overflow-hidden rounded-2xl transition hover:scale-[1.02] active:scale-[0.97]">
            <img src={activePhoto.url} alt="Featured" className="w-full max-h-[60vh] object-cover" />
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="relative z-10 px-6 py-10 border-t border-white/5">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-lg font-black tracking-[-0.02em]" style={{ color: color1 }}>✦ INFOMALAM</p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/10">Made from memories — 2026</p>
        </div>
      </footer>

      {/* ===== FAB ===== */}
      <button onClick={randomPhoto} className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-2xl transition active:scale-90 hover:scale-105" style={{ background: `linear-gradient(135deg, ${color1}, ${color2})`, boxShadow: `0 0 40px ${color1}30` }}>🎲</button>

      {/* ===== LIGHTBOX ===== */}
      {selected && (
        <div className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6" onClick={() => setSelected(null)}>
          <div className="absolute inset-0" style={{ background: `radial-gradient(circle at center, ${color1}15, transparent 60%)` }} />
          <button onClick={() => setSelected(null)} className="absolute top-5 right-5 z-20 text-white/30 text-sm font-medium hover:text-white transition">✕ Tutup</button>
          <img src={selected.url} alt="Fullscreen" onClick={(e) => e.stopPropagation()} className="relative max-h-[90vh] max-w-full rounded-2xl object-contain shadow-2xl" style={{ boxShadow: `0 0 80px ${color1}20` }} />
        </div>
      )}

      {/* ===== CSS ANIMATION ===== */}
      <style>{`
        @keyframes gradientMove {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </main>
  );
}
