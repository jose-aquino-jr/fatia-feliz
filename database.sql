-- Crie/seleccione o banco `fatia_feliz` antes de importar este arquivo.
-- MySQL/MariaDB; as imagens continuam nos caminhos relativos da pasta assets/.

SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS categorias (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  codigo VARCHAR(40) NOT NULL,
  nome VARCHAR(80) NOT NULL,
  ordem TINYINT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY uq_categorias_codigo (codigo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS produtos (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  codigo VARCHAR(12) NOT NULL,
  categoria_id INT UNSIGNED NOT NULL,
  nome VARCHAR(120) NOT NULL,
  descricao VARCHAR(255) NOT NULL,
  preco_centavos INT UNSIGNED NOT NULL,
  imagem VARCHAR(255) NOT NULL,
  imagens_extra TEXT NULL,
  disponivel TINYINT(1) NOT NULL DEFAULT 1,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_produtos_codigo (codigo),
  KEY ix_produtos_categoria_disponivel (categoria_id, disponivel),
  CONSTRAINT fk_produtos_categoria FOREIGN KEY (categoria_id)
    REFERENCES categorias (id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS pedidos (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  data_pedido TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  valor_total_centavos INT UNSIGNED NOT NULL DEFAULT 0,
  forma_pagamento ENUM('pix', 'credito', 'debito', 'dinheiro') NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'recebido',
  PRIMARY KEY (id),
  KEY ix_pedidos_data (data_pedido)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS itens_pedido (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  pedido_id BIGINT UNSIGNED NOT NULL,
  produto_id INT UNSIGNED NULL,
  nome_produto VARCHAR(150) NOT NULL,
  detalhes VARCHAR(500) NULL,
  quantidade SMALLINT UNSIGNED NOT NULL,
  preco_unitario_centavos INT UNSIGNED NOT NULL,
  subtotal_centavos INT UNSIGNED NOT NULL,
  PRIMARY KEY (id),
  KEY ix_itens_pedido_pedido (pedido_id),
  KEY ix_itens_pedido_produto (produto_id),
  CONSTRAINT fk_itens_pedido_pedido FOREIGN KEY (pedido_id)
    REFERENCES pedidos (id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_itens_pedido_produto FOREIGN KEY (produto_id)
    REFERENCES produtos (id) ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO categorias (codigo, nome, ordem) VALUES
  ('pizzas', 'Pizzas', 1),
  ('bebidas', 'Bebidas', 2),
  ('acomp', 'Acompanhamentos', 3),
  ('sobremesas', 'Sobremesas', 4),
  ('combos', 'Combos', 5)
ON DUPLICATE KEY UPDATE nome = VALUES(nome), ordem = VALUES(ordem);

INSERT INTO produtos (codigo, categoria_id, nome, descricao, preco_centavos, imagem)
SELECT s.codigo, c.id, s.nome, s.descricao, s.preco_centavos, s.imagem
FROM (
  SELECT 'p1' codigo, 'pizzas' categoria, 'Pizza Calabresa' nome, 'Molho de tomate, mussarela, calabresa e cebola.' descricao, 3990 preco_centavos, 'assets/pizza-calabresa.jpg' imagem
  UNION ALL SELECT 'p2', 'pizzas', 'Pizza Mussarela', 'Molho de tomate, mussarela, tomate e azeitona.', 3490, 'assets/pizza-mussarela.jpg'
  UNION ALL SELECT 'p3', 'pizzas', 'Pizza Pepperoni', 'Molho de tomate, mussarela e muito pepperoni.', 4390, 'assets/pizza-pepperoni.jpg'
  UNION ALL SELECT 'p4', 'pizzas', 'Frango c/ Catupiry', 'Frango desfiado, milho e catupiry cremoso.', 4290, 'assets/pizza-frango.jpg'
  UNION ALL SELECT 'p5', 'pizzas', 'Pizza Portuguesa', 'Presunto, cebola, tomate, azeitona e mussarela.', 4490, 'assets/pizza-portuguesa.jpg'
  UNION ALL SELECT 'p6', 'pizzas', 'Pizza Bacon', 'Mussarela, bacon crocante e milho.', 4290, 'assets/pizza-bacon.jpg'
  UNION ALL SELECT 'b1', 'bebidas', 'Refrigerante lata', '350 ml, bem gelado.', 600, 'assets/refrigerante-lata.jpg'
  UNION ALL SELECT 'b2', 'bebidas', 'Refrigerante 2L', 'Ideal para dividir.', 1400, 'assets/refrigerante.jpg'
  UNION ALL SELECT 'b3', 'bebidas', 'Suco natural', 'Laranja, 400 ml.', 900, 'assets/suco.jpg'
  UNION ALL SELECT 'b4', 'bebidas', 'Água mineral', '500 ml, sem gás.', 500, 'assets/agua.jpg'
  UNION ALL SELECT 'a1', 'acomp', 'Batata frita', 'Porção crocante com sal.', 1890, 'assets/batata.jpg'
  UNION ALL SELECT 'a2', 'acomp', 'Pão de alho', '6 unidades com manteiga de alho.', 1590, 'assets/pao-de-alho.jpg'
  UNION ALL SELECT 'a3', 'acomp', 'Anéis de cebola', 'Empanados e sequinhos.', 1990, 'assets/aneis-de-cebola.jpg'
  UNION ALL SELECT 's1', 'sobremesas', 'Brownie', 'Chocolate intenso, quentinho.', 1490, 'assets/brownie.jpg'
  UNION ALL SELECT 's2', 'sobremesas', 'Sorvete', 'Duas bolas à sua escolha.', 1290, 'assets/sorvete.jpg'
  UNION ALL SELECT 's3', 'sobremesas', 'Fatia de bolo', 'Bolo da casa com cobertura.', 1390, 'assets/bolo.jpg'
  UNION ALL SELECT 'c1', 'combos', 'Combo Solo', 'Pizza pequena + refrigerante lata.', 3490, 'assets/pizza-mussarela.jpg'
  UNION ALL SELECT 'c2', 'combos', 'Combo Casal', 'Pizza grande + refrigerante 2L.', 6290, 'assets/pizza-calabresa.jpg'
  UNION ALL SELECT 'c3', 'combos', 'Combo Família', 'Pizza família + 2L + batata frita.', 8490, 'assets/pizza-pepperoni.jpg'
) AS s
JOIN categorias c ON c.codigo = s.categoria
ON DUPLICATE KEY UPDATE
  categoria_id = VALUES(categoria_id), nome = VALUES(nome),
  descricao = VALUES(descricao), preco_centavos = VALUES(preco_centavos),
  imagem = VALUES(imagem), disponivel = 1;

UPDATE produtos SET imagens_extra = '["assets/refrigerante-lata.jpg"]' WHERE codigo = 'c1';
UPDATE produtos SET imagens_extra = '["assets/refrigerante.jpg"]' WHERE codigo = 'c2';
UPDATE produtos SET imagens_extra = '["assets/refrigerante.jpg", "assets/batata.jpg"]' WHERE codigo = 'c3';
