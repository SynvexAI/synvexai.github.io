import React, { useRef } from "react";

type RoadmapItemProps = {
  title: string;
  date: string;
  items: string[];
  status: "completed" | "active" | "planned";
  delay: number;
  isLast: boolean;
};

function RoadmapItem({title, date, items, status}: RoadmapItemProps) {
  return (
    <div
      className={`roadmap-step ${status}`}
    >
      <div className="roadmap-marker-container">
        <div className="roadmap-line"></div>
        <div className="roadmap-dot"></div>
      </div>

      <div className="roadmap-card">
        <span className="roadmap-date">{date}</span>
        <h3 className="roadmap-title">{title}</h3>
        <ul className="roadmap-list">
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Roadmap() {
  const steps = [
    {
      title: "Начало Пути",
      date: "5 мая 2025",
      status: "completed" as const,
      items: [
        "Создание проекта SynvexAI",
        "Появление и развитие социальных сетей",
        "Формирование нашей цели",
        "Первые друзья и единомышленники"
      ]
    },
    {
      title: "Создание Mind 2",
      date: "18 мая 2025",
      status: "completed" as const,
      items: [
        "Разработка, обучение и публикация модели Mind 2 в открытом доступе"
      ]
    },
    {
      title: "AI Learns Geometry Dash",
      date: "29 мая 2025",
      status: "completed" as const,
      items: [
        "Мы создали ИИ, который играет в Geometry Dash, используя Python, PyTorch и полностью настраиваемый графический интерфейс. Этот маленький кубик, работающий на основе Deep Q-Learning, учится выживать, преодолевая трудности, шипы и множество проб и ошибок."
      ]
      },
    {
      title: "Создание нашего сайта",
      date: "29 мая 2025",
      status: "completed" as const,
      items: [
        "Мы без сайта — как робот без Wi-Fi. Мы наконец это исправили. Теперь у нас есть сайт, и он реально работает (в отличие от кофемашины). Мы сделали его умным, аккуратным и без всплывающих окон — именно так, как нам нравится."
      ]
      },
        {
      title: "Представляем ChessAI",
      date: "9 августа 2025",
      status: "completed" as const,
      items: [
        "ChessAI — это инструмент для анализа шахматных партий, использующий движок Stockfish и графический интерфейс на Python. Он позволяет загружать партии в формате PGN, анализировать ходы и получать рекомендации по улучшению игры."
      ]
      },
              {
      title: "Обучение Mind 4",
      date: "2 ноября 2025",
      status: "completed" as const,
      items: [
          "Разработка, обучение и публикация модели Mind 4 в открытом доступе на GitHub. Веса остались закрытыми и не будут опубликованы.",
          "Создание исследовательской статьи, описывающей архитектуру и процесс обучения модели."
      ]
      },
    {
      title: "Открываем доступ к ReMind",
      date: "1 декабря 2025",
      status: "completed" as const,
      items: [
        "Мы решили не ждать идеального релиза, а показать вам процесс изнутри. Прямо сейчас мы запустили Live Demo проекта ReMind. Это живой проект, который растет и меняется каждый день."
      ]
      },
    {
      title: "Глобальное масштабирование",
      date: "Q1 2026",
      status: "active" as const,
      items: [
        "Обучение Mind 5",
        "Укрепление партнерств с академическими и промышленными организациями.",
        "Активное участие в сообществе ИИ через публикации, конференции и открытые инициативы.",
        "Мы планируем инвестировать в передовые вычислительные ресурсы, чтобы ускорить обучение моделей и повысить их эффективность."
      ]
    }
  ];

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleWheel = (_e: React.WheelEvent) => {
    if (scrollContainerRef.current) {
        // Scroll handling logic can be implemented here if needed
    }
  };

  return (
    <section className="roadmap-section" id="roadmap">
      <div className="container">
        <div className="roadmap-horizontal-scroll" ref={scrollContainerRef} onWheel={handleWheel}>
          <div className="roadmap-track">
            {steps.map((step, index) => (
              <RoadmapItem
                key={index}
                {...step}
                isLast={index === steps.length - 1}
                delay={index * 100}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
