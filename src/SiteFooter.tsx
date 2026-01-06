export default function SiteFooter() {
  return (
    <footer id="site-footer">
      <div className="container footer-container">
        <div className="footer-top">
          <div className="footer-column">
            <h3>Follow us</h3>
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
            <h3>Products</h3>
            <ul>
              <li><a href="https://pashaddd.alwaysdata.net/" target="_blank" rel="noreferrer">ReMind</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Research</h3>
            <ul>
              <li><a href="#">Publications</a></li>
              <li><a href="#">Research Papers</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="/news/">News</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Company</h3>
            <ul>
              <li><a href="/">About</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            <span>
              © SynvexAI {new Date().getFullYear()}
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
