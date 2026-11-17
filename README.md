# Fatia Feliz — configuração local

O cardápio e os pedidos usam PHP, PDO e MySQL. O carrinho continua salvo no `localStorage` do navegador. O PHP calcula novamente o preço no envio e grava o pedido e seus itens numa transação.

## Rodar no computador

1. Instale um pacote local com Apache, PHP e MySQL, como XAMPP, e inicie Apache e MySQL.
2. No phpMyAdmin, crie o banco `fatia_feliz` usando `utf8mb4`.
3. Selecione esse banco e importe o arquivo `database.sql`.
4. Copie `backend/config/config.php` para `backend/config/config.local.php` e ajuste os dados locais. No XAMPP, o padrão costuma ser host `127.0.0.1`, usuário `root`, senha vazia e banco `fatia_feliz`.
5. Coloque a pasta do projeto dentro de `htdocs` e abra a URL local pelo Apache, por exemplo `http://localhost/Pizza/`. Não abra `index.html` diretamente pelo explorador (`file://`), pois o navegador precisa chamar os endpoints PHP.
6. Abra `backend/produtos/listar.php` para confirmar que o banco retorna o cardápio. Faça um pedido de teste pela interface e confira as tabelas `pedidos` e `itens_pedido` no phpMyAdmin.

O pagamento é apenas registrado como forma escolhida; não há cobrança real.

## Publicar no InfinityFree

1. Crie um banco MySQL no painel da hospedagem e importe `database.sql` nesse banco pelo phpMyAdmin.
2. Copie os arquivos do projeto para a pasta pública da conta, mantendo `backend/` e `assets/` na raiz do site.
3. Crie `backend/config/config.local.php` no servidor com host, nome do banco, usuário e senha mostrados pelo painel. Esse arquivo é ignorado pelo Git. No InfinityFree, use o hostname MySQL informado lá; ele não é `localhost`.
4. Abra a URL pública do site e teste o cardápio e um pedido.

Para tirar um produto do menu sem apagar o histórico, defina `disponivel = 0` na tabela `produtos`. Nome, descrição, preço, categoria e imagem também ficam na tabela `produtos`, prontos para uma futura tela administrativa. Os preços são guardados em centavos como inteiros.
