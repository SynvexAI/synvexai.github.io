import { useEffect, useState } from "react";
import SiteFooter from "../SiteFooter";
import MainHeader from "../components/MainHeader";
import type { MainHeaderNavLink } from "../components/MainHeader";
import { useAutoTheme } from "../hooks/useAutoTheme";

const CODE_FILES = [
  {
    id: "gdint-py",
    label: "GDint.py",
    url: "https://raw.githubusercontent.com/SynvexAI/GDind/main/GDint.py",
    language: "language-python",
  },
  {
    id: "gdint-config",
    label: "GDint_config.py",
    url: "https://raw.githubusercontent.com/SynvexAI/GDind/main/GDint_config.py",
    language: "language-python",
  },
  {
    id: "capture-test",
    label: "capture_test.py",
    url: "https://raw.githubusercontent.com/SynvexAI/GDind/main/capture_test.py",
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
    "https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-bash.min.js",
  ];

  scripts.forEach((src) => {
    if (document.querySelector(`script[src="${src}"]`)) return;
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    document.body.appendChild(script);
  });
}

export default function GDintPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
  useAutoTheme();
  const [activeTab, setActiveTab] = useState(CODE_FILES[0].id);
  const [codeById, setCodeById] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);



  useEffect(() => {
    loadPrismAssets();
  }, []);

  useEffect(() => {
    document.title = "GDint - Обучение ИИ для Geometry Dash";
  }, []);

  useEffect(() => {
    document.title = "GDint - Обучение ИИ для Geometry Dash";
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
          <div className="container">
            <h1 className="section-title">GDint: Обучение ИИ для Geometry Dash</h1>
            <p className="subtitle">
              GDint - это проект на Python, который обучает агента с искусственным интеллектом автономно проходить
              уровни в игре Geometry Dash, используя алгоритм глубокого Q-обучения (DQN) на базе PyTorch.
            </p>
            <div className="hero-buttons">
              <a
                href="https://youtu.be/SU5lVPNFXbE?si=CdXQRXsWh1vdMxUH"
                target="_blank"
                className="btn btn-primary"
                rel="noreferrer"
              >
                <i className="fab fa-youtube"></i> Смотреть на YouTube
              </a>
              <a
                href="https://github.com/SynvexAI/GDind"
                target="_blank"
                className="btn btn-secondary"
                rel="noreferrer"
              >
                <i className="fab fa-github"></i> Код на GitHub
              </a>
            </div>
            <div className="video-container">
              <iframe
                src="https://www.youtube.com/embed/SU5lVPNFXbE"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </section>

        <section id="features" className="content-section">
          <div className="container">
            <h2 className="section-title">
              Основные возможности
            </h2>
            <ul className="feature-list">
              <li className="feature-item">
                <i className="fas fa-robot"></i>
                <h3>Автономное обучение</h3>
                <p>Агент использует алгоритм DQN для изучения игрового процесса через многократные попытки.</p>
              </li>
              <li className="feature-item">
                <i className="fas fa-camera"></i>
                <h3>Захват экрана</h3>
                <p>Автоматическое обнаружение и захват окна игры Geometry Dash для анализа.</p>
              </li>
              <li className="feature-item">
                <i className="fas fa-image"></i>
                <h3>Обработка изображений</h3>
                <p>Преобразование кадров в формат, подходящий для нейронной сети (разрешение, цвет/монохром).</p>
              </li>
              <li className="feature-item">
                <i className="fas fa-mouse-pointer"></i>
                <h3>Имитация ввода</h3>
                <p>Эмуляция кликов мыши для выполнения прыжков в игре на основе решений ИИ.</p>
              </li>
              <li className="feature-item">
                <i className="fas fa-chart-line"></i>
                <h3>Графический интерфейс</h3>
                <p>GUI для мониторинга статистики обучения (Q-значения, потери, награды) и управления процессом.</p>
              </li>
              <li className="feature-item">
                <i className="fas fa-cogs"></i>
                <h3>Гибкая конфигурация</h3>
                <p>Простая настройка всех ключевых параметров через отдельный конфигурационный файл.</p>
              </li>
            </ul>
          </div>
        </section>

        <section id="setup" className="content-section">
          <div className="container">
            <h2 className="section-title">
              Установка и запуск
            </h2>
            <div>
              <h3>Шаг 1: Требования</h3>
              <ul className="setup-steps">
                <li>
                  <b>Python:</b> Версия 3.7 или выше.
                </li>
                <li>
                  <b>Pip:</b> Установщик пакетов Python.
                </li>
                <li>
                  <b>Geometry Dash:</b> Установленная игра.
                </li>
                <li>
                  <b>Зависимости:</b> PyTorch, OpenCV, NumPy и другие.
                </li>
              </ul>

              <h3>Шаг 2: Установка зависимостей</h3>
              <p>Клонируйте репозиторий и установите необходимые пакеты. Рекомендуется использовать виртуальное окружение.</p>
              <div className="code-block-wrapper">
                <pre>
                  <code>{`# Создание и активация виртуального окружения
python -m venv gdint_env
# Windows:
gdint_env\\Scripts\\activate
# Linux/macOS:
source gdint_env/bin/activate

# Установка зависимостей
pip install torch torchvision torchaudio opencv-python numpy mss pynput pygetwindow Pillow pandas matplotlib`}</code>
                </pre>
              </div>

              <h3>Шаг 3: Настройка игры</h3>
              <ul className="setup-steps">
                <li>
                  Включите <b>оконный режим</b> в настройках графики Geometry Dash.
                </li>
                <li>
                  Создайте шаблон `game_over_template.png`. Сделайте скриншот экрана "Game Over", вырежьте уникальный
                  фрагмент (например, кнопку повтора) и сохраните его в папке проекта.
                </li>
              </ul>

              <h3>Шаг 4: Запуск</h3>
              <p>Запустите Geometry Dash, а затем выполните главный скрипт. Во время обратного отсчета переключитесь на окно игры.</p>
              <div className="code-block-wrapper">
                <pre>
                  <code>python GDint.py</code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        <section id="code" className="content-section">
          <div className="container">
            <h2 className="section-title">
              Исходный код
            </h2>
            <div className="code-container">
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
