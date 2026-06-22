/**
 * session-guard.js — Aura Beauté
 * Incluir en todas las páginas de categoría (cabello, facial, etc.)
 * 
 * Qué hace:
 *  1. Lee el usuario activo de localStorage (o URL params como respaldo)
 *  2. Si no hay sesión → redirige a login.html
 *  3. Si hay sesión → inyecta una mini-navbar en la parte superior con el
 *     nombre del usuario y un botón de cerrar sesión
 */
(function () {
    // ── 1. LEER SESIÓN ──────────────────────────────────────────────────────
    let activeUser = null;

    const stored = localStorage.getItem('aura_active_user');
    if (stored) {
        try { activeUser = JSON.parse(stored); } catch (e) { /* ignorar */ }
    }

    // Respaldo por URL params (útil en file://)
    if (!activeUser) {
        const p = new URLSearchParams(window.location.search);
        if (p.get('name') && p.get('email')) {
            activeUser = {
                name: p.get('name'),
                email: p.get('email'),
                username: p.get('username') || '',
                phone: p.get('phone') || ''
            };
            try { localStorage.setItem('aura_active_user', JSON.stringify(activeUser)); } catch (e) { }
        }
    }

    // ── 2. PROTECCIÓN: sin sesión → login ───────────────────────────────────
    if (!activeUser) {
        window.location.href = 'login.html';
        return; // Detener ejecución
    }

    // ── 3. INYECTAR NAVBAR DE SESIÓN ────────────────────────────────────────
    const initials = activeUser.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();

    const navHTML = `
    <div id="session-nav" style="
        background: rgba(255,255,255,0.92);
        backdrop-filter: blur(10px);
        border-bottom: 1px solid #f0e8e8;
        padding: 12px 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: sticky;
        top: 0;
        z-index: 999;
        font-family: 'Outfit', sans-serif;
    ">
        <!-- Logo -->
        <a href="store.html" style="
            text-decoration: none;
            color: #7a5d5f;
            font-weight: 700;
            font-size: 1.1rem;
            display: flex;
            align-items: center;
            gap: 8px;
        ">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c59b9d" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22C12 22 17 18 17 13C17 10.2386 14.7614 8 12 8C9.23858 8 7 10.2386 7 13C7 18 12 22 12 22Z"/>
                <path d="M12 8C12 8 15 5 15 3C15 1.89543 14.1046 1 13 1C11.8954 1 11 1.89543 11 3C11 5 12 8 12 8Z"/>
                <path d="M7 13C7 13 4 11 3 9C2.10457 8.20914 2.10457 6.79086 3 6C3.89543 5.20914 5.30457 5.20914 6.2 6C8 7.8 7 13 7 13Z"/>
                <path d="M17 13C17 13 20 11 21 9C21.8954 8.20914 21.8954 6.79086 21 6C20.1046 5.20914 18.6954 5.20914 17.8 6C16 7.8 17 13 17 13Z"/>
                <circle cx="12" cy="13" r="1" fill="#c59b9d"/>
            </svg>
            Aura Beauté
        </a>

        <!-- Usuario + Logout -->
        <div style="display:flex;align-items:center;gap:14px;">
            <!-- Avatar + nombre -->
            <div style="display:flex;align-items:center;gap:10px;">
                <div style="
                    width:34px;height:34px;border-radius:50%;
                    background:linear-gradient(135deg,#c59b9d,#e8c5c7);
                    display:flex;align-items:center;justify-content:center;
                    color:white;font-weight:700;font-size:0.8rem;
                    flex-shrink:0;
                ">${initials}</div>
                <span style="color:#7a5d5f;font-size:0.9rem;font-weight:500;">
                    Hola, <strong>${activeUser.name.split(' ')[0]}</strong>
                </span>
            </div>

            <!-- Botón cerrar sesión -->
            <button id="guardLogoutBtn" style="
                background: transparent;
                border: 1.5px solid #c59b9d;
                color: #b37e81;
                padding: 7px 16px;
                border-radius: 20px;
                cursor: pointer;
                font-size: 0.82rem;
                font-weight: 600;
                transition: all 0.25s;
                font-family: inherit;
            "
            onmouseover="this.style.background='#c59b9d';this.style.color='white';"
            onmouseout="this.style.background='transparent';this.style.color='#b37e81';"
            >
                Cerrar sesión
            </button>
        </div>
    </div>`;

    // Insertar la navbar antes de cualquier otro elemento del body
    document.body.insertAdjacentHTML('afterbegin', navHTML);

    // ── 4. LÓGICA DE LOGOUT ─────────────────────────────────────────────────
    document.getElementById('guardLogoutBtn').addEventListener('click', function () {
        localStorage.removeItem('aura_active_user');

        // Toast rápido antes de redirigir
        const toast = document.createElement('div');
        toast.textContent = '👋 Sesión cerrada. ¡Hasta pronto!';
        Object.assign(toast.style, {
            position: 'fixed', bottom: '24px', right: '24px',
            background: '#7a5d5f', color: 'white',
            padding: '12px 20px', borderRadius: '12px',
            fontSize: '0.9rem', zIndex: '10000',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            fontFamily: "'Outfit', sans-serif"
        });
        document.body.appendChild(toast);

        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    });
})();
