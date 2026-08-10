import { useEffect, useState, useRef, useCallback } from "react";

/* ================= DATA ================= */
type Photo = {
  public_id: string;
  url: string;
  caption?: string;
};

const photos: Photo[] = Array.from({ length: 18 }, (_, i) => {
  const seeds = [15, 29, 47, 65, 88, 110, 137, 174, 195, 211, 244, 257, 302, 316, 338, 369, 452, 472];
  const captions = [
    "Dingin malam yang enggak pernah tidur",
    "Cerita di balik lampu kota yang redup",
    "Jejak pulang jam 2 pagi",
    "Kopi hitam, obrolan panjang",
    "Sunyi tapi rame di kepala",
    "Lampu jalan jadi saksi",
    "Rindu yang menggema di trotoar kosong",
    "Malam minggu versi introvert",
    "City lights & heavy thoughts",
    "Setelah hujan, sebelum pulang",
  ];
  return {
    public_id: `malam-${i + 1}`,
    url: `https://picsum.photos/id/${seeds[i]}/800/1000`,
    caption: captions[i % captions.length],
  };
});

const randomPhotos = photos.slice(0, 6).map((p) => p.url);

const gamePhotos: Record<string, string[]> = {
  ml: photos.slice(0, 3).map((p) => p.url),
  ff: photos.slice(3, 6).map((p) => p.url),
  roblox: photos.slice(6, 8).map((p) => p.url),
};

const STORY_FRAMES = photos.slice(0, 10);

const PRIVATE_PASSWORD = "malam123";

/* ================= UTILS ================= */
const playClick = () => {
  try {
    const a = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==");
    a.volume = 0.15;
    a.play().catch(() => {});
  } catch {}
};

/* ================= HOOKS ================= */
function useInView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, inView };
}

/* ================= MINI COMPONENTS ================= */
function Confetti() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[60]">
      {[...Array(28)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 20}%`,
            width: `${Math.random() * 6 + 4}px`,
            height: `${Math.random() * 4 + 2}px`,
            background: `hsl(${Math.random() * 360},85%,65%)`,
            borderRadius: "2px",
            animation: `confettiFall ${Math.random() * 2 + 2.2}s ease-out ${Math.random() * 0.4}s forwards`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
      <style>{`@keyframes confettiFall{0%{opacity:1;transform:translateY(0)rotate(0deg)}100%{opacity:0;transform:translateY(88vh)rotate(720deg)}}`}</style>
    </div>
  );
}
function FloatingHeart({ x, y }: { x: number; y: number }) {
  return (
    <div className="fixed pointer-events-none z-[65] text-[26px]" style={{ left: x, top: y, animation: "heartFloat .9s ease-out forwards" }}>
      ❤️
      <style>{`@keyframes heartFloat{0%{opacity:1;transform:translateY(0)scale(1)}100%{opacity:0;transform:translateY(-48px)scale(1.5)}}`}</style>
    </div>
  );
}
function Typewriter({ text, speed = 42 }: { text: string; speed?: number }) {
  const [d, setD] = useState("");
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      setD(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(t);
    }, speed);
    return () => clearInterval(t);
  }, [text, speed]);
  return (
    <span>
      {d}
      <span className="animate-pulse opacity-60">|</span>
    </span>
  );
}
function CursorGlow() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const m = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVis(true);
    };
    const l = () => setVis(false);
    window.addEventListener("mousemove", m);
    window.addEventListener("mouseleave", l);
    return () => {
      window.removeEventListener("mousemove", m);
      window.removeEventListener("mouseleave", l);
    };
  }, []);
  return (
    <div
      className="fixed pointer-events-none z-[70] transition-opacity duration-200 mix-blend-screen"
      style={{
        left: pos.x - 12,
        top: pos.y - 12,
        width: 24,
        height: 24,
        borderRadius: "50%",
        background: "rgba(120,255,220,0.7)",
        boxShadow: "0 0 28px 10px rgba(80,255,200,0.55)",
        opacity: vis ? 1 : 0,
      }}
    />
  );
}
function Particles() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-5 overflow-hidden opacity-30">
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${i * 13 % 100}%`,
            top: `${(i * 27) % 100}%`,
            width: 2,
            height: 2,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.35)",
            animation: `particleFloat ${4 + (i % 3)}s ease-in-out infinite alternate`,
            animationDelay: `${i * 0.3}s`,
          }}
        />
      ))}
      <style>{`@keyframes particleFloat{from{transform:translateY(0);opacity:.2}to{transform:translateY(-18px);opacity:.6}}`}</style>
    </div>
  );
}

/* ================= GAMES FROM SECOND CODE ================= */
function FlappyCanvasGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gs = useRef({
    catY: 250,
    catVel: 0,
    pipes: [] as { x: number; top: number; passed: boolean }[],
    score: 0,
    high: parseInt(localStorage.getItem("flappyHigh") || "0"),
    go: false,
    start: false,
    speed: 2.5,
  });
  const anim = useRef(0);
  const [score, setScore] = useState(0);
  const [go, setGo] = useState(false);
  const [high, setHigh] = useState(gs.current.high);
  const init = useCallback(() => {
    const s = gs.current;
    s.catY = 250;
    s.catVel = 0;
    s.pipes = [];
    s.score = 0;
    s.go = false;
    s.start = false;
    s.speed = 2.5;
    setScore(0);
    setGo(false);
  }, []);
  const loop = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const s = gs.current;
    const w = (c.width = c.clientWidth);
    const h = (c.height = c.clientHeight);
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#070a12";
    ctx.fillRect(0, 0, w, h);
    if (!s.start || s.go) {
      ctx.fillStyle = "white";
      ctx.font = "18px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(s.go ? "Game Over" : "Tap untuk mulai", w / 2, h / 2 - 20);
      ctx.fillText(`Skor: ${s.score}   High: ${s.high}`, w / 2, h / 2 + 20);
      anim.current = requestAnimationFrame(loop);
      return;
    }
    s.catVel += 0.5;
    s.catY += s.catVel;
    if (s.catY < 0) {
      s.catY = 0;
      s.catVel = 0;
    }
    if (s.catY > h - 30) {
      s.go = true;
      setGo(true);
      if (s.score > s.high) {
        s.high = s.score;
        localStorage.setItem("flappyHigh", String(s.high));
        setHigh(s.high);
      }
    }
    if ((anim.current as any) % 100 === 0 || s.pipes.length === 0)
      s.pipes.push({ x: w, top: Math.random() * (h - 180) + 40, passed: false });
    s.pipes = s.pipes.filter((p) => {
      p.x -= s.speed;
      if (!p.passed && p.x + 50 < 80) {
        p.passed = true;
        s.score++;
        setScore(s.score);
        if (s.score % 5 === 0) s.speed += 0.4;
      }
      if (80 + 30 > p.x && 80 < p.x + 50 && (s.catY < p.top || s.catY + 30 > p.top + 140)) {
        s.go = true;
        setGo(true);
        if (s.score > s.high) {
          s.high = s.score;
          localStorage.setItem("flappyHigh", String(s.high));
          setHigh(s.high);
        }
      }
      return p.x > -50;
    });
    ctx.fillStyle = "#22c55e";
    s.pipes.forEach((p) => {
      ctx.fillRect(p.x, 0, 50, p.top);
      ctx.fillRect(p.x, p.top + 140, 50, h - p.top - 140);
    });
    ctx.font = "30px Arial";
    ctx.fillText("🐱", 80, s.catY + 28);
    ctx.fillStyle = "white";
    ctx.font = "bold 24px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(String(s.score), w / 2, 40);
    anim.current = requestAnimationFrame(loop);
  }, []);
  useEffect(() => {
    anim.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(anim.current);
  }, [loop]);
  const tap = () => {
    if (!gs.current.start || gs.current.go) {
      if (gs.current.go) init();
      gs.current.start = true;
      gs.current.catVel = -8;
    } else gs.current.catVel = -8;
  };
  return (
    <div className="flex flex-col items-center justify-center h-full w-full relative pt-16" onClick={tap} onTouchStart={(e) => { e.preventDefault(); tap(); }}>
      <div className="text-xs tracking-[0.3em] text-white/30 mb-3">{go ? `HIGH ${high}` : `FLAPPY MALAM • ${score}`}</div>
      <canvas ref={canvasRef} className="w-full max-w-[400px] h-[62vh] rounded-[28px] border border-white/10 shadow-2xl" style={{ touchAction: "none" }} />
      <p className="text-[10px] text-white/30 mt-4 tracking-widest uppercase">tap / click untuk loncat</p>
    </div>
  );
}
function AvoidGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gs = useRef({ catX: 150, balls: [] as { x: number; y: number; r: number }[], score: 0, high: parseInt(localStorage.getItem("avoidHigh") || "0"), go: false, start: false });
  const anim = useRef(0);
  const [score, setScore] = useState(0);
  const [go, setGo] = useState(false);
  const [high, setHigh] = useState(gs.current.high);
  // @ts-ignore
  const _init = useCallback(() => {
    const s = gs.current;
    s.catX = 150;
    s.balls = [];
    s.score = 0;
    s.go = false;
    s.start = false;
    setScore(0);
    setGo(false);
  }, []);
  const loop = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const s = gs.current;
    const w = (c.width = c.clientWidth);
    const h = (c.height = c.clientHeight);
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#070a12";
    ctx.fillRect(0, 0, w, h);
    if (!s.start || s.go) {
      ctx.fillStyle = "white";
      ctx.font = "16px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(s.go ? "Game Over" : "Geser kucing untuk mulai", w / 2, h / 2 - 20);
      ctx.fillText(`Skor: ${s.score}   High: ${s.high}`, w / 2, h / 2 + 20);
      anim.current = requestAnimationFrame(loop);
      return;
    }
    if (Math.random() < 0.04) s.balls.push({ x: Math.random() * w, y: -10, r: 8 + Math.random() * 8 });
    s.balls = s.balls.filter((b) => {
      b.y += 4.5;
      if (Math.hypot(b.x - s.catX, b.y - (h - 40)) < b.r + 20) {
        s.go = true;
        setGo(true);
        if (s.score > s.high) {
          s.high = s.score;
          localStorage.setItem("avoidHigh", String(s.high));
          setHigh(s.high);
        }
        return false;
      }
      if (b.y > h + 10) {
        s.score++;
        setScore(s.score);
        return false;
      }
      return true;
    });
    ctx.fillStyle = "#ef4444";
    s.balls.forEach((b) => {
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.font = "36px Arial";
    ctx.fillText("🐱", s.catX - 18, h - 20);
    ctx.fillStyle = "white";
    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(String(s.score), w / 2, 30);
    anim.current = requestAnimationFrame(loop);
  }, []);
  useEffect(() => {
    anim.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(anim.current);
  }, [loop]);
  const move = (cx: number) => {
    const c = canvasRef.current;
    if (!c) return;
    const r = c.getBoundingClientRect();
    gs.current.catX = Math.max(30, Math.min(cx - r.left, r.width - 30));
    if (!gs.current.start) {
      gs.current.start = true;
    }
  };
  return (
    <div className="flex flex-col items-center justify-center h-full w-full relative pt-16" onMouseMove={(e) => move(e.clientX)} onTouchMove={(e) => { e.preventDefault(); move(e.touches[0].clientX); }} onTouchStart={(e) => { e.preventDefault(); move(e.touches[0].clientX); }}>
      <div className="text-xs tracking-[0.3em] text-white/30 mb-3">{go ? `BEST ${high}` : `HINDAR • ${score}`}</div>
      <canvas ref={canvasRef} className="w-full max-w-[400px] h-[62vh] rounded-[28px] border border-white/10 shadow-2xl" style={{ touchAction: "none" }} />
    </div>
  );
}
function GuessGame() {
  const [target, setTarget] = useState(() => Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState("");
  const [hint, setHint] = useState("Tebak angka 1–100, mode malam");
  const [attempts, setAttempts] = useState(0);
  const [won, setWon] = useState(false);
  const submit = () => {
    const n = parseInt(guess);
    if (isNaN(n)) return setHint("Masukkan angka valid!");
    setAttempts((p) => p + 1);
    if (n === target) {
      setHint(`🎉 Betul! Angkanya ${target}.`);
      setWon(true);
      if (!localStorage.getItem("tebakBest") || attempts < parseInt(localStorage.getItem("tebakBest") || "999")) localStorage.setItem("tebakBest", String(attempts));
    } else if (n < target) setHint("📈 Ketinggian, naik lagi!");
    else setHint("📉 Turunin dikit!");
    setGuess("");
  };
  const restart = () => {
    setTarget(Math.floor(Math.random() * 100) + 1);
    setGuess("");
    setHint("Tebak angka 1–100, mode malam");
    setAttempts(0);
    setWon(false);
  };
  return (
    <div className="flex flex-col items-center justify-center h-full w-full max-w-md mx-auto gap-6 pt-20">
      <div className="glass-card p-8 text-center w-full border-white/10">
        <div className="text-5xl mb-4">🎯</div>
        <div className="text-xl font-black tracking-tight shimmer-text mb-3">TEBAK MALAM</div>
        <p className="text-white/50 text-sm mb-5">{hint}</p>
        <input type="number" value={guess} onChange={(e) => setGuess(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} placeholder="1–100" disabled={won} className="w-full px-4 py-3 rounded-xl text-white text-center text-lg outline-none bg-white/[0.06] border border-white/10 mb-4" />
        {!won ? <button onClick={submit} className="py-3 px-6 rounded-full btn-shimmer text-xs font-black tracking-[0.2em] uppercase w-full bg-white text-black">Tebak</button> : <button onClick={restart} className="py-3 px-6 rounded-full text-xs font-black tracking-widest w-full bg-white text-black">Main Lagi</button>}
        <p className="text-white/30 text-[10px] mt-4 tracking-[0.3em] uppercase">Percobaan: {attempts}</p>
      </div>
    </div>
  );
}
function MemoryGame() {
  const emojis = ["🌙", "🌃", "✨", "☕", "🌌", "💿", "🌟", "🕯️"];
  const [cards, setCards] = useState<{ emoji: string; flipped: boolean; matched: boolean }[]>(() => [...emojis, ...emojis].sort(() => Math.random() - 0.5).map((e) => ({ emoji: e, flipped: false, matched: false })));
  const [opened, setOpened] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const flip = (i: number) => {
    if (locked || cards[i].flipped || cards[i].matched) return;
    const nc = [...cards];
    nc[i].flipped = true;
    setCards(nc);
    const no = [...opened, i];
    setOpened(no);
    if (no.length === 2) {
      setLocked(true);
      setMoves((m) => m + 1);
      const [a, b] = no;
      if (cards[a].emoji === cards[b].emoji) setTimeout(() => { const mc = [...cards]; mc[a].matched = true; mc[b].matched = true; setCards(mc); setOpened([]); setLocked(false); }, 500);
      else setTimeout(() => { const fc = [...cards]; fc[a].flipped = false; fc[b].flipped = false; setCards(fc); setOpened([]); setLocked(false); }, 800);
    }
  };
  const restart = () => { setCards([...emojis, ...emojis].sort(() => Math.random() - 0.5).map((e) => ({ emoji: e, flipped: false, matched: false }))); setOpened([]); setMoves(0); setLocked(false); };
  return (
    <div className="flex flex-col items-center justify-center h-full w-full max-w-md mx-auto gap-6 pt-16">
      <div className="grid grid-cols-4 gap-3 w-full">{cards.map((c, i) => <button key={i} onClick={() => flip(i)} className={`aspect-square rounded-2xl text-3xl flex items-center justify-center transition-all border ${c.flipped || c.matched ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]" : "bg-white/5 border-white/10 text-white/40"}`}>{c.flipped || c.matched ? c.emoji : "?"}</button>)}</div>
      <div className="flex justify-between w-full text-xs tracking-widest text-white/40 uppercase"><span>Langkah: {moves}</span><button onClick={restart} className="text-white">Ulangi</button></div>
    </div>
  );
}
function Leaderboard() {
  const flappy = parseInt(localStorage.getItem("flappyHigh") || "0");
  const hindar = parseInt(localStorage.getItem("avoidHigh") || "0");
  const tebak = parseInt(localStorage.getItem("tebakBest") || "999");
  return (
    <div className="flex flex-col items-center justify-center h-full w-full max-w-md mx-auto gap-6 pt-20">
      <div className="glass-card p-8 text-center w-full border-white/10">
        <h2 className="text-2xl font-black tracking-tight shimmer-text mb-6">🏆 MALAM BOARD</h2>
        <div className="space-y-4 text-left text-sm">
          <div className="flex justify-between bg-white/5 p-3 rounded-xl"><span>🐱 Flappy Malam</span><span className="text-white font-bold">{flappy}</span></div>
          <div className="flex justify-between bg-white/5 p-3 rounded-xl"><span>🐾 Hindar Lampu</span><span className="text-white font-bold">{hindar}</span></div>
          <div className="flex justify-between bg-white/5 p-3 rounded-xl"><span>🎯 Tebak (best)</span><span className="text-white font-bold">{tebak === 999 ? "-" : tebak}</span></div>
        </div>
      </div>
    </div>
  );
}
function QRGenerator() {
  const url = typeof window !== "undefined" ? window.location.href : "";
  return (
    <div className="flex flex-col items-center justify-center h-full w-full max-w-md mx-auto gap-6 pt-20">
      <div className="glass-card p-8 text-center w-full border-white/10">
        <h2 className="text-xl font-black tracking-tight shimmer-text mb-2">SHARE MALAM</h2>
        <p className="text-white/40 text-xs tracking-widest uppercase mb-5">Scan untuk buka arsip ini</p>
        <div className="bg-white p-3 rounded-2xl mx-auto w-fit"><img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`} alt="QR" className="rounded-xl" /></div>
        <p className="text-white/20 text-[10px] mt-4 break-all">{url}</p>
      </div>
    </div>
  );
}

/* ================= GALLERY ITEM ================= */
function GalleryItem({
  photo,
  index,
  big,
  isActive,
  rgb,
  onOpen,
  likeCount,
  onDoubleLike,
}: {
  photo: Photo;
  index: number;
  big: boolean;
  isActive: boolean;
  rgb: number;
  onOpen: (p: Photo) => void;
  likeCount: number;
  onDoubleLike: (e: any, key: string) => void;
}) {
  const { ref, inView } = useInView<HTMLButtonElement>();
  const frameAngle = (rgb + index * 47) % 360;
  const frameA = `hsl(${frameAngle}, 100%, 65%)`;
  const frameB = `hsl(${(frameAngle + 90) % 360}, 100%, 65%)`;
  const frameC = `hsl(${(frameAngle + 180) % 360}, 100%, 65%)`;
  const frameD = `hsl(${(frameAngle + 270) % 360}, 100%, 65%)`;
  const key = `gallery-${index}`;
  return (
    <button
      ref={ref}
      onClick={() => onOpen(photo)}
      onDoubleClick={(e) => onDoubleLike(e, key)}
      onTouchEnd={(e) => {
        const now = Date.now();
        const el = e.currentTarget as any;
        if (now - parseInt(el.dataset.lastTap || "0") < 300) onDoubleLike(e, key);
        el.dataset.lastTap = String(now);
      }}
      className={`group relative rounded-[20px] p-[2px] text-left ${big ? "col-span-2 row-span-2" : ""}`}
      style={{
        background: `conic-gradient(from ${frameAngle}deg, ${frameA}, ${frameB}, ${frameC}, ${frameD}, ${frameA})`,
        boxShadow: isActive ? `0 0 30px ${frameA}55, 0 0 60px ${frameC}30` : `0 0 18px ${frameA}18`,
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0) scale(1)" : "translateY(22px) scale(0.97)",
        transitionProperty: "opacity, transform, box-shadow",
        transitionDuration: "700ms",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        transitionDelay: inView ? `${(index % 4) * 70}ms` : "0ms",
      }}
    >
      <div className="relative overflow-hidden rounded-[18px] bg-[#09090b]">
        <div className="aspect-[4/5] overflow-hidden">
          <img src={photo.url} alt={`#${index}`} loading={index < 4 ? "eager" : "lazy"} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.08]" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <span className="text-[9px] font-black tracking-[0.25em] text-white/60 bg-black/40 backdrop-blur px-2 py-1 rounded-full border border-white/10">{String(index + 1).padStart(2, "0")}</span>
          {likeCount > 0 && <span className="text-[10px] bg-white text-black px-2 py-1 rounded-full font-bold">❤ {likeCount}</span>}
        </div>
        <div className="absolute bottom-3 right-3 text-[8px] text-white/20 tracking-widest uppercase">{photo.caption?.slice(0, 14)}</div>
      </div>
    </button>
  );
}

/* ================= MAIN APP ================= */
export default function App() {
  const [stage, setStage] = useState<"intro" | "loading" | "app">("intro");
  const [introOut, setIntroOut] = useState(false);
  const [lightning, setLightning] = useState(false);
  const [activeTab, setActiveTab] = useState<"home" | "gallery" | "random" | "story" | "game" | "private" | "about" | "flappy" | "hindari" | "tebak" | "memory" | "leaderboard" | "qr" | "love">("home");
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selected, setSelected] = useState<Photo | null>(null);
  const [rgb, setRgb] = useState(0);
  const [preview, setPreview] = useState<{ photos: string[]; index: number } | null>(null);
  const [lightboxVisible, setLightboxVisible] = useState(false);
  const [storyIdx, setStoryIdx] = useState(0);
  const [privateUnlocked, setPrivateUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordShake, setPasswordShake] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [likedPhotos, setLikedPhotos] = useState<Record<string, number>>({});
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [guestName, setGuestName] = useState("");
  const [guestMessage, setGuestMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiResponses, setAiResponses] = useState<{ model: string; answer: string }[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [time, setTime] = useState(new Date());
  const [loveRain, setLoveRain] = useState(false);
  const [coins, setCoins] = useState(() => parseInt(localStorage.getItem("fajrez_coins") || "0"));
  const [todayClaimed, setTodayClaimed] = useState(() => localStorage.getItem("fajrez_claim_date") === new Date().toDateString());
  const touchStartX = useRef<number | null>(null);

  // RGB anim
  useEffect(() => {
    let frame: number;
    const loop = () => {
      setRgb((v) => (v + 0.18) % 360);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, []);
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    const s = localStorage.getItem("fajrez_likes");
    if (s) setLikedPhotos(JSON.parse(s));
    const v = localStorage.getItem("fajrez_visited");
    if (!v) {
      localStorage.setItem("fajrez_visitors", String(parseInt(localStorage.getItem("fajrez_visitors") || "0") + 1));
      localStorage.setItem("fajrez_visited", "true");
    }
  }, []);
  useEffect(() => {
    return () => hearts.forEach((h) => setTimeout(() => setHearts((p) => p.filter((x) => x.id !== h.id)), 900));
  }, [hearts]);

  const color1 = `hsl(${rgb}, 100%, 65%)`;
  const color2 = `hsl(${(rgb + 110) % 360}, 100%, 65%)`;
  const color3 = `hsl(${(rgb + 200) % 360}, 100%, 65%)`;
  const activePhoto = photos[activeIndex];

  const getWIB = () => time.toLocaleTimeString("id-ID", { timeZone: "Asia/Jakarta", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
  const getWIBDate = () => time.toLocaleDateString("id-ID", { timeZone: "Asia/Jakarta", weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const getWIBHour = () => new Date(time.toLocaleString("en-US", { timeZone: "Asia/Jakarta" })).getHours();
  const greet = () => {
    const h = getWIBHour();
    if (h >= 5 && h < 11) return "Selamat pagi, malam masih nyisa ☀️";
    if (h >= 11 && h < 15) return "Selamat siang, jangan lupa tidur nanti 🌤️";
    if (h >= 15 && h < 18) return "Sore mulai gelap, kopi dulu? 🌅";
    return "Selamat malam, waktunya jujur 🌙";
  };
  const dailyQuote = (() => {
    const q = ["Dalam diam aku merakit rindu, hanya untukmu.", "Malam itu bukan gelap, tapi jeda untuk jadi jujur.", "Lampu kota kedip, tapi ceritamu tetap nyala.", "Jarak jauh, tapi spotify kita nyambung.", "Sunyi bukan kosong, cuma penuh hal yang nggak bisa diucapin siang."];
    return q[new Date().getDate() % q.length];
  })();

  const triggerLoveRain = () => { setLoveRain(true); setTimeout(() => setLoveRain(false), 4000); };
  const handleDoubleLike = (e: any, k: string) => {
    const x = e.touches ? e.touches[0]?.clientX ?? 150 : e.clientX;
    const y = e.touches ? e.touches[0]?.clientY ?? 150 : e.clientY;
    const id = Date.now();
    setHearts((p) => [...p, { id, x, y }]);
    setTimeout(() => setHearts((p) => p.filter((h) => h.id !== id)), 900);
    const c = (likedPhotos[k] || 0) + 1;
    const next = { ...likedPhotos, [k]: c };
    setLikedPhotos(next);
    localStorage.setItem("fajrez_likes", JSON.stringify(next));
    playClick();
  };
  const randomPhoto = () => {
    let next = Math.floor(Math.random() * photos.length);
    while (next === activeIndex && photos.length > 1) next = Math.floor(Math.random() * photos.length);
    setActiveIndex(next);
    setActiveTab("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
    playClick();
  };
  const openPhoto = (p: Photo) => {
    const idx = photos.findIndex((x) => x.public_id === p.public_id);
    setActiveIndex(idx >= 0 ? idx : 0);
    setSelected(p);
  };
  const nextPhoto = () => {
    const n = (activeIndex + 1) % photos.length;
    setActiveIndex(n);
    setSelected(photos[n]);
  };
  const prevPhoto = () => {
    const n = (activeIndex - 1 + photos.length) % photos.length;
    setActiveIndex(n);
    setSelected(photos[n]);
  };
  const enterApp = () => {
    playClick();
    setIntroOut(true);
    setTimeout(() => {
      setStage("loading");
      setTimeout(() => {
        setLightning(true);
        setTimeout(() => {
          setLightning(false);
          setStage("app");
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 2800);
        }, 700);
      }, 900);
    }, 500);
  };
  const openPreview = (p: string[], i: number) => { setPreview({ photos: p, index: i }); setTimeout(() => setLightboxVisible(true), 10); };
  const closePreview = () => { setLightboxVisible(false); setTimeout(() => setPreview(null), 250); };
  const swipePrev = () => { if (!preview) return; setPreview({ ...preview, index: (preview.index - 1 + preview.photos.length) % preview.photos.length }); };
  const swipeNext = () => { if (!preview) return; setPreview({ ...preview, index: (preview.index + 1) % preview.photos.length }); };
  const submitPassword = () => {
    if (passwordInput === PRIVATE_PASSWORD) {
      playClick(); setPrivateUnlocked(true); setPasswordError(false); setShowConfetti(true); setTimeout(() => setShowConfetti(false), 3000);
    } else { setPasswordError(true); setPasswordShake(true); setTimeout(() => setPasswordShake(false), 500); }
  };
  const claimDaily = () => { if (todayClaimed) return; const nc = coins + 10; setCoins(nc); localStorage.setItem("fajrez_coins", String(nc)); localStorage.setItem("fajrez_claim_date", new Date().toDateString()); setTodayClaimed(true); playClick(); triggerLoveRain(); };
  const sendGuestbook = async () => {
    if (!guestName.trim() || !guestMessage.trim()) return;
    setSending(true);
    setTimeout(() => { setSending(false); setGuestName(""); setGuestMessage(""); setShowConfetti(true); setTimeout(() => setShowConfetti(false), 2000); }, 900);
  };
  const askAI = () => {
    if (!aiQuestion.trim()) return;
    setAiLoading(true);
    const a = ["Malam itu jawabannya bukan logika, tapi perasaan yang kamu tahan siang ini.", "Kalau ditanya semesta, dia bilang: lanjutin. Karena cerita bagus jarang datang dua kali.", "Aku rasa kamu udah tau jawabannya. Cuma butuh lampu temaram buat ngaku."];
    const b = ["Sebagai Claude versi malam, aku lihat pertanyaanmu tulus. Tenang, yang baik akan stay.", "Hidup malam mengajarkan: yang ribut bukan harus diselesaikan sekarang, cukup ditemani."];
    const c2 = ["Yakin aja, vibes kamu đêm ini ✨ kuat banget.", "Lakuin yang bikin kamu senyum jam 2 pagi. Itu kompas paling jujur."];
    setTimeout(() => { setAiResponses([{ model: "ChatGPT Malam", answer: a[Math.floor(Math.random() * a.length)] }, { model: "Claude Senja", answer: b[Math.floor(Math.random() * b.length)] }, { model: "DeepMalam", answer: c2[Math.floor(Math.random() * c2.length)] }]); setAiLoading(false); setAiQuestion(""); }, 1300);
    playClick();
  };
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (!selected && !preview) return; if (e.key === "Escape") { setSelected(null); closePreview(); } if (e.key === "ArrowRight") { if (selected) nextPhoto(); if (preview) swipeNext(); } if (e.key === "ArrowLeft") { if (selected) prevPhoto(); if (preview) swipePrev(); } };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [selected, preview, activeIndex]);

  const visitorCount = parseInt(localStorage.getItem("fajrez_visitors") || "34", 10);

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen text-white relative overflow-x-hidden pb-[96px] selection:bg-white selection:text-black" style={{ background: "#050507" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;600;800;900&display=swap');
        *{font-family: "Geist", system-ui, sans-serif}
        .serif{font-family:"Instrument Serif", serif}
        @keyframes loadbar{from{width:0%}to{width:100%}}
        @keyframes fadeScaleIn{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)}}
        @keyframes slideUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes fadeOut{from{opacity:1;transform:scale(1)}to{opacity:0;transform:scale(1.06)}}
        @keyframes floatUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
        @keyframes glowPulse{0%,100%{opacity:.6}50%{opacity:1}}
        @keyframes borderShimmer{0%{border-color:rgba(255,255,255,.15);box-shadow:0 0 14px rgba(255,255,255,.07)}50%{border-color:rgba(255,255,255,.4);box-shadow:0 0 26px rgba(255,255,255,.15)}100%{border-color:rgba(255,255,255,.15);box-shadow:0 0 14px rgba(255,255,255,.07)}}
        @keyframes rgbBorderAnim{0%{filter:hue-rotate(0deg)}100%{filter:hue-rotate(360deg)}}
        @keyframes cardIn{from{opacity:0;transform:translateY(18px)scale(.98)}to{opacity:1;transform:translateY(0)scale(1)}}
        @keyframes shimmerText{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-7px)}40%{transform:translateX(7px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}
        @keyframes lockPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
        @keyframes lightningFlash{0%{opacity:1}10%{opacity:.9}20%{opacity:1}30%{opacity:.5}40%{opacity:.95}100%{opacity:0}}
        @keyframes tabFade{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes orbit{from{transform:rotate(0deg) translateX(130px) rotate(0deg)}to{transform:rotate(360deg) translateX(130px) rotate(-360deg)}}
        @keyframes loveFall{0%{transform:translateY(-10%) rotate(0deg) scale(.8);opacity:0}10%{opacity:1}100%{transform:translateY(110vh) rotate(360deg) scale(1.2);opacity:0}}
        .anim-fadescale{animation:fadeScaleIn .32s ease-out forwards}.intro-out{animation:fadeOut .6s ease-in forwards}
        .float-1{animation:floatUp .8s ease-out .1s both}.float-2{animation:floatUp .8s ease-out .32s both}.float-3{animation:floatUp .8s ease-out .58s both}
        .glow-text{animation:glowPulse 2.4s ease-in-out infinite}
        .btn-shimmer{animation:borderShimmer 2.8s ease-in-out infinite}
        .shimmer-text{background:linear-gradient(90deg,#fff 0%,#a5f3fc 25%,#fef08a 50%,#fbcfe8 75%,#fff 100%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:shimmerText 3.2s linear infinite}
        .rgb-border-anim{animation:rgbBorderAnim 4s linear infinite}
        .glass-card{background:rgba(255,255,255,0.055);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border:1px solid rgba(255,255,255,0.09);border-radius:1.6rem;box-shadow:0 10px 40px -12px rgba(0,0,0,.6)}
        .glass-nav{background:rgba(8,8,10,0.82);backdrop-filter:blur(22px);-webkit-backdrop-filter:blur(22px);border-top:1px solid rgba(255,255,255,0.08)}
        .random-card{position:relative;overflow:hidden;border-radius:1.8rem;transition:all .45s cubic-bezier(.16,1,.3,1);background:rgba(255,255,255,0.05);backdrop-filter:blur(10px);border:1.5px solid rgba(255,255,255,0.12)}
        .random-card:hover{transform:translateY(-8px) scale(1.03);box-shadow:0 24px 50px rgba(0,0,0,.5);border-color:rgba(255,255,255,0.22)}
        .random-card:active{transform:scale(.97)}
      `}</style>

      {/* AMBIENT */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -left-32 -top-32 h-[520px] w-[520px] rounded-full blur-[160px] opacity-[0.12]" style={{ background: color1 }} />
        <div className="absolute -right-32 top-[38%] h-[520px] w-[520px] rounded-full blur-[160px] opacity-[0.10]" style={{ background: color2 }} />
        <div className="absolute bottom-[-220px] left-[28%] h-[500px] w-[500px] rounded-full blur-[160px] opacity-[0.07]" style={{ background: color3 }} />
      </div>
      <Particles />
      {typeof window !== "undefined" && window.matchMedia("(pointer:fine)").matches && <CursorGlow />}
      {showConfetti && <Confetti />}
      {hearts.map((h) => <FloatingHeart key={h.id} x={h.x} y={h.y} />)}
      {/* orbit hearts */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center opacity-[0.22]">
        <div className="relative w-0 h-0">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute text-[22px]" style={{ animation: `orbit ${10 + i * 2}s linear infinite`, animationDelay: `${i * 0.6}s` }}>
              ❤️
            </div>
          ))}
        </div>
      </div>
      {/* love rain */}
      {loveRain && (
        <div className="fixed inset-0 pointer-events-none z-[80] overflow-hidden">
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="absolute text-red-400" style={{ left: `${Math.random() * 100}%`, top: "-10%", fontSize: `${16 + Math.random() * 22}px`, animation: `loveFall ${2.2 + Math.random() * 2}s linear ${Math.random() * 1}s forwards`, opacity: 0.7 + Math.random() * 0.3 }}>
              ❤️
            </div>
          ))}
        </div>
      )}
      {lightning && <div className="fixed inset-0 z-[100] pointer-events-none bg-white" style={{ background: `radial-gradient(circle at 30% 30%, white, ${color1} 35%, ${color2} 70%, transparent 85%)`, animation: "lightningFlash .75s ease-out forwards" }} />}

      {/* INTRO */}
      {stage === "intro" && (
        <div className={`fixed inset-0 z-[90] flex flex-col items-center justify-center bg-[#050507] ${introOut ? "intro-out" : ""}`} style={{ cursor: "auto" }}>
          <div className="absolute h-[380px] w-[380px] rounded-full blur-[110px] opacity-20" style={{ background: `linear-gradient(135deg, ${color1}, ${color2})` }} />
          <div className="relative text-center px-8">
            <p className="float-1 text-[10px] tracking-[0.6em] uppercase text-white/30">2026 / INDONESIA / ARCHIVE</p>
            <h1 className="float-2 mt-8 text-[15vw] sm:text-[9vw] font-black leading-[0.78] tracking-[-0.08em] serif italic" style={{ textShadow: `0 0 40px ${color1}40` }}>
              Info<br /><span className="not-italic font-black tracking-[-0.06em]" style={{ color: "white" }}>Malam.</span>
            </h1>
            <div className="float-2 mx-auto mt-8 h-px w-24" style={{ background: `linear-gradient(90deg, ${color1}, ${color2})` }} />
            <p className="float-3 mt-6 text-[10px] tracking-[0.45em] uppercase text-white/30">memories after dark • tap to enter</p>
            <button onClick={enterApp} className="float-3 mt-10 rounded-full px-9 py-4 text-[11px] font-black tracking-[0.25em] uppercase text-black transition hover:scale-105 active:scale-95" style={{ background: `linear-gradient(90deg, ${color1}, ${color2})`, boxShadow: `0 0 40px ${color1}30` }}>
              ✦ MASUK ARSIP ✦
            </button>
            <div className="mt-14 flex justify-center gap-2">{[...Array(3)].map((_, i) => <div key={i} className="h-1 w-1 rounded-full bg-white/20 animate-pulse" style={{ animationDelay: `${i * 300}ms` }} />)}</div>
          </div>
        </div>
      )}
      {stage === "loading" && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#050507]" style={{ animation: "fadeIn .35s ease-out" }}>
          <div className="text-center">
            <div className="text-[11px] tracking-[0.5em] uppercase text-white/30">loading malam</div>
            <div className="mt-4 text-3xl font-black tracking-tight shimmer-text serif text-4xl">Info Malam</div>
            <div className="mt-6 w-36 h-[2px] bg-white/10 rounded-full mx-auto overflow-hidden"><div className="h-full bg-white rounded-full" style={{ animation: "loadbar 1s ease-out forwards" }} /></div>
          </div>
        </div>
      )}

      {stage === "app" && (
        <>
          {/* TOP NAV */}
          <nav className="fixed left-0 right-0 top-0 z-40 px-4 py-3 sm:px-6">
            <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border bg-black/50 px-4 py-2.5 backdrop-blur-xl border-white/10">
              <div className="flex items-center gap-3">
                <div className="h-7 w-7 rounded-full grid place-items-center text-[11px] font-black bg-white text-black">IM</div>
                <span className="text-[11px] font-black tracking-[0.35em] uppercase text-white/80">Info Malam</span>
                <span className="hidden sm:inline-flex ml-2 h-2 w-2 animate-pulse rounded-full" style={{ background: color1, boxShadow: `0 0 12px ${color1}` }} />
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden md:block text-[9px] tracking-[0.3em] uppercase text-white/25">{getWIB()} WIB</span>
                <button onClick={randomPhoto} className="rounded-full bg-white text-black px-4 py-1.5 text-[10px] font-black tracking-widest uppercase hover:scale-105 transition">Random ↗</button>
              </div>
            </div>
          </nav>

          {/* MINI GAME TOP NAV */}
          {["flappy", "hindari", "tebak", "memory", "leaderboard", "qr"].includes(activeTab) && (
            <div className="fixed top-[62px] left-0 right-0 z-30 flex justify-center gap-2 py-3 px-4 glass-nav mx-4 rounded-full">
              {[{ tab: "game" as const, label: "Menu", icon: "🎮" }, { tab: "flappy" as const, label: "Flappy", icon: "🐱" }, { tab: "hindari" as const, label: "Hindar", icon: "🐾" }, { tab: "tebak" as const, label: "Tebak", icon: "🎯" }, { tab: "memory" as const, label: "Memory", icon: "🃏" }, { tab: "leaderboard" as const, label: "Board", icon: "🏆" }, { tab: "qr" as const, label: "QR", icon: "📱" }].map(({ tab, label, icon }) => (
                <button key={tab} onClick={() => { playClick(); if (tab === "game") { setActiveTab("game"); setSelectedGame(null); } else setActiveTab(tab); }} className={`px-3.5 py-2 rounded-full text-[11px] font-bold transition-all ${activeTab === tab ? "bg-white text-black shadow" : "bg-white/[0.06] text-white/50 hover:text-white"}`}>{icon} {label}</button>
              ))}
            </div>
          )}

          <main className="relative z-10">
            {/* HOME */}
            {activeTab === "home" && (
              <section className="relative min-h-[100svh] flex items-end overflow-hidden px-5 pb-10 pt-28 sm:px-8 lg:px-12" style={{ animation: "tabFade .5s ease-out" }}>
                <img src={activePhoto.url} alt="hero" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-black/55" />
                <div className="absolute inset-0 opacity-30" style={{ background: `linear-gradient(135deg, ${color1}aa, transparent 45%, ${color2}aa)` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-black/20 to-transparent" />
                <div className="relative mx-auto w-full max-w-7xl">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="h-2 w-2 animate-pulse rounded-full" style={{ background: color1, boxShadow: `0 0 14px ${color1}` }} />
                    <p className="text-[10px] font-bold tracking-[0.45em] uppercase text-white/50">LIVE ARCHIVE / {String(photos.length).padStart(2, "0")} CERITA</p>
                  </div>
                  <h1 className="text-[18vw] sm:text-[12vw] lg:text-[9.5rem] font-black leading-[0.78] tracking-[-0.09em] serif">
                    Malam<br />
                    <span className="text-white" style={{ textShadow: `0 0 18px ${color1}55, 0 0 40px ${color2}35` }}>Bersama.</span>
                  </h1>
                  <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-xl">
                      <p className="text-base leading-7 text-white/60 sm:text-lg">{greet()} — {activePhoto.caption}. Setiap foto ada jejaknya, setiap jeda ada ceritanya. Double tap untuk kasih ❤️, koleksi coin malam.</p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] tracking-widest uppercase text-white/40">{getWIBDate()} • WIB {getWIB()}</span>
                        <span className="rounded-full bg-white text-black px-3 py-1 text-[10px] font-black tracking-widest uppercase">{coins} COIN</span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setActiveTab("gallery")} className="rounded-full border border-white/15 bg-black/40 backdrop-blur px-7 py-4 text-xs font-black uppercase tracking-widest text-white/80 hover:text-white transition">Lihat Gallery</button>
                      <button onClick={randomPhoto} className="rounded-full px-7 py-4 text-xs font-black uppercase tracking-[0.2em] text-black transition hover:scale-105 active:scale-95" style={{ background: `linear-gradient(90deg, ${color1}, ${color2})`, boxShadow: `0 0 30px ${color1}30` }}>Foto Acak ↗</button>
                    </div>
                  </div>
                  <div className="mt-10 grid grid-cols-3 gap-3 max-w-md">
                    <div className="glass-card p-3 !rounded-2xl !bg-white/[0.04] flex flex-col"><span className="text-[10px] tracking-widest text-white/30 uppercase">Visitors</span><span className="text-xl font-black">{visitorCount}</span></div>
                    <div className="glass-card p-3 !rounded-2xl !bg-white/[0.04] flex flex-col"><span className="text-[10px] tracking-widest text-white/30 uppercase">Likes</span><span className="text-xl font-black">{Object.values(likedPhotos).reduce((a, b) => a + b, 0) || 0}</span></div>
                    <button onClick={triggerLoveRain} className="glass-card p-3 !rounded-2xl !bg-white text-black flex flex-col items-start hover:scale-105 transition"><span className="text-[10px] tracking-widest uppercase opacity-60">Hujan Cinta</span><span className="text-lg font-black">❤️ 3s</span></button>
                  </div>
                </div>
              </section>
            )}

            {/* GALLERY */}
            {activeTab === "gallery" && (
              <section className="px-5 py-24 sm:px-8 lg:px-12 lg:py-28" style={{ animation: "tabFade .45s ease-out" }}>
                <div className="mx-auto max-w-7xl">
                  <div className="mb-10 flex items-end justify-between">
                    <div>
                      <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/25">02 — GALLERY / RGB FRAME</p>
                      <h2 className="mt-4 text-5xl font-black tracking-[-0.06em] sm:text-7xl serif">Semua <br /><span style={{ color: color1, textShadow: `0 0 25px ${color1}35` }}>cerita.</span></h2>
                      <p className="mt-4 max-w-sm text-sm leading-6 text-white/40">Scroll pelan, foto muncul dengan fade. Tiap frame punya rotasi RGB beda. Double tap = like + hati terbang.</p>
                    </div>
                    <button onClick={randomPhoto} className="hidden sm:block rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 hover:text-white transition">Shuffle</button>
                  </div>
                  <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 sm:gap-7 lg:gap-8">
                    {photos.map((p, i) => (
                      <GalleryItem key={p.public_id} photo={p} index={i} big={i === 0} isActive={i === activeIndex} rgb={rgb} onOpen={openPhoto} likeCount={likedPhotos[`gallery-${i}`] || 0} onDoubleLike={handleDoubleLike} />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* RANDOM */}
            {activeTab === "random" && (
              <section className="px-5 py-24 sm:px-8 lg:px-12" style={{ animation: "tabFade .45s ease-out" }}>
                <div className="mx-auto max-w-6xl">
                  <div className="text-center mb-12">
                    <div className="text-6xl mb-4">🎲</div>
                    <h2 className="text-4xl font-black tracking-tight shimmer-text serif text-5xl">Foto Random</h2>
                    <p className="text-white/40 text-sm max-w-md mx-auto mt-3 leading-6">Koleksi kejutan malam. Tiap kartu scale saat hover, ada badge & glow. Tap untuk lightbox, double tap ❤️.</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
                    {randomPhotos.map((img, i) => {
                      const like = likedPhotos[`random-${i}`] || 0;
                      return (
                        <div key={i} className="random-card group cursor-pointer p-3" onClick={() => openPreview(randomPhotos, i)} onDoubleClick={(e) => handleDoubleLike(e, `random-${i}`)}>
                          <div className="relative overflow-hidden rounded-[24px] aspect-[4/5]">
                            <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                              <span className="text-white text-[10px] font-black tracking-widest uppercase bg-black/45 px-3 py-1.5 rounded-full backdrop-blur border border-white/10">✨ RANDOM #{i + 1}</span>
                              {like > 0 && <span className="bg-white text-black text-[11px] font-bold px-2.5 py-1 rounded-full">❤️ {like}</span>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="text-center mt-10"><button onClick={randomPhoto} className="rounded-full bg-white text-black px-7 py-3 text-xs font-black tracking-widest uppercase">Acak Hero Malam ↺</button></div>
                </div>
              </section>
            )}

            {/* STORY / WATCH */}
            {activeTab === "story" && (
              <section className="min-h-[100svh] pt-24 pb-10 px-4 flex flex-col items-center justify-center relative" style={{ animation: "tabFade .45s ease-out" }}>
                <div className="w-full max-w-[420px]">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-black tracking-[0.3em] uppercase text-white/40">Story Malam • {storyIdx + 1}/{STORY_FRAMES.length}</h3>
                    <div className="flex gap-1">{STORY_FRAMES.map((_, i) => <div key={i} className="h-[3px] w-6 rounded-full transition-all" style={{ background: i === storyIdx ? "white" : "rgba(255,255,255,0.18)", width: i === storyIdx ? 28 : 12 }} />)}</div>
                  </div>
                  <div className="relative rounded-[28px] overflow-hidden border border-white/10 shadow-2xl aspect-[9/16] bg-black group">
                    <img src={STORY_FRAMES[storyIdx].url} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/10"><div className="h-full bg-white transition-all duration-300" style={{ width: `${((storyIdx + 1) / STORY_FRAMES.length) * 100}%` }} /></div>
                    <div className="absolute top-4 left-4 flex items-center gap-2"><div className="h-8 w-8 rounded-full overflow-hidden border border-white/20"><img src={photos[0].url} className="h-full w-full object-cover" /></div><span className="text-xs font-bold tracking-widest">infomalam.archive</span><span className="h-1 w-1 rounded-full bg-white/40" /><span className="text-[10px] text-white/50">2j lalu</span></div>
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <p className="text-sm leading-6 text-white/90">{STORY_FRAMES[storyIdx].caption}</p>
                      <div className="mt-4 flex gap-2"><button onClick={() => handleDoubleLike({ clientX: 200, clientY: 400 } as any, `story-${storyIdx}`)} className="rounded-full bg-white/10 backdrop-blur border border-white/10 px-4 py-2 text-xs">❤️ {likedPhotos[`story-${storyIdx}`] || 0}</button><button onClick={() => openPreview(STORY_FRAMES.map((s) => s.url), storyIdx)} className="rounded-full bg-white text-black px-4 py-2 text-xs font-bold">Buka HD</button></div>
                    </div>
                    <button onClick={() => setStoryIdx((i) => (i - 1 + STORY_FRAMES.length) % STORY_FRAMES.length)} className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 grid place-items-center rounded-full bg-black/40 backdrop-blur border border-white/10">‹</button>
                    <button onClick={() => setStoryIdx((i) => (i + 1) % STORY_FRAMES.length)} className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 grid place-items-center rounded-full bg-black/40 backdrop-blur border border-white/10">›</button>
                    <div className="absolute inset-0 flex"><div className="flex-1" onClick={() => setStoryIdx((i) => (i - 1 + STORY_FRAMES.length) % STORY_FRAMES.length)} /><div className="flex-1" onClick={() => setStoryIdx((i) => (i + 1) % STORY_FRAMES.length)} /></div>
                  </div>
                  <div className="mt-6 flex justify-center"><button onClick={() => setActiveTab("gallery")} className="text-[11px] tracking-[0.3em] uppercase text-white/30 hover:text-white transition">— lihat semua gallery —</button></div>
                </div>
              </section>
            )}

            {/* GAME */}
            {activeTab === "game" && (
              <section className="px-5 py-24 sm:px-8 lg:px-12" style={{ animation: "tabFade .45s ease-out" }}>
                {!selectedGame ? (
                  <>
                    <div className="mx-auto max-w-6xl mb-10 text-center">
                      <div className="text-5xl mb-4">🎮</div>
                      <h2 className="text-4xl font-black serif shimmer-text">Malam Arcade</h2>
                      <p className="text-white/40 text-sm mt-2 tracking-wide">Pilih album atau main mini game malam. Dapat coin untuk buka fitur rahasia.</p>
                      <div className="mt-6 flex justify-center gap-2 flex-wrap">
                        {[{ k: "flappy", l: "Flappy 🐱" }, { k: "hindari", l: "Hindar 🐾" }, { k: "tebak", l: "Tebak 🎯" }, { k: "memory", l: "Memory 🌙" }, { k: "leaderboard", l: "Board 🏆" }, { k: "qr", l: "Share 📱" }].map((g) => (
                          <button key={g.k} onClick={() => setActiveTab(g.k as any)} className="rounded-full bg-white/[0.07] border border-white/10 px-4 py-2 text-xs font-bold hover:bg-white hover:text-black transition">{g.l}</button>
                        ))}
                      </div>
                    </div>
                    <div className="mx-auto max-w-6xl grid md:grid-cols-3 gap-5 mb-10">
                      {[{ id: "ml", label: "Neon City", glow: color1 }, { id: "ff", label: "Midnight Drive", glow: color2 }, { id: "roblox", label: "After Hours", glow: color3, full: true }].map((v, i) => (
                        <div key={i} className={`relative glass-card overflow-hidden group cursor-pointer ${v.full ? "md:col-span-3" : ""}`} style={{ aspectRatio: v.full ? "16/7" : "16/10" }} onClick={() => setSelectedGame(v.id)}>
                          <img src={photos[(i * 3) % photos.length].url} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition duration-700" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                          <div className="absolute bottom-0 left-0 p-5"><div className="text-xs tracking-[0.3em] uppercase text-white/50">{v.id} • ALBUM</div><div className="text-2xl font-black mt-1">{v.label}</div></div>
                          <div className="absolute top-4 right-4 h-3 w-3 rounded-full animate-pulse" style={{ background: v.glow, boxShadow: `0 0 12px ${v.glow}` }} />
                        </div>
                      ))}
                    </div>
                    <div className="mx-auto max-w-6xl grid grid-cols-3 gap-4">
                      {[{ key: "ml", label: "Neon" }, { key: "ff", label: "Drive" }, { key: "roblox", label: "After" }].map((g) => (
                        <div key={g.key} onClick={() => { playClick(); setSelectedGame(g.key); }} className="p-5 rounded-[18px] cursor-pointer text-sm font-black tracking-widest uppercase text-center glass-card hover:bg-white hover:text-black transition">{g.label}</div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div style={{ animation: "tabFade .4s ease-out" }}>
                    <button onClick={() => setSelectedGame(null)} className="mb-8 px-5 py-2 rounded-full text-xs bg-white text-black font-black tracking-widest uppercase">← Back</button>
                    <div className="mx-auto max-w-6xl grid grid-cols-2 md:grid-cols-3 gap-4">
                      {gamePhotos[selectedGame].map((img, i) => {
                        const key = `game-${selectedGame}-${i}`;
                        const like = likedPhotos[key] || 0;
                        return (
                          <div key={i} className="cursor-pointer rounded-2xl overflow-hidden relative p-[2px] rgb-border-anim" style={{ background: `linear-gradient(90deg, ${color1}, ${color2})` }} onClick={() => openPreview(gamePhotos[selectedGame!], i)} onDoubleClick={(e) => handleDoubleLike(e, key)}>
                            <div className="rounded-[14px] overflow-hidden bg-black relative">
                              <img src={img} className="w-full aspect-video object-cover" />
                              {like > 0 && <div className="absolute top-2 right-2 bg-white text-black rounded-full px-2 py-0.5 text-xs font-bold">❤️ {like}</div>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </section>
            )}

            {["flappy", "hindari", "tebak", "memory", "leaderboard", "qr"].includes(activeTab) && (
              <div className="min-h-[100svh]">
                {activeTab === "flappy" && <FlappyCanvasGame />}
                {activeTab === "hindari" && <AvoidGame />}
                {activeTab === "tebak" && <GuessGame />}
                {activeTab === "memory" && <MemoryGame />}
                {activeTab === "leaderboard" && <Leaderboard />}
                {activeTab === "qr" && <QRGenerator />}
              </div>
            )}

            {/* PRIVATE */}
            {activeTab === "private" && (
              <section className="px-6 py-28" style={{ animation: "tabFade .45s ease-out" }}>
                {!privateUnlocked ? (
                  <div className="max-w-sm mx-auto flex flex-col items-center gap-6 pt-10">
                    <div className="text-[56px]" style={{ animation: "lockPulse 2s ease-in-out infinite" }}>🔒</div>
                    <div className="text-center"><div className="text-2xl font-black tracking-tight shimmer-text serif">Private After Midnight</div><div className="text-sm text-white/40 mt-1">Enter password untuk buka arsip paling jujur</div><div className="mt-3 text-[10px] tracking-[0.3em] uppercase text-white/20">hint: malam123</div></div>
                    <div className={`w-full flex flex-col gap-3 ${passwordShake ? "shake" : ""}`}>
                      <input type="password" value={passwordInput} onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(false); }} onKeyDown={(e) => e.key === "Enter" && submitPassword()} placeholder="Password..." className="w-full px-4 py-3.5 rounded-2xl text-white text-center tracking-[0.2em] outline-none bg-white/[0.06] border border-white/10 text-sm" />
                      {passwordError && <div className="text-center text-xs text-red-400">Salah password. Coba lagi.</div>}
                      <button onClick={submitPassword} className="w-full py-3.5 rounded-full font-black text-[11px] tracking-[0.25em] uppercase btn-shimmer bg-white text-black">Unlock Archive</button>
                    </div>
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mt-2" />
                    <div className="glass-card w-full p-4 !rounded-2xl text-center text-xs text-white/40 leading-6">Private bukan untuk semua orang. Ini ruang buat cerita yang cuma mau dibaca jam 1–4 pagi.</div>
                  </div>
                ) : (
                  <div style={{ animation: "tabFade .4s ease-out" }}>
                    <div className="text-center mb-10"><div className="text-2xl font-black shimmer-text serif">Terbuka 🔓</div><p className="text-white/40 text-sm mt-2">Ini beberapa frame yang nggak aku publish di gallery umum.</p></div>
                    <div className="mx-auto max-w-5xl grid md:grid-cols-3 gap-6">
                      {photos.slice(8, 14).map((p, i) => (
                        <div key={i} className="rounded-[22px] overflow-hidden border border-white/10 bg-white/[0.04] p-2">
                          <img src={p.url} className="rounded-[16px] w-full aspect-[4/5] object-cover" />
                          <div className="p-3"><div className="text-xs font-bold">{p.caption}</div><div className="text-[10px] text-white/40 mt-1 tracking-widest uppercase">PRIVATE • {p.public_id}</div></div>
                        </div>
                      ))}
                    </div>
                    <div className="text-center mt-10 flex justify-center gap-3">
                      <button onClick={() => { setPrivateUnlocked(false); setPasswordInput(""); }} className="px-5 py-2 rounded-full text-xs bg-white/10 border border-white/10">🔒 Lock lagi</button>
                      <button onClick={triggerLoveRain} className="px-5 py-2 rounded-full text-xs bg-white text-black font-bold">Hujan Cinta ❤️</button>
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* ABOUT */}
            {activeTab === "about" && (
              <section className="px-6 py-24" style={{ animation: "tabFade .45s ease-out" }}>
                <div className="max-w-sm mx-auto flex flex-col items-center gap-6">
                  <div className="relative"><div className="w-28 h-28 rounded-full overflow-hidden border-2 border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.12)]"><img src={photos[2].url} className="w-full h-full object-cover" /></div><div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-black shadow-[0_0_10px_rgba(52,211,153,0.8)]" /></div>
                  <div className="text-center">
                    <div className="text-2xl font-black tracking-tight shimmer-text serif">Info Malam.</div>
                    <div className="text-sm italic text-white/50 mt-1 max-w-[280px]"><Typewriter text="living for the moments nobody else sees after 11PM." speed={36} /></div>
                  </div>
                  <div className="w-full glass-card p-4 text-center !bg-white/[0.04]">
                    <div className="text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">{greet()}</div>
                    <div className="text-4xl font-mono font-black tracking-[0.12em] shimmer-text">{getWIB()}</div>
                    <div className="text-[10px] mt-2 tracking-widest uppercase text-white/30">{getWIBDate()} • WIB • ARCHIVE V2</div>
                  </div>
                  <div className="w-full text-center px-2"><p className="italic text-sm leading-relaxed text-white/60">"{dailyQuote}"</p></div>
                  <div className="w-full glass-card p-4 text-center">
                    <div className="text-sm font-black tracking-wide shimmer-text uppercase text-xs">💰 Malam Rewards</div>
                    <p className="text-2xl font-black mt-1">{coins} coin</p>
                    <div className="flex gap-2 justify-center mt-3">
                      <button onClick={claimDaily} disabled={todayClaimed} className="py-2 px-4 rounded-full text-[10px] font-black tracking-widest uppercase bg-white text-black disabled:opacity-30 hover:scale-105 transition">{todayClaimed ? "Sudah klaim" : "Klaim +10"}</button>
                      <button onClick={() => { if (coins < 30) alert("Butuh 30 coin. Main game dulu!"); else { setCoins((c) => { const n = c - 30; localStorage.setItem("fajrez_coins", String(n)); return n; }); triggerLoveRain(); setShowConfetti(true); setTimeout(() => setShowConfetti(false), 2000); } }} className="py-2 px-4 rounded-full text-[10px] font-black tracking-widest uppercase bg-white/10 border border-white/10">Tukar 30 → Hujan ❤️</button>
                    </div>
                  </div>
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  <div className="w-full grid grid-cols-4 gap-3 text-center">
                    {[{ label: "Photos", value: photos.length }, { label: "Likes", value: Object.values(likedPhotos).reduce((a, b) => a + b, 0) || 0 }, { label: "Coin", value: coins }, { label: "Visit", value: visitorCount }].map((s) => (
                      <div key={s.label} className="rounded-2xl py-3 glass-card !bg-white/[0.04]"><div className="text-xl font-black">{s.value}</div><div className="text-[10px] mt-0.5 tracking-widest uppercase text-white/30">{s.label}</div></div>
                    ))}
                  </div>
                  {/* Guestbook */}
                  <div className="w-full glass-card p-4">
                    <div className="text-xs font-black tracking-widest uppercase text-center shimmer-text mb-3">Buku Tamu Malam</div>
                    <div className="flex flex-col gap-2">
                      <input placeholder="Nama malam kamu..." value={guestName} onChange={(e) => setGuestName(e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-sm outline-none placeholder:text-white/20" />
                      <textarea placeholder="Tulis sepatah dua patah..." value={guestMessage} onChange={(e) => setGuestMessage(e.target.value)} rows={2} className="w-full px-3 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-sm outline-none resize-none placeholder:text-white/20" />
                      <button onClick={sendGuestbook} disabled={sending} className="py-2.5 rounded-full text-[11px] font-black tracking-widest uppercase bg-white text-black hover:scale-[1.02] transition">{sending ? "Mengirim..." : "Kirim 💌"}</button>
                    </div>
                  </div>
                  {/* AI Battle */}
                  <div className="w-full glass-card p-4">
                    <div className="text-xs font-black tracking-widest uppercase text-center shimmer-text mb-3">🤖 AI Battle Malam</div>
                    <div className="flex flex-col gap-2">
                      <input placeholder="Tanya apa aja ttg malam..." value={aiQuestion} onChange={(e) => setAiQuestion(e.target.value)} onKeyDown={(e) => e.key === "Enter" && askAI()} className="w-full px-3 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-sm outline-none placeholder:text-white/20" />
                      <button onClick={askAI} disabled={aiLoading} className="py-2.5 rounded-full text-[11px] font-black tracking-widest uppercase bg-white text-black">{aiLoading ? "Berpikir..." : "Tanya AI Malam"}</button>
                    </div>
                    {aiResponses.length > 0 && <div className="mt-4 flex flex-col gap-3">{aiResponses.map((r) => <div key={r.model} className="p-3 rounded-xl bg-white/[0.05] border border-white/10"><div className="text-[10px] font-black tracking-widest uppercase text-white/50 mb-1">{r.model}</div><div className="text-xs leading-relaxed text-white/80">{r.answer}</div></div>)}</div>}
                  </div>
                  {/* Social */}
                  <div className="w-full flex flex-col gap-3">
                    <a href="#" className="flex items-center gap-4 p-4 rounded-2xl bg-white text-black">
                      <div className="text-lg">◉</div><div><div className="text-sm font-black">Info Malam Archive</div><div className="text-xs opacity-60">@infomalam.archive</div></div><div className="ml-auto">↗</div>
                    </a>
                    <div className="glass-card p-4 !rounded-2xl">
                      <div className="flex justify-between items-center"><span className="text-xs tracking-widest uppercase text-white/30">Featured</span><span className="text-[10px] px-2 py-1 rounded-full bg-white text-black font-bold">#{String(activeIndex + 1).padStart(2, "0")}</span></div>
                      <img src={activePhoto.url} className="mt-3 rounded-xl w-full aspect-video object-cover" />
                      <p className="text-xs text-white/50 mt-3 leading-5">{activePhoto.caption}</p>
                      <button onClick={() => setSelected(activePhoto)} className="mt-3 w-full py-3 rounded-full bg-white text-black text-xs font-black tracking-widest uppercase">Buka Fullscreen</button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* LOVE */}
            {activeTab === "love" && (
              <section className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center" style={{ animation: "tabFade .45s ease-out" }}>
                <div className="text-7xl animate-pulse">❤️</div>
                <h2 className="mt-6 text-5xl font-black serif shimmer-text">Untukmu</h2>
                <p className="text-white/40 text-sm mt-3 max-w-sm leading-6">Semua arsip ini pada akhirnya balik ke satu orang. Klik hujan cinta, biar malam ini nggak sepi-sepi amat.</p>
                <div className="mt-8 flex gap-3">
                  <button onClick={triggerLoveRain} className="px-7 py-3 rounded-full bg-white text-black text-xs font-black tracking-widest uppercase hover:scale-105 transition">🌧️ Hujan Cinta 4s</button>
                  <button onClick={() => { setShowConfetti(true); setTimeout(() => setShowConfetti(false), 2000); }} className="px-7 py-3 rounded-full border border-white/15 bg-white/5 text-xs font-black tracking-widest uppercase">Confetti ✨</button>
                </div>
                <div className="mt-12 glass-card p-6 max-w-sm">
                  <p className="text-sm leading-6 text-white/60 italic">"Kalau malam bisa ngomong, dia bakal bilang: terima kasih udah jaga cerita ini tetep hidup."</p>
                  <div className="mt-4 text-[10px] tracking-[0.3em] uppercase text-white/20">— Info Malam, 2026</div>
                </div>
              </section>
            )}

            {/* Featured strip on home bottom */}
            {activeTab === "home" && (
              <div className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 lg:px-12">
                <div className="mt-10 grid gap-4 grid-cols-2 sm:grid-cols-4">
                  {photos.slice(0, 4).map((p, i) => (
                    <button key={i} onClick={() => openPhoto(p)} className="group relative rounded-2xl overflow-hidden aspect-[4/3] border border-white/10">
                      <img src={p.url} className="h-full w-full object-cover group-hover:scale-110 transition duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <span className="absolute bottom-2 left-2 text-[10px] px-2 py-1 rounded-full bg-black/50 backdrop-blur border border-white/10 tracking-widest uppercase">0{i + 1}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </main>

          {/* LIGHTBOX FOR PHOTO (first code style) */}
          {selected && (
            <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/95 p-4 backdrop-blur-2xl" onClick={() => setSelected(null)}>
              <div className="absolute inset-0 opacity-[0.09]" style={{ background: `radial-gradient(circle at center, ${color1}, transparent 60%)` }} />
              <button onClick={() => setSelected(null)} className="absolute right-5 top-5 z-30 rounded-full border border-white/10 bg-black/60 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white/70 backdrop-blur-xl">Tutup ×</button>
              <button onClick={(e) => { e.stopPropagation(); prevPhoto(); }} className="absolute left-3 z-30 rounded-full border border-white/10 bg-black/60 px-4 py-3 text-xl text-white/70 backdrop-blur-xl hover:text-white sm:left-6">‹</button>
              <img src={selected.url} alt="fs" onClick={(e) => e.stopPropagation()} className="relative z-10 max-h-[84vh] max-w-[86vw] rounded-2xl border border-white/10 object-contain shadow-2xl" style={{ boxShadow: `0 0 80px ${color1}18` }} />
              <button onClick={(e) => { e.stopPropagation(); nextPhoto(); }} className="absolute right-3 z-30 rounded-full border border-white/10 bg-black/60 px-4 py-3 text-xl text-white/70 backdrop-blur-xl hover:text-white sm:right-6">›</button>
              {selected.caption && <div className="absolute bottom-20 left-1/2 z-30 -translate-x-1/2 max-w-[80vw] text-center text-sm text-white/60 bg-black/40 backdrop-blur px-4 py-2 rounded-full border border-white/10">{selected.caption}</div>}
              <div className="absolute bottom-6 left-1/2 z-30 -translate-x-1/2 rounded-full border border-white/10 bg-black/60 px-5 py-2 text-[10px] font-bold tracking-[0.3em] text-white/50 backdrop-blur-xl">{String(activeIndex + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}</div>
            </div>
          )}

          {/* PREVIEW LIGHTBOX (second code style) */}
          {preview && (
            <div className="fixed inset-0 z-[92] flex items-center justify-center" style={{ background: "rgba(0,0,0,0.96)", backdropFilter: "blur(20px)", opacity: lightboxVisible ? 1 : 0, transition: "opacity .25s ease" }} onClick={closePreview} onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }} onTouchEnd={(e) => { if (touchStartX.current === null) return; const diff = touchStartX.current - e.changedTouches[0].clientX; if (Math.abs(diff) > 50) diff > 0 ? swipeNext() : swipePrev(); touchStartX.current = null; }}>
              <button onClick={(e) => { e.stopPropagation(); swipePrev(); }} className="absolute left-3 z-10 text-2xl w-10 h-10 grid place-items-center rounded-full bg-white/10 border border-white/10 backdrop-blur">‹</button>
              <div className="relative inline-block max-w-[92vw] max-h-[84vh]" onClick={(e) => e.stopPropagation()}>
                <img key={preview.index} src={preview.photos[preview.index]} className="rounded-2xl max-h-[84vh] max-w-[92vw] object-contain shadow-2xl anim-fadescale border border-white/10" />
              </div>
              <button onClick={(e) => { e.stopPropagation(); swipeNext(); }} className="absolute right-3 z-10 text-2xl w-10 h-10 grid place-items-center rounded-full bg-white/10 border border-white/10 backdrop-blur">›</button>
              <div className="absolute bottom-6 flex gap-2">{preview.photos.map((_, i) => <div key={i} className="h-2 rounded-full transition-all" style={{ width: i === preview.index ? 22 : 8, background: i === preview.index ? "white" : "rgba(255,255,255,0.25)" }} />)}</div>
              <button onClick={closePreview} className="absolute top-4 right-4 w-10 h-10 grid place-items-center rounded-full bg-white/10 border border-white/10 backdrop-blur text-sm">✕</button>
            </div>
          )}

          {/* BOTTOM NAV - HYBRID */}
          <div className="fixed bottom-0 left-0 right-0 z-40 glass-nav px-1 py-2.5">
            <div className="mx-auto max-w-[720px] flex justify-around items-center">
              {[
                { tab: "home" as const, label: "MALAM", icon: "◉" },
                { tab: "gallery" as const, label: "GALLERY", icon: "▦" },
                { tab: "random" as const, label: "RANDOM", icon: "🎲" },
                { tab: "story" as const, label: "STORY", icon: "▶" },
              ].map(({ tab, label, icon }) => (
                <button
                  key={tab}
                  onClick={() => { playClick(); setActiveTab(tab); if (tab !== "game") setSelectedGame(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className={`flex flex-col items-center gap-1 px-2.5 py-2 rounded-2xl transition-all ${activeTab === tab ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.25)] scale-[1.06]" : "text-white/35 hover:text-white/70"}`}
                >
                  <span className="text-[14px] leading-none">{icon}</span>
                  <span className="text-[7px] font-black tracking-[0.12em]">{label}</span>
                  {activeTab === tab && <span className="h-1 w-1 rounded-full bg-black mt-0.5" />}
                </button>
              ))}
            </div>
            <div className="mx-auto mt-1 h-[3px] w-24 rounded-full bg-white/10" />
          </div>

          {/* FOOTER LINE */}
          <footer className="relative z-10 border-t border-white/5 py-6 text-center">
            <p className="text-[10px] tracking-[0.4em] uppercase text-white/20">Made from memories — Info Malam V2 • {new Date().getFullYear()} • {color1} • double tap anywhere ❤️</p>
          </footer>
        </>
      )}
    </div>
  );
}
