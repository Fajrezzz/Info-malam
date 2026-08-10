import { useEffect, useMemo, useState } from "react";

/* =========================================================
   CLOUDINARY
   ========================================================= */

const CLOUD_NAME = "dxkbvpaa1";

const photoIds = [
  "teman-01",
  "teman-02",
  "teman-03",
  "teman-04",
  "teman-05",
  "teman-06",
  "teman-07",
  "teman-08",
  "teman-09",
  "teman-10",
  "teman-11",
  "teman-12",
  "teman-13",
  "teman-14",
  "teman-15",
  "teman-16",
  "teman-17",
  "teman-18",
  "teman-19",
  "teman-20",
  "teman-21",
  "teman-22",
  "teman-23",
  "teman-24",
  "teman-25",
  "teman-26",
  "teman-27",
  "teman-28",
  "teman-29",
  "teman-30",
];

/*
  Semua foto harus berada di folder:

  info-malam/

  Contoh:
  info-malam/teman-01
  info-malam/teman-02
  info-malam/teman-03
*/

const cloudinaryUrl = (id: string) =>
  `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto,w_1800/info-malam/${id}`;

const photos = photoIds.map((id, index) => ({
  id,
  number: index + 1,
  url: cloudinaryUrl(id),
  title:
    index === 0
      ? "Malam Bersama"
      : index === 1
        ? "After Dark"
        : index === 2
          ? "Random Moment"
          : index === 3
            ? "Good People"
            : `Night Memory ${String(index + 1).padStart(2, "0")}`,
}));

/* =========================================================
   APP
   ========================================================= */

export default function App() {
  const [active, setActive] = useState(0);
  const [intro, setIntro] = useState(true);
  const [lightbox, setLightbox] = useState(false);
  const [liked, setLiked] = useState(false);
  const [changing, setChanging] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const current = photos[active];

  const nextPhotos = useMemo(() => {
    return [
      photos[(active + 1) % photos.length],
      photos[(active + 2) % photos.length],
      photos[(active + 3) % photos.length],
    ];
  }, [active]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIntro(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  const changePhoto = (index: number) => {
    if (index === active || changing) return;

    setChanging(true);
    setLoaded(false);

    setTimeout(() => {
      setActive(index);
      setLiked(false);

      setTimeout(() => {
        setChanging(false);
      }, 80);
    }, 220);
  };

  const randomPhoto = () => {
    if (photos.length <= 1) return;

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
          background: #060606;
          color: white;
          font-family: Inter, Arial, sans-serif;
        }

        button,
        a {
          -webkit-tap-highlight-color: transparent;
        }

        button {
          font-family: inherit;
        }

        /* =========================================
           APP
        ========================================= */

        .night-app {
          min-height: 100vh;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 80% 10%,
              rgba(130, 90, 255, .11),
              transparent 30%
            ),
            radial-gradient(
              circle at 10% 55%,
              rgba(255, 180, 60, .06),
              transparent 25%
            ),
            #060606;
        }

        /* =========================================
           INTRO
        ========================================= */

        .intro {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #060606;
          transition:
            opacity .7s ease,
            visibility .7s ease;
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
          width: 60px;
          height: 60px;
          margin: 0 auto 25px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255,255,255,.25);
          border-radius: 50%;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: .2em;
        }

        .intro-small {
          color: rgba(255,255,255,.38);
          font-size: 8px;
          letter-spacing: .45em;
          text-transform: uppercase;
        }

        .intro-title {
          margin: 12px 0 0;
          font-size: clamp(45px, 13vw, 95px);
          line-height: .8;
          letter-spacing: -.08em;
          font-weight: 900;
        }

        @keyframes introIn {
          from {
            opacity: 0;
            transform: translateY(25px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* =========================================
           HERO
        ========================================= */

        .hero {
          position: relative;
          min-height: 100svh;
          isolation: isolate;
          display: flex;
          flex-direction: column;
          overflow: hidden;
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
          opacity: 1;
          transition:
            opacity .45s ease,
            transform 1s ease;
        }

        .hero-image.changing {
          opacity: 0;
          transform: scale(1.08);
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          z-index: -4;
          background:
            linear-gradient(
              to bottom,
              rgba(0,0,0,.52),
              rgba(0,0,0,.08) 35%,
              rgba(0,0,0,.25) 60%,
              #060606 100%
            );
        }

        .hero-side {
          position: absolute;
          inset: 0;
          z-index: -3;
          background:
            linear-gradient(
              90deg,
              rgba(0,0,0,.65),
              transparent 65%
            );
        }

        /* =========================================
           GRAIN
        ========================================= */

        .grain {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
          opacity: .055;

          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        /* =========================================
           MOON
        ========================================= */

        .moon {
          position: absolute;
          z-index: 1;
          top: 115px;
          right: 10%;
          width: 65px;
          height: 65px;
          border-radius: 50%;
          background: rgba(255,255,255,.92);
          box-shadow:
            0 0 40px rgba(255,255,255,.18),
            0 0 100px rgba(140,110,255,.15);
        }

        .moon::after {
          content: "";
          position: absolute;
          top: -5px;
          left: 14px;
          width: 65px;
          height: 65px;
          border-radius: 50%;
          background: #161619;
        }

        /* =========================================
           NAV
        ========================================= */

        .navbar {
          position: relative;
          z-index: 10;
          padding: 22px;
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
          display: grid;
          place-items: center;
          border: 1px solid rgba(255,255,255,.35);
          border-radius: 50%;
          background: rgba(0,0,0,.15);
          backdrop-filter: blur(12px);
          font-size: 9px;
          font-weight: 900;
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
          border: 1px solid rgba(255,255,255,.2);
          border-radius: 999px;
          background: rgba(0,0,0,.2);
          color: white;
          text-decoration: none;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: .18em;
          text-transform: uppercase;
          backdrop-filter: blur(15px);
        }

        /* =========================================
           HERO CONTENT
        ========================================= */

        .hero-content {
          position: relative;
          z-index: 5;
          margin-top: auto;
          padding: 20px 22px 30px;
        }

        .eyebrow {
          display: flex;
          align-items: center;
          gap: 10px;
          color: rgba(255,255,255,.65);
          font-size: 8px;
          font-weight: 800;
          letter-spacing: .4em;
          text-transform: uppercase;
        }

        .eyebrow-line {
          width: 28px;
          height: 1px;
          background: rgba(255,255,255,.5);
        }

        .hero-title {
          max-width: 900px;
          margin: 16px 0 0;
          font-size: clamp(62px, 17vw, 170px);
          line-height: .76;
          letter-spacing: -.085em;
          font-weight: 900;
        }

        .hero-title span {
          display: block;
          color: rgba(255,255,255,.48);
        }

        .hero-description {
          max-width: 480px;
          margin-top: 22px;
          color: rgba(255,255,255,.72);
          font-size: 13px;
          line-height: 1.8;
        }

        /* =========================================
           BUTTONS
        ========================================= */

        .hero-actions {
          margin-top: 24px;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .action {
          border: 1px solid rgba(255,255,255,.22);
          border-radius: 999px;
          padding: 13px 17px;
          background: rgba(0,0,0,.22);
          color: white;
          backdrop-filter: blur(15px);
          font-size: 8px;
          font-weight: 900;
          letter-spacing: .18em;
          text-transform: uppercase;
          cursor: pointer;
          transition: .25s ease;
        }

        .action:hover {
          transform: translateY(-2px);
          background: white;
          color: #060606;
        }

        .action.primary {
          background: white;
          color: #060606;
          border-color: white;
        }

        /* =========================================
           COUNTER
        ========================================= */

        .hero-bottom {
          margin-top: 28px;
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
          color: rgba(255,255,255,.3);
        }

        .progress {
          width: 65px;
          height: 1px;
          background: rgba(255,255,255,.25);
        }

        .progress-fill {
          height: 100%;
          background: white;
          transition: width .4s ease;
        }

        .scroll {
          color: rgba(255,255,255,.35);
          font-size: 8px;
          letter-spacing: .3em;
          text-transform: uppercase;
        }

        /* =========================================
           FLOATING CARD
        ========================================= */

        .floating-card {
          position: absolute;
          right: 22px;
          bottom: 32px;
          z-index: 7;
          width: 145px;
          padding: 10px;
          border: 1px solid rgba(255,255,255,.18);
          border-radius: 15px;
          background: rgba(10,10,10,.35);
          backdrop-filter: blur(18px);
        }

        .floating-card img {
          width: 100%;
          height: 82px;
          display: block;
          border-radius: 9px;
          object-fit: cover;
        }

        .floating-label {
          margin-top: 8px;
          color: rgba(255,255,255,.4);
          font-size: 7px;
          letter-spacing: .2em;
          text-transform: uppercase;
        }

        .floating-title {
          margin-top: 4px;
          font-size: 10px;
          font-weight: 800;
        }

        /* =========================================
           SECTIONS
        ========================================= */

        .section {
          padding: 90px 22px;
        }

        .label {
          color: rgba(255,255,255,.32);
          font-size: 8px;
          font-weight: 900;
          letter-spacing: .35em;
          text-transform: uppercase;
        }

        .story {
          display: grid;
          gap: 30px;
          max-width: 1100px;
          margin: auto;
        }

        .story-title {
          margin-top: 12px;
          font-size: clamp(40px, 9vw, 80px);
          line-height: .9;
          letter-spacing: -.07em;
          font-weight: 900;
        }

        .story-text {
          max-width: 550px;
          color: rgba(255,255,255,.43);
          font-size: 14px;
          line-height: 1.9;
        }

        /* =========================================
           GALLERY
        ========================================= */

        .section-head {
          margin-bottom: 25px;
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 20px;
        }

        .section-title {
          margin-top: 10px;
          font-size: clamp(42px, 10vw, 90px);
          line-height: .85;
          letter-spacing: -.075em;
          font-weight: 900;
        }

        .featured {
          position: relative;
          height: min(70vh, 700px);
          overflow: hidden;
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
          background:
            linear-gradient(
              to top,
              rgba(0,0,0,.88),
              transparent 65%
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
          font-size: clamp(30px, 7vw, 75px);
          line-height: .9;
          letter-spacing: -.06em;
          font-weight: 900;
        }

        /* =========================================
           THUMBNAILS
        ========================================= */

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
          padding: 0;
          border: 1px solid transparent;
          border-radius: 10px;
          background: #111;
          cursor: pointer;
          opacity: .52;
          transition: .3s ease;
        }

        .thumb:hover,
        .thumb.active {
          opacity: 1;
        }

        .thumb.active {
          border-color: rgba(255,255,255,.85);
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
          color: white;
          font-size: 8px;
          font-weight: 900;
          text-shadow: 0 2px 10px black;
        }

        /* =========================================
           RANDOM
        ========================================= */

        .random-box {
          position: relative;
          overflow: hidden;
          padding: 80px 20px;
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 22px;
          text-align: center;
          background: #0c0c0e;
        }

        .random-glow {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 250px;
          height: 250px;
          transform: translate(-50%, -50%);
          background: rgba(130,90,255,.15);
          filter: blur(80px);
        }

        .random-title {
          position: relative;
          margin: 15px 0 0;
          font-size: clamp(50px, 12vw, 105px);
          line-height: .8;
          letter-spacing: -.08em;
          font-weight: 900;
        }

        .random-text {
          position: relative;
          max-width: 420px;
          margin: 25px auto;
          color: rgba(255,255,255,.4);
          font-size: 13px;
          line-height: 1.8;
        }

        /* =========================================
           FOOTER
        ========================================= */

        .footer {
          padding: 40px 22px;
          border-top: 1px solid rgba(255,255,255,.08);
          display: flex;
          justify-content: space-between;
          gap: 20px;
          color: rgba(255,255,255,.28);
          font-size: 8px;
          letter-spacing: .25em;
          text-transform: uppercase;
        }

        /* =========================================
           LIGHTBOX
        ========================================= */

        .lightbox {
          position: fixed;
          inset: 0;
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(0,0,0,.97);
        }

        .lightbox img {
          max-width: 94vw;
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
          width: 46px;
          height: 46px;
          border: 1px solid rgba(255,255,255,.2);
          border-radius: 50%;
          background: rgba(255,255,255,.05);
          color: white;
          cursor: pointer;
          transform: translateY(-50%);
        }

        .light-arrow.left {
          left: 18px;
        }

        .light-arrow.right {
          right: 18px;
        }

        .light-info {
          position: absolute;
          left: 20px;
          bottom: 20px;
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

        /* =========================================
           DESKTOP
        ========================================= */

        @media (min-width: 700px) {

          .navbar {
            padding: 28px 45px;
          }

          .hero-content {
            padding: 40px 45px 45px;
          }

          .moon {
            top: 130px;
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

          .story {
            grid-template-columns: .8fr 1.2fr;
            align-items: center;
          }

          .gallery {
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
          }

          .footer {
            padding: 45px;
          }
        }

        /* =========================================
           MOBILE
        ========================================= */

        @media (max-width: 600px) {

          .floating-card {
            display: none;
          }

          .scroll {
            display: none;
          }

          .hero-title {
            font-size: clamp(58px, 17vw, 95px);
          }

          .featured {
            height: 58svh;
          }

          .light-arrow {
            display: none;
          }

          .hero-description {
            font-size: 12px;
            max-width: 340px;
          }

        }

      `}</style>

      <div className="night-app">

        {/* =====================================
            INTRO
        ===================================== */}

        <div className={`intro ${!intro ? "hide" : ""}`}>
          <div className="intro-inner">

            <div className="intro-logo">
              IM
            </div>

            <div className="intro-small">
              A visual archive
            </div>

            <h1 className="intro-title">
              Info Malam
            </h1>

          </div>
        </div>

        {/* =====================================
            HERO
        ===================================== */}

        <section className="hero">

          <img
            src={current.url}
            alt={current.title}
            className={`hero-image ${changing ? "changing" : ""}`}
            onLoad={() => setLoaded(true)}
          />

          <div className="hero-overlay" />
          <div className="hero-side" />
          <div className="grain" />
          <div className="moon" />

          {/* NAV */}

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

              2026 / INDONESIA

            </div>

            <h1 className="hero-title">

              {current.title.split(" ")[0]}

              <span>
                {current.title
                  .split(" ")
                  .slice(1)
                  .join(" ") || "Night"}
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
                      width:
                        `${((active + 1) / photos.length) * 100}%`,
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

          {/* NEXT PHOTO */}

          {loaded && nextPhotos[0] && (

            <div className="floating-card">

              <img
                src={nextPhotos[0].url}
                alt=""
              />

              <div className="floating-label">
                Next memory
              </div>

              <div className="floating-title">
                {nextPhotos[0].title}
              </div>

            </div>

          )}

        </section>

        {/* =====================================
            STORY
        ===================================== */}

        <section className="section">

          <div className="story">

            <div>

              <div className="label">
                01 — The Story
              </div>

              <h2 className="story-title">
                Some nights
                <br />
                stay with us.
              </h2>

            </div>

            <div>

              <p className="story-text">
                Info Malam adalah tempat kecil untuk menyimpan
                momen-momen yang terjadi setelah matahari
                terbenam.
              </p>

              <p className="story-text">
                Tidak harus sempurna. Tidak harus direncanakan.
                Terkadang sebuah foto sederhana sudah cukup
                untuk mengingat satu malam.
              </p>

            </div>

          </div>

        </section>

        {/* =====================================
            GALLERY
        ===================================== */}

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
                Featured Memory
              </div>

              <h3 className="featured-title">
                {current.title}
              </h3>

            </div>

          </div>

          {/* ALL PHOTOS */}

          <div className="gallery">

            {photos.map((photo, index) => (

              <button
                key={photo.id}
                className={`thumb ${
                  index === active ? "active" : ""
                }`}
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

        {/* =====================================
            RANDOM
        ===================================== */}

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

            <p className="random-text">
              Tidak tahu foto mana yang ingin dilihat?
              Biarkan Info Malam memilihkan satu untukmu.
            </p>

            <button
              className="action primary"
              onClick={randomPhoto}
            >
              ✦ &nbsp; Surprise Me
            </button>

          </div>

        </section>

        {/* =====================================
            FOOTER
        ===================================== */}

        <footer className="footer">

          <span>
            Info Malam
          </span>

          <span>
            Memories after dark · 2026
          </span>

        </footer>

        {/* =====================================
            LIGHTBOX
        ===================================== */}

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
                Memory {String(active + 1).padStart(2, "0")}
                {" · "}
                2026
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
