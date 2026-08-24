/**
 * Huzur Atölyem - Core & Hero Slider Interactions
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

    // =========================================================================
    // 6. Serverless Product Management System (Password: feyzam9498)
    // =========================================================================
    const DEFAULT_PRODUCTS = [
        {
            id: 'prod-1',
            title: 'El Yapımı Rattan Saç Tokası',
            desc: 'Zarif boncuk detaylı, %100 doğal el yapımı saç aksesuarı.',
            price: 'Fiyat Sorunuz',
            badge: 'Yeni Ürün',
            badgeClass: 'new',
            image: './foto_1.png',
            alt: 'El Yapımı Rattan Saç Tokası Sakarya'
        },
        {
            id: 'prod-2',
            title: '20 cm Rattan Duvar Süsü',
            desc: 'Doğal el örgüsü, zarif çiçek formunda duvar dekoru.',
            price: '150 TL',
            badge: 'Popüler',
            badgeClass: '',
            image: './foto_4.png',
            alt: '20 cm Rattan Duvar Süsü Sakarya'
        },
        {
            id: 'prod-3',
            title: 'Özel Tasarım Rölyef Çerçeve',
            desc: 'Mutfak ve yemek alanları için 3 boyutlu el işçiliği tablo.',
            price: 'Fiyat Sorunuz',
            badge: 'Özel Çalışma',
            badgeClass: '',
            image: './foto_2.png',
            alt: 'Özel Tasarım Rölyef Çerçeve'
        },
        {
            id: 'prod-4',
            title: '25 cm Rattan Duvar Süsü',
            desc: 'Salon ve yatak odalarına doğal ve sıcak bir dokunuş.',
            price: '200 TL',
            badge: 'Çok Satan',
            badgeClass: '',
            image: './foto_5.png',
            alt: '25 cm Rattan Duvar Süsü Sakarya'
        },
        {
            id: 'prod-5',
            title: 'El Emeği Vav Hat Tablo',
            desc: 'Geleneksel Vav motifi ve çiçek bezemeli çerçeveli eser.',
            price: 'Fiyat Sorunuz',
            badge: 'El İşi Sanat',
            badgeClass: '',
            image: './foto_3.png',
            alt: 'El Emeği Vav Hat Tablo'
        },
        {
            id: 'prod-6',
            title: '38 cm Rattan Duvar Süsü',
            desc: 'Geniş duvarlar ve ana odak noktaları için dev boy zarafet.',
            price: '350 TL',
            badge: 'Büyük Boy',
            badgeClass: '',
            image: './foto_6.png',
            alt: '38 cm Rattan Duvar Süsü Sakarya'
        }
    ];

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

    const saveStoredProducts = (products) => {
        try {
            localStorage.setItem('huzur_custom_products', JSON.stringify(products));
        } catch (e) {
            console.error('Error saving products:', e);
            alert('Tarayıcı hafızası dolu olabilir veya görsel boyutu yüksek.');
        }
    };

    const collectionGrid = document.getElementById('collection-grid');

    const renderVitrinProducts = (products) => {
        if (!collectionGrid) return;
        collectionGrid.innerHTML = '';

        products.forEach((prod, index) => {
            const card = document.createElement('div');
            card.className = `product-card reveal stagger-${(index % 3) + 1} active`;
            
            const badgeHtml = prod.badge ? `<span class="product-badge ${prod.badgeClass || ''}">${prod.badge}</span>` : '';
            const isPriceAsk = !prod.price || prod.price.toLowerCase().includes('sor') || prod.price.toLowerCase().includes('fiyat');
            const priceHtml = isPriceAsk 
                ? `<span class="price-ask">${prod.price || 'Fiyat Sorunuz'}</span>` 
                : `<span class="product-price">${prod.price}</span>`;

            const waMessage = encodeURIComponent(`Merhaba, ${prod.title} ${!isPriceAsk ? `(${prod.price})` : ''} hakkında bilgi ve sipariş detaylarını almak istiyorum.`);

            card.innerHTML = `
                ${badgeHtml}
                <div class="product-image-wrap">
                    <img src="${prod.image}" alt="${prod.alt || prod.title}" loading="lazy">
                    <div class="product-image-overlay"></div>
                </div>
                <div class="product-info">
                    <div>
                        <h3 class="product-title">${prod.title}</h3>
                        <p class="product-desc">${prod.desc || ''}</p>
                    </div>
                    <div>
                        <div class="product-price-tag">
                            ${priceHtml}
                        </div>
                        <a href="https://wa.me/905337009454?text=${waMessage}" target="_blank" class="btn-whatsapp">
                            <svg viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                            HEMEN ARAYIN
                        </a>
                    </div>
                </div>
            `;
            collectionGrid.appendChild(card);
        });
    };

    // Initial Vitrin Render
    const initialProducts = getStoredProducts();
    if (localStorage.getItem('huzur_custom_products')) {
        renderVitrinProducts(initialProducts);
    }

    // --- Admin Elements ---
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
    const prodBadgeInput = document.getElementById('prod-badge');
    const prodDescInput = document.getElementById('prod-desc');
    const prodImageFileInput = document.getElementById('prod-image-file');
    const prodImageSrcInput = document.getElementById('prod-image-src');
    const imagePreview = document.getElementById('image-preview');
    const presetThumbs = document.querySelectorAll('.preset-thumb');

    // Admin Auth Password Check
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
        }
    };

    const closeAdminPanel = () => {
        if (adminPanelModal) adminPanelModal.classList.remove('active');
        if (adminProductFormContainer) adminProductFormContainer.classList.add('hidden');
    };

    if (openAdminAuthBtn) openAdminAuthBtn.addEventListener('click', openAuthModal);
    if (closeAdminAuthBtn) closeAdminAuthBtn.addEventListener('click', closeAuthModal);
    if (closeAdminPanelBtn) closeAdminPanelBtn.addEventListener('click', closeAdminPanel);

    // Close on backdrop click
    [adminAuthModal, adminPanelModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        }
    });

    // Check password submit
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

    // Auto open if hash is #admin
    if (window.location.hash === '#admin') {
        openAuthModal();
    }

    // Render Admin Products List
    const renderAdminPanelProducts = () => {
        const products = getStoredProducts();
        if (adminProductCount) adminProductCount.textContent = products.length;
        if (!adminProductTableBody) return;

        adminProductTableBody.innerHTML = '';

        products.forEach(prod => {
            const item = document.createElement('div');
            item.className = 'admin-product-item';
            item.innerHTML = `
                <img src="${prod.image}" alt="${prod.title}" class="admin-prod-thumb">
                <div class="admin-prod-details">
                    <h5 class="admin-prod-title">${prod.title}</h5>
                    <div class="admin-prod-price">${prod.price}</div>
                    ${prod.badge ? `<span class="admin-prod-badge">${prod.badge}</span>` : ''}
                </div>
                <div class="admin-prod-actions">
                    <button type="button" class="btn-item-edit" data-id="${prod.id}">Düzenle</button>
                    <button type="button" class="btn-item-delete" data-id="${prod.id}">Sil</button>
                </div>
            `;
            adminProductTableBody.appendChild(item);
        });

        // Edit Button Click Handlers
        adminProductTableBody.querySelectorAll('.btn-item-edit').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const products = getStoredProducts();
                const product = products.find(p => p.id === id);
                if (product) {
                    openEditProductForm(product);
                }
            });
        });

        // Delete Button Click Handlers
        adminProductTableBody.querySelectorAll('.btn-item-delete').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                if (confirm('Bu ürünü vitrinden silmek istediğinize emin misiniz?')) {
                    let products = getStoredProducts();
                    products = products.filter(p => p.id !== id);
                    saveStoredProducts(products);
                    renderAdminPanelProducts();
                    renderVitrinProducts(products);
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

    // Custom File Upload
    if (prodImageFileInput) {
        prodImageFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const base64Src = event.target.result;
                    if (prodImageSrcInput) prodImageSrcInput.value = base64Src;
                    if (imagePreview) imagePreview.src = base64Src;
                    presetThumbs.forEach(t => t.classList.remove('active'));
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Open Add Product Form
    const openAddProductForm = () => {
        if (adminFormTitle) adminFormTitle.textContent = 'Yeni Ürün Ekle';
        if (prodEditId) prodEditId.value = '';
        if (prodTitleInput) prodTitleInput.value = '';
        if (prodPriceInput) prodPriceInput.value = '';
        if (prodBadgeInput) prodBadgeInput.value = '';
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

    // Save Product (Add or Edit)
    if (adminProductForm) {
        adminProductForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const editId = prodEditId ? prodEditId.value : '';
            const title = prodTitleInput ? prodTitleInput.value.trim() : '';
            const price = prodPriceInput ? prodPriceInput.value.trim() : '';
            const badge = prodBadgeInput ? prodBadgeInput.value.trim() : '';
            const desc = prodDescInput ? prodDescInput.value.trim() : '';
            const image = prodImageSrcInput ? prodImageSrcInput.value : './foto_1.png';

            if (!title || !price) {
                alert('Lütfen ürün başlığı ve fiyatını girin.');
                return;
            }

            let products = getStoredProducts();

            if (editId) {
                // Update existing
                const index = products.findIndex(p => p.id === editId);
                if (index !== -1) {
                    products[index] = {
                        ...products[index],
                        title,
                        price,
                        badge,
                        badgeClass: badge.toLowerCase().includes('yeni') ? 'new' : '',
                        desc,
                        image
                    };
                }
            } else {
                // Add new
                const newProduct = {
                    id: 'prod-' + Date.now(),
                    title,
                    price,
                    badge,
                    badgeClass: badge.toLowerCase().includes('yeni') ? 'new' : '',
                    desc,
                    image,
                    alt: title
                };
                products.unshift(newProduct);
            }

            saveStoredProducts(products);
            renderAdminPanelProducts();
            renderVitrinProducts(products);

            if (adminProductFormContainer) adminProductFormContainer.classList.add('hidden');
            alert('Ürün başarıyla kaydedildi ve vitrinde yayınlandı! ✨');
        });
    }

    // Reset to defaults
    if (btnResetProducts) {
        btnResetProducts.addEventListener('click', () => {
            if (confirm('Tüm ürünleri varsayılan orijinal 6 ürüne sıfırlamak istediğinize emin misiniz?')) {
                localStorage.removeItem('huzur_custom_products');
                renderAdminPanelProducts();
                renderVitrinProducts(DEFAULT_PRODUCTS);
                if (adminProductFormContainer) adminProductFormContainer.classList.add('hidden');
                alert('Ürünler varsayılana sıfırlandı.');
            }
        });
    }

});
