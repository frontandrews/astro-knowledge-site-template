---
title: De Quem e Esse Estado?
description: Um jeito simples de decidir o que deve ser estado, o que pode ser derivado e o que nem deveria existir.
summary: Boa parte dos bugs de interface comeca quando voce guarda estado demais ou guarda no lugar errado.
guideId: state-ownership-without-confusion
locale: pt-br
status: active
pillarId: state-and-ui-thinking
branchId: state-ownership
pubDate: 2026-03-05
updatedDate: 2026-03-09
category: Estado e interface
topic: Estado
path:
  - Estado e interface
  - De quem e esse estado?
order: 10
relationships:
  - server-and-client-thinking-without-confusion
  - effects-without-the-mess
tags:
  - react
  - state
  - ui
topicIds:
  - react
relatedDeckIds:
  - react-rendering-core
---

## O problema

Muita interface fica confusa porque o time comeca a guardar estado antes de decidir se aquele valor realmente precisa existir como estado.

Daqui a pouco o mesmo dado aparece em dois lugares, uma tela depende da outra para continuar coerente e o bug parece "aleatorio".

Na maioria das vezes, o problema nao e React. O problema e ownership mal resolvido.

## Modelo mental

Estado bom e estado com dono claro.

Se um valor pode ser calculado a partir de outra coisa, talvez ele nao precise ser salvo de novo.

Se duas partes diferentes da interface dependem do mesmo valor, alguem precisa ser a fonte de verdade.

## Quebrando o problema

Quando voce olhar para um valor na UI, tente responder:

1. isso precisa mudar com interacao do usuario?
2. isso pode ser calculado a partir de props ou de outro estado?
3. quem deveria ser a fonte de verdade?
4. este valor precisa ser compartilhado ou pode ficar local?

Essas perguntas evitam muito estado inventado sem necessidade.

## Exemplo simples

Imagine uma lista de usuarios e um campo de busca.

Uma abordagem ruim seria guardar:

- `users`
- `search`
- `filteredUsers`

O problema e que `filteredUsers` pode ser derivado de `users` e `search`.

Uma abordagem melhor seria guardar so:

- `users`
- `search`

E calcular `filteredUsers` durante a renderizacao.

Assim voce reduz sincronizacao desnecessaria e diminui a chance de dado ficar velho.

## Erros comuns

- guardar estado que poderia ser derivado
- criar duas fontes de verdade para o mesmo valor
- subir estado cedo demais sem necessidade real
- espalhar estado compartilhado sem definir ownership

## Como um senior pensa

Um senior forte nao pergunta primeiro "onde eu coloco esse state?".

Ele pergunta:

> Esse valor realmente precisa existir como estado ou eu consigo derivar isso de outro lugar?

Essa pergunta costuma simplificar a tela antes mesmo de qualquer refactor.

## O que o entrevistador quer ver

Em entrevista, isso costuma revelar bastante maturidade:

- voce sabe diferenciar estado real de valor derivado
- voce entende fonte de verdade
- voce sabe justificar por que algo deve ser local ou compartilhado

Quem faz isso bem passa a impressao de que constrói interface com menos bug e menos atrito.

> Estado demais parece flexibilidade no comeco e manutencao ruim logo depois.

> Se voce nao sabe quem e o dono do valor, provavelmente o estado ainda nao esta bem modelado.
