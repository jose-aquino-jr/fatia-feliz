<?php
function responderJson($status, $dados)
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($dados, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function exigirMetodo($metodo)
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== $metodo) {
        header('Allow: ' . $metodo);
        responderJson(405, ['success' => false, 'error' => 'Método não permitido.']);
    }
}

function lerJson()
{
    $conteudo = file_get_contents('php://input');
    if (strlen($conteudo) > 20000) {
        responderJson(413, ['success' => false, 'error' => 'Os dados enviados excedem o limite do pedido.']);
    }
    $dados = json_decode($conteudo, true);
    if (!is_array($dados)) {
        responderJson(400, ['success' => false, 'error' => 'Envie os dados do pedido em JSON válido.']);
    }
    return $dados;
}
