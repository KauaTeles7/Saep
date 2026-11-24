# GUIA DE ESTUDO – leia antes da prova

## 1. O que é cada parte (mapa mental)
```
Navegador (HTML/CSS/JS)  --fetch-->  server.js (Node)  --SQL-->  banco (almoxarifado_db)
 login.html                           /api/login                  usuarios
 principal.html                       /api/produtos               categorias
 produtos.html                        /api/movimentacoes          produtos
 estoque.html                                                     movimentacoes
```
- **Front-end** (pasta `public/`): só desenha a tela e chama a API com `fetch`.
- **Back-end** (`server.js`): recebe o pedido, valida, conversa com o banco e responde JSON.
- **Banco**: 4 tabelas. `movimentacoes` liga produto + usuário (rastreabilidade).

## 2. Ordem para fazer na prova (cabe nos tempos do caderno)
1. **Requisitos (10 min)** – copie `1-requisitos-funcionais.md` e adapte ao enunciado novo.
2. **DER (10 min)** – desenhe no papel/draw.io: entidades, PK/FK, 1:N. Exporte PNG.
3. **SQL (10 min)** – `CREATE TABLE` na ordem: tabelas sem FK primeiro (usuarios, categorias), depois produtos, depois movimentacoes. Depois `INSERT` com no mínimo 3 linhas em CADA tabela.
4. **Login (20 min)** → 5. **Principal (20 min)** → 6. **Cadastro (45 min)** → 7. **Estoque (45 min)**
8. **Testes (10 min)** – copie a tabela de casos e ajuste. 9. **Infra (10 min)** – rode os comandos de versão.

## 3. Como cada requisito do caderno foi resolvido (e onde está)
| Requisito | Onde |
|---|---|
| Login com motivo da falha + redirecionar | `login.html` (mostra `d.erro`, `setTimeout` → `login.html`) e `/api/login` |
| Nome do usuário / logout | `mostrarUsuario()` e `sair()` em `app.js` |
| Listar produtos ao abrir | `iniciar()` → `carregar()` em `produtos.html` |
| Busca | `GET /api/produtos?busca=` usa `LIKE '%termo%'` |
| Inserir / editar / excluir | `POST`, `PUT /:id`, `DELETE /:id` |
| Validações | `salvar()` (front) + `validarProduto()` (back) |
| Ordenação alfabética | `insertionSort()` em `estoque.html` |
| Entrada/saída + data | `movimentar()` e `POST /api/movimentacoes` |
| Alerta de mínimo | no servidor: `novo < prod.estoque_minimo` → `alerta:true` → `alert()` no front |
| Histórico com responsável e data | tabela `movimentacoes` (id_usuario + data) |

## 4. Os 4 trechos que você PRECISA entender
**a) Insertion Sort** (pegue cada item e encaixe na posição certa entre os já ordenados):
```js
for (let i = 1; i < v.length; i++) {
  const atual = v[i]; let j = i - 1;
  while (j >= 0 && v[j].nome.localeCompare(atual.nome) > 0) { v[j+1] = v[j]; j--; }
  v[j+1] = atual;
}
```
Se preferir Bubble Sort: dois `for`, troca vizinhos se estiverem fora de ordem.

**b) Movimentação**: calcula `novo = atual ± qtd` → `UPDATE produtos` + `INSERT movimentacoes` (dentro de BEGIN/COMMIT) → se SAÍDA e `novo < minimo` → alerta.

**c) Login**: busca usuário pelo e-mail → se não achou "Usuário não encontrado" → compara hash SHA-256 da senha → se diferente "Senha incorreta" → senão cria sessão (cookie `sid`).

**d) Busca**: `WHERE nome LIKE ? OR codigo LIKE ?` com `%termo%`.

## 5. A prova será "parecida, não igual" – como adaptar
- **Outro tipo de produto/atributos** (ex.: peças, medicamentos, ferramentas): mude os campos de `produtos` em 4 lugares: SQL, `validarProduto`/`INSERT`/`UPDATE` no `server.js`, `CAMPOS` e formulário em `produtos.html`.
- **Outro nome de banco**: troque o nome no SQL e em `ARQ_BANCO` do `server.js` (a prova exige `almoxarifado_db`; no MySQL é `CREATE DATABASE almoxarifado_db;`).
- **Alerta diferente** (ex.: alertar também na entrada, ou ao abrir a tela): condição em `server.js` (`const alerta = ...`) e o banner em `estoque.html`.
- **Campo extra na movimentação** (ex.: setor, nota fiscal): coluna nova em `movimentacoes` + campo no formulário + `INSERT`.
- **Relatório/filtro de histórico**: `WHERE m.id_produto = ?` ou entre datas `BETWEEN ? AND ?` no `GET /api/movimentacoes`.

## 6. Cola de comandos
- Rodar: `cd sistema` → `node server.js` → http://localhost:3000
- Versões para a entrega 9: `node -v` · `winver` (Windows) ou `lsb_release -a` (Linux) · navegador: Menu > Sobre
- Recriar banco: apagar `sistema/almoxarifado_db.sqlite` e subir de novo
- Parar o servidor: Ctrl+C. Porta ocupada: `PORT=3001 node server.js` (Linux) / `set PORT=3001 && node server.js` (Windows)
- Git: `git init` · `git add .` · `git commit -m "entrega"` · `git branch -M main` · `git remote add origin URL` · `git push -u origin main`

## 7. Checklist de HOJE à noite (importante!)
1. Teste em outro computador, se possível: `node -v` precisa ser **22.13+** (por causa do SQLite embutido). Se a máquina da prova tiver Node mais antigo, o `node:sqlite` não funciona.
2. **Descubra com o professor/instrutor qual stack o laboratório tem** (Node? PHP/XAMPP? Python? MySQL?). A prova diz "SGBD e versão": se o lab usa MySQL, use o arquivo `3-almoxarifado_db_mysql.sql` (já pronto) e adapte as consultas.
3. Leve tudo em pendrive: esta pasta inteira + instalador do Node (se possível).
4. Sem internet você não consegue `git push`: combine com o avaliador (formato "previamente acordado") ou prepare o repositório e envie quando liberarem.
5. Treine uma vez: apague o banco, rode, faça login, cadastre, mova estoque, veja o alerta.
