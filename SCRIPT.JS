// script.js - Lógica e funcionalidades para PPT Target
// Autor: IA Geradora de Código
// Linguagem: JavaScript ES6
// Comentários em Português (Brasil)

/**
 * Configurações de seletores CSS para elementos HTML.
 * Facilita manutenção e evita repetição de strings.
 */
const SELECTORS = {
    LOGIN_FORM: '#loginForm',
    REGISTER_FORM: '#registerForm',
    LOGIN_SCREEN: '#loginScreen',
    REGISTER_SCREEN: '#registerScreen',
    TOGGLE_LOGIN: '.toggle-login',
    TOGGLE_REGISTER: '.toggle-register',
    MESSAGE: '#message'
};

/**
 * Container de mensagens global.
 * Inicializado no DOMContentLoaded.
 */
let messageContainer = null;

/**
 * Inicialização da aplicação.
 * Adiciona event listeners e configura elementos.
 */
document.addEventListener('DOMContentLoaded', () => {
    messageContainer = document.getElementById('message');

    if (!messageContainer) {
        console.error('Elemento #message não encontrado!');
        return;
    }

    // Event listener para formulário de login
    const loginForm = document.querySelector(SELECTORS.LOGIN_FORM);
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Event listener para formulário de cadastro
    const registerForm = document.querySelector(SELECTORS.REGISTER_FORM);
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Event listeners para alternância de telas
    document.querySelectorAll(SELECTORS.TOGGLE_LOGIN).forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showForm('login');
        });
    });

    document.querySelectorAll(SELECTORS.TOGGLE_REGISTER).forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showForm('register');
        });
    });

    // Inicialmente, mostra tela de login
    showForm('login');
});

/**
 * Valida o formato de um email usando expressão regular.
 * @param {string} email - Email a ser validado.
 * @returns {boolean} - True se válido.
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Valida a força da senha.
 * Critérios: min 8 chars, 1 maiúscula, 1 minúscula, 1 número.
 * @param {string} password - Senha a validar.
 * @returns {boolean} - True se forte o suficiente.
 */
function validatePassword(password) {
    if (password.length < 8) return false;
    if (!/[A-Z]/.test(password)) return false;
    if (!/[a-z]/.test(password)) return false;
    if (!/[0-9]/.test(password)) return false;
    return true;
}

/**
 * Mostra o formulário/tela especificada e esconde os outros.
 * @param {string} formName - 'login' ou 'register'.
 */
function showForm(formName) {
    // Esconde todas as telas
    document.querySelectorAll('[id$="-screen"]').forEach(screen => {
        screen.style.display = 'none';
    });

    // Mostra a tela selecionada
    const screen = document.getElementById(`${formName}Screen`);
    if (screen) {
        screen.style.display = 'block';
        clearForm(document.querySelector(SELECTORS[`${formName.toUpperCase()}_FORM`]));
    }
}

/**
 * Limpa os campos de um formulário.
 * @param {HTMLFormElement} formElement - Formulário a limpar.
 */
function clearForm(formElement) {
    if (formElement) {
        formElement.reset();
    }
}

/**
 * Exibe mensagem de erro ou sucesso.
 * Auto-esconde após 5 segundos.
 * @param {string} message - Texto da mensagem.
 * @param {'error' | 'success'} type - Tipo de mensagem.
 */
function showMessage(message, type = '') {
    if (!messageContainer) return;

    messageContainer.textContent = message;
    messageContainer.className = `message ${type}`;
    messageContainer.style.display = 'block';

    // Auto-esconde após 5s
    setTimeout(() => {
        messageContainer.style.display = 'none';
    }, 5000);
}

/**
 * Manipulador assíncrono de submit do login.
 * Valida e prepara para Supabase.
 */
async function handleLogin(e) {
    e.preventDefault();

    const form = e.target;
    const email = form.querySelector('input[name="email"]')?.value.trim();
    const password = form.querySelector('input[name="password"]')?.value;

    // Validações
    if (!email || !validateEmail(email)) {
        showMessage('Por favor, insira um email válido.', 'error');
        return;
    }

    if (!password || !validatePassword(password)) {
        showMessage('Senha deve ter pelo menos 8 caracteres, incluindo maiúscula, minúscula e número.', 'error');
        return;
    }

    // Limpa mensagem anterior
    messageContainer.style.display = 'none';

    // Integração com Supabase (descomente e configure supabase client)
    /*
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;

        showMessage('Login realizado com sucesso! Redirecionando...', 'success');
        // window.location.href = '/dashboard';
    } catch (error) {
        showMessage(error.message || 'Erro no login.', 'error');
    }
    */

    // Simulação de sucesso
    showMessage('Login validado! Integre com Supabase descomentando o código.', 'success');
}

/**
 * Manipulador assíncrono de submit do cadastro.
 * Valida email, senha e confirmação.
 */
async function handleRegister(e) {
    e.preventDefault();

    const form = e.target;
    const email = form.querySelector('input[name="email"]')?.value.trim();
    const password = form.querySelector('input[name="password"]')?.value;
    const confirmPassword = form.querySelector('input[name="confirmPassword"]')?.value;

    // Validações
    if (!email || !validateEmail(email)) {
        showMessage('Por favor, insira um email válido.', 'error');
        return;
    }

    if (!password || !validatePassword(password)) {
        showMessage('Senha deve ter pelo menos 8 caracteres, incluindo maiúscula, minúscula e número.', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showMessage('As senhas não coincidem. Tente novamente.', 'error');
        return;
    }

    // Limpa mensagem anterior
    messageContainer.style.display = 'none';

    // Integração com Supabase (descomente e configure supabase client)
    /*
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });

        if (error) throw error;

        showMessage('Cadastro realizado! Verifique seu email para confirmar.', 'success');
    } catch (error) {
        showMessage(error.message || 'Erro no cadastro.', 'error');
    }
    */

    // Simulação de sucesso
    showMessage('Cadastro validado! Integre com Supabase descomentando o código.', 'success');
}
