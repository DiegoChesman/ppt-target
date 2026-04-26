const { createClient } = supabase;

const SUPABASE_URL = 'https://bcxjmoikvldnweuvxieb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjeGptb2lrdmxkbndldXZ4aWViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxNTM1MDAsImV4cCI6MjA5MjcyOTUwMH0.foiZ2SrJb7Tf3yNYPfFH7mfNVF0V0tc3R4LcBR3q_1o';

// Inicializa o cliente Supabase com as configurações reais
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Função auxiliar para validar formato de email

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Função para exibir mensagens de erro ou sucesso
function showMessage(message, type = 'error') {
  const messagesDiv = document.getElementById('messages');
  if (messagesDiv) {
    messagesDiv.innerHTML = `<div class="${type}-message">${message}</div>`;
    // Limpa a mensagem após 5 segundos
    setTimeout(() => {
      messagesDiv.innerHTML = '';
    }, 5000);
  } else {
    // Fallback para alert se não houver div de mensagens
    alert(message);
  }
}

function showError(message) {
  showMessage(message, 'error');
}

function showSuccess(message) {
  showMessage(message, 'success');
}

// Função de login com validação e integração real com Supabase
async function login(email, password) {
  console.log('Tentando login...', { email });

  // Validações
  if (!email || !password) {
    showError('Email e senha são obrigatórios');
    return;
  }
  if (!isValidEmail(email)) {
    showError('Formato de email inválido');
    return;
  }
  if (password.length < 6) {
    showError('Senha deve ter pelo menos 6 caracteres');
    return;
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Erro no login:', error);
      throw error;
    }

    console.log('Login realizado com sucesso:', data.user);
    // Redireciona para dashboard em caso de sucesso
    window.location.href = '/dashboard.html';
  } catch (error) {
    showError(error.message);
  }
}

// Função de cadastro com validação e integração real com Supabase
async function signup(email, password, confirmPassword) {
  console.log('Tentando cadastro...', { email });

  // Validações
  if (!email || !password || !confirmPassword) {
    showError('Todos os campos são obrigatórios');
    return;
  }
  if (!isValidEmail(email)) {
    showError('Formato de email inválido');
    return;
  }
  if (password.length < 6) {
    showError('Senha deve ter pelo menos 6 caracteres');
    return;
  }
  if (password !== confirmPassword) {
    showError('As senhas não coincidem');
    return;
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      console.error('Erro no cadastro:', error);
      throw error;
    }

    console.log('Cadastro realizado, aguardando confirmação:', data);
    showSuccess('Cadastro realizado com sucesso! Verifique seu email para confirmar.');
  } catch (error) {
    showError(error.message);
  }
}

// Função de logout
async function logout() {
  console.log('Fazendo logout...');
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    console.log('Logout realizado');
    showSuccess('Logout realizado com sucesso');
    // Opcional: redirecionar para login
    // window.location.href = '/index.html';
  } catch (error) {
    console.error('Erro no logout:', error);
    showError(error.message);
  }
}

// Função para verificar se o usuário está logado
async function checkAuth() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      console.log('Usuário já está logado:', session.user.email);
      // Opcional: mostrar elementos de usuário logado ou redirecionar
      // window.location.href = '/dashboard.html';
    } else {
      console.log('Nenhum usuário logado');
    }
  } catch (error) {
    console.error('Erro ao verificar autenticação:', error);
  }
}

// Listener global para mudanças de estado de autenticação
document.addEventListener('DOMContentLoaded', () => {
  // Verifica autenticação inicial
  checkAuth();

  // Listener para mudanças de auth (ex: após login/signup)
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('Mudança de estado de auth:', event);
    if (event === 'SIGNED_IN') {
      // Redireciona automaticamente após login
      window.location.href = '/dashboard.html';
    } else if (event === 'SIGNED_OUT') {
      console.log('Usuário saiu');
    }
  });

  // Event listeners para formulários (assumindo IDs padrão no HTML)
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email')?.value || '';
      const password = document.getElementById('login-password')?.value || '';
      await login(email, password);
    });
  }

  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('signup-email')?.value || '';
      const password = document.getElementById('signup-password')?.value || '';
      const confirmPassword = document.getElementById('signup-confirm-password')?.value || '';
      await signup(email, password, confirmPassword);
    });
  }

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      await logout();
    });
  }
});
