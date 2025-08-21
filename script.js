document.addEventListener('DOMContentLoaded', function() {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = "Мы создаём искусственный интеллект, чтобы технологии лучше работали для человека.";
        heroTitle.innerHTML = '';
        let charIndex = 0;

        text.split(' ').forEach(word => {
            const wordWrapper = document.createElement('span');
            wordWrapper.className = 'word-wrapper';
            wordWrapper.style.display = 'inline-block';

            word.split('').forEach(char => {
                const span = document.createElement('span');
                span.classList.add('char');
                span.textContent = char;
                span.style.transitionDelay = `${charIndex * 0.02}s`;
                wordWrapper.appendChild(span);
                charIndex++;
            });

            heroTitle.appendChild(wordWrapper);
            heroTitle.appendChild(document.createTextNode(' '));
        });

        setTimeout(() => {
            heroTitle.querySelectorAll('.char').forEach(charSpan => {
                charSpan.style.opacity = '1';
                charSpan.style.transform = 'translateY(0) scale(1) rotateX(0deg)';
            });
        }, 100);
    }
    
    AOS.init({
        duration: 700,
        once: true,
        offset: 50,
        easing: 'cubic-bezier(0.25, 0.8, 0.25, 1)',
    });
    
    const scrollLinks = document.querySelectorAll('a.scroll-link');
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = document.getElementById('main-header').offsetHeight || 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        });
    });

    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 400) {
                if (!backToTopButton.style.display || backToTopButton.style.display === 'none') {
                    backToTopButton.style.display = 'flex';
                    backToTopButton.style.opacity = '0';
                    backToTopButton.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        backToTopButton.style.opacity = '1';
                        backToTopButton.style.transform = 'translateY(0)';
                    }, 10);
                }
            } else {
                if (backToTopButton.style.display === 'flex') {
                    backToTopButton.style.opacity = '0';
                    backToTopButton.style.transform = 'translateY(20px)';
                    setTimeout(() => backToTopButton.style.display = 'none', 300);
                }
            }
        });
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    const header = document.getElementById('main-header');
    if (header) {
        let lastScrollTop = 0;
        window.addEventListener('scroll', () => {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        }, false);
    }

    const themeToggleButton = document.getElementById('theme-toggle-button');
    if (themeToggleButton) {
        const htmlElement = document.documentElement;
        const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        htmlElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);

        themeToggleButton.addEventListener('click', () => {
            let newTheme = htmlElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });

        function updateThemeIcon(theme) {
            const icon = themeToggleButton.querySelector('i');
            if (theme === 'dark') {
                icon.classList.remove('fa-moon'); icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun'); icon.classList.add('fa-moon');
            }
        }
    }

    const copyrightYearsElement = document.getElementById('copyright-years');
    if (copyrightYearsElement) {
        copyrightYearsElement.textContent = new Date().getFullYear();
    }

    const scrollWrapper = document.querySelector('.horizontal-scroll-wrapper');
    if (scrollWrapper) {
        scrollWrapper.addEventListener('wheel', (evt) => {
            if (evt.deltaY === 0) return;
            evt.preventDefault();
            scrollWrapper.scrollLeft += evt.deltaY > 0 ? 100 : -100;
        }, { passive: false });
    }
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
    }, {
        threshold: 0.1
    });

    const paragraphs = document.querySelectorAll('.about-paragraph');
    paragraphs.forEach(p => observer.observe(p));
});