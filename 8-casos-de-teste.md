# ENTREGA 08 – Descritivo de Casos de Teste

## 8.2 Ferramentas e ambiente de teste
- Teste manual no navegador (Google Chrome / Firefox) em http://localhost:3000
- Teste de API opcional: curl / Postman
- Ambiente: Node.js (SQLite embutido), banco `almoxarifado_db`, dados do script SQL
- Usuários de teste: admin@fabrica.com / admin123 · maria@fabrica.com / maria123

## 8.1 Casos de teste

| ID | Req. | Entrada / Passos | Resultado esperado |
|----|------|------------------|--------------------|
| CT01 | RF01 | Login com maria@fabrica.com / maria123 | Abre a tela principal |
| CT02 | RF02 | Login com e-mail inexistente | Mensagem "Usuário não encontrado." e volta ao login |
| CT03 | RF02 | Login com senha errada | Mensagem "Senha incorreta." e volta ao login |
| CT04 | RF02 | Login com campos vazios | Mensagem "Preencha e-mail e senha." e volta ao login |
| CT05 | RF03 | Após login, ver o cabeçalho | Nome "Maria Souza" aparece; botões do menu visíveis |
| CT06 | RF04 | Clicar em "Sair" | Retorna ao login; acessar /principal.html direto redireciona ao login |
| CT07 | RF05 | Abrir Cadastro de Produto | Tabela já carregada com 5 produtos |
| CT08 | RF06 | Buscar "frasco" | Só os 3 frascos aparecem |
| CT09 | RF06 | Buscar "xyz" | "Nenhum produto encontrado." |
| CT10 | RF07 | Cadastrar produto válido | Mensagem de sucesso; aparece na tabela |
| CT11 | RF10 | Salvar com nome vazio | Alerta "Informe o nome do produto." |
| CT12 | RF10 | Estoque mínimo negativo | Alerta de valor inválido |
| CT13 | RF10 | Código já existente | "Já existe um produto com esse código." |
| CT14 | RF08 | Editar nome de um produto | Tabela mostra o novo nome |
| CT15 | RF09 | Excluir produto recém-criado (sem histórico) | Produto some da tabela |
| CT16 | RF09 | Excluir produto com movimentações | Mensagem de bloqueio |
| CT17 | RF11 | Abrir Gestão de Estoque | Lista em ordem alfabética |
| CT18 | RF12 | Entrada de 10 un. de CX-001 com data de hoje | Estoque sobe 10; aparece no histórico |
| CT19 | RF13 | Saída maior que o estoque | "Estoque insuficiente. Disponível: N." |
| CT20 | RF14 | Saída que deixa o estoque abaixo do mínimo | Alerta (pop-up) com nome do produto, saldo e mínimo |
| CT21 | RF14 | Saída que mantém estoque acima do mínimo | Sem alerta; mensagem de sucesso |
| CT22 | RF12 | Registrar sem escolher tipo / quantidade 0 / sem data | Mensagem de erro correspondente |
| CT23 | RF15 | Após movimentar, ver histórico | Linha com data, produto, tipo, qtd e responsável (usuário logado) |
