# ENTREGA 09 – Lista de Requisitos de Infraestrutura

> PREENCHER NA PROVA com as versões reais da máquina (comandos no GUIA-DE-ESTUDO.md).

| Item | Valor |
|------|-------|
| SGBD | SQLite (embutido no Node.js) – versão: ______ (rodar `node -e "const {DatabaseSync}=require('node:sqlite');console.log(new DatabaseSync(':memory:').prepare('select sqlite_version() v').get())"`) |
| Linguagem | JavaScript (Node.js) versão ______ (`node -v`) + HTML5/CSS3 |
| Sistema operacional | ______ (Windows: `winver` / Linux: `lsb_release -a`) |
| Navegador | Google Chrome versão ______ |
| Dependências | Nenhuma (apenas módulos nativos do Node) |
