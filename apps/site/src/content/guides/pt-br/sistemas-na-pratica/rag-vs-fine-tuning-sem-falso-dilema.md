---
title: RAG vs Fine-Tuning Sem Falso Dilema
description: Como decidir entre retrieval e fine-tuning olhando para o tipo de falha real do sistema, nao para hype.
summary: Antes de escolher a tecnica, descubra se o problema e falta de contexto ou comportamento ruim mesmo com contexto.
guideId: rag-vs-fine-tuning
locale: pt-br
status: active
pillarId: system-thinking
branchId: ai-systems-and-retrieval
pubDate: 2026-02-11
updatedDate: 2026-02-15
category: Sistemas na pratica
topic: IA, busca e contexto
path:
  - Sistemas na pratica
  - IA, busca e contexto
order: 10
relationships:
  - api-and-service-design-with-clear-boundaries
tags:
  - ai
  - rag
  - fine-tuning
topicIds:
  - system-design
  - ai-engineering
relatedDeckIds:
  - ai-engineering-rag-evals-core
---

## O problema

Muita conversa sobre RAG e fine-tuning vira disputa de ferramenta.

Parece que voce precisa escolher um lado antes mesmo de entender qual falha o sistema tem.

Com isso, a decisao fica mais ideologica do que tecnica.

## Modelo mental

O ponto principal nao e comparar nomes.

O ponto principal e separar dois tipos de problema:

- o modelo nao tem o contexto certo na hora certa
- o modelo tem contexto, mas continua se comportando mal do mesmo jeito

Essa divisao ja melhora muito a conversa.

## Quebrando o problema

Antes de escolher, tente responder:

1. a falha vem de conhecimento faltando ou desatualizado?
2. ou o problema e comportamento repetido mesmo com contexto bom?
3. eu preciso de uma camada mais facil de atualizar e inspecionar?
4. o custo operacional de fine-tuning faz sentido aqui?

Essas perguntas puxam a decisao para a falha real, nao para moda.

## Exemplo simples

Imagine um assistente interno que responde perguntas sobre politica da empresa.

Se ele erra porque nao recebeu o documento mais recente, o problema parece muito mais de retrieval do que de fine-tuning.

Agora imagine um fluxo em que o modelo ate recebe o contexto certo, mas continua respondendo no formato errado ou ignorando instrucoes importantes de forma recorrente.

A conversa entao pode comecar a apontar para ajuste de comportamento, e nao so para busca.

O importante e perceber que o tipo de falha mudou.

## Erros comuns

- tratar RAG e fine-tuning como se um anulasse o outro
- puxar fine-tuning cedo demais sem provar que retrieval ja esta bom
- chamar qualquer erro de "falta de contexto"
- ignorar custo de operacao, avaliacao e iteracao

## Como um senior pensa

Um senior forte comeca pela falha observavel.

Normalmente isso soa assim:

> Se o sistema falha porque nao acessa o conhecimento certo, eu melhoro retrieval primeiro. Se ele falha mesmo com o contexto correto, eu comeco a discutir mudanca de comportamento.

Isso organiza a decisao de um jeito muito mais util.

## O que o entrevistador quer ver

Em entrevista, isso costuma mostrar maturidade rapido:

- voce sabe distinguir acesso a conhecimento de comportamento do modelo
- voce escolhe o ponto de controle mais barato e mais inspecionavel primeiro
- voce pensa em iteracao e custo operacional

Quem faz isso bem parece alguem que projeta sistema de IA com criterio, nao com buzzword.

> Antes de escolher a tecnica, descubra qual falha voce esta tentando corrigir.

> Se o modelo nem recebeu o contexto certo ainda, discutir fine-tuning pode estar cedo demais.
