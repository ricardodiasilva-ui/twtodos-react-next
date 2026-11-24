# TWTodos

Aplicação de lista de tarefas feita com Next.js e Tailwind CSS.

## Desenvolvimento local

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## Desenvolvimento com Docker

Para executar em um container enquanto edita os arquivos no host, use:

```bash
docker compose -f compose.dev.yaml up --build
```

O código do projeto é montado no container e o Next.js verifica alterações a cada segundo para contornar eventos de arquivo que o Docker Desktop pode não propagar do Windows. As alterações são refletidas com Fast Refresh. A aplicação ficará disponível em [http://localhost:3000](http://localhost:3000). Encerre com `Ctrl+C`; para remover o container e os volumes de dependências/cache, execute `docker compose -f compose.dev.yaml down -v`.

## Produção com Docker

Com Docker e Docker Compose instalados, construa a imagem e inicie a aplicação com um único comando:

```bash
docker compose up --build -d
```

A aplicação ficará disponível em [http://localhost:3000](http://localhost:3000). No PowerShell, para escolher outra porta no host, execute `$env:PORT=8080; docker compose up --build -d`.

Para interromper e remover o container, execute:

```bash
docker compose down
```
