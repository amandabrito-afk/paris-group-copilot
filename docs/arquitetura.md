# Arquitetura — Paris Group Copilot

Este documento justifica cada peça da stack. O critério de julgamento não é
preferência técnica: é a hipótese de valor escrita em [enquadramento.md](enquadramento.md).

A dor que o produto ataca não é lentidão — é **retenção de conhecimento em uma
pessoa só**. Hoje estruturar um cliente custa ~12h, e o custo maior nem é o tempo:
é que quem não participou do briefing precisa reconstruir o contexto perguntando.
A métrica de validação é uma pessoa nova entender a base de uma marca em **até 30
minutos**, sem ter estado na reunião.

Toda decisão abaixo é avaliada por três perguntas, nesta ordem:

1. Ajuda alguém que não estava lá a se situar sozinho?
2. É reaproveitável no próximo produto do studio, ou vira trabalho do zero de novo?
3. Alguém consegue manter isso sem ser quem construiu?

---

## O princípio: base fixa, variação por produto

O studio já resolveu esse problema uma vez, no sistema visual dos perfis da Paris
Group. Lá, a base é fixa nos dez perfis — fundo, selo circular, grid 4:5, o par
tipográfico. O que varia por pessoa é pouco e delimitado: uma cor de acento, o
cargo, dois pilares, a foto. O primeiro perfil demorou porque estava construindo a
base; do segundo em diante o custo cai porque só a variação é nova.

A stack aplica a mesma separação ao software. Next.js, FastAPI e PostgreSQL são a
base fixa que todo MVP do studio herda. O que varia por produto são as entidades e
as telas — o equivalente à cor de acento.

Uma decisão de arquitetura que não se encaixa nessa separação não entra.

---

## Next.js (interface)

**Por que, e não Remix ou React puro.** Next.js usa rotas baseadas em arquivo: a
pasta `src/app/projeto/` *é* a rota `/projeto`. Isso não é conveniência de quem
escreve, é legibilidade para quem chega depois — abrir a pasta e ver as rotas
responde "o que este produto faz" sem precisar perguntar. É o critério dos 30
minutos aplicado ao código.

Remix resolve roteamento com qualidade parecida, mas o studio ganha mais com
padronização do que com a escolha ótima isolada: o segundo produto herda as
decisões do primeiro, e trocar de framework a cada MVP anula esse ganho. React puro
exigiria montar roteamento e build a cada projeto — exatamente o "do zero toda vez"
que o produto existe para eliminar.

**Reaproveitamento:** layout, componentes compartilhados e convenção de pastas
atravessam produtos. Só as páginas de domínio são novas.

---

## FastAPI (camada de dados)

**Por que, e não Express.** FastAPI gera o contrato OpenAPI automaticamente a partir
do código, e expõe em `/docs` uma página navegável com todos os endpoints, seus
campos e formatos. Ninguém precisa escrever nem manter essa documentação: ela não
tem como ficar desatualizada, porque é derivada do código.

Isso é o critério de transferência de conhecimento resolvido por construção. Uma
pessoa nova abre `/docs` e vê o que existe — em vez de perguntar para quem escreveu.
Com Express, essa documentação seria trabalho manual separado, e conhecimento que
depende de alguém lembrar de atualizar é exatamente o conhecimento que se perde.

Os schemas de entrada e saída (`ProjetoCreate`/`ProjetoOut`,
`HipoteseCreate`/`HipoteseOut`) também validam os dados na borda: um campo
obrigatório que falta é recusado com mensagem clara, em vez de virar registro
quebrado no banco meses depois.

**Reaproveitamento:** a estrutura de routers, schemas e conexão é idêntica entre
produtos. Muda o nome das entidades.

---

## PostgreSQL (persistência)

**Por que, e não SQLite.** SQLite é um arquivo em uma máquina. Adotá-lo recriaria
literalmente a dor do enquadramento: a base de um cliente moraria no computador de
uma pessoa, e quem precisasse dela teria que pedir. O produto existe para acabar
com isso.

PostgreSQL aceita várias pessoas lendo e escrevendo a mesma base ao mesmo tempo,
que é a condição mínima para a métrica dos 30 minutos fazer sentido — ela pressupõe
alguém consultando sem depender de ninguém.

Além disso, o modelo de dados de um copiloto de studio é relacional por natureza:
um projeto tem hipóteses, uma hipótese tem métricas e validações. Postgres expressa
essas ligações e garante que não sobre hipótese apontando para projeto inexistente.

**Reaproveitamento:** a mesma instância serve vários produtos do studio, separados
por base. Não há infraestrutura nova a cada MVP.

---

## Docker Compose (ambiente)

**Por que.** Um arquivo, um comando, e o ambiente inteiro sobe igual em qualquer
máquina. Sem isso, entrar em um produto começa com instalar Postgres na mão,
descobrir versão, configurar usuário — horas de reconstrução antes da primeira
linha útil, e nenhuma garantia de que a máquina ficou igual à do vizinho.

É a mesma tese do documento aplicada ao ambiente: o setup é conhecimento que não
pode morar na cabeça de quem configurou primeiro.

**Manutenção:** a versão do Postgres está declarada no arquivo. Quem abrir o
repositório em um ano vê exatamente o que precisa, sem arqueologia.

---

## Monorepo (`api/` dentro do mesmo repositório)

**Por que, e não dois repositórios.** O contexto de um produto — enquadramento,
telas e dados — fica em um lugar só. Dois repositórios significam duas histórias
para cruzar, e alguém novo precisando descobrir que o segundo existe.

Para o volume do studio, onde cada MVP é pequeno e tocado por poucas pessoas, o
custo de separar é maior que o benefício. E permite versionar junto uma mudança que
atravessa as duas camadas, em vez de coordenar dois commits que precisam combinar.

---

## O que foi deliberadamente deixado de fora do MVP

- **Autenticação e permissões** — o MVP valida se a estrutura transfere
  conhecimento. Controle de acesso é necessário para produção, não para a hipótese.
- **Redis / cache** — otimização antes de existir problema de carga é custo de
  manutenção sem ganho mensurável.
- **Deploy automatizado** — enquanto a hipótese não for validada, publicar o produto
  não responde nenhuma das três perguntas do topo deste documento.
