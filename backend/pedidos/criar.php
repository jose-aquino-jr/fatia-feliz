<?php
require_once __DIR__ . '/../config/resposta.php';
require_once __DIR__ . '/../config/database.php';

exigirMetodo('POST');
$dados = lerJson();
$formasPagamento = ['pix', 'credito', 'debito', 'dinheiro'];
$pagamento = $dados['payment'] ?? '';
$itensRecebidos = $dados['items'] ?? null;

if (!in_array($pagamento, $formasPagamento, true)) {
    responderJson(400, ['success' => false, 'error' => 'Escolha uma forma de pagamento válida.']);
}
if (!is_array($itensRecebidos) || count($itensRecebidos) === 0) {
    responderJson(400, ['success' => false, 'error' => 'O pedido não pode estar vazio.']);
}
if (count($itensRecebidos) > 40) {
    responderJson(400, ['success' => false, 'error' => 'O pedido tem itens demais.']);
}

function montarPizzaPersonalizada($config)
{
    $tamanhos = ['pequena' => 2900, 'media' => 3500, 'grande' => 4500, 'familia' => 5500];
    $massas = ['tradicional' => 0, 'fina' => 0, 'integral' => 300];
    $bordas = ['tradicional' => 0, 'catupiry' => 600, 'cheddar' => 600];
    $molhos = ['tradicional' => 0, 'barbecue' => 200, 'branco' => 200];
    $queijos = ['mussarela' => 0, 'catupiry' => 400, 'cheddar' => 400, 'parmesao' => 500];
    $ingredientes = [
        'calabresa' => ['nome' => 'Calabresa', 'preco' => 400],
        'pepperoni' => ['nome' => 'Pepperoni', 'preco' => 500],
        'bacon' => ['nome' => 'Bacon', 'preco' => 400],
        'frango' => ['nome' => 'Frango', 'preco' => 400],
        'presunto' => ['nome' => 'Presunto', 'preco' => 350],
        'cebola' => ['nome' => 'Cebola', 'preco' => 200],
        'tomate' => ['nome' => 'Tomate', 'preco' => 200],
        'milho' => ['nome' => 'Milho', 'preco' => 200],
        'azeitona' => ['nome' => 'Azeitona', 'preco' => 200],
        'champignon' => ['nome' => 'Champignon', 'preco' => 350],
    ];

    if (!is_array($config)) {
        throw new InvalidArgumentException('A configuração da pizza está inválida.');
    }
    $size = $config['size'] ?? '';
    $dough = $config['dough'] ?? '';
    $border = $config['border'] ?? '';
    $sauce = $config['sauce'] ?? '';
    $cheese = $config['cheese'] ?? '';
    $selectedIngredients = $config['ings'] ?? [];

    if (!is_string($size) || !is_string($dough) || !is_string($border)
        || !is_string($sauce) || !is_string($cheese)) {
        throw new InvalidArgumentException('Uma das opções da pizza não é válida.');
    }
    if (!isset($tamanhos[$size]) || !isset($massas[$dough]) || !isset($bordas[$border])
        || !isset($molhos[$sauce]) || !isset($queijos[$cheese])) {
        throw new InvalidArgumentException('Uma das opções da pizza não é válida.');
    }
    if (!is_array($selectedIngredients) || count($selectedIngredients) > count($ingredientes)) {
        throw new InvalidArgumentException('A lista de ingredientes da pizza está inválida.');
    }
    foreach ($selectedIngredients as $ingredient) {
        if (!is_string($ingredient) || !isset($ingredientes[$ingredient])) {
            throw new InvalidArgumentException('A pizza contém um ingrediente inválido.');
        }
    }
    $selectedIngredients = array_values(array_unique($selectedIngredients));
    $total = $tamanhos[$size] + $massas[$dough] + $bordas[$border] + $molhos[$sauce] + $queijos[$cheese];
    $ingredientNames = [];
    foreach ($selectedIngredients as $ingredient) {
        $total += $ingredientes[$ingredient]['preco'];
        $ingredientNames[] = $ingredientes[$ingredient]['nome'];
    }

    $labels = [
        'size' => ['pequena' => 'pequena', 'media' => 'média', 'grande' => 'grande', 'familia' => 'família'],
        'dough' => ['tradicional' => 'tradicional', 'fina' => 'fina', 'integral' => 'integral'],
        'border' => ['tradicional' => 'tradicional', 'catupiry' => 'Catupiry', 'cheddar' => 'Cheddar'],
        'sauce' => ['tradicional' => 'tomate', 'barbecue' => 'barbecue', 'branco' => 'branco'],
        'cheese' => ['mussarela' => 'Mussarela', 'catupiry' => 'Catupiry', 'cheddar' => 'Cheddar', 'parmesao' => 'Parmesão'],
    ];
    $details = [
        'Massa ' . $labels['dough'][$dough],
        'Borda ' . $labels['border'][$border],
        'Molho ' . $labels['sauce'][$sauce],
        'Queijo ' . $labels['cheese'][$cheese],
    ];
    if ($ingredientNames) {
        $details[] = implode(', ', $ingredientNames);
    }

    return [
        'name' => 'Pizza ' . $labels['size'][$size],
        'details' => implode(' · ', $details),
        'configuration' => [
            'size' => $size, 'dough' => $dough, 'border' => $border,
            'sauce' => $sauce, 'cheese' => $cheese, 'ings' => $selectedIngredients,
        ],
        'price' => $total,
    ];
}

try {
    $pdo = conectarBanco();
    $pdo->beginTransaction();
    $linhas = [];
    $total = 0;
    $buscarProduto = $pdo->prepare(
        'SELECT id, nome, descricao, preco_centavos
         FROM produtos WHERE id = :id AND disponivel = 1 FOR UPDATE'
    );
    $buscarProdutoCodigo = $pdo->prepare(
        'SELECT id, nome, descricao, preco_centavos
         FROM produtos WHERE codigo = :codigo AND disponivel = 1 FOR UPDATE'
    );

    foreach ($itensRecebidos as $item) {
        if (!is_array($item)) {
            throw new InvalidArgumentException('Um item do pedido está inválido.');
        }
        $quantidade = $item['quantity'] ?? null;
        if (!is_int($quantidade) || $quantidade < 1 || $quantidade > 99) {
            throw new InvalidArgumentException('A quantidade de cada item deve estar entre 1 e 99.');
        }

        if (isset($item['product_id']) || isset($item['product_code'])) {
            if (isset($item['product_id'])) {
                $produtoId = $item['product_id'];
                if (!is_int($produtoId) || $produtoId < 1) {
                    throw new InvalidArgumentException('O ID de um produto está inválido.');
                }
                $buscarProduto->bindValue(':id', $produtoId, PDO::PARAM_INT);
                $buscarProduto->execute();
                $produto = $buscarProduto->fetch();
            } else {
                $codigoProduto = $item['product_code'];
                if (!is_string($codigoProduto) || !preg_match('/^[a-z0-9]{1,12}$/', $codigoProduto)) {
                    throw new InvalidArgumentException('O código de um produto está inválido.');
                }
                $buscarProdutoCodigo->bindValue(':codigo', $codigoProduto, PDO::PARAM_STR);
                $buscarProdutoCodigo->execute();
                $produto = $buscarProdutoCodigo->fetch();
            }
            if (!$produto) {
                throw new InvalidArgumentException('Um produto não existe ou está indisponível. Atualize o cardápio e tente novamente.');
            }
            $linha = [
                'product_id' => (int) $produto['id'],
                'name' => $produto['nome'],
                'details' => $produto['descricao'],
                'configuration' => null,
                'price' => (int) $produto['preco_centavos'],
                'quantity' => $quantidade,
            ];
        } elseif (array_key_exists('custom', $item)) {
            $pizza = montarPizzaPersonalizada($item['custom']);
            $linha = [
                'product_id' => null,
                'name' => $pizza['name'],
                'details' => $pizza['details'],
                'configuration' => $pizza['configuration'],
                'price' => $pizza['price'],
                'quantity' => $quantidade,
            ];
        } else {
            throw new InvalidArgumentException('Um item precisa indicar um produto ou uma pizza personalizada.');
        }

        $linha['subtotal'] = $linha['price'] * $quantidade;
        $total += $linha['subtotal'];
        if ($total > 4294967295) {
            throw new InvalidArgumentException('O valor total do pedido excede o limite permitido.');
        }
        $linhas[] = $linha;
    }

    if ($total < 1) {
        throw new InvalidArgumentException('O valor total do pedido precisa ser maior que zero.');
    }

    $gravarPedido = $pdo->prepare(
        'INSERT INTO pedidos (valor_total_centavos, forma_pagamento) VALUES (0, :pagamento)'
    );
    $gravarPedido->execute(['pagamento' => $pagamento]);
    $pedidoId = (int) $pdo->lastInsertId();

    $gravarItem = $pdo->prepare(
        'INSERT INTO itens_pedido
          (pedido_id, produto_id, nome_produto, detalhes, quantidade,
           preco_unitario_centavos, subtotal_centavos)
         VALUES (:pedido_id, :produto_id, :nome, :detalhes, :quantidade, :preco, :subtotal)'
    );
    $respostaItens = [];
    foreach ($linhas as $linha) {
        $detalhes = $linha['configuration'] === null
            ? $linha['details']
            : $linha['details'] . ' | ' . json_encode($linha['configuration'], JSON_UNESCAPED_UNICODE);
        $gravarItem->execute([
            'pedido_id' => $pedidoId,
            'produto_id' => $linha['product_id'],
            'nome' => $linha['name'],
            'detalhes' => $detalhes,
            'quantidade' => $linha['quantity'],
            'preco' => $linha['price'],
            'subtotal' => $linha['subtotal'],
        ]);
        $respostaItens[] = [
            'name' => $linha['name'],
            'quantity' => $linha['quantity'],
            'unit' => $linha['price'],
            'subtotal' => $linha['subtotal'],
        ];
    }

    $atualizarTotal = $pdo->prepare('UPDATE pedidos SET valor_total_centavos = :total WHERE id = :id');
    $atualizarTotal->execute(['total' => $total, 'id' => $pedidoId]);
    $pdo->commit();

    responderJson(201, [
        'success' => true,
        'order' => [
            'id' => $pedidoId,
            'number' => $pedidoId,
            'total' => $total,
            'payment' => $pagamento,
            'items' => $respostaItens,
        ],
    ]);
} catch (InvalidArgumentException $erro) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    responderJson(400, ['success' => false, 'error' => $erro->getMessage()]);
} catch (Throwable $erro) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log($erro->getMessage());
    responderJson(500, ['success' => false, 'error' => 'Não foi possível registrar o pedido. Confira a conexão com o banco.']);
}
