# Sistema de Gestão de Estoque – Almoxarifado (indústria de embalagens)

## Como rodar (sem internet, sem npm install)
```
cd sistema
node server.js
```
Abrir http://localhost:3000  — logins: `admin@fabrica.com / admin123`, `maria@fabrica.com / maria123`, `joao@fabrica.com / joao123`

Na primeira execução o servidor cria o banco `almoxarifado_db.sqlite` a partir de `3-almoxarifado_db_sqlite.sql`.
Para recriar do zero: apague `sistema/almoxarifado_db.sqlite` e rode de novo.
Requer Node.js 22.13 ou superior (`node -v`).

## Entregas
1 requisitos · 2 DER · 3 script SQL · sistema/ (4,5,6,7) · 8 testes · 9 infraestrutura
