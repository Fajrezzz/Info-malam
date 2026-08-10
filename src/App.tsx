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
  const [filter, setFilter] = useState("ALL");
  const [loadedImages, setLoadedImages] = useState({});

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let frame;
    const animate = () => {
      setRgb((v) => (v + 0.15) % 360);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  const color1 = `hsl(${rgb}, 100%, 65%)`;
  const color2 = `hsl(${(rgb + 100) % 360}, 100%, 65%)`;

  useEffect(() => {
    if (!autoplay) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % photosWithCategory.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [autoplay]);

  const touchStartX = useRef(0);
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
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

  const handleImageLoad = (id) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  const filteredPhotos = useMemo(() => {
    if (filter === "ALL") return photosWithCategory;
    return photosWithCategory.filter((p) => p.category === filter);
  }, [filter]);

  const activePhoto = photosWithCategory[activeIndex];

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full blur-[150px] opacity-[0.10]" style={{ background: color1 }} />
        <div className="absolute bottom-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full blur-[150px] opacity-[0.10]" style={{ background: color2 }} />
      </div>

      {showWelcome && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-[#0a0a0f]">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-[0.5em] text-white/30">2026 / Indonesia</p>
            <h1 className="mt-6 text-7xl font-black" style={{ color: color1 }}>Info Malam.</h1>
            <div className="mx-auto mt-4 h-[2px] w-20 rounded-full" style={{ background: `linear-gradient(90deg, ${color1}, ${color2})` }} />
            <p className="mt-4 text-[10px] uppercase tracking-[0.4em] text-white/20">Memories after dark</p>
          </div>
        </div>
      )}

      <nav className="fixed top-0 left-0 right-0 z-50 px-5 py-5">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <span className="text-sm font-black" style={{ color: color1 }}>✦ INFOMALAM</span>
          <div className="flex items-center gap-5 text-[10px] font-medium uppercase">
            <a href="#gallery" className="text-white/40 hover:text-white">Gallery</a>
            <span className="text-white/20">{filteredPhotos.length}</span>
          </div>
        </div>
      </nav>

      <section className="relative z-10 min-h-screen flex items-end px-6 pb-16 pt-28" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <div className="absolute inset-0 -z-10">
          <img src={activePhoto.url} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
        </div>
        <div className="mx-auto w-full max-w-7xl">
          <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-white/40">2026 / Indonesia</p>
          <h1 className="mt-3 text-[15vw] font-black leading-[0.85]">
            Malam<br />
            <span style={{ background: `linear-gradient(90deg, ${color1}, ${color2})`, WebkitBackgroundClip: "text", color: "transparent" }}>Bersama.</span>
          </h1>
          <p className="mt-4 max-w-md text-sm text-white/30">Kumpulan momen, teman, dan cerita dalam satu arsip malam.</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button onClick={randomPhoto} className="px-8 py-4 rounded-full text-sm font-bold uppercase text-black" style={{ background: `linear-gradient(135deg, ${color1}, ${color2})`, boxShadow: `0 0 30px ${color1}30` }}>Foto Acak →</button>
            <button onClick={() => setAutoplay((p) => !p)} className="px-6 py-4 rounded-full border border-white/10 text-white/40 text-sm">{autoplay ? "⏸" : "▶"}</button>
          </div>
        </div>
      </section>

      <section id="gallery" className="relative z-10 px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[10px] font-medium uppercase text-white/20">02 / Gallery</p>
              <h2 className="text-4xl font-black mt-1">Semua <span style={{ color: color1 }}>cerita.</span></h2>
            </div>
            <button onClick={randomPhoto} className="text-[10px] font-medium text-white/30 hover:text-white">Random ↻</button>
          </div>

          <div className="flex flex-wrap gap-2 mb-10 overflow-x-auto pb-2">
            <button onClick={() => setFilter("ALL")} className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase ${filter === "ALL" ? "text-black" : "text-white/30"}`} style={filter === "ALL" ? { background: `linear-gradient(135deg, ${color1}, ${color2})` } : {}}>All</button>
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setFilter(cat)} className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase ${filter === cat ? "text-black" : "text-white/30"}`} style={filter === cat ? { background: `linear-gradient(135deg, ${color1}, ${color2})` } : {}}>{cat}</button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {filteredPhotos.map((photo, index) => {
              const isLoaded = loadedImages[photo.public_id];
              return (
                <div
                  key={photo.public_id}
                  onClick={() => {
                    const originalIndex = photosWithCategory.findIndex((p) => p.public_id === photo.public_id);
                    setActiveIndex(originalIndex);
                    setSelected(photo);
                  }}
                  className="group relative overflow-hidden rounded-2xl cursor-pointer transition hover:scale-[1.02] active:scale-[0.97]"
                  style={{
                    border: `2px solid ${index % 2 === 0 ? color1 : color2}50`,
                    boxShadow: `0 0 25px ${index % 2 === 0 ? color1 : color2}15`,
                  }}
                >
                  <div className="aspect-[3/4] bg-white/5">
                    {!isLoaded && <div className="absolute inset-0 animate-pulse bg-white/5" />}
                    <img
                      src={photo.url}
                      loading={index < 6 ? "eager" : "lazy"}
                      onLoad={() => handleImageLoad(photo.public_id)}
                      className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${isLoaded ? "opacity-100" : "opacity-0"}`}
                    />
                  </div>
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full text-[8px] font-bold text-white/70">{photo.category}</div>
                  <div className="absolute bottom-3 left-3 text-[9px] font-bold text-white/30">#{String(index + 1).padStart(2, "0")}</div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
                </div>
              );
            })}
          </div>
          {filteredPhotos.length === 0 && <p className="text-center text-white/20 py-12 text-sm">Tidak ada foto di kategori ini.</p>}
        </div>
      </section>

      <button onClick={randomPhoto} className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-2xl" style={{ background: `linear-gradient(135deg, ${color1}, ${color2})`, boxShadow: `0 0 40px ${color1}30` }}>🎲</button>

      {selected && (
        <div className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6" onClick={() => setSelected(null)}>
          <button onClick={() => setSelected(null)} className="absolute top-5 right-5 z-20 text-white/30 text-sm hover:text-white">✕ Tutup</button>
          <img src={selected.url} onClick={(e) => e.stopPropagation()} className="relative max-h-[90vh] max-w-full rounded-2xl object-contain" style={{ boxShadow: `0 0 80px ${color1}20` }} />
        </div>
      )}
    </main>
  );
}
