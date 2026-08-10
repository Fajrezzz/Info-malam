import { useCallback, useEffect, useMemo, useRef, useState, memo } from "react";
import { photos, type Photo } from "./photo";

function useInView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}

const GalleryItem = memo(function GalleryItem({
  photo,
  index,
  isActive,
  rgb,
  onOpen,
  onVisible,
}: {
  photo: Photo;
  index: number;
  isActive: boolean;
  rgb: number;
  onOpen: (photo: Photo) => void;
  onVisible: (index: number) => void;
}) {
  const { ref, inView } = useInView<HTMLButtonElement>();
  const [imageLoaded, setImageLoaded] = useState(false);
  const onVisibleRef = useRef(onVisible);
  onVisibleRef.current = onVisible;

  useEffect(() => {
    if (inView) onVisibleRef.current(index);
  }, [inView, index]);

  const frameAngle = (rgb + index * 47) % 360;
  const frameA = `hsl(${frameAngle}, 100%, 65%)`;
  const frameB = `hsl(${(frameAngle + 90) % 360}, 100%, 65%)`;
  const frameC = `hsl(${(frameAngle + 180) % 360}, 100%, 65%)`;
  const frameD = `hsl(${(frameAngle + 270) % 360}, 100%, 65%)`;

  return (
    <button
      ref={ref}
      onClick={() => onOpen(photo)}
      aria-label={`Lihat foto ${index + 1}`}
      className="group relative rounded-[20px] p-[3px] text-left w-full"
      style={{
        background: `conic-gradient(from ${frameAngle}deg, ${frameA}, ${frameB}, ${frameC}, ${frameD}, ${frameA})`,
        boxShadow: isActive
          ? `0 0 30px ${frameA}55, 0 0 60px ${frameC}30`
          : `0 0 18px ${frameA}25`,
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0) scale(1)" : "translateY(18px) scale(0.98)",
        transitionProperty: "opacity, transform, box-shadow",
        transitionDuration: "300ms",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        transitionDelay: inView ? `${(index % 3) * 20}ms` : "0ms",
      }}
    >
      <div className="relative overflow-hidden rounded-[17px] bg-[#050507]">
        <div className="aspect-[4/5] overflow-hidden bg-[#1a1a2e]">
          {!imageLoaded && (
            <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-[#1a1a2e] via-[#2a2a4a] to-[#1a1a2e] bg-[length:200%_100%]" />
          )}
          <img
            src={photo.url}
            alt={`Foto ${index + 1}`}
            loading={index < 5 ? "eager" : "lazy"}
            onLoad={() => setImageLoaded(true)}
            className={`h-full w-full object-cover transition duration-700 group-hover:scale-105 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4">
          <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/60">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      </div>
    </button>
  );
});

function StoryBar({
  photos,
  activeIndex,
  rgb,
  onSelect,
}: {
  photos: Photo[];
  activeIndex: number;
  rgb: number;
  onSelect: (photo: Photo) => void;
}) {
  return (
    <div className="mb-8">
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollSnapType: "x mandatory" }}>
        {photos.slice(0, 15).map((photo, idx) => {
          const isActive = idx === activeIndex;
          const angle = (rgb + idx * 47) % 360;
          const borderColor = `hsl(${angle}, 100%, 65%)`;

          return (
            <button
              key={photo.public_id}
              onClick={() => onSelect(photo)}
              aria-label={`Lihat foto ${idx + 1}`}
              className="flex-shrink-0 snap-start focus:outline-none"
            >
              <div
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full p-[2px] transition-all duration-300 ${
                  isActive ? "scale-110" : "scale-100"
                }`}
                style={{
                  background: isActive
                    ? `conic-gradient(from ${angle}deg, ${borderColor}, transparent 70%, ${borderColor})`
                    : "transparent",
                  boxShadow: isActive ? `0 0 15px ${borderColor}50` : "none",
                }}
              >
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-black/40">
                  <img src={photo.url} alt={`Story ${idx + 1}`} className="w-full h-full object-cover" loading="lazy" />
                </div>
              </div>
              <p className="text-[9px] text-white/50 mt-1 text-center truncate max-w-[60px]">
                {String(idx + 1).padStart(2, "0")}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SpeakerIcon({ playing }: { playing: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 5L6 9H2v6h4l5 4V5z" />
      {playing && (
        <>
          <path d="M15.54 8.46a5 5 0 010 7.07" />
          <path d="M19.07 4.93a10 10 0 010 14.14" />
        </>
      )}
      {!playing && <line x1="23" y1="9" x2="17" y2="15" />}
    </svg>
  );
}

function Lightbox({
  selected,
  photos,
  activeIndex,
  color1,
  onClose,
  onPrev,
  onNext,
  onDownload,
}: {
  selected: Photo;
  photos: Photo[];
  activeIndex: number;
  color1: string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onDownload: () => void;
}) {
  const [glitchKey, setGlitchKey] = useState(0);
  const [displayedCaption, setDisplayedCaption] = useState("");

  useEffect(() => {
    setGlitchKey((k) => k + 1);
  }, [selected.public_id]);

  useEffect(() => {
    const fullCaption = (selected as any).caption || "";
    if (!fullCaption) {
      setDisplayedCaption("");
      return;
    }
    let index = 0;
    setDisplayedCaption("");
    const interval = setInterval(() => {
      setDisplayedCaption(fullCaption.slice(0, index + 1));
      index++;
      if (index >= fullCaption.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, [selected.public_id]);

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/95 p-4 backdrop-blur-2xl" onClick={onClose}>
      <div className="absolute inset-0 opacity-[0.08]" style={{ background: `radial-gradient(circle at center, ${color1}, transparent 60%)` }} />
      <div key={glitchKey} className="glitch-overlay" />

      <button onClick={onClose} aria-label="Tutup lightbox" className="absolute right-5 top-5 z-30 rounded-full border border-white/10 bg-black/60 px-5 py-3 text-xs font-bold uppercase tracking-widest text-white/70 backdrop-blur-xl">
        Tutup ×
      </button>

      <button onClick={(e) => { e.stopPropagation(); onPrev(); }} aria-label="Foto sebelumnya" className="absolute left-3 z-30 rounded-full border border-white/10 bg-black/60 px-4 py-3 text-xl text-white/70 backdrop-blur-xl transition hover:text-white sm:left-6">
        ‹
      </button>

      <img src={selected.url} alt="Fullscreen" onClick={(e) => e.stopPropagation()} className="relative z-10 max-h-[85vh] max-w-[85vw] rounded-2xl border border-white/10 object-contain" style={{ boxShadow: `0 0 80px ${color1}15` }} />

      <button onClick={(e) => { e.stopPropagation(); onNext(); }} aria-label="Foto selanjutnya" className="absolute right-3 z-30 rounded-full border border-white/10 bg-black/60 px-4 py-3 text-xl text-white/70 backdrop-blur-xl transition hover:text-white sm:right-6">
        ›
      </button>

      {displayedCaption && (
        <div className="absolute bottom-20 left-1/2 z-30 max-w-[85vw] -translate-x-1/2 text-center text-sm text-white/60 italic">
          {displayedCaption}
          <span className="animate-pulse">|</span>
        </div>
      )}

      <button onClick={(e) => { e.stopPropagation(); onDownload(); }} aria-label="Download kartu pos" className="absolute bottom-6 left-6 z-30 rounded-full border border-white/10 bg-black/60 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white/70 backdrop-blur-xl transition hover:text-white">
        📮 Kartu Pos
      </button>

      <div className="absolute bottom-6 right-6 z-30 rounded-full border border-white/10 bg-black/60 px-5 py-2 text-[10px] font-bold tracking-[0.3em] text-white/50 backdrop-blur-xl">
        {String(activeIndex + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
      </div>
    </div>
  );
}

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selected, setSelected] = useState<Photo | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [rgb, setRgb] = useState(0);
  const [showTop, setShowTop] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [visibleIndices, setVisibleIndices] = useState<Set<number>>(new Set());
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let frame: number;
    const animate = () => {
      setRgb((v) => (v + 0.12) % 360);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrollY(y);
      setShowTop(y > 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (selected) {
        if (e.key === "Escape") setSelected(null);
        if (e.key === "ArrowRight") nextPhoto();
        if (e.key === "ArrowLeft") previousPhoto();
        return;
      }

      const key = e.key.toUpperCase();
      if (key === "M" || key === "A" || key === "L") {
        setTypedBuffer((prev) => {
          const next = prev + key;
          if (next === "MALAM") {
            setShowEasterEgg(true);
            setTimeout(() => setShowEasterEgg(false), 5000);
            return "";
          }
          if (!next.startsWith("MALAM")) return key === "M" ? key : "";
          return next;
        });
      } else {
        setTypedBuffer("");
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selected, activeIndex]);

  const [typedBuffer, setTypedBuffer] = useState("");

  const toggleMusic = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/night-ambience.mp3");
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
    }
    if (isMusicPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsMusicPlaying(!isMusicPlaying);
  };

  const handleVisible = useCallback((index: number) => {
    setVisibleIndices((prev) => {
      if (prev.has(index)) return prev;
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  }, []);

  const color1 = `hsl(${rgb}, 100%, 65%)`;
  const color2 = `hsl(${(rgb + 110) % 360}, 100%, 65%)`;

  const stars = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 1.6 + 0.6,
      delay: Math.random() * 6,
      duration: Math.random() * 3 + 2.5,
    }));
  }, []);

  if (!photos || photos.length === 0) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#050507] text-white">
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.5em] text-white/30">Info Malam</p>
          <p className="mt-4 text-sm text-white/50">Belum ada foto yang ter-load.</p>
        </div>
      </main>
    );
  }

  const activePhoto = photos[activeIndex];

  const randomPhoto = () => {
    let next = Math.floor(Math.random() * photos.length);
    while (next === activeIndex && photos.length > 1) {
      next = Math.floor(Math.random() * photos.length);
    }
    setActiveIndex(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  function nextPhoto() {
    const next = (activeIndex + 1) % photos.length;
    setActiveIndex(next);
    setSelected(photos[next]);
  }

  function previousPhoto() {
    const prev = (activeIndex - 1 + photos.length) % photos.length;
    setActiveIndex(prev);
    setSelected(photos[prev]);
  }

  const openPhoto = (photo: Photo) => {
    const index = photos.findIndex((p) => p.public_id === photo.public_id);
    setActiveIndex(index);
    setSelected(photo);
  };

  const downloadPostcard = () => {
    if (!selected) return;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = selected.url;
    img.onload = () => {
      const width = 1200;
      const height = 1600;
      canvas.width = width;
      canvas.height = height;

      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, width, height);

      const margin = 80;
      const imgWidth = width - margin * 2;
      const imgHeight = (img.height / img.width) * imgWidth;
      const yOffset = (height - imgHeight) / 2 - 40;
      ctx.drawImage(img, margin, yOffset, imgWidth, imgHeight);

      ctx.strokeStyle = "#ffffff30";
      ctx.lineWidth = 2;
      ctx.strokeRect(margin, yOffset, imgWidth, imgHeight);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 48px 'Inter', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Info Malam", width / 2, height - 120);

      ctx.font = "28px 'Inter', sans-serif";
      ctx.fillStyle = "#ffffff60";
      ctx.fillText("2026 / Indonesia", width / 2, height - 70);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `info-malam-${selected.public_id}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }, "image/png");
    };
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050507] text-white">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full blur-[160px] opacity-[0.08]" style={{ background: color1 }} />
        <div className="absolute -right-40 top-[40%] h-[500px] w-[500px] rounded-full blur-[160px] opacity-[0.07]" style={{ background: color2 }} />
        <div className="absolute bottom-[-250px] left-[30%] h-[500px] w-[500px] rounded-full blur-[160px] opacity-[0.05]" style={{ background: color1 }} />
      </div>

      <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
            }}
          />
        ))}
      </div>

      <div
        className="pointer-events-none fixed inset-0 z-[80] opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "120px 120px",
          animation: "grain 8s steps(8) infinite",
        }}
      />

      <style>{`
        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-2%, -4%); }
          20% { transform: translate(-6%, 2%); }
          30% { transform: translate(2%, -6%); }
          40% { transform: translate(-2%, 6%); }
          50% { transform: translate(-6%, 4%); }
          60% { transform: translate(6%, 0); }
          70% { transform: translate(0, 6%); }
          80% { transform: translate(-4%, 0); }
          90% { transform: translate(4%, 4%); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.4); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          animation: shimmer 1.6s ease-in-out infinite;
        }
        @keyframes glitch {
          0% { clip-path: inset(20% 0 60% 0); transform: translate(-5px, 2px); opacity: 0.8; }
          20% { clip-path: inset(40% 0 30% 0); transform: translate(5px, -2px); opacity: 0.6; }
          40% { clip-path: inset(10% 0 70% 0); transform: translate(-3px, 1px); opacity: 0.7; }
          60% { clip-path: inset(50% 0 20% 0); transform: translate(6px, -3px); opacity: 0.9; }
          80% { clip-path: inset(30% 0 50% 0); transform: translate(-4px, 3px); opacity: 0.5; }
          100% { clip-path: inset(0% 0 0% 0); transform: translate(0); opacity: 1; }
        }
        .glitch-overlay {
          animation: glitch 0.3s ease-out;
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.05);
          pointer-events: none;
          z-index: 20;
        }
        @keyframes meteor {
          0% { transform: translateY(-100px) translateX(100vw); opacity: 1; }
          100% { transform: translateY(100vh) translateX(-100vw); opacity: 0; }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {showWelcome && (
        <div className="fixed inset-0 z-[999] grid place-items-center bg-[#050507]">
          <div className="absolute h-80 w-80 rounded-full blur-[130px] opacity-10" style={{ background: color1 }} />
          <div className="relative text-center">
            <p className="text-[10px] uppercase tracking-[0.7em] text-white/30">2026 / Indonesia</p>
            <h1 className="mt-7 text-6xl font-black leading-[0.8] tracking-[-0.09em] sm:text-8xl" style={{ textShadow: `0 0 35px ${color1}30` }}>
              Info<br />Malam.
            </h1>
            <div className="mx-auto mt-9 h-px w-20" style={{ background: `linear-gradient(90deg, ${color1}, ${color2})` }} />
            <p className="mt-6 text-[10px] uppercase tracking-[0.5em] text-white/30">Memories after dark</p>
          </div>
        </div>
      )}

      <nav className={`fixed left-0 right-0 top-0 z-50 px-4 py-4 sm:px-8 transition-all duration-500 ${showTop ? "bg-black/70 backdrop-blur-xl" : "bg-transparent"}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <a href="#home" className="text-[11px] font-black uppercase tracking-[0.4em] text-white/80" aria-label="Kembali ke atas">
            Info Malam
          </a>
          <button
            onClick={toggleMusic}
            aria-label={isMusicPlaying ? "Matikan musik" : "Nyalakan musik"}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white/80 backdrop-blur-xl transition hover:bg-white/10 hover:text-white"
          >
            <SpeakerIcon playing={isMusicPlaying} />
          </button>
        </div>
      </nav>

      {showEasterEgg && (
        <div className="pointer-events-none fixed inset-0 z-[200] overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute h-1 w-1 rounded-full bg-white"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `meteor ${2 + Math.random() * 3}s linear ${Math.random()}s infinite`,
                opacity: 0.8,
                boxShadow: "0 0 6px #fff",
              }}
            />
          ))}
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-4xl font-black text-white animate-pulse">MALAM 🌙</h2>
          </div>
        </div>
      )}

      <section id="home" className="relative z-10 flex min-h-screen items-end overflow-hidden px-5 pb-16 pt-32 sm:px-8 lg:px-14 lg:pb-20">
        <img src={activePhoto.url} alt={activePhoto.public_id} className="absolute inset-0 h-full w-full object-cover transition duration-1000" style={{ transform: `translateY(${scrollY * 0.2}px)` }} />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 opacity-20" style={{ background: `linear-gradient(135deg, ${color1}, transparent 40%, ${color2})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-black/30 to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-2 w-2 animate-pulse rounded-full" style={{ background: color1, boxShadow: `0 0 15px ${color1}` }} />
            <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/40">2026 / Indonesia</p>
          </div>
          <h1 className="text-[19vw] font-black leading-[0.76] tracking-[-0.09em] sm:text-[13vw] lg:text-[10rem]" style={{ textShadow: `0 0 50px ${color1}20` }}>
            Malam<br />
            <span className="inline-block text-white" style={{ textShadow: `0 0 15px ${color1}40, 0 0 35px ${color2}20`, letterSpacing: "-0.04em" }}>Bersama.</span>
          </h1>
          <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-xl text-base leading-7 text-white/50 sm:text-lg">Kumpulan momen, teman, dan cerita yang tersimpan dalam satu arsip malam.</p>
            <button onClick={randomPhoto} aria-label="Lihat foto acak" className="w-fit rounded-full px-7 py-4 text-xs font-black uppercase tracking-[0.22em] text-black transition hover:-translate-y-1 hover:scale-105" style={{ background: `linear-gradient(90deg, ${color1}, ${color2})`, boxShadow: `0 0 30px ${color1}25` }}>
              Foto Acak ↗
            </button>
          </div>
        </div>
      </section>

      <section id="gallery" className="relative z-10 px-5 py-20 sm:px-8 lg:px-14 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/25">02 — Gallery</p>
              <h2 className="mt-4 text-5xl font-black tracking-[-0.06em] sm:text-7xl">
                Semua<br />
                <span style={{ color: color1, textShadow: `0 0 25px ${color1}25` }}>cerita.</span>
              </h2>
            </div>
            <button onClick={randomPhoto} aria-label="Lihat foto acak dari galeri" className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 transition hover:border-white/30 hover:text-white">
              Random
            </button>
          </div>

          <StoryBar photos={photos} activeIndex={activeIndex} rgb={rgb} onSelect={openPhoto} />

          {/* GRID FOTO - SEMUA SAMA UKURAN */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {photos.map((photo, index) => (
              <GalleryItem
                key={photo.public_id}
                photo={photo}
                index={index}
                isActive={index === activeIndex}
                rgb={rgb}
                onOpen={openPhoto}
                onVisible={handleVisible}
              />
            ))}
          </div>

          <div className="mt-10 flex items-center gap-4">
            <div className="h-1.5 flex-1 rounded-full bg-white/5">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(visibleIndices.size / photos.length) * 100}%`, background: `linear-gradient(90deg, ${color1}, ${color2})` }} />
            </div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-white/25">{visibleIndices.size}/{photos.length}</span>
          </div>
        </div>
      </section>

      <section className="relative z-10 border-t border-white/10 px-5 py-24 sm:px-8 lg:px-14 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.35fr_1fr] lg:items-center">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/25">03 — Featured</p>
            <h2 className="mt-5 text-5xl font-black tracking-[-0.06em] sm:text-7xl">
              Moment<br />
              <span style={{ color: color2, textShadow: `0 0 25px ${color2}25` }}>#{String(activeIndex + 1).padStart(2, "0")}</span>
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/35">Foto yang sedang kamu lihat dari koleksi malam ini.</p>
            <button onClick={() => setSelected(activePhoto)} aria-label="Buka foto featured dalam fullscreen" className="mt-7 rounded-full px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-black transition hover:scale-105" style={{ background: `linear-gradient(90deg, ${color1}, ${color2})`, boxShadow: `0 0 30px ${color1}20` }}>
              Buka fullscreen
            </button>
          </div>
          <button onClick={() => setSelected(activePhoto)} aria-label="Lihat foto featured" className="group overflow-hidden rounded-3xl border border-white/10">
            <img src={activePhoto.url} alt="Featured" className="max-h-[75vh] w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
          </button>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 px-5 py-12 sm:px-8 lg:px-14">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-lg font-black">Info Malam.</p>
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 animate-pulse rounded-full" style={{ background: color1, boxShadow: `0 0 15px ${color1}` }} />
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/20">Made from memories — 2026</p>
          </div>
        </div>
      </footer>

      {showTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Kembali ke atas" className="fixed bottom-6 right-5 z-50 rounded-full border border-white/10 bg-black/70 px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-white/60 backdrop-blur-xl transition hover:text-white">
          ↑ Top
        </button>
      )}

      {selected && (
        <Lightbox
          selected={selected}
          photos={photos}
          activeIndex={activeIndex}
          color1={color1}
          onClose={() => setSelected(null)}
          onPrev={previousPhoto}
          onNext={nextPhoto}
          onDownload={downloadPostcard}
        />
      )}
    </main>
  );
}
