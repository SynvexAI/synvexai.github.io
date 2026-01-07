import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import SiteFooter from "./SiteFooter";

export default function NewsPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const saved = localStorage.getItem("theme") as "dark" | "light" | null;
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

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
    document.title = "Новости SynvexAI";
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

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
  }

  return (
    <>
      <header id="main-header" className={isScrolled ? "scrolled" : ""}>
        <div className="container">
          <div className="logo">
            <a href="/">SynvexAI</a>
          </div>

          <div className="right-side">
            <nav>
              <ul>
                <li>
                  <a href="/" className="nav-link">
                    <span>Главная</span>
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
                <i className={`fas ${theme === "dark" ? "fa-sun" : "fa-moon"}`}></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section id="news-showcase" className="content-section news-showcase-section-v2">
          <div className="container">
            <div className="section-header" data-aos="fade-right">
              <h2 className="section-title">Новости</h2>
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
                        <img src="/news/banner.png" alt="ReMind" />
                      </div>
                      <div className="featured-content">
                        <div className="featured-header">
                          <h3>ReMind</h3>
                          <span className="featured-date">21 мая 2025</span>
                        </div>
                        <p className="featured-excerpt">
                          ReMind — ваш персональный ИИ-ассистент, созданный для предоставления глубоких инсайтов и
                          осмысленной поддержки. Идеи, задачи или большие цели — ReMind помогает двигаться вперёд.
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
                  <a href="/SynvexAI/WeLiedToYou/" className="news-list-link">
                    <div className="news-list-body">
                      <span className="news-list-tag">Объявление</span>
                      <h4 className="news-list-title">Мы вас обманули</h4>
                      <span className="news-list-meta">2 минуты чтения</span>
                    </div>
                    <div
                      className="news-list-thumb"
                      style={{ backgroundImage: "url('/news/ReMindСanNowThinkOutLoudAndDisplayLinks1.jpg')" }}
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
                      <span className="news-list-meta">31 августа 2025</span>
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
                      <span className="news-list-meta">06 августа 2025</span>
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
                      <span className="news-list-meta">11 мая 2025</span>
                    </div>
                    <div
                      className="news-list-thumb"
                      style={{ backgroundImage: "url('/news/LinksAndImageSupport.jpg')" }}
                      aria-hidden="true"
                    ></div>
                  </a>
                </article>

                <article className="news-list-item">
                  <a href="#" className="news-list-link">
                    <div className="news-list-body">
                      <span className="news-list-tag">ReMind</span>
                      <h4 className="news-list-title">ReMind теперь умеет думать вслух и отображать ссылки</h4>
                      <span className="news-list-meta">11 мая 2025</span>
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
