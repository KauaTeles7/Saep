-- =====================================================
-- Banco: almoxarifado_db  (versão SQLite - usada pelo sistema)
-- =====================================================
PRAGMA foreign_keys = ON;

CREATE TABLE usuarios (
  id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
  nome       TEXT NOT NULL,
  email      TEXT NOT NULL UNIQUE,
  senha_hash TEXT NOT NULL,              -- SHA-256 da senha (nunca guardar senha pura)
  perfil     TEXT NOT NULL DEFAULT 'almoxarife'
);

CREATE TABLE categorias (
  id_categoria INTEGER PRIMARY KEY AUTOINCREMENT,
  nome         TEXT NOT NULL UNIQUE
);

CREATE TABLE produtos (
  id_produto     INTEGER PRIMARY KEY AUTOINCREMENT,
  codigo         TEXT NOT NULL UNIQUE,
  nome           TEXT NOT NULL,
  id_categoria   INTEGER NOT NULL,
  material       TEXT,                   -- papelão, PET, PEAD, PP...
  gramatura      INTEGER,                -- g/m2 (caixas)
  dimensoes      TEXT,                   -- ex: 30x20x15 cm (caixas)
  capacidade_ml  INTEGER,                -- frascos
  tipo_tampa     TEXT,                   -- frascos
  peso_g         REAL,
  estoque_atual  INTEGER NOT NULL DEFAULT 0 CHECK (estoque_atual >= 0),
  estoque_minimo INTEGER NOT NULL DEFAULT 0 CHECK (estoque_minimo >= 0),
  FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria)
);

CREATE TABLE movimentacoes (
  id_movimentacao   INTEGER PRIMARY KEY AUTOINCREMENT,
  id_produto        INTEGER NOT NULL,
  id_usuario        INTEGER NOT NULL,    -- responsável pela operação
  tipo              TEXT NOT NULL CHECK (tipo IN ('ENTRADA','SAIDA')),
  quantidade        INTEGER NOT NULL CHECK (quantidade > 0),
  data_movimentacao TEXT NOT NULL,       -- AAAA-MM-DD
  observacao        TEXT,
  FOREIGN KEY (id_produto) REFERENCES produtos(id_produto),
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- ---------- POPULAÇÃO ----------
-- senhas: admin123 / maria123 / joao123
INSERT INTO usuarios (nome, email, senha_hash, perfil) VALUES
('Administrador', 'admin@fabrica.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'admin'),
('Maria Souza',   'maria@fabrica.com', '626e3c805e77eeb472c42c6be607be2af7ac5c08fd7050f278e0330fe81abf57', 'almoxarife'),
('João Lima',     'joao@fabrica.com',  '8681d505cb1b0344d0c7aa3c0e655c7e3a5add0f0960c1d142070a64cacab031', 'almoxarife');

INSERT INTO categorias (nome) VALUES ('Caixa de papelão'), ('Frasco plástico'), ('Tampa');

INSERT INTO produtos (codigo, nome, id_categoria, material, gramatura, dimensoes, capacidade_ml, tipo_tampa, peso_g, estoque_atual, estoque_minimo) VALUES
('CX-001','Caixa de papelão pequena', 1,'Papelão ondulado',300,'30x20x15 cm',NULL,NULL,180,380,100),
('CX-002','Caixa de papelão grande',  1,'Papelão ondulado',450,'60x40x40 cm',NULL,NULL,520,140,50),
('FR-001','Frasco PET 500 ml',        2,'PET',NULL,NULL,500,'Rosca',32,150,200),
('FR-002','Frasco PEAD 1 L',          2,'PEAD',NULL,NULL,1000,'Flip-top',58,200,150),
('FR-003','Frasco PP 250 ml',         2,'PP',NULL,NULL,250,'Pump',24,130,100);

INSERT INTO movimentacoes (id_produto, id_usuario, tipo, quantidade, data_movimentacao, observacao) VALUES
(1,2,'ENTRADA',500,'2026-11-02','Compra inicial'),
(1,3,'SAIDA',  120,'2026-11-10','Linha de produção 1'),
(2,2,'ENTRADA',200,'2026-11-02','Compra inicial'),
(2,3,'SAIDA',   60,'2026-11-12','Pedido 4410'),
(3,2,'ENTRADA',600,'2026-11-03','Compra inicial'),
(3,3,'SAIDA',  450,'2026-11-15','Linha de envase'),
(4,2,'ENTRADA',300,'2026-11-03','Compra inicial'),
(4,3,'SAIDA',  100,'2026-11-16','Linha de envase'),
(5,2,'ENTRADA',150,'2026-11-04','Compra inicial'),
(5,3,'SAIDA',   20,'2026-11-17','Amostras');
