// =====================================================
// Servidor do almoxarifado - Node.js puro (sem npm install!)
// Rodar:  node server.js   -> abrir http://localhost:3000
// =====================================================
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { DatabaseSync } = require('node:sqlite');   // SQLite embutido no Node 22+

const PORTA = process.env.PORT || 3000;
const ARQ_BANCO = path.join(__dirname, 'almoxarifado_db.sqlite');
const ARQ_SQL = path.join(__dirname, '..', '3-almoxarifado_db_sqlite.sql');

// ---------- BANCO ----------
const primeiraVez = !fs.existsSync(ARQ_BANCO);
const db = new DatabaseSync(ARQ_BANCO);
db.exec('PRAGMA foreign_keys = ON');
if (primeiraVez) db.exec(fs.readFileSync(ARQ_SQL, 'utf8'));   // cria e popula

const sha256 = (txt) => crypto.createHash('sha256').update(txt).digest('hex');

// ---------- SESSÃO (guardada na memória) ----------
const sessoes = new Map();   // token -> usuário
function pegarUsuario(req) {
  const m = (req.headers.cookie || '').match(/sid=([a-f0-9]+)/);
  return m ? sessoes.get(m[1]) : null;
}

// ---------- AUXILIARES ----------
function responder(res, status, obj, extraHeaders = {}) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', ...extraHeaders });
  res.end(JSON.stringify(obj));
}
function lerCorpo(req) {
  return new Promise((ok) => {
    let txt = '';
    req.on('data', (c) => (txt += c));
    req.on('end', () => { try { ok(JSON.parse(txt || '{}')); } catch { ok({}); } });
  });
}
const numOuNull = (v) => (v === '' || v === null || v === undefined ? null : Number(v));

// Valida produto. Retorna mensagem de erro ou null se estiver tudo certo.
function validarProduto(p) {
  if (!p.codigo || !String(p.codigo).trim()) return 'Informe o código do produto.';
  if (!p.nome || !String(p.nome).trim()) return 'Informe o nome do produto.';
  if (!p.id_categoria) return 'Escolha uma categoria.';
  if (!db.prepare('SELECT 1 FROM categorias WHERE id_categoria=?').get(p.id_categoria)) return 'Categoria inválida.';
  const min = Number(p.estoque_minimo);
  if (p.estoque_minimo === '' || p.estoque_minimo == null || !Number.isInteger(min) || min < 0) return 'Estoque mínimo deve ser um inteiro maior ou igual a 0.';
  if (p.estoque_atual !== undefined) {
    const at = Number(p.estoque_atual);
    if (p.estoque_atual === '' || !Number.isInteger(at) || at < 0) return 'Estoque atual deve ser um inteiro maior ou igual a 0.';
  }
  for (const [campo, nome] of [['gramatura', 'Gramatura'], ['capacidade_ml', 'Capacidade'], ['peso_g', 'Peso']]) {
    const v = numOuNull(p[campo]);
    if (v !== null && (isNaN(v) || v <= 0)) return nome + ' deve ser um número maior que 0.';
  }
  return null;
}

// ---------- ROTAS DA API ----------
async function api(req, res, url) {
  const rota = url.pathname;
  const metodo = req.method;

  // --- LOGIN / LOGOUT / ME ---
  if (rota === '/api/login' && metodo === 'POST') {
    const { email, senha } = await lerCorpo(req);
    if (!email || !senha) return responder(res, 400, { erro: 'Preencha e-mail e senha.' });
    const u = db.prepare('SELECT * FROM usuarios WHERE email=?').get(email.trim());
    if (!u) return responder(res, 401, { erro: 'Usuário não encontrado.' });
    if (u.senha_hash !== sha256(senha)) return responder(res, 401, { erro: 'Senha incorreta.' });
    const token = crypto.randomBytes(16).toString('hex');
    sessoes.set(token, { id: u.id_usuario, nome: u.nome, perfil: u.perfil });
    return responder(res, 200, { ok: true }, { 'Set-Cookie': `sid=${token}; Path=/; HttpOnly` });
  }
  if (rota === '/api/logout' && metodo === 'POST') {
    const m = (req.headers.cookie || '').match(/sid=([a-f0-9]+)/);
    if (m) sessoes.delete(m[1]);
    return responder(res, 200, { ok: true }, { 'Set-Cookie': 'sid=; Path=/; Max-Age=0' });
  }

  // --- daqui pra baixo, só usuário logado ---
  const usuario = pegarUsuario(req);
  if (!usuario) return responder(res, 401, { erro: 'Faça login.' });

  if (rota === '/api/me') return responder(res, 200, usuario);

  if (rota === '/api/categorias') {
    return responder(res, 200, db.prepare('SELECT * FROM categorias ORDER BY nome').all());
  }

  // --- PRODUTOS ---
  if (rota === '/api/produtos' && metodo === 'GET') {
    const busca = '%' + (url.searchParams.get('busca') || '').trim() + '%';
    const lista = db.prepare(`
      SELECT p.*, c.nome AS categoria FROM produtos p
      JOIN categorias c ON c.id_categoria = p.id_categoria
      WHERE p.nome LIKE ? OR p.codigo LIKE ? OR c.nome LIKE ? OR IFNULL(p.material,'') LIKE ?
      ORDER BY p.id_produto`).all(busca, busca, busca, busca);
    return responder(res, 200, lista);
  }

  if (rota === '/api/produtos' && metodo === 'POST') {
    const p = await lerCorpo(req);
    const erro = validarProduto(p);
    if (erro) return responder(res, 400, { erro });
    try {
      db.prepare(`INSERT INTO produtos (codigo,nome,id_categoria,material,gramatura,dimensoes,capacidade_ml,tipo_tampa,peso_g,estoque_atual,estoque_minimo)
        VALUES (?,?,?,?,?,?,?,?,?,?,?)`).run(
        p.codigo.trim(), p.nome.trim(), p.id_categoria, p.material || null, numOuNull(p.gramatura),
        p.dimensoes || null, numOuNull(p.capacidade_ml), p.tipo_tampa || null, numOuNull(p.peso_g),
        Number(p.estoque_atual || 0), Number(p.estoque_minimo));
      return responder(res, 201, { ok: true });
    } catch (e) {
      if (String(e.message).includes('UNIQUE')) return responder(res, 409, { erro: 'Já existe um produto com esse código.' });
      throw e;
    }
  }

  const mId = rota.match(/^\/api\/produtos\/(\d+)$/);
  if (mId && metodo === 'PUT') {
    const p = await lerCorpo(req);
    const erro = validarProduto(p);
    if (erro) return responder(res, 400, { erro });
    try {
      // estoque_atual NÃO é editado aqui: só muda por movimentação (rastreabilidade)
      db.prepare(`UPDATE produtos SET codigo=?,nome=?,id_categoria=?,material=?,gramatura=?,dimensoes=?,
        capacidade_ml=?,tipo_tampa=?,peso_g=?,estoque_minimo=? WHERE id_produto=?`).run(
        p.codigo.trim(), p.nome.trim(), p.id_categoria, p.material || null, numOuNull(p.gramatura),
        p.dimensoes || null, numOuNull(p.capacidade_ml), p.tipo_tampa || null, numOuNull(p.peso_g),
        Number(p.estoque_minimo), Number(mId[1]));
      return responder(res, 200, { ok: true });
    } catch (e) {
      if (String(e.message).includes('UNIQUE')) return responder(res, 409, { erro: 'Já existe um produto com esse código.' });
      throw e;
    }
  }
  if (mId && metodo === 'DELETE') {
    const temHist = db.prepare('SELECT 1 FROM movimentacoes WHERE id_produto=?').get(Number(mId[1]));
    if (temHist) return responder(res, 409, { erro: 'Não é possível excluir: o produto possui histórico de movimentações.' });
    db.prepare('DELETE FROM produtos WHERE id_produto=?').run(Number(mId[1]));
    return responder(res, 200, { ok: true });
  }

  // --- MOVIMENTAÇÕES ---
  if (rota === '/api/movimentacoes' && metodo === 'GET') {
    return responder(res, 200, db.prepare(`
      SELECT m.*, p.nome AS produto, u.nome AS responsavel
      FROM movimentacoes m
      JOIN produtos p ON p.id_produto = m.id_produto
      JOIN usuarios u ON u.id_usuario = m.id_usuario
      ORDER BY m.data_movimentacao DESC, m.id_movimentacao DESC LIMIT 50`).all());
  }

  if (rota === '/api/movimentacoes' && metodo === 'POST') {
    const { id_produto, tipo, quantidade, data, observacao } = await lerCorpo(req);
    const prod = db.prepare('SELECT * FROM produtos WHERE id_produto=?').get(id_produto);
    if (!prod) return responder(res, 400, { erro: 'Selecione um produto.' });
    if (tipo !== 'ENTRADA' && tipo !== 'SAIDA') return responder(res, 400, { erro: 'Escolha entrada ou saída.' });
    const qtd = Number(quantidade);
    if (!Number.isInteger(qtd) || qtd <= 0) return responder(res, 400, { erro: 'Quantidade deve ser um inteiro maior que 0.' });
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data || '') || isNaN(new Date(data))) return responder(res, 400, { erro: 'Informe uma data válida.' });
    if (tipo === 'SAIDA' && qtd > prod.estoque_atual) {
      return responder(res, 400, { erro: `Estoque insuficiente. Disponível: ${prod.estoque_atual}.` });
    }
    const novo = prod.estoque_atual + (tipo === 'ENTRADA' ? qtd : -qtd);
    db.exec('BEGIN');                       // atualiza estoque + grava histórico juntos
    try {
      db.prepare('UPDATE produtos SET estoque_atual=? WHERE id_produto=?').run(novo, prod.id_produto);
      db.prepare(`INSERT INTO movimentacoes (id_produto,id_usuario,tipo,quantidade,data_movimentacao,observacao)
        VALUES (?,?,?,?,?,?)`).run(prod.id_produto, usuario.id, tipo, qtd, data, observacao || null);
      db.exec('COMMIT');
    } catch (e) { db.exec('ROLLBACK'); throw e; }
    // REGRA 7.1.4: após uma SAÍDA, verifica se ficou abaixo do mínimo
    const alerta = tipo === 'SAIDA' && novo < prod.estoque_minimo;
    return responder(res, 201, {
      ok: true, novo_estoque: novo, alerta,
      mensagem: alerta ? `ALERTA: "${prod.nome}" ficou com ${novo} un., abaixo do mínimo (${prod.estoque_minimo}).` : 'Movimentação registrada.'
    });
  }

  return responder(res, 404, { erro: 'Rota não encontrada.' });
}

// ---------- ARQUIVOS ESTÁTICOS (HTML/CSS/JS) ----------
const TIPOS = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8' };
function estatico(req, res, url) {
  let arq = url.pathname === '/' ? '/login.html' : url.pathname;
  const caminho = path.join(__dirname, 'public', path.normalize(arq));
  if (!caminho.startsWith(path.join(__dirname, 'public')) || !fs.existsSync(caminho)) {
    res.writeHead(404); return res.end('Não encontrado');
  }
  res.writeHead(200, { 'Content-Type': TIPOS[path.extname(caminho)] || 'text/plain' });
  fs.createReadStream(caminho).pipe(res);
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  try {
    if (url.pathname.startsWith('/api/')) await api(req, res, url);
    else estatico(req, res, url);
  } catch (e) {
    console.error(e);
    responder(res, 500, { erro: 'Erro interno do servidor.' });
  }
}).listen(PORTA, () => console.log(`Sistema rodando em http://localhost:${PORTA}`));
