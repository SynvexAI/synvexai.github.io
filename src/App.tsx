import { useEffect, useMemo, useRef, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import NewsPage from "./news";
import SiteFooter from "./SiteFooter";
import GDintPage from "./model/GDint";
import ChessAiPage from "./model/ChessAi";

const HERO_TEXT =
  "Мы создаём искусственный интеллект, чтобы технологии лучше работали для человека.";

function HeroTitle() {
  const nodes = useMemo(() => {
    const out: React.ReactNode[] = [];

    HERO_TEXT.split(" ").forEach((word, wi) => {
      const chars = word.split("").map((ch, ci) => {
        return (
          <span
            key={`${wi}-${ci}`}
            className="char"
          >
            {ch}
          </span>
        );
      });

      out.push(
        <span
          key={`w-${wi}`}
          className="word-wrapper"
        >
          {chars}
        </span>
      );

      out.push(<span key={`s-${wi}`}>{"\u00A0"}</span>);
    });

    return out;
  }, []);

  return <>{nodes}</>;
}

function ModelsShowcase() {
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  const models = [
    {
      title: "Mind",
      desc: "Наша самая мощная модель искусственного интеллекта для генерации текста и решения сложных задач.",
      iconSrc: "/icons/model/mind.svg",
      colorClass: "icon-text",
      badge: "Разр.",
      links: [{ label: "Try in Playground", url: "#" }],
      footerLink: "Learn more",
      footerLinkUrl: "#",
    },
    {
      title: "Think",
      desc: "Модель искусственного интеллекта, оптимизированная для логических рассуждений, анализа и пошагового решения задач.",
      iconSrc: "/icons/model/think.svg",
      colorClass: "icon-text",
      badge: "Разр.",
      links: [{ label: "Try in Playground", url: "#" }],
      footerLink: "Learn more",
      footerLinkUrl: "#",
    },
    {
      title: "Mind Image",
      desc: "Создавайте и редактируйте фотореалистичные изображения с помощью нашей генеративной модели.",
      iconSrc: "/icons/model/image.svg",
      colorClass: "icon-vision",
      badge: "Скоро",
      links: [{ label: "Try in Playground", url: "#" }],
      footerLink: "See capabilities",
      footerLinkUrl: "#",
    },
    {
      title: "Lume",
      desc: "Создавайте связные видеосцены по текстовому описанию с сохранением движения, стиля и визуальной логики.",
      iconSrc: "/icons/model/image.svg",
      colorClass: "icon-vision",
      badge: "Скоро",
      links: [{ label: "Try in Playground", url: "#" }],
      footerLink: "See capabilities",
      footerLinkUrl: "#",
    }
  ];

  return (
    <section className="models-section">
      <div className="container" data-aos="fade-up">
        <div className="models-grid">
          {models.map((m, i) => (
            <a
              href={m.links[0]?.url || "#"}
              key={i}
              className="model-card"
              onMouseMove={handleMouseMove}
              data-aos="fade-up"
              data-aos-delay={i * 100}
            >
              <div className="model-icon-box">
                <img
                  src={m.iconSrc}
                  alt={m.title}
                  className={`model-icon ${m.colorClass}`}
                />
                {m.badge && <span className="model-badge">{m.badge}</span>}
              </div>
              <h3 className="model-title">{m.title}</h3>
              <p className="model-desc">{m.desc}</p>

              <div className="model-actions">
                <span className="model-action-title">Try it in</span>
                <div className="model-links">
                  {m.links.map((l, li) => (
                    <span key={li} className="model-link">
                      {l.label} <i className="fas fa-chevron-right"></i>
                    </span>
                  ))}
                </div>
              </div>

              <a
                href={m.footerLinkUrl}
                className="model-footer-link"
                onClick={(e) => e.stopPropagation()}
              >
                {m.footerLink}
              </a>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}


function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const saved = localStorage.getItem("theme") as "dark" | "light" | null;
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  const heroParticlesRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    AOS.init({
      duration: 700,
      once: true,
      offset: 50,
      easing: "cubic-bezier(0.25, 0.8, 0.25, 1)",
    });
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const canvas = heroParticlesRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const canvasEl: HTMLCanvasElement = canvas;
    const ctx2d: CanvasRenderingContext2D = ctx;

    let rafId = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const prefersReduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    const isLight = document.documentElement.getAttribute("data-theme") === "light";

    const heroEl = canvasEl.closest(".hero") as HTMLElement | null;
    let pointerX = 0;
    let pointerY = 0;
    let pointerActive = false;
    let pointerTx = 0;
    let pointerTy = 0;

    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t;
    }

    const palette: Array<[number, number, number]> = isLight
      ? [
          [60, 100, 200],
          [100, 150, 255],
          [200, 220, 255],
        ]
      : [
          [20, 40, 100],
          [50, 90, 200],
          [100, 160, 255],
          [180, 210, 255],
          [0, 50, 150],
        ];

    function paletteAt(t: number) {
      const tt = ((t % 1) + 1) % 1;
      const scaled = tt * (palette.length - 1);
      const i = Math.floor(scaled);
      const f = scaled - i;
      const a = palette[i];
      const b = palette[Math.min(i + 1, palette.length - 1)];
      return [
        Math.round(lerp(a[0], b[0], f)),
        Math.round(lerp(a[1], b[1], f)),
        Math.round(lerp(a[2], b[2], f)),
      ] as [number, number, number];
    }

    function resize() {
      const rect = canvasEl.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvasEl.width = Math.floor(width * dpr);
      canvasEl.height = Math.floor(height * dpr);
      ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();

    const minDim = () => Math.min(width, height);
    // Shifted to the right side (0.75 of width) per user request/image
    const cx = () => width * 0.75;
    const cy = () => height * 0.5;

    type Dot = {
      baseAngle: number;
      dist: number; // 0..1 normalized distance
      size: number;
      speed: number;
      offset: number;
    };

    const dotCount = Math.round(
      Math.max(500, Math.min(1000, (width * height) / 1500))
    );
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    const dots: Dot[] = Array.from({ length: dotCount }, (_, i) => {
      // Phyllotaxis setup
      const distIdx = i / (dotCount - 1);
      const dist = Math.sqrt(distIdx);
      const angle = i * goldenAngle;

      const size = 1.0 + Math.random() * 2.0;
      const speed = 0.8 + Math.random() * 0.6;
      const offset = Math.random() * Math.PI * 2;

      return { baseAngle: angle, dist, size, speed, offset };
    });

    function onPointerMove(e: PointerEvent) {
      if (!heroEl) return;
      const rect = heroEl.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / Math.max(1, rect.width);
      const ny = (e.clientY - rect.top) / Math.max(1, rect.height);
      pointerX = (nx - 0.75) * 3;
      pointerY = (ny - 0.5) * 3;
      pointerActive = true;
    }

    function onPointerLeave() {
      pointerActive = false;
    }

    if (!prefersReduced && heroEl) {
      heroEl.addEventListener("pointermove", onPointerMove, { passive: true });
      heroEl.addEventListener("pointerleave", onPointerLeave, { passive: true });
    }

    const start = performance.now();

    function frame(now: number) {
      const t = (now - start) / 1000;
      ctx2d.clearRect(0, 0, width, height);

      const md = minDim();
      const centerX = cx();
      const centerY = cy();

      if (!prefersReduced) {
        const targetX = pointerActive ? pointerX : 0;
        const targetY = pointerActive ? pointerY : 0;
        pointerTx += (targetX - pointerTx) * 0.04;
        pointerTy += (targetY - pointerTy) * 0.04;
      } else {
        pointerTx = 0;
        pointerTy = 0;
      }

      ctx2d.globalCompositeOperation = isLight ? "multiply" : "screen";

      // Max radius roughly covers half the screen width or a bit more
      const maxR = md * 1.5;

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];

        // Wave logic: Pulse moves outward
        // dot.dist is 0..1
        // Make the wave frequency related to radial distance
        const r = dot.dist * maxR;

        // Wave phase: moves over time
        const wavePhase = t * 1.2 - dot.dist * 8.0 + dot.offset * 0.1;
        const wave = Math.sin(wavePhase); // -1..1

        // Parallax
        const depth = 0.2 + 0.8 * dot.dist;
        const px = pointerTx * md * 0.05 * depth;
        const py = pointerTy * md * 0.05 * depth;

        const x = centerX + Math.cos(dot.baseAngle) * r + px;
        const y = centerY + Math.sin(dot.baseAngle) * r + py;

        // Pulsating logic
        // Size pulses
        const s = dot.size * (0.6 + 0.4 * wave);

        // Alpha pulses
        const alphaWave = Math.sin(wavePhase + Math.PI * 0.2); // slight offset
        const aBase = isLight ? 0.5 : 0.6;
        const a = aBase * (0.4 + 0.6 * alphaWave);

        if (a <= 0.01 || s <= 0.01) continue;

        // Color based on distance + minor time shift
        const cT = (dot.dist * 0.6 - t * 0.05) % 1;
        const [R, G, B] = paletteAt(cT);

        ctx2d.fillStyle = `rgba(${R}, ${G}, ${B}, ${a})`;
        ctx2d.beginPath();
        ctx2d.arc(x, y, s, 0, Math.PI * 2);
        ctx2d.fill();
      }

      rafId = requestAnimationFrame(frame);
    }

    rafId = requestAnimationFrame(frame);

    window.addEventListener("resize", resize, { passive: true });
    return () => {
      window.removeEventListener("resize", resize);
      if (!prefersReduced && heroEl) {
        heroEl.removeEventListener("pointermove", onPointerMove);
        heroEl.removeEventListener("pointerleave", onPointerLeave);
      }
      cancelAnimationFrame(rafId);
    };
  }, [theme]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(y > 50);
      setShowTop(y > 400);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToId(id: string) {
    const el = document.getElementById(id);
    if (!el) return;

    const header = document.getElementById("main-header");
    const headerOffset = header?.offsetHeight || 70;

    const rectTop = el.getBoundingClientRect().top;
    const top = rectTop + window.pageYOffset - headerOffset;
    window.scrollTo({ top, behavior: "smooth" });
  }

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
  }

  return (
    <>
      <div className="cursor"></div>
      <div className="cursor-follower"></div>

      <header id="main-header" className={isScrolled ? "scrolled" : ""}>
        <div className="container">
          <div className="logo">
            <a href="/">SynvexAI</a>
          </div>

          <div className="right-side">
            <nav>
              <ul>
                <li>
                  <a href="/" className="active nav-link">
                    <span>Главная</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    className="nav-link"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToId("about");
                    }}
                  >
                    <span>О нас</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#news-showcase"
                    className="nav-link"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToId("news-showcase");
                    }}
                  >
                    <span>Новости</span>
                  </a>
                </li>
              </ul>
            </nav>

            <div className="theme-switcher">
              <button
                id="theme-toggle-button"
                aria-label="Переключить тему"
                onClick={toggleTheme}
              >
                {/* у тебя: если dark => sun, если light => moon */}
                <i className={`fas ${theme === "dark" ? "fa-sun" : "fa-moon"}`}></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <canvas ref={heroParticlesRef} className="hero-particles" aria-hidden="true" />
          <div className="container hero-content">
            <h1 className="hero-title">
              <HeroTitle />
            </h1>

            <form
              className="hero-prompt-form"
              action="https://pashaddd.alwaysdata.net"
              method="get"
            >
              <div className="hero-input-wrap">
                <input
                  type="text"
                  name="prompt"
                  placeholder="Спроси что угодно."
                  aria-label="Запрос к ReMind"
                  required
                />
                <button type="submit">Спросить</button>
              </div>
            </form>
          </div>
        </section>

        <ModelsShowcase />

        <section id="about" className="content-section about-teaser">
          <div className="container" data-aos="fade-up">
                <h2 className="section-title-center">Наша цель</h2>

                <p data-aos="fade-up" data-aos-delay="100">
                    Мы в <strong>SynvexAI</strong> верим, что искусственный интеллект должен быть простым, понятным и
                    безопасным. Наша главная цель — создать ИИ, который будет открытым и доступным для каждого.
                </p>

                <p data-aos="fade-up" data-aos-delay="150">
                    Мы хотим, чтобы у вас был инструмент, который просто работает. Без сложных настроек, без барьеров и
                    без "головной боли". Появилась идея? Вы просто заходите и делаете.
                </p>

                <p data-aos="fade-up" data-aos-delay="200">
                    ИИ — это не замена человеку. <strong>Это помощник.</strong> Он должен быть полезным, говорить правду
                    и оставаться дружелюбным. Мы видим его как партнёра, который помогает вам думать, учиться и творить,
                    а не делает всё за вас.
                </p>

                <p data-aos="fade-up" data-aos-delay="250">
                    Ключ ко всему — <strong>открытость и прозрачность</strong>. Мы хотим, чтобы вы всегда понимали, как
                    работает система. Чтобы вы могли видеть "ход мыслей" ИИ и не сомневались, что он ничего не
                    "недоговорил". Прозрачность — это основа доверия.
                </p>

                <p data-aos="fade-up" data-aos-delay="300">
                    Хватит бояться "сломать" технологию или часами подбирать "идеальный" запрос. Вам не нужно держать в
                    голове тысячу разных продуктов. Вы должны просто пользоваться, быть и узнавать новое.
                    <strong>SynvexAI</strong> — это про то, чтобы дать вам эту возможность.
                </p>

                <p data-aos="fade-up" data-aos-delay="350">
                    Мы не ограничиваем себя. SynvexAI — это площадка для экспериментов. Мы хотим пробовать всё,
                    проверять идеи и не бояться нового. Это позволяет нам создавать гибкие инструменты и даже давать ИИ
                    разные "личности", чтобы вы могли выбрать ту, с которой вам комфортнее всего общаться.
                </p>

            <a
              href="/about-page.html"
              className="text-link"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              Узнать больше о нашей философии
            </a>
          </div>
        </section>

        <section id="news-showcase" className="content-section news-showcase-section-v2">
          <div className="container">
            <div className="section-header" data-aos="fade-right">
              <h2 className="section-title">Новости</h2>
              <a href="/news/" className="view-all-link">
                Все новости <i className="fas fa-arrow-right"></i>
              </a>
            </div>

            <div className="news-sticky-layout">
              <div className="news-sticky-featured" data-aos="fade-up">
                <div className="featured-news-wrapper">
                  <article className="featured-news-card">
                    <a
                      href="https://pashaddd.alwaysdata.net/"
                      className="featured-news-link featured-news-link--cover"
                    >
                      <div className="featured-image-wrapper">
                        <img src="images/banners/remind-banner.png" alt="ReMind" />
                      </div>
                      <div className="featured-content">
                        <div className="featured-header">
                          <h3>ReMind</h3>
                          <span className="featured-date">21 мая 2025</span>
                        </div>
                        <p className="featured-excerpt">
                          ReMind — ваш персональный ИИ-ассистент, созданный для предоставления глубоких инсайтов и
                          осмысленной поддержки.
                        </p>
                        <span className="featured-link-text">
                          Читать далее <i className="fas fa-arrow-right"></i>
                        </span>
                      </div>
                    </a>
                  </article>
                </div>
              </div>

              <div className="news-sticky-list" data-aos="fade-up" data-aos-delay="150">
                <article className="news-list-item">
                  <a href="/model/GDint/" className="news-list-link">
                    <div className="news-list-body">
                      <span className="news-list-tag">Релиз</span>
                      <h4 className="news-list-title">Представляем GDInt</h4>
                      <span className="news-list-meta">6 минут чтения</span>
                    </div>
                    <div
                      className="news-list-thumb"
                      style={{ backgroundImage: "url('/news/WebsiteCreatedForGDint.jpg')" }}
                      aria-hidden="true"
                    ></div>
                  </a>
                </article>

                <article className="news-list-item">
                  <a href="/model/chessai" className="news-list-link">
                    <div className="news-list-body">
                      <span className="news-list-tag">Объявление</span>
                      <h4 className="news-list-title">ChessAI</h4>
                      <span className="news-list-meta">3 минуты чтения</span>
                    </div>
                    <div
                      className="news-list-thumb"
                      style={{ backgroundImage: "url('/news/chess-ai-1.png')" }}
                      aria-hidden="true"
                    ></div>
                  </a>
                </article>

                <article className="news-list-item">
                  <a href="https://synvexai.github.io/MindForge/" className="news-list-link">
                    <div className="news-list-body">
                      <span className="news-list-tag">ReMind</span>
                      <h4 className="news-list-title">MindForge</h4>
                      <span className="news-list-meta">Несколько секунд</span>
                    </div>
                    <div
                      className="news-list-thumb"
                      style={{ backgroundImage: "url('/news/MindForge.png')" }}
                      aria-hidden="true"
                    ></div>
                  </a>
                </article>

                <article className="news-list-item">
                  <a href="#" className="news-list-link">
                    <div className="news-list-body">
                      <span className="news-list-tag">ReMind</span>
                      <h4 className="news-list-title">Поддержка таблиц в ReMind</h4>
                      <span className="news-list-meta">Новое</span>
                    </div>
                    <div
                      className="news-list-thumb"
                      style={{ backgroundImage: "url('/news/TableSupportInReMind.jpg')" }}
                      aria-hidden="true"
                    ></div>
                  </a>
                </article>

                <article className="news-list-item">
                  <a href="#" className="news-list-link">
                    <div className="news-list-body">
                      <span className="news-list-tag">ReMind</span>
                      <h4 className="news-list-title">Ссылки и картинки в ReMind</h4>
                      <span className="news-list-meta">Обновление</span>
                    </div>
                    <div
                      className="news-list-thumb"
                      style={{ backgroundImage: "url('/news/ReMindСanNowThinkOutLoudAndDisplayLinks2.jpg')" }}
                      aria-hidden="true"
                    ></div>
                  </a>
                </article>

                <article className="news-list-item">
                  <a href="#" className="news-list-link">
                    <div className="news-list-body">
                      <span className="news-list-tag">SynvexAI</span>
                      <h4 className="news-list-title">Мы создали собственный сайт</h4>
                      <span className="news-list-meta">8 минут чтения</span>
                    </div>
                    <div
                      className="news-list-thumb"
                      style={{ backgroundImage: "url('/news/news1.png')" }}
                      aria-hidden="true"
                    ></div>
                  </a>
                </article>
              </div>
            </div>
          </div>
        </section>

      </main>

      <SiteFooter />

      <button
        id="back-to-top"
        title="Наверх"
        style={{ display: showTop ? "flex" : "none" }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <i className="fas fa-arrow-up"></i>
      </button>
    </>
  );
}

export default function App() {
  const path = window.location.pathname.toLowerCase();

  if (path.startsWith("/news")) {
    return <NewsPage />;
  }

  if (path.startsWith("/model/gdint")) {
    return <GDintPage />;
  }

  if (path.startsWith("/model/chessai")) {
    return <ChessAiPage />;
  }

  return <HomePage />;
}
