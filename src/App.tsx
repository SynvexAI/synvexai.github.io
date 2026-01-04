import { useEffect, useMemo, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const HERO_TEXT =
  "Мы создаём искусственный интеллект, чтобы технологии лучше работали для человека.";

function HeroTitle() {
  const nodes = useMemo(() => {
    let idx = 0;
    const out: React.ReactNode[] = [];

    HERO_TEXT.split(" ").forEach((word, wi) => {
      const isAccent = wi === 0;

      const chars = word.split("").map((ch, ci) => {
        const delay = `${idx * 0.035}s`;
        idx += 1;

        return (
          <span
            key={`${wi}-${ci}`}
            className="char"
            style={{ ["--char-delay" as any]: delay }}
          >
            {ch}
          </span>
        );
      });

      out.push(
        <span
          key={`w-${wi}`}
          className={`word-wrapper ${isAccent ? "accent" : ""}`}
        >
          {chars}
        </span>
      );

      // пробел МЕЖДУ словами (лучше неразрывный, чтобы точно не исчез)
      out.push(<span key={`s-${wi}`}>{"\u00A0"}</span>);
    });

    return out;
  }, []);

  return <>{nodes}</>;
}


export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    AOS.init({
      duration: 700,
      once: true,
      offset: 50,
      easing: "cubic-bezier(0.25, 0.8, 0.25, 1)",
    });
  }, []);

  useEffect(() => {
    // init theme (как у тебя в script.js)
    const saved =
      (localStorage.getItem("theme") as "dark" | "light" | null) ??
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

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
    document.documentElement.setAttribute("data-theme", next);
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
              <h2 className="section-title">Главное</h2>
              <a href="/news/" className="view-all-link">
                Все новости <i className="fas fa-arrow-right"></i>
              </a>
            </div>

            <div className="news-wow-layout">
              <article className="news-wow-card main-story" data-aos="zoom-in-up" data-aos-duration="900">
                <a href="https://pashaddd.alwaysdata.net/" className="news-wow-link">
                  <div className="news-wow-image-wrapper">
                    <img src="/ReMind/banner.png" alt="баннер" />
                    <div className="image-overlay"></div>
                  </div>
                  <div className="news-wow-content">
                    <h3>ReMind</h3>
                    <p className="news-wow-excerpt">
                      ReMind — ваш персональный ИИ-ассистент, созданный для предоставления глубоких инсайтов и
                      осмысленной поддержки.
                    </p>
                    <div className="news-meta">
                      <span className="news-date">21 мая 2025</span>
                      <span className="read-more-chip">
                        Читать далее <i className="fas fa-long-arrow-alt-right"></i>
                      </span>
                    </div>
                  </div>
                </a>
              </article>

              <article className="news-wow-card secondary-story type-1" data-aos="fade-left" data-aos-delay="200" data-aos-duration="800">
                <a href="/model/GDint/" className="news-wow-link">
                  <div className="news-wow-image-wrapper small-img">
                    <div className="placeholder-bg-pattern pattern-1"></div>
                  </div>
                  <div className="news-wow-content">
                    <span className="news-wow-category">Релиз</span>
                    <h4>Представляем GDInt</h4>
                    <div className="news-meta">
                      <span className="news-read-time">6 минут чтения</span>
                    </div>
                  </div>
                </a>
              </article>

              <article className="news-wow-card secondary-story type-3" data-aos="fade-left" data-aos-delay="350" data-aos-duration="800">
                <a href="/model/chessai/" className="news-wow-link">
                  <div className="news-wow-content text-only">
                    <span className="news-wow-category">Объявление</span>
                    <h4>ChessAI</h4>
                    <p className="news-wow-excerpt short">
                      ChessAI — это инструмент для анализа шахматных партий, использующий движок Stockfish и графический интерфейс на Python.
                    </p>
                    <div className="news-meta">
                      <span className="news-read-time">3 минуты чтения</span>
                    </div>
                  </div>
                </a>
              </article>
            </div>
          </div>
        </section>

        <section id="more-news" className="content-section more-news-section">
          <div className="container">
            <div className="section-header" data-aos="fade-right">
              <h2 className="section-title">Другие новости</h2>
            </div>

            <div className="more-news-grid" data-aos="fade-up">
              <article className="news-card" data-aos="fade-up" data-aos-delay="100">
                <a href="https://synvexai.github.io/MindForge/" className="news-card-link-wrapper">
                  <div className="news-card-image-wrapper">
                    <div
                      className="news-card-image-placeholder secondary-image"
                      style={{ backgroundImage: "url('/news/MindForge.png')" }}
                    ></div>
                  </div>
                  <div className="news-card-content">
                    <h4>MindForge</h4>
                    <div className="news-meta">
                      <span className="news-category">ReMind</span>
                      <span className="news-read-time">Несколько секунд чтения</span>
                    </div>
                  </div>
                </a>
              </article>

              <article className="news-card" data-aos="fade-up" data-aos-delay="200">
                <a href="/model/chessai/" className="news-card-link-wrapper">
                  <div className="news-card-image-wrapper">
                    <div
                      className="news-card-image-placeholder secondary-image"
                      style={{ backgroundImage: "url('/news/chess-ai-1.png')" }}
                    ></div>
                  </div>
                  <div className="news-card-content">
                    <h4>ChessAI</h4>
                    <div className="news-meta">
                      <span className="news-category">ChessAI</span>
                      <span className="news-read-time">4 минуты чтения</span>
                    </div>
                  </div>
                </a>
              </article>

              <article className="news-card" data-aos="fade-up" data-aos-delay="300">
                <a className="news-card-link-wrapper">
                  <div className="news-card-image-wrapper">
                    <div
                      className="news-card-image-placeholder secondary-image"
                      style={{ backgroundImage: "url('/news/TableSupportInReMind.jpg')" }}
                    ></div>
                  </div>
                  <div className="news-card-content">
                    <h4>Поддержка таблиц в ReMind</h4>
                    <div className="news-meta">
                      <span className="news-category">ReMind</span>
                    </div>
                  </div>
                </a>
              </article>

              <article className="news-card" data-aos="fade-up" data-aos-delay="100">
                <a href="/model/GDint/" className="news-card-link-wrapper">
                  <div className="news-card-image-wrapper">
                    <div
                      className="news-card-image-placeholder secondary-image"
                      style={{ backgroundImage: "url('/news/WebsiteCreatedForGDint.jpg')" }}
                    ></div>
                  </div>
                  <div className="news-card-content">
                    <h4>GDint</h4>
                    <div className="news-meta">
                      <span className="news-category">ReMind</span>
                      <span className="news-read-time">6 минут чтения</span>
                    </div>
                  </div>
                </a>
              </article>

              <article className="news-card" data-aos="fade-up" data-aos-delay="200">
                <a className="news-card-link-wrapper">
                  <div className="news-card-image-wrapper">
                    <div
                      className="news-card-image-placeholder secondary-image"
                      style={{ backgroundImage: "url('/news/ReMindСanNowThinkOutLoudAndDisplayLinks2.jpg')" }}
                    ></div>
                  </div>
                  <div className="news-card-content">
                    <h4>Ссылки и картинки в ReMind</h4>
                    <div className="news-meta">
                      <span className="news-category">ReMind</span>
                    </div>
                  </div>
                </a>
              </article>

              <article className="news-card" data-aos="fade-up" data-aos-delay="300">
                <a href="#" className="news-card-link-wrapper">
                  <div className="news-card-image-wrapper">
                    <div
                      className="news-card-image-placeholder secondary-image"
                      style={{ backgroundImage: "url('/news/news1.png')" }}
                    ></div>
                  </div>
                  <div className="news-card-content">
                    <h4>Мы создали собственный сайт</h4>
                    <div className="news-meta">
                      <span className="news-category">SynvexAI</span>
                      <span className="news-read-time">8 минут чтения</span>
                    </div>
                  </div>
                </a>
              </article>
            </div>

            <a href="/news/" className="text-link" data-aos="fade-up" data-aos-delay="300">
              Больше новостей
            </a>
          </div>
        </section>
      </main>

      <footer id="site-footer">
        <div className="container footer-content">
          <div className="footer-social-links">
            <a href="https://x.com/SynvexAI" target="_blank" title="X (Twitter)" rel="noreferrer">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://www.youtube.com/@SynvexAI" target="_blank" title="YouTube" rel="noreferrer">
              <i className="fab fa-youtube"></i>
            </a>
            <a href="https://linkedin.com/company/synvexai" target="_blank" title="LinkedIn" rel="noreferrer">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="https://github.com/SynvexAI" target="_blank" title="GitHub" rel="noreferrer">
              <i className="fab fa-github"></i>
            </a>
            <a href="https://instagram.com/SynvexAI" target="_blank" title="Instagram" rel="noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="http://tiktok.com/@synvexai" target="_blank" title="TikTok" rel="noreferrer">
              <i className="fab fa-tiktok"></i>
            </a>
            <a href="https://discord.gg/pxdFazEPSf" target="_blank" title="Discord" rel="noreferrer">
              <i className="fab fa-discord"></i>
            </a>
            <a href="https://t.me/SynvexAI" target="_blank" title="Telegram" rel="noreferrer">
              <i className="fab fa-telegram"></i>
            </a>
          </div>

          <div className="footer-copyright">
            <span>
              SynvexAI {new Date().getFullYear()}
            </span>
            <a href="#" className="manage-cookies-link">
              Управление cookie
            </a>
          </div>
        </div>
      </footer>

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
