// Funções comuns às telas internas
async function api(url, metodo = 'GET', corpo) {
  const r = await fetch(url, {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    body: corpo ? JSON.stringify(corpo) : undefined
  });
  if (r.status === 401) { location.href = 'login.html'; throw new Error('não logado'); }
  const dados = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(dados.erro || 'Erro');
  return dados;
}
async function mostrarUsuario() {
  const u = await api('/api/me');
  document.getElementById('usuario').textContent = u.nome;
}
async function sair() {
  await api('/api/logout', 'POST');
  location.href = 'login.html';
}
function mostrarMsg(id, texto) {
  const el = document.getElementById(id);
  el.textContent = texto; el.style.display = 'block';
  setTimeout(() => (el.style.display = 'none'), 4000);
}
function hoje() { return new Date().toISOString().slice(0, 10); }
