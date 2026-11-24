-- =====================================================
-- Versão MySQL/MariaDB (para o caso de a prova exigir MySQL)
-- =====================================================
DROP DATABASE IF EXISTS almoxarifado_db;
CREATE DATABASE almoxarifado_db CHARACTER SET utf8mb4;
USE almoxarifado_db;

CREATE TABLE usuarios (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nome       VARCHAR(100) NOT NULL,
  email      VARCHAR(100) NOT NULL UNIQUE,
  senha_hash CHAR(64) NOT NULL,
  perfil     VARCHAR(20) NOT NULL DEFAULT 'almoxarife'
);

CREATE TABLE categorias (
  id_categoria INT AUTO_INCREMENT PRIMARY KEY,
  nome         VARCHAR(60) NOT NULL UNIQUE
);

CREATE TABLE produtos (
  id_produto     INT AUTO_INCREMENT PRIMARY KEY,
  codigo         VARCHAR(20) NOT NULL UNIQUE,
  nome           VARCHAR(100) NOT NULL,
  id_categoria   INT NOT NULL,
  material       VARCHAR(50),
  gramatura      INT,
  dimensoes      VARCHAR(40),
  capacidade_ml  INT,
  tipo_tampa     VARCHAR(40),
  peso_g         DECIMAL(10,2),
  estoque_atual  INT NOT NULL DEFAULT 0,
  estoque_minimo INT NOT NULL DEFAULT 0,
  FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria)
);

CREATE TABLE movimentacoes (
  id_movimentacao   INT AUTO_INCREMENT PRIMARY KEY,
  id_produto        INT NOT NULL,
  id_usuario        INT NOT NULL,
  tipo              ENUM('ENTRADA','SAIDA') NOT NULL,
  quantidade        INT NOT NULL,
  data_movimentacao DATE NOT NULL,
  observacao        VARCHAR(200),
  FOREIGN KEY (id_produto) REFERENCES produtos(id_produto),
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

INSERT INTO usuarios (nome, email, senha_hash, perfil) VALUES
('Administrador','admin@fabrica.com',SHA2('admin123',256),'admin'),
('Maria Souza','maria@fabrica.com',SHA2('maria123',256),'almoxarife'),
('João Lima','joao@fabrica.com',SHA2('joao123',256),'almoxarife');

INSERT INTO categorias (nome) VALUES ('Caixa de papelão'),('Frasco plástico'),('Tampa');

INSERT INTO produtos (codigo,nome,id_categoria,material,gramatura,dimensoes,capacidade_ml,tipo_tampa,peso_g,estoque_atual,estoque_minimo) VALUES
('CX-001','Caixa de papelão pequena',1,'Papelão ondulado',300,'30x20x15 cm',NULL,NULL,180,380,100),
('CX-002','Caixa de papelão grande',1,'Papelão ondulado',450,'60x40x40 cm',NULL,NULL,520,140,50),
('FR-001','Frasco PET 500 ml',2,'PET',NULL,NULL,500,'Rosca',32,150,200),
('FR-002','Frasco PEAD 1 L',2,'PEAD',NULL,NULL,1000,'Flip-top',58,200,150),
('FR-003','Frasco PP 250 ml',2,'PP',NULL,NULL,250,'Pump',24,130,100);

INSERT INTO movimentacoes (id_produto,id_usuario,tipo,quantidade,data_movimentacao,observacao) VALUES
(1,2,'ENTRADA',500,'2026-11-02','Compra inicial'),
(1,3,'SAIDA',120,'2026-11-10','Linha de produção 1'),
(2,2,'ENTRADA',200,'2026-11-02','Compra inicial'),
(2,3,'SAIDA',60,'2026-11-12','Pedido 4410'),
(3,2,'ENTRADA',600,'2026-11-03','Compra inicial'),
(3,3,'SAIDA',450,'2026-11-15','Linha de envase'),
(4,2,'ENTRADA',300,'2026-11-03','Compra inicial'),
(4,3,'SAIDA',100,'2026-11-16','Linha de envase'),
(5,2,'ENTRADA',150,'2026-11-04','Compra inicial'),
(5,3,'SAIDA',20,'2026-11-17','Amostras');
