<?php
require_once __DIR__ . '/../config/resposta.php';
require_once __DIR__ . '/../config/database.php';

exigirMetodo('GET');

try {
    $pdo = conectarBanco();
    $categorias = $pdo->query(
        'SELECT codigo AS code, nome AS name FROM categorias ORDER BY ordem, nome'
    )->fetchAll();

    if (isset($_GET['categoria']) && !is_string($_GET['categoria'])) {
        responderJson(400, ['success' => false, 'error' => 'A categoria informada é inválida.']);
    }
    $categoria = isset($_GET['categoria']) ? trim($_GET['categoria']) : '';
    if ($categoria !== '' && !preg_match('/^[a-z0-9_-]{1,40}$/', $categoria)) {
        responderJson(400, ['success' => false, 'error' => 'A categoria informada é inválida.']);
    }
    $sql = 'SELECT p.id, p.codigo AS code, c.codigo AS category, p.nome AS name,
                   p.descricao AS description, p.preco_centavos AS price,
                   p.imagem AS image, p.imagens_extra AS extra_images, p.disponivel AS available
            FROM produtos p
            INNER JOIN categorias c ON c.id = p.categoria_id
            WHERE p.disponivel = 1';
    if ($categoria !== '') {
        $sql .= ' AND c.codigo = :categoria';
    }
    $sql .= ' ORDER BY c.ordem, p.nome';

    $consulta = $pdo->prepare($sql);
    if ($categoria !== '') {
        $consulta->bindValue(':categoria', $categoria, PDO::PARAM_STR);
    }
    $consulta->execute();
    $produtos = $consulta->fetchAll();

    foreach ($produtos as &$produto) {
        $produto['id'] = (int) $produto['id'];
        $produto['price'] = (int) $produto['price'];
        $produto['available'] = (bool) $produto['available'];
        $extras = json_decode($produto['extra_images'] ?? '', true);
        if (is_array($extras)) {
            $produto['visuals'] = array_merge([$produto['image']], array_values(array_filter($extras, 'is_string')));
        }
        unset($produto['extra_images']);
    }
    unset($produto);

    responderJson(200, ['success' => true, 'categories' => $categorias, 'products' => $produtos]);
} catch (Throwable $erro) {
    error_log($erro->getMessage());
    responderJson(500, ['success' => false, 'error' => 'Não foi possível carregar o cardápio. Confira a configuração do banco.']);
}
