/**
 * Huzur Atölyem - Core Interactions, Firebase Cloud Firestore & Dynamic Indexing System
 */

// =========================================================================
// 0. Preloader (Sıcak Krem Arka Plan + Dönen Beyaz Favicon + Fade Yazı - 1.5s)
// =========================================================================
const hidePreloader = () => {
    const preloader = document.getElementById('preloader');
    if (preloader && !preloader.classList.contains('fade-out')) {
        preloader.classList.add('fade-out');
        setTimeout(() => {
            if (preloader.parentNode) preloader.remove();
        }, 450);
    }
};

window.addEventListener('load', () => {
    setTimeout(hidePreloader, 1500);
});
setTimeout(hidePreloader, 2200);

// =========================================================================
// Firebase Cloud Firestore Setup (Realtime Database)
// =========================================================================
const firebaseConfig = {
    apiKey: "AIzaSyDHYAbpuIh6HJwnoZGRd52UJ1c0yVgPPa0",
    authDomain: "huzuratolyem-rattan.firebaseapp.com",
    projectId: "huzuratolyem-rattan",
    storageBucket: "huzuratolyem-rattan.firebasestorage.app",
    messagingSenderId: "1054362594241",
    appId: "1:1054362594241:web:36163f1715ae72e14d9d40",
    measurementId: "G-KRBH1J29X7"
};

let db = null;
if (typeof firebase !== 'undefined' && firebase.initializeApp) {
    try {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        if (firebase.firestore) {
            db = firebase.firestore();
        }
    } catch (err) {
        console.warn('Firebase initialization note:', err);
    }
}

// =========================================================================
// Database Core Products & Defaults
// =========================================================================
const DEFAULT_PRODUCTS = [
    {
        id: 'prod-1',
        title: 'El Yapımı Rattan Saç Tokası',
        desc: 'Zarif boncuk detaylı, %100 doğal el yapımı saç aksesuarı.',
        price: 'Fiyat Sorunuz',
        category: 'aksesuar-toka',
        categoryName: 'Rattan Aksesuar & Toka',
        badge: 'Yeni Ürün',
        badgeClass: 'new',
        image: './foto_1.png',
        alt: 'El Yapımı Rattan Saç Tokası ve Doğal Aksesuar Sakarya',
        pageUrl: 'urun-rattan-sac-tokasi.html',
        slug: 'urun-rattan-sac-tokasi',
        active: true,
        order: 1
    },
    {
        id: 'prod-2',
        title: '20 cm Rattan Duvar Süsü',
        desc: 'Doğal el örgüsü, zarif çiçek formunda duvar dekoru.',
        price: '150 TL',
        category: 'duvar-susu',
        categoryName: 'Rattan Duvar Süsü',
        badge: 'Popüler',
        badgeClass: 'populer',
        image: './foto_4.png',
        alt: '20 cm Bohem El Yapımı Rattan Duvar Süsü Sakarya',
        pageUrl: 'urun-20-cm-rattan-duvar-susu.html',
        slug: 'urun-20-cm-rattan-duvar-susu',
        active: true,
        order: 2
    },
    {
        id: 'prod-3',
        title: 'Özel Tasarım Rölyef Çerçeve',
        desc: 'Mutfak ve yemek alanları için 3 boyutlu el işçiliği tablo.',
        price: 'Fiyat Sorunuz',
        category: 'tablo-sanat',
        categoryName: 'Tablo & Sanat',
        badge: 'Özel Çalışma',
        badgeClass: 'ozel-calisma',
        image: './foto_2.png',
        alt: 'Özel Tasarım 3D Rölyef Tablo ve Çerçeve Sakarya',
        pageUrl: 'urun-ozel-tasarim-rolyef-cerceve.html',
        slug: 'urun-ozel-tasarim-rolyef-cerceve',
        active: true,
        order: 3
    },
    {
        id: 'prod-4',
        title: '25 cm Rattan Duvar Süsü',
        desc: 'Salon ve yatak odalarına doğal ve sıcak bir dokunuş.',
        price: '200 TL',
        category: 'duvar-susu',
        categoryName: 'Rattan Duvar Süsü',
        badge: 'Çok Satan',
        badgeClass: 'cok-satan',
        image: './foto_5.png',
        alt: '25 cm Bohem El Yapımı Rattan Duvar Süsü Sakarya',
        pageUrl: 'urun-25-cm-rattan-duvar-susu.html',
        slug: 'urun-25-cm-rattan-duvar-susu',
        active: true,
        order: 4
    },
    {
        id: 'prod-5',
        title: 'El Emeği Vav Hat Tablo',
        desc: 'Geleneksel Vav motifi ve çiçek bezemeli çerçeveli eser.',
        price: 'Fiyat Sorunuz',
        category: 'tablo-sanat',
        categoryName: 'Tablo & Sanat',
        badge: 'El İşi Sanat',
        badgeClass: 'el-isi',
        image: './foto_3.png',
        alt: 'El Emeği Vav Hat Sanatı Tablo Sakarya',
        pageUrl: 'urun-el-emegi-vav-hat-tablo.html',
        slug: 'urun-el-emegi-vav-hat-tablo',
        active: true,
        order: 5
    },
    {
        id: 'prod-6',
        title: '38 cm Rattan Duvar Süsü',
        desc: 'Geniş duvarlar ve ana odak noktaları için dev boy zarafet.',
        price: '350 TL',
        category: 'duvar-susu',
        categoryName: 'Rattan Duvar Süsü',
        badge: 'Büyük Boy',
        badgeClass: 'buyuk-boy',
        image: './foto_6.png',
        alt: '38 cm Büyük Boy Bohem Rattan Duvar Süsü Sakarya',
        pageUrl: 'urun-38-cm-rattan-duvar-susu.html',
        slug: 'urun-38-cm-rattan-duvar-susu',
        active: true,
        order: 6
    }
];

// Helper to read local products safely
const getStoredProducts = () => {
    try {
        const stored = localStorage.getItem('huzur_custom_products');
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch (e) {
        console.error('Error reading localStorage products:', e);
    }
    return DEFAULT_PRODUCTS;
};

// Helper to save local products safely
const saveStoredProducts = (products) => {
    try {
        localStorage.setItem('huzur_custom_products', JSON.stringify(products));
    } catch (e) {
        console.warn('Storage quota warning, keeping active in memory:', e);
    }
};

// Helper slugify
const slugify = (text) => {
    const trMap = {
        'ç': 'c', 'Ç': 'c',
        'ğ': 'g', 'Ğ': 'g',
        'ı': 'i', 'I': 'i', 'İ': 'i',
        'ö': 'o', 'Ö': 'o',
        'ş': 's', 'Ş': 's',
        'ü': 'u', 'Ü': 'u'
    };
    return text
        .split('')
        .map(char => trMap[char] || char)
        .join('')
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
};

// Helper: Compress/Resize Image to lightweight format (<50KB)
const compressImage = (file, maxWidth = 600, maxHeight = 600, quality = 0.75) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.round((width * maxHeight) / height);
                        height = maxHeight;
                    }
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
                resolve(compressedDataUrl);
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
};

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
    handleNavbarScroll();

    // =========================================================================
    // 3. Hero Slideshow System
    // =========================================================================
    const slides = document.querySelectorAll('.hero-slide');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    let slideInterval = null;
    const slideDuration = 3800;

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

        const nextSlide = () => goToSlide(currentSlide + 1);
        const prevSlide = () => goToSlide(currentSlide - 1);

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

        const startAutoSlide = () => {
            if (slideInterval) clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, slideDuration);
        };

        const resetAutoSlide = () => startAutoSlide();
        startAutoSlide();

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
                    if (diff > 0) nextSlide();
                    else prevSlide();
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
        threshold: 0.1,
        rootMargin: "0px 0px -30px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);
    
    revealElements.forEach(el => revealObserver.observe(el));

    // =========================================================================
    // 5. Floating Rattan Strands Canvas
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

        const particleCount = window.innerWidth < 768 ? 26 : 46;
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
                this.opacity = Math.random() * 0.3 + 0.12;
                this.type = Math.floor(Math.random() * 3);
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
                ctx.lineWidth = 1.5;
                ctx.lineCap = 'round';

                if (this.type === 0) {
                    ctx.beginPath();
                    ctx.moveTo(-this.size, 0);
                    ctx.quadraticCurveTo(0, -this.size * 0.5, this.size, 0);
                    ctx.stroke();
                } else if (this.type === 1) {
                    ctx.beginPath();
                    ctx.ellipse(0, 0, this.size * 0.7, this.size * 0.35, Math.PI / 4, 0, Math.PI * 2);
                    ctx.stroke();
                } else {
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

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(animationFrameId);
            } else {
                animate(performance.now());
            }
        });
    }

    // =========================================================================
    // 6. Vitrin & Product Card Renderer
    // =========================================================================
    const collectionGrid = document.getElementById('collection-grid');
    const catalogProductsGrid = document.getElementById('catalogProductsGrid');
    const catalogCountText = document.getElementById('catalogCountText');
    const catalogEmptyState = document.getElementById('catalogEmptyState');
    const catalogSearchInput = document.getElementById('catalogSearchInput');

    let currentCategoryFilter = 'all';
    let currentSearchTerm = '';

    const createProductCard = (prod, index) => {
        const card = document.createElement('div');
        card.className = `product-card reveal stagger-${(index % 3) + 1} active`;
        card.setAttribute('data-category', prod.category || 'duvar-susu');

        const badgeHtml = prod.badge ? `<span class="product-badge ${prod.badgeClass || ''}">${prod.badge}</span>` : '';
        const isPriceAsk = !prod.price || prod.price.toLowerCase().includes('sor') || prod.price.toLowerCase().includes('fiyat');
        const priceHtml = isPriceAsk 
            ? `<span class="price-ask">${prod.price || 'Fiyat Sorunuz'}</span>` 
            : `<span class="product-price">${prod.price}</span>`;

        const waMessage = encodeURIComponent(`Merhaba, ${prod.title} ${!isPriceAsk ? `(${prod.price})` : ''} hakkında bilgi ve sipariş detaylarını almak istiyorum.`);
        const detailLink = prod.pageUrl || `urun.html?id=${prod.id}`;

        card.innerHTML = `
            ${badgeHtml}
            <a href="${detailLink}" class="product-image-wrap" title="${prod.title} İncele">
                <img src="${prod.image}" alt="${prod.alt || prod.title}" loading="lazy">
                <div class="product-image-overlay">
                    <span class="btn-overlay-inspect">Detaylı İncele</span>
                </div>
            </a>
            <div class="product-info">
                <div>
                    <h3 class="product-title"><a href="${detailLink}">${prod.title}</a></h3>
                    <p class="product-desc">${prod.desc || ''}</p>
                </div>
                <div>
                    <div class="product-price-tag">
                        ${priceHtml}
                    </div>
                    <div class="card-btn-group">
                        <a href="${detailLink}" class="btn-detail">İncele</a>
                        <a href="https://wa.me/905337009454?text=${waMessage}" target="_blank" class="btn-whatsapp">
                            <svg viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                            Sipariş
                        </a>
                    </div>
                </div>
            </div>
        `;
        return card;
    };

    const renderProductsToContainer = (container, category = 'all', searchQuery = '') => {
        if (!container) return;
        const allProducts = getStoredProducts();
        
        const filtered = allProducts.filter(p => {
            const matchesCat = (category === 'all' || p.category === category);
            const matchesSearch = !searchQuery || 
                p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                (p.desc && p.desc.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (p.categoryName && p.categoryName.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesCat && matchesSearch;
        });

        container.innerHTML = '';

        if (filtered.length === 0) {
            if (catalogEmptyState) catalogEmptyState.classList.remove('hidden');
        } else {
            if (catalogEmptyState) catalogEmptyState.classList.add('hidden');
            filtered.forEach((prod, index) => {
                container.appendChild(createProductCard(prod, index));
            });
        }

        if (catalogCountText) {
            catalogCountText.innerHTML = `Toplam <strong>${filtered.length}</strong> el emeği ürün listeleniyor`;
        }
    };

    // Render Initial UI immediately from cache/defaults
    if (collectionGrid) renderProductsToContainer(collectionGrid, 'all');
    if (catalogProductsGrid) {
        const urlParams = new URLSearchParams(window.location.search);
        const catParam = urlParams.get('cat');
        if (catParam) {
            currentCategoryFilter = catParam;
            const targetTab = document.querySelector(`.catalog-tabs .menu-tab[data-category="${catParam}"]`);
            if (targetTab) {
                document.querySelectorAll('.catalog-tabs .menu-tab').forEach(t => t.classList.remove('active'));
                targetTab.classList.add('active');
            }
        }
        renderProductsToContainer(catalogProductsGrid, currentCategoryFilter, currentSearchTerm);
    }

    // =========================================================================
    // 7. Real-Time Firebase Cloud Firestore Sync
    // =========================================================================
    if (db) {
        // Listen to Firestore real-time updates
        db.collection("products").onSnapshot((snapshot) => {
            if (snapshot.empty) {
                console.log("Firestore collection is empty, automatically seeding default products...");
                saveStoredProducts(DEFAULT_PRODUCTS);
                DEFAULT_PRODUCTS.forEach((item) => {
                    db.collection("products").doc(item.id).set({
                        ...item,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    }).catch(e => console.warn("Firestore seed note:", e));
                });
                if (collectionGrid) renderProductsToContainer(collectionGrid, currentCategoryFilter);
                if (catalogProductsGrid) renderProductsToContainer(catalogProductsGrid, currentCategoryFilter, currentSearchTerm);
                renderAdminPanelProducts();
            } else {
                const cloudProducts = [];
                snapshot.forEach((doc) => {
                    cloudProducts.push({ id: doc.id, ...doc.data() });
                });

                if (cloudProducts.length > 0) {
                    cloudProducts.sort((a, b) => (a.order || 99) - (b.order || 99));
                    saveStoredProducts(cloudProducts);
                    if (collectionGrid) renderProductsToContainer(collectionGrid, currentCategoryFilter);
                    if (catalogProductsGrid) renderProductsToContainer(catalogProductsGrid, currentCategoryFilter, currentSearchTerm);
                    renderAdminPanelProducts();
                }
            }
        }, (error) => {
            console.warn("Firestore realtime sync offline or permission issue, fallback to localStorage:", error.message);
            renderAdminPanelProducts();
        });
    }

    // Category Tabs Switching
    const categoryTabButtons = document.querySelectorAll('.menu-tabs .menu-tab');
    categoryTabButtons.forEach(tab => {
        tab.addEventListener('click', () => {
            const parent = tab.closest('.menu-tabs');
            if (parent) {
                parent.querySelectorAll('.menu-tab').forEach(t => t.classList.remove('active'));
            }
            tab.classList.add('active');
            currentCategoryFilter = tab.getAttribute('data-category') || 'all';

            const targetGrid = catalogProductsGrid || collectionGrid;
            renderProductsToContainer(targetGrid, currentCategoryFilter, currentSearchTerm);
        });
    });

    // Search Input Listener
    if (catalogSearchInput) {
        catalogSearchInput.addEventListener('input', (e) => {
            currentSearchTerm = e.target.value.trim();
            renderProductsToContainer(catalogProductsGrid, currentCategoryFilter, currentSearchTerm);
        });
    }

    const btnResetFilter = document.getElementById('btnResetFilter');
    if (btnResetFilter) {
        btnResetFilter.addEventListener('click', () => {
            if (catalogSearchInput) catalogSearchInput.value = '';
            currentSearchTerm = '';
            currentCategoryFilter = 'all';
            document.querySelectorAll('.catalog-tabs .menu-tab').forEach((t, i) => {
                t.classList.toggle('active', i === 0);
            });
            renderProductsToContainer(catalogProductsGrid, 'all', '');
        });
    }

    // =========================================================================
    // 8. Dynamic Universal Product Page Loader (urun.html)
    // =========================================================================
    window.renderDynamicProductDetail = (productId) => {
        const products = getStoredProducts();
        let product = null;

        if (productId) {
            product = products.find(p => p.id === productId || p.slug === productId || (p.pageUrl && p.pageUrl.includes(productId)));
        }

        if (!product && products.length > 0) {
            product = products[0];
        }

        if (!product) return;

        // Set Title & Meta Tags
        document.title = `${product.title} | Doğal Rattan & Bohem - Huzur Atölyem`;
        
        const metaDesc = document.getElementById('metaDesc');
        if (metaDesc) metaDesc.content = `${product.title} - Sakarya el emeği %100 doğal rattan tasarımı. ${product.desc || ''}`;

        const ogTitle = document.getElementById('ogTitle');
        if (ogTitle) ogTitle.content = `${product.title} | Huzur Atölyem`;

        const ogDesc = document.getElementById('ogDesc');
        if (ogDesc) ogDesc.content = product.desc || 'Sakarya el yapımı doğal rattan tasarım.';

        const ogImage = document.getElementById('ogImage');
        if (ogImage) ogImage.content = product.image ? new URL(product.image, window.location.href).href : '';

        // Update DOM Elements
        const bcTitle = document.getElementById('bcProductTitle');
        if (bcTitle) bcTitle.textContent = product.title;

        const dynTitle = document.getElementById('dynProductTitle');
        if (dynTitle) dynTitle.textContent = product.title;

        const dynDesc = document.getElementById('dynProductDesc');
        if (dynDesc) dynDesc.textContent = product.desc || '';

        const dynPrice = document.getElementById('dynProductPrice');
        if (dynPrice) dynPrice.textContent = product.price || 'Fiyat Sorunuz';

        const dynBadge = document.getElementById('dynProductBadge');
        if (dynBadge) {
            if (product.badge) {
                dynBadge.textContent = product.badge;
                dynBadge.className = `product-badge ${product.badgeClass || ''}`;
                dynBadge.style.display = 'inline-block';
            } else {
                dynBadge.style.display = 'none';
            }
        }

        const dynImg = document.getElementById('dynProductImg');
        if (dynImg) {
            dynImg.src = product.image;
            dynImg.alt = product.alt || product.title;
        }

        const dynCat = document.getElementById('dynProductCat');
        if (dynCat) {
            dynCat.textContent = product.categoryName || 'Doğal Rattan & Bohem Tasarım';
        }

        const waMsg = encodeURIComponent(`Merhaba, ${product.title} (${product.price || ''}) hakkında sipariş vermek ve bilgi almak istiyorum.`);
        const dynBtnWa = document.getElementById('dynBtnWa');
        if (dynBtnWa) dynBtnWa.href = `https://wa.me/905337009454?text=${waMsg}`;

        const dynFloatingWa = document.getElementById('dynFloatingWa');
        if (dynFloatingWa) dynFloatingWa.href = `https://wa.me/905337009454?text=${waMsg}`;

        // Inject Dynamic JSON-LD Schema
        const schemaEl = document.getElementById('dynamicProductSchema');
        if (schemaEl) {
            const schemaData = {
                "@context": "https://schema.org/",
                "@type": "Product",
                "name": product.title,
                "image": [product.image ? new URL(product.image, window.location.href).href : ''],
                "description": product.desc || product.title,
                "sku": "HA-" + (product.id || 'PROD'),
                "brand": {
                    "@type": "Brand",
                    "name": "Huzur Atölyem"
                },
                "offers": {
                    "@type": "Offer",
                    "url": window.location.href,
                    "priceCurrency": "TRY",
                    "price": product.price ? product.price.replace(/[^0-9]/g, '') || "150.00" : "150.00",
                    "availability": "https://schema.org/InStock",
                    "itemCondition": "https://schema.org/NewCondition"
                },
                "material": "%100 Doğal Rattan",
                "countryOfOrigin": "TR"
            };
            schemaEl.textContent = JSON.stringify(schemaData, null, 2);
        }

        // Render Related Products (Excluding current)
        const relatedGrid = document.getElementById('dynRelatedGrid');
        if (relatedGrid) {
            relatedGrid.innerHTML = '';
            const otherProducts = products.filter(p => p.id !== product.id).slice(0, 3);
            otherProducts.forEach((p, idx) => {
                relatedGrid.appendChild(createProductCard(p, idx));
            });
        }
    };

    // =========================================================================
    // 9. Admin Panel & Automated Google Index / Sitemap Generator
    // =========================================================================
    const adminAuthModal = document.getElementById('admin-auth-modal');
    const adminPanelModal = document.getElementById('admin-panel-modal');
    const openAdminAuthBtn = document.getElementById('open-admin-auth');
    const closeAdminAuthBtn = document.getElementById('close-admin-auth');
    const closeAdminPanelBtn = document.getElementById('close-admin-panel');
    const adminAuthForm = document.getElementById('admin-auth-form');
    const adminPasswordInput = document.getElementById('admin-password-input');
    const adminAuthError = document.getElementById('admin-auth-error');

    const adminProductTableBody = document.getElementById('admin-products-table-body');
    const adminProductCount = document.getElementById('admin-product-count');
    const btnOpenAddProduct = document.getElementById('btn-open-add-product');
    const btnCloseForm = document.getElementById('btn-close-form');
    const adminProductFormContainer = document.getElementById('admin-product-form-container');
    const adminProductForm = document.getElementById('admin-product-form');
    const adminFormTitle = document.getElementById('admin-form-title');
    const btnResetProducts = document.getElementById('btn-reset-products');

    const prodEditId = document.getElementById('product-edit-id');
    const prodTitleInput = document.getElementById('prod-title');
    const prodPriceInput = document.getElementById('prod-price');
    const prodCategorySelect = document.getElementById('prod-category');
    const prodBadgeInput = document.getElementById('prod-badge');
    const prodDescInput = document.getElementById('prod-desc');
    const prodImageFileInput = document.getElementById('prod-image-file');
    const prodImageSrcInput = document.getElementById('prod-image-src');
    const imagePreview = document.getElementById('image-preview');
    const presetThumbs = document.querySelectorAll('.preset-thumb');

    const btnDownloadSitemap = document.getElementById('btn-download-sitemap');
    const sitemapCodePreview = document.getElementById('sitemap-code-preview');
    const btnCopySitemapXml = document.getElementById('btn-copy-sitemap-xml');

    const ADMIN_PASSWORD = 'feyzam9498';

    const openAuthModal = () => {
        if (sessionStorage.getItem('huzur_admin_logged') === 'true') {
            openAdminPanel();
        } else {
            if (adminAuthModal) {
                adminAuthModal.classList.add('active');
                if (adminPasswordInput) {
                    adminPasswordInput.value = '';
                    adminPasswordInput.focus();
                }
                if (adminAuthError) adminAuthError.style.display = 'none';
            }
        }
    };

    const closeAuthModal = () => {
        if (adminAuthModal) adminAuthModal.classList.remove('active');
    };

    const openAdminPanel = () => {
        closeAuthModal();
        if (adminPanelModal) {
            adminPanelModal.classList.add('active');
            renderAdminPanelProducts();
            generateSitemapXML();
        }
    };

    const closeAdminPanel = () => {
        if (adminPanelModal) adminPanelModal.classList.remove('active');
        if (adminProductFormContainer) adminProductFormContainer.classList.add('hidden');
    };

    if (openAdminAuthBtn) openAdminAuthBtn.addEventListener('click', openAuthModal);
    if (closeAdminAuthBtn) closeAdminAuthBtn.addEventListener('click', closeAuthModal);
    if (closeAdminPanelBtn) closeAdminPanelBtn.addEventListener('click', closeAdminPanel);

    if (adminAuthForm) {
        adminAuthForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (adminPasswordInput && adminPasswordInput.value === ADMIN_PASSWORD) {
                sessionStorage.setItem('huzur_admin_logged', 'true');
                if (adminAuthError) adminAuthError.style.display = 'none';
                openAdminPanel();
            } else {
                if (adminAuthError) adminAuthError.style.display = 'block';
                if (adminPasswordInput) adminPasswordInput.focus();
            }
        });
    }

    if (window.location.hash === '#admin') {
        openAuthModal();
    }

    // Generate Full Sitemap XML
    const generateSitemapXML = () => {
        const products = getStoredProducts();
        const today = new Date().toISOString().split('T')[0];

        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
        xml += `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n\n`;

        // Home
        xml += `    <!-- Ana Sayfa -->\n`;
        xml += `    <url>\n`;
        xml += `        <loc>https://huzuratolyem.com/</loc>\n`;
        xml += `        <lastmod>${today}</lastmod>\n`;
        xml += `        <changefreq>weekly</changefreq>\n`;
        xml += `        <priority>1.0</priority>\n`;
        xml += `    </url>\n\n`;

        // Catalog
        xml += `    <!-- Tüm Ürünler Koleksiyonu -->\n`;
        xml += `    <url>\n`;
        xml += `        <loc>https://huzuratolyem.com/urunler.html</loc>\n`;
        xml += `        <lastmod>${today}</lastmod>\n`;
        xml += `        <changefreq>weekly</changefreq>\n`;
        xml += `        <priority>0.95</priority>\n`;
        xml += `    </url>\n\n`;

        // About
        xml += `    <!-- Biz Kimiz -->\n`;
        xml += `    <url>\n`;
        xml += `        <loc>https://huzuratolyem.com/biz-kimiz.html</loc>\n`;
        xml += `        <lastmod>${today}</lastmod>\n`;
        xml += `        <changefreq>monthly</changefreq>\n`;
        xml += `        <priority>0.8</priority>\n`;
        xml += `    </url>\n\n`;

        // Products
        xml += `    <!-- Ürün Sayfaları -->\n`;
        products.forEach(p => {
            const locUrl = p.pageUrl ? `https://huzuratolyem.com/${p.pageUrl}` : `https://huzuratolyem.com/urun.html?id=${p.id}`;
            const imgUrl = p.image ? `https://huzuratolyem.com/${p.image.replace('./', '')}` : '';
            xml += `    <url>\n`;
            xml += `        <loc>${locUrl}</loc>\n`;
            xml += `        <lastmod>${today}</lastmod>\n`;
            xml += `        <changefreq>weekly</changefreq>\n`;
            xml += `        <priority>0.9</priority>\n`;
            if (imgUrl) {
                xml += `        <image:image>\n`;
                xml += `            <image:loc>${imgUrl}</image:loc>\n`;
                xml += `            <image:title>${p.title}</image:title>\n`;
                xml += `            <image:caption>${p.desc || p.title}</image:caption>\n`;
                xml += `        </image:image>\n`;
            }
            xml += `    </url>\n`;
        });

        xml += `\n</urlset>`;

        if (sitemapCodePreview) {
            sitemapCodePreview.value = xml;
        }

        return xml;
    };

    if (btnDownloadSitemap) {
        btnDownloadSitemap.addEventListener('click', () => {
            const xmlContent = generateSitemapXML();
            const blob = new Blob([xmlContent], { type: 'text/xml;charset=utf-8' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'sitemap.xml';
            link.click();
        });
    }

    if (btnCopySitemapXml) {
        btnCopySitemapXml.addEventListener('click', () => {
            if (sitemapCodePreview) {
                sitemapCodePreview.select();
                navigator.clipboard.writeText(sitemapCodePreview.value).then(() => {
                    alert('Sitemap.xml içeriği panoya kopyalandı! 📋');
                });
            }
        });
    }

    // Render Admin Products
    const renderAdminPanelProducts = () => {
        const products = getStoredProducts();
        if (adminProductCount) adminProductCount.textContent = products.length;
        if (!adminProductTableBody) return;

        adminProductTableBody.innerHTML = '';

        products.forEach(prod => {
            const item = document.createElement('div');
            item.className = 'admin-product-item';
            const pageLink = prod.pageUrl || `urun.html?id=${prod.id}`;

            item.innerHTML = `
                <img src="${prod.image}" alt="${prod.title}" class="admin-prod-thumb" onerror="this.src='./foto_1.png'">
                <div class="admin-prod-details">
                    <h5 class="admin-prod-title">${prod.title}</h5>
                    <div class="admin-prod-price">${prod.price} <span class="admin-prod-cat-tag">(${prod.categoryName || prod.category})</span></div>
                    <a href="${pageLink}" target="_blank" class="admin-view-page-link">Sayfayı Gör ↗</a>
                </div>
                <div class="admin-prod-actions">
                    <button type="button" class="btn-item-edit" data-id="${prod.id}">Düzenle</button>
                    <button type="button" class="btn-item-delete" data-id="${prod.id}">Sil</button>
                </div>
            `;
            adminProductTableBody.appendChild(item);
        });

        adminProductTableBody.querySelectorAll('.btn-item-edit').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const products = getStoredProducts();
                const product = products.find(p => p.id === id);
                if (product) openEditProductForm(product);
            });
        });

        adminProductTableBody.querySelectorAll('.btn-item-delete').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                if (confirm('Bu ürünü veritabanından silmek istediğinize emin misiniz?')) {
                    if (db) {
                        db.collection("products").doc(id).delete().catch(err => console.error("Firestore delete err:", err));
                    }
                    let products = getStoredProducts();
                    products = products.filter(p => p.id !== id);
                    saveStoredProducts(products);
                    renderAdminPanelProducts();
                    if (collectionGrid) renderProductsToContainer(collectionGrid, 'all');
                    if (catalogProductsGrid) renderProductsToContainer(catalogProductsGrid, currentCategoryFilter);
                    generateSitemapXML();
                }
            });
        });
    };

    // Preset Image Selectors
    presetThumbs.forEach(thumb => {
        thumb.addEventListener('click', () => {
            presetThumbs.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
            const src = thumb.getAttribute('data-src');
            if (prodImageSrcInput) prodImageSrcInput.value = src;
            if (imagePreview) imagePreview.src = src;
        });
    });

    // Custom File Upload with Auto Compression
    if (prodImageFileInput) {
        prodImageFileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    const compressedBase64 = await compressImage(file, 600, 600, 0.75);
                    if (prodImageSrcInput) prodImageSrcInput.value = compressedBase64;
                    if (imagePreview) imagePreview.src = compressedBase64;
                    presetThumbs.forEach(t => t.classList.remove('active'));
                } catch (err) {
                    console.error("Görsel sıkıştırma hatası:", err);
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const base64Src = event.target.result;
                        if (prodImageSrcInput) prodImageSrcInput.value = base64Src;
                        if (imagePreview) imagePreview.src = base64Src;
                    };
                    reader.readAsDataURL(file);
                }
            }
        });
    }

    // Open Add Product Form
    const openAddProductForm = () => {
        if (adminFormTitle) adminFormTitle.textContent = 'Yeni Ürün Ekle';
        if (prodEditId) prodEditId.value = '';
        if (prodTitleInput) prodTitleInput.value = '';
        if (prodPriceInput) prodPriceInput.value = '';
        if (prodCategorySelect) prodCategorySelect.value = 'duvar-susu';
        if (prodBadgeInput) prodBadgeInput.value = 'Yeni Ürün';
        if (prodDescInput) prodDescInput.value = '';
        if (prodImageSrcInput) prodImageSrcInput.value = './foto_1.png';
        if (imagePreview) imagePreview.src = './foto_1.png';
        if (prodImageFileInput) prodImageFileInput.value = '';
        presetThumbs.forEach((t, i) => t.classList.toggle('active', i === 0));

        if (adminProductFormContainer) {
            adminProductFormContainer.classList.remove('hidden');
            adminProductFormContainer.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Open Edit Product Form
    const openEditProductForm = (product) => {
        if (adminFormTitle) adminFormTitle.textContent = 'Ürünü Düzenle';
        if (prodEditId) prodEditId.value = product.id;
        if (prodTitleInput) prodTitleInput.value = product.title || '';
        if (prodPriceInput) prodPriceInput.value = product.price || '';
        if (prodCategorySelect) prodCategorySelect.value = product.category || 'duvar-susu';
        if (prodBadgeInput) prodBadgeInput.value = product.badge || '';
        if (prodDescInput) prodDescInput.value = product.desc || '';
        if (prodImageSrcInput) prodImageSrcInput.value = product.image || './foto_1.png';
        if (imagePreview) imagePreview.src = product.image || './foto_1.png';
        if (prodImageFileInput) prodImageFileInput.value = '';

        presetThumbs.forEach(t => {
            t.classList.toggle('active', t.getAttribute('data-src') === product.image);
        });

        if (adminProductFormContainer) {
            adminProductFormContainer.classList.remove('hidden');
            adminProductFormContainer.scrollIntoView({ behavior: 'smooth' });
        }
    };

    if (btnOpenAddProduct) btnOpenAddProduct.addEventListener('click', openAddProductForm);
    if (btnCloseForm) btnCloseForm.addEventListener('click', () => {
        if (adminProductFormContainer) adminProductFormContainer.classList.add('hidden');
    });

    // Save Product
    if (adminProductForm) {
        adminProductForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const editId = prodEditId ? prodEditId.value : '';
            const title = prodTitleInput ? prodTitleInput.value.trim() : '';
            const price = prodPriceInput ? prodPriceInput.value.trim() : '';
            const category = prodCategorySelect ? prodCategorySelect.value : 'duvar-susu';
            const badge = prodBadgeInput ? prodBadgeInput.value.trim() : '';
            const desc = prodDescInput ? prodDescInput.value.trim() : '';
            const image = prodImageSrcInput ? prodImageSrcInput.value : './foto_1.png';

            if (!title || !price) {
                alert('Lütfen ürün başlığı ve fiyatını girin.');
                return;
            }

            const catMap = {
                'duvar-susu': 'Rattan Duvar Süsü',
                'aksesuar-toka': 'Rattan Aksesuar & Toka',
                'tablo-sanat': 'Tablo & Sanat',
                'bohem-sus': 'Bohem Süsler & Dekor'
            };

            let products = getStoredProducts();

            if (editId) {
                const index = products.findIndex(p => p.id === editId);
                const updatedItem = {
                    ...products[index],
                    title,
                    price,
                    category,
                    categoryName: catMap[category] || 'Rattan Ürün',
                    badge,
                    badgeClass: badge.toLowerCase().includes('yeni') ? 'new' : '',
                    desc,
                    image
                };

                if (index !== -1) {
                    products[index] = updatedItem;
                }

                if (db) {
                    db.collection("products").doc(editId).update(updatedItem).catch(err => console.error("Firestore update err:", err));
                }
            } else {
                const newId = 'prod-' + Date.now();
                const newSlug = slugify(title);
                const newProduct = {
                    id: newId,
                    title,
                    price,
                    category,
                    categoryName: catMap[category] || 'Rattan Ürün',
                    badge,
                    badgeClass: badge.toLowerCase().includes('yeni') ? 'new' : '',
                    desc,
                    image,
                    alt: title + ' Sakarya',
                    slug: newSlug,
                    pageUrl: `urun.html?id=${newId}`,
                    active: true,
                    order: products.length + 1
                };
                products.unshift(newProduct);

                if (db) {
                    db.collection("products").doc(newId).set({
                        ...newProduct,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    }).catch(err => console.error("Firestore add err:", err));
                }
            }

            saveStoredProducts(products);
            renderAdminPanelProducts();
            if (collectionGrid) renderProductsToContainer(collectionGrid, 'all');
            if (catalogProductsGrid) renderProductsToContainer(catalogProductsGrid, currentCategoryFilter);
            generateSitemapXML();

            if (adminProductFormContainer) adminProductFormContainer.classList.add('hidden');
            alert('Ürün başarıyla kaydedildi ve vitrinde yayınlandı! ✨');
        });
    }

    // Reset to defaults
    if (btnResetProducts) {
        btnResetProducts.addEventListener('click', () => {
            if (confirm('Tüm ürünleri varsayılan orijinal ürünlere sıfırlamak istediğinize emin misiniz?')) {
                localStorage.removeItem('huzur_custom_products');
                saveStoredProducts(DEFAULT_PRODUCTS);
                if (db) {
                    DEFAULT_PRODUCTS.forEach((item) => {
                        db.collection("products").doc(item.id).set({
                            ...item,
                            createdAt: firebase.firestore.FieldValue.serverTimestamp()
                        }).catch(e => console.warn(e));
                    });
                }
                renderAdminPanelProducts();
                if (collectionGrid) renderProductsToContainer(collectionGrid, 'all');
                if (catalogProductsGrid) renderProductsToContainer(catalogProductsGrid, 'all');
                generateSitemapXML();
                if (adminProductFormContainer) adminProductFormContainer.classList.add('hidden');
                alert('Ürünler varsayılana sıfırlandı.');
            }
        });
    }

    // Admin Tabs Switching
    const adminNavTabs = document.querySelectorAll('.admin-nav-tab');
    const adminTabSections = document.querySelectorAll('.admin-tab-section');

    adminNavTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            adminNavTabs.forEach(t => t.classList.remove('active'));
            adminTabSections.forEach(s => s.classList.add('hidden'));

            tab.classList.add('active');
            const targetId = tab.getAttribute('data-tab');
            const targetSection = document.getElementById(targetId);
            if (targetSection) targetSection.classList.remove('hidden');

            if (targetId === 'tab-seo-indexing') {
                generateSitemapXML();
            }
        });
    });

    // =========================================================================
    // 10. Accordion FAQ Logic
    // =========================================================================
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                faqItems.forEach(i => i.classList.remove('active'));
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });

});
