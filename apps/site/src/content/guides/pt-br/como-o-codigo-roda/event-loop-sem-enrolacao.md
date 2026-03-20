---
title: Event Loop Sem Enrolação
description: Um jeito direto de entender pilha, microtasks e macrotasks sem decorar frases vagas.
summary: O event loop fica mais simples quando voce pensa em ordem de execucao, nao em misterio.
guideId: javascript-event-loop
locale: pt-br
status: active
pillarId: runtime-and-execution
branchId: event-loop-and-order
pubDate: 2026-03-13
updatedDate: 2026-03-17
category: Como o codigo roda
topic: Event Loop
path:
  - Como o codigo roda
  - Event loop e ordem de execucao
order: 10
relationships:
  - node-single-thread
tags:
  - javascript
  - event loop
  - async
topicIds:
  - javascript
relatedDeckIds:
  - javascript-runtime-core
---

## O problema

Muita explicacao sobre event loop parece correta, mas nao ajuda de verdade.

Voce ouve termos como stack, microtask e macrotask, mas a ordem real de execucao continua nebulosa.

Quando isso acontece, qualquer exemplo simples parece truque.

## Modelo mental

O modelo util e bem menor do que parece:

1. termina o que esta na pilha atual
2. esvazia as microtasks
3. pega a proxima macrotask

Se voce lembra disso, muita coisa ja para de parecer magica.

## Quebrando o problema

Quando quiser explicar event loop, foque em tres perguntas:

1. o que roda agora
2. o que fica agendado para depois
3. qual fila vai ser atendida primeiro quando a pilha esvaziar

Isso e muito mais util do que recitar definicoes soltas.

## Exemplo simples

Olhe este codigo:

```js
console.log('inicio')

setTimeout(() => {
  console.log('timeout')
}, 0)

Promise.resolve().then(() => {
  console.log('promise')
})

console.log('fim')
```

A saida e:

```txt
inicio
fim
promise
timeout
```

Por que?

- `inicio` roda na pilha atual
- o `setTimeout` agenda uma macrotask
- o `Promise.then` agenda uma microtask
- `fim` ainda roda na pilha atual
- quando a pilha acaba, as microtasks rodam antes da proxima macrotask

## Erros comuns

- dizer que `Promise` e "mais rapido" sem explicar a ordem
- decorar nome de fila sem entender quando ela e atendida
- esquecer que microtasks demais tambem podem travar a sensacao de fluidez
- tratar `setTimeout(..., 0)` como se fosse "executa imediatamente"

## Como um senior pensa

Um senior forte reduz isso para mecanismo, nao para folclore.

Normalmente isso soa assim:

> JavaScript termina a pilha atual primeiro. Depois roda microtasks, como callbacks de promise, e so entao vai para a proxima macrotask, como timeout.

Essa resposta funciona porque explica a ordem, nao so os nomes.

## O que o entrevistador quer ver

Aqui, o entrevistador costuma procurar sinais bem simples:

- voce entende a ordem de execucao
- voce consegue explicar sem enrolação
- voce sabe ligar isso a um exemplo concreto

Se voce faz isso bem, o tema para de soar decorado e passa a soar compreendido.

> Event loop fica muito mais simples quando voce pensa em "o que roda agora e o que espera".

> Nao diga que promise e mais rapida. Diga quem entra em qual fila e o que roda antes.
