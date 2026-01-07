export default function SiteFooter() {
  return (
    <footer id="site-footer">
      <div className="container footer-container">
        <div className="footer-top">
          <div className="footer-column">
            <h3>Следите за нами</h3>
            <div className="footer-social-links">
              <a href="https://x.com/SynvexAI" target="_blank" title="X (Twitter)" rel="noreferrer">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://www.youtube.com/@SynvexAI" target="_blank" title="YouTube" rel="noreferrer">
                <i className="fab fa-youtube"></i>
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
          </div>

          <div className="footer-column">
            <h3>Продукты</h3>
            <ul>
              <li><a href="https://pashaddd.alwaysdata.net/" target="_blank" rel="noreferrer">ReMind</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Исследования</h3>
            <ul>
              <li><a href="#">Публикации</a></li>
              <li><a href="#">Научные статьи</a></li>
              <li><a href="#">Блог</a></li>
              <li><a href="/news/">Новости</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Узнать больше</h3>
            <ul>
              <li><a href="/">О нас</a></li>
              <li><a href="#">Карьера</a></li>
              <li><a href="#">Контакты</a></li>
              <li><a href="#">Политика конфиденциальности</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            <span>
              SynvexAI © 2025-{new Date().getFullYear()}
            </span>
            <a href="#" className="manage-cookies-link">
              Управление cookie
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
