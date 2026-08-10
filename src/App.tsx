import { useEffect, useState } from "react";

type Photo = {
  title: string;
  place: string;
  year: string;
  description: string;
  url: string;
};

const photos: Photo[] = [
  {
    title: "Malam Bersama",
    place: "Indonesia",
    year: "2026",
    description:
      "Satu malam, banyak cerita. Momen sederhana yang akhirnya menjadi kenangan.",
    url: "/photos/teman-1.jpg",
  },
  {
    title: "After Dark",
    place: "Indonesia",
    year: "2026",
    description:
      "Ketika malam datang, cerita-cerita kecil mulai tercipta.",
    url: "/photos/teman-2.jpg",
  },
  {
    title: "Random Moment",
    place: "Indonesia",
    year: "2026",
    description:
      "Tidak direncanakan. Tidak sempurna. Justru itu yang membuatnya berkesan.",
    url: "/photos/teman-3.jpg",
  },
  {
    title: "Good People",
    place: "Indonesia",
    year: "2026",
    description:
      "Tempatnya mungkin biasa, tapi orang-orang di dalamnya membuat semuanya berbeda.",
    url: "/photos/teman-4.jpg",
  },
  {
    title: "One Night",
    place: "Indonesia",
    year: "2026",
    description:
      "Satu frame, banyak cerita yang mungkin tidak akan terulang lagi.",
    url: "/photos/teman-5.jpg",
  },
  {
    title: "Until Next Time",
    place: "Indonesia",
    year: "2026",
    description:
      "Malam selesai. Foto tersimpan. Ceritanya tetap tinggal.",
    url: "/photos/teman-6.jpg",
  },
];

export default function App() {
  const [active, setActive] = useState(0);
  const [intro, setIntro] = useState(true);
  const [lightbox, setLightbox] = useState(false);
  const [liked, setLiked] = useState(false);
  const [changing, setChanging] = useState(false);

  const current = photos[active];

  useEffect(() => {
    const timer = setTimeout(() => setIntro(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  const changePhoto = (index: number) => {
    if (index === active) return;

    setChanging(true);

    setTimeout(() => {
      setActive(index);
      setLiked(false);
      setChanging(false);
    }, 250);
  };

  const randomPhoto = () => {
    if (photos.length < 2) return;

    let next = active;

    while (next === active) {
      next = Math.floor(Math.random() * photos.length);
    }

    changePhoto(next);
  };

  const nextPhoto = () => {
    changePhoto((active + 1) % photos.length);
  };

  const previousPhoto = () => {
    changePhoto((active - 1 + photos.length) % photos.length);
  };

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: #070707;
        }

        .night-app {
          min-height: 100vh;
          overflow: hidden;
          background:
            radial-gradient(circle at 80% 10%, rgba(120, 80, 255, .10), transparent 28%),
            radial-gradient(circle at 10% 55%, rgba(255, 180, 60, .07), transparent 25%),
            #070707;
          color: #fff;
          font-family: Inter, Arial, sans-serif;
        }

        .intro {
          position: fixed;
          inset: 0;
          z-index: 999;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #070707;
          transition: opacity .7s ease, visibility .7s ease;
        }

        .intro.hide {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }

        .intro-inner {
          text-align: center;
          animation: introIn 1s ease;
        }

        .intro-logo {
          width: 58px;
          height: 58px;
          margin: 0 auto 24px;
          border: 1px solid rgba(255,255,255,.25);
          border-radius: 50%;
          display: grid;
          place-items: center;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: .2em;
        }

        .intro-small {
          color: rgba(255,255,255,.4);
          font-size: 9px;
          letter-spacing: .45em;
          text-transform: uppercase;
        }

        .intro-title {
          margin: 12px 0 0;
          font-size: clamp(42px, 12vw, 90px);
          line-height: .85;
          letter-spacing: -.08em;
          font-weight: 900;
        }

        @keyframes introIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero {
          position: relative;
          min-height: 100svh;
          isolation: isolate;
          display: flex;
          flex-direction: column;
        }

        .hero-image {
          position: absolute;
          inset: 0;
          z-index: -5;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          transform: scale(1.02);
          transition: opacity .4s ease, transform 1.2s ease;
        }

        .hero-image.changing {
          opacity: 0;
          transform: scale(1.07);
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          z-index: -4;
          background:
            linear-gradient(to bottom,
              rgba(0,0,0,.55) 0%,
              rgba(0,0,0,.08) 32%,
              rgba(0,0,0,.18) 55%,
              rgba(7,7,7,.96) 100%);
        }

        .hero-side {
          position: absolute;
          inset: 0;
          z-index: -3;
          background: linear-gradient(
            90deg,
            rgba(0,0,0,.6),
            transparent 55%
          );
        }

        .grain {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          opacity: .055;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        .navbar {
          position: relative;
          z-index: 10;
          width: 100%;
          padding: 22px 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          color: white;
          text-decoration: none;
        }

        .brand-icon {
          width: 36px;
          height: 36px;
          border: 1px solid rgba(255,255,255,.4);
          border-radius: 50%;
          display: grid;
          place-items: center;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .08em;
          backdrop-filter: blur(10px);
        }

        .brand-text {
          font-size: 10px;
          font-weight: 900;
          letter-spacing: .25em;
        }

        .brand-sub {
          margin-top: 2px;
          color: rgba(255,255,255,.4);
          font-size: 7px;
          letter-spacing: .25em;
          text-transform: uppercase;
        }

        .nav-pill {
          padding: 9px 14px;
          border: 1px solid rgba(255,255,255,.18);
          border-radius: 999px;
          background: rgba(0,0,0,.2);
          color: rgba(255,255,255,.8);
          font-size: 9px;
          font-weight: 800;
          letter-spacing: .18em;
          text-decoration: none;
          backdrop-filter: blur(14px);
        }

        .moon {
          position: absolute;
          z-index: 0;
          top: 105px;
          right: 9%;
          width: 65px;
          height: 65px;
          border-radius: 50%;
          background: rgba(255,255,255,.92);
          box-shadow:
            0 0 40px rgba(255,255,255,.2),
            0 0 100px rgba(150,120,255,.15);
        }

        .moon::after {
          content: "";
          position: absolute;
          top: -6px;
          left: 14px;
          width: 65px;
          height: 65px;
          border-radius: 50%;
          background: rgba(18,18,22,.85);
        }

        .hero-content {
          position: relative;
          z-index: 5;
          margin-top: auto;
          padding: 20px 22px 32px;
        }

        .eyebrow {
          display: flex;
          align-items: center;
          gap: 10px;
          color: rgba(255,255,255,.65);
          font-size: 9px;
          font-weight: 800;
          letter-spacing: .38em;
          text-transform: uppercase;
        }

        .eyebrow-line {
          width: 30px;
          height: 1px;
          background: rgba(255,255,255,.55);
        }

        .hero-title {
          max-width: 900px;
          margin: 16px 0 0;
          font-size: clamp(62px, 17vw, 175px);
          line-height: .76;
          letter-spacing: -.085em;
          font-weight: 900;
        }

        .hero-title span {
          display: block;
          color: rgba(255,255,255,.5);
        }

        .hero-description {
          max-width: 500px;
          margin-top: 22px;
          color: rgba(255,255,255,.72);
          font-size: 14px;
          line-height: 1.7;
        }

        .hero-actions {
          margin-top: 25px;
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
        }

        .action {
          border: 1px solid rgba(255,255,255,.22);
          border-radius: 999px;
          padding: 13px 18px;
          color: white;
          background: rgba(0,0,0,.22);
          backdrop-filter: blur(15px);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .18em;
          text-transform: uppercase;
          cursor: pointer;
          transition: .25s ease;
        }

        .action.primary {
          background: white;
          color: #080808;
          border-color: white;
        }

        .action:hover {
          transform: translateY(-2px);
          background: white;
          color: #080808;
        }

        .hero-bottom {
          margin-top: 30px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .counter {
          display: flex;
          align-items: center;
          gap: 9px;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: .2em;
        }

        .counter-muted {
          color: rgba(255,255,255,.35);
        }

        .progress {
          width: 65px;
          height: 1px;
          background: rgba(255,255,255,.22);
        }

        .progress-fill {
          height: 100%;
          background: white;
          transition: width .4s ease;
        }

        .scroll {
          color: rgba(255,255,255,.4);
          font-size: 8px;
          letter-spacing: .3em;
          text-transform: uppercase;
        }

        .floating-card {
          position: absolute;
          right: 22px;
          bottom: 32px;
          z-index: 6;
          width: 150px;
          padding: 12px;
          border: 1px solid rgba(255,255,255,.18);
          border-radius: 15px;
          background: rgba(10,10,10,.3);
          backdrop-filter: blur(18px);
        }

        .floating-card img {
          display: block;
          width: 100%;
          height: 90px;
          object-fit: cover;
          border-radius: 9px;
        }

        .floating-card p {
          margin: 9px 0 0;
          color: rgba(255,255,255,.6);
          font-size: 7px;
          letter-spacing: .2em;
          text-transform: uppercase;
        }

        .floating-card strong {
          display: block;
          margin-top: 4px;
          font-size: 11px;
        }

        .section {
          padding: 90px 22px;
        }

        .section-head {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 28px;
        }

        .label {
          color: rgba(255,255,255,.35);
          font-size: 8px;
          font-weight: 900;
          letter-spacing: .35em;
          text-transform: uppercase;
        }

        .section-title {
          margin: 10px 0 0;
          font-size: clamp(40px, 10vw, 85px);
          line-height: .9;
          letter-spacing: -.07em;
          font-weight: 900;
        }

        .featured {
          position: relative;
          overflow: hidden;
          height: min(72vh, 700px);
          border-radius: 18px;
          cursor: pointer;
        }

        .featured img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 1s ease;
        }

        .featured:hover img {
          transform: scale(1.04);
        }

        .featured-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(0,0,0,.85),
            transparent 60%
          );
        }

        .featured-info {
          position: absolute;
          left: 20px;
          right: 20px;
          bottom: 20px;
        }

        .featured-title {
          margin: 7px 0 0;
          font-size: clamp(30px, 7vw, 70px);
          line-height: .9;
          letter-spacing: -.06em;
          font-weight: 900;
        }

        .gallery {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          margin-top: 8px;
        }

        .thumb {
          position: relative;
          aspect-ratio: 1 / 1.2;
          overflow: hidden;
          border: 1px solid transparent;
          border-radius: 10px;
          background: #111;
          cursor: pointer;
          opacity: .55;
          transition: .3s ease;
        }

        .thumb.active {
          opacity: 1;
          border-color: rgba(255,255,255,.8);
        }

        .thumb:hover {
          opacity: 1;
        }

        .thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform .7s ease;
        }

        .thumb:hover img {
          transform: scale(1.08);
        }

        .thumb-number {
          position: absolute;
          left: 10px;
          bottom: 10px;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: .15em;
          text-shadow: 0 2px 10px black;
        }

        .story {
          display: grid;
          gap: 30px;
          max-width: 1100px;
          margin: auto;
        }

        .story-big {
          font-size: clamp(34px, 7vw, 72px);
          line-height: .95;
          letter-spacing: -.065em;
          font-weight: 900;
        }

        .story-text {
          max-width: 560px;
          color: rgba(255,255,255,.45);
          font-size: 15px;
          line-height: 1.9;
        }

        .random-box {
          position: relative;
          overflow: hidden;
          padding: 80px 25px;
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 22px;
          text-align: center;
          background: #0d0d0f;
        }

        .random-glow {
          position: absolute;
          width: 250px;
          height: 250px;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          background: rgba(130,90,255,.15);
          filter: blur(80px);
          pointer-events: none;
        }

        .random-title {
          position: relative;
          font-size: clamp(48px, 12vw, 100px);
          line-height: .82;
          letter-spacing: -.08em;
          font-weight: 900;
        }

        .footer {
          padding: 40px 22px;
          border-top: 1px solid rgba(255,255,255,.08);
          display: flex;
          justify-content: space-between;
          gap: 20px;
          color: rgba(255,255,255,.3);
          font-size: 8px;
          letter-spacing: .25em;
          text-transform: uppercase;
        }

        .lightbox {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(0,0,0,.96);
        }

        .lightbox img {
          max-width: 92vw;
          max-height: 82vh;
          object-fit: contain;
          border-radius: 8px;
        }

        .close {
          position: absolute;
          top: 18px;
          right: 18px;
          width: 42px;
          height: 42px;
          border: 1px solid rgba(255,255,255,.2);
          border-radius: 50%;
          background: rgba(255,255,255,.05);
          color: white;
          font-size: 22px;
          cursor: pointer;
        }

        .light-arrow {
          position: absolute;
          top: 50%;
          width: 45px;
          height: 45px;
          border: 1px solid rgba(255,255,255,.2);
          border-radius: 50%;
          background: rgba(255,255,255,.05);
          color: white;
          cursor: pointer;
          transform: translateY(-50%);
        }

        .light-arrow.left {
          left: 15px;
        }

        .light-arrow.right {
          right: 15px;
        }

        .light-info {
          position: absolute;
          left: 20px;
          bottom: 20px;
          color: white;
        }

        .light-info small {
          color: rgba(255,255,255,.4);
          font-size: 8px;
          letter-spacing: .25em;
          text-transform: uppercase;
        }

        .light-info h3 {
          margin: 6px 0 0;
          font-size: 20px;
        }

        @media (min-width: 700px) {
          .navbar {
            padding: 28px 45px;
          }

          .hero-content {
            padding: 40px 45px 45px;
          }

          .moon {
            top: 125px;
            right: 13%;
            width: 85px;
            height: 85px;
          }

          .moon::after {
            width: 85px;
            height: 85px;
            left: 18px;
          }

          .floating-card {
            right: 45px;
            bottom: 45px;
          }

          .section {
            padding: 130px 45px;
          }

          .gallery {
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
          }

          .story {
            grid-template-columns: .8fr 1.2fr;
            align-items: center;
          }

          .footer {
            padding: 45px;
          }
        }

        @media (max-width: 600px) {
          .floating-card {
            display: none;
          }

          .scroll {
            display: none;
          }

          .hero-title {
            max-width: 100%;
          }

          .featured {
            height: 58svh;
          }

          .light-arrow {
            display: none;
          }
        }
      `}</style>

      <div className="night-app">

        {/* INTRO */}

        <div className={`intro ${!intro ? "hide" : ""}`}>
          <div className="intro-inner">
            <div className="intro-logo">IM</div>

            <div className="intro-small">
              A visual archive
            </div>

            <h1 className="intro-title">
              Info Malam
            </h1>
          </div>
        </div>

        {/* HERO */}

        <section className="hero">

          <img
            src={current.url}
            alt={current.title}
            className={`hero-image ${changing ? "changing" : ""}`}
          />

          <div className="hero-overlay" />
          <div className="hero-side" />
          <div className="grain" />

          <div className="moon" />

          {/* NAVBAR */}

          <nav className="navbar">

            <a href="#home" className="brand">

              <div className="brand-icon">
                IM
              </div>

              <div>
                <div className="brand-text">
                  INFO MALAM
                </div>

                <div className="brand-sub">
                  Visual archive
                </div>
              </div>

            </a>

            <a href="#gallery" className="nav-pill">
              Explore
            </a>

          </nav>

          {/* HERO CONTENT */}

          <div className="hero-content" id="home">

            <div className="eyebrow">
              <span className="eyebrow-line" />
              {current.year} / {current.place}
            </div>

            <h1 className="hero-title">
              {current.title.split(" ").slice(0, 1).join(" ")}
              <span>
                {current.title.split(" ").slice(1).join(" ") || "Night"}
              </span>
            </h1>

            <p className="hero-description">
              {current.description}
            </p>

            <div className="hero-actions">

              <button
                className="action primary"
                onClick={randomPhoto}
              >
                ✦ &nbsp; Random Foto
              </button>

              <button
                className="action"
                onClick={() => setLightbox(true)}
              >
                ↗ &nbsp; Lihat Foto
              </button>

              <button
                className="action"
                onClick={() => setLiked(!liked)}
              >
                {liked ? "♥" : "♡"} &nbsp;
                {liked ? "Liked" : "Like"}
              </button>

            </div>

            <div className="hero-bottom">

              <div className="counter">

                <span>
                  {String(active + 1).padStart(2, "0")}
                </span>

                <div className="progress">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${((active + 1) / photos.length) * 100}%`,
                    }}
                  />
                </div>

                <span className="counter-muted">
                  {String(photos.length).padStart(2, "0")}
                </span>

              </div>

              <div className="scroll">
                Scroll ↓
              </div>

            </div>

          </div>

          {/* FLOATING PREVIEW */}

          <div className="floating-card">

            <img
              src={photos[(active + 1) % photos.length].url}
              alt=""
            />

            <p>
              Next memory
            </p>

            <strong>
              {photos[(active + 1) % photos.length].title}
            </strong>

          </div>

        </section>

        {/* STORY */}

        <section className="section">

          <div className="story">

            <div>
              <div className="label">
                01 — The Story
              </div>

              <h2 className="story-big">
                Some nights
                <br />
                stay with us.
              </h2>
            </div>

            <div>

              <p className="story-text">
                Info Malam adalah tempat kecil untuk menyimpan
                momen-momen yang terjadi setelah matahari terbenam.
                Tidak perlu momen besar.
                Terkadang sebuah foto sederhana sudah cukup
                untuk mengingat satu malam.
              </p>

              <p className="story-text" style={{ marginTop: 20 }}>
                Scroll, pilih foto, atau tekan random dan biarkan
                malam memilih cerita untukmu.
              </p>

            </div>

          </div>

        </section>

        {/* GALLERY */}

        <section className="section" id="gallery">

          <div className="section-head">

            <div>
              <div className="label">
                02 — The Archive
              </div>

              <h2 className="section-title">
                Our Night.
              </h2>
            </div>

            <div className="label">
              {photos.length} memories
            </div>

          </div>

          {/* FEATURED */}

          <div
            className="featured"
            onClick={() => setLightbox(true)}
          >

            <img
              src={current.url}
              alt={current.title}
            />

            <div className="featured-gradient" />

            <div className="featured-info">

              <div className="label">
                Featured memory · {current.year}
              </div>

              <h3 className="featured-title">
                {current.title}
              </h3>

            </div>

          </div>

          {/* THUMBNAILS */}

          <div className="gallery">

            {photos.map((photo, index) => (

              <button
                key={photo.url}
                className={`thumb ${index === active ? "active" : ""}`}
                onClick={() => changePhoto(index)}
              >

                <img
                  src={photo.url}
                  alt={photo.title}
                  loading="lazy"
                />

                <span className="thumb-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

              </button>

            ))}

          </div>

        </section>

        {/* RANDOM */}

        <section className="section">

          <div className="random-box">

            <div className="random-glow" />

            <div className="label">
              03 — Random Memory
            </div>

            <h2 className="random-title">
              Let the
              <br />
              night choose.
            </h2>

            <p
              style={{
                position: "relative",
                maxWidth: 430,
                margin: "24px auto 0",
                color: "rgba(255,255,255,.42)",
                fontSize: 13,
                lineHeight: 1.8,
              }}
            >
              Tidak tahu foto mana yang ingin dilihat?
              Biarkan Info Malam memilihkan satu untukmu.
            </p>

            <button
              className="action primary"
              style={{
                position: "relative",
                marginTop: 25,
              }}
              onClick={randomPhoto}
            >
              ✦ &nbsp; Surprise Me
            </button>

          </div>

        </section>

        {/* FOOTER */}

        <footer className="footer">

          <span>
            Info Malam
          </span>

          <span>
            Memories after dark · 2026
          </span>

        </footer>

        {/* LIGHTBOX */}

        {lightbox && (

          <div
            className="lightbox"
            onClick={() => setLightbox(false)}
          >

            <button
              className="close"
              onClick={() => setLightbox(false)}
            >
              ×
            </button>

            <button
              className="light-arrow left"
              onClick={(e) => {
                e.stopPropagation();
                previousPhoto();
              }}
            >
              ←
            </button>

            <img
              src={current.url}
              alt={current.title}
              onClick={(e) => e.stopPropagation()}
            />

            <button
              className="light-arrow right"
              onClick={(e) => {
                e.stopPropagation();
                nextPhoto();
              }}
            >
              →
            </button>

            <div className="light-info">

              <small>
                {current.place} · {current.year}
              </small>

              <h3>
                {current.title}
              </h3>

            </div>

          </div>

        )}

      </div>
    </>
  );
}
