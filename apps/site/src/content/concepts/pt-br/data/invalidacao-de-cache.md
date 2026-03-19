---
title: Invalidacao de cache
description: Por que cache fica perigoso quando o dado muda e por que velocidade sem estrategia de atualizacao costuma gerar informacao stale.
summary: Invalidacao de cache e o processo de decidir quando o dado cacheado deixou de ser seguro para servir e precisa ser atualizado ou removido.
conceptId: cache-invalidation
domainId: data
groupId: cache
locale: pt-br
status: active
pubDate: 2026-03-19
tags:
  - cache
  - dados
  - consistencia
relatedGuideIds:
  - cache-and-consistency-without-self-deception
---

## O que e

Invalidacao de cache e a forma como o sistema decide que um dado rapido ficou velho demais para continuar confiavel.

O dificil nao e adicionar cache.

O dificil e manter o cache alinhado com a realidade.

## Quando importa

Importa quando o dado muda por baixo de uma resposta, pagina, objeto ou query cacheada.

E ai que o sistema fica rapido e errado ao mesmo tempo.

## Erro comum

O erro comum e achar que TTL sozinho resolve todos os casos.

As vezes resolve, mas muitos sistemas tambem precisam de invalidacao ligada a escrita ou evento.

## Exemplo curto

Se o preco de um produto muda no banco, uma pagina cacheada ainda pode mostrar o valor antigo ate o cache expirar.

Se esse atraso nao e aceitavel, o caminho de escrita precisa invalidar ou atualizar antes.

## Por que isso ajuda

Esse conceito obriga voce a pensar em velocidade e corretude juntas.

E geralmente ai que decisao de cache comeca a ficar madura.
