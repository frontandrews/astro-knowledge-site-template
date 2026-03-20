---
title: Onde Esta o Gargalo
description: Como investigar lentidao sem sair otimizando tudo e sem chamar qualquer problema de performance.
summary: Performance melhora quando voce encontra o gargalo real, nao quando espalha micro-otimizacao pelo sistema.
guideId: bottleneck-detection-without-guessing
locale: pt-br
status: active
pillarId: performance-that-makes-sense
branchId: bottleneck-detection
pubDate: 2026-01-14
updatedDate: 2026-01-18
category: Performance sem achismo
topic: Onde esta o gargalo
path:
  - Performance sem achismo
  - Onde esta o gargalo
order: 10
relationships:
  - rendering-network-and-cpu-without-mixing-them-up
tags:
  - performance
  - bottlenecks
  - profiling
topicIds:
  - performance
relatedDeckIds: []
---

## O problema

Quando algo fica lento, muita gente reage otimizando o que consegue ver primeiro.

Mexe em query, memoiza componente, reduz payload, troca biblioteca, tudo ao mesmo tempo.

O problema e que lentidao raramente vem de tudo junto.

## Modelo mental

Performance ruim quase sempre tem um gargalo dominante.

Ou seja: um ponto do sistema esta segurando mais do que os outros naquele fluxo.

Pode ser:

- CPU
- rede
- banco
- renderizacao
- dependencia externa

Sem localizar esse ponto, otimizar vira loteria.

## Quebrando o problema

Uma forma simples de investigar melhor e esta:

1. escolha um fluxo lento especifico
2. meca onde o tempo esta sendo gasto
3. identifique qual etapa domina o atraso
4. mexa primeiro no ponto que mais pesa

Isso parece obvio, mas evita muita energia gasta em detalhe irrelevante.

## Exemplo simples

Imagine uma tela de dashboard que demora para abrir.

O time pode suspeitar de renderizacao porque a UI parece pesada.

Mas ao medir, descobre que:

- a API leva 1.8s
- o browser renderiza em 180ms

Aqui, discutir `memo` cedo demais so desvia a atencao.

O gargalo principal esta no dado chegando tarde, nao no componente desenhando lento.

## Erros comuns

- otimizar sem medir
- mexer em tudo ao mesmo tempo
- chamar qualquer espera de "problema de render"
- confiar em intuicao mesmo quando o fluxo pode ser observado

## Como um senior pensa

Um senior forte nao comeca a conversa por tecnica.

Ele comeca por evidência.

Normalmente isso soa assim:

> Antes de otimizar, eu quero saber qual etapa esta segurando mais esse fluxo. Sem isso, a chance de mexer no lugar errado e alta.

Essa postura costuma economizar muito tempo e muito retrabalho.

## O que o entrevistador quer ver

Em entrevista, isso costuma mostrar maturidade rapido:

- voce sabe investigar antes de otimizar
- voce entende que performance e contexto, nao reflexo
- voce melhora o sistema pelo ponto de maior impacto

Quem faz isso bem parece alguem que sabe acelerar produto sem virar refem de achismo.

> Gargalo real vale mais do que dez suspeitas elegantes.

> Se voce ainda nao mediu, talvez ainda nao saiba o que esta lento de verdade.
