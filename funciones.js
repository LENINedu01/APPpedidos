// =======================================
// 1. VARIABLES GLOBALES DE ESTADO
// =======================================
let currentSlideIndex = 0;
const slides = [];
let mesaSeleccionada = "No seleccionada";
let cart = []; // [{name: 'Lomo Saltado', price: 18.00, quantity: 1}]
let subtotal = 0.00;
const totalPresentationSlides = 8; // Slides 1 a 8

// =======================================
// 2. FUNCIONES DE PRESENTACIÓN (Slideshow)
// =======================================

/**
 * Muestra una diapositiva específica por índice y aplica transiciones.
 * @param {number} newIndex - El índice de la diapositiva a mostrar.
 */
function showSlide(newIndex) {
    if (newIndex < 0 || newIndex >= slides.length) return;

    const oldIndex = currentSlideIndex;
    const direction = newIndex > oldIndex ? 'next' : 'prev';

    // 1. Ocultar la diapositiva actual
    if (slides[oldIndex]) {
        slides[oldIndex].classList.remove('active');
        slides[oldIndex].classList.add(direction); // Aplica clase para la transición de salida
    }
        
    currentSlideIndex = newIndex;

    // 2. Mostrar la nueva diapositiva
    const newSlide = slides[currentSlideIndex];
    newSlide.classList.remove('prev', 'next', 'hidden'); // **CLAVE:** Remueve 'hidden' y clases de dirección
    newSlide.classList.add('active');

    // 3. Actualizar contador
    const slideCounter = document.getElementById('slide-counter');
    let displayIndex = 0;
    if (currentSlideIndex >= 1 && currentSlideIndex <= 8) {
        displayIndex = currentSlideIndex;
        slideCounter.textContent = `Slide ${displayIndex} de ${totalPresentationSlides}`;
    } else {
        // Es frmInicio (0) o alguna pantalla de la app (9+), resalta el flujo de app
        slideCounter.textContent = `Demo App`;
    }

    // 4. Actualizar la barra lateral
    document.querySelectorAll('#slide-nav li').forEach(li => {
        li.classList.remove('active', 'bg-[var(--color-accent)]/20', 'text-[var(--color-primary)]');
        li.classList.add('text-gray-700', 'hover:bg-gray-100');
    });
    
    // Si estamos en una pantalla de app, resalta el slide 2 (Flujo y Lógica)
    let activeNavIndex = currentSlideIndex;
    if (newSlide.id.startsWith('frm') && newSlide.id !== 'frmInicio') {
        activeNavIndex = 2; 
    }
    
    const activeNavLi = document.querySelector(`#slide-nav li[data-slide="${activeNavIndex}"]`);
    if (activeNavLi) {
        activeNavLi.classList.add('active', 'bg-[var(--color-accent)]/20', 'text-[var(--color-primary)]');
        activeNavLi.classList.remove('text-gray-700', 'hover:bg-gray-100');
    }
    
    // 5. Mostrar/Ocultar el carrito flotante
    const isAppScreen = newSlide.id.startsWith('frm') && newSlide.id !== 'frmInicio';
    if (isAppScreen || newSlide.id === 'slide7') {
        document.getElementById('floating-cart').classList.remove('hidden');
        updatePaymentSummary();
    } else {
        document.getElementById('floating-cart').classList.add('hidden');
    }
}

function nextSlide() {
    // Solo permitir navegación lineal en las slides de presentación (0 a 8)
    if (currentSlideIndex < totalPresentationSlides) {
        showSlide(currentSlideIndex + 1);
    }
}

function prevSlide() {
    // Solo permitir navegación lineal en las slides de presentación (1 a 8)
    if (currentSlideIndex > 0 && currentSlideIndex <= totalPresentationSlides) {
        showSlide(currentSlideIndex - 1);
    }
}

/**
 * Maneja el clic en la barra lateral para navegar directamente.
 */
function handleSidebarClick(event) {
    let target = event.target.closest('li');
    if (target) {
        const targetSlide = parseInt(target.getAttribute('data-slide'));
        showSlide(targetSlide);
    }
}

/**
 * Muestra/Oculta un bloque de código.
 */
function toggleCodeBlock(event) {
    const targetId = event.target.getAttribute('data-target');
    const codeBlock = document.getElementById(targetId);
    if (codeBlock) {
        const isHidden = codeBlock.classList.toggle('hidden');
        event.target.textContent = isHidden ? 'Ver Código' : 'Ocultar Código';
    }
}

/**
 * Simula la descarga de los archivos de código fuente.
 */
/**
 * La función simulateDownload ahora es solo un placeholder en JS,
 * ya que el botón en el HTML apunta directamente al enlace de descarga (<a>).
 */
function simulateDownload() {
    console.log("========================================");
    console.log("DESCARGA INICIADA: El navegador está redirigiendo al enlace de descarga.");
    console.log("========================================");
}
   

// =======================================
// 3. FUNCIONES DEL MOCKUP DE LA APLICACIÓN
// =======================================

/**
 * Alterna la visibilidad entre las pantallas del mockup.
 * @param {string} screenId - El ID de la pantalla a mostrar.
 */
function showAppScreen(screenId) {
    // 1. Encontrar el índice del slide que vamos a mostrar
    const newIndex = slides.findIndex(s => s.id === screenId);

    // 2. Si se encuentra, usamos la función principal de navegación
    if (newIndex !== -1) {
        showSlide(newIndex);
    }
}

/**
 * Selecciona la mesa y navega a la selección de menú.
 */
function selectMesa(mesa) {
    mesaSeleccionada = mesa;
    console.log(`Mesa seleccionada: ${mesaSeleccionada}`);
    updateCartDisplay();
    showAppScreen('frmescoger');
}

/**
 * Navega a la pantalla específica del menú.
 */
function selectMenu(menuType) {
    showAppScreen(`frm${menuType}`);
}

/**
 * Vuelve a la pantalla principal de selección de menú (frmescoger).
 */
function goBackToChooser() {
    showAppScreen('frmescoger');
}

/**
 * Añade un ítem al carrito y actualiza la visualización.
 */
function addItem(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    subtotal += price;
    console.log(`Artículo añadido: ${name}. Subtotal: $${subtotal.toFixed(2)}`);
    updateCartDisplay();
}

/**
 * Actualiza la visualización del carrito flotante y el resumen final.
 */
function updateCartDisplay() {
    const cartContent = document.getElementById('cart-content');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const mesaDisplay = document.getElementById('mesa-display');
    
    mesaDisplay.textContent = `Mesa: ${mesaSeleccionada}`;
    
    // Llenar contenido del carrito flotante
    cartContent.innerHTML = '';
    
    if (cart.length === 0) {
        cartContent.innerHTML = '<p class="text-xs text-gray-400">Carrito vacío.</p>';
    } else {
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <span class="text-sm">${item.quantity}x ${item.name}</span>
                <span class="font-semibold">$${(item.price * item.quantity).toFixed(2)}</span>
            `;
            cartContent.appendChild(itemElement);
        });
    }

    cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    updatePaymentSummary(); // Sincroniza el resumen de pago de la Slide 7
}

/**
 * Sincroniza los datos del carrito con la Slide 7 (Resumen Final) y frmFinalizar.
 */
function updatePaymentSummary() {
    const summaryMesa = document.getElementById('summary-mesa');
    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryTotal = document.getElementById('summary-total');
    
    if (summaryMesa) summaryMesa.textContent = mesaSeleccionada;
    if (summarySubtotal) summarySubtotal.textContent = `$${subtotal.toFixed(2)}`;
    if (summaryTotal) summaryTotal.textContent = `$${subtotal.toFixed(2)}`;

    // Actualiza la pantalla de finalizar pedido (frmFinalizar)
    const finalMesaDisplay = document.getElementById('final-mesa-display');
    const finalSubtotalDisplay = document.getElementById('final-subtotal-display');
    const finalCartItems = document.getElementById('final-cart-items');

    if (finalMesaDisplay) finalMesaDisplay.textContent = mesaSeleccionada;
    if (finalSubtotalDisplay) finalSubtotalDisplay.textContent = `$${subtotal.toFixed(2)}`;
    
    if (finalCartItems) {
        finalCartItems.innerHTML = '';
        if (cart.length === 0) {
            finalCartItems.innerHTML = '<p class="text-gray-500 text-sm">El carrito está vacío.</p>';
        } else {
            cart.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('cart-item');
                itemElement.innerHTML = `
                    <span class="text-sm">${item.quantity}x ${item.name}</span>
                    <span class="font-semibold">$${(item.price * item.quantity).toFixed(2)}</span>
                `;
                finalCartItems.appendChild(itemElement);
            });
        }
    }
}

/**
 * Simula el envío del pedido al backend.
 */
function submitOrder() {
    const finalSummary = document.querySelector('#frmFinalizar .screen-content');
    
    // Crear el contenido de reset para poder volver al estado original
    const resetContent = `
        <h2 class="text-3xl font-bold mb-6 text-[var(--color-primary)]">Paso 3: Finalizar Pedido</h2>
        <p class="text-lg font-semibold mb-3">Mesa: <span id="final-mesa-display" class="text-red-500">${mesaSeleccionada}</span></p>
        <div id="final-cart-items" class="cart-items-list text-left p-4 bg-gray-50 rounded-lg max-h-48 overflow-y-auto mb-4 border">
        </div>
        <p class="text-2xl font-bold border-t pt-3">Subtotal: <span id="final-subtotal-display" class="text-red-600">$${subtotal.toFixed(2)}</span></p>
        <button class="btn primary-btn large-btn mt-6 px-10 py-3 text-lg" onclick="submitOrder()">
            <i class="fas fa-paper-plane mr-2"></i> Enviar Pedido a Cocina
        </button>
        <button class="btn secondary-btn mt-4 px-6 py-2" onclick="goBackToChooser()">
            <i class="fas fa-undo mr-2"></i> Volver al Menú
        </button>
    `;

    if (cart.length === 0) {
        console.warn("No se puede enviar un pedido vacío.");
        finalSummary.innerHTML = `<i class="fas fa-exclamation-triangle fa-5x text-yellow-500 mb-4"></i>
                                     <p class="text-xl font-bold mb-4">¡Error! El carrito está vacío.</p>
                                     <p class="mb-6">Por favor, vuelve al menú y selecciona al menos un ítem.</p>
                                     <button class="btn secondary-btn" onclick="showAppScreen('frmescoger')">
                                         <i class="fas fa-undo mr-2"></i> Volver al Menú
                                     </button>`;
        return;
    }
    
    console.log("========================================");
    console.log("PEDIDO ENVIADO (Mock API POST):");
    console.log("Mesa:", mesaSeleccionada);
    console.log("Items:", cart);
    console.log("Total:", subtotal.toFixed(2));
    console.log("========================================");

    // Simulación de éxito
    finalSummary.innerHTML = `
        <i class="fas fa-check-circle fa-5x text-[var(--color-accent)] mb-4"></i>
        <h2 class="text-3xl font-bold mb-4 text-green-700">¡Pedido Enviado con Éxito!</h2>
        <p class="text-lg mb-8 text-gray-600">Su pedido se está preparando en cocina. Puede proceder al pago.</p>
        <button class="btn primary-btn px-8 py-3" onclick="showSlide(7)"><i class="fas fa-credit-card mr-2"></i> Ir a Pago (Slide 7)</button>
        <button class="btn secondary-btn mt-4 px-6 py-2" onclick="location.reload()"><i class="fas fa-redo mr-2"></i> Nuevo Pedido (Recargar Demo)</button>
    `;
    
    document.getElementById('floating-cart').classList.add('hidden');
}

// =======================================
// 4. LÓGICA DE INICIO
// =======================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtener todas las diapositivas
    slides.push(...document.querySelectorAll('.slide'));

    // 2. Configurar listeners de navegación
    document.getElementById('next-btn').addEventListener('click', nextSlide);
    document.getElementById('prev-btn').addEventListener('click', prevSlide);
    document.getElementById('slide-nav').addEventListener('click', handleSidebarClick);
    document.querySelectorAll('.toggle-code-btn').forEach(button => {
        button.addEventListener('click', toggleCodeBlock);
    });

    // Listener del botón de inicio
    document.getElementById('btnInicio').addEventListener('click', () => {
        showSlide(1); // Muestra la slide de Introducción
    });

    // 3. Mostrar la diapositiva inicial (frmInicio)
    showSlide(currentSlideIndex);
    updateCartDisplay(); // Inicializar el carrito
});
