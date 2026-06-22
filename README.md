# ToDo App — Projeto Final DevOps

Sistema simples de gerenciamento de tarefas, desenvolvido como projeto final da disciplina de DevOps do Curso Técnico em Informática (Prof. César Olavo).

O projeto aplica na prática os conceitos de Git, GitHub, Docker e CI/CD, com fluxo colaborativo em equipe e pipeline automatizado de build, testes e publicação.

## Funcionalidades

- Cadastro de tarefas
- Listagem de tarefas (com filtros: todas, ativas, concluídas)
- Marcação de tarefa como concluída
- Remoção de tarefas
- Persistência de dados via banco de dados (Turso/libSQL)

## Tecnologias utilizadas

Frontend: HTML, CSS e JavaScript

Backend: Node.js com Express

Banco de dados: Turso (libSQL)

Testes: Jest

Containerização: Docker e Docker Compose

CI/CD: GitHub Actions

Registro de imagem: Docker Hub

## Estrutura do projeto

```
.
├── .github/
│   └── workflows/
│       └── ci.yml
├── migrations/
│   └── tasks.sql
├── server/
│   ├── Dockerfile
│   ├── db-client.js
│   ├── init-db.js
│   └── server.js
├── src/
│   ├── index.html
│   ├── script.js
│   ├── style.css
│   └── tarefas.js
├── tests/
│   └── tarefas.test.js
├── .dockerignore
├── .env.example
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── package.json
├── package-lock.json
└── README.md
```

## Como executar o projeto

Pré-requisitos: Docker e Docker Compose instalados, e uma conta no Turso com um banco criado (para obter a URL e o token de acesso).

Primeiro, clone o repositório:

```
git clone https://github.com/usuario/nome-do-repositorio.git
cd nome-do-repositorio
```

Depois, configure as variáveis de ambiente. Copie o arquivo de exemplo e preencha com seus dados:

```
cp .env.example .env
```

O arquivo .env deve conter:

```
TURSO_URL=sua_url_do_turso
TURSO_API_KEY=seu_token_do_turso
PORT=3000
```

Em seguida, suba os containers:

```
docker compose up --build
```

Isso vai iniciar o frontend, disponível em http://localhost:8090, e o backend (API), disponível em http://localhost:3000.

Na primeira execução, é necessário inicializar o banco de dados:

```
docker compose exec backend node server/init-db.js
```

## Rodando os testes

Os testes unitários cobrem a lógica de manipulação das tarefas: adicionar, remover, concluir e filtrar.

```
npm install
npm test
```

## Endpoints da API

GET /tasks — lista todas as tarefas

POST /tasks — cria uma nova tarefa

PUT /tasks/:id — atualiza o status de conclusão

DELETE /tasks/:id — remove uma tarefa

## Fluxo de CI/CD

O pipeline (.github/workflows/ci.yml) é executado automaticamente em todo push e pull request para a branch main, e contempla:

1. Build: instalação de dependências
2. Testes: execução automática dos testes unitários com Jest
3. Publicação (deploy): ao realizar merge na main, as imagens Docker do frontend e do backend são construídas e publicadas automaticamente no Docker Hub

As imagens publicadas podem ser baixadas com:

```
docker pull pegeos/to-do-list:latest
docker pull pegeos/to-do-list-backend:latest
```

## Fluxo de Git utilizado

A branch principal é a main. O desenvolvimento é feito em branches separadas, com nomes no padrão feature/nome-da-funcionalidade. A integração acontece via Pull Requests, com revisão antes do merge. Os commits seguem o padrão Conventional Commits, com prefixos como feat, fix e docs.

## Equipe

Arthur: cadastro de tarefas no frontend, backend, banco de dados (Turso) e criação do pipeline inicial do repositório

Pedro: remoção de tarefas, filtros, adicionar tarefa com Enter, e publicação das imagens Docker (frontend e backend)

Felipe: estilização (CSS), testes unitários, finalização do pipeline com deploy automatizado e documentação (README)

