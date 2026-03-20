---
title: Bugs Assincronos e Race Conditions Sem Drama
description: Como entender falhas de timing sem tratar comportamento concorrente como se fosse magia negra.
summary: Bug assincrono fica menos misterioso quando voce para de olhar so para o codigo e comeca a olhar para a ordem dos eventos.
guideId: async-and-race-bugs-without-drama
locale: pt-br
status: active
pillarId: debugging-and-production-thinking
branchId: async-and-race-bugs
pubDate: 2026-02-08
updatedDate: 2026-02-12
category: Debug e producao
topic: Bugs assincronos e race conditions
path:
  - Debug e producao
  - Bugs assincronos e race conditions
order: 10
relationships:
  - logs-and-observability-without-noise
tags:
  - debugging
  - async
  - race-condition
topicIds:
  - debugging-production
relatedDeckIds: []
---

## O problema

Bug assincrono assusta porque quase nunca quebra do mesmo jeito toda vez.

Funciona localmente, falha em producao, some quando voce coloca log e reaparece quando duas coisas acontecem quase juntas.

Isso faz muita gente tratar race condition como azar, quando na verdade o problema costuma ser ordem e concorrencia mal compreendidas.

## Modelo mental

Nesse tipo de bug, o ponto principal nao e so "o que o codigo faz".

E:

- em que ordem as coisas acontecem
- quem termina antes de quem
- qual estado ainda era valido naquele momento

Quando voce muda o foco de linha de codigo para linha do tempo, a investigacao melhora muito.

## Quebrando o problema

Uma forma simples de investigar esse tipo de falha e esta:

1. liste os eventos envolvidos
2. desenhe a ordem em que eles podem acontecer
3. identifique onde duas operacoes disputam o mesmo estado
4. confira que garantias faltam: cancelamento, lock, idempotencia ou validacao final

Isso transforma o bug de "aleatorio" para "condicional".

## Exemplo simples

Imagine uma busca na interface:

- o usuario digita `re`
- a requisicao A sai
- o usuario continua e digita `react`
- a requisicao B sai
- B responde antes
- depois A responde atrasada e sobrescreve o resultado certo

O problema nao e o fetch em si.

O problema e que a tela aceitou uma resposta velha como se ainda fosse a atual.

Aqui, algumas saidas possiveis seriam:

- cancelar a requisicao anterior
- ignorar resposta obsoleta
- comparar um identificador de versao antes de atualizar o estado

## Erros comuns

- tentar reproduzir sem mapear a ordem dos eventos
- corrigir com `setTimeout` ou delay artificial
- assumir que "assíncrono" significa imprevisivel
- esquecer que duas respostas validas podem chegar em ordem ruim

## Como um senior pensa

Um senior forte nao chama esse bug de flakey cedo demais.

Ele pergunta:

> Que sequencia de eventos deixa o sistema num estado invalido?

Essa pergunta puxa a conversa para causalidade, nao para supersticao.

## O que o entrevistador quer ver

Em entrevista, isso costuma mostrar maturidade rapido:

- voce entende que concorrencia muda a ordem observada
- voce sabe procurar disputa por estado compartilhado
- voce pensa em garantias, nao so em remendo

Quem faz isso bem parece alguem que consegue depurar sistema real sem dramatizar comportamento assincrono.

> Race condition nao e azar. E uma ordem ruim que seu sistema ainda nao sabe tratar.

> Se voce nao desenhou a linha do tempo, provavelmente ainda esta debugando no escuro.
