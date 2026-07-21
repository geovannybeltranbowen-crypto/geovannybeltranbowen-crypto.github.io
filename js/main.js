// Cargar datos al iniciar
document.addEventListener('DOMContentLoaded', () => {
    cargarProductos('promociones');
    cargarProductos('inventario');
    actualizarFecha();
});

// Función para cargar productos desde JSON
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
    } catch (error) {
        console.error(`Error cargando ${tipo}:`, error);
        document.getElementById(`contenedor-${tipo}`).innerHTML = 
            '<p class="error">Error al cargar productos</p>';
    }
}

// Función para crear tarjeta de producto
function crearTarjeta(producto, tipo) {
    const div = document.createElement('div');
    div.className = 'tarjeta-producto';
    
    const rutaImagen = `imagenes/${tipo}/${producto.imagen}`;
    
    div.innerHTML = `
        <img src="${rutaImagen}" alt="${producto.nombre}" loading="lazy">
        <div class="info">
            <h3>${producto.nombre}</h3>
            <div class="precio">$${producto.precio}</div>
            <div class="descripcion">${producto.descripcion || 'Sin descripción'}</div>
            <div class="fecha">📅 ${producto.fecha || 'Fecha no disponible'}</div>
        </div>
    `;
    
    return div;
}

// Función para cambiar entre secciones
function mostrarSeccion(tipo) {
    document.querySelectorAll('section').forEach(sec => sec.classList.remove('activo'));
    document.getElementById(tipo).classList.add('activo');
}

// Actualizar fecha en footer
function actualizarFecha() {
    const fecha = new Date();
    const opciones = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    document.getElementById('fecha-actualizacion').textContent = 
        fecha.toLocaleDateString('es-ES', opciones);
}