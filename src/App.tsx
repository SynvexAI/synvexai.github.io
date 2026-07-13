import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import NewsPage from "./news";
import SiteFooter from "./SiteFooter";
import Roadmap from "./components/Roadmap";
import GDintPage from "./model/GDint";
import ChessAiPage from "./model/ChessAi";
import NotFoundPage from "./NotFoundPage";
import PrivacyPolicyPage from "./PrivacyPolicyPage";
import MainHeader from "./components/MainHeader";
import DotField from "./components/DotField";
import type { MainHeaderNavLink } from "./components/MainHeader";
import { useAutoTheme } from "./hooks/useAutoTheme";
import { ROUTES, resolveRoute } from "./siteRoutes";

const HERO_TEXT =
  "Мы создаём искусственный интеллект, чтобы технологии лучше работали для человека.";

function HeroTitle() {
  return <span className="word-wrapper">{HERO_TEXT}</span>;
}

function ModelsShowcase() {
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    requestAnimationFrame(() => {
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
    });
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
      footerLink: "Learn more",
      footerLinkUrl: "#",
    },
    {
      title: "Lume",
      desc: "Создавайте связные видеосцены по текстовому описанию с сохранением движения, стиля и визуальной логики.",
      iconSrc: "/icons/model/lume.png",
      colorClass: "icon-vision",
      badge: "Скоро",
      links: [{ label: "Try in Playground", url: "#" }],
      footerLink: "Learn more",
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

              <span className="model-footer-link">
                {m.footerLink}
              </span>
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
  useAutoTheme();

  useEffect(() => {
    AOS.init({
      duration: 700,
      once: true,
      offset: 50,
      easing: "cubic-bezier(0.25, 0.8, 0.25, 1)",
    });
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

  const navLinks: MainHeaderNavLink[] = [
    { label: "Главная", href: ROUTES.home, isActive: true },
    { label: "Roadmap", href: "#roadmap", onClick: () => scrollToId("roadmap") },
    { label: "О нас", href: "#about", onClick: () => scrollToId("about") },
    { label: "Новости", href: "#news-showcase", onClick: () => scrollToId("news-showcase") },
  ];

  return (
    <>
      <div className="cursor"></div>
      <div className="cursor-follower"></div>

      <MainHeader isScrolled={isScrolled} navLinks={navLinks} />

      <main>
        <section className="hero">
          <DotField
            className="hero-dot-field"
            dotRadius={2.5}
            dotSpacing={14}
            bulgeStrength={150}
            glowRadius={290}
            sparkle={false}
            waveAmplitude={0}
            cursorRadius={250}
            cursorForce={0.46}
            bulgeOnly
            gradientFrom="#ffffff"
            gradientTo="#ffffff"
            glowColor="#120F17"
            exclusionSelector=".hero-title"
            exclusionStrength={210}
            exclusionPadding={70}
          />
          <div className="container hero-content">
            <h1 className="hero-title">
              <HeroTitle />
            </h1>

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
          </div>
        </section>

        <section id="news-showcase" className="content-section news-showcase-section-v2">
          <div className="container">
            <div className="section-header" data-aos="fade-right">
              <h2 className="section-title">Новости</h2>
              <a href={ROUTES.news} className="view-all-link">
                Все новости <i className="fas fa-arrow-right"></i>
              </a>
            </div>

            <div className="news-sticky-layout">
              <div className="news-sticky-featured" data-aos="fade-up">
                <div className="featured-news-wrapper">
                  <article className="featured-news-card">
                    <a
                      href="https://chat.synvexai.com"
                      className="featured-news-link featured-news-link--cover"
                    >
                      <div className="featured-image-wrapper">
                        <img src="/images/banners/remind-banner.png" alt="ReMind" />
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
                  <a href="#" className="news-list-link">
                    <div className="news-list-body">
                      <span className="news-list-tag">Анонс</span>
                      <h4 className="news-list-title">Devex</h4>
                      <span className="news-list-meta">13 апреля 2026</span>
                    </div>
                    <div
                      className="news-list-thumb"
                      style={{ backgroundImage: "url('/news/2/new-devex.png')" }}
                      aria-hidden="true"
                    ></div>
                  </a>
                </article>

                <article className="news-list-item">
                  <a href="https://github.com/SynvexAI" className="news-list-link">
                    <div className="news-list-body">
                      <span className="news-list-tag">GitHub</span>
                      <h4 className="news-list-title">SynvexAI подтверждена на GitHub</h4>
                      <span className="news-list-meta">12 марта 2026</span>
                    </div>
                    <div
                      className="news-list-thumb"
                      style={{ backgroundImage: "url('/news/2/gitverifed.png')" }}
                      aria-hidden="true"
                    ></div>
                  </a>
                </article>

                <article className="news-list-item">
                  <a
                    href="https://synvexai.com/policies/privacy-policy"
                    className="news-list-link"
                  >
                    <div className="news-list-body">
                      <span className="news-list-tag">Безопасность</span>
                      <h4 className="news-list-title">Политика конфиденциальности</h4>
                      <span className="news-list-meta">8 марта 2026</span>
                    </div>
                    <div
                      className="news-list-thumb"
                      style={{ backgroundImage: "url('/news/2/privacy-policy.png')" }}
                      aria-hidden="true"
                    ></div>
                  </a>
                </article>

                <article className="news-list-item">
                  <a href="https://chat.synvexai.com" className="news-list-link">
                    <div className="news-list-body">
                      <span className="news-list-tag">ReMind</span>
                      <h4 className="news-list-title">ReMind теперь на chat.synvexai.com</h4>
                      <span className="news-list-meta">25 февраля 2026</span>
                    </div>
                    <div
                      className="news-list-thumb"
                      style={{ backgroundImage: "url('/news/2/remind-domain.png')" }}
                      aria-hidden="true"
                    ></div>
                  </a>
                </article>

                <article className="news-list-item">
                  <a href="https://github.com/ReNothingg/ReMind" className="news-list-link">
                    <div className="news-list-body">
                      <span className="news-list-tag">Open Source</span>
                      <h4 className="news-list-title">ReMind теперь доступен на GitHub</h4>
                      <span className="news-list-meta">21 февраля 2026</span>
                    </div>
                    <div
                      className="news-list-thumb"
                      style={{ backgroundImage: "url('/news/2/remind-github.png')" }}
                      aria-hidden="true"
                    ></div>
                  </a>
                </article>

                <article className="news-list-item">
                  <a href="https://chat.synvexai.com" className="news-list-link">
                    <div className="news-list-body">
                      <span className="news-list-tag">Release</span>
                      <h4 className="news-list-title">Открываем доступ к ReMind</h4>
                      <span className="news-list-meta">1 декабря 2025</span>
                    </div>
                    <div
                      className="news-list-thumb"
                      style={{ backgroundImage: "url('/news/2/remind-release.png')" }}
                      aria-hidden="true"
                    ></div>
                  </a>
                </article>
              </div>
            </div>
          </div>
        </section>

        <Roadmap />

        <section id="contact-cta" className="content-section" style={{ textAlign: "center" }}>
          <div className="container" data-aos="fade-up">
            <h2 className="section-title-center">Есть идеи, предложения или желание помочь?</h2>
            <div style={{ marginTop: "2rem", display: "flex", justifyContent: "center" }}>
              <a href="mailto:synvexai@gmail.com" className="cta-button">
                Написать нам
              </a>
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
  const route = resolveRoute(window.location.pathname);

  switch (route) {
    case "news":
      return <NewsPage />;
    case "gdint":
      return <GDintPage />;
    case "chessAi":
      return <ChessAiPage />;
    case "privacyPolicy":
      return <PrivacyPolicyPage />;
    case "notFound":
      return <NotFoundPage />;
    case "home":
    default:
      return <HomePage />;
  }
}
