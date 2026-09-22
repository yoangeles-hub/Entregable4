document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. DATA DE COMPONENTES Y MATERIALES
    // ==========================================
    const materialsData = {
        micelio: {
            title: "Micelio de Hongo",
            type: "Aglutinante Natural Vivo",
            badge: "Estructura Orgánica",
            desc: "El micelio es la red vegetativa subterránea de los hongos (Pleurotus ostreatus). Durante la incubación, el micelio consume el sustrato orgánico y entrelaza las fibras en una red sólida y moldeada sin requerir pega química ni calor excesivo.",
            image: "https://images.unsplash.com/photo-1541108564883-fa8151707883?auto=format&fit=crop&w=800&q=80",
            points: [
                "Aglutinado tridimensional microscópico",
                "Sustituye adhesivos sintéticos y resinas tóxicas",
                "Se descompone como materia orgánica en el compost"
            ]
        },
        aserrin: {
            title: "Aserrín Orgánico",
            type: "Base Principal de Densidad",
            badge: "Sustrato de Madera",
            desc: "Obtenido de madereras locales con manejo sustentable. El aserrín le otorga consistencia, rigidez estructural y la densidad necesaria para soportar objetos pesados como productos de cerámica o tecnología.",
            image: "https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?auto=format&fit=crop&w=800&q=80",
            points: [
                "Base principal del volumen de empaque",
                "Aporta resistencia a la compresión (≥ 50 kPa)",
                "Residuo industrial valorizado en economía circular"
            ]
        },
        paja: {
            title: "Paja & Fibra Agrícola",
            type: "Ligereza y Flexibilidad",
            badge: "Fibra Vegetal",
            desc: "Las fibras de paja aportan elasticidad al cuerpo del molde, previniendo resquebrajamientos o grietas cuando el paquete sufre impactos de caída durante el transporte express.",
            image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
            points: [
                "Reduce el peso total del empaque para envíos",
                "Capacidad de amortiguación de caídas mecánicas",
                "Procedencia agrícola 100% renovable"
            ]
        },
        cascarilla: {
            title: "Cascarilla de Arroz",
            type: "Textura & Aislamiento Térmico",
            badge: "Protección Térmica",
            desc: "La cascarilla de arroz es rica en sílice natural. Aporta propiedades refractarias y de aislamiento térmico, además de mejorar la textura final del acabado al tacto del consumidor.",
            image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
            points: [
                "Aislamiento térmico frente a cambios de temperatura",
                "Acabado estético y suave al tacto de lujo",
                "Resistencia hidrófoba contra humedad ligera"
            ]
        }
    };

    // ==========================================
    // 2. INTERACCIÓN DE PESTAÑAS DE MATERIALES
    // ==========================================
    const materialCards = document.querySelectorAll('.comp-card');
    const matTitle = document.getElementById('matTitle');
    const matType = document.getElementById('matType');
    const matBadge = document.getElementById('matBadge');
    const matDesc = document.getElementById('matDesc');
    const matImage = document.getElementById('matImage');
    const matList = document.getElementById('matList');

    materialCards.forEach(card => {
        card.addEventListener('click', () => {
            const key = card.getAttribute('data-mat');
            const data = materialsData[key];

            materialCards.forEach(c => c.classList.remove('active', 'border-primary-orange'));
            card.classList.add('active', 'border-primary-orange');

            if (data) {
                if (matTitle) matTitle.textContent = data.title;
                if (matType) matType.textContent = data.type;
                if (matBadge) matBadge.textContent = data.badge;
                if (matDesc) matDesc.textContent = data.desc;
                if (matImage) matImage.src = data.image;

                if (matList) {
                    matList.innerHTML = data.points.map(p => `
                        <li class="flex items-center gap-2">
                            <i class="fa-solid fa-circle-check text-primary-orange"></i> ${p}
                        </li>
                    `).join('');
                }
            }
        });
    });

    // ==========================================
    // 3. SISTEMA DEL CARRITO DE COMPRAS
    // ==========================================
    let cart = [];
    const cartBtn = document.getElementById('cartBtn');
    const cartModal = document.getElementById('cartModal');
    const cartContainer = document.getElementById('cartContainer');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const cartCount = document.getElementById('cartCount');
    const cartItemsList = document.getElementById('cartItemsList');
    const emptyCartMsg = document.getElementById('emptyCartMsg');
    const cartTotal = document.getElementById('cartTotal');

    function toggleCart(show) {
        if (!cartModal || !cartContainer) return;
        if (show) {
            cartModal.classList.remove('opacity-0', 'pointer-events-none');
            cartContainer.classList.remove('translate-x-full');
        } else {
            cartModal.classList.add('opacity-0', 'pointer-events-none');
            cartContainer.classList.add('translate-x-full');
        }
    }

    if (cartBtn) cartBtn.addEventListener('click', () => toggleCart(true));
    if (closeCartBtn) closeCartBtn.addEventListener('click', () => toggleCart(false));
    if (cartModal) {
        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) toggleCart(false);
        });
    }

    window.addToCart = function(title, price) {
        const existing = cart.find(item => item.title === title);
        if (existing) {
            existing.qty++;
        } else {
            cart.push({ title, price, qty: 1 });
        }
        updateCartUI();
        showToast(`¡"${title}" agregado al carrito!`);
    };

    function updateCartUI() {
        const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

        if (cartCount) cartCount.textContent = totalItems;
        if (cartTotal) cartTotal.textContent = `$${totalPrice.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`;

        if (!cartItemsList) return;

        if (cart.length === 0) {
            if (emptyCartMsg) emptyCartMsg.style.display = 'block';
            cartItemsList.innerHTML = '';
            if (emptyCartMsg) cartItemsList.appendChild(emptyCartMsg);
        } else {
            if (emptyCartMsg) emptyCartMsg.style.display = 'none';
            cartItemsList.innerHTML = cart.map((item, idx) => `
                <div class="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <div>
                        <h4 class="font-bold text-dark-green text-xs">${item.title}</h4>
                        <span class="text-[11px] text-gray-500">$${item.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN c/u</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-xs font-bold text-primary-orange">x${item.qty}</span>
                        <button onclick="removeFromCart(${idx})" class="text-gray-400 hover:text-red-500 text-xs ml-2">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }

    window.removeFromCart = function(index) {
        cart.splice(index, 1);
        updateCartUI();
    };

    window.checkout = function() {
        if (cart.length === 0) {
            showToast("Tu carrito está vacío.");
            return;
        }
        showToast("¡Pedido procesado! Redirigiendo a pasarela de pago...");
        cart = [];
        updateCartUI();
        toggleCart(false);
    };

    // ==========================================
    // 4. FILTRADO Y BÚSQUEDA ÚNICA DE PRODUCTOS
    // ==========================================
    const productCards = document.querySelectorAll('.product-card');
    const searchInput = document.getElementById('searchInput');
    const searchCategory = document.getElementById('searchCategory');
    const searchBtn = document.getElementById('searchBtn');
    const visibleCount = document.getElementById('visibleCount');

    function filterProducts() {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const selectCat = searchCategory ? searchCategory.value : 'all';
        let count = 0;

        productCards.forEach(card => {
            const cardCategories = (card.getAttribute('data-category') || '').toLowerCase().split(' ');
            const text = card.textContent.toLowerCase();

            // Evalúa el selector del header único
            const matchesSelectCat = (selectCat === 'all') || cardCategories.includes(selectCat);

            // Evalúa el texto escrito
            const matchesSearch = text.includes(query);

            if (matchesSelectCat && matchesSearch) {
                card.style.display = 'flex';
                count++;
            } else {
                card.style.display = 'none';
            }
        });

        if (visibleCount) visibleCount.textContent = count;
    }

    // Eventos para la barra de búsqueda y selector principal
    if (searchBtn) searchBtn.addEventListener('click', filterProducts);
    if (searchInput) searchInput.addEventListener('input', filterProducts);
    if (searchCategory) searchCategory.addEventListener('change', filterProducts);

    // Ejecución inicial
    filterProducts();

    // ==========================================
    // 5. CALCULADORA AMBIENTAL
    // ==========================================
    const openCalcModal = document.getElementById('openCalcModal');
    const calcModal = document.getElementById('calcModal');
    const closeCalcModal = document.getElementById('closeCalcModal');
    const btnCalcClose = document.getElementById('btnCalcClose');
    const unitsInput = document.getElementById('unitsInput');
    const plasticSaved = document.getElementById('plasticSaved');
    const co2Saved = document.getElementById('co2Saved');

    function toggleCalc(show) {
        if (!calcModal) return;
        if (show) {
            calcModal.classList.remove('opacity-0', 'pointer-events-none');
        } else {
            calcModal.classList.add('opacity-0', 'pointer-events-none');
        }
    }

    if (openCalcModal) openCalcModal.addEventListener('click', () => toggleCalc(true));
    if (closeCalcModal) closeCalcModal.addEventListener('click', () => toggleCalc(false));
    if (btnCalcClose) btnCalcClose.addEventListener('click', () => toggleCalc(false));

    if (unitsInput) {
        unitsInput.addEventListener('input', () => {
            const val = parseFloat(unitsInput.value) || 0;
            const plastic = (val * 0.05).toFixed(1);
            const co2 = (val * 0.155).toFixed(1);
            if (plasticSaved) plasticSaved.textContent = `${plastic} kg`;
            if (co2Saved) co2Saved.textContent = `${co2} kg CO₂e`;
        });
    }

    // ==========================================
    // 6. NOTIFICACIONES TOAST Y BOTONES CTA
    // ==========================================
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');

    function showToast(msg) {
        if (!toast || !toastMsg) return;
        toastMsg.textContent = msg;
        toast.classList.remove('toast-enter');
        toast.classList.add('toast-active');
        setTimeout(() => {
            toast.classList.remove('toast-active');
            toast.classList.add('toast-enter');
        }, 3000);
    }

    const btnRequestSamples = document.getElementById('btnRequestSamples');
    if (btnRequestSamples) {
        btnRequestSamples.addEventListener('click', () => {
            showToast("Muestras gratuitas solicitadas. Un asesor se comunicará pronto.");
        });
    }

    // ==========================================
    // 7. INTEGRACIÓN WHATSAPP
    // ==========================================
    const whatsappNum = '5219982460228';
    const whatsappDefaultMsg = encodeURIComponent('Hola, me interesa conocer más sobre los empaques biodegradables de XIUPACK. Me gustaría recibir información sobre sus productos y cotizaciones.');
    
    window.openWhatsApp = function() {
        const url = `https://wa.me/${whatsappNum}?text=${whatsappDefaultMsg}`;
        window.open(url, '_blank');
    };

});
