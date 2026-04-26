// Carregar Supabase do CDN (precisa estar no index.html antes deste script)
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

const SUPABASE_URL = 'https://bcxjmoikvldnweuvxieb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjeGptb2lrdmxkbndldXZ4aWViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxNTM1MDAsImV4cCI6MjA5MjcyOTUwMH0.foiZ2SrJb7Tf3yNYPfFH7mfNVF0V0tc3R4LcBR3q_1o';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Validação de email
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Mensagens
function showMessage(message, type = 'error') {
  alert(message);
  console.log(`[${type.toUpperCase()}] ${message}`);
}

// LOGIN COM SUPABASE REAL
async function handleLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail')?.value.trim();
  const password = document.getElementById('loginPassword')?.value;

  if (!email || !isValidEmail(email)) {
    showMessage('Email inválido', 'error');
    return;
  }
  if (!password || password.length < 6) {
    showMessage('Senha deve ter pelo menos 6 caracteres', 'error');
    return;
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) throw error;

    console.log('✓ Login bem-sucedido');
    localStorage.setItem('user', email);
    window.location.href = '/dashboard.html';
  } catch (error) {
    showMessage(error.message || 'Erro no login', 'error');
  }
}

// CADASTRO COM SUPABASE REAL
async function handleSignup(e) {
  e.preventDefault();
  
  const email = document.getElementById('signupEmail')?.value.trim();
  const password = document.getElementById('signupPassword')?.value;
  const confirmPassword = document.getElementById('signupConfirmPassword')?.value;

  if (!email || !isValidEmail(email)) {
    showMessage('Email inválido', 'error');
    return;
  }
  if (!password || password.length < 6) {
    showMessage('Senha deve ter pelo menos 6 caracteres', 'error');
    return;
  }
  if (password !== confirmPassword) {
    showMessage('As senhas não coincidem', 'error');
    return;
  }

  try {
    const { data, error } = await supabase.auth.signUp({ email, password });
    
    if (error) throw error;

    showMessage('Cadastro bem-sucedido! Verifique seu email.', 'success');
    console.log('✓ Cadastro criado');
  } catch (error) {
    showMessage(error.message || 'Erro no cadastro', 'error');
  }
}

// Event listeners quando página carrega
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');

  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
  }
});
