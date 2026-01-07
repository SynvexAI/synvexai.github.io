import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import SiteFooter from "../SiteFooter";
import MainHeader from "../components/MainHeader";
import type { MainHeaderNavLink } from "../components/MainHeader";
import { useAutoTheme } from "../hooks/useAutoTheme";

const CODE_FILES = [
  {
    id: "main-py",
    label: "main.py",
    url: "https://raw.githubusercontent.com/SynvexAI/ChessAI/main/main.py",
    language: "language-python",
  },
  {
    id: "engine-handler-py",
    label: "engine_handler.py",
    url: "https://raw.githubusercontent.com/SynvexAI/ChessAI/main/engine_handler.py",
    language: "language-python",
  },
];

function loadPrismAssets() {
  const existingTheme = document.querySelector('link[data-prism-theme="true"]');
  if (!existingTheme) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-tomorrow.min.css";
    link.setAttribute("data-prism-theme", "true");
    document.head.appendChild(link);
  }

  const scripts = [
    "https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js",
    "https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-python.min.js",
  ];

  scripts.forEach((src) => {
    if (document.querySelector(`script[src="${src}"]`)) return;
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    document.body.appendChild(script);
  });
}

export default function ChessAiPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
  useAutoTheme();
  const [activeTab, setActiveTab] = useState(CODE_FILES[0].id);
  const [codeById, setCodeById] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 50,
      easing: "cubic-bezier(0.25, 0.8, 0.25, 1)",
    });
  }, []);

  useEffect(() => {
    loadPrismAssets();
  }, []);

  useEffect(() => {
    document.title = "ChessAI - Шахматный Анализатор";
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

  useEffect(() => {
    let isMounted = true;

    Promise.all(
      CODE_FILES.map((file) =>
        fetch(file.url)
          .then((response) => response.text())
          .then((text) => ({ id: file.id, text }))
          .catch(() => ({ id: file.id, text: "Ошибка загрузки кода" }))
      )
    ).then((entries) => {
      if (!isMounted) return;
      const next: Record<string, string> = {};
      entries.forEach((entry) => {
        next[entry.id] = entry.text;
      });
      setCodeById(next);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const prism = (window as any).Prism;
    if (prism?.highlightAll) {
      prism.highlightAll();
    }
  }, [codeById, activeTab]);

  async function copyCode(tabId: string) {
    const text = codeById[tabId] ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(tabId);
      window.setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  }

  const navLinks: MainHeaderNavLink[] = [{ label: "Главная", href: "/" }];

  return (
    <>
      <MainHeader isScrolled={isScrolled} navLinks={navLinks} />

      <main>
        <section className="hero content-section">
          <div className="container" data-aos="fade-in">
            <h1 className="section-title">ChessAI: Шахматный Анализатор</h1>
            <p className="subtitle">
              ChessAI - это инструмент для анализа шахматных партий, использующий движок Stockfish и графический интерфейс
              на Python. Он позволяет загружать партии в формате PGN, анализировать ходы и получать рекомендации по
              улучшению игры.
            </p>
            <div className="hero-buttons">
              <a
                href="https://github.com/SynvexAI/ChessAI"
                target="_blank"
                className="btn"
                rel="noreferrer"
              >
                <i className="fab fa-github"></i> Код на GitHub
              </a>
            </div>
            <div className="video-container" data-aos="zoom-in-up">
              <iframe
                src="https://www.youtube.com/embed/ae-6QArWrdI"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </section>

        <section id="features" className="content-section">
          <div className="container">
            <h2 className="section-title" data-aos="fade-up">
              Основные возможности
            </h2>
            <ul className="feature-list">
              <li className="feature-item" data-aos="fade-up" data-aos-delay="100">
                <i className="fas fa-folder-open"></i>
                <h3>Загрузка партий</h3>
                <p>Из файлов PGN, по URL с Lichess.org, или установка любой позиции из нотации FEN.</p>
              </li>
              <li className="feature-item" data-aos="fade-up" data-aos-delay="200">
                <i className="fas fa-cogs"></i>
                <h3>Анализ в реальном времени</h3>
                <p>Мгновенная оценка позиции, отображение нескольких лучших линий (Multi-PV) и визуализация угроз.</p>
              </li>
              <li className="feature-item" data-aos="fade-up" data-aos-delay="300">
                <i className="fas fa-chess-board"></i>
                <h3>Интерактивная доска</h3>
                <p>Полная навигация по ходам, анимированное перемещение фигур и возможность перевернуть доску.</p>
              </li>
              <li className="feature-item" data-aos="fade-up" data-aos-delay="100">
                <i className="fas fa-brain"></i>
                <h3>Глубокий анализ</h3>
                <p>Автоматический разбор всей партии с классификацией ходов (зевок, ошибка) и построением графика оценки.</p>
              </li>
              <li className="feature-item" data-aos="fade-up" data-aos-delay="200">
                <i className="fas fa-save"></i>
                <h3>Аннотации и сохранение</h3>
                <p>Добавление комментариев и NAG-ов к ходам с последующим сохранением в PGN-файл.</p>
              </li>
              <li className="feature-item" data-aos="fade-up" data-aos-delay="300">
                <i className="fas fa-robot"></i>
                <h3>Игра против движка</h3>
                <p>Возможность сыграть партию против Stockfish с настраиваемым уровнем силы.</p>
              </li>
            </ul>
          </div>
        </section>

        <section id="screenshots" className="content-section" style={{ backgroundColor: "var(--subtle-bg-color)" }}>
          <div className="container">
            <h2 className="section-title" data-aos="fade-up">
              Скриншоты
            </h2>
            <div className="screenshots-grid">
              <div data-aos="fade-up" data-aos-delay="100">
                <img
                  src="https://github.com/SynvexAI/ChessAI/blob/main/assets/image.png?raw=true"
                  alt="Анализ партии в ChessAI"
                />
              </div>
              <div data-aos="fade-up" data-aos-delay="200">
                <img
                  src="https://github.com/SynvexAI/ChessAI/blob/main/assets/image1.png?raw=true"
                  alt="Диалоговые окна в ChessAI"
                />
              </div>
              <div data-aos="fade-up" data-aos-delay="200">
                <img
                  src="https://github.com/SynvexAI/ChessAI/blob/main/assets/image2.png?raw=true"
                  alt="Диалоговые окна в ChessAI"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="setup" className="content-section">
          <div className="container">
            <h2 className="section-title" data-aos="fade-up">
              Установка и запуск
            </h2>
            <div data-aos="fade-up">
              <h3>Шаг 1: Клонирование репозитория</h3>
              <div className="code-block-wrapper">
                <pre>
                  <code>{`git clone https://github.com/SynvexAI/ChessAI
cd ChessAI`}</code>
                </pre>
              </div>

              <h3>Шаг 2: Установка зависимостей</h3>
              <p>Приложение требует наличия Python 3 и нескольких библиотек. Установите их с помощью `pip`:</p>
              <div className="code-block-wrapper">
                <pre>
                  <code>pip install -r requirements.txt</code>
                </pre>
              </div>

              <h3>Шаг 3: Структура папок</h3>
              <p>Убедитесь, что папка `assets` со всеми ресурсами (изображения, звуки) и исполняемый файл `stockfish` находятся в корне проекта:</p>
              <div className="code-block-wrapper">
                <pre>
                  <code>{`.
├── assets/
│   ├── images/
│   └── sounds/
├── main.py
├── engine_handler.py
├── stockfish.exe (или stockfish)
└── README.md`}</code>
                </pre>
              </div>

              <h3>Шаг 4: Запуск приложения</h3>
              <p>После выполнения всех шагов запустите главный файл:</p>
              <div className="code-block-wrapper">
                <pre>
                  <code>python main.py</code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        <section id="how-to-use" className="content-section" style={{ backgroundColor: "var(--subtle-bg-color)" }}>
          <div className="container">
            <h2 className="section-title" data-aos="fade-up">
              Как пользоваться
            </h2>
            <ul className="how-to-use-list" data-aos="fade-up">
              <li>
                <b>Загрузка партии</b>: Используйте меню "Файл" для загрузки PGN, FEN или по URL.
              </li>
              <li>
                <b>Навигация</b>: Используйте кнопки <b>&lt;</b> и <b>&gt;</b> под доской или кликайте по списку ходов справа.
              </li>
              <li>
                <b>Анализ</b>: Нажмите "Анализировать партию" для полного разбора или просто перемещайтесь по ходам для анализа "на лету".
              </li>
              <li>
                <b>Игра с движком</b>: Выберите "Игра" -&gt; "Новая игра с движком", чтобы начать партию против компьютера.
              </li>
              <li>
                <b>Настройки движка</b>: На вкладке "Анализ" можно изменить силу игры и количество анализируемых линий.
              </li>
            </ul>
          </div>
        </section>

        <section id="code" className="content-section">
          <div className="container">
            <h2 className="section-title" data-aos="fade-up">
              Исходный код
            </h2>
            <p className="subtitle" data-aos="fade-up">
              Ключевые файлы проекта: `main.py` управляет GUI и логикой, а `engine_handler.py` обеспечивает взаимодействие
              с движком Stockfish.
            </p>
            <div className="code-container" data-aos="fade-up">
              <div className="code-tabs">
                {CODE_FILES.map((file) => (
                  <button
                    key={file.id}
                    className={`tab-link ${activeTab === file.id ? "active" : ""}`}
                    onClick={() => setActiveTab(file.id)}
                  >
                    {file.label}
                  </button>
                ))}
              </div>

              {CODE_FILES.map((file) => (
                <div
                  key={file.id}
                  id={file.id}
                  className={`code-content ${activeTab === file.id ? "active" : ""}`}
                >
                  <button className="copy-code-btn" onClick={() => copyCode(file.id)}>
                    <i className={`fas ${copiedId === file.id ? "fa-check" : "fa-copy"}`}></i>{" "}
                    {copiedId === file.id ? "Скопировано!" : "Копировать"}
                  </button>
                  <pre>
                    <code className={file.language}>{codeById[file.id] ?? "Загрузка..."}</code>
                  </pre>
                </div>
              ))}
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
