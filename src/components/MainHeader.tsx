import { useEffect, useRef, useState } from "react";
import type { FormEvent, MouseEvent } from "react";
import { ROUTES } from "../siteRoutes";

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

  const handlePromptSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const prompt = String(formData.get("prompt") ?? "").trim();
    const url = prompt
      ? `https://chat.synvexai.com/?q=${encodeURIComponent(prompt)}`
      : "https://chat.synvexai.com";

    window.location.href = url;
  };

  return (
    <header id="main-header" className={headerClasses.join(" ")}>
      <div className="container">
        <div className="logo">
          <a href={ROUTES.home}>SynvexAI</a>
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
            <form className="header-prompt-form" onSubmit={handlePromptSubmit}>
              <input
                type="text"
                name="prompt"
                placeholder="Спроси ReMind"
                aria-label="Спроси ReMind"
              />
              <button type="submit">Спросить</button>
            </form>
          )}
        </div>
      </div>
    </header>
  );
}
