document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // 1. CONTROL DE SESIÓN Y ACCESO
    // ==========================================================================
    // Intentar leer de localStorage
    const activeUserJSON = localStorage.getItem('aura_active_user');
    let activeUser = null;

    if (activeUserJSON) {
        try {
            activeUser = JSON.parse(activeUserJSON);
        } catch (e) {
            activeUser = null;
        }
    }

    // Respaldo: Intentar leer de los parámetros de la URL (útil en protocolo file:// por aislamiento de origen)
    if (!activeUser) {
        const urlParams = new URLSearchParams(window.location.search);
        const nameParam = urlParams.get('name');
        const emailParam = urlParams.get('email');
        const usernameParam = urlParams.get('username');
        const phoneParam = urlParams.get('phone');

        if (nameParam && emailParam) {
            activeUser = {
                name: nameParam,
                email: emailParam,
                username: usernameParam || nameParam.toLowerCase().replace(' ', '_'),
                phone: phoneParam || ''
            };
            
            // Intentar guardarlo en localStorage para futuras navegaciones locales
            try {
                localStorage.setItem('aura_active_user', JSON.stringify(activeUser));
            } catch (e) {
                // Silenciar error si el navegador bloquea localStorage local
            }
        }
    }

    const storeWrapper = document.getElementById('storeWrapper');
    const accessDeniedPanel = document.getElementById('accessDeniedPanel');

   if (storeWrapper) storeWrapper.style.display = 'block';
if (accessDeniedPanel) accessDeniedPanel.style.display = 'none';

    // Hay sesión. Mostrar la tienda y ocultar panel de acceso denegado
    if (storeWrapper) storeWrapper.style.display = 'block';
    if (accessDeniedPanel) accessDeniedPanel.style.display = 'none';

    if (activeUser) {
    initializeUserUI(activeUser);
}

    function initializeUserUI(user) {

    if (!user) return;

    const avatarText = document.getElementById('avatarText');
    const userNameLabel = document.getElementById('userNameLabel');
    const dropdownName = document.getElementById('dropdownName');
    const dropdownEmail = document.getElementById('dropdownEmail');

        if (avatarText) {
            const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            avatarText.textContent = initials || 'US';
        }

        if (userNameLabel) {
            userNameLabel.textContent = user.name;
        }

        if (dropdownName) dropdownName.textContent = user.name;
        if (dropdownEmail) dropdownEmail.textContent = user.email;
    }

    // Cierre de Sesión
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showToast('Cerrando Sesión', 'Redirigiendo al tocador de accesos...', 'success');
            setTimeout(() => {
                localStorage.removeItem('aura_active_user');
                window.location.href = 'index.html';
            }, 1200);
        });
    }

    // ==========================================================================
    // 2. DROPDOWN DE PERFIL
    // ==========================================================================
    const profileTrigger = document.getElementById('profileTrigger');
    const profileDropdown = document.getElementById('profileDropdown');

    if (profileTrigger && profileDropdown) {
        profileTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            profileDropdown.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!profileTrigger.contains(e.target) && !profileDropdown.contains(e.target)) {
                profileDropdown.classList.remove('active');
            }
        });
    }

    // ==========================================================================
    // 3. PRODUCTOS DEL CATÁLOGO (EXPANDIDO POR CATEGORÍAS)
    // ==========================================================================
    const CATEGORIES = [
        { id: 'todos', name: 'Todos', icon: '' },
        { id: 'cuidado-facial', name: 'Cuidado Facial', icon: '' },
        { id: 'maquillaje', name: 'Maquillaje', icon: '' },
        { id: 'fragancias', name: 'Fragancias', icon: '' },
        { id: 'cuidado-corporal', name: 'Cuidado Corporal', icon: '' },
        { id: 'cabello', name: 'Cabello', icon: '' },
        { id: 'sets-regalos', name: 'Sets & Regalos', icon: '' }
    ];

    const PRODUCTS = [
        // ──── CUIDADO FACIAL ────
        {
            id: 'prod-celeste',
            name: 'Huile Céleste',
            category: 'Cuidado Facial',
            categoryId: 'cuidado-facial',
            price: 48.00,
            image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=600&auto=format&fit=crop',
            badge: 'Best Seller',
            description: 'Aceite facial iluminador con extracto botánico ultra-hidratante.'
        },
        {
            id: 'prod-creme',
            name: 'Crème de Fleur',
            category: 'Cuidado Facial',
            categoryId: 'cuidado-facial',
            price: 65.00,
            image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=600&auto=format&fit=crop',
            badge: 'Esencial',
            description: 'Crema reparadora con pétalos de jazmín y ácido hialurónico.'
        },
        {
            id: 'prod-brume',
            name: 'Brume Satinée',
            category: 'Cuidado Facial',
            categoryId: 'cuidado-facial',
            price: 26.00,
            image: 'https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=600&auto=format&fit=crop',
            badge: 'Orgánico',
            description: 'Bruma refrescante a base de rosas y agua de aciano natural.'
        },
        {
            id: 'prod-serum-rose',
            name: 'Sérum Rosé Éternelle',
            category: 'Cuidado Facial',
            categoryId: 'cuidado-facial',
            price: 72.00,
            image: 'https://images.unsplash.com/photo-1570194065650-d99fb4b38b17?q=80&w=600&auto=format&fit=crop',
            badge: 'Premium',
            description: 'Sérum anti-edad con retinol botánico y extracto de rosa de Damasco.'
        },
        {
            id: 'prod-masque-or',
            name: 'Masque d\'Or',
            category: 'Cuidado Facial',
            categoryId: 'cuidado-facial',
            price: 54.00,
            image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?q=80&w=600&auto=format&fit=crop',
            badge: 'Luminoso',
            description: 'Mascarilla facial de oro 24k con colágeno vegetal y vitamina C.'
        },

        // ──── MAQUILLAJE ────
        {
            id: 'prod-velour',
            name: 'Rose Velour',
            category: 'Maquillaje',
            categoryId: 'maquillaje',
            price: 32.00,
            image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600&auto=format&fit=crop',
            badge: 'Nuevo',
            description: 'Labial cremoso mate con aceites hidratantes esenciales.'
        },
        {
            id: 'prod-palette',
            name: 'Palette Aurore',
            category: 'Maquillaje',
            categoryId: 'maquillaje',
            price: 58.00,
            image: 'https://images.unsplash.com/photo-1583241800698-e8ab01b85405?q=80&w=600&auto=format&fit=crop',
            badge: 'Exclusiva',
            description: 'Paleta de sombras con 12 tonos cálidos de acabado satinado y metálico.'
        },
        {
            id: 'prod-fond-teint',
            name: 'Fond de Teint Lumière',
            category: 'Maquillaje',
            categoryId: 'maquillaje',
            price: 44.00,
            image: 'https://images.unsplash.com/photo-1631214540553-a5e085dff4e4?q=80&w=600&auto=format&fit=crop',
            badge: 'Natural',
            description: 'Base de maquillaje ligera con SPF 30 y extractos de manzanilla.'
        },
        {
            id: 'prod-mascara',
            name: 'Mascara Noir Infini',
            category: 'Maquillaje',
            categoryId: 'maquillaje',
            price: 28.00,
            image: 'https://images.unsplash.com/photo-1512207736890-6ffed8a84e8d?q=80&w=600&auto=format&fit=crop',
            badge: 'Top 5',
            description: 'Máscara de pestañas volumizadora y alargadora con cera de abejas.'
        },

        // ──── FRAGANCIAS ────
        {
            id: 'prod-parfum-nuit',
            name: 'Nuit Étoilée',
            category: 'Fragancias',
            categoryId: 'fragancias',
            price: 95.00,
            image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=600&auto=format&fit=crop',
            badge: 'Signature',
            description: 'Eau de parfum con notas de jazmín nocturno, vainilla y madera de sándalo.'
        },
        {
            id: 'prod-parfum-jardin',
            name: 'Jardin Secret',
            category: 'Fragancias',
            categoryId: 'fragancias',
            price: 82.00,
            image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=600&auto=format&fit=crop',
            badge: 'Floral',
            description: 'Fragancia floral primaveral con peonía, lila y un toque de bergamota.'
        },
        {
            id: 'prod-brume-corps',
            name: 'Brume Corporelle Douce',
            category: 'Fragancias',
            categoryId: 'fragancias',
            price: 38.00,
            image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=600&auto=format&fit=crop',
            badge: 'Suave',
            description: 'Bruma corporal de larga duración con aroma de flor de almendro y miel.'
        },
        {
            id: 'prod-vela',
            name: 'Bougie Maison Florale',
            category: 'Fragancias',
            categoryId: 'fragancias',
            price: 42.00,
            image: 'https://images.unsplash.com/photo-1602607726657-0c76e5121160?q=80&w=600&auto=format&fit=crop',
            badge: 'Hogar',
            description: 'Vela aromática de cera de soja con pétalos de rosa y lavanda provenzal.'
        },

        // ──── CUIDADO CORPORAL ────
        {
            id: 'prod-body-cream',
            name: 'Crème Corps Velours',
            category: 'Cuidado Corporal',
            categoryId: 'cuidado-corporal',
            price: 36.00,
            image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=600&auto=format&fit=crop',
            badge: 'Hidratante',
            description: 'Crema corporal de textura aterciopelada con manteca de karité y coco.'
        },
        {
            id: 'prod-exfoliant',
            name: 'Exfoliant Douceur',
            category: 'Cuidado Corporal',
            categoryId: 'cuidado-corporal',
            price: 29.00,
            image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=600&auto=format&fit=crop',
            badge: 'Vegano',
            description: 'Exfoliante corporal suave con granos de café y aceite de argán.'
        },
        {
            id: 'prod-huile-bain',
            name: 'Huile de Bain Royale',
            category: 'Cuidado Corporal',
            categoryId: 'cuidado-corporal',
            price: 46.00,
            image: 'https://images.unsplash.com/photo-1600428877878-1a0fd85beda8?q=80&w=600&auto=format&fit=crop',
            badge: 'Relajante',
            description: 'Aceite de baño perfumado con magnolia, ylang-ylang y jojoba dorada.'
        },
        {
            id: 'prod-savon',
            name: 'Savon Artisanal Lavande',
            category: 'Cuidado Corporal',
            categoryId: 'cuidado-corporal',
            price: 18.00,
            image: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?q=80&w=600&auto=format&fit=crop',
            badge: 'Artesanal',
            description: 'Jabón artesanal de lavanda francesa con aceite de oliva orgánico.'
        },

        // ──── CABELLO ────
        {
            id: 'prod-shampoo',
            name: 'Shampooing Éclat',
            category: 'Cabello',
            categoryId: 'cabello',
            price: 34.00,
            image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=600&auto=format&fit=crop',
            badge: 'Brillo',
            description: 'Champú revitalizante con extracto de camelia y proteínas de seda.'
        },
        {
            id: 'prod-masque-cheveux',
            name: 'Masque Capillaire Intense',
            category: 'Cabello',
            categoryId: 'cabello',
            price: 40.00,
            image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=600&auto=format&fit=crop',
            badge: 'Reparador',
            description: 'Mascarilla capilar nutritiva con queratina vegetal y aceite de macadamia.'
        },
        {
            id: 'prod-huile-cheveux',
            name: 'Huile Précieuse Cheveux',
            category: 'Cabello',
            categoryId: 'cabello',
            price: 52.00,
            image: 'https://images.unsplash.com/photo-1585751119414-ef2636f8aede?q=80&w=600&auto=format&fit=crop',
            badge: 'Selecto',
            description: 'Aceite capilar de argán marroquí y rosa mosqueta para un brillo sublime.'
        },

        // ──── SETS & REGALOS ────
        {
            id: 'prod-set-essentiel',
            name: 'Coffret Essentiel',
            category: 'Sets & Regalos',
            categoryId: 'sets-regalos',
            price: 120.00,
            image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=600&auto=format&fit=crop',
            badge: 'Gift Set',
            description: 'Set de regalo con sérum, crema y bruma facial en estuche de lujo.'
        },
        {
            id: 'prod-set-voyage',
            name: 'Trousse de Voyage',
            category: 'Sets & Regalos',
            categoryId: 'sets-regalos',
            price: 85.00,
            image: 'https://images.unsplash.com/photo-1522338242992-e1a54571a9f7?q=80&w=600&auto=format&fit=crop',
            badge: 'Travel',
            description: 'Kit de viaje con 5 productos miniatura en neceser de lino orgánico.'
        },
        {
            id: 'prod-set-novia',
            name: 'Coffret Mariée Royale',
            category: 'Sets & Regalos',
            categoryId: 'sets-regalos',
            price: 195.00,
            image: 'https://images.unsplash.com/photo-1583209814683-c023dd293cc6?q=80&w=600&auto=format&fit=crop',
            badge: 'Edición Novia',
            description: 'Set nupcial premium con maquillaje completo, perfume y cuidado facial.'
        },
        {
            id: 'prod-set-hombre',
            name: 'Coffret Homme Élégant',
            category: 'Sets & Regalos',
            categoryId: 'sets-regalos',
            price: 98.00,
            image: 'https://images.unsplash.com/photo-1614859324967-bbc70d073965?q=80&w=600&auto=format&fit=crop',
            badge: 'Para Él',
            description: 'Set masculino con aftershave, crema hidratante y eau de toilette.'
        }
    ];

    let activeFilter = 'todos';

    const productsGrid = document.getElementById('productsGrid');
    const filterContainer = document.getElementById('categoryFilters');

    // Inicializar filtros de categoría
    if (filterContainer) {
        renderCategoryFilters();
    }

    if (productsGrid) {
        renderProducts();
    }

    function renderCategoryFilters() {
        filterContainer.innerHTML = CATEGORIES.map(cat => `
            <button class="filter-tab ${cat.id === activeFilter ? 'active' : ''}" data-filter="${cat.id}">
                <span class="filter-icon">${cat.icon}</span>
                <span class="filter-label">${cat.name}</span>
                ${cat.id !== 'todos' ? `<span class="filter-count">${PRODUCTS.filter(p => p.categoryId === cat.id).length}</span>` : `<span class="filter-count">${PRODUCTS.length}</span>`}
            </button>
        `).join('');

        filterContainer.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                activeFilter = tab.dataset.filter;
                // Actualizar pestañas activas
                filterContainer.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                renderProducts();
            });
        });
    }

    function renderProducts() {
        const filtered = activeFilter === 'todos'
            ? PRODUCTS
            : PRODUCTS.filter(p => p.categoryId === activeFilter);

        if (activeFilter === 'todos') {
            // Agrupar por categoría
            const grouped = {};
            filtered.forEach(p => {
                if (!grouped[p.category]) grouped[p.category] = [];
                grouped[p.category].push(p);
            });

            let html = '';
            for (const [catName, products] of Object.entries(grouped)) {
                html += `<div class="category-section-header">
                    <h3>${catName}</h3>
                    <span class="section-count">${products.length} productos</span>
                </div>`;
                html += `<div class="products-grid-inner">`;
                html += products.map(prod => renderProductCard(prod)).join('');
                html += `</div>`;
            }
            productsGrid.innerHTML = html;
        } else {
            productsGrid.innerHTML = `<div class="products-grid-inner">` +
                filtered.map(prod => renderProductCard(prod)).join('') +
                `</div>`;
        }

        // Clics para agregar al carrito
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const prodId = btn.dataset.id;
                addToCart(prodId);
            });
        });
    }

    function renderProductCard(prod) {
        return `
            <div class="product-card">
                <div class="prod-img-wrap">
                    ${prod.badge ? `<span class="prod-badge">${prod.badge}</span>` : ''}
                    <img src="${prod.image}" alt="${prod.name}" loading="lazy">
                </div>
                <div class="prod-info">
                    <span class="prod-category">${prod.category}</span>
                    <h3 class="prod-title">${prod.name}</h3>
                    <p class="prod-desc">${prod.description}</p>
                </div>
                <div class="prod-footer">
                    <span class="prod-price">$${prod.price.toFixed(2)}</span>
                    <button class="add-to-cart-btn" data-id="${prod.id}" aria-label="Agregar ${prod.name} al carrito">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    }

    // ==========================================================================
    // 4. LÓGICA DEL CARRITO DE COMPRAS
    // ==========================================================================
    let cart = [];
    
    // Cargar carrito de localStorage
    const savedCart = localStorage.getItem('aura_cart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
        } catch (e) {
            cart = [];
        }
    }

    const cartOverlay = document.getElementById('cartOverlay');
    const cartPanel = document.querySelector('.cart-panel');
    const cartTrigger = document.getElementById('cartTrigger');
    const cartCloseBtn = document.getElementById('cartCloseBtn');
    const cartEmpty = document.getElementById('cartEmpty');
    const cartItemsList = document.getElementById('cartItemsList');
    const cartFooter = document.getElementById('cartFooter');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartCounter = document.getElementById('cartCounter');

    // Inicializar UI del carrito
    updateCartUI();

    // Eventos Abrir/Cerrar
    if (cartTrigger) {
        cartTrigger.addEventListener('click', openCart);
    }
    if (cartCloseBtn) {
        cartCloseBtn.addEventListener('click', closeCart);
    }
    if (cartOverlay) {
        cartOverlay.addEventListener('click', (e) => {
            if (e.target === cartOverlay) closeCart();
        });
    }

    function openCart() {
        if (cartOverlay) cartOverlay.classList.add('active');
    }

    function closeCart() {
        if (cartOverlay) cartOverlay.classList.remove('active');
    }

    function addToCart(productId) {
        const product = PRODUCTS.find(p => p.id === productId);
        if (!product) return;

        const cartItem = cart.find(item => item.id === productId);
        if (cartItem) {
            cartItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                category: product.category,
                quantity: 1
            });
        }

        saveCart();
        updateCartUI();
        showToast('Producto Agregado', `¡${product.name} se añadió a tu carrito!`, 'success');
        
        // Abrir panel lateral automáticamente al agregar
        openCart();

        // Animación Bump en el botón del carrito
        if (cartCounter) {
            cartCounter.classList.add('bump');
            setTimeout(() => {
                cartCounter.classList.remove('bump');
            }, 250);
        }
    }

    function updateQuantity(productId, change) {
        const item = cart.find(i => i.id === productId);
        if (!item) return;

        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartUI();
        }
    }

    function removeFromCart(productId) {
        const item = cart.find(i => i.id === productId);
        cart = cart.filter(i => i.id !== productId);
        saveCart();
        updateCartUI();
        if (item) {
            showToast('Producto Eliminado', `${item.name} fue removido del carrito.`, 'error');
        }
    }

    function saveCart() {
        localStorage.setItem('aura_cart', JSON.stringify(cart));
    }

    function updateCartUI() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCounter) {
            cartCounter.textContent = totalItems;
        }

        if (cart.length === 0) {
            if (cartEmpty) cartEmpty.style.display = 'flex';
            if (cartItemsList) cartItemsList.style.display = 'none';
            if (cartFooter) cartFooter.style.display = 'none';
        } else {
            if (cartEmpty) cartEmpty.style.display = 'none';
            if (cartItemsList) {
                cartItemsList.style.display = 'flex';
                cartItemsList.innerHTML = cart.map(item => `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                        <div class="cart-item-details">
                            <div>
                                <h4 class="cart-item-title">${item.name}</h4>
                                <span class="cart-item-price">$${item.price.toFixed(2)}</span>
                            </div>
                            <div class="cart-item-ctrl">
                                <div class="quantity-selector">
                                    <button class="quantity-btn min-btn" data-id="${item.id}">&minus;</button>
                                    <span class="quantity-value">${item.quantity}</span>
                                    <button class="quantity-btn add-btn" data-id="${item.id}">&plus;</button>
                                </div>
                                <button class="remove-item-btn" data-id="${item.id}">Quitar</button>
                            </div>
                        </div>
                    </div>
                `).join('');

                // Eventos de controles de cantidad
                document.querySelectorAll('.quantity-btn.min-btn').forEach(btn => {
                    btn.addEventListener('click', () => updateQuantity(btn.dataset.id, -1));
                });
                document.querySelectorAll('.quantity-btn.add-btn').forEach(btn => {
                    btn.addEventListener('click', () => updateQuantity(btn.dataset.id, 1));
                });
                document.querySelectorAll('.remove-item-btn').forEach(btn => {
                    btn.addEventListener('click', () => removeFromCart(btn.dataset.id));
                });
            }

            // Calcular Subtotal
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            if (cartSubtotal) {
                cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
            }
            if (cartFooter) cartFooter.style.display = 'block';
        }
    }

    // ==========================================================================
    // 5. SIMULACIÓN DE CHECKOUT
    // ==========================================================================
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            checkoutBtn.classList.add('loading');
            
            setTimeout(() => {
                checkoutBtn.classList.remove('loading');
                closeCart();

                // Notificar éxito
                showToast('¡Compra Exitosa!', 'Tu pedido de Aura Beauté ha sido procesado.', 'success');

                // Enviar recibo simulado a la bandeja
                const orderNumber = Math.floor(100000 + Math.random() * 900000);
                const orderDate = new Date().toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                const itemsHTML = cart.map(item => `
                    <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid rgba(197, 155, 157, 0.1);">${item.name} (x${item.quantity})</td>
                        <td style="padding: 8px 0; border-bottom: 1px solid rgba(197, 155, 157, 0.1); text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                `).join('');

                const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

                const receiptHTML = `
                    <div style="font-family: var(--font-sans); color: var(--text-primary);">
                        <p>Estimado/a <strong>${activeUser.name}</strong>,</p>
                        <p>Gracias por tu compra en <strong>Aura Beauté</strong>. Tu pedido ha sido confirmado y ya está en preparación.</p>
                        
                        <div style="background: rgba(197, 155, 157, 0.05); border: 1px solid rgba(197, 155, 157, 0.15); border-radius: 12px; padding: 16px; margin: 16px 0;">
                            <h4 style="margin: 0 0 10px 0; font-family: var(--font-serif); color: var(--primary-hover); font-size: 1.1rem;">Recibo de Pedido #${orderNumber}</h4>
                            <p style="font-size: 0.8rem; color: var(--text-secondary); margin: 0 0 12px 0;">Fecha: ${orderDate}</p>
                            
                            <table style="width: 100%; font-size: 0.9rem; border-collapse: collapse;">
                                <tbody>
                                    ${itemsHTML}
                                    <tr>
                                        <td style="padding: 12px 0 0 0; font-weight: 700;">Subtotal</td>
                                        <td style="padding: 12px 0 0 0; font-weight: 700; text-align: right;">$${total.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 4px 0 0 0; color: var(--text-secondary);">Envío</td>
                                        <td style="padding: 4px 0 0 0; text-align: right; color: #7da08a;">Gratis</td>
                                    </tr>
                                    <tr style="border-top: 1px solid rgba(197, 155, 157, 0.3);">
                                        <td style="padding: 12px 0 0 0; font-weight: 700; font-size: 1.05rem;">Total pagado</td>
                                        <td style="padding: 12px 0 0 0; font-weight: 700; font-size: 1.05rem; text-align: right; color: var(--primary-hover);">$${total.toFixed(2)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p style="font-size: 0.85rem; color: var(--text-secondary);">Enviaremos los detalles de seguimiento en cuanto el paquete salga de nuestros laboratorios botánicos.</p>
                    </div>
                `;

                addMessageToInbox(
                    'Aura Beauté Boutique <ventas@aurabeaute.com>',
                    `Confirmación de Pedido #${orderNumber}`,
                    receiptHTML,
                    null,
                    true // Activar badge
                );

                // Vaciar carrito
                cart = [];
                saveCart();
                updateCartUI();

            }, 2000);
        });
    }

    // ==========================================================================
    // 6. MOTOR DEL BUZÓN DE SIMULACIÓN Y TOASTS
    // ==========================================================================
    let simulatedInbox = [];
    let unreadCount = 0;

    const mailboxTrigger = document.getElementById('mailboxTrigger');
    const mailboxBadge = document.getElementById('mailboxBadge');
    const mailboxPanel = document.getElementById('mailboxPanel');
    const mailboxPanelClose = document.getElementById('mailboxPanelClose');
    const mailboxListView = document.getElementById('mailboxListView');
    const mailboxDetailView = document.getElementById('mailboxDetailView');
    const mailboxDetailBack = document.getElementById('mailboxDetailBack');
    const mailboxEmptyWidget = document.getElementById('mailboxEmptyWidget');
    const mailboxList = document.getElementById('mailboxList');
    const mailboxMessageContent = document.getElementById('mailboxMessageContent');

    // Cargar bandeja de localStorage
    const savedInbox = localStorage.getItem('aura_inbox');
    if (savedInbox) {
        try {
            simulatedInbox = JSON.parse(savedInbox);
            unreadCount = simulatedInbox.filter(m => m.unread).length;
            updateMailboxUI();
        } catch (e) {
            simulatedInbox = [];
        }
    }

    function addMessageToInbox(sender, subject, body, actionData = null, triggerGlow = true) {
        const newMsg = {
            id: 'msg-' + Date.now() + '-' + Math.floor(Math.random() * 100),
            sender,
            subject,
            body,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            unread: true,
            isSMS: false,
            actionData
        };

        simulatedInbox.unshift(newMsg);
        unreadCount++;
        saveInbox();
        updateMailboxUI();

        if (triggerGlow && mailboxTrigger) {
            mailboxTrigger.classList.add('glow');
        }
    }

    function saveInbox() {
        localStorage.setItem('aura_inbox', JSON.stringify(simulatedInbox));
    }

    function updateMailboxUI() {
        if (mailboxBadge) {
            mailboxBadge.textContent = unreadCount;
            mailboxBadge.style.display = unreadCount > 0 ? 'flex' : 'none';
        }

        if (!mailboxList || !mailboxEmptyWidget) return;

        if (simulatedInbox.length === 0) {
            mailboxEmptyWidget.style.display = 'flex';
            mailboxList.innerHTML = '';
        } else {
            mailboxEmptyWidget.style.display = 'none';
            mailboxList.innerHTML = simulatedInbox.map(msg => `
                <div class="mailbox-item ${msg.unread ? 'unread' : ''}" data-id="${msg.id}">
                    <div class="mailbox-item-meta">
                        <span class="mailbox-item-sender">${msg.sender}</span>
                        <span>${msg.time}</span>
                    </div>
                    <div class="mailbox-item-subject">${msg.subject}</div>
                    <div class="mailbox-item-preview">${stripHTML(msg.body)}</div>
                </div>
            `).join('');

            // Agregar clics a elementos
            document.querySelectorAll('.mailbox-item').forEach(item => {
                item.addEventListener('click', () => {
                    openMessageDetail(item.dataset.id);
                });
            });
        }
    }

    function openMessageDetail(msgId) {
        const msg = simulatedInbox.find(m => m.id === msgId);
        if (!msg) return;

        if (msg.unread) {
            msg.unread = false;
            unreadCount = Math.max(0, unreadCount - 1);
            saveInbox();
            updateMailboxUI();
        }

        const messageHTML = `
            <div class="mail-header">
                <div class="mail-subject" style="font-family: var(--font-serif); font-size: 1.15rem; color: var(--text-primary); font-weight: 600; margin-bottom: 4px;">${msg.subject}</div>
                <div class="mail-sender-info" style="font-size: 0.8rem; color: var(--text-secondary);">De: ${msg.sender} &bull; Para: Mí &bull; Recibido: ${msg.time}</div>
            </div>
            <div class="simulated-email" style="margin-top: 16px; font-size: 0.9rem; line-height: 1.5; color: var(--text-primary);">
                <div class="mail-body">${msg.body}</div>
            </div>
        `;

        if (mailboxMessageContent) mailboxMessageContent.innerHTML = messageHTML;

        // Navegar a vista detalle
        if (mailboxListView) mailboxListView.classList.add('mailbox-view-container--hidden');
        if (mailboxDetailView) mailboxDetailView.classList.remove('mailbox-view-container--hidden');
    }

    if (mailboxDetailBack) {
        mailboxDetailBack.addEventListener('click', () => {
            if (mailboxDetailView) mailboxDetailView.classList.add('mailbox-view-container--hidden');
            if (mailboxListView) mailboxListView.classList.remove('mailbox-view-container--hidden');
        });
    }

    if (mailboxTrigger) {
        mailboxTrigger.addEventListener('click', () => {
            if (mailboxPanel) {
                mailboxPanel.classList.toggle('active');
                mailboxTrigger.classList.remove('glow');
            }
        });
    }

    if (mailboxPanelClose) {
        mailboxPanelClose.addEventListener('click', () => {
            if (mailboxPanel) mailboxPanel.classList.remove('active');
        });
    }

    // Auxiliares de texto
    function stripHTML(html) {
        const tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    }

    // LÓGICA DE TOASTS
    const toastContainer = document.getElementById('toastContainer');

    function showToast(title, message, type = 'success') {
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        let icon = '';
        if (type === 'success') {
            icon = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
        } else if (type === 'error') {
            icon = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
        }

        toast.innerHTML = `
            <div class="toast-icon">${icon}</div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
        `;

        toastContainer.appendChild(toast);

        // Entrada animada
        setTimeout(() => toast.classList.add('active'), 10);

        // Salida automática
        setTimeout(() => {
            toast.classList.remove('active');
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    }
});
