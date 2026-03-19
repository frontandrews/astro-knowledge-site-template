---
title: Event loop
description: O que o event loop coordena e por que JavaScript assincrono costuma rodar numa ordem que surpreende.
summary: Event loop e o mecanismo que decide quando o trabalho enfileirado ganha vez depois que a stack atual termina.
conceptId: event-loop
domainId: javascript
groupId: runtime
locale: pt-br
status: active
pubDate: 2026-03-19
tags:
  - javascript
  - async
  - runtime
relatedGuideIds:
  - javascript-event-loop
---

## O que e

O event loop coordena quando o trabalho enfileirado pode rodar depois que o trabalho sincronico atual acaba.

E por isso que promises, timers e callbacks nao executam todos no mesmo momento em que aparecem no codigo.

## Quando importa

Isso importa quando voce esta debugando ordem de execucao, bugs assincronos ou perguntas de entrevista sobre JavaScript.

Sem separar stack, fila e agendamento, o comportamento parece aleatorio.

## Erro comum

Um erro comum e falar apenas "codigo assincrono roda depois" sem explicar o que significa esse "depois".

Isso nao ajuda nem a debugar nem a explicar direito.

## Exemplo curto

Se voce faz `console.log('A')`, agenda um callback de promise e depois faz `console.log('B')`, os logs sincronicos terminam primeiro.

So depois a callback enfileirada ganha vez.

## Por que isso ajuda

Quando voce pensa em ordem de execucao em vez de so olhar a sintaxe, varios bugs ficam muito mais explicaveis.

Esse e o ganho real do conceito.
