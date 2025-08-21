document.addEventListener('DOMContentLoaded', function() {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = "SynvexAI — коммерческая организация, которая создает интеллектуальные продукты на стыке нейронных сетей, когнитивной науки и проектирования, ориентированного на человека.";
        heroTitle.innerHTML = '';
        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.classList.add('char');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.transitionDelay = `${index * 0.02}s`;
            heroTitle.appendChild(span);
        });
        setTimeout(() => {
            heroTitle.querySelectorAll('.char').forEach(charSpan => {
                charSpan.style.opacity = '1';
                charSpan.style.transform = 'translateY(0) scale(1) rotateX(0deg)';
            });
        }, 100);
    }
    
    AOS.init({
        duration: 800,
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
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 400) {
            if (!backToTopButton.style.display || backToTopButton.style.display === 'none') {
                backToTopButton.style.display = 'flex';
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

    const header = document.getElementById('main-header');
    const heroSection = document.querySelector('.hero');
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop && scrollTop > header.offsetHeight){
            header.classList.add('header-hidden');
        } else {
            header.classList.remove('header-hidden');
        }
        
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;

        if (heroSection) {
            const scrollValue = window.pageYOffset;
            heroSection.style.backgroundPosition = `50% ${50 + scrollValue * 0.1}%`;
        }

    }, false);

    const themeToggleButton = document.getElementById('theme-toggle-button');
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

    const copyrightYearsElement = document.getElementById('copyright-years');
    if (copyrightYearsElement) {
        const startYear = 2024;
        const currentYear = new Date().getFullYear();
        copyrightYearsElement.textContent = startYear === currentYear ? `© ${currentYear}` : `© ${startYear}–${currentYear}`;
    }
    
    const scrollWrapper = document.querySelector('.horizontal-scroll-wrapper');
    if (scrollWrapper) {
        scrollWrapper.addEventListener('wheel', (evt) => {
            if (evt.deltaY === 0) return;
            evt.preventDefault();
            scrollWrapper.scrollLeft += evt.deltaY;
        }, { passive: false });
    }

    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    document.addEventListener('mousemove', e => {
        cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        cursorFollower.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    });

    const interactiveElements = document.querySelectorAll('a, button, .news-wow-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
            cursorFollower.classList.add('cursor-follower-hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
            cursorFollower.classList.remove('cursor-follower-hover');
        });
    });

    const tiltCards = document.querySelectorAll('.news-wow-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const rotateX = -y / 30;
            const rotateY = x / 30;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
});