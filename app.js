document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // 1. BASE DE DATOS LOCAL (Lógica de Almacenamiento)
    // ==========================================================================
    const DEFAULT_USERS = [
        {
            name: "Jessica Abrego",
            email: "jessica@example.com",
            username: "jessica_abrego",
            password: "Password123",
            phone: "+50499999999"
        },
        {
            name: "Admin Portal",
            email: "admin@aetheria.com",
            username: "admin",
            password: "AdminSecure99",
            phone: "+521111111111"
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
            // Éxito
            showToast('¡Acceso Autorizado!', `Bienvenido de nuevo, ${user.name}.`, 'success');
            loginForm.reset();
            animateLoginSuccess();
        }, 1500);
    });
    function toggleFormInputs(form, isDisabled) {
        const elements = form.querySelectorAll('input, button:not(.submit-btn), .social-btn');
        elements.forEach(el => {
            if (isDisabled) el.setAttribute('disabled', 'true');
            else el.removeAttribute('disabled');
        });
    }
    function animateLoginSuccess() {
        authContainer.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.6s ease';
        authContainer.style.transform = 'scale(0.9) translateY(-30px)';
        authContainer.style.opacity = '0';
        
        setTimeout(() => {
            authContainer.style.transform = 'scale(1) translateY(0)';
            authContainer.style.opacity = '1';
        }, 3000);
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
                phone: `+504${Math.floor(10000000 + Math.random() * 90000000)}` // Generar un número simulado
            };
            // Enviar correo de verificación simulado
            const verifyHTML = `
                <p>¡Hola <strong>${userPayload.name}</strong>!</p>
                <p>Gracias por registrarte en Aetheria. Para activar tu cuenta de usuario (<code>${userPayload.username}</code>) y comenzar a usar la plataforma, confirma tu correo electrónico haciendo clic en el siguiente enlace.</p>
                <button class="email-btn">Verificar Cuenta</button>
            `;
            addMessageToInbox(
                'Aetheria Accounts <noreply@aetheria.com>',
                'Verifica tu correo electrónico de Aetheria',
                verifyHTML,
                { type: 'verify_register', user: userPayload },
                false
            );
            showToast('Verificación Enviada', 'Hemos enviado un correo de verificación. Confírmalo para activar tu cuenta.', 'success');
            
            // Resetear y mandar a Login
            registerForm.reset();
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
                    <p>Has solicitado recordar tu nombre de usuario para acceder al portal. Tu nombre de usuario registrado es:</p>
                    <p style="font-size: 1.2rem; text-align: center; margin: 12px 0; font-weight: 700; color: #6366f1;">${user.username}</p>
                    <p>Ya puedes volver a la página e iniciar sesión con tu correo o usuario.</p>
                `;
                addMessageToInbox(
                    'Aetheria Support <support@aetheria.com>',
                    'Recuperación de tu Nombre de Usuario',
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
                    <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta vinculada a este correo electrónico.</p>
                    <p>Haz clic en el botón inferior para abrir la pantalla de restablecimiento de contraseña.</p>
                    <button class="email-btn">Restablecer Contraseña</button>
                    <p style="font-size: 0.725rem; color: #64748b; margin-top: 10px;">Si no solicitaste esto, ignora este mensaje.</p>
                `;
                addMessageToInbox(
                    'Aetheria Security <security@aetheria.com>',
                    'Restablece tu contraseña de Aetheria',
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
});
