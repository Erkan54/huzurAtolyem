/**
 * Huzur Atölyem - Core & Hero Slider Interactions
 */

// =========================================================================
// 0. Preloader (Krem Arka Plan + Dönen Beyaz Favicon + Fade Yazı)
// =========================================================================
const hidePreloader = () => {
    const preloader = document.getElementById('preloader');
    if (preloader && !preloader.classList.contains('fade-out')) {
        preloader.classList.add('fade-out');
        setTimeout(() => {
            if (preloader.parentNode) preloader.remove();
        }, 380);
    }
};

window.addEventListener('load', () => {
    setTimeout(hidePreloader, 500);
});
setTimeout(hidePreloader, 1000);

document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================================================
    // 1. Mobile Hamburger Menu
    // =========================================================================
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        links.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // =========================================================================
    // 2. Navbar Dynamic Scroll Effect
    // =========================================================================
    const navbar = document.querySelector('.navbar');
    
    const handleNavbarScroll = () => {
        if (!navbar) return;
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleNavbarScroll);
    handleNavbarScroll(); // Initial check

    // =========================================================================
    // 3. Hero Slideshow System (Seamless Continuous Loop)
    // =========================================================================
    const slides = document.querySelectorAll('.hero-slide');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    let slideInterval = null;
    const slideDuration = 3800; // 3.8 seconds per slide for lively smooth flow

    if (totalSlides > 0) {
        const updateSlideUI = (index) => {
            slides.forEach((slide, idx) => {
                if (idx === index) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });
        };

        const goToSlide = (index) => {
            currentSlide = (index + totalSlides) % totalSlides;
            updateSlideUI(currentSlide);
        };

        const nextSlide = () => {
            goToSlide(currentSlide + 1);
        };

        const prevSlide = () => {
            goToSlide(currentSlide - 1);
        };

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                nextSlide();
                resetAutoSlide();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                prevSlide();
                resetAutoSlide();
            });
        }

        // Reliable auto-slide without pausing on full screen hover
        const startAutoSlide = () => {
            if (slideInterval) clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, slideDuration);
        };

        const resetAutoSlide = () => {
            startAutoSlide();
        };

        // Start immediately
        startAutoSlide();

        // Touch & Swipe Support for Mobile
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            let startX = 0;
            let endX = 0;

            heroSection.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
            }, { passive: true });

            heroSection.addEventListener('touchend', (e) => {
                endX = e.changedTouches[0].clientX;
                const diff = startX - endX;
                if (Math.abs(diff) > 50) {
                    if (diff > 0) {
                        nextSlide();
                    } else {
                        prevSlide();
                    }
                    resetAutoSlide();
                }
            }, { passive: true });
        }
    }

    // =========================================================================
    // 4. Staggered Scroll Reveal Animations
    // =========================================================================
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOptions = {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
    };

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
    
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // =========================================================================
    // 5. Floating Rattan Strands / Fibers Canvas Animation (All the way to Footer)
    // =========================================================================
    const canvas = document.getElementById('rattan-particles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const parent = canvas.parentElement || document.body;

        let width = 0;
        let height = 0;

        const updateDimensions = () => {
            const newW = parent.offsetWidth || window.innerWidth;
            const newH = Math.max(parent.scrollHeight, parent.offsetHeight, document.body.scrollHeight);
            if (newW !== width || Math.abs(newH - height) > 20) {
                width = canvas.width = newW;
                height = canvas.height = newH;
            }
        };
        
        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        window.addEventListener('load', updateDimensions);
        setTimeout(updateDimensions, 400);
        setTimeout(updateDimensions, 1200);

        if (window.ResizeObserver) {
            new ResizeObserver(() => updateDimensions()).observe(parent);
        }

        // Distribute particles across the full scrollable height to footer
        const particleCount = window.innerWidth < 768 ? 32 : 54;
        const particles = [];

        class RattanParticle {
            constructor() {
                this.reset(true);
            }

            reset(initial = false) {
                this.x = Math.random() * (width || window.innerWidth);
                this.y = initial ? Math.random() * (height || 2600) : -30;
                this.baseX = this.x;
                this.size = Math.random() * 14 + 10;
                this.speedY = Math.random() * 0.4 + 0.18;
                this.rotation = Math.random() * Math.PI * 2;
                this.rotSpeed = (Math.random() - 0.5) * 0.012;
                this.opacity = Math.random() * 0.32 + 0.14;
                this.type = Math.floor(Math.random() * 3); // 0: Strand, 1: Loop, 2: Dot
                this.color = Math.random() > 0.5 ? 'rgba(197, 168, 128,' : 'rgba(142, 115, 91,';
                this.waveOffset = Math.random() * Math.PI * 2;
                this.driftAmp = Math.random() * 20 + 8;
            }

            update(time) {
                this.y += this.speedY;
                this.x = this.baseX + Math.sin(time * 0.0008 + this.waveOffset) * this.driftAmp;
                this.rotation += this.rotSpeed;

                if (this.y > height + 40) {
                    this.reset(false);
                }
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);
                ctx.strokeStyle = `${this.color} ${this.opacity})`;
                ctx.fillStyle = `${this.color} ${this.opacity * 0.8})`;
                ctx.lineWidth = 1.6;
                ctx.lineCap = 'round';

                if (this.type === 0) {
                    // Curved Rattan Fiber Strand
                    ctx.beginPath();
                    ctx.moveTo(-this.size, 0);
                    ctx.quadraticCurveTo(0, -this.size * 0.5, this.size, 0);
                    ctx.stroke();
                } else if (this.type === 1) {
                    // Natural Rattan Loop / Knot
                    ctx.beginPath();
                    ctx.ellipse(0, 0, this.size * 0.7, this.size * 0.35, Math.PI / 4, 0, Math.PI * 2);
                    ctx.stroke();
                } else {
                    // Delicate Organic Particle
                    ctx.beginPath();
                    ctx.arc(0, 0, this.size * 0.2, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.restore();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new RattanParticle());
        }

        let animationFrameId;
        const animate = (time) => {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.update(time);
                p.draw();
            });
            animationFrameId = requestAnimationFrame(animate);
        };

        animate(0);

        // Pause animation when tab is inactive to save battery/resources
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(animationFrameId);
            } else {
                animate(performance.now());
            }
        });
    }

});
