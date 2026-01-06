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

    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    const isLight = document.documentElement.getAttribute("data-theme") === "light";

    const heroEl = canvasEl.closest(".hero") as HTMLElement | null;
    let pointerX = 0;
    let pointerY = 0;
    let pointerActive = false;
    let pointerTx = 0;
    let pointerTy = 0;

    function clamp01(x: number) {
      return Math.max(0, Math.min(1, x));
    }

    function smoothstep(edge0: number, edge1: number, x: number) {
      const t = clamp01((x - edge0) / (edge1 - edge0));
      return t * t * (3 - 2 * t);
    }

    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t;
    }

    function cssVarRgbRaw(name: string, fallback: [number, number, number]) {
      const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      const parts = raw.split(",").map((v) => Number(v.trim()));
      if (parts.length === 3 && parts.every((n) => Number.isFinite(n))) {
        return [parts[0], parts[1], parts[2]] as [number, number, number];
      }
      return fallback;
    }

    const accent = cssVarRgbRaw("--color-accent-raw", [236, 236, 240]);

    const palette: Array<[number, number, number]> = isLight
      ? [
          [34, 78, 255],
          [126, 62, 255],
          [245, 55, 85],
          [255, 140, 0],
          [34, 165, 92],
        ]
      : [
          [52, 120, 255],
          [140, 92, 255],
          [255, 70, 105],
          [255, 170, 40],
          [48, 210, 130],
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
    const cx = () => width * 0.56;
    const cy = () => height * 0.46;

    type Dot = {
      baseAngle: number;
      baseRadius: number;
      size: number;
      phase: number;
      drift: number;
      colorT: number;
      alpha: number;
    };

    const dotCount = Math.round(Math.max(260, Math.min(720, (width * height) / 2800)));
    const dots: Dot[] = Array.from({ length: dotCount }, (_, i) => {
      const t = i / dotCount;
      const angle = t * Math.PI * 2;

      const ring = 0.34 + 0.10 * Math.sin(angle * 2.0) + 0.06 * Math.sin(angle * 5.0);
      const scatter = (Math.random() - 0.5) * 0.08;
      const r = ring + scatter;

      const size = 0.9 + Math.random() * 1.8;
      const phase = Math.random() * Math.PI * 2;
      const drift = 0.18 + Math.random() * 0.55;

      const colorT = t;
      const alpha = 0.35 + Math.random() * 0.55;

      return { baseAngle: angle, baseRadius: r, size, phase, drift, colorT, alpha };
    });

    function onPointerMove(e: PointerEvent) {
      if (!heroEl) return;
      const rect = heroEl.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / Math.max(1, rect.width);
      const ny = (e.clientY - rect.top) / Math.max(1, rect.height);
      pointerX = (nx - 0.5) * 2;
      pointerY = (ny - 0.5) * 2;
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
      const baseRot = t * (prefersReduced ? 0 : 0.06);

      if (!prefersReduced) {
        const targetX = pointerActive ? pointerX : 0;
        const targetY = pointerActive ? pointerY : 0;
        pointerTx += (targetX - pointerTx) * 0.06;
        pointerTy += (targetY - pointerTy) * 0.06;
      } else {
        pointerTx = 0;
        pointerTy = 0;
      }

      const globalAlpha = isLight ? 0.30 : 0.58;
      const glowBoost = isLight ? 0.0 : 0.14;

      const colorShift = prefersReduced ? 0 : t * 0.03;

      const posX = new Float32Array(dots.length);
      const posY = new Float32Array(dots.length);
      const dotA = new Float32Array(dots.length);
      const dotT = new Float32Array(dots.length);

      ctx2d.globalCompositeOperation = "source-over";

      const parallaxAmp = md * (isLight ? 0.012 : 0.018);

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        const wobble = prefersReduced ? 0 : Math.sin(t * dot.drift + dot.phase) * 0.012;
        const ang = dot.baseAngle + baseRot + wobble;
        const rr = dot.baseRadius + wobble * 2.2;

        const depth = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(dot.phase + t * 0.25));
        const px = pointerTx * parallaxAmp * depth;
        const py = pointerTy * parallaxAmp * depth;

        const x = centerX + Math.cos(ang) * rr * md + px;
        const y = centerY + Math.sin(ang) * rr * md + py;

        const nx = (x - centerX) / md;
        const ny = (y - centerY) / md;
        const dist = Math.sqrt(nx * nx + ny * ny);

        const mask = 1 - smoothstep(0.44, 0.64, dist);
        if (mask <= 0.001) continue;

        const twinkle = prefersReduced ? 1 : 0.70 + 0.30 * Math.sin(t * 1.8 + dot.phase);
        const a = globalAlpha * dot.alpha * mask * twinkle;
        if (a <= 0.001) continue;

        const [r, g, b] = paletteAt(dot.colorT + colorShift);
        const s = dot.size * (0.85 + 0.30 * mask) * (0.85 + 0.25 * depth);

        posX[i] = x;
        posY[i] = y;
        dotA[i] = a;
        dotT[i] = dot.colorT + colorShift;

        ctx2d.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
        ctx2d.beginPath();
        ctx2d.arc(x, y, s, 0, Math.PI * 2);
        ctx2d.fill();

        if (!isLight && glowBoost > 0) {
          ctx2d.fillStyle = `rgba(${accent[0]}, ${accent[1]}, ${accent[2]}, ${a * glowBoost})`;
          ctx2d.beginPath();
          ctx2d.arc(x, y, s * 2.2, 0, Math.PI * 2);
          ctx2d.fill();
        }
      }

      if (!prefersReduced) {
        const cellSize = 88;
        const maxDist = 110;
        const maxDist2 = maxDist * maxDist;
        const buckets = new Map<string, number[]>();

        for (let i = 0; i < dots.length; i++) {
          const a = dotA[i];
          if (a <= 0.001) continue;
          const gx = Math.floor(posX[i] / cellSize);
          const gy = Math.floor(posY[i] / cellSize);
          const key = `${gx}:${gy}`;
          const arr = buckets.get(key);
          if (arr) arr.push(i);
          else buckets.set(key, [i]);
        }

        ctx2d.globalCompositeOperation = isLight ? "multiply" : "screen";
        for (let i = 0; i < dots.length; i++) {
          const ai = dotA[i];
          if (ai <= 0.001) continue;

          const gx = Math.floor(posX[i] / cellSize);
          const gy = Math.floor(posY[i] / cellSize);
          let lines = 0;

          for (let oy = -1; oy <= 1; oy++) {
            for (let ox = -1; ox <= 1; ox++) {
              const key = `${gx + ox}:${gy + oy}`;
              const arr = buckets.get(key);
              if (!arr) continue;

              for (const j of arr) {
                if (j <= i) continue;
                const aj = dotA[j];
                if (aj <= 0.001) continue;

                const dx = posX[j] - posX[i];
                const dy = posY[j] - posY[i];
                const d2 = dx * dx + dy * dy;
                if (d2 > maxDist2) continue;

                const d = Math.sqrt(d2);
                const k = 1 - d / maxDist;
                const a = Math.min(ai, aj) * (k * k) * (isLight ? 0.22 : 0.18);
                if (a <= 0.002) continue;

                const [r, g, b] = paletteAt((dotT[i] + dotT[j]) * 0.5);
                ctx2d.strokeStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
                ctx2d.lineWidth = 1;
                ctx2d.beginPath();
                ctx2d.moveTo(posX[i], posY[i]);
                ctx2d.lineTo(posX[j], posY[j]);
                ctx2d.stroke();

                lines++;
                if (lines >= 4) break;
              }
              if (lines >= 4) break;
            }
            if (lines >= 4) break;
          }
        }
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
                  <a href="/model/chessai/" className="news-list-link">
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
