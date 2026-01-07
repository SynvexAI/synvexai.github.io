import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";

export type MainHeaderNavLink = {
  label: string;
  href?: string;
  isActive?: boolean;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

type MainHeaderProps = {
  isScrolled: boolean;
  navLinks?: MainHeaderNavLink[];
  showPrompt?: boolean;
};

export default function MainHeader({
  isScrolled,
  navLinks = [],
  showPrompt = false,
}: MainHeaderProps) {
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollRef = useRef(0);

  useEffect(() => {
    lastScrollRef.current = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollRef.current;

      setIsHidden((prevHidden) => {
        if (currentY <= 60) return false;
        if (delta > 10) return true;
        if (delta < -10) return false;
        return prevHidden;
      });

      lastScrollRef.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerClasses = ["main-header"];
  if (isScrolled) headerClasses.push("scrolled");
  if (isHidden) headerClasses.push("is-hidden");

  return (
    <header id="main-header" className={headerClasses.join(" ")}>
      <div className="container">
        <div className="logo">
          <a href="/">SynvexAI</a>
        </div>

        <div className="right-side">
          <nav>
            <ul>
              {navLinks.map((link) => (
                <li key={`${link.label}-${link.href ?? "#"}`}>
                  <a
                    href={link.href ?? "#"}
                    className={`nav-link${link.isActive ? " active" : ""}`}
                    onClick={(event) => {
                      if (link.onClick) {
                        event.preventDefault();
                        link.onClick(event);
                      }
                    }}
                  >
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {showPrompt && (
            <form className="header-prompt-form" action="https://pashaddd.alwaysdata.net" method="get">
              <input
                type="text"
                name="prompt"
                placeholder="Спроси ReMind"
                aria-label="Запрос к ReMind"
                required
              />
              <button type="submit">Спросить</button>
            </form>
          )}
        </div>
      </div>
    </header>
  );
}
