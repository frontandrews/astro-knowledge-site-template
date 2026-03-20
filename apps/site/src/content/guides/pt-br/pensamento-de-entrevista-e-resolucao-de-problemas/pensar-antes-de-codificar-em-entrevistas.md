---
title: Pensar Antes de Codar em Entrevistas
description: Uma forma repetível de evitar escrever a solução errada cedo demais em entrevistas de código.
summary: Clarifique a forma do problema, valide o caminho ingênuo e só depois codifique a menor versão correta.
guideId: thinking-before-you-code-in-interviews
locale: pt-br
status: active
pillarId: problem-solving-and-interview-thinking
branchId: approach-and-framing
pubDate: 2026-03-14
updatedDate: 2026-03-18
category: Resolução de Problemas & Pensamento de Entrevista
topic: Entrevistas de Código
path:
  - Resolução de Problemas & Pensamento de Entrevista
  - Abordagem e Enquadramento
order: 10
relationships:
  - breaking-down-problems-without-panic
  - recognizing-patterns-without-memorizing-tricks
tags:
  - interviews
  - coding
  - framing
topicIds:
  - coding-interview
relatedDeckIds:
  - coding-arrays-hashmaps-basics
---

## O problema

Muita gente erra a entrevista antes mesmo de começar a escrever código.

O candidato reconhece um padrão, acelera cedo demais e responde uma pergunta parecida, mas não exatamente aquela que foi feita.

## Modelo mental

Em entrevista, pensar antes de codar não é enrolação. É como você mostra que sabe lidar com incerteza.

O modelo é simples:

- entenda o problema
- diga a menor solução correta
- só depois melhore

Isso evita que a otimização apareça antes da compreensão.

## Quebrando o problema

Uma sequência segura costuma ser esta:

1. reformule o problema com suas palavras
2. confirme entrada, saída e edge cases
3. diga a primeira solução correta
4. explique o trade-off
5. otimize só se fizer sentido

Essa ordem ajuda você a não pular etapas importantes.

## Exemplo simples

Suponha o prompt:

> Encontre o primeiro número repetido em um array.

Em vez de pular direto para `hash map`, uma resposta melhor seria:

> A versão mais simples compara cada número com os seguintes. Ela é fácil de confiar, mas custa O(n²). Se eu precisar de tempo linear, guardo os valores já vistos em um set e retorno o primeiro que aparecer pela segunda vez.

Agora o entrevistador vê raciocínio, critério e clareza. Não só uma técnica decorada.

## Erros comuns

- correr para o padrão otimizado sem provar que entendeu o problema
- esconder o raciocínio para parecer rápido
- esquecer edge cases como entrada vazia ou ausência de repetição
- explicar teoria demais e não aterrissar numa decisão

## Como um senior pensa

Um senior tende a criar confiança cedo.

Ele não tenta impressionar com velocidade. Ele mostra controle do caminho.

Isso normalmente soa assim:

> Aqui está a menor solução correta. Este é o trade-off. Se eu precisar melhorar, eu seguiria por este caminho.

## O que o entrevistador quer ver

Na prática, o entrevistador quer sinais bem simples:

- você entendeu o pedido
- você escolhe trade-offs razoáveis
- você consegue explicar por que tomou aquela decisão

Pensar antes de codar ajuda exatamente nesses três pontos.

> Em entrevista, clareza costuma valer mais do que velocidade. Primeiro prove que entendeu, depois mostre como melhoraria.

> Se você não explicou a solução mais simples primeiro, provavelmente está otimizando cedo demais.
