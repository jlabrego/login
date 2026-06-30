document.addEventListener('DOMContentLoaded', () => {
    let registerFaceDataURL = null;

    // ==========================================================================
    // 1. BASE DE DATOS LOCAL (Lógica de Almacenamiento)
    // ==========================================================================
    const DEFAULT_USERS = [
        {
            name: "Jessica Abrego",
            email: "jessica@aurabeaute.com",
            username: "jessica_beaute",
            password: "Password123",
            phone: "+50499999999",
            faceImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop"
        },
        {
            name: "Aura Beauté Admin",
            email: "admin@aurabeaute.com",
            username: "aura_admin",
            password: "AdminSecure99",
            phone: "+521111111111",
            faceImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop"
        }
    ];

    function initDatabase() {
        if (!localStorage.getItem('aetheria_users')) {
            localStorage.setItem('aetheria_users', JSON.stringify(DEFAULT_USERS));
        }
    }

    function getUsers() {
        return JSON.parse(localStorage.getItem('aetheria_users')) || DEFAULT_USERS;
    }

    function saveUser(newUser) {
        const users = getUsers();
        users.push(newUser);
        localStorage.setItem('aetheria_users', JSON.stringify(users));
        if (typeof renderDevUserList === 'function') renderDevUserList();
    }

    function findUserByEmail(email) {
        const users = getUsers();
        return users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    }

    function findUserByPhone(phone) {
        const users = getUsers();
        return users.find(u => u.phone === phone.trim());
    }

    function findUserByUsername(username) {
        const users = getUsers();
        return users.find(u => u.username.toLowerCase() === username.toLowerCase().trim());
    }

    function updateUserPassword(email, newPassword) {
        const users = getUsers();
        const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase().trim());
        if (userIndex !== -1) {
            users[userIndex].password = newPassword;
            localStorage.setItem('aetheria_users', JSON.stringify(users));
            return true;
        }
        return false;
    }

    // Inicializar BD
    initDatabase();

    // ==========================================================================
    // 2. SELECCIÓN DE ELEMENTOS DEL DOM
    // ==========================================================================
    // Contenedores principales
    const authContainer = document.getElementById('authContainer');
    const tabLogin = document.getElementById('tabLogin');
    const tabRegister = document.getElementById('tabRegister');
    const tabSlider = document.querySelector('.tab-slider');
    const formsSlider = document.getElementById('formsSlider');
    const authSubtitle = document.getElementById('authSubtitle');
    const toastContainer = document.getElementById('toastContainer');

    // Formularios base
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Modal de Recuperación
    const forgotModal = document.getElementById('forgotModal');
    const openForgotModalBtn = document.getElementById('openForgotModal');
    const forgotModalCloseBtn = document.getElementById('forgotModalClose');

    // Vistas del Modal
    const forgotMethodView = document.getElementById('forgotMethodView');
    const forgotEmailView = document.getElementById('forgotEmailView');
    const forgotPhoneView = document.getElementById('forgotPhoneView');
    const forgotEmailSuccessView = document.getElementById('forgotEmailSuccessView');
    const forgotPhoneVerifyView = document.getElementById('forgotPhoneVerifyView');
    const forgotResetPasswordView = document.getElementById('forgotResetPasswordView');

    // Botones de Navegación del Modal
    const methodEmailBtn = document.getElementById('methodEmail');
    const methodPhoneBtn = document.getElementById('methodPhone');
    const backFromEmailBtn = document.getElementById('backFromEmail');
    const backFromPhoneBtn = document.getElementById('backFromPhone');
    const backFromPhoneVerifyBtn = document.getElementById('backFromPhoneVerify');

    // Formularios del Modal
    const forgotEmailForm = document.getElementById('forgotEmailForm');
    const forgotPhoneForm = document.getElementById('forgotPhoneForm');
    const forgotSMSVerifyForm = document.getElementById('forgotSMSVerifyForm');
    const forgotResetForm = document.getElementById('forgotResetForm');

    // Botones de Confirmación final
    const forgotEmailDoneBtn = document.getElementById('forgotEmailDoneBtn');

    // Buzón de Simulación
    const simMailbox = document.getElementById('simMailbox');
    const mailboxTrigger = document.getElementById('mailboxTrigger');
    const mailboxBadge = document.getElementById('mailboxBadge');
    const mailboxPanel = document.getElementById('mailboxPanel');
    const mailboxPanelClose = document.getElementById('mailboxPanelClose');
    const mailboxListView = document.getElementById('mailboxListView');
    const mailboxDetailView = document.getElementById('mailboxDetailView');
    const mailboxList = document.getElementById('mailboxList');
    const mailboxEmpty = document.getElementById('mailboxEmpty');
    const mailboxDetailBack = document.getElementById('mailboxDetailBack');
    const mailboxMessageContent = document.getElementById('mailboxMessageContent');

    // ==========================================================================
    // 3. ALTERNANCIA DE PANEL DE INGRESO (LOGIN / REGISTRO)
    // ==========================================================================
    function switchTab(target) {
        if (target === 'login') {
            tabLogin.classList.add('active');
            tabRegister.classList.remove('active');
            tabSlider.style.transform = 'translateX(0%)';
            formsSlider.style.transform = 'translateX(0%)';
            authSubtitle.textContent = 'Inicia sesión para acceder a tu panel de control.';
        } else {
            tabLogin.classList.remove('active');
            tabRegister.classList.add('active');
            tabSlider.style.transform = 'translateX(100%)';
            formsSlider.style.transform = 'translateX(-50%)';
            authSubtitle.textContent = 'Únete a nuestra plataforma premium hoy mismo.';
        }
    }

    tabLogin.addEventListener('click', () => switchTab('login'));
    tabRegister.addEventListener('click', () => switchTab('register'));

    // Redes Sociales en desarrollo
    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            showToast('Integración en desarrollo', 'La autenticación social se habilitará en producción.', 'error');
        });
    });

    // ==========================================================================
    // 4. MOSTRAR / OCULTAR CONTRASEÑA
    // ==========================================================================
    function setupPasswordToggles() {
        const toggles = document.querySelectorAll('.toggle-password');
        toggles.forEach(button => {
            // Evitar duplicación de listeners si se llama de nuevo
            if (button.dataset.listenerSet) return;
            button.dataset.listenerSet = "true";

            button.addEventListener('click', () => {
                const passwordInput = button.parentElement.querySelector('input');
                const isPassword = passwordInput.type === 'password';
                
                passwordInput.type = isPassword ? 'text' : 'password';
                
                if (isPassword) {
                    button.innerHTML = `
                        <svg class="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                            <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                    `;
                    button.setAttribute('aria-label', 'Ocultar contraseña');
                } else {
                    button.innerHTML = `
                        <svg class="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                    `;
                    button.setAttribute('aria-label', 'Mostrar contraseña');
                }
            });
        });
    }

    setupPasswordToggles();

    // ==========================================================================
    // 5. SISTEMA DE TOAST NOTIFICATIONS
    // ==========================================================================
    function showToast(title, message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const iconSvg = type === 'success' 
            ? `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`
            : `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

        toast.innerHTML = `
            <div class="toast-icon">${iconSvg}</div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
        `;

        toastContainer.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 50);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    }

    // ==========================================================================
    // 6. VALIDACIONES Y MANEJO DE ERRORES DE ENTRADA
    // ==========================================================================
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // 8+ chars, 1 letra, 1 número

    function setError(inputElement, isValid, errorMsg = '') {
        const group = inputElement.closest('.input-group');
        if (!group) return isValid;
        
        const errorSpan = group.querySelector('.error-msg');
        
        if (isValid) {
            group.classList.remove('invalid');
        } else {
            group.classList.add('invalid');
            if (errorMsg && errorSpan) {
                errorSpan.textContent = errorMsg;
            }
        }
        return isValid;
    }

    // Limpiar errores en focus/input
    const allInputs = document.querySelectorAll('.input-group input, .phone-field input');
    allInputs.forEach(input => {
        input.addEventListener('input', () => {
            const group = input.closest('.input-group');
            if (group) group.classList.remove('invalid');
        });
    });

    // ==========================================================================
    // 7. MOTOR DE BUZÓN DE SIMULACIÓN (SMS & CORREOS)
    // ==========================================================================
    let simulatedInbox = [];
    let unreadCount = 0;

    function addMessageToInbox(sender, subject, htmlBody, actionData = null, isSMS = false) {
        const msg = {
            id: Date.now() + Math.random().toString(36).substr(2, 5),
            sender,
            subject,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            body: htmlBody,
            actionData,
            isSMS,
            unread: true
        };

        simulatedInbox.unshift(msg);
        unreadCount++;
        updateMailboxUI();

        // Notificación Toast
        if (isSMS) {
            showToast('💬 Nuevo SMS Recibido', 'Revisa el buzón de simulación flotante.', 'success');
        } else {
            showToast('📬 Nuevo Correo Recibido', 'Revisa el buzón de simulación flotante.', 'success');
        }

        // Hacer brillar el buzón
        mailboxTrigger.classList.add('glow');
    }

    function updateMailboxUI() {
        // Actualizar Badge
        if (unreadCount > 0) {
            mailboxBadge.textContent = unreadCount;
            mailboxBadge.classList.add('active');
        } else {
            mailboxBadge.classList.remove('active');
        }

        // Renderizar Lista
        if (simulatedInbox.length === 0) {
            mailboxEmpty.style.display = 'flex';
            mailboxList.innerHTML = '';
        } else {
            mailboxEmpty.style.display = 'none';
            mailboxList.innerHTML = simulatedInbox.map(msg => `
                <div class="mailbox-item ${msg.unread ? 'unread' : ''}" data-id="${msg.id}">
                    <div class="mailbox-item-meta">
                        <span class="mailbox-item-sender">${msg.sender}</span>
                        <span>${msg.time}</span>
                    </div>
                    <div class="mailbox-item-subject">${msg.subject}</div>
                    <div class="mailbox-item-preview">${isHTML(msg.body) ? stripHTML(msg.body) : msg.body}</div>
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
            updateMailboxUI();
        }

        // Rellenar contenido del mensaje
        let messageHTML = '';
        if (msg.isSMS) {
            messageHTML = `
                <div class="mail-header">
                    <div class="mail-subject">${msg.subject}</div>
                    <div class="mail-sender-info">Remitente: ${msg.sender} &bull; Recibido: ${msg.time}</div>
                </div>
                <div class="simulated-sms">
                    <div class="sms-bubble">${msg.body}</div>
                </div>
            `;
        } else {
            messageHTML = `
                <div class="mail-header">
                    <div class="mail-subject">${msg.subject}</div>
                    <div class="mail-sender-info">De: ${msg.sender} &bull; Para: Mí &bull; Recibido: ${msg.time}</div>
                </div>
                <div class="simulated-email">
                    <div class="mail-body">${msg.body}</div>
                </div>
            `;
        }

        mailboxMessageContent.innerHTML = messageHTML;

        // Si hay un botón de acción en el email
        const actionBtn = mailboxMessageContent.querySelector('.email-btn');
        if (actionBtn) {
            actionBtn.addEventListener('click', (e) => {
                e.preventDefault();
                handleMailboxAction(msg.actionData);
                closeMailboxPanel();
            });
        }

        // Navegar a vista detalle
        mailboxListView.classList.add('mailbox-view-container--hidden');
        mailboxDetailView.classList.remove('mailbox-view-container--hidden');
    }

    // Cerrar y volver en la vista del buzón
    mailboxDetailBack.addEventListener('click', () => {
        mailboxDetailView.classList.add('mailbox-view-container--hidden');
        mailboxListView.classList.remove('mailbox-view-container--hidden');
    });

    function handleMailboxAction(actionData) {
        if (!actionData) return;

        if (actionData.type === 'verify_register') {
            // Flujo Registro: Completar cuenta en BD
            const user = actionData.user;
            saveUser(user);
            showToast('¡Cuenta Activada!', `Felicidades ${user.name}, tu correo ha sido verificado con éxito.`, 'success');
            
            // Redirigir a Login y rellenar correo
            switchTab('login');
            document.getElementById('loginEmail').value = user.email;
            document.getElementById('loginPassword').focus();

            // Cerrar modal si estuviera abierto
            closeForgotModal();

        } else if (actionData.type === 'reset_password') {
            // Flujo Recuperación: Llevar a pantalla de cambio de clave
            currentRecoveryEmail = actionData.email;
            
            // Ocultar vistas e ir a Vista 5
            hideAllModalViews();
            forgotResetPasswordView.classList.remove('modal-view--hidden');
            
            // Si el modal está cerrado, abrirlo
            forgotModal.classList.add('active');
        }
    }

    // Auxiliares de texto
    function isHTML(str) {
        return /<[a-z][\s\S]*>/i.test(str);
    }

    function stripHTML(html) {
        const tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    }

    // Control de Apertura/Cierre del Panel del Buzón
    function toggleMailboxPanel() {
        mailboxPanel.classList.toggle('active');
        mailboxTrigger.classList.remove('glow'); // Quitar glow al abrir
    }

    function closeMailboxPanel() {
        mailboxPanel.classList.remove('active');
    }

    mailboxTrigger.addEventListener('click', toggleMailboxPanel);
    mailboxPanelClose.addEventListener('click', closeMailboxPanel);

    // ==========================================================================
    // 8. LOGICA DE FORMULARIO DE INICIO DE SESIÓN
    // ==========================================================================
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('loginEmail');
        const pass = document.getElementById('loginPassword');
        let isValid = true;

        if (!email.value.trim() || !emailRegex.test(email.value)) {
            isValid = setError(email, false, 'Introduce una dirección de correo válida.') && isValid;
        } else {
            setError(email, true);
        }

        if (!pass.value) {
            isValid = setError(pass, false, 'La contraseña es obligatoria.') && isValid;
        } else {
            setError(pass, true);
        }

        if (!isValid) return;

        // Comprobación de usuario
        const submitBtn = document.getElementById('loginSubmitBtn');
        submitBtn.classList.add('loading');
        toggleFormInputs(loginForm, true);

        setTimeout(() => {
            submitBtn.classList.remove('loading');
            toggleFormInputs(loginForm, false);

            const user = findUserByEmail(email.value);

            if (!user) {
                showToast('Acceso Denegado', 'El correo electrónico no está registrado.', 'error');
                setError(email, false, 'Correo no registrado.');
                return;
            }

            if (user.password !== pass.value) {
                showToast('Acceso Denegado', 'La contraseña es incorrecta.', 'error');
                setError(pass, false, 'Contraseña incorrecta.');
                return;
            }

            // Éxito: Guardar datos en localStorage y redirigir
            localStorage.setItem('aura_active_user', JSON.stringify({
                name: user.name,
                email: user.email,
                username: user.username,
                phone: user.phone
            }));

            showToast('¡Acceso Autorizado!', `Bienvenido de nuevo, ${user.name}.`, 'success');
            loginForm.reset();
            animateLoginSuccess(user);

        }, 1500);
    });

    function toggleFormInputs(form, isDisabled) {
        const elements = form.querySelectorAll('input, button:not(.submit-btn), .social-btn');
        elements.forEach(el => {
            if (isDisabled) el.setAttribute('disabled', 'true');
            else el.removeAttribute('disabled');
        });
    }

    function animateLoginSuccess(user) {
        authContainer.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.6s ease';
        authContainer.style.transform = 'scale(0.9) translateY(-30px)';
        authContainer.style.opacity = '0';
        
        // Parámetros de respaldo en URL para compatibilidad con protocolo file:// local
        const params = user ? `?name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}&username=${encodeURIComponent(user.username)}&phone=${encodeURIComponent(user.phone)}` : '';
        
        setTimeout(() => {
            window.location.href = 'store.html' + params;
        }, 1800);
    }

    // ==========================================================================
    // 9. LOGICA DE FORMULARIO DE REGISTRO
    // ==========================================================================
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('registerName');
        const email = document.getElementById('registerEmail');
        const pass = document.getElementById('registerPassword');
        const terms = document.getElementById('acceptTerms');
        let isValid = true;

        if (!name.value.trim() || name.value.trim().length < 3) {
            isValid = setError(name, false, 'El nombre debe tener al menos 3 letras.') && isValid;
        } else {
            setError(name, true);
        }

        if (!email.value.trim() || !emailRegex.test(email.value)) {
            isValid = setError(email, false, 'Introduce una dirección de correo válida.') && isValid;
        } else {
            setError(email, true);
        }

        if (!pass.value || !passwordRegex.test(pass.value)) {
            isValid = setError(pass, false, 'Mínimo 8 caracteres, al menos una letra y un número.') && isValid;
        } else {
            setError(pass, true);
        }

        if (!terms.checked) {
            showToast('Términos requeridos', 'Debes aceptar los términos y privacidad.', 'error');
            isValid = false;
        }

        if (!isValid) return;

        // Comprobación de duplicados
        const emailExists = findUserByEmail(email.value);
        if (emailExists) {
            showToast('Error de registro', 'Este correo electrónico ya está registrado.', 'error');
            setError(email, false, 'Correo duplicado.');
            return;
        }

        const generatedUsername = email.value.split('@')[0];
        const userExists = findUserByUsername(generatedUsername);
        if (userExists) {
            showToast('Error de registro', 'El nombre de usuario derivado ya existe.', 'error');
            setError(email, false, 'Intenta con otro correo.');
            return;
        }

        // Flujo del diagrama: Enviar email de verificación
        const submitBtn = document.getElementById('registerSubmitBtn');
        submitBtn.classList.add('loading');
        toggleFormInputs(registerForm, true);

        setTimeout(() => {
            submitBtn.classList.remove('loading');
            toggleFormInputs(registerForm, false);

            const userPayload = {
                name: name.value.trim(),
                email: email.value.trim(),
                username: generatedUsername,
                password: pass.value,
                phone: `+504${Math.floor(10000000 + Math.random() * 90000000)}`, // Generar un número simulado
                faceImage: registerFaceDataURL || null
            };

            // Enviar correo de verificación simulado
            const verifyHTML = `
                <p>¡Hola <strong>${userPayload.name}</strong>!</p>
                <p>Gracias por unirte a <em>Aura Beauté</em>. Para activar tu cuenta de belleza (<code>${userPayload.username}</code>) y comenzar a disfrutar de tu tocador digital, confirma tu correo electrónico haciendo clic en el siguiente enlace.</p>
                <button class="email-btn">✨ Verificar mi Cuenta</button>
            `;

            addMessageToInbox(
                'Aura Beauté <bienvenida@aurabeaute.com>',
                'Activa tu cuenta en Aura Beauté',
                verifyHTML,
                { type: 'verify_register', user: userPayload },
                false
            );

            showToast('Verificación Enviada', 'Hemos enviado un correo de verificación. Confírmalo para activar tu cuenta.', 'success');
            
            // Resetear y mandar a Login
            registerForm.reset();
            registerFaceDataURL = null;
            if (registerFaceStatus) {
                registerFaceStatus.textContent = '📸 Configurar Face ID (Opcional)';
            }
            if (registerFaceConfigBtn) {
                registerFaceConfigBtn.style.borderColor = '';
                registerFaceConfigBtn.style.color = '';
                registerFaceConfigBtn.style.background = '';
            }
            switchTab('login');

        }, 1800);
    });

    // ==========================================================================
    // 10. MODAL DE RECUPERACIÓN (Navegación y Flujos)
    // ==========================================================================
    let currentRecoveryEmail = '';
    let currentRecoverySMSCode = '';

    // Abrir modal
    openForgotModalBtn.addEventListener('click', (e) => {
        e.preventDefault();
        hideAllModalViews();
        forgotMethodView.classList.remove('modal-view--hidden');
        forgotModal.classList.add('active');
    });

    // Cerrar modal
    function closeForgotModal() {
        forgotModal.classList.remove('active');
        setTimeout(() => {
            forgotEmailForm.reset();
            forgotPhoneForm.reset();
            forgotSMSVerifyForm.reset();
            forgotResetForm.reset();
            // Limpiar estados de error
            document.querySelectorAll('#forgotModal .input-group').forEach(group => {
                group.classList.remove('invalid');
            });
        }, 400);
    }

    forgotModalCloseBtn.addEventListener('click', closeForgotModal);
    
    // Cerrar haciendo clic fuera
    forgotModal.addEventListener('click', (e) => {
        if (e.target === forgotModal) closeForgotModal();
    });

    // Ocultar vistas del modal
    function hideAllModalViews() {
        const views = [
            forgotMethodView,
            forgotEmailView,
            forgotPhoneView,
            forgotEmailSuccessView,
            forgotPhoneVerifyView,
            forgotResetPasswordView
        ];
        views.forEach(view => {
            if (view) view.classList.add('modal-view--hidden');
        });
    }

    // Transiciones de vistas
    methodEmailBtn.addEventListener('click', () => {
        hideAllModalViews();
        forgotEmailView.classList.remove('modal-view--hidden');
    });

    methodPhoneBtn.addEventListener('click', () => {
        hideAllModalViews();
        forgotPhoneView.classList.remove('modal-view--hidden');
    });

    backFromEmailBtn.addEventListener('click', () => {
        hideAllModalViews();
        forgotMethodView.classList.remove('modal-view--hidden');
    });

    backFromPhoneBtn.addEventListener('click', () => {
        hideAllModalViews();
        forgotMethodView.classList.remove('modal-view--hidden');
    });

    backFromPhoneVerifyBtn.addEventListener('click', () => {
        hideAllModalViews();
        forgotPhoneView.classList.remove('modal-view--hidden');
    });

    // Entendido / Cerrar éxito
    forgotEmailDoneBtn.addEventListener('click', closeForgotModal);

    // ==========================================================================
    // 11. ENVIAR CORREO DE RECUPERACIÓN (LÓGICA)
    // ==========================================================================
    forgotEmailForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const emailInput = document.getElementById('forgotEmail');
        if (!emailInput.value.trim() || !emailRegex.test(emailInput.value)) {
            setError(emailInput, false, 'Introduce una dirección de correo válida.');
            return;
        }
        setError(emailInput, true);

        // Validar si existe en la BD
        const user = findUserByEmail(emailInput.value);
        if (!user) {
            setError(emailInput, false, 'El correo no está registrado en el sistema.');
            showToast('Error de búsqueda', 'El correo no existe.', 'error');
            return;
        }

        const recoveryType = document.querySelector('input[name="recoveryEmailType"]:checked').value;
        const submitBtn = document.getElementById('forgotEmailSubmitBtn');

        submitBtn.classList.add('loading');
        emailInput.setAttribute('disabled', 'true');

        setTimeout(() => {
            submitBtn.classList.remove('loading');
            emailInput.removeAttribute('disabled');

            if (recoveryType === 'username') {
                // Flujo Recuperar Usuario por correo
                const userHTML = `
                    <p>Hola <strong>${user.name}</strong>,</p>
                    <p>Has solicitado recordar tu nombre de acceso a <em>Aura Beauté</em>. Tu nombre de usuario registrado es:</p>
                    <p style="font-size: 1.2rem; text-align: center; margin: 12px 0; font-weight: 700; color: #b48587;">${user.username}</p>
                    <p>Ya puedes volver a tu tocador e iniciar sesión con tu correo o usuario.</p>
                `;

                addMessageToInbox(
                    'Aura Beauté Concierge <concierge@aurabeaute.com>',
                    'Tu nombre de usuario en Aura Beauté',
                    userHTML,
                    null,
                    false
                );

                showToast('Usuario Enviado', 'Revisa tu buzón flotante para ver tu nombre de usuario.', 'success');
                closeForgotModal();

            } else {
                // Flujo Recuperar Contraseña por correo
                const passHTML = `
                    <p>Hola <strong>${user.name}</strong>,</p>
                    <p>Recibimos una solicitud para restablecer tu contraseña de acceso al tocador de <em>Aura Beauté</em>.</p>
                    <p>Haz clic en el botón para abrir la pantalla de restablecimiento de contraseña.</p>
                    <button class="email-btn">🔐 Restablecer mi Contraseña</button>
                    <p style="font-size: 0.725rem; color: #a89a9c; margin-top: 10px;">Si no solicitaste esto, puedes ignorar este mensaje con seguridad.</p>
                `;

                addMessageToInbox(
                    'Aura Beauté Seguridad <seguridad@aurabeaute.com>',
                    'Restablece tu contraseña — Aura Beauté',
                    passHTML,
                    { type: 'reset_password', email: user.email },
                    false
                );

                hideAllModalViews();
                forgotEmailSuccessView.classList.remove('modal-view--hidden');
            }

        }, 1500);
    });

    // ==========================================================================
    // 12. ENVIAR SMS DE RECUPERACIÓN (LÓGICA)
    // ==========================================================================
    forgotPhoneForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const phoneInput = document.getElementById('forgotPhone');
        const prefixSelect = document.getElementById('phonePrefix');
        const fullPhone = prefixSelect.value + phoneInput.value.trim();

        if (!phoneInput.value.trim() || phoneInput.value.trim().length < 6) {
            setError(phoneInput, false, 'Introduce un número de teléfono válido.');
            return;
        }
        setError(phoneInput, true);

        // Validar si existe en la BD
        const user = findUserByPhone(fullPhone);
        if (!user) {
            setError(phoneInput, false, 'El teléfono no está asociado a ninguna cuenta.');
            showToast('Error de búsqueda', 'El número de teléfono no existe.', 'error');
            return;
        }

        const recoveryType = document.querySelector('input[name="recoveryPhoneType"]:checked').value;
        const submitBtn = document.getElementById('forgotPhoneSubmitBtn');

        submitBtn.classList.add('loading');
        phoneInput.setAttribute('disabled', 'true');

        setTimeout(() => {
            submitBtn.classList.remove('loading');
            phoneInput.removeAttribute('disabled');

            // Generar código numérico de 6 dígitos
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            currentRecoverySMSCode = code;
            currentRecoveryEmail = user.email; // Almacenar el correo para cuando se restablezca clave

            if (recoveryType === 'username') {
                // Flujo Recuperar Usuario por SMS
                const smsText = `Aetheria: Hola ${user.name}. Tu nombre de usuario es: [${user.username}].`;
                
                addMessageToInbox(
                    `SMS (${fullPhone})`,
                    'Nombre de usuario recuperado',
                    smsText,
                    null,
                    true
                );

                showToast('Usuario Enviado', 'Revisa el SMS recibido en el buzón flotante.', 'success');
                closeForgotModal();

            } else {
                // Flujo Recuperar Contraseña por SMS: Requiere introducir código
                const smsText = `Aetheria: Tu código de verificación es <span class="sms-code-highlight">${code}</span>. Válido por 10 minutos.`;

                addMessageToInbox(
                    `SMS (${fullPhone})`,
                    'Código de verificación de contraseña',
                    smsText,
                    null,
                    true
                );

                // Ir a ingresar código
                hideAllModalViews();
                forgotPhoneVerifyView.classList.remove('modal-view--hidden');
            }

        }, 1500);
    });

    // ==========================================================================
    // 13. VERIFICAR CÓDIGO SMS (LÓGICA)
    // ==========================================================================
    forgotSMSVerifyForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const codeInput = document.getElementById('smsCodeInput');
        const submitBtn = document.getElementById('smsVerifySubmitBtn');

        if (!codeInput.value || codeInput.value.length !== 6 || codeInput.value !== currentRecoverySMSCode) {
            setError(codeInput, false, 'Código incorrecto. Revisa el buzón e ingresa el código exacto.');
            return;
        }
        setError(codeInput, true);

        submitBtn.classList.add('loading');
        codeInput.setAttribute('disabled', 'true');

        setTimeout(() => {
            submitBtn.classList.remove('loading');
            codeInput.removeAttribute('disabled');

            // Código exitoso -> Ir a cambiar contraseña
            hideAllModalViews();
            forgotResetPasswordView.classList.remove('modal-view--hidden');
            setupPasswordToggles(); // Asegurar funcionalidad de toggles de clave

        }, 1200);
    });

    // ==========================================================================
    // 14. RESTABLECER CONTRASEÑA FINAL (LÓGICA)
    // ==========================================================================
    forgotResetForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const passInput = document.getElementById('resetPassword');
        const confirmInput = document.getElementById('resetConfirmPassword');
        let isValid = true;

        if (!passInput.value || !passwordRegex.test(passInput.value)) {
            isValid = setError(passInput, false, 'Debe tener 8+ caracteres, con letras y números.') && isValid;
        } else {
            setError(passInput, true);
        }

        if (passInput.value !== confirmInput.value) {
            isValid = setError(confirmInput, false, 'Las contraseñas no coinciden.') && isValid;
        } else {
            setError(confirmInput, true);
        }

        if (!isValid) return;

        const submitBtn = document.getElementById('forgotResetSubmitBtn');
        submitBtn.classList.add('loading');
        passInput.setAttribute('disabled', 'true');
        confirmInput.setAttribute('disabled', 'true');

        setTimeout(() => {
            submitBtn.classList.remove('loading');
            passInput.removeAttribute('disabled');
            confirmInput.removeAttribute('disabled');

            // Actualizar contraseña en la BD local
            const success = updateUserPassword(currentRecoveryEmail, passInput.value);

            if (success) {
                showToast('Contraseña Actualizada', 'Tu contraseña ha sido restablecida con éxito.', 'success');
                
                // Redirigir a Login y precargar email
                switchTab('login');
                document.getElementById('loginEmail').value = currentRecoveryEmail;
                document.getElementById('loginPassword').focus();

                closeForgotModal();
            } else {
                showToast('Error', 'No se pudo actualizar la contraseña. Reinténtalo.', 'error');
            }

        }, 1500);
    });

    // ==========================================================================
    // 15. LÓGICA DE RECONOCIMIENTO FACIAL (FACE ID)
    // ==========================================================================
    const faceScannerModal = document.getElementById('faceScannerModal');
    const faceModalClose = document.getElementById('faceModalClose');
    const loginFaceBtn = document.getElementById('loginFaceBtn');
    const registerFaceConfigBtn = document.getElementById('registerFaceConfigBtn');
    const registerFaceStatus = document.getElementById('registerFaceStatus');
    
    const faceCaptureView = document.getElementById('faceCaptureView');
    const faceCompareView = document.getElementById('faceCompareView');
    const faceVideo = document.getElementById('faceVideo');
    const faceOverlayCanvas = document.getElementById('faceOverlayCanvas');
    const faceCaptureBtn = document.getElementById('faceCaptureBtn');
    const cameraFlash = document.getElementById('cameraFlash');
    
    const faceLiveCanvas = document.getElementById('faceLiveCanvas');
    const faceRegisteredPhoto = document.getElementById('faceRegisteredPhoto');
    const matchVal = document.getElementById('matchVal');
    const matchFill = document.getElementById('matchFill');
    const faceCompareStatus = document.getElementById('faceCompareStatus');
    const faceSuccessBtn = document.getElementById('faceSuccessBtn');
    const faceRetryBtn = document.getElementById('faceRetryBtn');
    const faceCompareIcon = document.getElementById('faceCompareIcon');
    
    let faceStream = null;
    let faceScannerMode = 'login'; // 'login' o 'register'
    let isOverlayLoopActive = false;
    let isScanningComplete = false;
    
    // Puntos biométricos simulados
    const facePoints = [
        {x: 0.35, y: 0.35}, {x: 0.45, y: 0.32}, {x: 0.55, y: 0.32}, {x: 0.65, y: 0.35}, // Cejas
        {x: 0.40, y: 0.42}, {x: 0.60, y: 0.42}, // Ojos
        {x: 0.50, y: 0.48}, {x: 0.50, y: 0.55}, {x: 0.46, y: 0.58}, {x: 0.54, y: 0.58}, // Nariz
        {x: 0.44, y: 0.66}, {x: 0.50, y: 0.65}, {x: 0.56, y: 0.66}, {x: 0.50, y: 0.70}, // Boca
        {x: 0.30, y: 0.45}, {x: 0.70, y: 0.45}, {x: 0.33, y: 0.62}, {x: 0.67, y: 0.62}, {x: 0.50, y: 0.80} // Contorno
    ];

    function openFaceScanner(mode) {
        faceScannerMode = mode;
        isScanningComplete = false;
        
        // Resetear vistas
        faceCaptureView.classList.remove('modal-view--hidden');
        faceCompareView.classList.add('modal-view--hidden');
        faceSuccessBtn.style.display = 'none';
        faceRetryBtn.style.display = 'none';
        
        // Configurar títulos y textos según el modo
        if (mode === 'register') {
            document.getElementById('faceModalTitle').textContent = 'Registrar Rostro (Face ID)';
            document.getElementById('faceModalSubtitle').textContent = 'Coloca tu rostro en el centro para guardarlo como tu firma biométrica.';
            faceCaptureBtn.querySelector('.btn-text').textContent = 'Capturar Rostro';
        } else {
            document.getElementById('faceModalTitle').textContent = 'Escáner Facial Biométrico';
            document.getElementById('faceModalSubtitle').textContent = 'Alinea tu rostro dentro del marco para iniciar sesión automáticamente.';
            faceCaptureBtn.querySelector('.btn-text').textContent = 'Escanear y Autenticar';
        }
        
        faceScannerModal.classList.add('active');
        startCamera();
    }

    function closeFaceScanner() {
        stopCamera();
        faceScannerModal.classList.remove('active');
    }

    function startCamera() {
        if (faceStream) stopCamera();
        
        navigator.mediaDevices.getUserMedia({ 
            video: { 
                width: { ideal: 640 }, 
                height: { ideal: 480 },
                facingMode: "user"
            } 
        })
        .then(stream => {
            faceStream = stream;
            faceVideo.srcObject = stream;
            faceVideo.play();
            
            // Iniciar ciclo de dibujo del overlay
            isOverlayLoopActive = true;
            requestAnimationFrame(tickFaceOverlay);
        })
        .catch(err => {
            console.error('Error al acceder a la cámara:', err);
            showToast('Error de Cámara', 'No pudimos acceder a tu cámara. Asegúrate de dar los permisos necesarios en el navegador.', 'error');
            closeFaceScanner();
        });
    }

    function stopCamera() {
        isOverlayLoopActive = false;
        if (faceStream) {
            faceStream.getTracks().forEach(track => track.stop());
            faceStream = null;
        }
        faceVideo.srcObject = null;
    }

    function tickFaceOverlay() {
        if (!isOverlayLoopActive) return;
        
        const width = faceOverlayCanvas.width = faceVideo.videoWidth || 640;
        const height = faceOverlayCanvas.height = faceVideo.videoHeight || 480;
        const ctx = faceOverlayCanvas.getContext('2d');
        
        ctx.clearRect(0, 0, width, height);
        
        // Dibujar malla biométrica con una leve vibración simulada
        ctx.fillStyle = 'rgba(179, 126, 129, 0.85)'; // var(--primary) con opacidad
        ctx.strokeStyle = 'rgba(179, 126, 129, 0.3)';
        ctx.lineWidth = 1;
        
        const absolutePoints = facePoints.map(pt => {
            // Simular vibración
            const jitterX = (Math.random() - 0.5) * 2.5;
            const jitterY = (Math.random() - 0.5) * 2.5;
            return {
                x: pt.x * width + jitterX,
                y: pt.y * height + jitterY
            };
        });
        
        // Dibujar puntos
        absolutePoints.forEach(pt => {
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 4, 0, 2 * Math.PI);
            ctx.fill();
            
            // Brillo adicional para puntos clave
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 8, 0, 2 * Math.PI);
            ctx.fillStyle = 'rgba(179, 126, 129, 0.15)';
            ctx.fill();
            ctx.fillStyle = 'rgba(179, 126, 129, 0.85)';
        });
        
        // Conectar algunos puntos para simular la estructura
        ctx.beginPath();
        // Contorno
        ctx.moveTo(absolutePoints[14].x, absolutePoints[14].y);
        ctx.lineTo(absolutePoints[16].x, absolutePoints[16].y);
        ctx.lineTo(absolutePoints[18].x, absolutePoints[18].y);
        ctx.lineTo(absolutePoints[17].x, absolutePoints[17].y);
        ctx.lineTo(absolutePoints[15].x, absolutePoints[15].y);
        ctx.stroke();
        
        // Nariz y cejas
        ctx.beginPath();
        ctx.moveTo(absolutePoints[1].x, absolutePoints[1].y);
        ctx.lineTo(absolutePoints[6].x, absolutePoints[6].y);
        ctx.lineTo(absolutePoints[7].x, absolutePoints[7].y);
        ctx.moveTo(absolutePoints[2].x, absolutePoints[2].y);
        ctx.lineTo(absolutePoints[6].x, absolutePoints[6].y);
        ctx.stroke();
        
        if (isOverlayLoopActive) {
            requestAnimationFrame(tickFaceOverlay);
        }
    }

    function captureFaceSnapshot() {
        // Efecto Flash
        cameraFlash.classList.add('flash-active');
        setTimeout(() => cameraFlash.classList.remove('flash-active'), 400);

        // Capturar frame en un canvas temporal
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = faceVideo.videoWidth || 640;
        tempCanvas.height = faceVideo.videoHeight || 480;
        const tempCtx = tempCanvas.getContext('2d');
        
        // Dibujar el video
        tempCtx.drawImage(faceVideo, 0, 0, tempCanvas.width, tempCanvas.height);
        const dataURL = tempCanvas.toDataURL('image/jpeg');

        stopCamera();

        if (faceScannerMode === 'register') {
            // Guardar imagen para el registro
            registerFaceDataURL = dataURL;
            registerFaceStatus.textContent = 'Rostro Registrado ✓';
            registerFaceConfigBtn.style.borderColor = 'var(--success)';
            registerFaceConfigBtn.style.color = 'var(--success)';
            registerFaceConfigBtn.style.background = 'rgba(125, 160, 138, 0.08)';
            
            showToast('Rostro Capturado', 'Tu firma facial ha sido registrada temporalmente. Completa el formulario para guardarla.', 'success');
            closeFaceScanner();
        } else {
            // Modo Login: Iniciar comparación biométrica
            runBiometricComparison(dataURL);
        }
    }

    function runBiometricComparison(liveDataURL) {
        faceCaptureView.classList.add('modal-view--hidden');
        faceCompareView.classList.remove('modal-view--hidden');
        
        // Renderizar foto en vivo en el canvas de comparación
        const liveCtx = faceLiveCanvas.getContext('2d');
        const imgLive = new Image();
        imgLive.onload = () => {
            faceLiveCanvas.width = imgLive.width;
            faceLiveCanvas.height = imgLive.height;
            liveCtx.drawImage(imgLive, 0, 0);
        };
        imgLive.src = liveDataURL;

        // Buscar si existe algún usuario con rostro registrado
        const emailInputVal = document.getElementById('loginEmail').value.trim();
        const users = getUsers();
        let matchedUser = null;

        if (emailInputVal) {
            matchedUser = users.find(u => u.email.toLowerCase() === emailInputVal.toLowerCase() && u.faceImage);
        } else {
            // Si no introdujo email, buscar el primer usuario que tenga rostro registrado
            matchedUser = users.find(u => u.faceImage);
        }

        if (!matchedUser) {
            // No hay coincidencias en la BD
            faceRegisteredPhoto.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'; // Avatar por defecto
            faceCompareIcon.className = 'modal-icon';
            faceCompareIcon.style.color = 'var(--error)';
            faceCompareIcon.style.backgroundColor = 'rgba(205, 134, 136, 0.1)';
            faceCompareIcon.style.borderColor = 'rgba(205, 134, 136, 0.2)';
            
            faceCompareStatus.textContent = 'No se encontró una firma biométrica coincidente.';
            matchVal.textContent = '0%';
            matchFill.style.width = '0%';
            faceRetryBtn.style.display = 'block';
            faceSuccessBtn.style.display = 'none';
            showToast('Fallo Biométrico', 'Tu rostro no coincide con ningún usuario registrado.', 'error');
            return;
        }

        // Si se encuentra un usuario coincidente
        faceRegisteredPhoto.src = matchedUser.faceImage;
        
        // --- LÓGICA DE SIMULACIÓN CONTROLADA POR EL USUARIO ---
        // Se lee el valor del radio button en el modal para determinar si simular éxito o fallo.
        const simResultRadio = document.querySelector('input[name="simResult"]:checked');
        const shouldMatch = simResultRadio ? (simResultRadio.value === 'match') : true;

        // Simular progreso de escaneo y comparación biométrica
        let progress = 0;
        matchVal.textContent = '0%';
        matchFill.style.width = '0%';
        faceCompareStatus.textContent = 'Analizando puntos de coincidencia...';
        faceCompareIcon.className = 'modal-icon';
        faceCompareIcon.style.color = 'var(--primary)';
        faceCompareIcon.style.backgroundColor = 'rgba(179, 126, 129, 0.1)';
        faceCompareIcon.style.borderColor = 'rgba(179, 126, 129, 0.2)';
        
        const interval = setInterval(() => {
            progress += 5;
            if (progress > 100) {
                clearInterval(interval);
                
                if (shouldMatch) {
                    // Éxito de comparación (Usuario registrado en local por el alumno)
                    const matchPercent = Math.floor(95 + Math.random() * 5); // 95% a 100%
                    matchVal.textContent = `${matchPercent}%`;
                    matchFill.style.width = `${matchPercent}%`;
                    
                    faceCompareStatus.textContent = '¡Identidad Verificada!';
                    faceCompareIcon.className = 'modal-icon modal-icon--success';
                    faceCompareIcon.style.color = 'var(--success)';
                    faceCompareIcon.style.backgroundColor = 'rgba(125, 160, 138, 0.1)';
                    faceCompareIcon.style.borderColor = 'rgba(125, 160, 138, 0.2)';
                    
                    faceSuccessBtn.style.display = 'block';
                    faceRetryBtn.style.display = 'none';
                    
                    // Guardar usuario activo
                    localStorage.setItem('aura_active_user', JSON.stringify({
                        name: matchedUser.name,
                        email: matchedUser.email,
                        username: matchedUser.username,
                        phone: matchedUser.phone
                    }));
                    
                    showToast('Acceso Autorizado', `Identidad verificada: Bienvenido ${matchedUser.name}`, 'success');
                } else {
                    // Fallo de comparación (Intentando acceder a Jessica/Admin con la cara del alumno)
                    const matchPercent = Math.floor(15 + Math.random() * 20); // 15% a 35%
                    matchVal.textContent = `${matchPercent}%`;
                    matchFill.style.width = `${matchPercent}%`;
                    
                    faceCompareStatus.textContent = 'Firma biométrica no coincide.';
                    faceCompareIcon.className = 'modal-icon';
                    faceCompareIcon.style.color = 'var(--error)';
                    faceCompareIcon.style.backgroundColor = 'rgba(205, 134, 136, 0.1)';
                    faceCompareIcon.style.borderColor = 'rgba(205, 134, 136, 0.2)';
                    
                    faceSuccessBtn.style.display = 'none';
                    faceRetryBtn.style.display = 'block';
                    
                    showToast('Acceso Denegado', `El rostro en vivo no coincide con el de ${matchedUser.name}.`, 'error');
                }
            } else {
                matchVal.textContent = `${progress}%`;
                matchFill.style.width = `${progress}%`;
            }
        }, 100);
    }

    // Event listeners para los botones de Face ID
    if (loginFaceBtn) {
        loginFaceBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openFaceScanner('login');
        });
    }

    if (registerFaceConfigBtn) {
        registerFaceConfigBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openFaceScanner('register');
        });
    }

    if (faceModalClose) {
        faceModalClose.addEventListener('click', closeFaceScanner);
    }

    if (faceCaptureBtn) {
        faceCaptureBtn.addEventListener('click', captureFaceSnapshot);
    }

    if (faceRetryBtn) {
        faceRetryBtn.addEventListener('click', () => {
            openFaceScanner(faceScannerMode);
        });
    }

    if (faceSuccessBtn) {
        faceSuccessBtn.addEventListener('click', () => {
            closeFaceScanner();
            const activeUser = JSON.parse(localStorage.getItem('aura_active_user'));
            animateLoginSuccess(activeUser);
        });
    }

    // Lógica para Subir Foto (Archivo) como alternativa
    const faceUploadBtn = document.getElementById('faceUploadBtn');
    const faceUploadInput = document.getElementById('faceUploadInput');

    if (faceUploadBtn && faceUploadInput) {
        faceUploadBtn.addEventListener('click', () => {
            faceUploadInput.click();
        });

        faceUploadInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                const dataURL = event.target.result;
                
                if (faceScannerMode === 'register') {
                    // Guardar imagen para el registro
                    registerFaceDataURL = dataURL;
                    registerFaceStatus.textContent = 'Rostro Registrado ✓';
                    registerFaceConfigBtn.style.borderColor = 'var(--success)';
                    registerFaceConfigBtn.style.color = 'var(--success)';
                    registerFaceConfigBtn.style.background = 'rgba(125, 160, 138, 0.08)';
                    
                    showToast('Rostro Cargado', 'Tu imagen ha sido cargada con éxito. Completa el registro para guardarla.', 'success');
                    closeFaceScanner();
                } else {
                    // Modo Login: Iniciar comparación biométrica con la foto subida
                    runBiometricComparison(dataURL);
                }
            };
            reader.readAsDataURL(file);
            // Resetear el input para permitir volver a subir el mismo archivo
            faceUploadInput.value = '';
        });
    }

    // ==========================================================================
    // 16. PANEL DE DESARROLLADOR (VISUALIZACIÓN DE BASE DE DATOS LOCAL)
    // ==========================================================================
    const devPanel = document.getElementById('devPanel');
    const devPanelTrigger = document.getElementById('devPanelTrigger');
    const devPanelClose = document.getElementById('devPanelClose');
    const devResetDbBtn = document.getElementById('devResetDbBtn');
    const devUserList = document.getElementById('devUserList');

    function toggleDevPanel() {
        devPanel.classList.toggle('active');
        if (devPanel.classList.contains('active')) {
            renderDevUserList();
        }
    }

    function closeDevPanel() {
        devPanel.classList.remove('active');
    }

    function renderDevUserList() {
        const users = getUsers();
        if (!devUserList) return;

        if (users.length === 0) {
            devUserList.innerHTML = '<p style="text-align: center; font-size: 0.85rem; color: var(--text-muted);">No hay usuarios en la base de datos.</p>';
            return;
        }

        devUserList.innerHTML = users.map(user => {
            const hasPhoto = !!user.faceImage;
            const avatarContent = hasPhoto
                ? `<img src="${user.faceImage}" alt="${user.name}" class="dev-user-avatar">`
                : `<div class="dev-user-avatar">👤</div>`;

            return `
                <div class="dev-user-card">
                    ${avatarContent}
                    <div class="dev-user-info">
                        <div class="dev-user-name">${user.name}</div>
                        <div class="dev-user-meta">
    ${user.email.replace(/(^.{1,2}).*(@.*$)/, '$1******$2')}
</div>
                        <div class="dev-user-meta">${user.phone || 'Sin teléfono'}</div>
                        <div class="dev-user-pass"> ••••••••••</div>
                        <div class="dev-user-meta" style="font-size: 0.65rem; color: ${hasPhoto ? 'var(--success)' : 'var(--error)'}; font-weight: 500; margin-top: 2px;">
                            ${hasPhoto ? '✓ Firma Biométrica Guardada' : '✗ Sin Firma Biométrica'}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    function resetDatabase() {
        if (confirm('¿Estás seguro de que deseas restaurar la base de datos local? Esto eliminará todos los usuarios registrados por ti y restablecerá los usuarios por defecto.')) {
            localStorage.removeItem('aetheria_users');
            localStorage.removeItem('aura_active_user');
            initDatabase();
            renderDevUserList();
            showToast('Base de Datos Restaurada', 'Se han restablecido los usuarios iniciales.', 'success');
        }
    }

    if (devPanelTrigger) devPanelTrigger.addEventListener('click', toggleDevPanel);
    if (devPanelClose) devPanelClose.addEventListener('click', closeDevPanel);
    if (devResetDbBtn) devResetDbBtn.addEventListener('click', resetDatabase);

    // Renderizar inicialmente
    renderDevUserList();
});
