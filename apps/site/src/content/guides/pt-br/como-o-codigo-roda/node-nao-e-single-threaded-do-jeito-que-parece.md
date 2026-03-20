---
title: Node Nao e Single-Threaded do Jeito que Parece
description: Como separar thread principal, event loop, libuv e worker threads sem transformar tudo numa frase errada.
summary: Dizer que Node e single-threaded ajuda no comeco, mas atrapalha se voce parar por ai.
guideId: node-single-thread
locale: pt-br
status: active
pillarId: runtime-and-execution
branchId: concurrency-and-parallelism
pubDate: 2026-02-08
updatedDate: 2026-02-10
category: Como o codigo roda
topic: Node
path:
  - Como o codigo roda
  - Concorrencia e paralelismo
order: 10
relationships:
  - javascript-event-loop
  - memory-basics-without-theatre
tags:
  - node
  - concurrency
  - runtime
topicIds:
  - node
  - javascript
relatedDeckIds:
  - node-runtime-core
---

## O problema

Muita gente repete que Node e single-threaded como se isso explicasse tudo.

Ajuda no comeco, mas vira problema quando essa frase passa a significar que o runtime inteiro so consegue fazer uma coisa por vez.

Nao e isso que esta acontecendo.

## Modelo mental

O jeito mais util de pensar em Node e separar as camadas:

- JavaScript roda numa thread principal por padrao
- o event loop coordena o que entra e sai de execucao
- libuv ajuda com I/O e outras operacoes assincronas
- worker threads entram quando voce realmente precisa paralelizar CPU

Isso ja evita metade da confusao.

## Quebrando o problema

Uma explicacao forte costuma seguir esta ordem:

1. o JavaScript da sua aplicacao roda numa thread principal
2. isso nao significa que nada mais pode acontecer ao mesmo tempo
3. Node lida bem com I/O porque coordena muitas operacoes pendentes
4. o que quebra a fluidez e CPU pesada bloqueando a thread principal

Quando voce organiza assim, a frase deixa de ser slogan e vira explicacao.

## Exemplo simples

Imagine uma rota como esta:

```js
app.get('/hash', (req, res) => {
  const result = slowHash(req.query.input)
  res.send(result)
})
```

Esse codigo pode bloquear a thread principal enquanto calcula.

O problema nao e que Node "nao faz concorrencia".

O problema e que voce colocou trabalho pesado de CPU bem no lugar onde o event loop precisa continuar respirando.

## Erros comuns

- tratar thread principal como se fosse o runtime inteiro
- confundir concorrencia de I/O com paralelismo de CPU
- achar que qualquer workload combina com Node do mesmo jeito
- citar worker threads sem explicar quando elas realmente ajudam

## Como um senior pensa

Um senior forte separa coordenacao de computacao.

Normalmente isso soa assim:

> Node funciona muito bem quando o trabalho principal e coordenar I/O. Quando o gargalo vira CPU pesada, eu preciso tirar esse custo da thread principal.

Isso mostra criterio, nao repeticao de frase pronta.

## O que o entrevistador quer ver

Aqui, o entrevistador normalmente quer ver:

- voce separa JavaScript da thread principal do runtime como um todo
- voce entende por que I/O e CPU pesada se comportam diferente
- voce sabe onde worker threads entram de verdade

Quem explica isso bem parece muito mais solido do que quem so repete que Node e single-threaded.

> Node nao faz uma coisa por vez. Ele so nao executa seu JavaScript pesado em varias threads por padrao.

> Se o problema e CPU, nao adianta falar de concorrencia de I/O como se fosse a mesma coisa.
