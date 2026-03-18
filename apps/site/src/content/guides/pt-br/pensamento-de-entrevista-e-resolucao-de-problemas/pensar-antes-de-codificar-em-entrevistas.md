---
title: Pensar Antes de Codificar em Entrevistas
description: Uma forma repetível de evitar escrever a solução errada cedo demais em entrevistas de código.
summary: Clarifique a forma do problema, valide o caminho ingênuo e só depois codifique a menor versão correta.
guideId: thinking-before-you-code-in-interviews
locale: pt-br
status: active
pillarId: problem-solving-and-interview-thinking
branchId: approach-and-framing
pubDate: 2026-03-17
category: Resolução de Problemas & Pensamento de Entrevista
topic: Entrevistas de Código
path:
  - Resolução de Problemas & Pensamento de Entrevista
  - Abordagem e Enquadramento
order: 10
relationships:
  - breaking-down-problems-without-panic
takeaways:
  - "Esclareça o prompt antes de otimizar qualquer coisa."
  - "Uma versão bruta correta normalmente é o início mais seguro."
  - "Dizer seus trade-offs em voz alta faz parte da resposta."
practiceChecklist:
  - "Reformule o problema com suas próprias palavras."
  - "Pergunte pelos edge cases que mudam a solução."
  - "Nomeie a primeira solução correta antes de melhorar."
tags:
  - interviews
  - coding
  - framing
relatedDeckIds:
  - coding-arrays-hashmaps-basics
---

Muitos erros de entrevista acontecem antes do código começar.

O candidato ouve algo familiar, assume o padrão cedo demais e escreve uma resposta rápida, mas errada.

## A sequência melhor

Use esta ordem:

1. Reformule o problema.
2. Valide entrada e edge cases.
3. Diga a ideia correta mais simples.
4. Só melhore se precisar.

Essa ordem evita que você resolva outro problema sem perceber.

## Um exemplo pequeno

Suponha o prompt:

> Encontre o primeiro número repetido em um array.

Não pule direto para hash map sem explicar por quê.

Uma resposta melhor soa assim:

> A versão bruta compara cada número com os seguintes. Ela é fácil de confiar, mas custa O(n²). Se eu quiser tempo linear, eu guardaria os valores já vistos em um set e retornaria o primeiro valor que aparecer pela segunda vez.

Agora o entrevistador enxerga seu raciocínio, não só o código final.

## Erros comuns

- pular para o padrão otimizado sem provar que entendeu o problema
- esconder o raciocínio porque quer parecer rápido
- esquecer edge cases como entrada vazia ou ausência de repetição
- explicar teoria demais e nunca pousar a resposta

## Como um senior pensa

Um senior sabe que confiança importa.

Ele cria confiança deixando o caminho visível:

> Aqui está a versão correta mais simples. Aqui está o trade-off. Aqui está por que eu melhoraria assim.

Isso é muito mais forte do que produzir uma solução “esperta” em silêncio.

## Contexto de entrevista

Normalmente o entrevistador quer sinal em três pontos:

- você entendeu o problema?
- você escolhe trade-offs sensatos?
- você consegue explicar sua decisão com clareza?

Pensar antes de codificar ajuda nos três.
