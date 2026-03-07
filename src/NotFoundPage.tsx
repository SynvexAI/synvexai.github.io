import { useEffect, useState } from "react";
import MainHeader from "./components/MainHeader";
import type { MainHeaderNavLink } from "./components/MainHeader";
import SiteFooter from "./SiteFooter";
import { useAutoTheme } from "./hooks/useAutoTheme";
import { ROUTES } from "./siteRoutes";

export default function NotFoundPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const missingPath =
    typeof window === "undefined" ? ROUTES.home : window.location.pathname;

  useAutoTheme();

  useEffect(() => {
    document.title = "404 - Страница не найдена";
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(y > 50);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks: MainHeaderNavLink[] = [{ label: "Главная", href: ROUTES.home }];

  return (
    <>
      <MainHeader isScrolled={isScrolled} navLinks={navLinks} />

      <main>
        <section className="hero content-section">
          <div className="container" style={{ textAlign: "center" }}>
            <p
              style={{
                marginBottom: "0.75rem",
                color: "var(--secondary-text-color)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Маршрут не найден
            </p>
            <h1 className="section-title">Страница не найдена</h1>
            <p className="subtitle" style={{ maxWidth: "680px", margin: "0 auto" }}>
              Запрошенный адрес не существует в текущей структуре сайта или еще не был
              опубликован.
            </p>
            <p
              style={{
                marginTop: "1rem",
                color: "var(--secondary-text-color)",
                wordBreak: "break-word",
              }}
            >
              {missingPath}
            </p>
            <div
              className="hero-buttons"
              style={{ justifyContent: "center", marginTop: "2rem" }}
            >
              <a href={ROUTES.home} className="btn btn-primary">
                Вернуться на главную
              </a>
              <a href={ROUTES.news} className="btn btn-secondary">
                Открыть новости
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
