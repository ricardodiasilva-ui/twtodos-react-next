# TWTodos

Aplicação de lista de tarefas para organizar atividades do dia a dia. Construída com Next.js, React e Tailwind CSS, a interface funciona em português e salva as tarefas no armazenamento local do navegador.

## Funcionalidades

- Adicionar tarefas com validação: mínimo de três caracteres e início com letra maiúscula.
- Reordenar tarefas para cima ou para baixo.
- Excluir tarefas.
- Manter a lista salva no navegador entre visitas, usando `localStorage`.
- Exibir mensagens acessíveis de validação e de erro de armazenamento.

Os dados ficam no navegador atual e não são sincronizados entre dispositivos.

## Requisitos

- Node.js 22 ou superior e npm para desenvolvimento local.
- Docker com Docker Compose para executar em containers.

## Desenvolvimento local

Instale as dependências e inicie o servidor:

```bash
npm ci
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). As alterações nos arquivos são aplicadas pelo Fast Refresh.

Para validar uma build de produção localmente:

```bash
npm run build
npm start
```

## Desenvolvimento com Docker

Para executar em um container enquanto edita os arquivos no host:

```bash
docker compose -f compose.dev.yaml up --build
```

O código do projeto é montado no container. O Next.js verifica alterações a cada segundo para contornar eventos de arquivo que o Docker Desktop pode não propagar do Windows; as alterações são aplicadas com Fast Refresh. A aplicação ficará disponível em [http://localhost:3000](http://localhost:3000). Encerre com `Ctrl+C`.

Para remover o container e os volumes de dependências e cache:

```bash
docker compose -f compose.dev.yaml down -v
```

## Produção com Docker

Construa a imagem de produção e inicie a aplicação em segundo plano:

```bash
docker compose up --build -d
```

A aplicação ficará disponível em [http://localhost:3000](http://localhost:3000). No PowerShell, para usar outra porta no host, execute `$env:PORT=8080; docker compose up --build -d`.

Para interromper e remover o container:

```bash
docker compose down
```
