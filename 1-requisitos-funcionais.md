# ENTREGA 01 – Requisitos Funcionais

| Cód. | Requisito | Descrição |
|------|-----------|-----------|
| RF01 | Autenticação | O sistema deve permitir login com e-mail e senha. |
| RF02 | Falha de login | Em caso de falha, informar o motivo (usuário não encontrado, senha incorreta, campos vazios) e redirecionar à tela de login. |
| RF03 | Tela principal | Exibir o nome do usuário logado e menu para Cadastro de Produto e Gestão de Estoque. |
| RF04 | Logout | Permitir encerrar a sessão e voltar ao login. |
| RF05 | Listar produtos | Listar em tabela os produtos cadastrados, carregando automaticamente ao abrir a tela. |
| RF06 | Buscar produtos | Filtrar a listagem por nome, código, categoria ou material. |
| RF07 | Cadastrar produto | Cadastrar produto (código, nome, categoria, material, gramatura, dimensões, capacidade, tampa, peso, estoque inicial, estoque mínimo). |
| RF08 | Editar produto | Alterar os dados de um produto existente (o estoque atual só muda por movimentação). |
| RF09 | Excluir produto | Excluir produto; bloquear se houver histórico de movimentações. |
| RF10 | Validação | Validar campos obrigatórios e valores inválidos (negativos, vazios, código duplicado) com mensagem ao usuário. |
| RF11 | Listagem ordenada | Na gestão de estoque, listar produtos em ordem alfabética usando algoritmo de ordenação (Insertion Sort). |
| RF12 | Movimentar estoque | Selecionar produto, tipo (entrada/saída), quantidade e data, e registrar a movimentação. |
| RF13 | Saldo insuficiente | Impedir saída maior que o estoque disponível. |
| RF14 | Estoque mínimo | Após cada saída, verificar se o estoque ficou abaixo do mínimo e emitir alerta automático. |
| RF15 | Histórico | Registrar cada movimentação com produto, tipo, quantidade, data e usuário responsável. |
| RF16 | Consulta de histórico | Exibir o histórico das últimas movimentações na tela de gestão de estoque. |

## Requisitos não funcionais (opcional citar)
- Senhas armazenadas como hash SHA-256.
- Telas internas só acessíveis com sessão ativa (API retorna 401 sem login).
- Interface web, responsiva, simples e intuitiva.
