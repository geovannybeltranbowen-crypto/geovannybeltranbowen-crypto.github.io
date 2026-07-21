// ============================================
// GB. NETWORK - MAIN.JS
// Funcionalidades completas sin modificar lógica
// ============================================

// ===== 1. CARGA DE PRODUCTOS (SIN CAMBIOS) =====
document.addEventListener('DOMContentLoaded', () => {
    cargarProductos('promociones');
    cargarProductos('inventario');
    actualizarFecha();
    iniciarSlider();
    iniciarContador();
    iniciarEventos();
    cargarLogo();
});

// Función original - NO MODIFICAR
async function cargarProductos(tipo) {
    try {
        const response = await fetch(`datos/${tipo}.json`);
        const productos = await response.json();
        const contenedor = document.getElementById(`contenedor-${tipo}`);
        contenedor.innerHTML = '';
        if (productos.length === 0) {
            contenedor.innerHTML = '<p class="sin-productos">No hay productos disponibles</p>';
            return;
        }
        productos.forEach(producto => {
            const tarjeta = crearTarjeta(producto, tipo);
            contenedor.appendChild(tarjeta);
        });
        if (tipo === 'inventario') {
            aplicarFiltros();
        }
    } catch (error) {
        console.error(`Error cargando ${tipo}:`, error);
        document.getElementById(`contenedor-${tipo}`).innerHTML = 
            '<p class="error">Error al cargar productos</p>';
    }
}

// Función original - MODIFICADA para badges y acciones
function crearTarjeta(producto, tipo) {
    const div = document.createElement('div');
    div.className = 'tarjeta-producto';
    div.dataset.nombre = producto.nombre.toLowerCase();
    div.dataset.categoria = obtenerCategoria(producto.nombre);
    
    const rutaImagen = `imagenes/${tipo}/${producto.imagen}`;
    
    let badge = '';
    if (tipo === 'promociones') {
        badge = '<span class="badge badge-oferta">🔥 Oferta</span>';
    } else {
        const random = Math.random();
        if (random < 0.3) badge = '<span class="badge badge-destacado">⭐ Destacado</span>';
        else if (random < 0.5) badge = '<span class="badge badge-nuevo">🆕 Nuevo</span>';
        else if (random < 0.7) badge = '<span class="badge badge-vendido">🏆 Más vendido</span>';
    }
    
    div.innerHTML = `
        <div class="badges">${badge}</div>
        <div class="img-container" onclick="abrirModal('${tipo}', '${producto.imagen}', '${producto.nombre}', '${producto.precio}', '${producto.descripcion}', '${producto.fecha}')">
            <img src="${rutaImagen}" alt="${producto.nombre}" loading="lazy">
            <div class="img-overlay"><span>👁️ Ver Detalles</span></div>
        </div>
        <div class="info">
            <h3>${producto.nombre}</h3>
            <div class="precio">$${producto.precio}</div>
            <div class="descripcion">${producto.descripcion || 'Sin descripción'}</div>
            <div class="fecha">📅 ${producto.fecha || 'Fecha no disponible'}</div>
            <div class="card-actions">
                <button class="btn-detail" onclick="abrirModal('${tipo}', '${producto.imagen}', '${producto.nombre}', '${producto.precio}', '${producto.descripcion}', '${producto.fecha}')">Ver Detalles</button>
                <button class="btn-whatsapp" onclick="abrirWhatsapp('${producto.nombre}', '${producto.precio}')"><i class="fab fa-whatsapp"></i></button>
            </div>
        </div>
    `;
    
    return div;
}

// ===== 2. FUNCIONES ORIGINALES (NO MODIFICAR) =====
function mostrarSeccion(tipo) {
    document.querySelectorAll('.seccion').forEach(sec => sec.classList.remove('activo'));
    document.getElementById(tipo).classList.add('activo');
    
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
    const navMap = { 'inicio': 0, 'inventario': 1 };
    if (navMap[tipo] !== undefined) {
        const links = document.querySelectorAll('.nav-links a');
        if (links[navMap[tipo]]) links[navMap[tipo]].classList.add('active');
    }
    
    document.getElementById('navLinks').classList.remove('open');
}

function actualizarFecha() {
    const fecha = new Date();
    const opciones = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const fechaEl = document.getElementById('fecha-actualizacion');
    if (fechaEl) {
        fechaEl.textContent = fecha.toLocaleDateString('es-ES', opciones);
    }
}

// ===== 3. FUNCIONES NUEVAS =====

// 3.0 CARGA DE LOGO
function cargarLogo() {
    const logoImg = document.getElementById('logoImage');
    const logoText = document.getElementById('logoText');
    
    // Intentar cargar logo desde /logo/
    const logoPaths = ['logo/logo.png', 'logo/logo.jpg', 'logo/logo.webp', 'logo/logo.jpeg'];
    
    let intento = 0;
    
    function probarLogo() {
        if (intento >= logoPaths.length) {
            // No se encontró logo, mostrar texto
            logoImg.style.display = 'none';
            logoText.style.display = 'flex';
            return;
        }
        
        const img = new Image();
        img.onload = function() {
            // Logo encontrado
            logoImg.src = logoPaths[intento];
            logoImg.style.display = 'block';
            logoText.style.display = 'none';
        };
        img.onerror = function() {
            intento++;
            probarLogo();
        };
        img.src = logoPaths[intento];
    }
    
    probarLogo();
}

// 3.1 Helper: Obtener categoría
function obtenerCategoria(nombre) {
    const nombreLower = nombre.toLowerCase();
    if (nombreLower.includes('laptop') || nombreLower.includes('notebook') || nombreLower.includes('hp') || nombreLower.includes('lenovo') || nombreLower.includes('dell') || nombreLower.includes('asus')) {
        return 'laptop';
    }
    if (nombreLower.includes('pc') || nombreLower.includes('desktop') || nombreLower.includes('computadora')) {
        return 'pc';
    }
    if (nombreLower.includes('gaming') || nombreLower.includes('gamer')) {
        return 'gaming';
    }
    if (nombreLower.includes('camara') || nombreLower.includes('camera') || nombreLower.includes('foto')) {
        return 'camara';
    }
    if (nombreLower.includes('wifi') || nombreLower.includes('router') || nombreLower.includes('switch') || nombreLower.includes('red')) {
        return 'redes';
    }
    if (nombreLower.includes('impresora') || nombreLower.includes('printer')) {
        return 'impresora';
    }
    if (nombreLower.includes('teclado') || nombreLower.includes('mouse') || nombreLower.includes('audifono') || nombreLower.includes('monitor')) {
        return 'accesorio';
    }
    if (nombreLower.includes('procesador') || nombreLower.includes('ram') || nombreLower.includes('disco') || nombreLower.includes('ssd') || nombreLower.includes('placa')) {
        return 'componente';
    }
    return 'all';
}

// 3.2 SLIDER HERO - REDUCIDO
let slideIndex = 0;
let sliderInterval;

function iniciarSlider() {
    const container = document.getElementById('sliderContainer');
    const indicadores = document.getElementById('sliderIndicators');
    
    fetch('datos/promociones.json')
        .then(res => res.json())
        .then(productos => {
            if (productos.length === 0) {
                container.innerHTML = `<div class="slide active"><div class="slide-content"><h2>Bienvenido a <span>GB. Network</span></h2><p style="color:white;font-size:16px;">Sube tus primeras promociones</p></div></div>`;
                return;
            }
            
            container.innerHTML = '';
            productos.forEach((p, i) => {
                const slide = document.createElement('div');
                slide.className = `slide${i === 0 ? ' active' : ''}`;
                slide.innerHTML = `
                    <img src="imagenes/promociones/${p.imagen}" alt="${p.nombre}" loading="lazy">
                    <div class="slide-content">
                        <h2>${p.nombre}</h2>
                        <div class="slide-price">$${p.precio}</div>
                        <button class="slide-btn" onclick="abrirModal('promociones', '${p.imagen}', '${p.nombre}', '${p.precio}', '${p.descripcion}', '${p.fecha}')">Ver Producto</button>
                    </div>
                `;
                container.appendChild(slide);
            });
            
            indicadores.innerHTML = '';
            productos.forEach((_, i) => {
                const dot = document.createElement('span');
                dot.className = `dot${i === 0 ? ' active' : ''}`;
                dot.onclick = () => irSlide(i);
                indicadores.appendChild(dot);
            });
            
            iniciarAutoPlay();
        })
        .catch(() => {
            container.innerHTML = `<div class="slide active"><div class="slide-content"><h2>Bienvenido a <span>GB. Network</span></h2><p style="color:white;font-size:16px;">Carga imágenes en la carpeta promociones</p></div></div>`;
        });
    
    document.getElementById('sliderPrev').addEventListener('click', () => { cambiarSlide(-1); reiniciarAutoPlay(); });
    document.getElementById('sliderNext').addEventListener('click', () => { cambiarSlide(1); reiniciarAutoPlay(); });
    
    const slider = document.getElementById('heroSlider');
    slider.addEventListener('mouseenter', () => clearInterval(sliderInterval));
    slider.addEventListener('mouseleave', iniciarAutoPlay);
}

function cambiarSlide(direction) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    if (slides.length === 0) return;
    
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    
    slideIndex = (slideIndex + direction + slides.length) % slides.length;
    slides[slideIndex].classList.add('active');
    if (dots[slideIndex]) dots[slideIndex].classList.add('active');
}

function irSlide(index) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    if (slides.length === 0) return;
    
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    
    slideIndex = index;
    slides[index].classList.add('active');
    if (dots[index]) dots[index].classList.add('active');
    reiniciarAutoPlay();
}

function iniciarAutoPlay() {
    clearInterval(sliderInterval);
    sliderInterval = setInterval(() => cambiarSlide(1), 4000);
}

function reiniciarAutoPlay() {
    clearInterval(sliderInterval);
    sliderInterval = setInterval(() => cambiarSlide(1), 4000);
}

// 3.3 COUNTDOWN
function iniciarContador() {
    const targetDate = new Date();
    targetDate.setHours(targetDate.getHours() + 48);
    
    function actualizarContador() {
        const now = new Date();
        const diff = targetDate - now;
        
        if (diff <= 0) {
            document.getElementById('countdownDisplay').textContent = '00d 00h 00m';
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        document.getElementById('countdownDisplay').textContent = 
            `${String(days).padStart(2, '0')}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m`;
    }
    
    actualizarContador();
    setInterval(actualizarContador, 10000);
}

// 3.4 BUSCADOR
function iniciarBuscador() {
    const input = document.getElementById('searchInput');
    if (!input) return;
    
    input.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const seccion = document.querySelector('.seccion.activo');
        if (!seccion) return;
        
        const tarjetas = seccion.querySelectorAll('.tarjeta-producto');
        tarjetas.forEach(tarjeta => {
            const nombre = tarjeta.dataset.nombre || '';
            tarjeta.style.display = nombre.includes(query) || query === '' ? 'block' : 'none';
        });
    });
}

// 3.5 FILTROS
function aplicarFiltros() {
    const filtroActivo = document.querySelector('.filter-btn.active');
    if (!filtroActivo) return;
    
    const categoria = filtroActivo.dataset.filter;
    const contenedor = document.getElementById('contenedor-inventario');
    if (!contenedor) return;
    
    const tarjetas = contenedor.querySelectorAll('.tarjeta-producto');
    tarjetas.forEach(tarjeta => {
        const cat = tarjeta.dataset.categoria || 'all';
        tarjeta.style.display = (categoria === 'all' || cat === categoria) ? 'block' : 'none';
    });
}

function iniciarFiltros() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            aplicarFiltros();
        });
    });
}

// 3.6 TOGGLE INVENTARIO
function iniciarToggleInventario() {
    const btn = document.getElementById('toggleInventario');
    const container = document.getElementById('inventario-container');
    if (!btn || !container) return;
    
    btn.addEventListener('click', () => {
        const isOpen = container.classList.contains('inventario-visible');
        if (isOpen) {
            container.classList.remove('inventario-visible');
            container.classList.add('inventario-hidden');
            btn.innerHTML = '<i class="fas fa-chevron-down"></i> Ver Inventario Completo';
        } else {
            container.classList.remove('inventario-hidden');
            container.classList.add('inventario-visible');
            btn.innerHTML = '<i class="fas fa-chevron-up"></i> Ocultar Inventario';
            if (!container.dataset.cargado) {
                cargarProductos('inventario');
                container.dataset.cargado = 'true';
            }
        }
    });
}

// 3.7 MODAL
function abrirModal(tipo, imagen, nombre, precio, descripcion, fecha) {
    const modal = document.getElementById('productModal');
    document.getElementById('modalImage').src = `imagenes/${tipo}/${imagen}`;
    document.getElementById('modalName').textContent = nombre;
    document.getElementById('modalPrice').textContent = `$${precio}`;
    document.getElementById('modalDescription').textContent = descripcion || 'Sin descripción';
    document.getElementById('modalWhatsapp').href = `https://wa.me/51999999999?text=Hola!%20Quiero%20información%20sobre%20${encodeURIComponent(nombre)}%20-%20$${precio}`;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function cerrarModal() {
    document.getElementById('productModal').classList.remove('active');
    document.body.style.overflow = '';
}

// 3.8 WHATSAPP
function abrirWhatsapp(nombre, precio) {
    const msg = `Hola! Quiero información sobre ${nombre} - $${precio}`;
    window.open(`https://wa.me/51999999999?text=${encodeURIComponent(msg)}`, '_blank');
}

// 3.9 MODO OSCURO
function iniciarModoOscuro() {
    const btn = document.getElementById('themeToggle');
    const icon = btn.querySelector('i');
    
    if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        icon.className = 'fas fa-sun';
    }
    
    btn.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            icon.className = 'fas fa-moon';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            icon.className = 'fas fa-sun';
        }
    });
}

// 3.10 SCROLL TOP
function iniciarScrollTop() {
    const btn = document.getElementById('scrollTop');
    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 400);
    });
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// 3.11 HEADER SCROLL
function iniciarHeaderScroll() {
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });
}

// 3.12 MENÚ MÓVIL
function iniciarMenuMovil() {
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    toggle.addEventListener('click', () => {
        links.classList.toggle('open');
    });
}

// ===== 4. INICIALIZAR TODAS LAS FUNCIONES =====
function iniciarEventos() {
    iniciarBuscador();
    iniciarFiltros();
    iniciarToggleInventario();
    iniciarModoOscuro();
    iniciarScrollTop();
    iniciarHeaderScroll();
    iniciarMenuMovil();
    
    document.getElementById('modalClose').addEventListener('click', cerrarModal);
    document.getElementById('productModal').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) cerrarModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') cerrarModal();
    });
    
    document.getElementById('whatsappFloat').href = 'https://wa.me/51999999999';
}