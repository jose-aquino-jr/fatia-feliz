<?php
require_once __DIR__ . '/../config/resposta.php';
require_once __DIR__ . '/../config/database.php';

exigirMetodo('GET');
if (isset($_GET['id']) && !is_string($_GET['id'])) {
    responderJson(400, ['success' => false, 'error' => 'O identificador do produto é inválido.']);
}
$identificador = trim($_GET['id'] ?? '');
if ($identificador === '') {
    responderJson(400, ['success' => false, 'error' => 'Informe o ID ou código do produto.']);
}

try {
    $pdo = conectarBanco();
    if (ctype_digit($identificador) && (int) $identificador > 0) {
        $consulta = $pdo->prepare(
            'SELECT p.id, p.codigo AS code, c.codigo AS category, p.nome AS name,
                    p.descricao AS description, p.preco_centavos AS price,
                    p.imagem AS image, p.imagens_extra AS extra_images, p.disponivel AS available
             FROM produtos p INNER JOIN categorias c ON c.id = p.categoria_id
             WHERE p.id = :id AND p.disponivel = 1'
        );
        $consulta->bindValue(':id', (int) $identificador, PDO::PARAM_INT);
    } else {
        $consulta = $pdo->prepare(
            'SELECT p.id, p.codigo AS code, c.codigo AS category, p.nome AS name,
                    p.descricao AS description, p.preco_centavos AS price,
                    p.imagem AS image, p.imagens_extra AS extra_images, p.disponivel AS available
             FROM produtos p INNER JOIN categorias c ON c.id = p.categoria_id
             WHERE p.codigo = :codigo AND p.disponivel = 1'
        );
        $consulta->bindValue(':codigo', $identificador, PDO::PARAM_STR);
    }
    $consulta->execute();
    $produto = $consulta->fetch();
    if (!$produto) {
        responderJson(404, ['success' => false, 'error' => 'Produto não encontrado ou indisponível.']);
    }
    $produto['id'] = (int) $produto['id'];
    $produto['price'] = (int) $produto['price'];
    $produto['available'] = (bool) $produto['available'];
    $extras = json_decode($produto['extra_images'] ?? '', true);
    if (is_array($extras)) {
        $produto['visuals'] = array_merge([$produto['image']], array_values(array_filter($extras, 'is_string')));
    }
    unset($produto['extra_images']);
    responderJson(200, ['success' => true, 'product' => $produto]);
} catch (Throwable $erro) {
    error_log($erro->getMessage());
    responderJson(500, ['success' => false, 'error' => 'Não foi possível buscar o produto. Confira a configuração do banco.']);
}
