---
title: Estado derivado
description: O que e estado derivado, quando ele ajuda e por que copiar valores para state costuma criar bug.
summary: Estado derivado e dado que voce consegue calcular a partir de props ou state existentes, sem guardar uma copia extra.
conceptId: derived-state
domainId: react
groupId: state
locale: pt-br
status: active
pubDate: 2026-03-19
tags:
  - react
  - estado
  - ui
relatedGuideIds:
  - state-ownership-without-confusion
---

## O que e

Estado derivado e um valor que voce consegue calcular a partir de outros valores que ja existem.

Se `visibleItems` pode ser calculado a partir de `items` e `query`, isso normalmente e estado derivado.

## Quando importa

Isso importa quando um componente comeca a espelhar props em state ou guardar duas fontes de verdade ao mesmo tempo.

E assim que varios bugs de interface começam.

## Erro comum

O erro comum e salvar uma segunda copia so porque parece mais pratico.

Depois voce precisa sincronizar os dois lados manualmente.

## Exemplo curto

Se uma tela guarda `items`, `query` e `visibleItems` no state, o terceiro valor pode ser desnecessario.

Em muitos casos, `visibleItems` deveria ser calculado durante o render.

## Por que isso ajuda

Quanto menos lugares tentam possuir a mesma verdade, mais facil fica entender o componente.

Isso reduz stale UI e update path desnecessario.
