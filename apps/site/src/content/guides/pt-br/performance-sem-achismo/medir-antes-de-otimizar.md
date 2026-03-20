---
title: Medir Antes de Otimizar
description: Como evitar otimização por reflexo e tomar decisão com evidência, não com sensação.
summary: Otimização sem medida costuma gastar energia no lugar errado e ainda deixa a equipe confiante demais numa melhora que talvez nem exista.
guideId: measure-before-you-optimize
locale: pt-br
status: active
pillarId: performance-that-makes-sense
branchId: measurement-before-optimization
pubDate: 2026-02-23
updatedDate: 2026-02-27
category: Performance sem achismo
topic: Medir antes de otimizar
path:
  - Performance sem achismo
  - Medir antes de otimizar
order: 10
relationships:
  - rendering-network-and-cpu-without-mixing-them-up
tags:
  - performance
  - measurement
  - optimization
topicIds:
  - performance
relatedDeckIds: []
---

## O problema

Muita otimização nasce de desconforto, não de evidência.

A tela parece pesada, a API parece lenta, o componente parece renderizar demais.

Sem medir, tudo isso pode soar plausível e ainda assim estar errado.

## Modelo mental

Otimizar bem não é sair melhorando qualquer coisa que pareça suspeita.

É confirmar onde está o custo, quanto ele pesa e se a mudança realmente altera o resultado.

A pergunta útil aqui costuma ser:

> O que eu consigo provar sobre essa lentidão antes de mexer no código?

## Quebrando o problema

Uma forma simples de medir melhor é esta:

1. escolha um fluxo específico
2. defina qual métrica importa ali
3. capture a linha de base antes da mudança
4. compare o depois com o antes

Sem isso, “parece melhor” vira critério de decisão.

## Exemplo simples

Imagine um componente de lista que parece lento.

Uma resposta apressada seria adicionar memoização em tudo.

Uma resposta melhor seria:

- medir tempo de render
- ver quantas vezes o componente realmente re-renderiza
- comparar antes e depois da mudança

Se a métrica quase não muda, talvez a otimização tenha criado complexidade sem ganho real.

## Erros comuns

- otimizar antes de ter linha de base
- confiar só na sensação local
- comemorar micro melhora irrelevante para o usuário
- manter complexidade nova mesmo quando o ganho foi mínimo

## Como um senior pensa

Um senior forte não trata otimização como reflexo.

Ele trata como experimento.

Normalmente isso soa assim:

> Antes de mexer, eu quero medir o estado atual. Depois eu comparo para ver se a mudança realmente valeu o custo.

Essa postura protege o sistema e a equipe de complexidade inútil.

## O que o entrevistador quer ver

Em entrevista, isso costuma mostrar maturidade rápido:

- você sabe distinguir suspeita de evidência
- você pensa em métrica e impacto
- você entende que otimização também tem custo de manutenção

Quem faz isso bem parece alguém que melhora performance sem transformar o código em ritual.

> O que não foi medido costuma virar opinião com cara de engenharia.

> Se você não comparou antes e depois, ainda não sabe se otimizou ou só mexeu.
