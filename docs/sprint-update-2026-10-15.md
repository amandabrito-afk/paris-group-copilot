# Atualização de sprint — Paris Group Copilot

**Data:** 15/10/2026 · **Para:** revisão técnica da série B · **Formato:** assíncrono, sem reunião

> **Demo em vídeo (1min47):** https://claude.ai/artifact/4UcLF7NNR1PMBujPPdUDGn
>
> **Nota de escopo.** A demonstração visual foi feita sobre o **sistema de identidade dos
> perfis** — área de atuação de quem conduz a comunicação — em vez da camada de código do
> produto. O formato e o objetivo da entrega são os mesmos: substituir reunião de status por
> material assíncrono, com contexto de negócio, decisões e próximos passos.

---

## Contexto

O Paris Group Copilot ataca uma dor de operação, não de ferramenta. Estruturar um cliente novo custa hoje cerca de **12 horas** — briefing, pesquisa de concorrentes, posicionamento e organização da marca. O custo maior não é o tempo: é que o conhecimento fica retido em quem executou o processo. Quem entra depois reconstrói o contexto perguntando.

**Hipótese de valor.** Se o processo virar uma estrutura única e replicável, então uma pessoa que não participou do briefing entende a base de um produto **em até 30 minutos**, porque briefing, concorrentes, posicionamento e marca passam a viver num lugar só.

**Métrica de validação.** Tempo até um entendimento verificável da base, por alguém que não esteve na reunião. Alvo: 30 minutos. A métrica mede transferência, não velocidade individual — não pode ser batida por alguém trabalhando mais rápido sozinho.

**O que está no ar.** Rotas de produto `/projeto` e `/hipotese` em Next.js com TypeScript; API em FastAPI com contrato OpenAPI cobrindo as entidades Projeto e Hipótese; PostgreSQL orquestrado por Docker Compose.

A camada de apresentação está deliberadamente enxuta. É decisão de arquitetura documentada, não atraso: o MVP existe para testar a hipótese de transferência de conhecimento, e interface elaborada não move essa métrica.

---

## As três decisões técnicas da sprint

### 1. FastAPI na camada de dados — e não Express

O FastAPI deriva o contrato OpenAPI do próprio código e o serve em `/docs`, navegável. Essa documentação não é escrita nem mantida por ninguém, o que significa que **não tem como ficar desatualizada**.

Isso resolve a métrica dos 30 minutos por construção: quem chega abre `/docs` e vê o que existe, em vez de perguntar a quem escreveu. Com Express, a mesma documentação seria trabalho manual paralelo — e conhecimento que depende de alguém lembrar de atualizar é exatamente o conhecimento que se perde.

Ganho colateral: os schemas de entrada e saída validam os dados na borda. Campo obrigatório ausente é recusado com mensagem clara, em vez de virar registro quebrado no banco meses depois.

### 2. PostgreSQL — e não SQLite

SQLite é um arquivo numa máquina. Adotá-lo recriaria literalmente a dor do enquadramento: a base de um cliente moraria no computador de uma pessoa, e quem precisasse dela teria que pedir.

PostgreSQL aceita várias pessoas lendo e escrevendo simultaneamente, que é a condição mínima para a métrica fazer sentido — ela pressupõe consulta sem depender de ninguém. O modelo também é relacional por natureza: um projeto tem hipóteses, uma hipótese tem métricas e validações.

### 3. Monorepo com Docker Compose — e não dois repositórios

Um arquivo, um comando, e o ambiente inteiro sobe igual em qualquer máquina. Sem isso, entrar no produto começa com instalar Postgres na mão e descobrir versão — horas de reconstrução antes da primeira linha útil.

Manter a API dentro do mesmo repositório mantém o contexto do produto em um lugar só: enquadramento, telas e dados. Para o volume de um studio, onde cada MVP é pequeno e tocado por poucas pessoas, o custo de separar supera o benefício.

**O fio condutor das três:** separar o que é base reaproveitável entre produtos do que é específico deste. É o que permite o próximo MVP herdar em vez de recomeçar.

---

## Bloqueios ativos

| # | Bloqueio | Tipo | Por que bloqueia | Dono | Prazo |
|---|---|---|---|---|---|
| 1 | Chassi do backend: manter FastAPI + SQLAlchemy ou migrar para PostgreSQL no Railway + Drizzle ORM | Técnico | **O mais crítico.** O custo de migração cresce a cada funcionalidade construída sobre a estrutura atual — o retrabalho é composto. Interfere no que se constrói agora, não depois. | Lead técnico | 10/10/2026 |
| 2 | Definição do conteúdo mínimo que compõe "a base de um produto" | Produto | A métrica dos 30 minutos depende dessa definição. Sem ela não há como montar o teste de validação. Menos crítico que o item 1: pode ser refinado com o uso, sem retrabalho acumulado. | Amanda (`amandabrito-afk`) | 15/10/2026 |
| 3 | Acesso à plataforma AsyncMe | Operacional | Impede registrar handoffs na superfície canônica da frota. Contornado por ora com `PG-Vault/.claude/briefs/`. | Admin da org | 03/10/2026 |

---

## Próximos passos

| # | Ação | Dono | Prazo |
|---|---|---|---|
| 1 | Decidir o chassi do backend, antes da próxima feature no `api/` | Lead técnico | 10/10/2026 |
| 2 | Definir e validar o conteúdo mínimo da base de um produto | Amanda (`amandabrito-afk`) | 15/10/2026 |
| 3 | Rodar o teste dos 30 minutos com uma pessoa que não participou do briefing | Amanda (`amandabrito-afk`) | 22/10/2026 |
| 4 | Liberar o acesso ao AsyncMe | Admin da org | 03/10/2026 |

---

## Como revisar sem reunião

1. Assista à demo de 3 minutos no link do topo
2. Leia [`docs/enquadramento.md`](enquadramento.md) — o contrato intelectual do produto
3. Leia [`docs/arquitetura.md`](arquitetura.md) — a justificativa de cada peça da stack
4. Suba o ambiente: `docker compose up` · API em `localhost:8000/docs` · front em `localhost:3000`

Dúvidas respondidas na própria Pull Request. Não é necessário agendar call.
