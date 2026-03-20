---
title: Cache e Consistencia Sem Autoengano
description: Como pensar em cache sem agir como se leitura rapida e dado correto viessem juntos por padrao.
summary: Cache ajuda muito, mas cobra em consistencia, invalidacao e confianca no que a interface esta mostrando.
guideId: cache-and-consistency-without-self-deception
locale: pt-br
status: active
pillarId: data-and-persistence
branchId: cache-and-consistency
pubDate: 2026-01-17
updatedDate: 2026-01-19
category: Dados e armazenamento
topic: Cache e consistencia
path:
  - Dados e armazenamento
  - Cache e consistencia
order: 10
relationships:
  - sql-vs-nosql-without-slogans
tags:
  - cache
  - consistency
  - data
topicIds:
  - data-storage
relatedDeckIds: []
---

## O problema

Cache costuma entrar na conversa como se fosse melhoria gratis.

Parece que voce ganha leitura mais rapida sem perder nada no caminho.

Na pratica, cache quase sempre troca latencia por complexidade de consistencia.

## Modelo mental

Cache nao e a verdade.

Cache e uma copia util da verdade por algum tempo.

Quanto mais voce depende dela, mais precisa aceitar e controlar perguntas como:

- por quanto tempo esse dado pode ficar velho
- quem invalida essa copia
- o que acontece quando ela diverge da origem

## Quebrando o problema

Antes de colocar cache, tente responder:

1. qual leitura esta realmente lenta ou cara
2. por quanto tempo dado desatualizado ainda e aceitavel
3. quando essa copia precisa ser invalidada
4. qual e o impacto se a interface mostrar valor antigo

Essas perguntas evitam cache colocado por impulso.

## Exemplo simples

Imagine uma pagina de produto com estoque.

Fazer cache do detalhe do produto pode reduzir carga e melhorar tempo de resposta.

Mas o estoque muda rapido.

Se a copia ficar velha, o usuario pode ver "disponivel" quando ja nao existe mais item.

Aqui o ponto nao e "usar ou nao usar cache".

O ponto e decidir que parte pode tolerar atraso e que parte precisa chegar fresca.

## Erros comuns

- colocar cache antes de provar onde esta o gargalo
- agir como se invalidacao fosse detalhe pequeno
- tratar todo dado como se pudesse ficar velho do mesmo jeito
- esquecer que consistencia percebida pelo usuario tambem faz parte da qualidade

## Como um senior pensa

Um senior forte nao pergunta so "onde eu ponho cache?".

Ele pergunta:

> Que leitura precisa ficar mais barata e quanto de atraso eu posso aceitar sem mentir para o sistema ou para o usuario?

Essa pergunta muda totalmente a qualidade da decisao.

## O que o entrevistador quer ver

Em entrevista, isso costuma mostrar maturidade rapido:

- voce entende que cache e trade-off, nao bonus automatico
- voce pensa em invalidacao e tempo de vida
- voce conecta consistencia com impacto real de produto

Quem faz isso bem parece alguem que sabe otimizar sem quebrar a confianca na informacao.

> Cache acelera leitura, mas tambem cria distancia da verdade.

> Se voce nao sabe quando a copia deixa de valer, ainda nao decidiu o cache direito.
